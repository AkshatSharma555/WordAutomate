import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import HeroSection from '../sections/HeroSection';
import FeaturesSection from '../sections/FeaturesSection';
import HowItWorks from '../sections/HowItWorks';
import AboutApp from '../sections/AboutApp';
import Testimonials from '../sections/Testimonials';
import Contact from '../sections/Contact';
import Footer from '../sections/Footer';
import FloatingLines from '../components/ui/FloatingLines';
import SmoothScroll from '../components/common/SmoothScroll';
import { AnimatePresence, motion } from 'framer-motion';

const Landing = () => {
  // 🌟 DEFAULT STATE: false (Light Mode / Cream)
  // Toggle karne par: true (Dark Mode / Creative)
  const [isCreativeMode, setIsCreativeMode] = useState(false);

  return (
    <SmoothScroll>
    <div className={`relative min-h-screen transition-colors duration-500 overflow-hidden ${
        isCreativeMode 
            ? "bg-slate-950 text-white selection:bg-primary selection:text-white" // Dark Mode
            : "bg-cream text-slate-900 selection:bg-primary selection:text-white"   // SIES Cream Mode
    }`}>
      
      {/* --- BACKGROUND LAYER (Only Visible in Creative Mode) --- */}
      <AnimatePresence>
        {isCreativeMode && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="fixed inset-0 z-0 bg-black"
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
                {/* Dark Overlay for better text readability on lines */}
                <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px]" /> 
            </motion.div>
        )}
      </AnimatePresence>

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Navbar: Colors change based on isDark */}
        <Navbar isDark={isCreativeMode} />
        
        {/* Main Content */}
        {/* Magic Class: [&>section]:bg-transparent 
            Yeh ensure karta hai ki sections ke apne background color hat jayein 
            taaki peeche ka cream ya lines dikhai dein.
        */}
        <main className="flex-grow [&>section]:bg-transparent [&>section]:relative">
          
          {/* 👇 Ab har section ko pata hai ki Theme kya hai */}
          <HeroSection isDark={isCreativeMode} />
          <FeaturesSection isDark={isCreativeMode} />
          <HowItWorks isDark={isCreativeMode} />
          <AboutApp isDark={isCreativeMode} />
          <Testimonials isDark={isCreativeMode} />
          <Contact isDark={isCreativeMode} />
        
        </main>
        
        {/* Footer: Toggle switch yahan hai */}
        <Footer 
            isDark={isCreativeMode} 
            toggleTheme={() => setIsCreativeMode(!isCreativeMode)} 
        />
      </div>

    </div>
   </SmoothScroll>
  );
};

export default Landing;