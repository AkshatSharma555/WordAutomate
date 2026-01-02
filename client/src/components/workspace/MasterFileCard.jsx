import React from 'react';
import { FileText, Layers, ChevronRight, Clock } from 'lucide-react';

const MasterFileCard = ({ file, onClick }) => {
  // Date Formatter
  const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div 
      onClick={onClick}
      className="group bg-white dark:bg-[#111111] p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#1AA3A3] dark:hover:border-[#1AA3A3] transition-all cursor-pointer hover:shadow-md flex items-center justify-between"
    >
       <div className="flex items-center gap-4">
           {/* Icon with Layer Effect to show 'Stack' */}
           <div className="relative">
              <div className="absolute top-0 left-0 size-12 bg-slate-200 dark:bg-slate-800 rounded-lg -rotate-6 scale-90 -z-10 group-hover:-rotate-12 transition-transform"></div>
              <div className="size-12 bg-slate-100 dark:bg-slate-900 rounded-lg flex items-center justify-center text-slate-500 z-10 group-hover:text-[#1AA3A3] transition-colors">
                  <FileText size={24} />
              </div>
           </div>

           <div>
               <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                   {file.fileName}
               </h3>
               <div className="flex items-center gap-3 text-xs text-slate-500">
                   <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                       <Layers size={12} /> {file.totalBatches} Batches
                   </span>
                   <span className="flex items-center gap-1">
                       <Clock size={12} /> Last sent {formatDate(file.lastShared)}
                   </span>
               </div>
           </div>
       </div>

       <div className="flex items-center gap-4">
           <div className="text-right hidden sm:block">
               <p className="text-[10px] uppercase font-bold text-slate-400">Total Reach</p>
               <p className="text-sm font-bold text-slate-800 dark:text-white">{file.totalStudents} Students</p>
           </div>
           <div className="size-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-[#1AA3A3] group-hover:text-white transition-all">
               <ChevronRight size={18} />
           </div>
       </div>
    </div>
  );
};

export default MasterFileCard;