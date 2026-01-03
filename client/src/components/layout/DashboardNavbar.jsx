import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, LogOut, ChevronDown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../common/Logo';

const DashboardNavbar = ({ user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
      if (onLogout) {
          onLogout();
          navigate('/login');
      }
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
  };

  return (
    // NAVBAR CONTAINER (Full Width Glass Header)
    <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 w-full bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-white/10 px-6 md:px-10 py-3 shadow-sm flex items-center justify-between transition-all duration-300"
    >
      
      {/* 1. LEFT: Logo Area */}
      <div className="flex items-center gap-4">
        <Logo /> 
      </div>

      {/* 2. RIGHT: Profile Pill */}
      <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center gap-3 pl-1 pr-4 py-1.5 rounded-full transition-all duration-300 group border border-transparent ${
                isDropdownOpen 
                ? 'bg-slate-100 dark:bg-white/10 border-slate-200 dark:border-white/5' 
                : 'hover:bg-slate-50 dark:hover:bg-white/5 hover:border-slate-200/50 dark:hover:border-white/10'
            }`}
          >
            {/* Avatar Ring */}
            <div className="relative">
                <div className="size-9 rounded-full bg-gradient-to-tr from-[#1AA3A3] to-teal-400 p-[2px] shadow-sm">
                    <div className="size-full rounded-full bg-white dark:bg-black overflow-hidden flex items-center justify-center">
                        {user?.profilePicture ? (
                            <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="font-bold text-xs text-[#1AA3A3]">{getInitials(user?.name)}</span>
                        )}
                    </div>
                </div>
                {/* Online Dot */}
                <div className="absolute bottom-0 right-0 size-2.5 bg-green-500 border-2 border-white dark:border-black rounded-full ring-1 ring-black/5"></div>
            </div>
            
            {/* User Info (Text) */}
            <div className="hidden md:flex flex-col items-start text-sm">
              <span className="font-bold text-slate-700 dark:text-slate-200 leading-none text-xs group-hover:text-[#1AA3A3] transition-colors">
                {user?.name?.split(' ')[0]} 
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                Student
              </span>
            </div>
            
            <ChevronDown 
                size={14} 
                className={`text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-[#1AA3A3]' : ''}`} 
            />
          </button>

          {/* 3. DROPDOWN MENU */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 10, scale: 0.95, filter: "blur(10px)" }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="absolute right-0 top-full mt-2 w-64 bg-white/90 dark:bg-[#111]/90 backdrop-blur-3xl rounded-2xl shadow-2xl border border-slate-100 dark:border-white/10 overflow-hidden py-2 z-50 origin-top-right ring-1 ring-black/5"
              >
                {/* Mobile Header */}
                <div className="px-5 py-3 border-b border-slate-100 dark:border-white/5 md:hidden">
                    <p className="font-bold text-slate-800 dark:text-white truncate">{user?.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                </div>

                {/* Menu Items */}
                <div className="p-1.5 space-y-1">
                    <Link 
                        to="/settings" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-[#1AA3A3] rounded-xl transition-all group"
                    >
                        <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-500 group-hover:text-[#1AA3A3] group-hover:bg-[#1AA3A3]/10 transition-colors">
                            <Settings size={16} />
                        </div>
                        Account Settings
                    </Link>
                    
                    <button 
                        onClick={handleLogout} 
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all text-left group"
                    >
                        <div className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors">
                            <LogOut size={16} />
                        </div>
                        Sign Out
                    </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default DashboardNavbar;