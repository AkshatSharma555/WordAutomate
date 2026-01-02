import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Search, FolderOpen, Loader2, Home, ChevronRight, RefreshCw } from 'lucide-react';
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

// Animation Variants for Staggered List
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
  const [selectedMasterFile, setSelectedMasterFile] = useState(null); // State for Modal
  
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

  // Initial Load
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  // Manual Refresh Handler
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchStats(), fetchFiles()]);
    setTimeout(() => setRefreshing(false), 500);
  };

  // Handle Mark Seen
  const handleMarkSeen = (id) => {
      setFiles(prev => prev.map(f => f.id === id ? { ...f, isSeen: true } : f));
  };

  // Filter Logic
  const filteredFiles = files.filter(item => 
    item.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.user?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#050505] flex flex-col font-sans selection:bg-[#1AA3A3]/20 selection:text-[#1AA3A3]">
      <DashboardNavbar user={currentUser} onLogout={logout} />

      {/* Background Decor (Subtle Grid & Glow) */}
      <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#1AA3A3]/5 dark:bg-[#1AA3A3]/10 rounded-full blur-[100px]" />
      </div>

      <div className="flex-1 pt-24 pb-10 px-4 md:px-8 max-w-[1400px] mx-auto w-full relative z-10">
        
        {/* 1. BREADCRUMBS & HEADER */}
        <div className="mb-8">
           {/* Breadcrumb Row */}
           <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-4 animate-fade-in-up">
              <Link to="/dashboard" className="flex items-center gap-1 hover:text-[#1AA3A3] transition-colors">
                 <Home size={14} />
                 <span>Home</span>
              </Link>
              <ChevronRight size={14} className="opacity-50" />
              <Link to="/dashboard" className="hover:text-[#1AA3A3] transition-colors">
                 Dashboard
              </Link>
              <ChevronRight size={14} className="opacity-50" />
              <span className="text-slate-900 dark:text-white font-bold bg-slate-200/50 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                 Workspace
              </span>
           </nav>

           {/* Title Row */}
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                    My Workspace
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium max-w-lg">
                    Manage your shared ecosystem. Track received documents and monitor the impact of files you've shared.
                </p>
              </div>

              {/* Refresh Action */}
              <button 
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm active:scale-95 disabled:opacity-50"
              >
                <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
                {refreshing ? "Syncing..." : "Refresh Data"}
              </button>
           </div>
        </div>

        {/* 2. STATS BAR (Premium) */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <StatsBar stats={stats} loading={loadingStats} />
        </motion.div>

        {/* 3. STICKY CONTROLS BAR (Glassmorphism) */}
        <div className="sticky top-20 z-30 mb-6">
           <div className="absolute inset-0 bg-white/70 dark:bg-[#050505]/70 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-2xl shadow-sm -mx-4 md:-mx-6" />
           
           <div className="relative flex flex-col md:flex-row justify-between items-center gap-4 py-3 px-1 md:px-0">
               {/* Search */}
               <div className="relative w-full md:w-96 group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1AA3A3] transition-colors" size={16} />
                  <input 
                    type="text" 
                    placeholder={activeTab === 'received' ? "Search by file name or sender..." : "Search sent history..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/50 dark:bg-[#1a1a1a]/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium focus:outline-none focus:border-[#1AA3A3] focus:ring-4 focus:ring-[#1AA3A3]/5 transition-all shadow-sm placeholder:text-slate-400"
                  />
               </div>

               {/* Custom Segmented Tabs */}
               <WorkspaceTabs activeTab={activeTab} setActiveTab={setActiveTab} />
           </div>
        </div>

        {/* 4. FILE LIST (Staggered Animation) */}
        <div className="min-h-[400px] relative">
           {loadingFiles ? (
              // Loader
              <div className="flex flex-col items-center justify-center py-24">
                 <Loader2 size={36} className="text-[#1AA3A3] animate-spin mb-4" />
                 <p className="text-sm font-medium text-slate-400 animate-pulse">Synchronizing documents...</p>
              </div>
           ) : filteredFiles.length === 0 ? (
              // Premium Empty State
              <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="flex flex-col items-center justify-center py-28 px-4 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-[32px] bg-slate-50/50 dark:bg-[#111111]/30"
              >
                 <div className="size-20 bg-white dark:bg-[#1a1a1a] rounded-full flex items-center justify-center mb-6 shadow-sm ring-1 ring-slate-100 dark:ring-slate-800">
                    <FolderOpen size={32} className="text-slate-300 dark:text-slate-600" />
                 </div>
                 <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No documents found</h3>
                 <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                    {activeTab === 'received' 
                        ? "Your inbox is empty. When friends share documents with you, they'll appear here automatically." 
                        : "You haven't shared any documents yet. Go to the Generator to create and share your first batch."}
                 </p>
                 {activeTab === 'sent' && (
                     <Link to="/generate" className="mt-6 px-6 py-2.5 bg-[#1AA3A3] text-white rounded-xl text-sm font-bold hover:bg-[#158585] transition-all shadow-lg shadow-[#1AA3A3]/20">
                        Create New Batch
                     </Link>
                 )}
              </motion.div>
           ) : (
              // List Grid
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 gap-3"
              >
                 <AnimatePresence mode='popLayout'>
                    {filteredFiles.map((file) => (
                       file.isMasterFile ? (
                           // SENT TAB: Show Master Card (Grouped)
                           <MasterFileCard 
                              key={file.id} 
                              file={file} 
                              onClick={() => setSelectedMasterFile(file)}
                           />
                       ) : (
                           // RECEIVED TAB: Show Normal Card (Individual)
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

        {/* BATCH HISTORY MODAL */}
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