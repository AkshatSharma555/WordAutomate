import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Search, FolderOpen, Loader2, RefreshCw, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

import DashboardNavbar from '../components/layout/DashboardNavbar';
import { useAuth } from '../context/AuthContext';
import StatsBar from '../components/workspace/StatsBar';
import FileCard from '../components/workspace/FileCard';
import MasterFileCard from '../components/workspace/MasterFileCard';
import BatchHistoryModal from '../components/workspace/BatchHistoryModal';
import WorkspaceTabs from '../components/workspace/WorkspaceTabs';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const Workspace = () => {
  const { currentUser, logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState('received');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data States
  const [stats, setStats] = useState(null);
  const [files, setFiles] = useState([]);
  const [selectedMasterFile, setSelectedMasterFile] = useState(null); 
  
  // Loading States
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 1. Fetch Stats
  const fetchStats = useCallback(async () => {
    try {
        const { data } = await axios.get(`${API_URL}/workspace/stats`, { withCredentials: true });
        if (data.success) setStats(data.stats);
    } catch (error) {
        console.error("Stats Error:", error);
    } finally {
        setLoadingStats(false);
    }
  }, []);

  // 2. Fetch Files
  const fetchFiles = useCallback(async () => {
    setLoadingFiles(true);
    try {
        const { data } = await axios.get(`${API_URL}/workspace/files?type=${activeTab}`, { withCredentials: true });
        if (data.success) setFiles(data.files);
    } catch (error) {
        console.error("Files Error:", error);
        setFiles([]);
    } finally {
        setLoadingFiles(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchStats(), fetchFiles()]);
    setTimeout(() => setRefreshing(false), 800);
  };

  const handleMarkSeen = (id) => {
      setFiles(prev => prev.map(f => f.id === id ? { ...f, isSeen: true } : f));
  };

  const filteredFiles = files.filter(item => 
    item.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.user?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F3F2ED] dark:bg-[#050505] transition-colors duration-300 font-sans">
      
      <DashboardNavbar user={currentUser} onLogout={logout} />

      {/* --- AMBIENT BACKGROUND --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full blur-[120px] bg-[#F54A00] opacity-10 dark:opacity-[0.05] animate-pulse" style={{animationDuration: '8s'}} />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full blur-[120px] bg-[#1AA3A3] opacity-10 dark:opacity-[0.05] animate-pulse" style={{animationDuration: '10s'}} />
      </div>

      <div className="relative z-10 pt-24 px-4 md:px-8 max-w-7xl mx-auto pb-20">
        
        {/* 1. HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="flex-1">
                
                {/* Back Link (Breadcrumb Replacement) */}
                <div className="mb-2">
                   <Link to="/dashboard" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#1AA3A3] dark:text-slate-400 dark:hover:text-[#1AA3A3] transition-colors group">
                      <div className="p-1 rounded-full bg-slate-200 dark:bg-white/10 group-hover:bg-[#1AA3A3]/20 transition-colors">
                        <ArrowLeft size={12} />
                      </div> 
                      Back to Dashboard
                   </Link>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                    My Workspace
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium max-w-xl leading-relaxed">
                    Central hub for all your academic documents. Track files you've received and monitor the impact of what you've shared.
                </p>
            </div>

            {/* Refresh Button */}
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-white/10 transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              <RefreshCw size={14} className={`text-[#1AA3A3] ${refreshing ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} />
              {refreshing ? "Syncing..." : "Refresh Data"}
            </button>
        </div>

        {/* 2. STATS BAR */}
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
        >
            <StatsBar stats={stats} loading={loadingStats} />
        </motion.div>

        {/* 3. STICKY CONTROLS BAR (Glassmorphic) */}
        <div className="sticky top-20 z-30 mb-6">
            <div className="absolute inset-0 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-xl border-y md:border border-slate-200/60 dark:border-white/5 md:rounded-2xl shadow-sm -mx-4 md:mx-0" />
            
            <div className="relative flex flex-col md:flex-row items-center gap-4 py-3 px-4 md:px-4">
                
                {/* Search Bar - EXPANDED WIDTH */}
                <div className="relative w-full md:flex-1 group">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1AA3A3] transition-colors" size={18} />
                   <input 
                     type="text" 
                     placeholder={activeTab === 'received' ? "Search by file name or sender..." : "Search sent history..."}
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-[#1a1a1a] border border-transparent focus:border-[#1AA3A3]/50 focus:bg-white dark:focus:bg-black rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                   />
                </div>

                {/* Tabs - Fixed width on Desktop */}
                <div className="w-full md:w-auto">
                    <WorkspaceTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
            </div>
        </div>

        {/* 4. FILE LIST AREA */}
        <div className="min-h-[400px] relative">
           {loadingFiles ? (
              <div className="flex flex-col items-center justify-center py-24">
                 <Loader2 size={40} className="text-[#1AA3A3] animate-spin mb-4" />
                 <p className="text-sm font-medium text-slate-400 animate-pulse">Loading documents...</p>
              </div>
           ) : filteredFiles.length === 0 ? (
              
              // EMPTY STATE
              <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-32 px-4 text-center border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[32px] bg-slate-50/50 dark:bg-white/[0.02]"
              >
                  <div className="size-20 bg-white dark:bg-[#151515] rounded-full flex items-center justify-center mb-6 shadow-sm ring-1 ring-slate-100 dark:ring-white/5">
                     <FolderOpen size={32} className="text-slate-300 dark:text-slate-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No documents found</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed mb-8">
                     {activeTab === 'received' 
                        ? "Your inbox is empty. Incoming files from friends will appear here." 
                        : "You haven't shared anything yet. Generate a document to start sharing."}
                  </p>
                  {activeTab === 'sent' && (
                      <Link to="/generate" className="px-6 py-2.5 bg-[#1AA3A3] text-white rounded-xl text-sm font-bold hover:bg-[#158585] transition-all shadow-lg shadow-[#1AA3A3]/20">
                         Create New Batch
                      </Link>
                  )}
              </motion.div>

           ) : (
              // FILE GRID / LIST
              <motion.div 
                 variants={containerVariants}
                 initial="hidden"
                 animate="visible"
                 className="grid grid-cols-1 gap-3"
              >
                 <AnimatePresence mode='popLayout'>
                    {filteredFiles.map((file) => (
                       file.isMasterFile ? (
                           <MasterFileCard 
                              key={file.id} 
                              file={file} 
                              onClick={() => setSelectedMasterFile(file)}
                           />
                       ) : (
                           <FileCard 
                              key={file.id} 
                              file={file} 
                              type={activeTab} 
                              onMarkSeen={handleMarkSeen}
                           />
                       )
                    ))}
                 </AnimatePresence>
              </motion.div>
           )}
        </div>

        {/* MODAL */}
        <AnimatePresence>
            {selectedMasterFile && (
                <BatchHistoryModal 
                    file={selectedMasterFile} 
                    onClose={() => setSelectedMasterFile(null)} 
                />
            )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Workspace;