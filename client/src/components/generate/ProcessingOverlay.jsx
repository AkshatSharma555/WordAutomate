import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Clock, Cpu, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import ProcessingLogo from './ProcessingLogo';

// --- ✨ MAGIC BENTO PARTICLES (No Changes) ---
const MagicParticles = React.memo(() => {
  const particles = useMemo(() => Array.from({ length: 35 }), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 rounded-[28px]">
      {particles.map((_, i) => {
        const isTeal = i % 2 === 0;
        const size = Math.random() * 6 + 3;
        const leftPos = Math.random() * 100;
        const duration = Math.random() * 15 + 10;
        const delay = -(Math.random() * 20); 

        return (
          <motion.div
            key={i}
            initial={{ top: "110%", opacity: 0 }} 
            animate={{ 
              top: "-20%", 
              opacity: [0, 0.8, 0], 
            }}
            transition={{ 
              duration: duration, 
              repeat: Infinity, 
              delay: delay, 
              ease: "linear" 
            }}
            className={`absolute rounded-full ${isTeal ? 'bg-[#1AA3A3]' : 'bg-[#F54A00]'}`}
            style={{
              left: `${leftPos}%`,
              width: `${size}px`,
              height: `${size}px`,
              boxShadow: isTeal ? "0 0 12px #1AA3A3" : "0 0 12px #F54A00",
            }}
          />
        );
      })}
    </div>
  );
});

// --- TECH LOADER (No Changes) ---
const TechLoader = ({ percentage }) => {
  return (
    <div className="relative w-full h-[190px] flex items-center justify-center">
       <div className="relative w-[190px] h-[190px] flex items-center justify-center">
           {/* 3D CORE */}
           <div className="absolute inset-0 z-0 flex items-center justify-center"> 
               <div className="w-full h-full p-7"> 
                   <ProcessingLogo />
               </div>
           </div>

           {/* Rotating Outer Ring */}
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
             className="absolute inset-0 rounded-full border border-dashed border-slate-300 dark:border-slate-700 opacity-50 pointer-events-none"
           />
           
           {/* Inner Static Ring */}
           <div className="absolute inset-4 rounded-full border border-slate-300 dark:border-slate-700 opacity-30 pointer-events-none" />

           {/* PROGRESS SVG */}
           <svg className="absolute inset-0 size-full -rotate-90 z-10 drop-shadow-md" viewBox="0 0 100 100">
               <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-200 dark:text-white/10" />
               <motion.circle 
                 cx="50" cy="50" r="46" fill="none" stroke="#1AA3A3" strokeWidth="5" strokeLinecap="round" strokeDasharray="289" 
                 strokeDashoffset={289 - (289 * percentage) / 100} 
                 animate={{ strokeDashoffset: 289 - (289 * percentage) / 100 }} 
                 transition={{ duration: 0.1, ease: "linear" }} 
               />
           </svg>

           {/* PERCENTAGE TEXT */}
           <div className="flex flex-col items-center justify-center z-20 pointer-events-none">
               <div className="absolute size-24 bg-white/70 dark:bg-black/70 backdrop-blur-md rounded-full -z-10 shadow-sm border border-white/20" />
               <span className="text-4xl font-black text-slate-800 dark:text-white tabular-nums tracking-tighter drop-shadow-sm leading-none z-20">
                  {Math.floor(percentage)}<span className="text-[0.5em] text-[#1AA3A3]">%</span>
               </span>
           </div>
       </div>
    </div>
  );
};

// --- ✨ UPDATED SUCCESS SCREEN (Feedback added) ---
const SuccessScreen = () => (
    <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="flex flex-col items-center justify-center text-center h-full font-sans relative z-10"
    >
        <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }} 
            className="size-20 rounded-full bg-green-500 flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.5)] mb-4"
        >
            <CheckCircle size={40} className="text-white" strokeWidth={3} />
        </motion.div>
        
        <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">Success!</h2>
        
        {/* 👇 Changed Text & Added Spinner for user patience */}
        <div className="flex items-center gap-2 mt-1">
            <Loader2 size={16} className="text-[#1AA3A3] animate-spin" />
            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">
                Preparing share options...
            </p>
        </div>
    </motion.div>
);

// --- MAIN OVERLAY ---
const ProcessingOverlay = ({ status }) => {
  const [displayPercent, setDisplayPercent] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const TIME_PER_ITEM = 4;
  const UPDATE_INTERVAL = 50; 
  const totalDurationSec = status.total * TIME_PER_ITEM;

  useEffect(() => {
    let targetPercent = 0;
    if (status.current > status.total) targetPercent = 100;
    else targetPercent = (status.current / status.total) * 100;

    const interval = setInterval(() => {
        setDisplayPercent(prev => {
            if (prev >= 100) {
                clearInterval(interval);
                // 👇 Reduced delay from 500ms to 200ms for snappier feel
                setTimeout(() => setIsCompleted(true), 200);
                return 100;
            }
            if (prev >= targetPercent && targetPercent < 100) return prev; 
            
            let step = 0.25;
            if (targetPercent - prev > 25) step = 1.0; 
            else if (targetPercent - prev > 10) step = 0.5;
            if (targetPercent === 100) step = 1.5;

            return Math.min(prev + step, 100);
        });
    }, UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [status.current, status.total]);

  const STEPS = ["Initializing...", "Spinning Core...", "Parsing Data...", "Formatting...", "Finalizing..."];
  useEffect(() => {
    const stepInterval = setInterval(() => setCurrentStepIndex(prev => (prev + 1) % STEPS.length), 1800);
    return () => clearInterval(stepInterval);
  }, []);

  const displayTime = Math.max(0, Math.ceil(totalDurationSec * (1 - displayPercent / 100)));

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex flex-col bg-[#F3F2ED]/95 dark:bg-[#050505]/95 backdrop-blur-xl overflow-hidden p-4 rounded-[28px] font-sans"
    >
        {/* STATIC GRADIENTS */}
        <div className="absolute top-[-50%] left-[-50%] w-[100%] h-[100%] bg-[#1AA3A3] opacity-5 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-50%] right-[-50%] w-[100%] h-[100%] bg-[#F54A00] opacity-5 blur-[80px] rounded-full pointer-events-none" />

        {/* MAGIC PARTICLES */}
        <MagicParticles />

        <div className="relative z-10 w-full h-full max-w-sm mx-auto flex flex-col">
            <AnimatePresence mode="wait">
                {isCompleted ? <SuccessScreen key="success" /> : (
                    <motion.div 
                        key="processing" 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }} 
                        transition={{ duration: 0.4 }}
                        className="w-full h-full grid grid-rows-[auto_1fr_auto] gap-2"
                    >
                        {/* HEADER */}
                        <div className="text-center shrink-0 mt-1">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2 mb-1 leading-tight">
                                Generating <Cpu size={18} className="text-[#F54A00] animate-pulse" />
                            </h3>
                            <div className="h-5 flex items-center justify-center overflow-hidden">
                                <AnimatePresence mode="wait">
                                    <motion.p 
                                        key={currentStepIndex} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} 
                                        className="text-[10px] font-mono text-[#1AA3A3] uppercase tracking-widest font-bold"
                                    >
                                        {STEPS[currentStepIndex]}
                                    </motion.p>
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* LOADER */}
                        <div className="w-full h-full min-h-0 flex items-center justify-center">
                            <TechLoader percentage={displayPercent} />
                        </div>

                        {/* FOOTER STATS */}
                        <div className="shrink-0 space-y-2 mb-1">
                            <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md rounded-xl p-2 border border-slate-200/60 dark:border-white/10 flex items-center gap-3 shadow-sm">
                                <div className="relative size-7 shrink-0 rounded-full bg-white dark:bg-black p-0.5 border border-[#1AA3A3]">
                                    <img src={status.img || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="" className="w-full h-full rounded-full object-cover" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-0.5 leading-none">Processing</p>
                                    <h4 className="text-xs font-bold text-slate-800 dark:text-white truncate leading-tight">{status.name}</h4>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md rounded-xl p-2 border border-slate-200/60 dark:border-white/10 flex flex-col items-center shadow-sm">
                                    <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase mb-0.5 leading-none">Progress</span>
                                    <span className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1 leading-tight">
                                        <FileText size={12} className="text-[#1AA3A3]" /> {status.current}/{status.total}
                                    </span>
                                </div>
                                <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md rounded-xl p-2 border border-slate-200/60 dark:border-white/10 flex flex-col items-center shadow-sm">
                                    <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase mb-0.5 leading-none">Time Left</span>
                                    <span className="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1 font-mono tabular-nums leading-tight">
                                        <Clock size={12} className="text-orange-500" /> {displayTime}s
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-center gap-1.5 px-2 py-1 bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/20 rounded-full">
                                <AlertTriangle size={10} className="text-amber-600 dark:text-amber-500" />
                                <p className="text-[8px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide leading-none">Do not close window</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    </motion.div>
  );
};

export default ProcessingOverlay;