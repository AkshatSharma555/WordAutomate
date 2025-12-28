import React from 'react';
import { cn } from '../../utils/cn';

const Button = ({ children, className, variant = 'primary', ...props }) => {
  
  // Styles define kar lete hain
  const variants = {
    primary: "bg-primary hover:bg-primary-hover text-white shadow-lg hover:shadow-pink-600/25 border-transparent",
    outline: "bg-transparent border border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-500",
    ghost: "bg-transparent hover:bg-slate-800/50 text-slate-400 hover:text-white border-transparent",
  };

  return (
    <button 
      className={cn(
        "inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all duration-300 active:scale-95 border",
        variants[variant], // Jo variant maanga hai, wo style lagao
        className // Agar extra classes pass ki hain (margin, width etc) toh wo bhi add karo
      )}
      {...props} // Baki props (onClick, type, disabled) pass kar do
    >
      {children}
    </button>
  );
};

export default Button;