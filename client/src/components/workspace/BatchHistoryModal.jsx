import React, { useState } from 'react';
import { X, Calendar, ChevronDown, ChevronUp, Eye, Clock, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- SUB COMPONENT: Single Batch Accordion ---
const BatchItem = ({ batch, index }) => {
    const [expanded, setExpanded] = useState(index === 0); // First one open by default

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', { 
            weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
        });
    };

    const seenCount = batch.recipients.filter(r => r.isSeen).length;
    const totalCount = batch.recipients.length;

    return (
        <div className={`border rounded-xl overflow-hidden mb-3 transition-all duration-200 ${
            expanded 
            ? 'border-slate-300 dark:border-slate-700 shadow-sm bg-white dark:bg-[#151515]' 
            : 'border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-[#111]'
        }`}>
            {/* Header Click to Expand */}
            <div 
                onClick={() => setExpanded(!expanded)}
                className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${
                    expanded 
                    ? 'bg-slate-50 dark:bg-[#1a1a1a]' 
                    : 'hover:bg-slate-50 dark:hover:bg-[#151515]'
                }`}
            >
                <div className="flex items-center gap-4">
                    {/* Batch Number Badge */}
                    <div className="size-10 rounded-xl bg-white dark:bg-[#222] border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold shadow-sm">
                        <span className="text-xs">#{index + 1}</span>
                    </div>
                    
                    <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                           <Calendar size={14} className="text-slate-500 dark:text-slate-400" /> 
                           {formatDate(batch.batchTime)}
                        </p>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-500 mt-0.5">
                           Sent to <span className="text-slate-700 dark:text-slate-300 font-bold">{totalCount} students</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Visual Progress Dots (Preview) */}
                    <div className="hidden sm:flex items-center gap-2 bg-white dark:bg-black px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
                        <div className="flex -space-x-1">
                            {batch.recipients.slice(0, 5).map((r, i) => (
                                <div 
                                    key={i} 
                                    className={`size-2.5 rounded-full ring-2 ring-white dark:ring-black ${
                                        r.isSeen ? 'bg-[#1AA3A3]' : 'bg-slate-300 dark:bg-slate-700'
                                    }`} 
                                    title={r.isSeen ? "Seen" : "Delivered"}
                                />
                            ))}
                            {totalCount > 5 && <span className="size-2.5 flex items-center justify-center text-[8px] text-slate-400 pl-1">+</span>}
                        </div>
                        <div className="h-3 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                            {seenCount}/{totalCount}
                        </span>
                    </div>

                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                        {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                </div>
            </div>

            {/* Expanded List */}
            <AnimatePresence>
                {expanded && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: 'auto', opacity: 1 }} 
                        exit={{ height: 0, opacity: 0 }} 
                        className="bg-white dark:bg-[#111]"
                    >
                        <div className="p-2 space-y-1 border-t border-slate-100 dark:border-slate-800">
                            {batch.recipients.map((recipient) => (
                                <div 
                                    key={recipient.shareId} 
                                    className="group flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
                                >
                                    {/* User Info */}
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <img 
                                                src={recipient.img || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                                                alt="" 
                                                className="size-9 rounded-full border border-slate-200 dark:border-slate-700 object-cover bg-slate-100" 
                                            />
                                            {/* Status Dot on Avatar */}
                                            <div className={`absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-white dark:border-[#111] ${
                                                recipient.isSeen ? 'bg-[#1AA3A3]' : 'bg-slate-300 dark:bg-slate-600'
                                            }`} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                                {recipient.name || "Unknown Student"}
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-medium">
                                                {recipient.isSeen ? "Viewed Document" : "Delivered"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border ${
                                        recipient.isSeen 
                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30' 
                                        : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                                    }`}>
                                        {recipient.isSeen ? <Eye size={14} /> : <Clock size={14} />}
                                        {recipient.isSeen ? 'Seen' : 'Delivered'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- MAIN MODAL COMPONENT ---
const BatchHistoryModal = ({ file, onClose }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-white dark:bg-[#0a0a0a] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] ring-1 ring-slate-900/5"
            >
                {/* 1. Header */}
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-white dark:bg-[#111]">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight line-clamp-1">
                            {file.fileName}
                        </h2>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                            <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                                {file.batches.length} Batches
                            </span>
                            <span>•</span>
                            <span>Total History</span>
                        </p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-400 transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* 2. Scrollable Content */}
                <div className="p-4 overflow-y-auto custom-scrollbar flex-1 bg-[#F9FAFB] dark:bg-black/50">
                    {file.batches.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                            <p>No history found.</p>
                        </div>
                    ) : (
                        file.batches.map((batch, index) => (
                            <BatchItem key={index} batch={batch} index={index} />
                        ))
                    )}
                </div>

                {/* 3. Footer Stats */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#111] flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
                        <User size={16} className="text-slate-400" />
                        Total Reached: <span className="text-slate-900 dark:text-white text-sm">{file.totalStudents}</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default BatchHistoryModal;