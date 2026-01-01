import React from 'react';
import { Filter, X } from 'lucide-react';

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
      <div className="flex items-center justify-between mb-6 shrink-0">
        <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 text-base">
          <Filter size={18} className="text-[#1AA3A3]" /> Filters
        </h3>
        {(filters.year || filters.branch) && (
          <button 
            onClick={onClear}
            className="text-[10px] font-bold text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-900/10 px-2.5 py-1 rounded-full transition-colors flex items-center gap-1"
          >
            <X size={10} /> Clear
          </button>
        )}
      </div>

      {/* Content Container - Scrollbar Hidden but Scrollable if needed */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] space-y-6">
        
        {/* Year Filter */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            Academic Year
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {years.map((y) => (
              <button
                key={y}
                onClick={() => handleFilterChange('year', y)}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border relative overflow-hidden ${
                  filters.year === y
                    ? 'bg-[#1AA3A3] text-white border-[#1AA3A3] shadow-md shadow-[#1AA3A3]/20'
                    : 'bg-white dark:bg-[#1a1a1a] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-[#1AA3A3] hover:text-[#1AA3A3]'
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        {/* Branch Filter - COMPACT GRID LAYOUT */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            Branch
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {branches.map((b) => (
              <button 
                key={b}
                onClick={() => handleFilterChange('branch', b)}
                className={`cursor-pointer py-2 px-3 rounded-lg text-xs font-semibold border transition-all text-center truncate ${
                  filters.branch === b
                    ? 'bg-[#F54A00] text-white border-[#F54A00] shadow-md shadow-[#F54A00]/20'
                    : 'bg-white dark:bg-[#1a1a1a] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-[#F54A00] hover:text-[#F54A00]'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreSidebar;