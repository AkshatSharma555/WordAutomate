import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import { LogOut, User, ShieldCheck } from 'lucide-react';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/'); // Logout hone ke baad Home pe bhej do
  };

  // Agar user galti se bina login kiye yahan aa jaye
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F3F2ED]">
        <p>Loading user profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#F3F2ED] pt-24 px-6 relative overflow-hidden">
      
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] size-[500px] rounded-full blur-[120px] opacity-10 bg-[#F54A00]" />
      <div className="absolute bottom-[-10%] right-[-10%] size-[500px] rounded-full blur-[120px] opacity-10 bg-[#1AA3A3]" />

      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6"
        >
            <div className="flex items-center gap-4">
                <div className="size-16 rounded-full bg-[#1AA3A3]/10 flex items-center justify-center text-[#1AA3A3]">
                    <User size={32} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Hello, {currentUser.name || "Student"}! 👋
                    </h1>
                    <p className="text-slate-500 text-sm">
                        {currentUser.email}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-xs font-medium text-[#1AA3A3] bg-[#1AA3A3]/5 px-2 py-1 rounded w-fit">
                        <ShieldCheck size={12} /> Verified SIES Account
                    </div>
                </div>
            </div>

            <Button 
                onClick={handleLogout} 
                className="bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 shadow-none"
            >
                <LogOut size={18} className="mr-2" /> Sign Out
            </Button>
        </motion.div>

        {/* Dashboard Content Placeholder */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-64 flex items-center justify-center text-slate-400">
                Your Recent Documents will appear here
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-64 flex items-center justify-center text-slate-400">
                Lab Statistics Graph
            </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;