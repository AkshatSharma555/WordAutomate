import React from 'react';
import { Filter, X, Check, GraduationCap, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const ExploreSidebar = ({ filters, setFilters, onClear }) => {
  const branches = ["ECS", "EXTC", "IT", "AIDS", "AIML", "IOT", "CE", "ME"];
  const years = ["FE", "SE", "TE", "BE"];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key] === value ? '' : value
    }));
  };

  return (
    <div className="h-full flex flex-col w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 shrink-0">
        <h3 className="font-black text-slate-900 dark:text-white flex items-center gap-2 text-lg tracking-tight">
          <div className="p-1.5 bg-[#1AA3A3]/10 rounded-lg text-[#1AA3A3]">
             <Filter size={18} /> 
          </div>
          Filters
        </h3>
        
        {(filters.year || filters.branch) && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onClear}
            className="text-[10px] font-bold text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 border border-red-100 dark:border-red-900/30 hover:border-red-200"
          >
            <X size={12} /> Clear All
          </motion.button>
        )}
      </div>

      {/* Content Container */}
      <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
        
        {/* Year Filter */}
        <div className="space-y-4">
          <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2 pl-1">
            <GraduationCap size={14} /> Academic Year
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {years.map((y) => {
                const isActive = filters.year === y;
                return (
                  <button
                    key={y}
                    onClick={() => handleFilterChange('year', y)}
                    className={`relative py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 border flex items-center justify-center gap-2 group ${
                      isActive
                        ? 'bg-gradient-to-br from-[#1AA3A3] to-teal-600 text-white border-transparent shadow-lg shadow-[#1AA3A3]/20 ring-2 ring-[#1AA3A3]/20'
                        : 'bg-white dark:bg-[#151515] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-[#1AA3A3]/50 hover:text-[#1AA3A3] dark:hover:text-white'
                    }`}
                  >
                    {y}
                    {isActive && <motion.div layoutId="activeYear" className="absolute inset-0 border-2 border-white/20 rounded-xl" />}
                  </button>
                );
            })}
          </div>
        </div>

        {/* Separator */}
        <div className="h-px bg-slate-100 dark:bg-slate-800 w-full"></div>

        {/* Branch Filter */}
        <div className="space-y-4">
          <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2 pl-1">
            <BookOpen size={14} /> Department
          </h4>
          <div className="grid grid-cols-2 gap-2.5">
            {branches.map((b) => {
                const isActive = filters.branch === b;
                return (
                  <button 
                    key={b}
                    onClick={() => handleFilterChange('branch', b)}
                    className={`relative cursor-pointer py-2.5 px-3 rounded-xl text-xs font-bold border transition-all duration-200 flex items-center justify-between group ${
                      isActive
                        ? 'bg-orange-50 dark:bg-orange-900/10 text-[#F54A00] border-[#F54A00] shadow-sm'
                        : 'bg-white dark:bg-[#151515] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-[#F54A00]/50 hover:text-[#F54A00] dark:hover:text-white'
                    }`}
                  >
                    <span>{b}</span>
                    {isActive ? (
                        <Check size={14} className="text-[#F54A00]" strokeWidth={3} />
                    ) : (
                        <div className="size-3 rounded-full border-2 border-slate-200 dark:border-slate-700 group-hover:border-[#F54A00] transition-colors" />
                    )}
                  </button>
                );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ExploreSidebar;