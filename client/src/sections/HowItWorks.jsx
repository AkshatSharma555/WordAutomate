import React from 'react';
import { howItWorksData } from '../config/howItWorks';
import SectionTitle from '../components/common/SectionTitle';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '../utils/cn';

const HowItWorks = ({ isDark }) => {
  return (
    <section id="how-it-works" className="py-24 px-4 md:px-8 lg:px-12 relative overflow-hidden">
        {/* Background Glow */}
        {isDark && (
             <div className="absolute top-1/2 right-0 -translate-y-1/2 size-96 bg-primary/10 blur-[150px] -z-10 pointer-events-none" />
        )}

        <div className="max-w-4xl mx-auto text-center mb-16">
            <SectionTitle 
                isDark={isDark}
                subtitle="Workflow"
                title="How it Works"
                description="From finding friends to generating documents, everything is connected."
            />
        </div>

        {/* 4-Step Layout (Compact Grid) */}
        <div className="flex flex-col md:flex-row items-stretch justify-center gap-4 lg:gap-6 max-w-7xl mx-auto">
            {howItWorksData.map((step, index) => {
                const Icon = step.icon;
                return (
                    <React.Fragment key={index}>
                        {/* Step Card */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                                "relative flex-1 flex flex-col items-center text-center p-6 rounded-xl border transition-all duration-300 group",
                                // Dark/Light Mode Styling
                                isDark 
                                    ? "bg-slate-900/40 border-white/5 hover:bg-slate-900 hover:border-primary/40" 
                                    : "bg-white border-slate-200 shadow-lg shadow-slate-200/40 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
                            )}
                        >
                            {/* Icon Container (Compact) */}
                            <div className={cn(
                                "size-12 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
                                isDark ? "bg-slate-800 text-primary" : "bg-primary/10 text-primary"
                            )}>
                                <Icon size={24} />
                            </div>

                            {/* Title */}
                            <h3 className={cn(
                                "text-lg font-bold mb-2 transition-colors",
                                isDark ? "text-white" : "text-slate-900"
                            )}>
                                {step.title}
                            </h3>

                            {/* Description (Shortened) */}
                            <p className={cn(
                                "text-sm leading-snug transition-colors",
                                isDark ? "text-slate-400" : "text-slate-600"
                            )}>
                                {step.description}
                            </p>
                            
                            {/* Number Badge (Small & Tucked) */}
                            <div className={cn(
                                "absolute -top-3 -left-3 size-8 rounded-full flex items-center justify-center text-sm font-bold shadow-md transition-transform group-hover:scale-110",
                                "bg-primary text-white shadow-primary/30"
                            )}>
                                {index + 1}
                            </div>
                        </motion.div>

                        {/* Arrow (Hidden on Mobile, Visible on Desktop) */}
                        {index !== howItWorksData.length - 1 && (
                            <div className={cn(
                                "hidden md:flex items-center justify-center transition-colors opacity-30",
                                isDark ? "text-slate-600" : "text-slate-400"
                            )}>
                                <ArrowRight size={20} />
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