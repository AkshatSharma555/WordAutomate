import React from 'react';
import { featuresData } from '../config/features';
import SectionTitle from '../components/common/SectionTitle';
import FeatureCard from '../components/ui/FeatureCard';
import { cn } from '../utils/cn';

const FeaturesSection = ({ isDark }) => {
  return (
    <section id="features" className="py-24 px-6 md:px-12 lg:px-20 relative overflow-hidden">
      
      {/* Background Decor (Only visible in Dark Mode for depth) */}
      {isDark && (
        <div className="absolute top-1/2 left-0 -translate-y-1/2 size-96 bg-primary/10 blur-[150px] -z-10" />
      )}

      {/* 1. Title (Dynamic Color) */}
      <SectionTitle 
        isDark={isDark}
        subtitle="Features"
        title="Everything you need"
        description="We handle the boring stuff so you can focus on your experiments. Here is how WordAutomate makes your life easier."
      />

      {/* 2. Grid Layout (Mobile Responsive) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {featuresData.map((feature, index) => (
          <FeatureCard 
            key={index}
            index={index}
            isDark={isDark}
            {...feature} 
          />
        ))}
      </div>

    </section>
  );
};

export default FeaturesSection;