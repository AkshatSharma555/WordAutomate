import React, { useState } from 'react';
import axios from 'axios';
import { Download, Share2, Check, ArrowRight, AlertCircle, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ActionList = ({ students, onReset }) => {
  const [sentIds, setSentIds] = useState([]); 
  const [showShareConfirm, setShowShareConfirm] = useState(false); 
  const [isSharing, setIsSharing] = useState(false); 

  // --- 1. Single Share Logic ---
  const handleShare = async (student) => { 
      try {
        // Optimistic UI Update (Instant Feedback)
        setSentIds(prev => [...prev, student.id]); 

        const { data } = await axios.post(`${API_URL}/document/share`, {
            documentId: student.docId,
            receiverId: student.id 
        }, { withCredentials: true });

        if (!data.success) {
            // Revert on failure
            setSentIds(prev => prev.filter(id => id !== student.id));
            alert("Share failed: " + data.message);
        }
      } catch (error) {
        console.error(error);
        setSentIds(prev => prev.filter(id => id !== student.id));
      }
  };

  // --- 2. Bulk Share Logic ---
  const handleBulkShare = async () => { 
      setIsSharing(true);
      const successfulStudents = students.filter(s => s.success !== false);
      
      // Parallel Requests for speed
      try {
          await Promise.all(successfulStudents.map(student => 
             axios.post(`${API_URL}/document/share`, {
                documentId: student.docId,
                receiverId: student.id
             }, { withCredentials: true })
          ));
          
          setSentIds(successfulStudents.map(s => s.id));
          setShowShareConfirm(false);
      } catch (error) {
          alert("Some shares might have failed. Please try again.");
      } finally {
          setIsSharing(false);
      }
  };

  const handleDownload = (url) => { 
      if (url) window.open(url, '_blank'); 
  };

  const successCount = students.filter(s => s.success !== false).length;

  return (
    <div className="h-full flex flex-col bg-slate-50/50 dark:bg-[#0a0a0a]">
      
      {/* 1. HEADER */}
      <div className="shrink-0 p-6 pb-4 bg-white dark:bg-[#111111] border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-2">
           <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 shadow-sm">
                <Check size={20} strokeWidth={3} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-none">
                    Batch Ready
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
                    {successCount} documents generated successfully.
                </p>
              </div>
           </div>
           
           <button 
             onClick={onReset} 
             className="group flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#1AA3A3] bg-slate-100 dark:bg-slate-800 hover:bg-[#1AA3A3]/10 px-4 py-2.5 rounded-xl transition-all active:scale-95"
           >
              Next Batch 
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
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
                className={`group p-4 rounded-2xl border flex items-center justify-between transition-all hover:shadow-md ${
                    isSuccess 
                    ? 'bg-white dark:bg-[#111111] border-slate-200 dark:border-slate-800' 
                    : 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30'
                }`}
              >
                 {/* Left: User Info */}
                 <div className="flex items-center gap-4">
                    <div className="relative size-12 shrink-0">
                       <img 
                         src={student.img} 
                         alt={student.name} 
                         className={`size-12 rounded-full object-cover border-2 ${isSuccess ? 'border-white dark:border-[#222] shadow-sm' : 'border-red-200'}`} 
                       />
                       {isSuccess && (
                           <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#111111] p-[2px] rounded-full">
                               <CheckCircle size={16} className="text-green-500 fill-green-100 dark:fill-green-900" />
                           </div>
                       )}
                    </div>
                    
                    <div className="min-w-0">
                       <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[150px] sm:max-w-[200px]">
                           {student.name}
                       </h4>
                       <div className="flex items-center gap-2 mt-1">
                           <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md">
                             {student.prn}
                           </span>
                           {!isSuccess && (
                               <span className="text-[10px] font-bold text-red-500 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-md">Failed</span>
                           )}
                       </div>
                    </div>
                 </div>

                 {/* Right: Actions */}
                 <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleDownload(student.pdfUrl)}
                      disabled={!isSuccess}
                      className="size-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Download PDF"
                    >
                       <Download size={18} />
                    </button>
                    
                    <button 
                      onClick={() => handleShare(student)} 
                      disabled={isSent || !isSuccess}
                      className={`h-10 px-5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none ${
                        isSent 
                          ? 'bg-green-50 text-green-600 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30 cursor-default' 
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

      {/* 3. FOOTER (Only Share All) */}
      <div className="shrink-0 p-6 pt-4 bg-white dark:bg-[#111111] border-t border-slate-100 dark:border-slate-800 z-10">
         <button 
           onClick={() => setShowShareConfirm(true)}
           disabled={successCount === 0}
           className="w-full py-4 rounded-2xl bg-[#1AA3A3] text-white font-bold text-base flex items-center justify-center gap-2 hover:bg-[#158585] shadow-lg shadow-[#1AA3A3]/20 disabled:opacity-50 disabled:shadow-none active:scale-95 transition-all"
         >
            <Send size={18} /> Share With All
         </button>
      </div>

      {/* POPUP CONFIRMATION */}
      <AnimatePresence>
         {showShareConfirm && (
             <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 bg-white/80 dark:bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6"
             >
                 <motion.div 
                    initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                    className="bg-white dark:bg-[#151515] p-8 rounded-[32px] w-full max-w-sm shadow-2xl border border-slate-100 dark:border-slate-800 text-center relative overflow-hidden"
                 >
                     {/* Decor bg */}
                     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#1AA3A3] to-transparent opacity-50" />

                     <div className="size-14 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-full flex items-center justify-center mb-5 mx-auto ring-4 ring-blue-50/50 dark:ring-blue-900/10">
                        <Share2 size={28} />
                     </div>
                     
                     <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Share Documents?</h3>
                     <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed px-2">
                       This will instantly add these files to the <strong>"Shared with Me"</strong> tab for {successCount} students.
                     </p>
                     
                     <div className="flex gap-3">
                        <button 
                            onClick={() => setShowShareConfirm(false)} 
                            className="flex-1 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleBulkShare} 
                            disabled={isSharing}
                            className="flex-1 py-3.5 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {isSharing ? (
                                <>Processing...</>
                            ) : (
                                <>Yes, Share</>
                            )}
                        </button>
                     </div>
                 </motion.div>
             </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
};

// Helper CheckCircle
const CheckCircle = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <path d="M22 4L12 14.01l-3-3" />
    </svg>
);

export default ActionList;