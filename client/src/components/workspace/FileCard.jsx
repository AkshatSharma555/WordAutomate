import React from 'react';
import { FileText, Download, Calendar, User, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const FileCard = ({ file, type }) => {
  // type can be 'received' or 'generated'

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="bg-white dark:bg-[#111111] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-4 group"
    >
      
      {/* 1. ICON BLOCK */}
      <div className="size-14 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center shrink-0 group-hover:bg-[#1AA3A3]/10 transition-colors">
        <FileText size={28} className="text-slate-400 group-hover:text-[#1AA3A3] transition-colors" />
      </div>

      {/* 2. FILE INFO */}
      <div className="flex-1 min-w-0 text-center md:text-left">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate mb-1" title={file.fileName}>
          {file.fileName}
        </h3>
        
        <div className="flex items-center justify-center md:justify-start gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
             <Calendar size={12} /> {file.date}
          </span>
          <span className="w-1 h-1 bg-slate-300 rounded-full" />
          <span>{file.size}</span>
        </div>
      </div>

      {/* 3. CONTEXT (Sender or Recipients) */}
      <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
        {type === 'received' ? (
          <>
             <div className="text-right hidden md:block">
                <p className="text-[10px] text-slate-400 uppercase font-bold">From</p>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{file.sender.name}</p>
             </div>
             <img src={file.sender.img} alt="Sender" className="size-8 rounded-full bg-slate-200 object-cover" />
          </>
        ) : (
          <>
             <div className="flex -space-x-2">
                {file.recipients.slice(0, 3).map((r, i) => (
                  <img key={i} src={r.img} className="size-8 rounded-full border-2 border-white dark:border-[#111111] bg-slate-200 object-cover" alt="" />
                ))}
                {file.recipients.length > 3 && (
                  <div className="size-8 rounded-full border-2 border-white dark:border-[#111111] bg-slate-200 flex items-center justify-center text-[10px] font-bold">
                    +{file.recipients.length - 3}
                  </div>
                )}
             </div>
             <div className="hidden md:block">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Sent to</p>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{file.recipients.length} Students</p>
             </div>
          </>
        )}
      </div>

      {/* 4. ACTION BUTTON */}
      <button className="h-10 px-6 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-xs flex items-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-slate-900/10 dark:shadow-white/10">
        <Download size={16} /> 
        <span className="hidden md:inline">Download</span>
      </button>

    </motion.div>
  );
};

export default FileCard;