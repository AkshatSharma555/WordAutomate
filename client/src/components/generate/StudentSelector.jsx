import React, { useState } from 'react';
import { Search, Users, CheckCircle2, Circle, AlertCircle } from 'lucide-react';

// 👇 'errorMessage' prop add kiya hai
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
    <div className="h-full flex flex-col relative bg-slate-50/50 dark:bg-[#0a0a0a]">
      
      {/* 1. HEADER */}
      <div className="shrink-0 p-5 bg-white dark:bg-[#111111] z-10 border-b border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Users className="text-[#1AA3A3]" size={18} /> Select Targets
            </h2>
            <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md border transition-all ${
              isLimitReached 
              ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30' 
              : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
            }`}>
              {selectedIds.length} / {LIMIT} Max
            </span>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-[#1a1a1a] border-none rounded-lg text-xs font-medium focus:ring-2 focus:ring-[#1AA3A3]/20 text-slate-900 dark:text-white transition-all placeholder:text-slate-400"
            />
          </div>
          <button 
            onClick={handleSmartPick}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-black hover:opacity-90 transition-opacity whitespace-nowrap shadow-md"
          >
            Pick 5
          </button>
        </div>
      </div>

      {/* 2. GRID LIST */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar pb-32">
        {filteredStudents.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-40 text-slate-400">
              <span className="text-2xl mb-2 opacity-50">🔍</span>
              <p className="text-sm font-medium">No students found.</p>
           </div>
        ) : (
           <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
             {filteredStudents.map((student) => {
               const isSelected = selectedIds.includes(student.id);
               const isProcessed = processedIds.includes(student.id);
               const isDisabled = !isSelected && isLimitReached;

               return (
                 <div 
                   key={student.id}
                   onClick={() => !isDisabled && handleToggle(student.id)}
                   className={`group relative p-3 rounded-xl border flex items-center gap-3 transition-all duration-200 cursor-pointer select-none overflow-hidden ${
                     isSelected 
                       ? 'bg-[#1AA3A3]/5 border-[#1AA3A3] shadow-md shadow-[#1AA3A3]/10 ring-1 ring-[#1AA3A3]' 
                       : isDisabled
                          ? 'opacity-40 grayscale cursor-not-allowed bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800'
                          : isProcessed
                              ? 'opacity-60 bg-slate-50 dark:bg-[#151515] border-slate-200 dark:border-slate-800'
                              : 'bg-white dark:bg-[#1e1e1e] border-slate-200 dark:border-slate-800 hover:border-[#1AA3A3]/40 hover:shadow-sm'
                   }`}
                 >
                   <div className="absolute top-2 right-2 text-[#1AA3A3]">
                      {isSelected ? (
                          <CheckCircle2 size={16} className="fill-[#1AA3A3] text-white" />
                      ) : (
                          <Circle size={16} className={`text-slate-300 dark:text-slate-700 ${!isDisabled && 'group-hover:text-[#1AA3A3]/50'}`} />
                      )}
                   </div>

                   <div className={`size-10 rounded-full overflow-hidden shrink-0 border transition-all ${
                       isSelected ? 'border-[#1AA3A3]' : 'border-slate-100 dark:border-slate-700'
                   }`}>
                      <img src={student.img} alt={student.name} className="w-full h-full object-cover" />
                   </div>
                   
                   <div className="flex-1 min-w-0 pr-4">
                      <h4 className={`text-xs font-bold truncate transition-colors ${
                          isSelected ? 'text-[#1AA3A3]' : 'text-slate-700 dark:text-slate-200'
                      }`}>
                        {student.name}
                      </h4>
                      
                      <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-[10px] text-slate-400 font-mono truncate">
                              {student.prn}
                          </p>
                          {isProcessed && (
                              <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold leading-none">
                                  Done
                              </span>
                          )}
                      </div>
                   </div>
                 </div>
               );
             })}
           </div>
        )}
      </div>

      {/* 3. FLOATING GLASS DOCK */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20 pointer-events-none">
         <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F3F2ED] via-[#F3F2ED]/90 to-transparent dark:from-[#050505] dark:via-[#050505]/90 dark:to-transparent" />
         
         <div className="relative pointer-events-auto">
            {/* 👇 ERROR MESSAGE BOX (Only shows if errorMessage exists) */}
            {errorMessage && (
                <div className="mb-3 mx-1 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center justify-center gap-2 animate-in slide-in-from-bottom-2 shadow-sm">
                    <AlertCircle size={16} className="text-red-500 shrink-0" />
                    <span className="text-xs font-bold text-red-600 dark:text-red-400">
                        {errorMessage}
                    </span>
                </div>
            )}

            <button 
              onClick={onGenerate}
              disabled={btnState.disabled}
              className={`w-full py-3.5 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2 shadow-xl backdrop-blur-md border
                ${btnState.disabled 
                  ? 'bg-slate-100/80 text-slate-400 cursor-not-allowed border-slate-200 dark:bg-slate-900/80 dark:text-slate-600 dark:border-slate-800'
                  : 'bg-[#1AA3A3] text-white border-[#1AA3A3] hover:bg-[#158585] hover:scale-[1.01] active:scale-95 shadow-[#1AA3A3]/25'
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