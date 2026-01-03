import React from 'react';
import { FileText, Layers, ChevronRight, Clock, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const MasterFileCard = ({ file, onClick }) => {
  // Date Formatter
  const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: "0 12px 30px -10px rgba(0,0,0,0.1)" }}
      onClick={onClick}
      className="group relative bg-white dark:bg-[#151515] p-5 rounded-[24px] border border-slate-200/60 dark:border-white/5 hover:border-[#1AA3A3]/30 transition-all duration-300 cursor-pointer w-full overflow-hidden"
    >
        
        {/* Subtle Background Mesh (Optional) */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>

        <div className="relative flex items-center justify-between gap-4 md:gap-6">
            
            {/* LEFT: Icon & Main Info */}
            <div className="flex items-center gap-5 min-w-0 flex-1">
                
                {/* 1. Stacked Icon Visual */}
                <div className="relative shrink-0 size-14">
                   {/* Bottom Layer Shadow */}
                   <div className="absolute top-1 left-1 size-14 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5 transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1"></div>
                   
                   {/* Top Layer */}
                   <div className="relative size-14 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 group-hover:text-[#1AA3A3] group-hover:border-[#1AA3A3]/30 transition-all shadow-sm z-10">
                       <FileText size={26} strokeWidth={1.5} />
                       
                       {/* Badge on Icon */}
                       <div className="absolute -top-1.5 -right-1.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-bold px-1.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 flex items-center gap-0.5 shadow-sm">
                          <Layers size={8} /> {file.totalBatches}
                       </div>
                   </div>
                </div>

                {/* 2. Title & Metadata */}
                <div className="min-w-0 flex-1 space-y-1.5">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white truncate group-hover:text-[#1AA3A3] transition-colors leading-tight">
                        {file.fileName}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-white/5 px-2 py-1 rounded-lg border border-slate-100 dark:border-white/5">
                            <Clock size={12} /> Last shared: {formatDate(file.lastShared)}
                        </span>
                    </div>
                </div>
            </div>

            {/* RIGHT: Stats & Action */}
            <div className="flex items-center gap-4 md:gap-6 pl-4 border-l border-slate-100 dark:border-white/5 shrink-0">
                
                {/* Reach Stats */}
                <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Total Reach</p>
                    <div className="flex items-center justify-end gap-1.5">
                        <Users size={16} className="text-[#1AA3A3]" />
                        <p className="text-lg font-black text-slate-900 dark:text-white leading-none">
                            {file.totalStudents}
                        </p>
                    </div>
                </div>

                {/* Arrow Button */}
                <div className="size-10 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-[#1AA3A3] group-hover:text-white transition-all transform group-hover:translate-x-1 shadow-sm border border-slate-100 dark:border-white/5">
                    <ChevronRight size={18} />
                </div>
            </div>

        </div>
    </motion.div>
  );
};

export default MasterFileCard;