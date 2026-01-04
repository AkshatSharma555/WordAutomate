import React from 'react';
import { testimonialsData } from '../config/testimonials';
import SectionTitle from '../components/common/SectionTitle';
import { Quote, User } from 'lucide-react'; // Added User Icon
import { cn } from '../utils/cn';

// Data duplication for infinite scroll effect
const scrollingTestimonials = [...testimonialsData, ...testimonialsData, ...testimonialsData];

const Testimonials = ({ isDark }) => {
  
  // Card Component
  const TestimonialCard = ({ data }) => (
    <div className={cn(
        "relative w-80 md:w-96 flex-shrink-0 p-6 rounded-2xl border transition-all duration-300 mx-4 select-none group/card",
        isDark 
            ? "bg-slate-900/40 border-white/10 hover:border-[#F54A00]/50 backdrop-blur-md" 
            : "bg-white border-slate-200 shadow-lg shadow-slate-200/50 hover:border-[#F54A00]/50"
    )}>
        {/* Top Section: Profile & Icon */}
        <div className="flex items-center gap-4 mb-4">
            
            {/* 👇 ORANGE USER ICON (Replaced Image) */}
            <div className={cn(
                "size-12 rounded-full flex items-center justify-center border-2 transition-colors",
                isDark 
                    ? "bg-slate-800 border-white/5 text-[#F54A00]" 
                    : "bg-[#F54A00]/10 border-slate-100 text-[#F54A00]"
            )}>
                <User size={24} />
            </div>

            <div>
                <h4 className={cn("font-bold text-lg", isDark ? "text-white" : "text-slate-900")}>
                    {data.name}
                </h4>
                <p className={cn("text-xs font-semibold uppercase tracking-wide", isDark ? "text-slate-400" : "text-slate-500")}>
                    {data.role}
                </p>
            </div>
        </div>

        {/* Content */}
        <p className={cn(
            "text-sm leading-relaxed italic relative z-10",
            isDark ? "text-slate-300" : "text-slate-600"
        )}>
            "{data.content}"
        </p>

        {/* Decor: Quote Icon */}
        <Quote className={cn(
            "absolute top-6 right-6 size-8 transition-colors",
            isDark ? "text-white/10 group-hover/card:text-[#F54A00]/20" : "text-slate-200 group-hover/card:text-[#F54A00]/20"
        )} />
    </div>
  );

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      
      {/* CSS Animation Styles */}
      <style>{`
        @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        .animate-marquee {
            animation: marquee 50s linear infinite;
        }
        .animate-marquee-reverse {
            animation: marquee 50s linear infinite reverse;
        }
        /* Hover pe rukne ka feature */
        .group:hover .animate-marquee,
        .group:hover .animate-marquee-reverse {
            animation-play-state: paused;
        }
      `}</style>

      <div className="container mx-auto px-6 mb-12 max-w-4xl text-center">
        <SectionTitle 
            isDark={isDark}
            subtitle="Feedback"
            title="Loved by Students"
            description="See what your batchmates from TE-IT are saying about the automation."
        />
      </div>

      {/* --- MARQUEE CONTAINER --- */}
      <div className="relative w-full [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        
        {/* Row 1: Left to Right */}
        <div className="group flex overflow-hidden py-4">
            <div className="animate-marquee flex gap-0 min-w-full">
                {scrollingTestimonials.map((item, index) => (
                    <TestimonialCard key={`row1-${index}`} data={item} />
                ))}
            </div>
        </div>

        {/* Row 2: Right to Left (Reverse) */}
        <div className="group flex overflow-hidden py-4 mt-2">
             <div className="animate-marquee-reverse flex gap-0 min-w-full">
                {scrollingTestimonials.map((item, index) => (
                    <TestimonialCard key={`row2-${index}`} data={item} />
                ))}
            </div>
        </div>

      </div>

    </section>
  );
};

export default Testimonials;