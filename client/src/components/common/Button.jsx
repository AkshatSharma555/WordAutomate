import React from 'react';
import { cn } from '../../utils/cn';

const Button = ({ children, className, variant = 'primary', ...props }) => {
  const variants = {
    primary: "bg-primary hover:bg-primary-hover text-white shadow-lg hover:shadow-pink-600/25 border-transparent",
    outline: "bg-transparent border border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-500",
    ghost: "bg-transparent hover:bg-slate-800/50 text-slate-400 hover:text-white border-transparent"
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all duration-300 active:scale-95 border",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
