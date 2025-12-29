import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, User, UploadCloud, Wand2, Trash2, Eye, X, Loader2, AlertTriangle } from 'lucide-react';
import Button from '../common/Button';

// Modals Components (Dark Mode Fixed)
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, isUploading }) => (
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
                    <div className="p-6 flex flex-col items-center text-center">
                        <div className="size-14 bg-[#F54A00]/10 text-[#F54A00] rounded-full flex items-center justify-center mb-4"><AlertTriangle size={28} strokeWidth={2} /></div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Remove Photo?</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Revert to your default Microsoft profile picture?</p>
                        <div className="flex gap-3 w-full">
                            <button onClick={onClose} disabled={isUploading} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800">Cancel</button>
                            <button onClick={onConfirm} disabled={isUploading} className="flex-1 px-4 py-2.5 rounded-xl bg-[#F54A00] text-white font-semibold hover:bg-[#d14000] flex items-center justify-center gap-2">{isUploading ? <Loader2 size={18} className="animate-spin"/> : "Remove"}</button>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);

const PhotoActionsModal = ({ onClose, onUpload, onView, onDelete, isUploading }) => (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl w-full max-w-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-slate-50 dark:bg-[#222] px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-semibold text-slate-800 dark:text-white">Profile Photo</h3>
                <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-slate-200"/></button>
            </div>
            <div className="py-2">
                <button onClick={onView} className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"><Eye size={20} className="text-[#1AA3A3]" /> View Photo</button>
                <button onClick={onUpload} className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"><UploadCloud size={20} className="text-[#1AA3A3]" /> Upload Photo</button>
                <button onClick={onDelete} disabled={isUploading} className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-[#F54A00]/5 text-[#F54A00] font-medium border-t border-slate-100 dark:border-slate-800">{isUploading ? <Loader2 className="animate-spin" size={20}/> : <Trash2 size={20}/>} Remove Photo</button>
            </div>
        </motion.div>
    </div>
);

const ImageViewerModal = ({ imageUrl, onClose }) => (
    <div className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center p-4" onClick={onClose}>
        <button onClick={onClose} className="absolute top-5 right-5 text-white/70 hover:text-white bg-white/10 p-2 rounded-full"><X size={24} /></button>
        <img src={imageUrl} className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
    </div>
);

// --- MAIN PROFILE SECTION ---
const ProfileSection = ({ 
    currentUser, 
    previewUrl, 
    isCustomPhoto, 
    selectedImage, 
    onImageSelect, 
    onDelete, 
    onRemoveBgToggle, 
    removeBackground,
    isUploading 
}) => {
    const fileInputRef = useRef(null);
    const [showActions, setShowActions] = useState(false);
    const [showViewer, setShowViewer] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleUploadClick = () => { setShowActions(false); fileInputRef.current.click(); };
    const handleDeleteClick = () => {
        setShowActions(false);
        if (selectedImage) { onImageSelect(null); return; } // Clear selection
        if (!isCustomPhoto) return; // Prevent deleting official
        setShowDeleteConfirm(true);
    };

    return (
        <div className="bg-white dark:bg-[#111111] rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/60 dark:border-slate-800 relative transition-colors duration-300">
            
            {/* Modals */}
            {showActions && <PhotoActionsModal onClose={() => setShowActions(false)} onUpload={handleUploadClick} onView={() => {setShowActions(false); setShowViewer(true)}} onDelete={handleDeleteClick} isUploading={isUploading} />}
            {showViewer && <ImageViewerModal imageUrl={previewUrl} onClose={() => setShowViewer(false)} />}
            {showDeleteConfirm && <DeleteConfirmationModal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} onConfirm={() => { onDelete(); setShowDeleteConfirm(false); }} isUploading={isUploading} />}

            <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-full md:w-auto flex flex-col items-center">
                     <div className="relative group cursor-pointer select-none" onClick={() => setShowActions(true)}>
                        <div className="size-32 rounded-full border-4 border-slate-50 dark:border-slate-800 shadow-inner overflow-hidden relative bg-slate-100 dark:bg-[#222]">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300"><User size={48} /></div>
                            )}
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="text-white drop-shadow-md" size={28} />
                            </div>
                        </div>
                        <div className="absolute bottom-1 right-1 bg-[#1AA3A3] text-white p-2 rounded-full shadow-lg border-2 border-white dark:border-[#111]"><Camera size={16} /></div>
                    </div>
                    <input type="file" ref={fileInputRef} onChange={onImageSelect} className="hidden" accept="image/png, image/jpeg" />
                </div>

                <div className="flex-1 w-full">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Profile Photo</h3>
                    <div className="flex items-center gap-2 mb-5 mt-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${isCustomPhoto ? 'bg-[#1AA3A3]/10 text-[#1AA3A3]' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                            {isCustomPhoto ? "Custom Upload" : "Official Outlook"}
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <Button onClick={() => setShowActions(true)} className="bg-[#2F2F2F] dark:bg-[#222] hover:bg-black dark:hover:bg-black text-white border-none justify-center py-2.5 px-5">
                            Edit Photo
                        </Button>

                        {selectedImage && (
                            <div onClick={onRemoveBgToggle} className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer border transition-all duration-300 select-none ${removeBackground ? 'bg-[#F54A00]/10 border-[#F54A00]/30 text-[#F54A00]' : 'bg-white dark:bg-[#1a1a1a] border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'}`}>
                                <Wand2 size={16} className={removeBackground ? "fill-[#F54A00]/20" : ""} />
                                <span className="text-sm font-medium">Remove BG</span>
                                {removeBackground && <span className="ml-1 text-xs bg-[#F54A00] text-white px-1.5 rounded font-bold">ON</span>}
                            </div>
                        )}
                    </div>
                    
                    {removeBackground && selectedImage && (
                        <div className="bg-[#F54A00]/5 border border-[#F54A00]/20 rounded-lg p-3 flex gap-2 text-[#F54A00] text-xs md:text-sm items-start">
                            <span className="font-bold mt-0.5">ⓘ</span>
                            <p>Save changes to apply AI background removal.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileSection;