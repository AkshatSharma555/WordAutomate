import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ShieldCheck, AlertCircle, Clock } from 'lucide-react';

const RequestCard = ({ request, onAction, loading }) => {
  const user = request.sender; 
  const [showConfirm, setShowConfirm] = useState(false); // Pop-up State

  // Handle Ignore Click
  const handleIgnoreClick = () => {
    setShowConfirm(true);
  };

  // Confirm Reject
  const confirmReject = () => {
    onAction(request._id, 'reject');
    setShowConfirm(false);
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white dark:bg-[#151515] p-5 rounded-[24px] border border-slate-200/60 dark:border-white/5 shadow-sm hover:border-[#1AA3A3]/20 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden group h-full"
    >
      
      {/* ==================== REJECT POP-UP OVERLAY ==================== */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="absolute inset-0 z-20 bg-white/90 dark:bg-[#111]/90 flex flex-col items-center justify-center p-4 rounded-[24px]"
          >
             <div className="size-10 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-500 mb-2">
                <AlertCircle size={20} />
             </div>
             <p className="text-sm font-bold text-slate-800 dark:text-white mb-4">Ignore Request?</p>
             
             <div className="flex gap-2 w-full">
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-2 rounded-lg border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmReject}
                  className="flex-1 py-2 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-600 shadow-lg shadow-red-500/20"
                >
                  Confirm
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== ORIGINAL CONTENT ==================== */}
      
      {/* Time Badge */}
      <div className="absolute top-4 right-4 text-[10px] font-bold text-slate-400 flex items-center gap-1 bg-slate-50 dark:bg-white/5 px-2 py-0.5 rounded-full">
         <Clock size={10} /> <span>New</span>
      </div>

      <div className="relative mb-3 mt-2 group-hover:scale-105 transition-transform duration-300">
        <div className="size-16 rounded-full p-0.5 bg-white dark:bg-[#151515] border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden">
          <img 
            src={user.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
            alt={user.name}
            className="w-full h-full rounded-full object-cover bg-slate-50 dark:bg-black"
            crossOrigin="anonymous"
          />
        </div>
      </div>

      <h3 className="text-base font-bold text-slate-900 dark:text-white truncate w-full px-2 mb-0.5">{user.name}</h3>
      
      <div className="flex items-center justify-center gap-1.5 mb-4">
         <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-1.5 py-0.5 rounded">{user.year}</span>
         <span className="text-[10px] text-slate-300 dark:text-slate-600">•</span>
         <span className="text-[10px] font-black text-[#F54A00] tracking-wide">{user.branch}</span>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 w-full mt-auto">
        <button 
          onClick={handleIgnoreClick} 
          disabled={loading}
          className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 text-xs font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
        >
          <X size={14} /> Ignore
        </button>
        <button 
          onClick={() => onAction(request._id, 'accept')}
          disabled={loading}
          className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#1AA3A3] text-white text-xs font-bold hover:bg-[#158585] shadow-md shadow-[#1AA3A3]/20 active:scale-95 transition-all"
        >
          <Check size={14} /> Accept
        </button>
      </div>
    </motion.div>
  );
};

export default RequestCard;