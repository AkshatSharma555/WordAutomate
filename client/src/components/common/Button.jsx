import React from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  className, 
  variant = 'primary', 
  isLoading = false, // 👈 New Prop: Loading state control karne ke liye
  disabled,          // 👈 Standard disabled prop
  ...props 
}) => {
  
  const variants = {
    primary: "bg-primary hover:bg-primary-hover text-white shadow-lg hover:shadow-primary/25 border-transparent",
    outline: "bg-transparent border border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-500",
    ghost: "bg-transparent hover:bg-slate-800/50 text-slate-400 hover:text-white border-transparent"
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all duration-300 active:scale-95 border",
        variants[variant],
        // 👇 Agar loading ya disabled hai, toh opacity kam karo aur cursor change karo
        (isLoading || disabled) && "opacity-70 cursor-not-allowed active:scale-100",
        className
      )}
      // 👇 HTML disabled attribute set karo taaki click na ho sake
      disabled={isLoading || disabled}
      {...props}
    >
      {/* 👇 Loading Animation Logic */}
      {isLoading && (
        <Loader2 className="w-5 h-5 animate-spin" />
      )}
      
      {children}
    </button>
  );
};

export default Button;