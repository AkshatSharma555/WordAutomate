import React, { useState } from 'react';
import { X, Calendar, ChevronDown, ChevronUp, Eye, Clock, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BatchItem = ({ batch, index }) => {
    const [expanded, setExpanded] = useState(index === 0); // First one open by default

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', { 
            weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
        });
    };

    const seenCount = batch.recipients.filter(r => r.isSeen).length;

    return (
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden mb-3">
            {/* Header Click to Expand */}
            <div 
                onClick={() => setExpanded(!expanded)}
                className="p-3 bg-slate-50 dark:bg-[#151515] flex items-center justify-between cursor-pointer hover:bg-slate-100 dark:hover:bg-[#1a1a1a] transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-white dark:bg-[#222] border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500">
                        <span className="text-xs font-bold">#{index + 1}</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                           <Calendar size={12} /> {formatDate(batch.batchTime)}
                        </p>
                        <p className="text-[10px] text-slate-400">
                           Sent to {batch.recipients.length} students
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Mini Progress */}
                    <div className="flex items-center gap-1.5 bg-white dark:bg-black px-2 py-1 rounded border border-slate-100 dark:border-slate-800">
                        <div className="flex space-x-0.5">
                            {batch.recipients.map((r, i) => (
                                <div key={i} className={`size-1.5 rounded-full ${r.isSeen ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
                            ))}
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">{seenCount}/{batch.recipients.length}</span>
                    </div>
                    {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
            </div>

            {/* Expanded List */}
            <AnimatePresence>
                {expanded && (
                    <motion.div 
                        initial={{ height: 0 }} 
                        animate={{ height: 'auto' }} 
                        exit={{ height: 0 }} 
                        className="bg-white dark:bg-[#111111]"
                    >
                        <div className="p-2 space-y-1 border-t border-slate-100 dark:border-slate-800">
                            {batch.recipients.map((recipient) => (
                                <div key={recipient.shareId} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <div className="flex items-center gap-3">
                                        <img src={recipient.img} alt="" className="size-8 rounded-full border border-slate-100 dark:border-slate-800 object-cover" />
                                        <p className="text-xs font-bold text-slate-800 dark:text-white">{recipient.name}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                            recipient.isSeen ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                            {recipient.isSeen ? 'Seen' : 'Delivered'}
                                        </div>
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

const BatchHistoryModal = ({ file, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white dark:bg-[#0a0a0a] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
                {/* Header */}
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-[#111111]">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">{file.fileName}</h2>
                        <p className="text-xs text-slate-500">History of all shares for this document.</p>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-4 overflow-y-auto custom-scrollbar flex-1">
                    {file.batches.map((batch, index) => (
                        <BatchItem key={index} batch={batch} index={index} />
                    ))}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#111111] text-center">
                    <p className="text-[10px] text-slate-400">
                        This document has been shared with {file.totalStudents} students in total.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default BatchHistoryModal;