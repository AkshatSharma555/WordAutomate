import React from 'react';
import { howItWorksData } from '../config/howItWorks';
import SectionTitle from '../components/common/SectionTitle';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '../utils/cn'; // CN utility import

const HowItWorks = ({ isDark }) => {
  return (
    <section id="how-it-works" className="py-24 px-6 relative overflow-hidden">
        {/* Background Glow - Only in Dark Mode */}
        {isDark && (
             <div className="absolute top-1/2 right-0 -translate-y-1/2 size-96 bg-primary/10 blur-[150px] -z-10" />
        )}

        <SectionTitle 
            isDark={isDark}
            subtitle="Process"
            title="How it Works"
            description="Just 3 simple steps to automate your documentation workflow."
        />

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-16 max-w-6xl mx-auto">
            {howItWorksData.map((step, index) => {
                const Icon = step.icon;
                return (
                    <React.Fragment key={index}>
                        {/* Step Card */}
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className={cn(
                                "relative flex-1 flex flex-col items-center text-center p-8 rounded-2xl border transition-all duration-300 group",
                                // Conditional Styling
                                isDark 
                                    ? "bg-slate-900/50 border-white/10 hover:bg-slate-900 hover:border-primary/50" 
                                    : "bg-white border-slate-200 shadow-xl shadow-slate-200/50 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5"
                            )}
                        >
                            {/* Icon Container: Teal (Primary) */}
                            <div className={cn(
                                "size-16 rounded-full flex items-center justify-center mb-6 transition-transform group-hover:scale-110",
                                isDark ? "bg-slate-800 text-primary" : "bg-primary/10 text-primary"
                            )}>
                                <Icon size={32} />
                            </div>

                            {/* Title */}
                            <h3 className={cn(
                                "text-xl font-bold mb-2 transition-colors",
                                isDark ? "text-white" : "text-slate-900"
                            )}>
                                {step.title}
                            </h3>

                            {/* Description */}
                            <p className={cn(
                                "text-sm leading-relaxed transition-colors",
                                isDark ? "text-slate-400" : "text-slate-600"
                            )}>
                                {step.description}
                            </p>
                            
                            {/* Number Badge - Fixed Shadow Color & Theme */}
                            <div className={cn(
                                "absolute -top-4 -left-4 size-10 rounded-full flex items-center justify-center font-bold shadow-lg transition-transform group-hover:scale-110",
                                // Teal Background with matching shadow
                                "bg-primary text-white shadow-primary/30"
                            )}>
                                {index + 1}
                            </div>
                        </motion.div>

                        {/* Arrow (Desktop Only) - Theme Aware Colors */}
                        {index !== howItWorksData.length - 1 && (
                            <div className={cn(
                                "hidden md:block transition-colors",
                                isDark ? "text-slate-700" : "text-slate-300"
                            )}>
                                <ArrowRight size={32} />
                            </div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    </section>
  );
};

export default HowItWorks;