import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Badge from '../components/common/Badge';
import ThreeDLogo from '../components/common/ThreeDLogo'; 
import { cn } from '../utils/cn';

const AboutApp = ({ isDark }) => {
  const [isCardHovered, setIsCardHovered] = useState(false);

  return (
    <section id="about" className="py-24 px-6 relative overflow-hidden w-full">
        
        {/* Background Grid Pattern */}
        <div className={cn(
            "absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)] -z-10",
            !isDark && "opacity-30 invert"
        )} />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
            
            {/* Left: Story Content (Same) */}
            <div className="lg:w-1/2 space-y-8">
                <Badge className={cn(
                    "bg-primary/10 text-primary border-primary/20",
                    !isDark && "bg-primary/5 border-primary/10"
                )}>
                    THE ORIGIN STORY
                </Badge>
                
                <motion.h2 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className={cn(
                        "text-3xl md:text-5xl font-bold leading-tight",
                        isDark ? "text-white" : "text-slate-900"
                    )}
                >
                    Born from the chaos of <br />
                    <span className="text-primary relative inline-block">
                        Lab Submissions.
                        <svg className="absolute w-full h-3 -bottom-1 left-0 text-secondary" viewBox="0 0 100 10" preserveAspectRatio="none">
                            <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                        </svg>
                    </span>
                </motion.h2>

                <div className={cn("space-y-4 text-base md:text-lg leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>
                    <p>
                        We've all been there—rushing to finish DBMS or IP experiments in 2 hours, only to spend another hour formatting Word docs. Name on top, specific fonts, correct headers... it's tedious and boring.
                    </p>
                    <p>
                        Most of us just take a friend's file and edit the name/PRN. But even that gets monotonous. I realized we needed a way to automate this repetitive cycle.
                    </p>
                    <p className="font-medium italic border-l-4 border-secondary pl-4 py-1 bg-secondary/5 rounded-r-lg">
                        "I wanted a system where one person uploads the doc, and everyone gets their personalized copy instantly."
                    </p>
                </div>

                <div className="flex items-center gap-4 pt-4">
                    <div className="size-12 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden border-2 border-primary flex items-center justify-center">
                        <span className="text-lg font-bold text-primary">AS</span>
                    </div>
                    <div>
                        <h4 className={cn("font-bold text-lg", isDark ? "text-white" : "text-slate-900")}>Akshat Sharma</h4>
                        <p className="text-sm text-primary font-medium">Student, IT Dept (SIES GST)</p>
                    </div>
                </div>
            </div>

            {/* Right: Visual Card */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="lg:w-1/2 relative flex justify-center"
            >
                <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full -z-10 animate-pulse" />

                <motion.div 
                    whileHover={{ y: -5 }}
                    onHoverStart={() => setIsCardHovered(true)} 
                    onHoverEnd={() => setIsCardHovered(false)}
                    className={cn(
                        "relative w-full max-w-md aspect-[4/5] md:aspect-square rounded-3xl border p-8 flex flex-col justify-between overflow-hidden shadow-2xl transition-colors duration-300",
                        isDark 
                            ? "bg-slate-900/80 border-white/10 backdrop-blur-xl" 
                            : "bg-white border-slate-200 shadow-slate-200/50"
                    )}
                >
                    {/* Header */}
                    <div>
                        <div className="flex justify-between items-start mb-4">
                             {/* 👇 3D Logo Container: Relative to parent, NO fixed positioning */}
                             <div className="h-20 w-20 relative -ml-2 -mt-2">
                                <ThreeDLogo className="h-full w-full" isHovered={isCardHovered} />
                             </div>

                             <div className={cn("px-3 py-1 rounded-full text-xs font-bold border mt-2", isDark ? "bg-white/10 border-white/20 text-white" : "bg-slate-100 border-slate-200 text-slate-800")}>
                                Problem Solver
                            </div>
                        </div>
                        
                        <h3 className={cn("text-2xl font-bold mb-2", isDark ? "text-white" : "text-slate-900")}>
                            The Solution?
                        </h3>
                        <p className={isDark ? "text-slate-400" : "text-slate-500"}>
                            We use smart placeholders like <code className="bg-primary/20 text-primary px-1 rounded font-mono font-bold">{"{name}"}</code> & <code className="bg-secondary/20 text-secondary px-1 rounded font-mono font-bold">{"{prn}"}</code> to detect and replace data instantly.
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="space-y-4 mt-6">
                        <div className={cn("p-4 rounded-2xl flex items-center justify-between", isDark ? "bg-white/5" : "bg-slate-50")}>
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-bold">Manual Way</p>
                                <p className={cn("font-semibold text-sm", isDark ? "text-slate-300" : "text-slate-700")}>Download &gt; Edit &gt; PDF</p>
                            </div>
                            <span className="text-red-500 font-bold">~15 Mins</span>
                        </div>

                        <div className={cn("p-4 rounded-2xl flex items-center justify-between border border-primary/30 relative overflow-hidden", isDark ? "bg-primary/10" : "bg-primary/5")}>
                            <div className="relative z-10">
                                <p className="text-xs text-primary uppercase font-bold">WordAutomate Way</p>
                                <p className={cn("font-bold", isDark ? "text-white" : "text-slate-900")}>One Click Generation</p>
                            </div>
                            <span className="text-green-500 font-bold text-xl relative z-10">~15 Secs</span>
                            
                            <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-[shine_2s_infinite]" />
                        </div>
                    </div>

                    <p className="text-xs text-center text-slate-500 mt-6 font-medium">
                        Designed for SIES GST Lab Experiments.
                    </p>
                </motion.div>

                {/* Floating Badges */}
                <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className={cn(
                        "absolute -right-4 top-20 px-4 py-2 rounded-lg text-sm font-bold shadow-xl border backdrop-blur-md",
                        isDark ? "bg-slate-800 border-white/10 text-white" : "bg-white border-slate-100 text-slate-800"
                    )}
                >
                    🚀 Batch Processing
                </motion.div>

                <motion.div 
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className={cn(
                        "absolute -left-6 bottom-32 px-4 py-2 rounded-lg text-sm font-bold shadow-xl border backdrop-blur-md",
                        isDark ? "bg-slate-800 border-white/10 text-white" : "bg-white border-slate-100 text-slate-800"
                    )}
                >
                    ⚡ Zero Formatting
                </motion.div>

            </motion.div>

        </div>
    </section>
  );
};

export default AboutApp;