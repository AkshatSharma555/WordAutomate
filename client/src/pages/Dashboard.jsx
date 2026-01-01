import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import { ShieldCheck, Loader2, Sparkles, Briefcase, Compass, Users } from 'lucide-react';

const Dashboard = () => {
  const { currentUser, logout, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !currentUser) navigate('/login');
  }, [currentUser, loading, navigate]);

  const handleLogout = async () => { await logout(); navigate('/'); };

  const formatName = (name) => {
    return name ? name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Student';
  };

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F3F2ED] dark:bg-[#050505]">
         <Loader2 className="size-8 animate-spin text-[#1AA3A3]" />
      </div>
    );
  }

  // 👇 CARD DATA with ROUTES
  const features = [
    {
      id: 'generate',
      title: 'Generate Document',
      description: 'Create professional lab reports instantly.',
      icon: <Sparkles size={28} />,
      color: 'bg-[#1AA3A3]',
      text: 'text-[#1AA3A3]',
      bg: 'bg-[#1AA3A3]/10',
      border: 'hover:border-[#1AA3A3]',
      path: '/generate' // 👈 Path Added
    },
    {
      id: 'workspace',
      title: 'My Workspace',
      description: 'Manage received PDFs and history.',
      icon: <Briefcase size={28} />,
      color: 'bg-[#F54A00]',
      text: 'text-[#F54A00]',
      bg: 'bg-[#F54A00]/10',
      border: 'hover:border-[#F54A00]',
      path: '/workspace'
    },
    {
      id: 'explore',
      title: 'Explore Students',
      description: 'Find peers by Year and Branch.',
      icon: <Compass size={28} />,
      color: 'bg-blue-500',
      text: 'text-blue-500',
      bg: 'bg-blue-500/10',
      border: 'hover:border-blue-500',
      path: '/explore'
    },
    {
      id: 'friends',
      title: 'Friends & Network',
      description: 'Build your circle for sharing.',
      icon: <Users size={28} />,
      color: 'bg-purple-500',
      text: 'text-purple-500',
      bg: 'bg-purple-500/10',
      border: 'hover:border-purple-500',
      path: '/friends'
    }
  ];

  return (
    <div className="min-h-screen w-full bg-[#F3F2ED] dark:bg-[#050505] relative transition-colors duration-300">
      
      <DashboardNavbar user={currentUser} onLogout={handleLogout} />

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] size-[500px] rounded-full blur-[120px] opacity-10 dark:opacity-5 bg-[#F54A00]" />
          <div className="absolute bottom-[-10%] right-[-10%] size-[500px] rounded-full blur-[120px] opacity-10 dark:opacity-5 bg-[#1AA3A3]" />
      </div>

      <div className="relative z-10 pt-24 px-4 md:px-8 max-w-6xl mx-auto pb-20">
        
        <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
        >
            <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold tracking-wider text-[#F54A00] uppercase bg-[#F54A00]/10 px-2 py-0.5 rounded">
                    Student Dashboard
                </span>
                {currentUser.isVerified && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-[#1AA3A3] bg-[#1AA3A3]/10 px-2 py-0.5 rounded">
                        <ShieldCheck size={12} /> Verified
                    </span>
                )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                Welcome, {formatName(currentUser.name)}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                What would you like to do today?
            </p>
        </motion.div>

         {/* 🚀 GRID LAYOUT */}
         <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
         >
            {features.map((feature) => (
              <motion.div
                key={feature.id}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(feature.path)} // 👈 Navigation Logic
                className={`bg-white dark:bg-[#111111] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl cursor-pointer group transition-all duration-300 ${feature.border}`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`p-4 rounded-2xl ${feature.bg} ${feature.text} transition-colors group-hover:scale-110 duration-300`}>
                    {feature.icon}
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                     <div className={`p-2 rounded-full ${feature.bg} ${feature.text}`}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                     </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
         </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;