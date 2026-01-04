import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Video, Check } from 'lucide-react';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { cn } from '../utils/cn';

const HeroSection = ({ isDark }) => {
  const features = ["100% Free for Students", "Secure College Login", "Instant PDF"];

  // Sabse simple aur clean animation config
  const animationProps = {
    initial: { opacity: 0, y: 15 }, // Movement kam kiya (20 -> 15) taaki pixel jump na lage
    animate: { opacity: 1, y: 0 },
    transition: { 
      duration: 0.6,    // Duration thodi kam ki for snappiness
      ease: "easeOut"   // No bounce, just smooth slide (Apple style)
    }
  };

  return (
    <section className="relative flex flex-col items-center justify-center pt-32 pb-20 px-4 md:px-6 overflow-hidden min-h-[90vh] w-full">
      
      {/* Background Glow - Static Layer (No Animation on BG to save GPU) */}
      {isDark && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 size-[300px] md:size-[600px] bg-primary/20 blur-[80px] md:blur-[100px] rounded-full -z-10 pointer-events-none opacity-50" />
      )}

      {/* 1. Badge */}
      <motion.div 
        {...animationProps} 
        transition={{ ...animationProps.transition, delay: 0.1 }}
        className="relative z-10"
      >
        <Badge className={cn(
            "mb-6 md:mb-8 flex items-center gap-2 cursor-pointer transition-all border",
            "bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20 hover:scale-105"
        )}>
          NEW
          <span className={cn(
              "flex items-center gap-1 font-medium",
              isDark ? "text-white/90" : "text-slate-700"
          )}>
            v2.0 is live now <ChevronRight size={14} />
          </span>
        </Badge>
      </motion.div>

      {/* 2. Main Heading (Simple Fade Up - No SplitText) */}
      <div className="text-center max-w-5xl mx-auto mb-6 relative z-10">
        <motion.h1 
          {...animationProps}
          transition={{ ...animationProps.transition, delay: 0.2 }}
          className={cn(
              "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] md:leading-tight tracking-tight",
              isDark ? "text-white" : "text-slate-900"
          )}
        >
          Automate your lab
        </motion.h1>

        <motion.div 
          {...animationProps}
          transition={{ ...animationProps.transition, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] md:leading-tight tracking-tight mt-1 md:mt-2"
        >
            <span className="text-primary">documentation</span>
            <span className="text-secondary">work.</span>
        </motion.div>
      </div>

      {/* 3. Subtitle */}
      <motion.p 
        {...animationProps}
        transition={{ ...animationProps.transition, delay: 0.4 }}
        className={cn(
            "text-base sm:text-lg md:text-xl text-center max-w-xl md:max-w-3xl mt-4 px-4 leading-relaxed relative z-10",
            isDark ? "text-slate-400" : "text-slate-600"
        )}
      >
        Stop manually editing Word files. Upload your template, auto-fill details, and download formatted PDFs instantly.
      </motion.p>

      {/* 4. Action Buttons */}
      <motion.div 
        {...animationProps}
        transition={{ ...animationProps.transition, delay: 0.5 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 w-full sm:w-auto relative z-10"
      >
        <Link to="/login" className="w-full sm:w-auto">
            <Button className="h-12 px-8 text-base w-full shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">
              Start Automating
            </Button>
        </Link>
        
        <Button 
            variant="outline" 
            className={cn(
                "h-12 px-8 text-base gap-2 w-full sm:w-auto backdrop-blur-sm",
                !isDark && "border-slate-300 text-slate-700 hover:bg-slate-100/50"
            )}
        >
          <Video size={20} /> Watch Demo
        </Button>
      </motion.div>

      {/* 5. Features List */}
      <motion.div 
        {...animationProps}
        transition={{ ...animationProps.transition, delay: 0.6 }}
        className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-12 px-4 relative z-10"
      >
        {features.map((item, index) => (
          <div key={index} className={cn(
              "flex items-center gap-2 text-sm font-semibold tracking-wide",
              isDark ? "text-slate-400" : "text-slate-600"
          )}>
            <div className="size-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Check size={12} strokeWidth={3} className="text-primary" />
            </div>
            {item}
          </div>
        ))}
      </motion.div>

    </section>
  );
};

export default HeroSection;