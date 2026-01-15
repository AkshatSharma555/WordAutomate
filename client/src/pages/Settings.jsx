import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext'; 
import DashboardNavbar from '../components/layout/DashboardNavbar';
import ProfileSection from '../components/settings/ProfileSection';
import PersonalInfoSection from '../components/settings/PersonalInfoSection'; 
import ThemeToggle from '../components/common/ThemeToggle'; 
import Toast from '../components/common/Toast'; 
import { Loader2, Settings as SettingsIcon, Moon, Sun, Save, ArrowLeft } from 'lucide-react';
import SessionErrorModal from '../components/common/SessionErrorModal'; 

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const USER_URL = `${API_BASE_URL}/user`;

const Settings = () => {
  const { currentUser, logout, loading, setCurrentUser } = useAuth();
  const { theme, toggleTheme } = useTheme(); 
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [prn, setPrn] = useState("");
  const [prnError, setPrnError] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");

  const [dbName, setDbName] = useState('');
  const [dbPrn, setDbPrn] = useState('');
  const [dbBranch, setDbBranch] = useState('');
  const [dbYear, setDbYear] = useState('');

  const [isUploading, setIsUploading] = useState(false);
  const [isFetching, setIsFetching] = useState(true); 
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
  // 🔥 Modal State
  const [showSessionError, setShowSessionError] = useState(false);

  useEffect(() => {
    const fetchFreshUserData = async () => {
        try {
            const { data } = await axios.get(`${USER_URL}/data`, { withCredentials: true });
            if (data.success && data.userData) {
                const user = data.userData;
                setCurrentUser(user);
                setDbName(user.name || ""); setDbPrn(user.prn || ""); setDbBranch(user.branch || ""); setDbYear(user.year || "");
                setName(user.name || ""); setPrn(user.prn || ""); setBranch(user.branch || ""); setYear(user.year || "");
            }
        } catch (error) {
            console.error("Failed to fetch settings:", error);
        } finally {
            setIsFetching(false);
        }
    };
    if (!loading) {
        if (!currentUser) navigate('/login'); else fetchFreshUserData();
    }
  }, [loading, navigate]); 

  const handleLogout = async () => { await logout(); navigate('/'); };

  const currentDbTheme = currentUser?.theme || 'dark';
  const hasThemeChanged = theme !== currentDbTheme;
  const hasPersonalInfoChanged = (name.trim() !== dbName.trim()) || (prn.trim() !== dbPrn.trim()) || (branch !== dbBranch) || (year !== dbYear);
  const hasChanges = hasThemeChanged || hasPersonalInfoChanged;

  const handleSaveChanges = async () => {
    setIsUploading(true);
    let updates = { ...currentUser }; 
    let somethingSaved = false;
    let hasError = false;

    try {
        // 1. Update Personal Info
        if (hasPersonalInfoChanged) {
            if (nameError || prnError) {
                setToast({ show: true, message: "Fix errors in Personal Info.", type: 'error' });
                hasError = true;
            } else {
                const { data } = await axios.put(`${USER_URL}/update-personal-info`, 
                    { name: name.trim(), prn: prn.trim(), branch, year }, 
                    { withCredentials: true }
                );
                
                if (data.success) {
                    updates = { ...updates, name: data.name, prn: data.prn, branch: data.branch, year: data.year };
                    setDbName(data.name); setDbPrn(data.prn); setDbBranch(data.branch); setDbYear(data.year);
                    somethingSaved = true;
                } else {
                    // 🔥 CRITICAL FIX: Explicitly throw if success is false
                    // This forces the code into the 'catch' block to show the Modal
                    throw new Error(data.message || "Failed to update profile.");
                }
            }
        }
        
        // 2. Update Theme
        if (hasThemeChanged && !hasError) {
            const { data } = await axios.put(`${USER_URL}/update-theme`, { theme }, { withCredentials: true });
            if (data.success) { 
                updates.theme = theme; 
                somethingSaved = true; 
            } else {
                throw new Error("Failed to update theme.");
            }
        }
        
        if (somethingSaved) {
            setCurrentUser(updates);
            setToast({ show: true, message: "Changes saved successfully!", type: 'success' });
        } else if (!hasError && (hasPersonalInfoChanged || hasThemeChanged)) {
             // Fallback: If we thought there were changes but API didn't confirm success
             throw new Error("Validation failed.");
        }
    } catch (error) { 
        console.error("Settings Update Failed:", error);
        
        // 🔥 ROBUST ERROR CATCHING (Status Code OR Message)
        const isSessionError = 
            error.response?.status === 401 || 
            error.code === "ERR_NETWORK" ||
            (error.message && (
                error.message.includes("Not Authorized") || 
                error.message.includes("Login Again") ||
                error.message.includes("jwt expired")
            ));

        if (isSessionError) {
            setShowSessionError(true); // ✅ Show Red Modal
        } else {
            let msg = error.response?.data?.message || error.message || "Failed to save changes.";
            setToast({ show: true, message: msg, type: 'error' }); 
        }
    } finally { 
        setIsUploading(false); 
    }
  };

  if (loading || isFetching) return <div className="min-h-screen flex items-center justify-center bg-[#F3F2ED] dark:bg-[#050505]"><Loader2 className="size-8 animate-spin text-[#1AA3A3]" /></div>;

  return (
    <div className="min-h-screen w-full bg-[#F3F2ED] dark:bg-[#050505] relative overflow-hidden pb-32 transition-colors duration-300 font-sans">
      
      {/* 🔥 Session Error Modal */}
      <SessionErrorModal 
            isOpen={showSessionError} 
            onClose={() => setShowSessionError(false)}
            onRetry={() => {
                setShowSessionError(false);
                handleSaveChanges(); 
            }} 
      />

      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full blur-[120px] bg-[#F54A00] opacity-5 dark:opacity-[0.02]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full blur-[120px] bg-[#1AA3A3] opacity-5 dark:opacity-[0.02]" />
      </div>

      {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
      <DashboardNavbar user={currentUser} onLogout={handleLogout} />

      <div className="relative z-10 pt-24 px-4 md:px-10 max-w-3xl mx-auto">
        <div className="mb-6">
           <Link to="/dashboard" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#1AA3A3] dark:text-slate-400 dark:hover:text-[#1AA3A3] transition-colors group">
              <div className="p-1 rounded-full bg-slate-200 dark:bg-white/10 group-hover:bg-[#1AA3A3]/20 transition-colors">
                <ArrowLeft size={12} />
              </div> 
              Back to Dashboard
           </Link>
        </div>

        <div className="flex items-center gap-3 mb-8">
            <div className="size-10 rounded-xl bg-white dark:bg-[#111111] flex items-center justify-center shadow-sm text-slate-700 dark:text-slate-200 border border-transparent dark:border-slate-800">
                <SettingsIcon size={20} />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Account Settings</h1>
        </div>

        <ProfileSection currentUser={currentUser} />

        <PersonalInfoSection 
            user={currentUser} name={name} setName={setName} nameError={nameError} setNameError={setNameError}
            prn={prn} setPrn={setPrn} prnError={prnError} setPrnError={setPrnError}
            branch={branch} setBranch={setBranch} year={year} setYear={setYear}
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
                            {hasThemeChanged 
                                ? <span className="text-[#1AA3A3] font-semibold animate-pulse">Changes pending...</span> 
                                : (theme === 'dark' ? 'Dark mode is active.' : 'Light mode is active.')}
                        </p>
                    </div>
                </div>
                <ThemeToggle isDark={theme === 'dark'} toggle={toggleTheme} />
            </div>
        </div>

        <AnimatePresence>
            {hasChanges && (
                <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="fixed bottom-8 right-8 z-50">
                    <button onClick={handleSaveChanges} disabled={isUploading || !!nameError || !!prnError} className="flex items-center gap-2 bg-[#1AA3A3] hover:bg-[#158585] text-white px-6 py-3.5 rounded-full shadow-xl shadow-[#1AA3A3]/30 font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-70 disabled:grayscale">
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