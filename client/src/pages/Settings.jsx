import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext'; 
import Breadcrumb from '../components/common/Breadcrumb';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import ProfileSection from '../components/settings/ProfileSection';
import PersonalInfoSection from '../components/settings/PersonalInfoSection'; 
import ThemeToggle from '../components/common/ThemeToggle'; 
import Toast from '../components/common/Toast'; 
import { Loader2, Settings as SettingsIcon, Moon, Sun, Save } from 'lucide-react';

const Settings = () => {
  const { currentUser, logout, loading, setCurrentUser } = useAuth();
  const { theme, toggleTheme } = useTheme(); 
  const navigate = useNavigate();

  // --- STATE ---
  // Tracks what is currently in the Database (for comparison)
  const [dbTheme, setDbTheme] = useState('light');
  const [dbName, setDbName] = useState('');
  const [dbPrn, setDbPrn] = useState('');
  const [dbBranch, setDbBranch] = useState(''); // 👈 New
  const [dbYear, setDbYear] = useState('');     // 👈 New
  
  // Local Form State
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [prn, setPrn] = useState("");
  const [prnError, setPrnError] = useState("");
  
  // 🌟 NEW STATES FOR BRANCH & YEAR
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [removeBackground, setRemoveBackground] = useState(false);
  
  const [isUploading, setIsUploading] = useState(false);
  const [isFetching, setIsFetching] = useState(true); 
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // 🌟 INITIAL DATA FETCH
  useEffect(() => {
    const fetchFreshUserData = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/user/data', { withCredentials: true });
            
            if (data.success && data.userData) {
                const user = data.userData;

                setCurrentUser(user);

                // Set DB Reference States
                setDbTheme(user.theme || 'light');
                setDbName(user.name || "");
                setDbPrn(user.prn || "");
                setDbBranch(user.branch || ""); // 👈 Fetch Branch
                setDbYear(user.year || "");     // 👈 Fetch Year

                // Set Local Input States
                setName(user.name || "");
                setPrn(user.prn || "");
                setBranch(user.branch || "");   // 👈 Set Local Branch
                setYear(user.year || "");       // 👈 Set Local Year
                
                if (user.profilePicture && !previewUrl) {
                    setPreviewUrl(user.profilePicture);
                }
            }
        } catch (error) {
            console.error("Failed to fetch fresh user data:", error);
            if (currentUser) {
                setDbTheme(currentUser.theme || 'light');
                setName(currentUser.name || "");
                setPrn(currentUser.prn || "");
                setBranch(currentUser.branch || "");
                setYear(currentUser.year || "");
            }
        } finally {
            setIsFetching(false);
        }
    };

    if (!loading) {
        if (!currentUser) navigate('/login');
        else fetchFreshUserData();
    }
  }, [loading, navigate, setCurrentUser]); 

  const handleLogout = async () => { await logout(); navigate('/'); };

  // --- HANDLERS ---
  const handleImageSelect = (e) => {
    const file = e?.target?.files?.[0] || e; 
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setToast({ show: true, message: "File size must be less than 5MB", type: 'error' }); return; }
    setSelectedImage(file); setPreviewUrl(URL.createObjectURL(file)); setRemoveBackground(false); 
  };

  const handleThemeToggle = () => { toggleTheme(); };

  const handleDeletePhoto = async () => {
    try {
        setIsUploading(true);
        const { data } = await axios.delete('http://localhost:5000/api/user/delete-pic', { withCredentials: true });
        if (data.success) {
            const freshUrl = `${data.profilePicture}?t=${Date.now()}`;
            setCurrentUser(prev => ({ ...prev, profilePicture: freshUrl }));
            setPreviewUrl(freshUrl);
            setSelectedImage(null); setRemoveBackground(false);
            setToast({ show: true, message: "Photo restored.", type: 'success' });
        }
    } catch (error) { setToast({ show: true, message: "Failed to delete.", type: 'error' }); } finally { setIsUploading(false); }
  };

  // --- SMART SAVE LOGIC ---
  const handleSaveChanges = async () => {
    setIsUploading(true);
    let updates = { ...currentUser }; 
    let somethingSaved = false;
    let hasError = false;

    // Detect Changes (Include Branch & Year)
    const isThemeChanged = theme !== dbTheme;
    const isPhotoChanged = selectedImage !== null;
    
    // 🌟 Check if ANY personal info changed
    const isPersonalInfoChanged = 
        (name.trim() !== dbName.trim()) || 
        (prn.trim() !== dbPrn.trim()) ||
        (branch !== dbBranch) || 
        (year !== dbYear);

    try {
        // 1. Handle PERSONAL INFO
        if (isPersonalInfoChanged) {
            if (nameError || prnError) {
                setToast({ show: true, message: "Fix errors in Personal Info.", type: 'error' });
                hasError = true;
            } else if (!prn || prn.trim() === "") {
                setPrnError("PRN is required.");
                setToast({ show: true, message: "PRN cannot be empty.", type: 'error' });
                hasError = true;
            } else {
                // 🌟 Send Branch & Year to API
                const { data } = await axios.put('http://localhost:5000/api/user/update-personal-info', 
                    { 
                        name: name.trim(), 
                        prn: prn.trim(),
                        branch: branch,
                        year: year 
                    }, 
                    { withCredentials: true }
                );
                
                if (data.success) {
                    updates.name = data.name;
                    updates.prn = data.prn;
                    updates.branch = data.branch; // Update Context
                    updates.year = data.year;     // Update Context
                    
                    setDbName(data.name);   // Update DB Ref
                    setDbPrn(data.prn);
                    setDbBranch(data.branch);
                    setDbYear(data.year);
                    
                    somethingSaved = true;
                }
            }
        }
        
        // 2. Handle THEME
        if (isThemeChanged && !hasError) {
            const { data } = await axios.put('http://localhost:5000/api/user/update-theme', { theme: theme }, { withCredentials: true });
            if (data.success) { 
                updates.theme = data.theme; 
                setDbTheme(data.theme); 
                somethingSaved = true; 
            }
        }
        
        // 3. Handle PHOTO
        if (isPhotoChanged && !hasError) {
            const formData = new FormData();
            formData.append('image', selectedImage);
            formData.append('removeBg', removeBackground ? 'true' : 'false'); 
            const { data } = await axios.post('http://localhost:5000/api/user/update-pic', formData, { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } });
            if (data.success) {
                const freshUrl = `${data.profilePicture}?t=${Date.now()}`;
                updates.profilePicture = freshUrl;
                setPreviewUrl(freshUrl);
                setSelectedImage(null); setRemoveBackground(false);
                somethingSaved = true;
            }
        }

        if (somethingSaved) {
            setCurrentUser(updates);
            setToast({ show: true, message: "Changes saved successfully!", type: 'success' });
        }

    } catch (error) { 
        console.error(error);
        setToast({ show: true, message: "Failed to save changes.", type: 'error' }); 
    } finally { 
        setIsUploading(false); 
    }
  };

  if (loading || isFetching) return <div className="min-h-screen flex items-center justify-center bg-[#F3F2ED] dark:bg-[#050505]"><Loader2 className="size-8 animate-spin text-[#1AA3A3]" /></div>;

  const isCustomPhoto = currentUser?.profilePicture !== currentUser?.microsoftOriginalUrl;

  // 🌟 CHANGE DETECTION (Include Branch & Year)
  const hasChanges = 
      selectedImage !== null || 
      (theme !== dbTheme) || 
      (name.trim() !== dbName.trim()) || 
      (prn.trim() !== dbPrn.trim()) ||
      (branch !== dbBranch) || 
      (year !== dbYear);

  return (
    <div className="min-h-screen w-full bg-[#F3F2ED] dark:bg-[#050505] relative overflow-hidden pb-32 transition-colors duration-300">
      {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
      <DashboardNavbar user={currentUser} onLogout={handleLogout} />

      <div className="relative z-10 pt-24 px-4 md:px-10 max-w-3xl mx-auto">
        <div className="mb-6"><Breadcrumb items={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Settings', path: '/settings' }]} /></div>

        <div className="flex items-center gap-3 mb-8">
            <div className="size-10 rounded-xl bg-white dark:bg-[#111111] flex items-center justify-center shadow-sm text-slate-700 dark:text-slate-200 border border-transparent dark:border-slate-800"><SettingsIcon size={20} /></div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Account Settings</h1>
        </div>

        <ProfileSection 
            currentUser={currentUser} previewUrl={previewUrl} isCustomPhoto={isCustomPhoto}
            selectedImage={selectedImage} onImageSelect={handleImageSelect} onDelete={handleDeletePhoto}
            onRemoveBgToggle={() => setRemoveBackground(!removeBackground)} removeBackground={removeBackground} isUploading={isUploading}
        />

        {/* 🌟 Pass Branch & Year props here */}
        <PersonalInfoSection 
            user={currentUser} 
            name={name} setName={setName} 
            nameError={nameError} setNameError={setNameError}
            prn={prn} setPrn={setPrn}
            prnError={prnError} setPrnError={setPrnError}
            branch={branch} setBranch={setBranch}
            year={year} setYear={setYear}
        />

        <div className="mt-8 bg-white dark:bg-[#111111] rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/60 dark:border-slate-800 transition-colors duration-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-purple-500/10 text-purple-400' : 'bg-orange-100 text-orange-500'}`}>
                        {theme === 'dark' ? <Moon size={24} /> : <Sun size={24} />}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Appearance</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {theme !== dbTheme 
                                ? <span className="text-[#1AA3A3] font-semibold">Local changes pending save.</span> 
                                : (theme === 'dark' ? 'Dark mode is active.' : 'Light mode is active.')}
                        </p>
                    </div>
                </div>
                <ThemeToggle isDark={theme === 'dark'} toggle={handleThemeToggle} />
            </div>
        </div>

        <AnimatePresence>
            {hasChanges && (
                <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="fixed bottom-8 right-8 z-50">
                    <button onClick={handleSaveChanges} disabled={isUploading || !!nameError || !!prnError} className="flex items-center gap-2 bg-[#1AA3A3] hover:bg-[#158585] text-white px-6 py-3.5 rounded-full shadow-xl shadow-[#1AA3A3]/30 font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-70 disabled:scale-100 disabled:grayscale">
                        {isUploading ? <><Loader2 className="animate-spin" size={20} /><span>Saving...</span></> : <><Save size={20} /><span>Save Changes</span></>}
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Settings;