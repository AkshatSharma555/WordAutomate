import React from 'react';
import { Users, BookOpen, CalendarDays } from 'lucide-react';

const StepAcademic = ({ formData, errors, onChange, onNext }) => {

  const isFormValid = formData.branch && formData.year;
  
  // Data Arrays
  const branches = ["ECS", "EXTC", "IT", "AIDS", "AIML", "IOT", "CE", "ME"];
  const years = ["FE", "SE", "TE", "BE"];

  // Helper for selection style
  const getOptionStyle = (isSelected) => `
    relative flex items-center justify-center py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-300 border cursor-pointer
    ${isSelected 
      ? "bg-[#1AA3A3] text-white border-[#1AA3A3] shadow-lg shadow-[#1AA3A3]/25 scale-[1.02]" 
      : "bg-white dark:bg-[#1a1a1a] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-[#1AA3A3]/50 hover:bg-[#1AA3A3]/5 dark:hover:bg-[#1AA3A3]/10"
    }
  `;

  return (
    <div className="flex flex-col h-full gap-6">
        
        {/* --- INFO NOTE (Blue Theme) --- */}
        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 p-3.5 rounded-2xl flex gap-3 shrink-0">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-full h-fit text-blue-600 dark:text-blue-400 shrink-0">
                <Users size={16} />
            </div>
            <div className="text-[11px] sm:text-xs text-blue-800 dark:text-blue-200 leading-relaxed font-medium">
                <strong className="block mb-0.5 font-bold">Networking & Filters</strong>
                This helps friends find you in the <strong>Explore</strong> section. Selecting the correct Branch/Year ensures you see relevant document templates.
            </div>
        </div>

        <div className="flex-1 space-y-6">
            
            {/* --- BRANCH SELECTION (Grid Layout) --- */}
            <div className="space-y-2.5">
                <div className="flex items-center gap-2 px-1">
                    <BookOpen size={14} className="text-[#1AA3A3]" />
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Select Branch</label>
                </div>
                
                <div className="grid grid-cols-4 gap-2.5">
                    {branches.map((b) => (
                        <div 
                            key={b}
                            onClick={() => onChange('branch', b)}
                            className={getOptionStyle(formData.branch === b)}
                        >
                            {b}
                        </div>
                    ))}
                </div>
                {errors.branch && <p className="text-[10px] text-[#F54A00] font-bold px-1 animate-pulse">• Please select a branch</p>}
            </div>

            {/* --- YEAR SELECTION (Flex Layout) --- */}
            <div className="space-y-2.5">
                <div className="flex items-center gap-2 px-1">
                    <CalendarDays size={14} className="text-[#1AA3A3]" />
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Select Year</label>
                </div>

                <div className="grid grid-cols-4 gap-2.5">
                    {years.map((y) => (
                        <div 
                            key={y}
                            onClick={() => onChange('year', y)}
                            className={getOptionStyle(formData.year === y)}
                        >
                            {y}
                        </div>
                    ))}
                </div>
                {errors.year && <p className="text-[10px] text-[#F54A00] font-bold px-1 animate-pulse">• Please select your year</p>}
            </div>

        </div>

        {/* --- ACTION BUTTON --- */}
        <div className="pt-2 mt-auto">
            <button 
                onClick={onNext}
                disabled={!isFormValid}
                className={`w-full py-3.5 text-sm font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2
                    ${isFormValid 
                        ? "bg-[#1AA3A3] hover:bg-[#158585] text-white shadow-[#1AA3A3]/30" 
                        : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                    }`}
            >
                Next: Instructions
            </button>
        </div>
    </div>
  );
};

export default StepAcademic;