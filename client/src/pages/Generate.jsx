import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { AnimatePresence } from 'framer-motion';
import { Wand2, Loader2, Users, UploadCloud, ArrowLeft, Info, RefreshCcw } from 'lucide-react'; // Added RefreshCcw
import { Link } from 'react-router-dom';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import { useAuth } from '../context/AuthContext';

import TemplateUploader from '../components/generate/TemplateUploader';
import StudentSelector from '../components/generate/StudentSelector';
import ProcessingOverlay from '../components/generate/ProcessingOverlay';
import ActionList from '../components/generate/ActionList'; 

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Generate = () => {
  const { currentUser, logout } = useAuth();

  const [file, setFile] = useState(null);
  const [friends, setFriends] = useState([]); 
  const [loadingFriends, setLoadingFriends] = useState(true);
  
  const [selectedIds, setSelectedIds] = useState([]);
  const [generationResults, setGenerationResults] = useState([]); 
  const [processedIds, setProcessedIds] = useState([]); 

  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false); 
  
  // New State for Error Message
  const [errorMsg, setErrorMsg] = useState("");

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
    setErrorMsg(""); // Clear error when user interacts
  };

  const toggleAll = (idsToSelect) => {
     setSelectedIds(idsToSelect);
     setErrorMsg("");
  };

  const handleGenerate = async () => {
    if (!file || selectedIds.length === 0) return;

    setIsGenerating(true);
    setGenerationResults([]); 
    setErrorMsg(""); // Reset error message on start

    const selectedStudents = friends.filter(s => selectedIds.includes(s.id));
    const total = selectedStudents.length;
    
    setProcessStatus({ 
        current: 1, 
        total: total, 
        name: selectedStudents[0].name, 
        img: selectedStudents[0].img, 
        timeLeft: total * 4 
    });

    const results = [];
    const successfulIds = [];
    let hasSessionError = false;

    for (let i = 0; i < total; i++) {
        // Stop if session expired detected in previous iteration
        if (hasSessionError) break;

        const student = selectedStudents[i];
        
        setProcessStatus({
            current: i + 1,
            total: total,
            name: student.name,
            img: student.img, 
            timeLeft: Math.max((total - i) * 4, 1)
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
             results.push({ 
                    ...student, 
                    pdfUrl: data.pdfUrl, 
                    docId: data.results?.docId || data.docId, 
                    success: true 
                });
                successfulIds.push(student.id);
            }
        } catch (error) {
            console.error("Gen loop error:", error);
            
            // Check for 401 specifically
            if (error.response && error.response.status === 401) {
                setErrorMsg("Session expired. Please login again.");
                hasSessionError = true;
                results.push({ ...student, success: false, error: "Session Expired" });
            } else {
                results.push({ ...student, success: false, error: "Failed" });
            }
        }
    }

    setGenerationResults(results);
    setProcessedIds(prev => [...prev, ...successfulIds]);
    setIsGenerating(false);

    // Only switch to complete view if we didn't crash on session error
    if (!hasSessionError) {
        setIsComplete(true);
    }
  };

  const handleReset = () => {
    setIsComplete(false);
    setSelectedIds([]);
    setGenerationResults([]);
    setErrorMsg("");
  };

  const getButtonState = () => {
     if (!file) return { disabled: true, text: "Upload Template First", icon: <UploadCloud size={20} /> };
     if (selectedIds.length === 0) return { disabled: true, text: "Select Students", icon: <Users size={20} /> };
     
     // If error exists, allow retry state logic if needed, or keep disabled until resolved
     if (errorMsg) return { disabled: false, text: "Retry Generation", icon: <RefreshCcw size={20} /> };

     return { disabled: false, text: `Process Batch (${selectedIds.length})`, icon: <Wand2 size={20} /> };
  };
  const btnState = getButtonState();

  return (
    <div className="h-screen flex flex-col bg-[#F3F2ED] dark:bg-[#050505] overflow-hidden">
      <DashboardNavbar user={currentUser} onLogout={logout} />

      {/* Main Content - Pushed content up by reducing top padding */}
      <div className="flex-1 flex flex-col pt-20 pb-4 px-4 md:px-8 max-w-[1600px] mx-auto w-full h-full overflow-hidden">
        
        {/* PLAN A: COMPACT HEADER */}
        <div className="shrink-0 mb-3 pt-2">
           
           {/* 1. Back Navigation (Minimalist) */}
           <Link 
             to="/dashboard" 
             className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition-colors mb-1"
           >
              <ArrowLeft size={14} /> Back to Dashboard
           </Link>

           {/* 2. Title Row with Integrated Badge */}
           <div className="flex items-center justify-between">
               <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-none">
                 Document Workbench
               </h1>
               
               {/* 3. Info Badge (Saves vertical space) */}
               <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800">
                  <div className="size-2 bg-[#1AA3A3] rounded-full animate-pulse shadow-[0_0_8px_#1AA3A3]" />
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Optimized for: <strong>5 Students/Batch</strong>
                  </span>
               </div>
           </div>
        </div>

        {/* WORKSPACE GRID - Takes remaining height */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6">
           
           {/* LEFT: Uploader */}
           <div className="lg:col-span-4 h-full min-h-[300px] bg-white dark:bg-[#111111] rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
              <TemplateUploader file={file} setFile={setFile} />
           </div>

           {/* RIGHT: Selector/Action */}
           <div className="lg:col-span-8 h-full min-h-[400px] bg-white dark:bg-[#111111] rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col">
              
              {!isComplete ? (
                 loadingFriends ? (
                   <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                     <Loader2 size={32} className="animate-spin mb-4 text-[#1AA3A3]" />
                     <p className="text-sm font-medium">Loading network...</p>
                   </div>
                 ) : friends.length === 0 ? (
                   <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center px-6">
                      <div className="size-16 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
                        <Users size={24} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-700 dark:text-white">No Friends Found</h3>
                      <a href="/explore" className="text-[#1AA3A3] font-bold hover:underline mt-2">Connect with friends</a>
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
                     errorMessage={errorMsg} // Pass error message prop
                   />
                 )
              ) : (
                 <ActionList 
                   students={generationResults} 
                   onReset={handleReset}
                 />
              )}

              <AnimatePresence>
                {isGenerating && <ProcessingOverlay status={processStatus} />}
              </AnimatePresence>

           </div>
        </div>
      </div>
    </div>
  );
};

export default Generate;