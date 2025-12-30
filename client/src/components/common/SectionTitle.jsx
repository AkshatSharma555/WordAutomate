import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import ScrollFloat from '../ui/ScrollFloat';

const SectionTitle = ({ title, subtitle, description, className, align = 'center', isDark }) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 mb-16",
        align === 'center' ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {subtitle && (
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-primary font-bold tracking-wider uppercase text-sm bg-primary/10 px-3 py-1 rounded-full"
        >
          {subtitle}
        </motion.span>
      )}

      <div
        className={cn(
          "text-3xl md:text-5xl font-bold",
          isDark ? "text-white" : "text-slate-900"
        )}
      >
        <ScrollFloat
          animationDuration={1}
          ease="back.inOut(2)"
          scrollStart="top bottom-=10%"
          scrollEnd="bottom center"
          stagger={0.05}
        >
          {title}
        </ScrollFloat>
      </div>

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className={cn(
            "max-w-2xl text-lg leading-relaxed",
            isDark ? "text-slate-400" : "text-slate-600"
          )}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
};

export default SectionTitle;
