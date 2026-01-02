import React, { useState } from 'react';
import { FileText, ArrowDownToLine, Calendar, CheckCircle2, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const FileCard = ({ file, type, onMarkSeen }) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async (e) => {
    e.stopPropagation(); // Stop parent click events
    setDownloading(true);
    
    // 1. Open PDF
    if (file.fileUrl) window.open(file.fileUrl, '_blank');

    // 2. Mark as Seen logic
    if (type === 'received' && !file.isSeen) {
        try {
            await axios.post(`${API_URL}/workspace/read`, { shareId: file.id }, { withCredentials: true });
            onMarkSeen(file.id);
        } catch (err) {
            console.error("Read receipt failed", err);
        }
    }
    
    setTimeout(() => setDownloading(false), 1000);
  };

  // Improved Date Formatter
  const formatDate = (dateString) => {
      const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const isUnread = !file.isSeen && type === 'received';

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`group relative p-4 rounded-2xl border transition-all duration-300 w-full
        ${isUnread
            ? 'bg-blue-50/40 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800 shadow-[0_4px_20px_-10px_rgba(59,130,246,0.15)]' 
            : 'bg-white dark:bg-[#111111] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-black/50'
        }`}
    >
      {/* Unread Indicator Dot */}
      {isUnread && (
        <div className="absolute top-4 right-4 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
        
        {/* 1. Icon Section */}
        <div className={`shrink-0 size-12 rounded-xl flex items-center justify-center transition-colors ${
            isUnread 
            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
        }`}>
            <FileText size={24} strokeWidth={1.5} />
        </div>

        {/* 2. Content Section */}
        <div className="flex-1 min-w-0">
            <h3 className={`text-sm sm:text-base font-bold truncate mb-1.5 ${
                isUnread ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-200'
            }`}>
                {file.fileName}
            </h3>
            
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded-md border border-slate-100 dark:border-slate-800">
                    <Calendar size={12} /> {formatDate(file.sharedAt)}
                </span>

                {/* Sent Status Badges */}
                {type === 'sent' && (
                    <span className={`flex items-center gap-1.5 px-2 py-1 rounded-md border ${
                        file.isSeen 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30' 
                        : 'bg-slate-50 text-slate-500 border-slate-100 dark:bg-slate-800 dark:border-slate-700'
                    }`}>
                        {file.isSeen ? <Eye size={12} /> : <CheckCircle2 size={12} />}
                        {file.isSeen ? 'Seen' : 'Delivered'}
                    </span>
                )}
            </div>
        </div>

        {/* 3. Actions Section (User + Download) */}
        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 mt-1 sm:mt-0">
            
            {/* User Info */}
            <div className="flex items-center gap-3 text-right">
                <div className="hidden lg:block">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">
                        {type === 'received' ? 'From' : 'To'}
                    </p>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-[100px]">
                        {file.user?.name?.split(' ')[0] || "Unknown"}
                    </p>
                </div>
                <img 
                    src={file.user?.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                    alt="User" 
                    className="size-9 rounded-full bg-slate-100 object-cover border border-white dark:border-[#222] shadow-sm" 
                    title={file.user?.name}
                />
            </div>

            {/* Download Button */}
            <button 
                onClick={handleDownload}
                disabled={downloading}
                className="group flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-black text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {downloading ? (
                    <span className="h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                    <ArrowDownToLine size={16} className="group-hover:translate-y-0.5 transition-transform" /> 
                )}
                <span>Download</span>
            </button>
        </div>

      </div>
    </motion.div>
  );
};

export default FileCard;