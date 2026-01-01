import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ShieldCheck, AlertCircle } from 'lucide-react';

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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white dark:bg-[#111111] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center group relative overflow-hidden"
    >
      
      {/* ==================== REJECT POP-UP OVERLAY ==================== */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute inset-0 z-20 bg-white/95 dark:bg-[#111111]/95 backdrop-blur-md flex flex-col items-center justify-center p-4"
          >
             <div className="text-red-500 mb-2 bg-red-50 dark:bg-red-900/20 p-2 rounded-full">
                <AlertCircle size={20} />
             </div>
             <p className="text-sm font-bold text-slate-800 dark:text-white mb-4">Ignore Request?</p>
             
             <div className="flex gap-2 w-full">
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmReject}
                  className="flex-1 py-2 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600 shadow-lg shadow-red-500/20"
                >
                  Confirm
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== ORIGINAL CONTENT (No Size Change) ==================== */}
      
      <div className="relative mb-3">
        <div className="size-20 rounded-full p-1 bg-white dark:bg-[#111111] border border-slate-100 dark:border-slate-800 shadow-sm">
          <img 
            src={user.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
            alt={user.name}
            className="w-full h-full rounded-full object-cover"
            crossOrigin="anonymous"
          />
        </div>
        <div className="absolute bottom-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white dark:border-[#111111]">
          REQ
        </div>
      </div>

      <h3 className="font-bold text-slate-800 dark:text-white truncate w-full">{user.name}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{user.year} • {user.branch}</p>
      
      <div className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px] font-mono text-slate-500 mb-5">
        <ShieldCheck size={10} /> {user.prn || 'Verified'}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 w-full mt-auto">
        <button 
          onClick={handleIgnoreClick} // 👈 Changed to open Pop-up
          disabled={loading}
          className="flex items-center justify-center gap-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <X size={14} /> Ignore
        </button>
        <button 
          onClick={() => onAction(request._id, 'accept')}
          disabled={loading}
          className="flex items-center justify-center gap-2 py-2 rounded-xl bg-[#1AA3A3] text-white text-xs font-bold hover:bg-[#158585] shadow-lg shadow-[#1AA3A3]/20 active:scale-95 transition-all"
        >
          <Check size={14} /> Accept
        </button>
      </div>
    </motion.div>
  );
};

export default RequestCard;