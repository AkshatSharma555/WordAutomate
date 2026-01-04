import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Layout & UI
import Navbar from '../components/layout/Navbar';
import Footer from '../sections/Footer';
import FloatingLines from '../components/ui/FloatingLines';
import SmoothScroll from '../components/common/SmoothScroll';

// Sections
import HeroSection from '../sections/HeroSection';
import FeaturesSection from '../sections/FeaturesSection';
import HowItWorks from '../sections/HowItWorks';
import AboutApp from '../sections/AboutApp';
import Testimonials from '../sections/Testimonials';
import Contact from '../sections/Contact';

const Landing = () => {
  // 1. Initialize State from LocalStorage (User preference yaad rakhega)
  const [isCreativeMode, setIsCreativeMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme-preference');
      // Default to true (Dark Mode) if nothing saved
      return savedTheme !== null ? JSON.parse(savedTheme) : true;
    }
    return true;
  });

  // 2. Persist Theme Changes & Update Body Class
  useEffect(() => {
    localStorage.setItem('theme-preference', JSON.stringify(isCreativeMode));
    
    // Optional: Add class to body for global tailwind usage if needed
    if (isCreativeMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isCreativeMode]);

  // 3. Memoized Toggle Handler (Performance Optimization)
  const toggleTheme = useCallback(() => {
    setIsCreativeMode((prev) => !prev);
  }, []);

  return (
    <SmoothScroll>
      <div
        className={`relative min-h-screen transition-colors duration-500 overflow-hidden ${
          isCreativeMode
            ? 'dark bg-slate-950 text-white selection:bg-[#F54A00] selection:text-white'
            : 'bg-[#F3F2ED] text-slate-900 selection:bg-[#1AA3A3] selection:text-white'
        }`}
      >
        {/* --- Background Effects Layer --- */}
        <AnimatePresence mode="wait">
          {isCreativeMode && (
            <motion.div
              key="creative-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="fixed inset-0 z-0 bg-black pointer-events-none" // pointer-events-none ensures clicks pass through
            >
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
              {/* Overlay for readability */}
              <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- Content Layer --- */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar isDark={isCreativeMode} />

          <main className="flex-grow [&>section]:bg-transparent [&>section]:relative">
            {/* Pass isDark prop to all sections for internal styling adjustments */}
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