import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { Wand2, Loader2, Users, UploadCloud, ArrowLeft, Sparkles, AlertTriangle, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import { useAuth } from '../context/AuthContext';

import TemplateUploader from '../components/generate/TemplateUploader';
import StudentSelector from '../components/generate/StudentSelector';
import ProcessingOverlay from '../components/generate/ProcessingOverlay';
import ActionList from '../components/generate/ActionList'; 

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Generate = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [friends, setFriends] = useState([]); 
  const [loadingFriends, setLoadingFriends] = useState(true);
  
  const [selectedIds, setSelectedIds] = useState([]);
  const [generationResults, setGenerationResults] = useState([]); 
  const [processedIds, setProcessedIds] = useState([]); 

  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false); 
  
  const [sessionError, setSessionError] = useState(false);
  const [uiError, setUiError] = useState("");

  const [processStatus, setProcessStatus] = useState({
     current: 0, total: 0, name: "", img: "", timeLeft: 0
  });

  // 1. Fetch Friends
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoadingFriends(true);
        const { data } = await axios.get(`${API_URL}/user/friends`, { withCredentials: true });
        if (data.success) {
          const formattedFriends = data.friends.map(f => ({
            id: f._id, 
            name: f.name,
            prn: f.prn || f.PRN || f.studentPrn || "N/A", 
            branch: f.branch || "Student", 
            img: f.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }));
          setFriends(formattedFriends);
        }
      } catch (error) {
        if (error.response?.status === 401) setSessionError(true);
        setFriends([]);
      } finally {
        setLoadingFriends(false);
      }
    };
    fetchFriends();
  }, []);

  // Sorting Logic
  const sortedFriends = useMemo(() => {
     return [...friends].sort((a, b) => {
        const isAProcessed = processedIds.includes(a.id);
        const isBProcessed = processedIds.includes(b.id);
        if (isAProcessed && !isBProcessed) return 1;
        if (!isAProcessed && isBProcessed) return -1;
        return 0;
     });
  }, [friends, processedIds]);

  const toggleSelection = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
    setUiError(""); 
  };

  const toggleAll = (idsToSelect) => {
     setSelectedIds(idsToSelect);
     setUiError("");
  };

  const handleGenerate = async () => {
    if (!file || selectedIds.length === 0) return;

    setIsGenerating(true);
    setGenerationResults([]); 
    setUiError(""); 
    setSessionError(false);

    const selectedStudents = friends.filter(s => selectedIds.includes(s.id));
    const total = selectedStudents.length;
    
    setProcessStatus({ 
        current: 1, total, name: selectedStudents[0].name, img: selectedStudents[0].img, timeLeft: total * 4 
    });

    const results = [];
    const successfulIds = [];
    let hasCriticalError = false;

    for (let i = 0; i < total; i++) {
        if (hasCriticalError) break;
        const student = selectedStudents[i];
        
        setProcessStatus({
            current: i + 1, total, name: student.name, img: student.img, timeLeft: Math.max((total - i) * 4, 1)
        });

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('studentData', JSON.stringify({ id: student.id, name: student.name, prn: student.prn }));

            const { data } = await axios.post(`${API_URL}/document/generate`, formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (data.success) {
                results.push({ ...student, pdfUrl: data.pdfUrl, docId: data.results?.docId || data.docId, success: true });
                successfulIds.push(student.id);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setSessionError(true);
                hasCriticalError = true;
                results.push({ ...student, success: false, error: "Session Expired" });
            } else {
                results.push({ ...student, success: false, error: "Failed" });
            }
        }
    }

    setGenerationResults(results);
    setProcessedIds(prev => [...prev, ...successfulIds]);
    setIsGenerating(false);

    if (!hasCriticalError) setIsComplete(true);
  };

  const handleReset = () => {
    setIsComplete(false);
    setSelectedIds([]);
    setGenerationResults([]);
    setUiError("");
  };

  const getButtonState = () => {
     if (!file) return { disabled: true, text: "Upload Template First", icon: <UploadCloud size={18} /> };
     if (selectedIds.length === 0) return { disabled: true, text: "Select Students", icon: <Users size={18} /> };
     return { disabled: false, text: `Process Batch (${selectedIds.length})`, icon: <Wand2 size={18} /> };
  };
  const btnState = getButtonState();

  const cardClass = "relative bg-white/70 dark:bg-[#111111]/60 backdrop-blur-xl rounded-[28px] border border-slate-200/60 dark:border-white/5 shadow-2xl shadow-slate-200/40 dark:shadow-black/40 overflow-hidden flex flex-col transition-all duration-300";

  return (
    <div className="h-screen flex flex-col bg-[#F3F2ED] dark:bg-[#050505] overflow-hidden font-sans relative transition-colors duration-300">
      <DashboardNavbar user={currentUser} onLogout={logout} />

      {/* --- AMBIENT BACKGROUND (Fixed: Brighter Dark Mode + No Blink) --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {/* Top Left - Orange Glow */}
          <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full blur-[120px] bg-[#F54A00] opacity-20 dark:opacity-20" />
          
          {/* Bottom Right - Teal Glow */}
          <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full blur-[120px] bg-[#1AA3A3] opacity-20 dark:opacity-20" />
      </div>

      {/* === SESSION OVERLAY === */}
      <AnimatePresence>
        {sessionError && (
            <motion.div 
                initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-white/60 dark:bg-black/80"
            >
                <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white dark:bg-[#151515] p-8 rounded-3xl shadow-2xl border border-red-100 dark:border-red-900/30 text-center max-w-md w-full mx-4">
                    <div className="size-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500 animate-pulse">
                        <AlertTriangle size={32} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Session Expired</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">Your session timed out. Please login again.</p>
                    <button onClick={() => { logout(); navigate('/login'); }} className="w-full py-3.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
                        <LogIn size={18} /> Login Again
                    </button>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* --- MAIN LAYOUT --- */}
      <div className="relative z-10 flex-1 flex flex-col pt-20 pb-4 px-4 max-w-[1600px] mx-auto w-full h-full overflow-hidden">
        
        {/* HEADER */}
        <div className="shrink-0 mb-4 flex items-center justify-between">
            <div>
                <Link to="/dashboard" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-[#1AA3A3] transition-colors mb-1">
                    <ArrowLeft size={12} /> Back
                </Link>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                    Document Workbench <Sparkles className="text-[#1AA3A3]" size={18} />
                </h1>
            </div>
        </div>

        {/* WORKSPACE GRID */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 pb-2">
           
           {/* LEFT: Uploader */}
           <motion.div 
             initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
             className={`lg:col-span-3 h-full min-h-0 ${cardClass}`}
           >
              <TemplateUploader file={file} setFile={setFile} />
           </motion.div>

           {/* RIGHT: Selector */}
           <motion.div 
             initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
             className={`lg:col-span-9 h-full min-h-0 relative ${cardClass}`}
           >
              {!isComplete ? (
                 loadingFriends ? (
                   <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                     <Loader2 size={32} className="animate-spin mb-3 text-[#1AA3A3]" />
                     <p className="text-xs font-bold uppercase tracking-wider">Loading Network...</p>
                   </div>
                 ) : friends.length === 0 ? (
                   <div className="flex-1 flex flex-col items-center justify-center text-center">
                      <div className="size-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <Users size={28} className="text-slate-400" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-700 dark:text-white">No Friends Found</h3>
                      <Link to="/explore" className="mt-4 px-5 py-2 bg-[#1AA3A3] text-white rounded-lg font-bold text-sm hover:bg-[#158585]">
                        Find Peers
                      </Link>
                   </div>
                 ) : (
                   <StudentSelector 
                     students={sortedFriends} 
                     selectedIds={selectedIds}
                     processedIds={processedIds}
                     toggleSelection={toggleSelection}
                     toggleAll={toggleAll}
                     onGenerate={handleGenerate}
                     btnState={btnState}
                     errorMessage={uiError}
                   />
                 )
              ) : (
                 <ActionList students={generationResults} onReset={handleReset} />
              )}
           </motion.div>
        </div>
      </div>

      {/* --- PROCESSING OVERLAY --- */}
      <AnimatePresence>
        {isGenerating && <ProcessingOverlay status={processStatus} />}
      </AnimatePresence>

    </div>
  );
};

export default Generate;