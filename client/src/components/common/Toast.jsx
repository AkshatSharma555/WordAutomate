import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const theme = {
    success: {
      iconColor: 'text-[#1AA3A3]',
      bgColor: 'bg-[#1AA3A3]/10',
      borderColor: 'border-[#1AA3A3]/20',
      titleColor: 'text-[#1AA3A3]'
    },
    error: {
      iconColor: 'text-[#F54A00]',
      bgColor: 'bg-[#F54A00]/10',
      borderColor: 'border-[#F54A00]/20',
      titleColor: 'text-[#F54A00]'
    }
  };

  const style = theme[type] || theme.success;

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className="fixed top-24 right-6 z-[200] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl bg-white dark:bg-[#1a1a1a] border border-slate-100 dark:border-slate-800 min-w-[320px]"
        >
          <div className={`p-2.5 rounded-full ${style.bgColor} ${style.iconColor}`}>
            {type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          </div>

          <div className="flex-1">
            <h4 className={`text-sm font-bold ${style.titleColor}`}>
              {type === 'success' ? 'Success' : 'Attention'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              {message}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
