import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Settings, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../common/Logo';

const DashboardNavbar = ({ user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name) => {
    return name ? name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
  };

  return (
    // 🌟 Navbar styling: White in Light, Dark Gray in Dark
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#111111]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-3 md:px-10 flex items-center justify-between h-16 transition-colors duration-300">
      
      <div className="flex items-center gap-2">
        {/* 🌟 Logo Component handles text color internally now */}
        <Logo /> 
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-[#1AA3A3] dark:hover:text-[#1AA3A3] transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 size-2 bg-[#F54A00] rounded-full border border-white dark:border-[#111]"></span>
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 p-1 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus:outline-none"
          >
            <div className="size-9 rounded-full bg-[#1AA3A3]/10 text-[#1AA3A3] flex items-center justify-center font-bold text-sm border border-[#1AA3A3]/20 overflow-hidden relative">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
              ) : (
                getInitials(user?.name)
              )}
            </div>
            
            <div className="hidden md:flex flex-col items-start text-sm">
              <span className="font-semibold text-slate-700 dark:text-slate-200 leading-none max-w-[100px] truncate">
                {user?.name?.split(' ')[0]} 
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">Student</span>
            </div>
            
            <ChevronDown size={16} className="text-slate-400 dark:text-slate-500 hidden md:block" />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#1a1a1a] rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden py-1"
              >
                <div className="px-4 py-3 border-b border-slate-50 dark:border-slate-800 md:hidden">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{user?.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                </div>

                <Link to="/settings" className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-[#1AA3A3] transition-colors">
                  <Settings size={16} /> Account Settings
                </Link>
                
                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
                
                <button onClick={onLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-left">
                  <LogOut size={16} /> Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;