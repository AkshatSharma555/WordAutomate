import React from 'react';
import { User, Mail, ShieldCheck, Info, AlertCircle, Pencil, FileBadge, School, GraduationCap } from 'lucide-react'; 
// 👇 Import VALIDATORS (Yeh zaroori hai)
import { formatAndValidateName, formatAndValidatePRN } from '../../utils/validators';

const PersonalInfoSection = ({ 
    user, 
    name, setName, setNameError, nameError, 
    prn, setPrn, setPrnError, prnError,
    branch, setBranch,
    year, setYear
}) => {
    
    // Dropdown Data
    const branches = ["ECS", "EXTC", "IT", "AIDS", "AIML", "IOT", "CE", "ME"];
    const years = ["FE", "SE", "TE", "BE"];

    // 🌟 FIXED NAME HANDLER (Validation Wapas Aa Gayi)
    const handleNameChange = (e) => {
        const val = e.target.value;
        // Fallback for original name logic
        const originalName = user?.microsoftOriginalName || user?.name || "";
        
        // Validate immediately
        const result = formatAndValidateName(val, originalName);
        
        setName(result.name);       // Update Value
        setNameError(result.error); // Update Error State
    };

    // 🌟 FIXED PRN HANDLER (Validation Wapas Aa Gayi)
    const handlePrnChange = (e) => {
        const val = e.target.value;
        
        // Validate immediately
        const result = formatAndValidatePRN(val);
        
        setPrn(result.prn);         // Update Value
        setPrnError(result.error);  // Update Error State
    };

    return (
        <div className="mt-8 bg-white dark:bg-[#111111] rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/60 dark:border-slate-800 transition-colors duration-300">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Personal Information</h3>
            <div className="space-y-6">
                 
                 {/* 1. NAME INPUT */}
                 <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Full Name (Editable)</label>
                        {/* Validation Status Indicator */}
                        {nameError ? (
                            <span className="text-[10px] font-bold text-red-500 animate-pulse">Action Required</span>
                        ) : (
                            <span className="text-[10px] font-bold text-[#1AA3A3]">Verified Format</span>
                        )}
                    </div>
                    <div className="relative group">
                        <User className={`absolute left-3.5 top-3.5 size-[18px] transition-colors ${nameError ? "text-red-400" : "text-slate-400 group-hover:text-[#1AA3A3]"}`} />
                        <input 
                            type="text" 
                            value={name} 
                            onChange={handleNameChange} // 👈 Using the fixed handler
                            className={`w-full pl-10 pr-10 py-3 bg-white dark:bg-[#1a1a1a] border rounded-xl text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 transition-all duration-200 
                                ${nameError 
                                    ? "border-red-200 focus:border-red-400 focus:ring-red-100 dark:border-red-900/50" 
                                    : "border-slate-200 dark:border-slate-700 focus:border-[#1AA3A3] focus:ring-[#1AA3A3]/10"
                                }`} 
                            placeholder="e.g. Akshat Sharma" 
                        />
                        <div className="absolute right-3.5 top-3.5 pointer-events-none"><Pencil size={16} className={`transition-colors ${nameError ? "text-red-300" : "text-slate-300 group-hover:text-[#1AA3A3]"}`} /></div>
                    </div>
                    {nameError && <div className="flex items-start gap-2 text-xs text-red-500 font-medium ml-1"><AlertCircle size={15} className="mt-0.5 shrink-0" /><span>{nameError}</span></div>}
                </div>

                {/* 2. PRN INPUT */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">PRN Number</label>
                        {/* Validation Status Indicator */}
                        {prnError ? (
                            <span className="text-[10px] font-bold text-red-500 animate-pulse">Required</span>
                        ) : (
                            <span className="text-[10px] font-bold text-[#1AA3A3]">Valid Format</span>
                        )}
                    </div>
                    <div className="relative group">
                        <FileBadge className={`absolute left-3.5 top-3.5 size-[18px] transition-colors ${prnError ? "text-red-400" : "text-slate-400 group-hover:text-[#1AA3A3]"}`} />
                        <input 
                            type="text" 
                            value={prn} 
                            onChange={handlePrnChange} // 👈 Using the fixed handler
                            maxLength={16} 
                            className={`w-full pl-10 pr-10 py-3 bg-white dark:bg-[#1a1a1a] border rounded-xl text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 transition-all duration-200 uppercase tracking-widest
                                ${prnError 
                                    ? "border-red-200 focus:border-red-400 focus:ring-red-100 dark:border-red-900/50" 
                                    : "border-slate-200 dark:border-slate-700 focus:border-[#1AA3A3] focus:ring-[#1AA3A3]/10"
                                }
                            `}
                            placeholder="e.g. 123A3049"
                        />
                         <div className="absolute right-3.5 top-3.5 pointer-events-none"><Pencil size={16} className={`transition-colors ${prnError ? "text-red-300" : "text-slate-300 group-hover:text-[#1AA3A3]"}`} /></div>
                    </div>
                     {prnError && <div className="flex items-start gap-2 text-xs text-red-500 font-medium ml-1"><AlertCircle size={15} className="mt-0.5 shrink-0" /><span>{prnError}</span></div>}
                </div>

                {/* INFO MESSAGE */}
                <div className="flex items-start gap-2.5 text-[11px] text-slate-500 dark:text-slate-400 ml-1 leading-relaxed bg-slate-50 dark:bg-white/5 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                    <Info size={15} className="mt-0.5 shrink-0 text-[#1AA3A3]" />
                    <div>
                        <p className="font-semibold text-slate-700 dark:text-slate-200 mb-0.5">Critical Document Details:</p>
                        <p>Name and PRN will be printed on documents. Ensure accuracy.</p>
                    </div>
                </div>

                {/* 3. BRANCH & YEAR */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    {/* Branch Select */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Branch</label>
                        <div className="relative group">
                            <School className="absolute left-3.5 top-3.5 size-[18px] text-slate-400 group-hover:text-[#1AA3A3] transition-colors" />
                            <select 
                                value={branch} 
                                onChange={(e) => setBranch(e.target.value)}
                                className="w-full pl-10 pr-10 py-3 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:border-[#1AA3A3] focus:ring-[#1AA3A3]/10 transition-all duration-200 appearance-none cursor-pointer hover:border-slate-300 dark:hover:border-slate-600"
                            >
                                <option value="" disabled>Select Branch</option>
                                {branches.map((b) => (
                                    <option key={b} value={b}>{b}</option>
                                ))}
                            </select>
                            <div className="absolute right-3.5 top-4 pointer-events-none transition-transform group-hover:translate-y-0.5">
                                <svg className="size-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>

                    {/* Year Select */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Year</label>
                        <div className="relative group">
                            <GraduationCap className="absolute left-3.5 top-3.5 size-[18px] text-slate-400 group-hover:text-[#1AA3A3] transition-colors" />
                            <select 
                                value={year} 
                                onChange={(e) => setYear(e.target.value)}
                                className="w-full pl-10 pr-10 py-3 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:border-[#1AA3A3] focus:ring-[#1AA3A3]/10 transition-all duration-200 appearance-none cursor-pointer hover:border-slate-300 dark:hover:border-slate-600"
                            >
                                <option value="" disabled>Select Year</option>
                                {years.map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                            <div className="absolute right-3.5 top-4 pointer-events-none transition-transform group-hover:translate-y-0.5">
                                <svg className="size-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Email Input (Read Only) */}
                <div className="space-y-1.5 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">College Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                        <input type="text" value={user?.email || ""} disabled className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 font-medium cursor-not-allowed focus:outline-none" />
                        <div className="absolute right-3 top-3 text-[#1AA3A3]"><ShieldCheck size={20} /></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalInfoSection;