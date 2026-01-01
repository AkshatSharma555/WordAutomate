import React, { useState } from 'react';
import { Download, Share2, Check, RefreshCcw, ArrowRight, AlertCircle, FileText, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ActionList = ({ students, onReset }) => {
  const [sentIds, setSentIds] = useState([]); 
  const [showShareConfirm, setShowShareConfirm] = useState(false); 

  // --- Actions ---
  const handleShare = (id) => { 
      // Simulate API Call delay for better UX
      setTimeout(() => {
        setSentIds(prev => [...prev, id]); 
      }, 300);
  };

  const handleBulkShare = () => { 
      // Sabko 'Sent' mark kar do
      setSentIds(students.map(s => s.id)); 
      setShowShareConfirm(false); 
  };

  const handleDownload = (url) => { 
      if (url) window.open(url, '_blank'); 
  };

  const handleDownloadAll = () => {
      // ⚠️ BACKEND REQUIRED: Yahan hum baad me '/api/doc/download-zip' call karenge
      alert("Backend Feature: This will download a .zip file of all documents once the API is ready.");
  };

  const successCount = students.filter(s => s.success !== false).length;

  return (
    <div className="h-full flex flex-col bg-slate-50/50 dark:bg-[#0a0a0a]">
      
      {/* 1. HEADER (Clean & Professional) */}
      <div className="shrink-0 p-6 pb-4 bg-white dark:bg-[#111111] border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-2">
           <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                <Check size={16} strokeWidth={3} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-none">
                    Batch Ready
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {successCount} documents generated successfully.
                </p>
              </div>
           </div>
           
           <button 
             onClick={onReset} 
             className="group flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#1AA3A3] bg-slate-100 dark:bg-slate-800 hover:bg-[#1AA3A3]/10 px-3 py-2 rounded-lg transition-all"
           >
              Next Batch 
              <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
           </button>
        </div>
      </div>

      {/* 2. SCROLLABLE LIST */}
      <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar space-y-3">
         {students.map((student) => {
            const isSent = sentIds.includes(student.id);
            const isSuccess = student.success !== false; 

            return (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={student.studentId || student.id}
                className={`group p-4 rounded-xl border flex items-center justify-between transition-all hover:shadow-sm ${
                    isSuccess 
                    ? 'bg-white dark:bg-[#111111] border-slate-200 dark:border-slate-800' 
                    : 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30'
                }`}
              >
                 {/* Left: Info */}
                 <div className="flex items-center gap-4">
                    <div className="relative size-12">
                       <img 
                         src={student.img} 
                         alt={student.name} 
                         className={`size-12 rounded-full object-cover border ${isSuccess ? 'border-slate-100 dark:border-slate-700' : 'border-red-200'}`} 
                       />
                       {isSuccess && (
                           <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#111111] p-0.5 rounded-full">
                               <CheckCircle size={14} className="text-green-500 fill-green-100 dark:fill-green-900" />
                           </div>
                       )}
                    </div>
                    
                    <div>
                       <h4 className="text-sm font-bold text-slate-900 dark:text-white">{student.name}</h4>
                       <div className="flex items-center gap-2 mt-0.5">
                           <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">
                             {student.prn}
                           </span>
                           {!isSuccess && (
                               <span className="text-[10px] font-bold text-red-500">Generation Failed</span>
                           )}
                       </div>
                    </div>
                 </div>

                 {/* Right: Actions */}
                 <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleDownload(student.pdfUrl)}
                      disabled={!isSuccess}
                      className="size-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-30"
                      title="Download PDF"
                    >
                       <Download size={16} />
                    </button>
                    
                    <button 
                      onClick={() => handleShare(student.studentId)}
                      disabled={isSent || !isSuccess}
                      className={`h-9 px-4 rounded-lg text-xs font-bold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        isSent 
                          ? 'bg-green-50 text-green-600 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30' 
                          : 'bg-slate-900 text-white dark:bg-white dark:text-black hover:opacity-90'
                      }`}
                    >
                       {isSent ? <Check size={14} strokeWidth={3} /> : <Share2 size={14} />}
                       {isSent ? 'Sent' : 'Share'}
                    </button>
                 </div>
              </motion.div>
            );
         })}
      </div>

      {/* 3. FIXED FOOTER (Actions) */}
      <div className="shrink-0 p-6 pt-4 bg-white dark:bg-[#111111] border-t border-slate-100 dark:border-slate-800 z-10">
         <div className="flex gap-4">
             <button 
                onClick={handleDownloadAll}
                className="flex-1 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
             >
                <FileText size={16} /> Download All
             </button>
             
             <button 
               onClick={() => setShowShareConfirm(true)}
               disabled={successCount === 0}
               className="flex-1 py-3.5 rounded-xl bg-[#1AA3A3] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#158585] shadow-lg shadow-[#1AA3A3]/20 disabled:opacity-50 active:scale-95 transition-all"
             >
                <Send size={16} /> Share All
             </button>
         </div>
      </div>

      {/* Confirmation Popup */}
      <AnimatePresence>
         {showShareConfirm && (
             <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 bg-white/80 dark:bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6"
             >
                 <motion.div 
                    initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                    className="bg-white dark:bg-[#151515] p-6 rounded-3xl w-full max-w-sm shadow-2xl border border-slate-100 dark:border-slate-800 text-center"
                 >
                     <div className="size-12 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <Share2 size={24} />
                     </div>
                     
                     <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Share Documents?</h3>
                     <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                       This will share the download links with <strong>{successCount} students</strong>. Are you sure?
                     </p>
                     
                     <div className="flex gap-3">
                        <button 
                            onClick={() => setShowShareConfirm(false)} 
                            className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleBulkShare} 
                            className="flex-1 py-3 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 shadow-lg shadow-blue-500/20"
                        >
                            Yes, Share
                        </button>
                     </div>
                 </motion.div>
             </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
};

// Helper component for the check icon inside avatar
const CheckCircle = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <path d="M22 4L12 14.01l-3-3" />
    </svg>
);

export default ActionList;