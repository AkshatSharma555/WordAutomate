import React from 'react';
import { Settings, Users, Compass, Sparkles, Loader2, Rocket } from 'lucide-react';

const StepFeatures = ({ onSubmit, isSubmitting }) => {
  return (
    <div className="flex flex-col h-full gap-5">
        
        {/* --- HERO SECTION --- */}
        <div className="text-center space-y-1">
            <div className="mx-auto size-12 bg-gradient-to-br from-[#1AA3A3] to-[#148f8f] rounded-2xl flex items-center justify-center shadow-lg shadow-[#1AA3A3]/20 mb-3">
                <Sparkles className="text-white" size={24} />
            </div>
            <h3 className="text-lg font-black text-slate-800 dark:text-white">
                Power Features ⚡
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
                You're all set! Here is what else you can do.
            </p>
        </div>

        {/* --- FEATURES LIST --- */}
        <div className="flex-1 space-y-3 overflow-y-auto pr-1 scrollbar-thin">
            
            {/* Feature 1: Settings */}
            <div className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 p-3.5 rounded-xl flex gap-3 items-start group hover:border-[#1AA3A3]/30 transition-colors">
                <div className="p-2 bg-white dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 shadow-sm shrink-0 group-hover:text-[#1AA3A3]">
                    <Settings size={18} />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white">Update Profile Anytime</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                        Made a mistake? Visit <span className="font-semibold text-slate-700 dark:text-slate-200">Settings</span> to edit your Name, PRN, or Branch details later.
                    </p>
                </div>
            </div>

            {/* Feature 2: Friendship Rule */}
            <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 p-3.5 rounded-xl flex gap-3 items-start group">
                <div className="p-2 bg-white dark:bg-indigo-900/40 rounded-lg text-indigo-600 dark:text-indigo-400 shadow-sm shrink-0">
                    <Users size={18} />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white">Connect to Share</h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug mt-0.5">
                        Security First: You must be <span className="font-bold text-indigo-600 dark:text-indigo-400">Friends</span> with someone to share or receive documents.
                    </p>
                </div>
            </div>

            {/* Feature 3: Explore */}
            <div className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 p-3.5 rounded-xl flex gap-3 items-start group hover:border-[#1AA3A3]/30 transition-colors">
                <div className="p-2 bg-white dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 shadow-sm shrink-0 group-hover:text-[#1AA3A3]">
                    <Compass size={18} />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white">Find Classmates</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                        Use the <span className="font-semibold text-slate-700 dark:text-slate-200">Explore</span> page with Branch & Year filters to find your batchmates easily.
                    </p>
                </div>
            </div>

        </div>

        {/* --- ACTION BUTTON --- */}
        <div className="pt-2 mt-auto">
            <button 
                onClick={onSubmit}
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-[#1AA3A3] to-[#148f8f] hover:from-[#178a8a] hover:to-[#127a7a] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#1AA3A3]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:grayscale"
            >
                {isSubmitting ? (
                    <> <Loader2 size={18} className="animate-spin" /> Preparing Dashboard... </>
                ) : (
                    <> Launch Dashboard <Rocket size={16} className="text-white/80" /> </>
                )}
            </button>
        </div>
    </div>
  );
};

export default StepFeatures;