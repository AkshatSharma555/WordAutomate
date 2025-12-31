import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import GeneratorEngine from '../components/generator/GeneratorEngine';
import { ShieldCheck, Loader2, Plus, History, LayoutDashboard } from 'lucide-react';

const Dashboard = () => {
  const { currentUser, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('generate'); // 'generate' | 'history'

  useEffect(() => {
    if (!loading && !currentUser) navigate('/login');
  }, [currentUser, loading, navigate]);

  const handleLogout = async () => { await logout(); navigate('/'); };

  // Helper to format name nicely (e.g., "SHARMA AKSHAT" -> "Sharma Akshat")
  const formatName = (name) => {
    return name ? name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Student';
  };

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F3F2ED] dark:bg-[#050505]">
        <div className="flex flex-col items-center gap-3">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Verifying Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#F3F2ED] dark:bg-[#050505] relative transition-colors duration-300">
      
      <DashboardNavbar user={currentUser} onLogout={handleLogout} />

      {/* Ambient Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] size-[500px] rounded-full blur-[120px] opacity-10 dark:opacity-5 bg-secondary" />
          <div className="absolute bottom-[-10%] right-[-10%] size-[500px] rounded-full blur-[120px] opacity-10 dark:opacity-5 bg-primary" />
      </div>

      <div className="relative z-10 pt-24 px-4 md:px-8 max-w-5xl mx-auto pb-20">
        
        {/* Header Section - Compact & Professional */}
        <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8"
        >
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold tracking-wider text-secondary uppercase bg-secondary/10 px-2 py-0.5 rounded">
                        Student Dashboard
                    </span>
                    {currentUser.isVerified && (
                         <span className="flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
                            <ShieldCheck size={12} /> Verified
                        </span>
                    )}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                    Welcome, {formatName(currentUser.name)}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                    Create lab reports instantly using Microsoft Graph technology.
                </p>
            </div>

            {/* Tab Switcher - Clean Pills */}
            <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <button
                    onClick={() => setActiveTab('generate')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeTab === 'generate' 
                        ? 'bg-primary text-white shadow-md' 
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                >
                    <Plus size={16} /> New Report
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeTab === 'history' 
                        ? 'bg-primary text-white shadow-md' 
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                >
                    <History size={16} /> History
                </button>
            </div>
        </motion.div>

        {/* Main Content Area */}
        <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {activeTab === 'generate' ? (
                // 🚀 The Generator Engine (Directly Visible)
                <GeneratorEngine />
            ) : (
                // 🕒 History Placeholder (Future Implementation)
                <div className="bg-white dark:bg-[#111111] rounded-3xl p-12 text-center border border-dashed border-slate-300 dark:border-slate-800">
                    <div className="size-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                        <LayoutDashboard size={32} />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">No history found</h3>
                    <p className="text-slate-500 text-sm mt-1">Your generated documents will appear here soon.</p>
                </div>
            )}
        </motion.div>

      </div>
    </div>
  );
};

export default Dashboard;