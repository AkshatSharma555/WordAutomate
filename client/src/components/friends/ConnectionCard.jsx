import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical, UserMinus, ShieldCheck, AlertCircle, X, GraduationCap, School } from 'lucide-react';

const ConnectionCard = ({ friend, onUnfriend }) => {
  const [viewState, setViewState] = useState('idle'); // 'idle' | 'menu' | 'confirm'

  // 1. Menu Open/Close
  const toggleMenu = () => {
    setViewState(prev => prev === 'idle' ? 'menu' : 'idle');
  };

  // 2. Click Unfriend (Go to Confirm)
  const handleUnfriendClick = () => {
    setViewState('confirm');
  };

  // 3. Final Delete
  const confirmDelete = () => {
    onUnfriend(friend._id);
    setViewState('idle');
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-[#111111] rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-sm relative group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden h-[140px]"
    >
      
      {/* ==================== 1. SLIDE-UP MENU (Action Sheet) ==================== */}
      <AnimatePresence>
        {viewState === 'menu' && (
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute inset-0 z-20 bg-slate-50 dark:bg-[#1a1a1a] flex flex-col justify-center px-6 gap-3"
          >
             <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Manage Connection</span>
                <button 
                  onClick={() => setViewState('idle')}
                  className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 hover:scale-110 transition-transform"
                >
                   <X size={16} />
                </button>
             </div>
             
             <button 
               onClick={handleUnfriendClick}
               className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 text-red-500 border border-red-100 dark:bg-red-900/10 dark:border-red-900/30 text-sm font-bold hover:bg-red-500 hover:text-white transition-all shadow-sm"
             >
                <UserMinus size={16} /> Unfriend Person
             </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== 2. CONFIRM OVERLAY (Red Alert) ==================== */}
      <AnimatePresence>
        {viewState === 'confirm' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 bg-white/95 dark:bg-[#111111]/95 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center"
          >
             <div className="flex items-center gap-2 mb-3 text-red-500">
                <AlertCircle size={20} />
                <span className="text-sm font-bold">Disconnecting?</span>
             </div>
             <p className="text-xs text-slate-500 mb-4 px-2 line-clamp-1">
                Remove {friend.name.split(' ')[0]} from your network?
             </p>
             <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setViewState('idle')}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600 shadow-lg shadow-red-500/20"
                >
                  Confirm
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== 3. MAIN CARD CONTENT ==================== */}
      <div className="p-4 flex items-center gap-4 h-full">
        
        {/* Avatar (Bigger & Rounded Square) */}
        <div className="relative shrink-0 self-center">
             <div className="size-[84px] rounded-2xl bg-slate-100 dark:bg-slate-900 overflow-hidden border border-slate-100 dark:border-slate-800 shadow-inner group-hover:scale-105 transition-transform duration-500">
                <img 
                  src={friend.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                  alt={friend.name}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
             </div>
             {/* Online/Verified Dot */}
             <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#111111] p-[3px] rounded-full">
                <div className="bg-[#1AA3A3] size-2.5 rounded-full ring-2 ring-white dark:ring-[#111111] animate-pulse" />
             </div>
        </div>

        {/* Info Section */}
        <div className="flex-1 min-w-0 flex flex-col justify-center h-full py-1">
            {/* Name - Updated for multi-line support */}
            <h3 className="text-[16px] leading-snug font-bold text-slate-900 dark:text-white mb-2 line-clamp-2" title={friend.name}>
                {friend.name}
            </h3>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-2">
               <span className="inline-flex items-center gap-1 px-2 py-1 rounded-[6px] bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider border border-slate-200 dark:border-slate-700">
                  <GraduationCap size={11} className="text-slate-400" /> {friend.year}
               </span>
               <span className="inline-flex items-center gap-1 px-2 py-1 rounded-[6px] bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider border border-slate-200 dark:border-slate-700">
                  <School size={11} className="text-slate-400" /> {friend.branch}
               </span>
            </div>

            {/* Status Text */}
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#1AA3A3]">
               <ShieldCheck size={12} />
               <span>CONNECTED</span>
            </div>
        </div>

        {/* 3 Dots Button */}
        <div className="h-full flex items-start -mr-1 -mt-1">
            <button 
                onClick={toggleMenu}
                className="p-2 text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
                <MoreVertical size={18} />
            </button>
        </div>
      </div>

    </motion.div>
  );
};

export default ConnectionCard;