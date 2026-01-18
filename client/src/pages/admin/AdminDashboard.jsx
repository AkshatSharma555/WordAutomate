import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../../context/AdminContext'; // 👈 Using Real Context
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  Users, FileText, Activity, Server, 
  LogOut, Settings, Bell, Search, Menu, ShieldCheck 
} from 'lucide-react';

const AdminDashboard = () => {
  const { adminData, setIsAdminLoggedin, backendUrl } = useContext(AdminContext);
  const navigate = useNavigate();

  // 🔥 Logout Logic
  const handleLogout = async () => {
    try {
      const { data } = await axios.post(backendUrl + '/api/admin/logout');
      if (data.success) {
        setIsAdminLoggedin(false);
        navigate('/admin-secret-access');
      }
    } catch (error) {
      console.error("Logout Failed", error);
    }
  };

  // Mock Data for Visuals (Baad me API se replace karenge)
  const stats = [
    { title: 'Total Users', value: '1,248', change: '+12%', icon: Users, color: '#1AA3A3' },
    { title: 'Docs Generated', value: '8,504', change: '+24%', icon: FileText, color: '#F54A00' },
    { title: 'Server Status', value: 'Healthy', change: '99.9%', icon: Server, color: '#10B981' },
    { title: 'Active Sessions', value: '34', change: 'Now', icon: Activity, color: '#3B82F6' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#F3F2ED] font-sans flex overflow-hidden">
      
      {/* --- Sidebar (Static for now) --- */}
      <aside className="w-64 bg-[#0A0A0A] border-r border-[#222] hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-[#222]">
          <div className="w-8 h-8 bg-gradient-to-br from-[#1AA3A3] to-[#F54A00] rounded-lg animate-pulse" />
          <span className="font-bold text-lg tracking-wide">MasterControl</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <div className="px-4 py-3 bg-[#1AA3A3]/10 text-[#1AA3A3] rounded-xl flex items-center gap-3 font-medium cursor-pointer">
            <Activity size={20} /> Dashboard
          </div>
          <div className="px-4 py-3 text-gray-400 hover:text-white hover:bg-[#111] rounded-xl flex items-center gap-3 font-medium cursor-pointer transition-colors">
            <Users size={20} /> Users
          </div>
          <div className="px-4 py-3 text-gray-400 hover:text-white hover:bg-[#111] rounded-xl flex items-center gap-3 font-medium cursor-pointer transition-colors">
            <FileText size={20} /> Documents
          </div>
        </nav>

        <div className="p-4 border-t border-[#222]">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Header */}
        <header className="h-16 border-b border-[#222] bg-[#050505]/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Menu className="md:hidden text-gray-400" />
            <h2 className="text-xl font-semibold">Overview</h2>
          </div>
          <div className="flex items-center gap-4">
            {/* Status Badge */}
            <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                ONLINE
            </div>
            
            <div className="w-8 h-8 bg-[#1AA3A3] rounded-full flex items-center justify-center text-black font-bold text-sm">
              {/* 🔥 Show Real Admin Initial */}
              {adminData ? adminData.name.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-6 md:p-10 space-y-8 relative z-10">
          
          {/* Welcome Section */}
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold text-white">
              Welcome back, <span className="text-[#1AA3A3]">{adminData ? adminData.name : 'Master'}</span>
            </h1>
            <p className="text-gray-400 flex items-center gap-2">
               {adminData?.isAccountVerified && <ShieldCheck size={16} className="text-[#1AA3A3]" />}
               System is running optimally.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
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
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;