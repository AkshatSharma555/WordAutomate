import React from 'react';
import { FileText, Layers, ChevronRight, Clock, Users } from 'lucide-react';

const MasterFileCard = ({ file, onClick }) => {
  // Date Formatter
  const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div 
      onClick={onClick}
      className="group relative bg-white dark:bg-[#111111] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-[#1AA3A3]/50 dark:hover:border-[#1AA3A3]/50 hover:shadow-lg hover:shadow-[#1AA3A3]/5 transition-all duration-300 cursor-pointer w-full"
    >
       <div className="flex items-center justify-between gap-3 md:gap-4">
           
           {/* LEFT: Icon & Main Info */}
           <div className="flex items-center gap-4 min-w-0 flex-1">
               
               {/* 1. 3D Stack Icon Visual */}
               <div className="relative shrink-0">
                  {/* Bottom Layer */}
                  <div className="absolute top-0 left-0 size-12 bg-slate-100 dark:bg-slate-800 rounded-xl -rotate-6 scale-90 border border-slate-200 dark:border-slate-700 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-95 group-hover:translate-y-1"></div>
                  {/* Top Layer */}
                  <div className="relative size-12 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-[#1AA3A3] group-hover:border-[#1AA3A3]/30 transition-colors z-10 shadow-sm">
                      <FileText size={22} strokeWidth={2} />
                  </div>
               </div>

               {/* 2. Title & Metadata */}
               <div className="min-w-0 flex-1">
                   <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-white truncate mb-1.5 group-hover:text-[#1AA3A3] transition-colors">
                       {file.fileName}
                   </h3>
                   
                   <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                       {/* Batch Badge */}
                       <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700/50">
                           <Layers size={11} className="text-[#1AA3A3]" />
                           <span className="font-semibold text-slate-700 dark:text-slate-300">{file.totalBatches}</span>
                           <span className="hidden sm:inline">Batches</span>
                       </div>

                       <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>

                       {/* Time */}
                       <div className="flex items-center gap-1 opacity-80">
                           <Clock size={11} />
                           <span>{formatDate(file.lastShared)}</span>
                       </div>
                   </div>
               </div>
           </div>

           {/* RIGHT: Stats & Action */}
           <div className="flex items-center gap-3 md:gap-5 pl-2 border-l border-slate-100 dark:border-slate-800/50 shrink-0">
               
               {/* Reach Stats (Responsive) */}
               <div className="text-right">
                   <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider hidden sm:block">Total Reach</p>
                   <div className="flex items-center justify-end gap-1.5">
                       {/* Mobile Icon */}
                       <Users size={14} className="text-slate-400 sm:hidden" />
                       
                       <p className="text-sm md:text-lg font-bold text-slate-800 dark:text-white leading-none">
                           {file.totalStudents}
                       </p>
                       <span className="text-xs text-slate-500 font-medium hidden sm:inline-block">Students</span>
                   </div>
               </div>

               {/* Arrow Button */}
               <div className="size-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-[#1AA3A3] group-hover:text-white transition-all transform group-hover:translate-x-1 shadow-sm">
                   <ChevronRight size={16} />
               </div>
           </div>

       </div>
    </div>
  );
};

export default MasterFileCard;