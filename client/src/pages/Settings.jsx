import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext'; 
import Breadcrumb from '../components/common/Breadcrumb';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import ProfileSection from '../components/settings/ProfileSection';
import ThemeToggle from '../components/common/ThemeToggle'; 
import Toast from '../components/common/Toast'; 
import { Loader2, Settings as SettingsIcon, User, Mail, ShieldCheck, Moon, Sun, Save } from 'lucide-react';

const Settings = () => {
  const { currentUser, logout, loading, setCurrentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // --- STATE ---
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [removeBackground, setRemoveBackground] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    if (!loading && !currentUser) navigate('/login');
    if (currentUser?.profilePicture) setPreviewUrl(currentUser.profilePicture);
  }, [currentUser, loading, navigate]);

  const handleLogout = async () => { await logout(); navigate('/'); };

  // --- HANDLERS ---
  
  // 1. Image Selection
  const handleImageSelect = (e) => {
    const file = e?.target?.files?.[0] || e; 
    if (!file) { setSelectedImage(null); setPreviewUrl(currentUser.profilePicture); return; } 
    
    if (file.size > 5 * 1024 * 1024) { 
        setToast({ show: true, message: "File size must be less than 5MB", type: 'error' });
        return;
    }
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setRemoveBackground(false); 
    setToast({ show: true, message: "Photo selected. Don't forget to Save!", type: 'success' });
  };

  const handleRemoveBgToggle = () => setRemoveBackground(!removeBackground);

  // 2. Theme Toggle Wrapper
  const handleThemeToggle = () => {
      toggleTheme();
      setToast({ show: true, message: "Theme changed. Click Save to persist.", type: 'success' });
  };

  // 3. Delete Photo
  const handleDeletePhoto = async () => {
    try {
        setIsUploading(true);
        const { data } = await axios.delete('http://localhost:5000/api/user/delete-pic', { withCredentials: true });
        if (data.success) {
            const freshUrl = `${data.profilePicture}?t=${Date.now()}`;
            setCurrentUser(prev => ({ ...prev, profilePicture: freshUrl }));
            setPreviewUrl(freshUrl);
            setSelectedImage(null);
            setRemoveBackground(false);
            setToast({ show: true, message: "Restored official photo.", type: 'success' });
        }
    } catch (error) {
        setToast({ show: true, message: "Failed to delete.", type: 'error' });
    } finally { setIsUploading(false); }
  };

  // --- 🌟 MAIN SAVE HANDLER ---
  const handleSaveChanges = async () => {
    setIsUploading(true);
    let updates = { ...currentUser }; 
    let somethingSaved = false;

    // Check against DB value or default
    const currentDbTheme = currentUser.theme || 'light';

    try {
        // 1. Save Theme (Only if different from DB)
        if (theme !== currentDbTheme) {
            const { data } = await axios.put('http://localhost:5000/api/user/update-theme', 
                { theme: theme }, 
                { withCredentials: true }
            );
            if (data.success) {
                updates.theme = data.theme;
                somethingSaved = true;
            }
        }

        // 2. Save Photo (Only if selected)
        if (selectedImage) {
            const formData = new FormData();
            formData.append('image', selectedImage);
            formData.append('removeBg', removeBackground ? 'true' : 'false'); 

            const { data } = await axios.post('http://localhost:5000/api/user/update-pic', formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (data.success) {
                const freshUrl = `${data.profilePicture}?t=${Date.now()}`;
                updates.profilePicture = freshUrl;
                setPreviewUrl(freshUrl);
                setSelectedImage(null);
                setRemoveBackground(false);
                somethingSaved = true;
            }
        }

        if (somethingSaved) {
            setCurrentUser(updates);
            setToast({ show: true, message: "Settings saved successfully!", type: 'success' });
        } else {
            setToast({ show: true, message: "No new changes to save.", type: 'error' });
        }

    } catch (error) {
        console.error(error);
        setToast({ show: true, message: "Failed to save changes.", type: 'error' });
    } finally {
        setIsUploading(false);
    }
  };

  if (loading || !currentUser) {
    return ( <div className="min-h-screen flex items-center justify-center bg-[#F3F2ED] dark:bg-[#050505]"><Loader2 className="size-8 animate-spin text-[#1AA3A3]" /></div> );
  }

  const isCustomPhoto = currentUser?.profilePicture !== currentUser?.microsoftOriginalUrl;
  const currentDbTheme = currentUser?.theme || 'light';
  const hasChanges = selectedImage || (theme !== currentDbTheme);

  return (
    <div className="min-h-screen w-full bg-[#F3F2ED] dark:bg-[#050505] relative overflow-hidden pb-32 transition-colors duration-300">
      
      {/* 🌟 TOAST: Will appear Top Right via fixed positioning in CSS */}
      {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
      
      <DashboardNavbar user={currentUser} onLogout={handleLogout} />

      <div className="relative z-10 pt-24 px-4 md:px-10 max-w-3xl mx-auto">
        <div className="mb-6"><Breadcrumb items={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Settings', path: '/settings' }]} /></div>

        <div className="flex items-center gap-3 mb-8">
            <div className="size-10 rounded-xl bg-white dark:bg-[#111111] flex items-center justify-center shadow-sm text-slate-700 dark:text-slate-200 border border-transparent dark:border-slate-800">
                <SettingsIcon size={20} />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Account Settings</h1>
        </div>

        {/* 1. PROFILE SECTION */}
        <ProfileSection 
            currentUser={currentUser} 
            previewUrl={previewUrl}
            isCustomPhoto={isCustomPhoto}
            selectedImage={selectedImage}
            onImageSelect={handleImageSelect}
            onDelete={handleDeletePhoto}
            onRemoveBgToggle={handleRemoveBgToggle}
            removeBackground={removeBackground}
            isUploading={isUploading}
        />

        {/* 2. APPEARANCE */}
        <div className="mt-8 bg-white dark:bg-[#111111] rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/60 dark:border-slate-800 transition-colors duration-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-purple-500/10 text-purple-400' : 'bg-orange-100 text-orange-500'}`}>
                        {theme === 'dark' ? <Moon size={24} /> : <Sun size={24} />}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Appearance</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{theme === 'dark' ? 'Dark mode is active.' : 'Light mode is active.'}</p>
                    </div>
                </div>
                <ThemeToggle isDark={theme === 'dark'} toggle={handleThemeToggle} />
            </div>
        </div>

        {/* 3. PERSONAL INFO */}
        <div className="mt-8 bg-white dark:bg-[#111111] rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/60 dark:border-slate-800 transition-colors duration-300">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Personal Information</h3>
            <div className="space-y-5">
                 <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                        <input type="text" value={currentUser.name} disabled className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-300 font-medium cursor-not-allowed focus:outline-none" />
                        <span className="absolute right-3.5 top-3.5 text-[10px] font-bold text-slate-400 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded bg-white dark:bg-[#222]">LOCKED</span>
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">College Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                        <input type="text" value={currentUser.email} disabled className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-300 font-medium cursor-not-allowed focus:outline-none" />
                        <div className="absolute right-3 top-3 text-[#1AA3A3]"><ShieldCheck size={20} /></div>
                    </div>
                </div>
            </div>
        </div>

        {/* 🌟 4. FLOATING SAVE BUTTON (Bottom Right - Fixed) */}
        <AnimatePresence>
            {hasChanges && (
                <motion.div 
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="fixed bottom-8 right-8 z-50"
                >
                    <button 
                        onClick={handleSaveChanges} 
                        disabled={isUploading}
                        className="flex items-center gap-2 bg-[#1AA3A3] hover:bg-[#158585] text-white px-6 py-3.5 rounded-full shadow-xl shadow-[#1AA3A3]/30 font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-70 disabled:scale-100"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                <span>Save Changes</span>
                            </>
                        )}
                    </button>
                </motion.div>
            )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Settings;