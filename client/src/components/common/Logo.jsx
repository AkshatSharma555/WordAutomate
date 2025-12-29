import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

const Logo = ({ className }) => {
  return (
    <Link to="/" className={cn("flex items-center gap-2 group select-none", className)}>
      
      {/* Icon: Always Orange */}
      <div className="size-8 rounded-lg bg-[#F54A00] flex items-center justify-center text-white font-bold text-lg shadow-md shadow-[#F54A00]/20 transition-transform group-hover:scale-105">
        W
      </div>
      
      {/* Text: Automatically Switches Color */}
      {/* Light Mode: Slate-900 (Blackish) */}
      {/* Dark Mode: White */}
      <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors duration-300">
        WordAutomate
      </span>
      
    </Link>
  );
};

export default Logo;