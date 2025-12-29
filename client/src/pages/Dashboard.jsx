import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Breadcrumb from '../components/common/Breadcrumb';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import { ShieldCheck, Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { currentUser, logout, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !currentUser) navigate('/login');
  }, [currentUser, loading, navigate]);

  const handleLogout = async () => { await logout(); navigate('/'); };

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F3F2ED] dark:bg-[#050505]">
        <div className="flex flex-col items-center gap-3">
            <Loader2 className="size-8 animate-spin text-[#1AA3A3]" />
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Verifying Session...</p>
        </div>
      </div>
    );
  }

  return (
    // 🌟 Dark Mode: #050505 Background
    <div className="min-h-screen w-full bg-[#F3F2ED] dark:bg-[#050505] relative overflow-hidden transition-colors duration-300">
      
      <DashboardNavbar user={currentUser} onLogout={handleLogout} />

      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] size-[500px] rounded-full blur-[120px] opacity-10 dark:opacity-5 bg-[#F54A00]" />
          <div className="absolute bottom-[-10%] right-[-10%] size-[500px] rounded-full blur-[120px] opacity-10 dark:opacity-5 bg-[#1AA3A3]" />
      </div>

      <div className="relative z-10 pt-24 px-6 md:px-10 max-w-7xl mx-auto">
        <div className="mb-6"><Breadcrumb items={[{ label: 'Dashboard', path: '/dashboard' }]} /></div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#111111] rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-white/60 dark:border-slate-800 mb-8 transition-colors"
        >
            <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        Hello, {currentUser.name}! <span className="text-2xl">👋</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">{currentUser.email}</p>
                    <div className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-[#1AA3A3] bg-[#1AA3A3]/10 px-3 py-1.5 rounded-full">
                        <ShieldCheck size={14} /> Verified SIES Account
                    </div>
                </div>
            </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
            {/* Card 1 */}
            <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-[#111111] p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all cursor-pointer group">
                <div className="size-14 bg-orange-50 dark:bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#F54A00] transition-colors">
                    <span className="text-2xl group-hover:grayscale brightness-0 invert dark:invert-0 dark:group-hover:invert text-[#F54A00]">📄</span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Your Documents</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Access and manage all your generated lab reports.</p>
            </motion.div>
            
            {/* Card 2 */}
            <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-[#111111] p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all cursor-pointer group">
                <div className="size-14 bg-teal-50 dark:bg-teal-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#1AA3A3] transition-colors">
                      <span className="text-2xl group-hover:grayscale brightness-0 invert dark:invert-0 dark:group-hover:invert text-[#1AA3A3]">📊</span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Activity Stats</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Track your submission history and efficiency.</p>
            </motion.div>

             {/* Card 3 */}
             <motion.div whileHover={{ y: -5 }} className="bg-white dark:bg-[#111111] p-8 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 shadow-sm hover:border-[#1AA3A3] hover:bg-[#1AA3A3]/5 dark:hover:bg-[#1AA3A3]/5 transition-all cursor-pointer flex flex-col items-center justify-center text-center h-full min-h-[200px]">
                <div className="size-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-slate-400">
                      <span className="text-2xl">+</span>
                </div>
                <h3 className="font-semibold text-slate-600 dark:text-slate-300">Create New Report</h3>
            </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;