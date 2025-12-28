import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { navLinks } from '../../config/navigation';
import Logo from '../common/Logo';
import Button from '../common/Button';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext'; // Auth state check karne ke liye

const Navbar = ({ className, isDark }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useAuth(); // Check user login status

  return (
    <>
      {/* --- Desktop & Main Navbar --- */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={cn(
            "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 lg:px-20 border-b backdrop-blur-md transition-all duration-300",
            // Theme Logic: Light mode mein tumhara Warm Off-White use kiya hai
            isDark 
                ? "bg-transparent border-white/5" 
                : "bg-[#F3F2ED]/90 border-slate-200", 
            className
        )}
      >
        {/* 1. Logo */}
        <Logo isDark={isDark} />

        {/* 2. Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className={cn(
                  "text-sm font-medium transition-colors duration-200",
                  // Text Colors: Default Slate, Hover pe TEAL (#1AA3A3)
                  isDark 
                    ? "text-slate-300 hover:text-white" 
                    : "text-slate-600 hover:text-[#1AA3A3]"
              )}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* 3. Action Button (Single Login/Dashboard Button) */}
        <div className="hidden md:flex items-center gap-4">
            {currentUser ? (
                <Link to="/dashboard">
                    <Button className="bg-[#1AA3A3] hover:bg-[#158585] text-white shadow-lg shadow-[#1AA3A3]/20 border-none">
                        Dashboard
                    </Button>
                </Link>
            ) : (
                <Link to="/login">
                    {/* Orange Button for High Visibility */}
                    <Button className="bg-[#F54A00] hover:bg-[#D94100] text-white shadow-lg shadow-[#F54A00]/20 border-none">
                        Login
                    </Button>
                </Link>
            )}
        </div>

        {/* 4. Mobile Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className={cn(
              "md:hidden p-2 transition-colors",
              isDark ? "text-slate-300 hover:text-white" : "text-slate-900 hover:text-[#1AA3A3]"
          )}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </motion.nav>

      {/* --- Mobile Menu Overlay --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
                "fixed inset-0 z-40 pt-24 px-6 md:hidden backdrop-blur-xl transition-colors duration-300",
                // Mobile Background matches Theme
                isDark ? "bg-slate-950/95" : "bg-[#F3F2ED]/95"
            )}
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                      "text-xl font-medium transition-colors hover:text-[#1AA3A3]",
                      isDark ? "text-slate-300" : "text-slate-900"
                  )}
                >
                  {link.name}
                </a>
              ))}
              
              <div className={cn("h-px my-2", isDark ? "bg-white/10" : "bg-slate-200")} />
              
              {/* Mobile Action Button */}
              {currentUser ? (
                  <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                    <Button className="w-full justify-center bg-[#1AA3A3] hover:bg-[#158585] text-white border-none">
                        Dashboard
                    </Button>
                  </Link>
              ) : (
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button className="w-full justify-center bg-[#F54A00] hover:bg-[#D94100] text-white border-none">
                        Login
                    </Button>
                  </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;