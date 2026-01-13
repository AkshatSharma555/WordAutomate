import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AccessDeniedModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
        
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-white dark:bg-[#111111] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="p-6 pt-8 text-center">
            {/* Icon */}
            <div className="mx-auto w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mb-4">
               <ShieldAlert className="text-orange-500" size={32} />
            </div>

            {/* Text */}
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Action Restricted
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              To perform this action (like generating documents), we need your <strong>PRN</strong> and <strong>Branch</strong> details. This ensures your files are formatted correctly.
            </p>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => navigate('/settings')}
                className="w-full py-3 bg-[#1AA3A3] hover:bg-[#158585] text-white font-bold rounded-xl shadow-lg shadow-[#1AA3A3]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Complete Profile in Settings <ArrowRight size={18} />
              </button>
              
              <button 
                onClick={onClose}
                className="text-sm font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AccessDeniedModal;