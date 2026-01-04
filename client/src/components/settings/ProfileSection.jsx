import React, { useState } from 'react';
import { User, ShieldCheck, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Simple Image Viewer Modal (Only for viewing, no actions)
const ImageViewerModal = ({ imageUrl, onClose }) => (
  <div className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center p-4" onClick={onClose}>
    <button className="absolute top-5 right-5 text-white/70 hover:text-white bg-white/10 p-2 rounded-full">
      <X size={24} />
    </button>
    <img
      src={imageUrl}
      alt="Full Profile"
      className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    />
  </div>
);

const ProfileSection = ({ currentUser }) => {
  const [showViewer, setShowViewer] = useState(false);
  
  // Safe fallback if profilePicture is empty
  const profileImage = currentUser?.profilePicture;

  return (
    <div className="bg-white dark:bg-[#111111] rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/60 dark:border-slate-800 transition-colors duration-300 mb-6">
      
      {/* Image Viewer Modal */}
      <AnimatePresence>
        {showViewer && profileImage && (
            <ImageViewerModal imageUrl={profileImage} onClose={() => setShowViewer(false)} />
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row items-center gap-8">
        
        {/* Profile Image Display */}
        <div className="relative group cursor-pointer" onClick={() => profileImage && setShowViewer(true)}>
          <div className="size-32 rounded-full p-1 border-2 border-dashed border-slate-300 dark:border-slate-700 group-hover:border-[#1AA3A3] transition-colors">
            <div className="size-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 relative flex items-center justify-center">
               {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => { e.target.style.display = 'none'; }} 
                  />
               ) : (
                  <User size={40} className="text-slate-400" />
               )}
            </div>
          </div>
          
          {/* Verified Badge */}
          <div className="absolute bottom-1 right-1 bg-[#1AA3A3] text-white p-1.5 rounded-full border-4 border-white dark:border-[#111111] shadow-sm" title="Verified Student">
             <ShieldCheck size={16} />
          </div>
        </div>

        {/* Info Text */}
        <div className="text-center md:text-left flex-1 space-y-3">
            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                    {currentUser?.name || "Student"}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                    {currentUser?.email}
                </p>
            </div>

            {/* Microsoft Sync Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-[#0078D4]/10 text-[#0078D4] dark:text-[#2b88d8] text-xs font-bold rounded-lg border border-blue-100 dark:border-[#0078D4]/20 select-none">
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="MS" className="w-3.5 h-3.5" />
                Linked with Microsoft Account
            </div>
            
            {/* Info Message */}
            <div className="flex items-start gap-2 max-w-sm mx-auto md:mx-0 bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                <Info size={14} className="text-slate-400 mt-0.5 shrink-0" />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed text-left">
                    Your profile photo is synced directly from your college Microsoft Outlook account. To change it, please update your photo on Microsoft Teams or Outlook.
                </p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ProfileSection;