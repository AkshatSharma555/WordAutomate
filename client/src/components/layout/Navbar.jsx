import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { navLinks } from '../../config/navigation';
import ThreeDLogo from '../common/ThreeDLogo'; 
import Button from '../common/Button';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ className, isDark }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const { currentUser } = useAuth();

  // ✨ Magic Particles
  const particleCount = 12;
  const generateParticles = () => Array.from({ length: particleCount });

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 md:px-12 lg:px-20 border-b backdrop-blur-xl transition-all duration-500",
          isDark ? "bg-black/20 border-white/10" : "bg-[#F3F2ED]/80 border-slate-200",
          className
        )}
      >
        {/* 1. LEFT: LOGO CAPSULE */}
        <Link 
            to="/" 
            className="group relative flex items-center outline-none"
            onMouseEnter={() => setIsLogoHovered(true)}
            onMouseLeave={() => setIsLogoHovered(false)}
        >
            {/* Glass Capsule Container */}
            <div className={cn(
                // 🔥 FIX: Removed 'pl-0', used 'pl-1'. Removed tight overflow clipping issues.
                "relative flex items-center gap-1 pl-1 pr-5 py-1 rounded-full border transition-all duration-500 overflow-hidden",
                isDark 
                    ? "bg-white/5 border-white/10 hover:border-[#F54A00]/50 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(245,74,0,0.15)]" 
                    : "bg-white/60 border-white/40 hover:border-[#F54A00]/30 hover:bg-white/80 hover:shadow-lg hover:shadow-orange-500/10"
            )}>
                
                {/* ✨ MAGIC PARTICLES */}
                <AnimatePresence>
                    {isLogoHovered && generateParticles().map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ x: 10, y: 0, opacity: 0, scale: 0 }}
                            animate={{ 
                                x: [10, 80 + Math.random() * 60], 
                                y: [(Math.random() - 0.5) * 15, (Math.random() - 0.5) * 45], 
                                opacity: [0, 1, 0], 
                                scale: [0, Math.random() * 1.5, 0] 
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ 
                                duration: 0.8 + Math.random(), 
                                repeat: Infinity, 
                                ease: "easeOut",
                                delay: Math.random() * 0.3 
                            }}
                            className={cn(
                                "absolute left-4 top-1/2 w-1 h-1 rounded-full pointer-events-none z-0",
                                i % 2 === 0 ? "bg-[#F54A00]" : "bg-[#1AA3A3]"
                            )}
                        />
                    ))}
                </AnimatePresence>

                {/* 🔥 3D Logo Container: Increased size to w-14 to prevent clipping */}
                {/* Removed negative margin (-ml) to fix the 'half hidden' issue */}
                <div className="w-14 h-14 relative flex-shrink-0 z-10 flex items-center justify-center">
                    <ThreeDLogo className="w-full h-full" isHovered={isLogoHovered} />
                </div>
                
                {/* Text Section */}
                <div className="flex flex-col justify-center relative z-10 -ml-1">
                    <span className={cn(
                        "text-xl font-black tracking-tight leading-none transition-all duration-300 relative",
                        isDark ? "text-white" : "text-slate-900"
                    )}>
                        Word<span className="text-[#F54A00]">Automate</span>
                    </span>

                    {/* Hover Underline */}
                    <span className="absolute -bottom-1.5 left-0 h-[3px] bg-[#1AA3A3] rounded-full shadow-[0_0_8px_#1AA3A3] w-0 opacity-0 group-hover:w-full group-hover:opacity-100 transition-all duration-300 ease-out" />
                </div>
            </div>
        </Link>

        {/* 2. MIDDLE: Nav Links (Desktop) */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors duration-200 relative group",
                isDark
                  ? "text-slate-300 hover:text-white"
                  : "text-slate-600 hover:text-[#F54A00]"
              )}
            >
              {link.name}
              <span className={cn(
                  "absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full",
                  isDark ? "bg-white" : "bg-[#F54A00]"
              )}/>
            </a>
          ))}
        </div>

        {/* 3. RIGHT: Auth Buttons (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          {currentUser ? (
            <Link to="/dashboard">
              <Button className="bg-[#1AA3A3] hover:bg-[#158585] text-white shadow-lg shadow-[#1AA3A3]/20 border-none">
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button
                className={cn(
                  "text-white shadow-lg border-none transition-all hover:scale-105",
                  isDark
                    ? "bg-white text-black hover:bg-slate-200 shadow-white/10"
                    : "bg-[#F54A00] hover:bg-[#D94100] shadow-[#F54A00]/20"
                )}
              >
                Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "md:hidden p-2 transition-colors rounded-lg",
            isDark ? "text-white hover:bg-white/10" : "text-slate-900 hover:bg-slate-200"
          )}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              "fixed inset-0 z-40 pt-24 px-6 md:hidden backdrop-blur-xl transition-colors duration-300",
              isDark ? "bg-black/90" : "bg-[#F3F2ED]/95"
            )}
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-xl font-medium transition-colors",
                    isDark ? "text-slate-300 hover:text-white" : "text-slate-900 hover:text-[#F54A00]"
                  )}
                >
                  {link.name}
                </a>
              ))}
              <div className={cn("h-px my-2", isDark ? "bg-white/10" : "bg-slate-200")} />
              {currentUser ? (
                <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                  <Button className="w-full justify-center bg-[#1AA3A3] hover:bg-[#158585] text-white border-none">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button
                    className={cn(
                      "w-full justify-center border-none",
                      isDark ? "bg-white text-black" : "bg-[#F54A00] text-white"
                    )}
                  >
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