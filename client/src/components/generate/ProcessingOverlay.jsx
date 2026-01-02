import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, FileText, Clock, Sparkles, Zap, CheckCircle2 } from 'lucide-react';
import { gsap } from 'gsap';

// --- PARTICLE EFFECT ---
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
        if(Math.random() > 0.7) {
            const particle = createParticleElement(Math.random() * width, Math.random() * height, glowColor);
            cardRef.current.appendChild(particle);
            
            gsap.fromTo(particle, 
                { scale: 0, opacity: 0 }, 
                { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
            );
            gsap.to(particle, { 
                y: -100, 
                duration: 2 + Math.random(), 
                ease: 'none', 
                onComplete: () => particle.remove() 
            });
        }
    }, 200); 

    return () => clearInterval(interval);
  }, [glowColor]);

  return <div ref={cardRef} className={`${className} relative overflow-hidden`}>{children}</div>;
};

const PROCESS_STEPS = [
    "Reading Template...",
    "Injecting Data...",
    "Formatting...",
    "Converting to PDF...",
    "Verifying...",
    "Done!"
];

const ProcessingOverlay = ({ status }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [displayTime, setDisplayTime] = useState(status.timeLeft || 0);
  
  // Calculate Percentage
  // Using status.current/total gives rough percentage. 
  // We can interpolate it for smoother visual if needed, but this is accurate to batch progress.
  const percentage = Math.min(Math.round(((status.current - 1) / status.total) * 100) + 10, 100); 

  useEffect(() => {
    const stepInterval = setInterval(() => {
        setCurrentStepIndex((prev) => (prev + 1) % PROCESS_STEPS.length);
    }, 1200);
    return () => clearInterval(stepInterval);
  }, []);

  // Reverse Timer Logic
  useEffect(() => {
    // If the new status time is significantly different (e.g., new batch item started), sync it.
    if (status.timeLeft > displayTime && status.timeLeft > 0) {
        setDisplayTime(status.timeLeft);
    }

    const timerInterval = setInterval(() => {
        setDisplayTime((prev) => {
            if (prev <= 0) return 0;
            return prev - 1;
        });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [status.timeLeft]); // Depend on status updates to reset/sync

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 bg-white/90 dark:bg-[#050505]/95 backdrop-blur-xl flex flex-col items-center justify-center p-4"
    >
      <ParticleCard 
        className="w-full max-w-sm bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-[32px] shadow-2xl p-8 text-center relative"
        glowColor="26, 163, 163"
      >
         {/* Background Glow */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-[#1AA3A3] to-transparent opacity-50 blur-sm" />

         {/* 1. CIRCULAR PROGRESS RING */}
         <div className="relative size-24 mx-auto mb-6">
            <svg className="size-full -rotate-90" viewBox="0 0 36 36">
              {/* Background Track */}
              <path className="text-slate-100 dark:text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2.5" />
              
              {/* Animated Progress Path */}
              <motion.path 
                className="text-[#1AA3A3]"
                strokeDasharray={`${percentage}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ strokeDasharray: "0, 100" }}
                animate={{ strokeDasharray: `${percentage}, 100` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </svg>
            
            {/* Center Content: Percentage or Loader */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
               <span className="text-xl font-bold text-slate-800 dark:text-white">
                   {percentage}%
               </span>
            </div>
         </div>

         {/* 2. HEADER */}
         <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center justify-center gap-2">
            Generating... <Sparkles size={16} className="text-amber-400 animate-pulse fill-amber-400" />
         </h3>

         {/* 3. ACTIVE USER CARD */}
         <div className="bg-slate-50 dark:bg-[#1a1a1a] rounded-2xl p-4 mb-6 border border-slate-100 dark:border-slate-800 relative overflow-hidden h-[110px] flex flex-col justify-center items-center shadow-inner">
            
            <AnimatePresence mode="wait">
                <motion.div
                    key={status.name} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center"
                >
                    <div className="size-12 rounded-full p-0.5 border-2 border-[#1AA3A3] mb-2 shadow-lg shadow-[#1AA3A3]/20">
                        <img 
                            src={status.img} 
                            alt={status.name} 
                            className="w-full h-full rounded-full object-cover bg-slate-200"
                        />
                    </div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                        {status.name}
                    </p>
                </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-center gap-1.5 mt-1">
                <Zap size={10} className="text-[#1AA3A3]" />
                <AnimatePresence mode='wait'>
                    <motion.p 
                        key={currentStepIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-[10px] font-mono text-[#1AA3A3] uppercase tracking-wide"
                    >
                        {PROCESS_STEPS[currentStepIndex]}
                    </motion.p>
                </AnimatePresence>
            </div>
         </div>

         {/* 4. FOOTER STATS */}
         <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-[#1a1a1a] rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="flex flex-col items-start">
               <span className="text-[10px] text-slate-400 font-bold uppercase">Batch Progress</span>
               <span className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                  <FileText size={14} /> {status.current} <span className="text-slate-400">/</span> {status.total}
               </span>
            </div>
            
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

            <div className="flex flex-col items-end">
               <span className="text-[10px] text-slate-400 font-bold uppercase">Est. Time</span>
               <span className="text-sm font-bold text-orange-500 flex items-center gap-1 font-mono tabular-nums">
                  <Clock size={14} /> {displayTime}s
               </span>
            </div>
         </div>
      </ParticleCard>
    </motion.div>
  );
};

export default ProcessingOverlay;