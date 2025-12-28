import React from 'react';
import { testimonialsData } from '../config/testimonials';
import SectionTitle from '../components/common/SectionTitle';
import { Quote } from 'lucide-react';
import { cn } from '../utils/cn';

// Data ko duplicate kar rahe hain taaki continuous scroll feel aaye (kam data hone par bhi)
const scrollingTestimonials = [...testimonialsData, ...testimonialsData, ...testimonialsData, ...testimonialsData];

const Testimonials = ({ isDark }) => {
  
  // Card Component (Internal)
  const TestimonialCard = ({ data }) => (
    <div className={cn(
        "relative w-80 md:w-96 flex-shrink-0 p-6 rounded-2xl border transition-all duration-300 mx-4 select-none",
        // Light Mode: White card, shadow
        // Dark Mode: Glassy dark card
        isDark 
            ? "bg-slate-900/40 border-white/10 hover:border-secondary/50 backdrop-blur-md" 
            : "bg-white border-slate-200 shadow-lg shadow-slate-200/50 hover:border-secondary/50"
    )}>
        {/* Top Section: Profile */}
        <div className="flex items-center gap-4 mb-4">
            <img 
                src={data.image} 
                alt={data.name} 
                className={cn(
                    "size-12 rounded-full object-cover border-2",
                    isDark ? "border-white/10" : "border-slate-100"
                )}
            />
            <div>
                <h4 className={cn("font-bold text-lg", isDark ? "text-white" : "text-slate-900")}>
                    {data.name}
                </h4>
                <p className="text-primary text-xs font-semibold uppercase tracking-wide">
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

        {/* Decor: Quote Icon (Absolute Positioned for style) */}
        <Quote className="absolute top-6 right-6 text-secondary/20 size-8" />
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
            animation: marquee 40s linear infinite;
        }
        .animate-marquee-reverse {
            animation: marquee 40s linear infinite reverse;
        }
        /* Hover pe rukne ka feature */
        .group:hover .animate-marquee,
        .group:hover .animate-marquee-reverse {
            animation-play-state: paused;
        }
      `}</style>

      <div className="container mx-auto px-6 mb-12">
        <SectionTitle 
            isDark={isDark}
            subtitle="Testimonials"
            title="Loved by Students"
            description="Don't just take our word for it. See what others are saying about LabAutomate."
        />
      </div>

      {/* --- MARQUEE CONTAINER --- */}
      {/* Mask Image: Sides ko fade karne ke liye (Works on ANY background) */}
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