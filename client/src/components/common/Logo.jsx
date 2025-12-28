import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

const Logo = ({ className, isDark = true }) => {
  return (
    <Link to="/" className={cn("flex items-center gap-2 group", className)}>
      
      {/* Icon: Solid Orange */}
      <div className="size-8 rounded-lg bg-secondary flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-secondary/20">
        W
      </div>
      
      {/* Text: Light Mode me Slate-900, Dark Mode me White */}
      <span className={cn(
          "text-xl font-semibold transition-colors duration-300",
          isDark ? "text-white" : "text-slate-900"
      )}>
        WordAutomate
      </span>
    </Link>
  );
};

export default Logo;