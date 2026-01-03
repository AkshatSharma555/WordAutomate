import React, { useState } from 'react';
import axios from 'axios';
import { Download, Share2, Check, ArrowRight, Send, CheckCircle2, UserCheck, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// --- SUB-COMPONENT: FANCY SHARE BUTTON ---
const ShareButton = ({ onClick, isSent, disabled }) => {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled || isSent}
      className={`relative h-10 px-5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95 overflow-hidden ${
        isSent 
          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30 cursor-default' 
          : 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed'
      }`}
    >
      <AnimatePresence mode="wait">
        {isSent ? (
          <motion.div 
            key="sent"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center gap-2"
          >
            <Check size={14} strokeWidth={3} /> Sent
          </motion.div>
        ) : (
          <motion.div 
            key="share"
            exit={{ y: -20, opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Share2 size={14} /> Share
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Fly away effect on click (Visual trick) */}
      {isSent && (
         <motion.div 
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{ x: 20, y: -20, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-1/2 left-1/2 text-white dark:text-black"
         >
            <Send size={14} />
         </motion.div>
      )}
    </button>
  );
};

const ActionList = ({ students, onReset }) => {
  const [sentIds, setSentIds] = useState([]); 
  const [showShareConfirm, setShowShareConfirm] = useState(false); 
  const [isSharing, setIsSharing] = useState(false); 

  // Calculate Success Count
  const successStudents = students.filter(s => s.success !== false);
  const successCount = successStudents.length;
  
  // Check if All are Shared
  const isAllShared = successCount > 0 && sentIds.length >= successCount;

  // --- 1. Single Share Logic ---
  const handleShare = async (student) => { 
      try {
        setSentIds(prev => [...prev, student.id]); // Optimistic Update

        const { data } = await axios.post(`${API_URL}/document/share`, {
            documentId: student.docId,
            receiverId: student.id 
        }, { withCredentials: true });

        if (!data.success) {
            setSentIds(prev => prev.filter(id => id !== student.id)); // Revert
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
      try {
          await Promise.all(successStudents.map(student => {
             if (!sentIds.includes(student.id)) {
                 return axios.post(`${API_URL}/document/share`, {
                    documentId: student.docId,
                    receiverId: student.id
                 }, { withCredentials: true });
             }
             return Promise.resolve();
          }));
          
          const allIds = successStudents.map(s => s.id);
          setSentIds(allIds);
          setShowShareConfirm(false);
      } catch (error) {
          alert("Some shares might have failed. Please check connection.");
      } finally {
          setIsSharing(false);
      }
  };

  const handleDownload = (url) => { 
      if (url) window.open(url, '_blank'); 
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50/50 dark:bg-[#0a0a0a]">
      
      {/* 1. HEADER */}
      <div className="shrink-0 p-6 pb-4 bg-white dark:bg-[#111111] border-b border-slate-100 dark:border-slate-800 relative z-10">
        <div className="flex items-center justify-between mb-1">
           <div className="flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-50 dark:from-green-900/40 dark:to-emerald-900/10 flex items-center justify-center text-green-600 dark:text-green-400 shadow-sm border border-green-100 dark:border-green-900/50">
                <CheckCircle2 size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 leading-tight">
                    Batch Complete
                </h2>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        {successCount} Generated
                    </span>
                    <span className="size-1 bg-slate-300 rounded-full" />
                    <span className="text-xs font-medium text-slate-400">Ready to distribute</span>
                </div>
              </div>
           </div>
           
           <button 
             onClick={onReset} 
             className="group flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#1AA3A3] bg-white dark:bg-black border border-slate-200 dark:border-slate-800 hover:border-[#1AA3A3]/30 hover:bg-[#1AA3A3]/5 px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95"
           >
              Next Batch 
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
           </button>
        </div>
      </div>

      {/* 2. SCROLLABLE LIST (Staggered Animation) */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 overflow-y-auto px-4 md:px-6 py-4 custom-scrollbar space-y-3 min-h-0"
      >
         {students.map((student) => {
            const isSent = sentIds.includes(student.id);
            const isSuccess = student.success !== false; 

            return (
              <motion.div 
                key={student.studentId || student.id}
                variants={itemVariants}
                whileHover={{ scale: 1.01, backgroundColor: "rgba(var(--slate-50), 0.5)" }}
                className={`group p-3 md:p-4 rounded-2xl border flex items-center justify-between transition-all duration-200 ${
                    isSuccess 
                    ? 'bg-white dark:bg-[#111111] border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-[#1AA3A3]/30 dark:hover:border-[#1AA3A3]/30' 
                    : 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30'
                }`}
              >
                 {/* Left: User Info */}
                 <div className="flex items-center gap-4 overflow-hidden">
                    <div className="relative size-10 md:size-12 shrink-0 group-hover:scale-105 transition-transform">
                       <img 
                          src={student.img} 
                          alt={student.name} 
                          className={`size-full rounded-full object-cover border-2 ${isSuccess ? 'border-slate-100 dark:border-slate-800' : 'border-red-200'}`} 
                       />
                       {isSuccess && (
                           <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#111111] p-[2px] rounded-full">
                               <UserCheck size={14} className="text-green-500 fill-green-100 dark:fill-green-900/50" />
                           </div>
                       )}
                    </div>
                    
                    <div className="min-w-0 flex-1">
                       <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                           {student.name}
                       </h4>
                       <div className="flex items-center gap-2 mt-0.5">
                           <span className="text-[10px] font-mono font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                             {student.prn}
                           </span>
                           {!isSuccess && (
                               <span className="text-[10px] font-bold text-red-500 bg-red-100 dark:bg-red-900/30 px-1.5 py-0.5 rounded">Failed</span>
                           )}
                       </div>
                    </div>
                 </div>

                 {/* Right: Actions */}
                 <div className="flex items-center gap-2 md:gap-3 pl-2 shrink-0">
                    <button 
                      onClick={() => handleDownload(student.pdfUrl)}
                      disabled={!isSuccess}
                      className="size-10 flex items-center justify-center rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Download PDF"
                    >
                       <Download size={18} />
                    </button>
                    
                    <ShareButton 
                        onClick={() => handleShare(student)}
                        isSent={isSent}
                        disabled={!isSuccess}
                    />
                 </div>
              </motion.div>
            );
         })}
      </motion.div>

      {/* 3. DYNAMIC FOOTER (Sticky & Glass) */}
      <div className="shrink-0 p-6 pt-4 bg-white/80 dark:bg-[#111111]/80 backdrop-blur-lg border-t border-slate-100 dark:border-slate-800 z-20">
         <AnimatePresence mode="wait">
             {isAllShared ? (
                 // STATE: ALL SHARED
                 <motion.div 
                    key="success-banner"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold text-sm flex items-center justify-center gap-2 shadow-sm"
                 >
                    <Sparkles size={18} className="animate-pulse" /> All Documents Distributed
                 </motion.div>
             ) : (
                 // STATE: SHARE ALL BUTTON
                 <motion.button 
                   key="share-btn"
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: 10 }}
                   onClick={() => setShowShareConfirm(true)}
                   disabled={successCount === 0}
                   className="w-full py-4 rounded-2xl bg-[#1AA3A3] text-white font-bold text-base flex items-center justify-center gap-2 hover:bg-[#158585] shadow-xl shadow-[#1AA3A3]/20 hover:shadow-[#1AA3A3]/30 disabled:opacity-50 disabled:shadow-none active:scale-[0.98] transition-all"
                 >
                    <Send size={18} /> Share With All <span className="opacity-70 text-xs font-normal">({successCount})</span>
                 </motion.button>
             )}
         </AnimatePresence>
      </div>

      {/* 4. PREMIUM CONFIRMATION MODAL */}
      <AnimatePresence>
         {showShareConfirm && (
             <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center p-6"
             >
                 <motion.div 
                    initial={{ scale: 0.95, opacity: 0, y: 10 }} 
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 10 }}
                    className="bg-white dark:bg-[#111111] p-0 rounded-[32px] w-full max-w-sm shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden"
                 >
                      {/* Header Art */}
                      <div className="bg-slate-50 dark:bg-[#151515] p-8 pb-6 flex flex-col items-center border-b border-slate-100 dark:border-slate-800">
                          <div className="size-16 bg-[#1AA3A3]/10 text-[#1AA3A3] rounded-2xl flex items-center justify-center mb-4 ring-4 ring-[#1AA3A3]/5">
                             <Share2 size={32} />
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Bulk Distribution</h3>
                      </div>
                      
                      {/* Body */}
                      <div className="p-6 text-center">
                          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                            You are about to share <strong>{successCount - sentIds.length} documents</strong>. Recipients will see them instantly in their dashboard.
                          </p>
                          
                          <div className="flex gap-3">
                             <button 
                                 onClick={() => setShowShareConfirm(false)} 
                                 className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                             >
                                 Cancel
                             </button>
                             <button 
                                 onClick={handleBulkShare} 
                                 disabled={isSharing}
                                 className="flex-1 py-3 rounded-xl bg-[#1AA3A3] text-white font-bold hover:bg-[#158585] shadow-lg shadow-[#1AA3A3]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                             >
                                 {isSharing ? <><div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</> : 'Confirm'}
                             </button>
                          </div>
                      </div>
                 </motion.div>
             </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
};

export default ActionList;