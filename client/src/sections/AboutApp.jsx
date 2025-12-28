import React from 'react';
import { motion } from 'framer-motion';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { cn } from '../utils/cn';

const AboutApp = ({ isDark }) => {
  return (
    <section id="about" className="py-24 px-6 relative overflow-hidden">
        
        {/* Background Grid Pattern (Theme Aware) */}
        <div className={cn(
            "absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)] -z-10",
            !isDark && "opacity-30 invert" // Light mode mein grid invert ho jayega taaki dikhe
        )} />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
            
            {/* Left: Text Content */}
            <div className="lg:w-1/2 space-y-8">
                <Badge className={cn(
                    "bg-primary/10 text-primary border-primary/20",
                    !isDark && "bg-primary/5 border-primary/10"
                )}>
                    ABOUT THE PLATFORM
                </Badge>
                
                <motion.h2 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className={cn(
                        "text-4xl md:text-5xl font-bold leading-tight",
                        isDark ? "text-white" : "text-slate-900"
                    )}
                >
                    Built specifically for <br />
                    <span className="text-primary relative inline-block">
                        SIES GST Students.
                        {/* Underline Decoration */}
                        <svg className="absolute w-full h-3 -bottom-1 left-0 text-secondary" viewBox="0 0 100 10" preserveAspectRatio="none">
                            <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                        </svg>
                    </span>
                </motion.h2>

                <p className={cn(
                    "text-lg leading-relaxed",
                    isDark ? "text-slate-400" : "text-slate-600"
                )}>
                    LabAutomate is an intelligent document processing tool designed to eliminate the repetitive task of manually formatting Word documents for lab submissions, certificates, and reports.
                </p>

                <ul className={cn("space-y-4", isDark ? "text-slate-300" : "text-slate-700")}>
                    {[
                        "Save 90% of your time on documentation.",
                        "Error-free PDF generation.",
                        "Secure and private data handling."
                    ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3">
                            <span className="size-2 rounded-full bg-secondary shadow-[0_0_10px_#F54A00]" /> 
                            {item}
                        </li>
                    ))}
                </ul>

                <Button className="shadow-lg shadow-primary/20">Read More</Button>
            </div>

            {/* Right: Interactive Visual (3D Floating Card) */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="lg:w-1/2 relative flex justify-center"
            >
                {/* Back Glow */}
                <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full -z-10 animate-pulse" />

                {/* Main Card */}
                <motion.div 
                    whileHover={{ y: -10, rotateX: 5, rotateY: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={cn(
                        "relative w-80 md:w-96 aspect-[4/5] rounded-3xl border p-8 flex flex-col justify-between overflow-hidden shadow-2xl",
                        isDark 
                            ? "bg-slate-900/80 border-white/10 backdrop-blur-xl" 
                            : "bg-white border-slate-200 shadow-slate-200/50"
                    )}
                >
                    {/* Top Section */}
                    <div className="space-y-2">
                        <div className="size-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg">
                            W
                        </div>
                        <h3 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                            Student Success
                        </h3>
                        <p className={isDark ? "text-slate-400" : "text-slate-500"}>
                            Empowering students to focus on learning, not formatting.
                        </p>
                    </div>

                    {/* Stats Counter (Dynamic) */}
                    <div className="grid grid-cols-2 gap-4 mt-8">
                        <div className={cn("p-4 rounded-2xl", isDark ? "bg-white/5" : "bg-slate-50")}>
                            <h4 className="text-3xl font-bold text-primary">500+</h4>
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Users</p>
                        </div>
                        <div className={cn("p-4 rounded-2xl", isDark ? "bg-white/5" : "bg-slate-50")}>
                            <h4 className="text-3xl font-bold text-secondary">20k+</h4>
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">PDFs</p>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 size-32 bg-secondary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 size-24 bg-primary/10 rounded-full blur-xl translate-y-1/2 -translate-x-1/2" />
                </motion.div>

                {/* Floating Elements (Badges) */}
                <motion.div 
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className={cn(
                        "absolute -right-4 top-20 px-4 py-2 rounded-lg text-sm font-bold shadow-xl border backdrop-blur-md",
                        isDark ? "bg-slate-800 border-white/10 text-white" : "bg-white border-slate-100 text-slate-800"
                    )}
                >
                    🚀 Fast Process
                </motion.div>

                <motion.div 
                    animate={{ y: [0, 15, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className={cn(
                        "absolute -left-8 bottom-32 px-4 py-2 rounded-lg text-sm font-bold shadow-xl border backdrop-blur-md",
                        isDark ? "bg-slate-800 border-white/10 text-white" : "bg-white border-slate-100 text-slate-800"
                    )}
                >
                    🔒 Secure
                </motion.div>

            </motion.div>

        </div>
    </section>
  );
};

export default AboutApp;