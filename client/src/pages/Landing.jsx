import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Layout & UI
import Navbar from '../components/layout/Navbar';
import Footer from '../sections/Footer';
import SmoothScroll from '../components/common/SmoothScroll';

// 👇 CHANGE 1: Direct Import (No Lazy Loading for Hero Background)
// Isse component turant load hoga bina wait kiye.
import FloatingLines from '../components/ui/FloatingLines';

// Sections
import HeroSection from '../sections/HeroSection';
import FeaturesSection from '../sections/FeaturesSection';
import HowItWorks from '../sections/HowItWorks';
import AboutApp from '../sections/AboutApp';
import Testimonials from '../sections/Testimonials';
import Contact from '../sections/Contact';

const Landing = () => {
  // 1. Initialize State (Fastest way)
  const [isCreativeMode, setIsCreativeMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme-preference');
      return savedTheme !== null ? JSON.parse(savedTheme) : true;
    }
    return true;
  });

  // 2. Body Class Sync
  useEffect(() => {
    localStorage.setItem('theme-preference', JSON.stringify(isCreativeMode));
    // Classlist toggle is faster than re-rendering whole DOM
    document.documentElement.classList.toggle('dark', isCreativeMode);
  }, [isCreativeMode]);

  const toggleTheme = useCallback(() => {
    setIsCreativeMode((prev) => !prev);
  }, []);

  return (
    <SmoothScroll>
      <div
        className={`relative min-h-screen transition-colors duration-300 overflow-hidden ${
          isCreativeMode
            ? 'dark bg-slate-950 text-white selection:bg-[#F54A00] selection:text-white'
            : 'bg-[#F3F2ED] text-slate-900 selection:bg-[#1AA3A3] selection:text-white'
        }`}
      >
        {/* --- Background Layer --- */}
        {/* Pointer events none ensures scroll works perfectly over canvas */}
        <div className="fixed inset-0 z-0 pointer-events-none transform-gpu">
            <AnimatePresence mode="popLayout">
            {isCreativeMode && (
                <motion.div
                    key="creative-bg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    // 👇 CHANGE 2: Faster Duration (1.0s -> 0.5s)
                    // Jyada lamba animation "Lag" jaisa feel deta hai. Fast = Smooth.
                    transition={{ duration: 0.5, ease: "linear" }} 
                    className="absolute inset-0 bg-black will-change-opacity"
                >
                    {/* 👇 CHANGE 3: No Suspense needed anymore */}
                    <FloatingLines
                        linesGradient={['#1AA3A3', '#F54A00']}
                        enabledWaves={['top', 'middle', 'bottom']}
                        lineCount={[6, 8, 10]}
                        lineDistance={[10, 8, 6]}
                        bendRadius={5.0}
                        bendStrength={-0.4}
                        interactive={true} 
                        parallax={true}
                        parallaxStrength={0.5}
                    />
                    
                    {/* Simple dark overlay for contrast */}
                    <div className="absolute inset-0 bg-black/70" />
                </motion.div>
            )}
            </AnimatePresence>
        </div>

        {/* --- Content Layer --- */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar isDark={isCreativeMode} />

          <main className="flex-grow [&>section]:bg-transparent [&>section]:relative">
            <HeroSection isDark={isCreativeMode} />
            <FeaturesSection isDark={isCreativeMode} />
            <HowItWorks isDark={isCreativeMode} />
            <AboutApp isDark={isCreativeMode} />
            <Testimonials isDark={isCreativeMode} />
            <Contact isDark={isCreativeMode} />
          </main>

          <Footer
            isDark={isCreativeMode}
            toggleTheme={toggleTheme}
          />
        </div>
      </div>
    </SmoothScroll>
  );
};

export default Landing;