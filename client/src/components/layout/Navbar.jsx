import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { navLinks } from '../../config/navigation';
import Logo from '../common/Logo';
import Button from '../common/Button';
import { cn } from '../../utils/cn';

const Navbar = ({ className, isDark }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* --- Desktop & Main Navbar --- */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={cn(
            "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 lg:px-20 border-b backdrop-blur-md transition-all duration-300",
            // Conditional Styling based on Theme
            isDark 
                ? "bg-transparent border-white/5"  // Creative Mode (Dark)
                : "bg-cream/80 border-slate-200",  // Default Mode (Light/Cream)
            className
        )}
      >
        {/* 1. Logo (Pass isDark prop) */}
        <Logo isDark={isDark} />

        {/* 2. Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  // Text Color Logic
                  isDark ? "text-slate-300" : "text-slate-600"
              )}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* 3. Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Button 
            variant="ghost" 
            className={cn(
                "hidden lg:inline-flex transition-colors",
                isDark ? "text-slate-300 hover:text-white" : "text-slate-700 hover:bg-slate-200/50"
            )}
          >
            Sign In
          </Button>
          <Button>
            Get Started
          </Button>
        </div>

        {/* 4. Mobile Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className={cn(
              "md:hidden p-2 transition-colors",
              isDark ? "text-slate-300 hover:text-white" : "text-slate-900 hover:text-primary"
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
                // Mobile Menu Background Logic
                isDark ? "bg-slate-950/95" : "bg-cream/95"
            )}
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                      "text-xl font-medium transition-colors hover:text-primary",
                      isDark ? "text-slate-300" : "text-slate-900"
                  )}
                >
                  {link.name}
                </a>
              ))}
              
              <div className={cn("h-px my-2", isDark ? "bg-white/10" : "bg-slate-200")} />
              
              <Button 
                variant="outline" 
                className={cn(
                    "w-full justify-center",
                    // Outline button styling adjustment for Light Mode visibility
                    !isDark && "border-slate-300 text-slate-700 hover:bg-slate-100"
                )}
              >
                Sign In
              </Button>
              <Button className="w-full justify-center">Get Started</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;