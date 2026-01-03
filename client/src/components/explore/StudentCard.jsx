import React, { useState } from 'react';
import { UserPlus, Loader2, ShieldCheck, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const StudentCard = ({ student, setToast, onViewProfile }) => {
  const [status, setStatus] = useState(student.friendStatus || 'none');
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const navigate = useNavigate();

  // 1. Send Request
  const handleConnect = async (e) => {
    e.stopPropagation(); 
    const originalStatus = status;
    setStatus('sent'); 
    setLoading(true);
    
    try {
      await axios.post(`${API_URL}/user/friend-request/send`, { receiverId: student._id }, { withCredentials: true });
      setToast({ show: true, message: `Request sent to ${student.name}`, type: 'success' });
    } catch (error) {
      setStatus(originalStatus);
      setToast({ show: true, message: "Failed to send request", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // 2. Withdraw Request
  const handleWithdraw = async (e) => {
    e.stopPropagation();
    setShowConfirm(false);
    setLoading(true);

    try {
      const { data } = await axios.post(`${API_URL}/user/friend-request/withdraw`, { receiverId: student._id }, { withCredentials: true });
      if (data.success) {
        setStatus('none');
        setToast({ show: true, message: "Request withdrawn", type: 'info' });
      } else {
        setToast({ show: true, message: data.message, type: 'error' });
      }
    } catch (error) {
      setToast({ show: true, message: "Server error", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // 3. Respond
  const handleRespond = (e) => {
    e.stopPropagation();
    navigate('/friends'); 
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
      onClick={() => onViewProfile(student)} 
      className="group relative bg-white dark:bg-[#151515] rounded-[24px] p-5 border border-slate-200/60 dark:border-white/5 shadow-sm hover:border-[#1AA3A3]/30 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
    >
      
      {/* --- CONFIRMATION OVERLAY --- */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            onClick={(e) => e.stopPropagation()} 
            className="absolute inset-0 z-50 bg-white/95 dark:bg-[#111]/95 flex flex-col items-center justify-center p-4 text-center rounded-[24px]"
          >
             <div className="size-10 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-500 mb-2">
                <AlertCircle size={20} />
             </div>
             <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Withdraw?</h4>
             <div className="flex gap-2 w-full mt-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowConfirm(false); }}
                  className="flex-1 py-2 rounded-lg border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleWithdraw}
                  className="flex-1 py-2 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-600 shadow-sm"
                >
                  Yes
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#1AA3A3] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* TOP: Badges */}
      <div className="flex justify-between items-start mb-3">
         <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
            <ShieldCheck size={10} className="text-[#1AA3A3]" />
            <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">{student.prn || 'Verified'}</span>
         </div>
         <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 px-2 py-1 rounded-md">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{student.year}</span>
            <div className="h-2 w-px bg-slate-200 dark:bg-white/10"></div>
            <span className="text-[10px] font-black text-[#F54A00] tracking-wide">{student.branch}</span>
         </div>
      </div>

      {/* MIDDLE: Avatar & Info */}
      <div className="flex flex-col items-center flex-1">
         {/* Compact Avatar */}
         <div className="relative mb-3 group-hover:scale-105 transition-transform duration-300">
            <div className="size-16 rounded-full p-0.5 bg-white dark:bg-[#151515] border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden">
               <img 
                 src={student.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                 alt={student.name}
                 className="w-full h-full rounded-full object-cover bg-slate-50 dark:bg-black"
                 crossOrigin="anonymous"
               />
            </div>
         </div>

         {/* Name */}
         <h3 className="text-base font-bold text-slate-900 dark:text-white text-center leading-tight line-clamp-2 min-h-[1.25rem] px-1">
            {student.name}
         </h3>
      </div>

      {/* BOTTOM: Buttons */}
      <div className="mt-4 pt-3 border-t border-slate-50 dark:border-white/5">
        {status === 'none' && (
          <button 
            onClick={handleConnect}
            disabled={loading}
            className="w-full h-9 rounded-lg bg-[#1AA3A3] hover:bg-[#158585] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] shadow-sm hover:shadow-md hover:shadow-[#1AA3A3]/20"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <><UserPlus size={14} /> <span>Connect</span></>}
          </button>
        )}

        {status === 'sent' && (
          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => e.stopPropagation()} 
              className="flex-1 h-9 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-400 dark:text-slate-500 text-[10px] font-bold flex items-center justify-center gap-1 cursor-default"
            >
              <Clock size={12} /> Pending
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setShowConfirm(true); }}
              className="h-9 px-3 rounded-lg border border-red-100 dark:border-red-900/20 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 text-[10px] font-bold transition-colors"
            >
              Withdraw
            </button>
          </div>
        )}
        
        {status === 'received' && (
          <button 
            onClick={handleRespond}
            className="w-full h-9 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
          >
             <span>Respond</span> <ArrowRight size={14} />
          </button>
        )}
      </div>

    </motion.div>
  );
};

export default StudentCard;