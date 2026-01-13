import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import MagicBento from '../components/ui/MagicBento';
import OnboardingModal from '../components/common/OnboardingModal';
import AccessDeniedModal from '../components/common/AccessDeniedModal';
import { Loader2, Sparkles, Briefcase, Compass, Users, ShieldCheck, AlertTriangle, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const { currentUser, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');
  
  // 🔥 1. Persistent Skip Logic (LocalStorage Check)
  const [hasSkippedOnboarding, setHasSkippedOnboarding] = useState(() => {
      return localStorage.getItem('onboarding_skipped') === 'true';
  });

  const [showAccessDenied, setShowAccessDenied] = useState(false);

  const isDark = document.documentElement.classList.contains('dark');

  // 🔥 2. Robust Greeting & Auth Check
  useEffect(() => {
    if (!loading && !currentUser) navigate('/login');
    
    const updateGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 4 && hour < 12) setGreeting('Good Morning');
        else if (hour >= 12 && hour < 17) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');
    };

    updateGreeting();
    // Update greeting every hour automatically if tab is open
    const interval = setInterval(updateGreeting, 60000 * 60); 
    return () => clearInterval(interval);

  }, [currentUser, loading, navigate]);

  const handleLogout = async () => { await logout(); navigate('/'); };

  const formatName = (name) => {
    return name ? name.split(' ')[0] : 'Student';
  };

  // 🔥 3. Handle Skip Action
  const handleSkipOnboarding = () => {
      localStorage.setItem('onboarding_skipped', 'true');
      setHasSkippedOnboarding(true);
      toast('Setup skipped. You can explore the dashboard now.', {
        icon: '👍',
        style: { borderRadius: '10px', background: '#333', color: '#fff' },
      });
  };

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F3F2ED] dark:bg-[#050505]">
         <Loader2 className="size-8 animate-spin text-[#1AA3A3]" />
      </div>
    );
  }

  // ✅ Check if profile is incomplete
  const isProfileIncomplete = !currentUser?.prn || !currentUser?.branch || !currentUser?.year;

  // 🔥 4. Smart Action Handler (Locks Features)
  const handleRestrictedAction = (e, path) => {
      if (isProfileIncomplete) {
          e.preventDefault();
          e.stopPropagation();
          setShowAccessDenied(true); 
      } else {
          navigate(path);
      }
  };

  // Bento Items Configuration
  const bentoItems = [
    {
      id: 'workspace',
      title: 'My Workspace',
      description: 'Access your complete document history.',
      icon: Briefcase,
      // Lock Link if incomplete
      href: isProfileIncomplete ? '#' : '/workspace',
      onClick: (e) => handleRestrictedAction(e, '/workspace')
    },
    {
      id: 'generate',
      title: 'Generate Document',
      description: 'Create professional lab reports instantly.',
      icon: Sparkles,
      // Lock Link if incomplete
      href: isProfileIncomplete ? '#' : '/generate',
      onClick: (e) => handleRestrictedAction(e, '/generate') 
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
      
      {/* 🛡️ 1. Onboarding Modal (Only if incomplete AND NOT skipped) */}
      <AnimatePresence>
        {isProfileIncomplete && !hasSkippedOnboarding && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center">
                <OnboardingModal onSkip={handleSkipOnboarding} />
            </div>
        )}
      </AnimatePresence>

      {/* 🛡️ 2. Access Denied Modal (Shows when clicking locked items) */}
      <AccessDeniedModal 
        isOpen={showAccessDenied} 
        onClose={() => setShowAccessDenied(false)} 
      />

      <DashboardNavbar user={currentUser} onLogout={handleLogout} />

      {/* ✨ 3. Background Ambience (Restored) */}
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

      {/* 4. Reminder Banner (Only shows if Skipped) */}
      {isProfileIncomplete && hasSkippedOnboarding && (
         <div className="pt-24 px-4 md:px-8 max-w-6xl mx-auto relative z-10">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-md"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/20 rounded-full text-orange-500">
                        <AlertTriangle size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-orange-600 dark:text-orange-400 text-sm">Setup Pending</h3>
                        <p className="text-xs text-orange-600/80 dark:text-orange-400/80">Update PRN & Branch to start generating documents.</p>
                    </div>
                </div>
                <button 
                    onClick={() => navigate('/settings')}
                    className="w-full md:w-auto px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    Complete in Settings <ArrowRight size={14} />
                </button>
            </motion.div>
         </div>
      )}

      {/* Main Content */}
      <div className={`relative z-10 px-4 md:px-8 max-w-6xl mx-auto pb-20 ${isProfileIncomplete && hasSkippedOnboarding ? 'pt-6' : 'pt-24'}`}>
        
        {/* 5. Greeting Section (Restored Style) */}
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
                {currentUser.isAccountVerified && (
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

        {/* 6. Bento Grid */}
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full"
        >
            <MagicBento items={bentoItems} isDark={isDark} glowColor="26, 163, 163" />
        </motion.div>

      </div>
    </div>
  );
};

export default Dashboard;