import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom'; // 👈 IMPORT THIS
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Clock, Cpu, Loader2, AlertTriangle } from 'lucide-react';
import { gsap } from 'gsap';

// --- 1. MAGIC PARTICLES ENGINE (Unchanged) ---
const createParticleElement = (x, y, color) => {
  const el = document.createElement('div');
  el.className = 'particle';
  el.style.cssText = `position:absolute;width:4px;height:4px;border-radius:50%;background:rgba(${color},1);box-shadow:0 0 6px rgba(${color},0.6);pointer-events:none;z-index:100;left:${x}px;top:${y}px;`;
  return el;
};

const ParticleCard = ({ children, className = '', glowColor = "26, 163, 163" }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (!cardRef.current) return;
    const interval = setInterval(() => {
        const { width, height } = cardRef.current.getBoundingClientRect();
        if(Math.random() > 0.6) { 
            const particle = createParticleElement(Math.random() * width, Math.random() * height, glowColor);
            cardRef.current.appendChild(particle);
            
            gsap.fromTo(particle, 
                { scale: 0, opacity: 0 }, 
                { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
            );
            gsap.to(particle, { 
                y: -80 - Math.random() * 50, 
                duration: 1.5 + Math.random(), 
                ease: 'power1.out', 
                onComplete: () => particle.remove() 
            });
        }
    }, 150); 
    return () => clearInterval(interval);
  }, [glowColor]);

  return <div ref={cardRef} className={`${className} relative overflow-hidden`}>{children}</div>;
};

// --- 2. TECH LOADER ---
const TechLoader = ({ percentage }) => {
  return (
    <div className="relative size-36 mx-auto mb-8 flex items-center justify-center">
       {/* Outer Ring */}
       <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-slate-200 dark:border-slate-800 border-t-[#1AA3A3] border-r-transparent opacity-50"
       />
       {/* Inner Ring */}
       <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full border-2 border-slate-100 dark:border-slate-800 border-b-[#1AA3A3] border-l-transparent"
       />

       {/* SVG Progress */}
       <svg className="absolute inset-0 size-full -rotate-90 drop-shadow-[0_0_15px_rgba(26,163,163,0.4)]" viewBox="0 0 100 100">
           <circle cx="50" cy="50" r="40" fill="none" stroke="#334155" strokeWidth="4" strokeOpacity="0.2" />
           <motion.circle 
              cx="50" cy="50" r="40" 
              fill="none" 
              stroke="#1AA3A3" 
              strokeWidth="4" 
              strokeLinecap="round" 
              strokeDasharray="251.2" 
              strokeDashoffset={251.2 - (251.2 * percentage) / 100} 
              initial={{ strokeDashoffset: 251.2 }} 
              animate={{ strokeDashoffset: 251.2 - (251.2 * percentage) / 100 }} 
              transition={{ type: "spring", stiffness: 50, damping: 15 }} 
           />
       </svg>

       <div className="flex flex-col items-center z-10">
           <span className="text-4xl font-black text-slate-800 dark:text-white tabular-nums tracking-tighter">
              {Math.round(percentage)}<span className="text-lg text-[#1AA3A3]">%</span>
           </span>
           <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">Processing</span>
       </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const ProcessingOverlay = ({ status }) => {
  const [displayPercent, setDisplayPercent] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [displayTime, setDisplayTime] = useState(status.timeLeft || 0);

  // Smooth Percentage Logic
  useEffect(() => {
    let target = 0;
    if (status.total > 0) target = Math.round(((status.current - 1) / status.total) * 100);
    target = Math.max(target, 5); 
    if (status.current >= status.total && status.total > 0) target = 100;

    const interval = setInterval(() => {
        setDisplayPercent(prev => {
            if (prev >= target) return prev;
            const jump = Math.ceil((target - prev) / 10); 
            return prev + jump;
        });
    }, 50);
    return () => clearInterval(interval);
  }, [status.current, status.total]);

  // Steps Logic
  const STEPS = ["Initializing Engine...", "Parsing Document...", "Injecting Data...", "Formatting Layout...", "Finalizing PDF..."];
  useEffect(() => {
    const stepInterval = setInterval(() => {
        setCurrentStepIndex(prev => (prev + 1) % STEPS.length);
    }, 1500);
    return () => clearInterval(stepInterval);
  }, []);

  // Timer Logic
  useEffect(() => {
    if (status.timeLeft > 0) {
        if (Math.abs(status.timeLeft - displayTime) > 5) setDisplayTime(status.timeLeft);
    }
    const timer = setInterval(() => {
        setDisplayTime(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [status.timeLeft]);

  // 🔴 PORTAL LOGIC: Renders this directly into body, bypassing parent CSS
  return createPortal(
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-white/90 dark:bg-[#050505]/95 backdrop-blur-3xl flex flex-col items-center justify-center p-4 cursor-wait"
    >
      <ParticleCard 
        className="w-full max-w-sm bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-[40px] shadow-2xl p-8 pb-6 text-center relative overflow-hidden ring-1 ring-white/10"
        glowColor="26, 163, 163"
      >
         {/* Top Gradient Line */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1.5 bg-gradient-to-r from-transparent via-[#1AA3A3] to-transparent opacity-80 blur-md rounded-b-full" />
         
         {/* 1. LOADER */}
         <TechLoader percentage={displayPercent} />

         {/* 2. HEADER */}
         <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2 mb-2">
               Generating Docs <Cpu size={18} className="text-[#1AA3A3] animate-pulse" />
            </h3>
            <div className="h-6 flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.p 
                        key={currentStepIndex} 
                        initial={{ y: 20, opacity: 0 }} 
                        animate={{ y: 0, opacity: 1 }} 
                        exit={{ y: -20, opacity: 0 }} 
                        className="text-xs font-mono text-[#1AA3A3] uppercase tracking-widest font-bold"
                    >
                        {STEPS[currentStepIndex]}
                    </motion.p>
                </AnimatePresence>
            </div>
         </div>

         {/* 3. CURRENT ITEM CARD */}
         <div className="bg-slate-50 dark:bg-[#1a1a1a] rounded-2xl p-3 mb-6 border border-slate-200 dark:border-slate-800 flex items-center gap-4 text-left shadow-sm relative overflow-hidden">
            {/* Animated Gradient Background inside card */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] animate-shimmer" />
            
            <div className="relative shrink-0">
                <div className="relative size-12 rounded-full p-0.5 border border-[#1AA3A3] bg-white dark:bg-black">
                     <img 
                        src={status.img || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                        alt={status.name} 
                        className="w-full h-full rounded-full object-cover" 
                     />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-[#1AA3A3] border-2 border-white dark:border-[#151515] p-1 rounded-full shadow-sm">
                    <Loader2 size={8} className="animate-spin text-white" />
                </div>
            </div>
            
            <div className="flex-1 min-w-0 z-10">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Processing</p>
                <h4 className="text-sm font-bold text-slate-800 dark:text-white truncate">
                    {status.name}
                </h4>
            </div>
         </div>

         {/* 4. STATS GRID */}
         <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-slate-50 dark:bg-[#1a1a1a] rounded-xl p-3 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center">
               <span className="text-[9px] text-slate-400 font-bold uppercase mb-1">Count</span>
               <span className="text-base font-black text-slate-700 dark:text-slate-200 flex items-center gap-1">
                  <FileText size={14} className="text-[#1AA3A3]" /> 
                  {status.current} <span className="text-slate-400 font-medium">/ {status.total}</span>
               </span>
            </div>
            <div className="bg-slate-50 dark:bg-[#1a1a1a] rounded-xl p-3 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center">
               <span className="text-[9px] text-slate-400 font-bold uppercase mb-1">Est. Time</span>
               <span className="text-base font-black text-slate-700 dark:text-slate-200 flex items-center gap-1 font-mono tabular-nums">
                  <Clock size={14} className="text-orange-500" /> 
                  {displayTime}s
               </span>
            </div>
         </div>

         {/* 5. WARNING MESSAGE (High Contrast) */}
         <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 rounded-xl p-3 flex items-center justify-center gap-2 animate-pulse">
            <AlertTriangle size={16} className="text-amber-600 dark:text-amber-500" />
            <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
               Do not close window
            </p>
         </div>

      </ParticleCard>
    </motion.div>,
    document.body // 👈 Renders outside root div
  );
};

export default ProcessingOverlay;