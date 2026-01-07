import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const WizardLayout = ({ title, subtitle, currentStep, totalSteps, children, isExiting }) => {
  return (
    <div className={`fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 font-sans transition-all duration-700 ${isExiting ? 'pointer-events-none' : ''}`}>
       
       {/* 1. Backdrop - REDUCED BLUR (md) & Transparency for better visibility */}
       <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: isExiting ? 0 : 1 }}
           transition={{ duration: 0.6 }} // Faster fade out
           className="absolute inset-0 bg-[#F3F2ED]/60 dark:bg-black/80 backdrop-blur-md z-0" 
       />

       {/* 2. The Modal Card - Smoke Animation */}
       <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={isExiting 
                ? { 
                    opacity: 0, 
                    scale: 1.15,      // Thoda aur bada hoga udte waqt
                    y: -120,          // Upar tezi se jayega
                    filter: "blur(12px)" // Smoke blur
                  } 
                : { 
                    opacity: 1, 
                    scale: 1, 
                    y: 0, 
                    filter: "blur(0px)" 
                  }
            }
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }} // Custom easing for "Smoke" feel
            className="w-full max-w-[480px] max-h-[90dvh] flex flex-col bg-white dark:bg-[#111111] border border-white/20 dark:border-slate-800 shadow-2xl rounded-[28px] relative z-10 overflow-hidden"
       >
            {/* --- HEADER --- */}
            <div className="relative h-28 shrink-0 flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#1AA3A3] to-[#137a7a]">
                
                {/* Texture */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                
                {/* Background Glow */}
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>

                <div className="text-center z-10 px-6 relative top-1">
                    <div className="flex items-center justify-center gap-1.5 mb-2 opacity-90">
                         <Sparkles className="text-[#F3F2ED]" size={14} />
                         <span className="text-[10px] font-bold text-[#F3F2ED] uppercase tracking-[0.2em]">Welcome to WordAutomate</span>
                    </div>
                    
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-sm">
                        {title}
                    </h2>
                    
                    <p className="text-teal-50 text-xs sm:text-sm mt-1 font-medium max-w-[280px] mx-auto leading-snug opacity-90">
                        {subtitle}
                    </p>
                </div>
            </div>

            {/* --- PROGRESS BAR --- */}
            <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 shrink-0">
                <motion.div 
                    className="h-full bg-[#F54A00] shadow-[0_0_12px_rgba(245,74,0,0.6)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
            </div>

            {/* --- CONTENT --- */}
            <div className="flex-1 overflow-y-auto scrollbar-hide p-6 sm:p-8 flex flex-col bg-white dark:bg-[#111111]">
                {children}
            </div>

       </motion.div>
    </div>
  );
};

export default WizardLayout;