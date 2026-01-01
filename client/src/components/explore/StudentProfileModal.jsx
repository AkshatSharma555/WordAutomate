import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Mail, School, GraduationCap } from 'lucide-react';

const StudentProfileModal = ({ student, onClose }) => {
  if (!student) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop Blur */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-white dark:bg-[#111111] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10"
        >
          {/* Header Banner */}
          <div className="h-24 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-[#1a1a1a] dark:to-[#222]" />

          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-slate-600 dark:text-slate-300 transition-all"
          >
            <X size={20} />
          </button>

          <div className="px-6 pb-8 -mt-12 flex flex-col items-center text-center">
            {/* Profile Pic */}
            <div className="size-24 rounded-full p-1 bg-white dark:bg-[#111111] shadow-lg mb-4">
              <img 
                src={student.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                alt={student.name}
                className="w-full h-full rounded-full object-cover bg-slate-100 dark:bg-black"
                crossOrigin="anonymous"
              />
            </div>

            {/* Name & PRN */}
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1">
              {student.name}
            </h2>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1AA3A3] bg-[#1AA3A3]/10 px-3 py-1 rounded-full mb-6">
               <ShieldCheck size={14} /> {student.prn || 'Verified Student'}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 w-full mb-6">
               <div className="bg-slate-50 dark:bg-[#1a1a1a] p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-bold mb-1">
                     <GraduationCap size={14} /> Year
                  </div>
                  <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{student.year}</p>
               </div>
               <div className="bg-slate-50 dark:bg-[#1a1a1a] p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-bold mb-1">
                     <School size={14} /> Branch
                  </div>
                  <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{student.branch}</p>
               </div>
            </div>

            {/* Email (Protected View) */}
            <div className="w-full bg-slate-50/50 dark:bg-[#1a1a1a]/50 p-3 rounded-xl flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800/50">
               <Mail size={16} className="shrink-0" />
               <span className="truncate">{student.email}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default StudentProfileModal;