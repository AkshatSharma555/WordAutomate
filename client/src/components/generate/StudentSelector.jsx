import React, { useState } from 'react';
import { Search, Users, CheckCircle2, Circle, AlertCircle, Wand2, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StudentSelector = ({ students, selectedIds, processedIds, toggleSelection, toggleAll, onGenerate, btnState, errorMessage }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const LIMIT = 5;

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggle = (id) => {
      if (!selectedIds.includes(id) && selectedIds.length >= LIMIT) return; 
      toggleSelection(id);
  };

  const handleSmartPick = () => {
      const available = filteredStudents.filter(s => !processedIds.includes(s.id));
      const nextBatchIds = available.slice(0, LIMIT).map(s => s.id);
      
      if (nextBatchIds.length > 0) {
          toggleAll(nextBatchIds);
      }
  };

  const isLimitReached = selectedIds.length >= LIMIT;

  return (
    <div className="h-full flex flex-col relative bg-white/40 dark:bg-[#0a0a0a]/40">
      
      {/* 1. HEADER (Sticky) */}
      <div className="shrink-0 p-5 bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl z-20 border-b border-slate-200/50 dark:border-white/5 sticky top-0">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="text-[#1AA3A3]" size={20} /> Select Targets
            </h2>
            <div className={`text-[10px] uppercase tracking-widest font-black px-2.5 py-1 rounded-lg border transition-all ${
              isLimitReached 
              ? 'bg-[#1AA3A3]/10 text-[#1AA3A3] border-[#1AA3A3]/20' 
              : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-white/5 dark:border-white/10 dark:text-slate-400'
            }`}>
              {selectedIds.length} / {LIMIT} MAX
            </div>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1AA3A3] transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search students..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-[#1a1a1a] border border-transparent focus:bg-white dark:focus:bg-black focus:border-[#1AA3A3]/30 rounded-xl text-sm font-bold text-slate-900 dark:text-white transition-all placeholder:text-slate-400 outline-none"
            />
          </div>
          <button 
            onClick={handleSmartPick}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-black hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2 whitespace-nowrap"
          >
            <Wand2 size={14} /> Pick 5
          </button>
        </div>
      </div>

      {/* 2. GRID LIST (Scrollable - 3 Columns Fix) */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar pb-40">
        {filteredStudents.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-64 text-slate-400 opacity-60">
              <Users size={48} className="mb-4 text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-bold">No matching students found.</p>
           </div>
        ) : (
           // Grid logic: Mobile (1), Tablet (2), Desktop (3)
           <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
             <AnimatePresence mode='popLayout'>
             {filteredStudents.map((student) => {
               const isSelected = selectedIds.includes(student.id);
               const isProcessed = processedIds.includes(student.id);
               const isDisabled = !isSelected && isLimitReached;

               return (
                 <motion.div 
                   key={student.id}
                   layout
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.9 }}
                   onClick={() => !isDisabled && handleToggle(student.id)}
                   className={`group relative p-3 rounded-2xl border flex items-center gap-3 transition-all duration-200 cursor-pointer select-none overflow-hidden h-full ${
                     isSelected 
                       ? 'bg-[#1AA3A3]/5 border-[#1AA3A3] shadow-md shadow-[#1AA3A3]/10' 
                       : isDisabled
                          ? 'opacity-50 grayscale cursor-not-allowed bg-slate-50 dark:bg-white/5 border-transparent'
                          : isProcessed
                              ? 'opacity-60 bg-slate-50/50 dark:bg-white/5 border-slate-200 dark:border-white/5'
                              : 'bg-white dark:bg-[#151515] border-slate-200 dark:border-white/5 hover:border-[#1AA3A3]/40 hover:shadow-sm'
                   }`}
                 >
                   {/* Avatar */}
                   <div className={`size-10 rounded-full overflow-hidden shrink-0 border-2 transition-all p-0.5 ${
                       isSelected ? 'border-[#1AA3A3]' : 'border-slate-100 dark:border-white/5'
                   }`}>
                      {student.img ? (
                        <img src={student.img} alt={student.name} className="w-full h-full object-cover rounded-full bg-slate-100" />
                      ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                            <User size={16} />
                        </div>
                      )}
                   </div>
                   
                   {/* Info (Compact Layout) */}
                   <div className="flex-1 min-w-0">
                      <h4 className={`text-xs sm:text-sm font-bold leading-tight mb-1 transition-colors line-clamp-2 ${
                          isSelected ? 'text-[#1AA3A3]' : 'text-slate-800 dark:text-white'
                      }`}>
                        {student.name}
                      </h4>
                      
                      <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold font-mono tracking-tight bg-slate-100 dark:bg-white/5 px-1.5 py-0.5 rounded truncate max-w-[80px]">
                              {student.prn}
                          </span>
                          {isProcessed && (
                              <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-black leading-none uppercase tracking-wide">
                                  Done
                              </span>
                          )}
                      </div>
                   </div>

                   {/* Checkbox */}
                   <div className="shrink-0 text-[#1AA3A3]">
                      {isSelected ? (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                             <CheckCircle2 size={20} className="fill-[#1AA3A3] text-white" />
                          </motion.div>
                      ) : (
                          <Circle size={20} className={`text-slate-300 dark:text-slate-700 ${!isDisabled && 'group-hover:text-[#1AA3A3]/50'}`} />
                      )}
                   </div>
                 </motion.div>
               );
             })}
             </AnimatePresence>
           </div>
        )}
      </div>

      {/* 3. FLOATING ACTION DOCK */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-30 pointer-events-none">
         <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#F3F2ED] via-[#F3F2ED]/95 to-transparent dark:from-[#050505] dark:via-[#050505]/95 dark:to-transparent" />
         
         <div className="relative pointer-events-auto max-w-md mx-auto">
            {/* Error Message */}
            <AnimatePresence>
                {errorMessage && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="mb-3 mx-2 p-3 bg-red-500 text-white rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-red-500/20"
                    >
                        <AlertCircle size={16} className="shrink-0 text-white" />
                        <span className="text-xs font-bold">{errorMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Generate Button */}
            <button 
              onClick={onGenerate}
              disabled={btnState.disabled}
              className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wide transition-all flex items-center justify-center gap-2.5 shadow-xl backdrop-blur-md border border-white/10
                ${btnState.disabled 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-white/10 dark:text-slate-500'
                  : 'bg-gradient-to-r from-[#1AA3A3] to-teal-600 text-white hover:shadow-[#1AA3A3]/40 hover:scale-[1.02] active:scale-[0.98]'
                }`}
            >
              {btnState.icon} {btnState.text}
            </button>
         </div>
      </div>

    </div>
  );
};

export default StudentSelector;