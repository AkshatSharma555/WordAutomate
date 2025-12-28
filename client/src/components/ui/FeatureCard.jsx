import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const FeatureCard = ({ title, description, icon: Icon, index, isDark }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={cn(
          "group relative p-8 rounded-2xl transition-all duration-300 border",
          // Light Mode: White card with shadow
          // Dark Mode: Glassy dark card
          isDark 
            ? "bg-slate-900/40 border-white/10 hover:bg-slate-900/60" 
            : "bg-white border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-primary/5",
          "hover:-translate-y-1" // Thoda sa upar uthega hover pe
      )}
    >
      {/* Unique Hover Line (Orange) - Bottom mein aayegi */}
      <div className="absolute bottom-0 left-0 w-0 h-1 bg-secondary transition-all duration-300 group-hover:w-full rounded-b-2xl" />

      {/* Icon Container: Teal (Primary) */}
      <div className={cn(
          "size-14 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110",
          isDark ? "bg-primary/10 text-primary" : "bg-primary/10 text-primary"
      )}>
        <Icon size={28} />
      </div>

      {/* Title */}
      <h3 className={cn(
          "text-xl font-bold mb-3 transition-colors",
          isDark ? "text-white group-hover:text-primary" : "text-slate-900 group-hover:text-primary"
      )}>
        {title}
      </h3>

      {/* Description */}
      <p className={cn(
          "text-sm leading-relaxed",
          isDark ? "text-slate-400" : "text-slate-600"
      )}>
        {description}
      </p>
    </motion.div>
  );
};

export default FeatureCard;