import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AdminContext } from '../../context/AdminContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  Users, FileText, Activity, LogOut, Menu, ShieldCheck, ChevronRight, Link as LinkIcon 
} from 'lucide-react';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const { adminData, setIsAdminLoggedin, backendUrl } = useContext(AdminContext);
  const navigate = useNavigate();

  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalDocs: 0,
    totalConnections: 0,
    todayDocs: 0
  });

  const fetchStats = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(backendUrl + '/admin/dashboard-stats');
      if (data.success) {
        setDashboardStats(data.stats);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleLogout = async () => {
    try {
      const { data } = await axios.post(backendUrl + '/admin/logout');
      if (data.success) {
        setIsAdminLoggedin(false);
        navigate('/admin-secret-access');
      }
    } catch (error) {
      console.error("Logout Failed", error);
    }
  };

  const statCards = [
    { title: 'Total Registered Students', value: dashboardStats.totalUsers, icon: Users, color: '#1AA3A3' },
    { title: 'Total PDFs Generated', value: dashboardStats.totalDocs, icon: FileText, color: '#F54A00' },
    { title: 'Platform Connections', value: dashboardStats.totalConnections, icon: LinkIcon, color: '#10B981' },
    { title: "Today's Generations", value: dashboardStats.todayDocs, icon: Activity, color: '#3B82F6' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#F3F2ED] font-sans flex overflow-hidden">
      
      <aside className="w-64 bg-[#0A0A0A] border-r border-[#222] hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-[#222]">
          <div className="w-8 h-8 bg-gradient-to-br from-[#1AA3A3] to-[#F54A00] rounded-lg animate-pulse" />
          <span className="font-bold text-lg tracking-wide">MasterControl</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin/dashboard" className="px-4 py-3 bg-[#1AA3A3]/10 text-[#1AA3A3] rounded-xl flex items-center gap-3 font-medium transition-colors">
            <Activity size={20} /> Dashboard
          </Link>
          <Link to="/admin/users" className="px-4 py-3 text-gray-400 hover:text-white hover:bg-[#111] rounded-xl flex items-center gap-3 font-medium transition-colors">
            <Users size={20} /> User Management
          </Link>
          {/* 👇 Updated Documents Link */}
          <Link to="/admin/documents" className="px-4 py-3 text-gray-400 hover:text-white hover:bg-[#111] rounded-xl flex items-center gap-3 font-medium transition-colors">
            <FileText size={20} /> Documents
          </Link>
        </nav>

        <div className="p-4 border-t border-[#222]">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative">
        <header className="h-16 border-b border-[#222] bg-[#050505]/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Menu className="md:hidden text-gray-400 cursor-pointer" />
            <h2 className="text-xl font-semibold">Overview</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                ONLINE
            </div>
            <div className="w-8 h-8 bg-[#1AA3A3] rounded-full flex items-center justify-center text-black font-bold text-sm">
              {adminData ? adminData.name.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>
        </header>

        <div className="p-6 md:p-10 space-y-8 relative z-10">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold text-white">
              Welcome back, <span className="text-[#1AA3A3]">{adminData ? adminData.name : 'Master'}</span>
            </h1>
            <p className="text-gray-400 flex items-center gap-2">
               {adminData?.isAccountVerified && <ShieldCheck size={16} className="text-[#1AA3A3]" />}
               System is running optimally.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#0A0A0A] border border-[#222] p-6 rounded-2xl hover:border-[#333] transition-colors group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 rounded-xl bg-[#111] text-gray-300 group-hover:text-white transition-colors">
                    <stat.icon size={22} style={{ color: stat.color }} />
                  </div>
                </div>
                <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
                <p className="text-3xl font-bold text-white mt-1">{stat.value.toLocaleString()}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-300 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/admin/users')}
                className="bg-[#0A0A0A] border border-[#222] p-6 rounded-2xl hover:border-[#1AA3A3]/50 transition-all cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#1AA3A3] rounded-full blur-[80px] opacity-[0.1] group-hover:opacity-[0.2] transition-opacity" />
                <div className="flex justify-between items-center mb-4 relative z-10">
                  <div className="p-3 rounded-xl bg-[#111] text-[#1AA3A3]">
                    <Users size={24} />
                  </div>
                  <ChevronRight className="text-gray-600 group-hover:text-[#1AA3A3] transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-white relative z-10">Manage Users</h3>
                <p className="text-gray-500 text-sm mt-2 relative z-10">
                  View, edit, or remove registered students from the database.
                </p>
              </motion.div>

              {/* 👇 New Action Card for Documents */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/admin/documents')}
                className="bg-[#0A0A0A] border border-[#222] p-6 rounded-2xl hover:border-[#F54A00]/50 transition-all cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#F54A00] rounded-full blur-[80px] opacity-[0.1] group-hover:opacity-[0.2] transition-opacity" />
                <div className="flex justify-between items-center mb-4 relative z-10">
                  <div className="p-3 rounded-xl bg-[#111] text-[#F54A00]">
                    <FileText size={24} />
                  </div>
                  <ChevronRight className="text-gray-600 group-hover:text-[#F54A00] transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-white relative z-10">Manage Documents</h3>
                <p className="text-gray-500 text-sm mt-2 relative z-10">
                  View, track, or delete generated PDF files from the database.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;