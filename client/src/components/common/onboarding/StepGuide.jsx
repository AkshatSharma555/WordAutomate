import React from 'react';
import { FileText, Check, ArrowRight, MessageSquareQuote } from 'lucide-react';

// 👇 Props updated: 'onSubmit' hata kar 'onNext' lagaya hai
const StepGuide = ({ onNext, userName }) => {
  return (
    <div className="flex flex-col md:flex-row h-full gap-6 items-stretch">
        
        {/* --- LEFT: VISUALIZER (The Paper) --- */}
        <div className="flex-1 bg-slate-100 dark:bg-white/5 rounded-2xl p-4 border border-slate-200 dark:border-white/10 flex items-center justify-center relative overflow-hidden group min-h-[220px]">
             
             {/* The Paper */}
             <div className="w-full max-w-[240px] aspect-[1/1.3] bg-white shadow-xl shadow-slate-300/40 text-[8px] text-slate-800 p-5 font-serif relative overflow-hidden flex flex-col">
                 
                 {/* 1. SIES Watermark (Blurred Background) */}
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                    <span className="text-4xl font-black text-slate-100 -rotate-45 tracking-widest scale-150 blur-[1px]">
                        SIES GST
                    </span>
                 </div>

                 {/* 2. Header Row */}
                 <div className="flex justify-between text-[6px] text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 relative z-10 mb-4">
                    <span>IT Dept</span>
                    <span>SIES GST</span>
                    <span>Python Lab</span>
                 </div>

                 {/* 3. Main Content */}
                 <div className="text-center relative z-10 space-y-4">
                    <h1 className="font-bold text-xs tracking-wide text-slate-900 uppercase underline decoration-slate-300 underline-offset-2">
                        Experiment No. 1
                    </h1>
                    
                    {/* The Critical Line */}
                    <div className="bg-slate-50 border border-slate-200 px-2 py-2 rounded-md inline-block shadow-sm">
                        <p className="font-medium text-slate-700 text-[9px] whitespace-nowrap">
                            Name: <span className="font-mono font-bold text-[#F54A00] bg-[#F54A00]/10 px-1 rounded">{`{name}`}</span> &nbsp;|&nbsp; 
                            PRN: <span className="font-mono font-bold text-[#1AA3A3] bg-[#1AA3A3]/10 px-1 rounded">{`{prn}`}</span>
                        </p>
                    </div>

                    {/* 4. The "Format Freedom" Note */}
                    <div className="mt-4 relative bg-yellow-50 border border-yellow-100 p-2 rounded-lg -rotate-1 shadow-sm text-left">
                        <div className="flex gap-1.5 items-start">
                            <MessageSquareQuote size={10} className="text-yellow-600 mt-0.5 shrink-0" />
                            <p className="text-[7px] leading-relaxed text-slate-600 font-sans">
                                <strong className="text-yellow-700 block mb-0.5">Note:</strong>
                                Put any text, tables, or images you want! Just ensure <span className="font-bold text-[#F54A00]">{`{}`}</span> placeholders are present.
                            </p>
                        </div>
                        {/* Little Arrow pointing up */}
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-yellow-50 border-t border-l border-yellow-100 rotate-45"></div>
                    </div>
                 </div>

                 {/* Bottom Gradient Line */}
                 <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1AA3A3] to-[#F54A00]"></div>
             </div>
        </div>

        {/* --- RIGHT: INSTRUCTIONS & ACTIONS --- */}
        <div className="flex-1 flex flex-col justify-center gap-4">
             
             {/* Info Cards */}
             <div className="space-y-3">
                <div className="flex gap-3 items-start p-3 bg-white dark:bg-[#1a1a1a] rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm transition-transform hover:scale-[1.02]">
                    <div className="mt-0.5 p-1.5 bg-[#1AA3A3]/10 rounded-full text-[#1AA3A3] shrink-0">
                        <FileText size={14} />
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                        <span className="block text-slate-900 dark:text-white font-bold mb-0.5">Placeholders Only</span>
                        Type <span className="font-mono text-[#F54A00] font-bold">{`{name}`}</span> & <span className="font-mono text-[#1AA3A3] font-bold">{`{prn}`}</span> inside Word. Rest of the format is 100% yours.
                    </div>
                </div>

                <div className="flex gap-3 items-start p-3 bg-white dark:bg-[#1a1a1a] rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm transition-transform hover:scale-[1.02]">
                    <div className="mt-0.5 p-1.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-full text-indigo-500 shrink-0">
                        <Check size={14} />
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                        <span className="block text-slate-900 dark:text-white font-bold mb-0.5">Auto Renaming</span>
                        We auto-name: <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-1 rounded break-all">Lab_{userName ? userName.split(' ')[0] : 'User'}_PRN.pdf</span>
                    </div>
                </div>
             </div>

             {/* Action Button - Changed to Next Step */}
             <div className="pt-2 mt-auto md:mt-0">
                <button 
                    onClick={onNext}
                    className="w-full py-3.5 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-black text-sm font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    Next Step <ArrowRight size={16} />
                </button>
             </div>
        </div>
    </div>
  );
};

export default StepGuide;