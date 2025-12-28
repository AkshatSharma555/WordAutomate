import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Video, Check } from 'lucide-react';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import SplitText from '../components/ui/SplitText';
import { cn } from '../utils/cn';

const HeroSection = ({ isDark }) => {
  const features = ["No credit card required", "Secure College Login", "Instant PDF"];

  return (
    <section className="relative flex flex-col items-center justify-center pt-32 pb-20 px-4 md:px-6 overflow-hidden min-h-[80vh]">
      
      {/* Background Glow Effect */}
      {isDark && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 size-[300px] md:size-[500px] bg-primary/20 blur-[100px] md:blur-[120px] rounded-full -z-10" />
      )}

      {/* 1. New Feature Badge (Yeh sabse pehle aayega - 0.5s duration) */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }} // Thoda sa delay diya taaki Navbar ke saath load ho
      >
        <Badge className={cn(
            "mb-6 md:mb-8 flex items-center gap-2 cursor-pointer transition border",
            "bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20"
        )}>
          NEW
          <span className={cn(
              "flex items-center gap-1",
              isDark ? "text-white/80" : "text-slate-700"
          )}>
            v2.0 is live now <ChevronRight size={14} />
          </span>
        </Badge>
      </motion.div>

      {/* 2. Main Heading (TEXT ANIMATION - Ab Late Start Hoga) */}
      <div className="text-center max-w-4xl mx-auto mb-6">
        
        {/* Line 1 */}
        <div className={cn(
            "text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] md:leading-tight tracking-tight",
            isDark ? "text-white" : "text-slate-900"
        )}>
          {/* 👇 DELAY CHANGE KIYA: 1.0 (Matlab Badge aur Navbar aane ke baad shuru hoga) */}
          <SplitText 
            text="Automate your lab" 
            delay={1.0} 
          />
        </div>

        {/* Line 2 */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] md:leading-tight tracking-tight mt-2">
            
            {/* Teal Text */}
            <SplitText 
                text="documentation" 
                className="text-primary" 
                delay={1.4} // Line 1 ke khatam hone ke baad
            />
            
            {/* Orange Text */}
            <SplitText 
                text="work." 
                className="text-secondary" 
                delay={1.8} // Sabse end mein
            />
        </div>
      </div>

      {/* 3. Subtitle (Text ke baad aayega) */}
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.5 }} // Text khatam hone ke baad
        className={cn(
            "text-base md:text-xl text-center max-w-xl md:max-w-2xl mt-4 px-4 leading-relaxed",
            isDark ? "text-slate-400" : "text-slate-600"
        )}
      >
        Stop manually editing Word files. Upload your template, auto-fill details, and download formatted PDFs instantly.
      </motion.p>

      {/* 4. Action Buttons */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.5 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 w-full sm:w-auto"
      >
        <Button className="h-12 px-8 text-base w-full sm:w-auto shadow-xl shadow-primary/20">
          Start Automating
        </Button>
        
        <Button 
            variant="outline" 
            className={cn(
                "h-12 px-8 text-base gap-2 w-full sm:w-auto",
                !isDark && "border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400"
            )}
        >
          <Video size={20} /> Watch Demo
        </Button>
      </motion.div>

      {/* 5. Mini Features List */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.6 }}
        className="flex flex-wrap justify-center gap-4 md:gap-6 mt-10 px-4"
      >
        {features.map((item, index) => (
          <div key={index} className={cn(
              "flex items-center gap-2 text-sm font-medium",
              isDark ? "text-slate-400" : "text-slate-600"
          )}>
            <div className="size-5 rounded-full bg-primary/10 flex items-center justify-center">
                <Check size={12} className="text-primary" />
            </div>
            {item}
          </div>
        ))}
      </motion.div>

    </section>
  );
};

export default HeroSection;