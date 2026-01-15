import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Cookie, ShieldAlert, RotateCcw, WifiOff, X } from 'lucide-react';

const SessionErrorModal = ({ isOpen, onClose, onRetry }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* Z-Index 10000 ensures it sits on top of EVERYTHING */}
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6">
        
        {/* Backdrop - High blur to hide the background mess */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          onClick={onClose} 
        />

        {/* Modal Container - Max Height & Scroll for Zoom/Mobile support */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
          className="relative w-full max-w-lg bg-white dark:bg-[#0A0A0A] rounded-2xl border border-red-500/30 shadow-2xl shadow-black/50 overflow-hidden flex flex-col max-h-[90vh]"
        >
          
          {/* --- Header Section (Fixed at top) --- */}
          <div className="bg-red-50 dark:bg-red-500/10 p-5 sm:p-6 border-b border-red-100 dark:border-red-500/20 flex gap-4 items-start shrink-0">
            <div className="p-3 bg-red-100 dark:bg-red-500/20 rounded-full text-red-600 dark:text-red-400 shrink-0">
                <ShieldAlert size={28} />
            </div>
            <div className="pr-6"> {/* Padding right for close button */}
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight">
                    Unable to Save Data
                </h2>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    Server rejected the connection. This is common on <strong>Lab PCs</strong>.
                </p>
            </div>
            <button 
                onClick={onClose} 
                className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
                <X size={20} />
            </button>
          </div>

          {/* --- Scrollable Content Body --- */}
          <div className="p-5 sm:p-6 space-y-4 overflow-y-auto custom-scrollbar">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                Troubleshooting Guide
            </p>

            {/* 1. TIME SYNC (Priority) */}
            <div className="flex gap-3 sm:gap-4 items-start p-3 sm:p-4 rounded-xl bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20">
                <Clock className="text-orange-500 shrink-0 mt-1" size={20} />
                <div className="w-full">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex flex-wrap items-center gap-2">
                        Step 1: Fix PC Time
                        <span className="px-2 py-0.5 rounded text-[10px] bg-orange-200 dark:bg-orange-500/30 text-orange-800 dark:text-orange-200 font-extrabold uppercase">Likely Cause</span>
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                        If time is off by 2 mins, login fails.
                    </p>
                    <div className="mt-2 text-[11px] sm:text-xs bg-white/50 dark:bg-black/30 p-2 rounded border border-orange-200 dark:border-orange-500/20 text-slate-700 dark:text-slate-300 font-mono break-words">
                        Right-click Time &gt; "Adjust Date/Time" &gt; "Sync Now"
                    </div>
                </div>
            </div>

            {/* 2. COOKIES */}
            <div className="flex gap-3 sm:gap-4 items-start p-3 sm:p-4 rounded-xl border border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                <Cookie className="text-blue-500 shrink-0 mt-1" size={20} />
                <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Step 2: Check Incognito
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        Incognito mode blocks storage. Use a normal Chrome window.
                    </p>
                </div>
            </div>

            {/* 3. NETWORK */}
            <div className="flex gap-3 sm:gap-4 items-start p-3 sm:p-4 rounded-xl border border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                <WifiOff className="text-slate-400 shrink-0 mt-1" size={20} />
                <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Step 3: Network Status
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        Ensure internet is connected. Try re-logging into Wi-Fi.
                    </p>
                </div>
            </div>
          </div>

          {/* --- Footer (Fixed at bottom) --- */}
          <div className="p-5 sm:p-6 bg-slate-50 dark:bg-[#0F0F0F] border-t border-slate-200 dark:border-white/5 flex flex-col-reverse sm:flex-row gap-3 justify-end items-center shrink-0">
            <button 
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-3 sm:py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            >
                I'll fix it later
            </button>
            
            <button 
                onClick={onRetry}
                className="w-full sm:w-auto px-6 py-3 sm:py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
                <RotateCcw size={18} className="animate-spin-once" /> 
                Retry Saving
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SessionErrorModal;