import React, { useState } from 'react';
import { UserPlus, UserCheck, Loader2, ShieldCheck, Clock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // 👈 IMPORT ADDED

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const StudentCard = ({ student, setToast, onViewProfile }) => {
  const [status, setStatus] = useState(student.friendStatus || 'none');
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const navigate = useNavigate(); // 👈 INIT HOOK

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

  // 3. Navigate to Requests Page
  const handleRespond = (e) => {
    e.stopPropagation();
    navigate('/friends'); // 👈 Redirects to Network/Friends page
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
      onClick={() => onViewProfile(student)} 
      className="bg-white dark:bg-[#111111] rounded-[24px] p-6 border border-slate-200/60 dark:border-slate-800 shadow-sm transition-all duration-300 relative group cursor-pointer overflow-hidden"
    >
      
      {/* --- CONFIRMATION OVERLAY --- */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()} 
            className="absolute inset-0 z-50 bg-white/95 dark:bg-[#111111]/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center"
          >
             <div className="size-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-500 mb-3">
                <AlertCircle size={20} />
             </div>
             <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1">Withdraw Request?</h4>
             <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 px-2">
               Are you sure you want to cancel the request to {student.name.split(' ')[0]}?
             </p>
             <div className="flex gap-2 w-full">
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowConfirm(false); }}
                  className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleWithdraw}
                  className="flex-1 py-2 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600 shadow-lg shadow-red-500/20"
                >
                  Yes, Withdraw
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- NORMAL CARD CONTENT --- */}
      
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#1AA3A3]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Badges */}
      <div className="absolute top-4 right-4 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-100 dark:border-slate-800 px-3 py-1 rounded-full flex items-center gap-2 shadow-sm">
         <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{student.year}</span>
         <div className="size-1 rounded-full bg-slate-300 dark:bg-slate-600" />
         <span className="text-[10px] font-extrabold text-[#F54A00] tracking-wider">{student.branch}</span>
      </div>

      {/* Avatar */}
      <div className="flex justify-center mb-4 mt-2">
         <div className="relative group-hover:scale-105 transition-transform duration-300">
            <div className="absolute inset-0 bg-[#1AA3A3]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="size-[88px] rounded-full p-1 bg-white dark:bg-[#111111] border border-slate-100 dark:border-slate-800 relative z-10 shadow-sm">
              <img 
                src={student.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                alt={student.name}
                className="w-full h-full rounded-full object-cover bg-slate-50 dark:bg-black"
                crossOrigin="anonymous"
              />
            </div>
         </div>
      </div>

      {/* Info */}
      <div className="text-center mb-6">
         <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1 truncate px-2">{student.name}</h3>
         <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <ShieldCheck size={12} className="text-[#1AA3A3]" />
            <span className="text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400 tracking-tight">{student.prn || 'NO PRN'}</span>
         </div>
      </div>

      {/* Buttons */}
      <div className="relative z-20">
        {status === 'none' && (
          <button 
            onClick={handleConnect}
            disabled={loading}
            className="w-full h-11 rounded-xl bg-[#1AA3A3] hover:bg-[#159696] text-white text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-[#1AA3A3]/20"
          >
            {loading ? <Loader2 size={18} className="animate-spin text-white/80" /> : <><UserPlus size={18} /> <span>Connect</span></>}
          </button>
        )}

        {status === 'sent' && (
          <div className="flex flex-col items-center gap-2 animate-in fade-in zoom-in duration-300">
            <button 
              onClick={(e) => e.stopPropagation()} 
              className="w-full h-11 rounded-xl bg-slate-100 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm font-semibold flex items-center justify-center gap-2 cursor-default"
            >
              <Clock size={16} className="text-slate-400" />
              <span>Request Sent</span>
            </button>
            
            <button 
              onClick={(e) => { e.stopPropagation(); setShowConfirm(true); }}
              className="text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 py-1"
            >
              Withdraw Request
            </button>
          </div>
        )}
        
        {/* 👇 UPDATED: ACTIONABLE BUTTON FOR RECEIVED REQUESTS */}
        {status === 'received' && (
          <button 
            onClick={handleRespond}
            className="w-full h-11 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-purple-500/20"
          >
             <span>Respond</span>
             <ArrowRight size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default StudentCard;