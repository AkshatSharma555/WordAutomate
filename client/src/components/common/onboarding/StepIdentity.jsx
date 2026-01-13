import React from 'react';
import { User, FileBadge, ShieldAlert, CheckCircle2, AlertCircle, Pencil } from 'lucide-react';

const StepIdentity = ({ formData, errors, onChange, onNext, onSkip }) => {
  
  const name = formData.name;
  const nameError = errors.name;
  const prn = formData.prn;
  const prnError = errors.prn;

  const isFormValid = name && !nameError && prn && !prnError;

  return (
    // ✅ Layout: Standard flow (No h-full/mt-auto issues)
    <div className="flex flex-col gap-6 pb-2"> 
        
        {/* Info Box */}
        <div className="bg-[#F54A00]/5 dark:bg-[#F54A00]/10 border border-[#F54A00]/20 p-4 rounded-2xl flex gap-3 shrink-0">
            <div className="p-2 bg-[#F54A00]/10 dark:bg-[#F54A00]/20 rounded-full h-fit text-[#F54A00] shrink-0">
                <ShieldAlert size={18} />
            </div>
            <div className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                <strong className="block mb-1 text-sm text-[#F54A00]">Critical Information</strong>
                This Name and PRN will be <strong>permanently printed</strong> on all documents. Ensure 100% accuracy.
            </div>
        </div>

        {/* Inputs Container */}
        <div className="space-y-6 px-1">
            
            {/* 1. NAME INPUT (Premium Style from Settings) */}
            <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Full Name</label>
                    
                    {/* ✅ STATUS BADGES */}
                    {name && !nameError ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-[#1AA3A3] bg-[#1AA3A3]/10 px-2 py-0.5 rounded-full">
                            <CheckCircle2 size={12} /> Verified
                        </span>
                    ) : nameError ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full animate-pulse">
                            <AlertCircle size={12} /> Check Format
                        </span>
                    ) : null}
                </div>
                
                <div className="relative group">
                    {/* Dynamic Icon Color */}
                    <User className={`absolute left-3.5 top-3.5 size-[18px] transition-colors ${nameError ? "text-red-400" : (!nameError && name) ? "text-[#1AA3A3]" : "text-slate-400"}`} />
                    
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => onChange('name', e.target.value)} 
                        // 🔥 Premium Border Logic (Copied from PersonalInfoSection)
                        className={`w-full pl-10 pr-10 py-3 bg-white dark:bg-[#1a1a1a] border rounded-xl font-medium focus:outline-none focus:ring-2 transition-all duration-200 
                            ${nameError 
                                ? "border-red-200 focus:border-red-400 focus:ring-red-100 dark:border-red-900/50 text-slate-700 dark:text-slate-200" 
                                : (!nameError && name)
                                    ? "border-[#1AA3A3]/50 focus:border-[#1AA3A3] focus:ring-[#1AA3A3]/10 text-slate-700 dark:text-slate-200"
                                    : "border-slate-200 dark:border-slate-700 focus:border-[#1AA3A3] focus:ring-[#1AA3A3]/10 text-slate-700 dark:text-slate-200"
                            }`} 
                        placeholder="e.g. Akshat Sharma" 
                    />
                    
                    <div className="absolute right-3.5 top-3.5 pointer-events-none">
                        <Pencil size={16} className={`transition-colors ${nameError ? "text-red-300" : "text-slate-300 group-hover:text-[#1AA3A3]"}`} />
                    </div>
                </div>
                {nameError && <p className="text-xs text-red-500 font-medium ml-1">{nameError}</p>}
            </div>

            {/* 2. PRN INPUT (Premium Style from Settings) */}
            <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">PRN Number</label>
                    
                    {/* ✅ STATUS BADGES */}
                    {prn && !prnError ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-[#1AA3A3] bg-[#1AA3A3]/10 px-2 py-0.5 rounded-full">
                            <CheckCircle2 size={12} /> Valid
                        </span>
                    ) : prnError ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full animate-pulse">
                            <AlertCircle size={12} /> Invalid
                        </span>
                    ) : null}
                </div>

                <div className="relative group">
                    {/* Dynamic Icon Color */}
                    <FileBadge className={`absolute left-3.5 top-3.5 size-[18px] transition-colors ${prnError ? "text-red-400" : (!prnError && prn) ? "text-[#1AA3A3]" : "text-slate-400"}`} />
                    
                    <input 
                        type="text" 
                        value={prn} 
                        onChange={(e) => onChange('prn', e.target.value)} 
                        maxLength={16} 
                        // 🔥 Premium Border Logic
                        className={`w-full pl-10 pr-10 py-3 bg-white dark:bg-[#1a1a1a] border rounded-xl font-medium focus:outline-none focus:ring-2 transition-all duration-200 uppercase tracking-widest
                            ${prnError 
                                ? "border-red-200 focus:border-red-400 focus:ring-red-100 dark:border-red-900/50 text-slate-700 dark:text-slate-200" 
                                : (!prnError && prn)
                                    ? "border-[#1AA3A3]/50 focus:border-[#1AA3A3] focus:ring-[#1AA3A3]/10 text-slate-700 dark:text-slate-200"
                                    : "border-slate-200 dark:border-slate-700 focus:border-[#1AA3A3] focus:ring-[#1AA3A3]/10 text-slate-700 dark:text-slate-200"
                            }`}
                        placeholder="e.g. 123A3049"
                    />
                    
                    <div className="absolute right-3.5 top-3.5 pointer-events-none">
                        <Pencil size={16} className={`transition-colors ${prnError ? "text-red-300" : "text-slate-300 group-hover:text-[#1AA3A3]"}`} />
                    </div>
                </div>
                 {prnError && <p className="text-xs text-red-500 font-medium ml-1">{prnError}</p>}
            </div>
        </div>

        {/* --- ACTION BUTTONS --- */}
        <div className="pt-4 flex flex-col gap-3">
            <button 
                onClick={onNext}
                disabled={!isFormValid}
                className={`w-full py-3.5 text-sm font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2
                    ${isFormValid 
                        ? "bg-[#1AA3A3] hover:bg-[#158585] text-white shadow-[#1AA3A3]/30" 
                        : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                    }`}
            >
                Confirm & Next
            </button>

            {/* Skip Button (Always Visible) */}
            {onSkip && (
                <button 
                    type="button"
                    onClick={onSkip}
                    className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                    I'll do this later (Skip)
                </button>
            )}
        </div>
    </div>
  );
};

export default StepIdentity;