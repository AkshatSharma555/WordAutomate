import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Mail, School, GraduationCap, UserCheck } from 'lucide-react';

const StudentProfileModal = ({ student, onClose }) => {
  if (!student) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        
        {/* 1. BACKDROP (Dark Overlay) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all"
        />

        {/* 2. MODAL CARD (Floating) */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-sm bg-white dark:bg-[#151515] rounded-[32px] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden z-10"
        >
          {/* Header Banner */}
          <div className="h-32 bg-gradient-to-br from-[#1AA3A3] to-teal-700 relative">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
          </div>

          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white transition-all z-20"
          >
            <X size={18} />
          </button>

          {/* Profile Content */}
          <div className="px-6 pb-8 -mt-14 flex flex-col items-center text-center relative z-10">
            
            {/* Avatar Ring */}
            <div className="size-28 rounded-full p-1.5 bg-white dark:bg-[#151515] shadow-xl mb-4">
              <img 
                src={student.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                alt={student.name}
                className="w-full h-full rounded-full object-cover bg-slate-100 dark:bg-black"
                crossOrigin="anonymous"
              />
            </div>

            {/* Name & Badge */}
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">
              {student.name}
            </h2>
            
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1AA3A3] bg-[#1AA3A3]/10 px-3 py-1 rounded-full mb-6 border border-[#1AA3A3]/20">
               <ShieldCheck size={12} /> {student.prn || 'Verified Student'}
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3 w-full mb-6">
               <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5 flex flex-col items-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1">
                     <GraduationCap size={12} /> Year
                  </span>
                  <span className="text-lg font-bold text-slate-800 dark:text-white">{student.year}</span>
               </div>
               
               <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5 flex flex-col items-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1">
                     <School size={12} /> Branch
                  </span>
                  <span className="text-lg font-bold text-slate-800 dark:text-white">{student.branch}</span>
               </div>
            </div>

            {/* Contact / Action */}
            <div className="w-full bg-slate-50 dark:bg-white/5 p-3 rounded-xl flex items-center justify-between border border-slate-100 dark:border-white/5">
               <div className="flex items-center gap-3 overflow-hidden">
                   <div className="size-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center shrink-0">
                      <Mail size={18} />
                   </div>
                   <div className="flex flex-col items-start min-w-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Email Address</span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate w-full max-w-[180px]">{student.email}</span>
                   </div>
               </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default StudentProfileModal;