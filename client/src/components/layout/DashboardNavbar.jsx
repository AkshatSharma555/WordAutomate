import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, LogOut, ChevronDown, User } from 'lucide-react';
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
          // Force redirect if not handled by context
          navigate('/login');
      }
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#111111]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-3 md:px-10 flex items-center justify-between h-16 transition-colors duration-300">
      
      {/* 1. Left: Logo */}
      <div className="flex items-center gap-2">
        <Logo /> 
      </div>

      {/* 2. Right: Profile & Actions */}
      <div className="flex items-center gap-4 md:gap-6">
        
        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 p-1 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus:outline-none group"
          >
            {/* Avatar */}
            <div className="size-9 rounded-full bg-[#1AA3A3]/10 text-[#1AA3A3] flex items-center justify-center font-bold text-sm border border-[#1AA3A3]/20 overflow-hidden relative ring-2 ring-transparent group-hover:ring-[#1AA3A3]/20 transition-all">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
              ) : (
                getInitials(user?.name)
              )}
            </div>
            
            {/* Name & Role (Hidden on mobile) */}
            <div className="hidden md:flex flex-col items-start text-sm">
              <span className="font-semibold text-slate-700 dark:text-slate-200 leading-none max-w-[100px] truncate group-hover:text-[#1AA3A3] transition-colors">
                {user?.name?.split(' ')[0]} 
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Student</span>
            </div>
            
            <ChevronDown size={16} className={`text-slate-400 dark:text-slate-500 hidden md:block transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-full mt-2 w-60 bg-white dark:bg-[#1a1a1a] rounded-xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden py-1 z-50 ring-1 ring-black/5"
              >
                {/* Mobile User Info Header */}
                <div className="px-4 py-3 border-b border-slate-50 dark:border-slate-800 md:hidden bg-slate-50/50 dark:bg-[#222]/50">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{user?.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                </div>

                <div className="p-1">
                    <Link 
                        to="/settings" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-[#1AA3A3] rounded-lg transition-colors"
                    >
                        <User size={16} /> Profile & Settings
                    </Link>
                    
                    <button 
                        onClick={handleLogout} 
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors text-left mt-1"
                    >
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;