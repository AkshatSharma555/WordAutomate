import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import MagicBento from '../components/ui/MagicBento';
import OnboardingModal from '../components/common/OnboardingModal';
import { ShieldCheck, Loader2, Sparkles, Briefcase, Compass, Users } from 'lucide-react';

const Dashboard = () => {
  const { currentUser, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');

  const isDark = document.documentElement.classList.contains('dark');

  useEffect(() => {
    if (!loading && !currentUser) navigate('/login');
    
    // 🔥 ROBUST GREETING LOGIC
    const updateGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 4 && hour < 12) {
            setGreeting('Good Morning');
        } else if (hour >= 12 && hour < 17) {
            setGreeting('Good Afternoon');
        } else {
            // 5 PM se lekar subah 4 AM tak "Good Evening"
            // Isse raat ke 1-2 baje bhi "Good Morning" nahi bolega
            setGreeting('Good Evening');
        }
    };

    updateGreeting();

    // Optional: Update greeting if user keeps tab open for hours
    const interval = setInterval(updateGreeting, 60000 * 60); 
    return () => clearInterval(interval);

  }, [currentUser, loading, navigate]);

  const handleLogout = async () => { await logout(); navigate('/'); };

  const formatName = (name) => {
    return name ? name.split(' ')[0] : 'Student';
  };

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F3F2ED] dark:bg-[#050505]">
         <Loader2 className="size-8 animate-spin text-[#1AA3A3]" />
      </div>
    );
  }

  // ✅ Profile Validation
  const isProfileIncomplete = !currentUser?.prn || !currentUser?.branch || !currentUser?.year;

  // Bento Items
  const bentoItems = [
    {
      id: 'workspace',
      title: 'My Workspace',
      description: 'Access your complete document history. View files received from friends and manage the reports you have generated.',
      icon: Briefcase,
      href: '/workspace',
    },
    {
      id: 'generate',
      title: 'Generate Document',
      description: 'Create professional lab reports instantly using our smart templates. Automate formatting, save time, and focus on learning.',
      icon: Sparkles,
      href: '/generate',
    },
    {
      id: 'explore',
      title: 'Explore',
      description: 'Find peers across departments.',
      icon: Compass,
      href: '/explore',
    },
    {
      id: 'friends',
      title: 'My Network',
      description: 'Connect with your batchmates.',
      icon: Users,
      href: '/friends',
    }
  ];

  return (
    <div className="min-h-screen w-full bg-[#F3F2ED] dark:bg-[#050505] relative transition-colors duration-300 overflow-x-hidden font-sans">
      
      {/* 🛡️ Gatekeeper Modal */}
      {isProfileIncomplete && <OnboardingModal />}

      <DashboardNavbar user={currentUser} onLogout={handleLogout} />

      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full blur-[120px] 
              bg-[#F54A00] opacity-10 dark:opacity-[0.08] mix-blend-multiply dark:mix-blend-normal animate-pulse" 
              style={{animationDuration: '8s'}} 
          />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full blur-[120px] 
              bg-[#1AA3A3] opacity-10 dark:opacity-[0.08] mix-blend-multiply dark:mix-blend-normal animate-pulse" 
              style={{animationDuration: '10s'}} 
          />
      </div>

      <div className="relative z-10 pt-24 px-4 md:px-8 max-w-6xl mx-auto pb-20">
        
        {/* Greeting Section */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
        >
            <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold tracking-widest text-[#F54A00] uppercase bg-[#F54A00]/10 px-3 py-1 rounded-full border border-[#F54A00]/20">
                    Dashboard
                </span>
                {currentUser.isVerified && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[#1AA3A3] bg-[#1AA3A3]/10 px-3 py-1 rounded-full border border-[#1AA3A3]/20">
                        <ShieldCheck size={10} /> Verified
                    </span>
                )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
                {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1AA3A3] to-[#F54A00]">{formatName(currentUser.name)}</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg font-medium max-w-xl">
                Ready to automate your assignments?
            </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full"
        >
            <MagicBento 
                items={bentoItems} 
                isDark={isDark} 
                glowColor="26, 163, 163" 
            />
        </motion.div>

      </div>
    </div>
  );
};

export default Dashboard;