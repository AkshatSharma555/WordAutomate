import React, { useState } from 'react';
import { FileText, Download, Calendar, Check, Eye, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const FileCard = ({ file, type, onMarkSeen }) => {
  const [downloading, setDownloading] = useState(false);

  // Handle Download & Mark as Seen
  const handleDownload = async () => {
    setDownloading(true);
    
    // 1. Open PDF
    if (file.fileUrl) window.open(file.fileUrl, '_blank');

    // 2. Mark as Seen (If received and currently unread)
    if (type === 'received' && !file.isSeen) {
        try {
            await axios.post(`${API_URL}/workspace/read`, { shareId: file.id }, { withCredentials: true });
            onMarkSeen(file.id); // Update UI instantly
        } catch (err) {
            console.error("Read receipt failed", err);
        }
    }
    
    setTimeout(() => setDownloading(false), 1000);
  };

  // Date Formatter
  const formatDate = (dateString) => {
      const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`group relative bg-white dark:bg-[#111111] p-4 rounded-xl border transition-all flex flex-col md:flex-row items-center gap-4
        ${!file.isSeen && type === 'received' 
            ? 'border-blue-200 dark:border-blue-900/40 shadow-[0_0_15px_rgba(59,130,246,0.05)]' 
            : 'border-slate-200 dark:border-slate-800 hover:shadow-md'
        }`}
    >
      {/* Unread Indicator Dot */}
      {!file.isSeen && type === 'received' && (
        <div className="absolute top-4 right-4 md:top-1/2 md:-translate-y-1/2 md:left-2 md:right-auto">
            <div className="size-2.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_#3B82F6]"></div>
        </div>
      )}

      {/* 1. Icon Block */}
      <div className={`size-12 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
          !file.isSeen && type === 'received' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-900'
      }`}>
        <FileText size={20} strokeWidth={2} />
      </div>

      {/* 2. File Info */}
      <div className="flex-1 min-w-0 text-center md:text-left w-full pl-0 md:pl-2">
        <h3 className={`text-sm font-bold truncate mb-1 ${!file.isSeen && type === 'received' ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
          {file.fileName}
        </h3>
        
        <div className="flex items-center justify-center md:justify-start gap-3 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1">
             <Calendar size={12} /> {formatDate(file.sharedAt)}
          </span>
          {/* Status for Sent Items */}
          {type === 'sent' && (
             <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${file.isSeen ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>
                {file.isSeen ? <Eye size={12} /> : <Clock size={12} />}
                {file.isSeen ? 'Seen' : 'Delivered'}
             </span>
          )}
        </div>
      </div>

      {/* 3. User Info (Sender or Receiver) */}
      <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800 w-full md:w-auto justify-center md:justify-start">
         <div className="text-right hidden md:block">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">
                {type === 'received' ? 'From' : 'To'}
            </p>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-[100px]">
                {file.user?.name || "Unknown"}
            </p>
         </div>
         <img 
            src={file.user?.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
            alt="User" 
            className="size-8 rounded-full bg-slate-200 object-cover border border-white dark:border-[#222]" 
         />
      </div>

      {/* 4. Action Button */}
      <button 
        onClick={handleDownload}
        disabled={downloading}
        className="w-full md:w-auto h-10 px-5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-sm active:scale-95"
      >
        {downloading ? (
            <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></span>
        ) : (
            <Download size={14} /> 
        )}
        <span className="">Download</span>
      </button>

    </motion.div>
  );
};

export default FileCard;