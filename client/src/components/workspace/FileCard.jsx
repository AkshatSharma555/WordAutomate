import React, { useState } from 'react';
import { FileText, ArrowDownToLine, Calendar, CheckCircle2, Eye, User } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const FileCard = ({ file, type, onMarkSeen }) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async (e) => {
    e.stopPropagation();
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
      whileHover={{ y: -4, boxShadow: "0 12px 30px -10px rgba(0,0,0,0.1)" }}
      className={`group relative p-5 rounded-[24px] border transition-all duration-300 w-full overflow-hidden
        ${isUnread
            ? 'bg-blue-50/50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800/50' 
            : 'bg-white dark:bg-[#151515] border-slate-200/60 dark:border-white/5 hover:border-[#1AA3A3]/30'
        }`}
    >
      
      {/* Unread Glow Line */}
      {isUnread && (
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500 rounded-l-2xl" />
      )}

      <div className="flex flex-col sm:flex-row gap-5 sm:items-center">
        
        {/* 1. Icon Box */}
        <div className={`shrink-0 size-14 rounded-2xl flex items-center justify-center transition-colors border ${
            isUnread 
            ? 'bg-blue-100 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' 
            : 'bg-slate-50 text-slate-500 border-slate-100 dark:bg-white/5 dark:text-slate-400 dark:border-white/5'
        }`}>
            <FileText size={26} strokeWidth={1.5} />
        </div>

        {/* 2. Content Section */}
        <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
                <h3 className={`text-base font-bold truncate ${
                    isUnread ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-200'
                }`}>
                    {file.fileName}
                </h3>
                {isUnread && (
                    <span className="shrink-0 size-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                )}
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/5">
                    <Calendar size={12} /> {formatDate(file.sharedAt)}
                </span>

                {/* Sent Status Badges */}
                {type === 'sent' && (
                    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold ${
                        file.isSeen 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30' 
                        : 'bg-slate-50 text-slate-500 border-slate-100 dark:bg-white/5 dark:text-slate-400 dark:border-white/10'
                    }`}>
                        {file.isSeen ? <Eye size={12} /> : <CheckCircle2 size={12} />}
                        {file.isSeen ? 'Seen' : 'Delivered'}
                    </span>
                )}
            </div>
        </div>

        {/* 3. Actions Section */}
        <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 mt-1 sm:mt-0">
            
            {/* User Info (Squircle Avatar) */}
            <div className="flex items-center gap-3 text-right">
                <div className="hidden lg:block">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        {type === 'received' ? 'From' : 'To'}
                    </p>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-[100px]">
                        {file.user?.name?.split(' ')[0] || "Unknown"}
                    </p>
                </div>
                
                <div className="size-10 rounded-2xl bg-slate-100 dark:bg-white/10 p-0.5 shadow-sm border border-white dark:border-white/5 overflow-hidden">
                    {file.user?.profilePicture ? (
                        <img 
                            src={file.user.profilePicture} 
                            alt="User" 
                            className="w-full h-full object-cover rounded-xl" 
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <User size={18} />
                        </div>
                    )}
                </div>
            </div>

            {/* Separator */}
            <div className="hidden sm:block w-px h-10 bg-slate-100 dark:bg-white/5"></div>

            {/* Download Button */}
            <button 
                onClick={handleDownload}
                disabled={downloading}
                className="group flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-[#1AA3A3] dark:bg-white dark:hover:bg-[#1AA3A3] text-white dark:text-black dark:hover:text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {downloading ? (
                    <span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                    <ArrowDownToLine size={16} className="group-hover:-translate-y-0.5 transition-transform duration-300" /> 
                )}
                <span>Download</span>
            </button>
        </div>

      </div>
    </motion.div>
  );
};

export default FileCard;