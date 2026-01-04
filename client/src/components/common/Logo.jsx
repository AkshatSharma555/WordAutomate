import React from 'react';
// Agar 3D logo import karna ho toh yahan kar sakte ho, 
// par abhi ke liye simple rakhte hain taaki error jaye.

const Logo = ({ isDark }) => {
  return (
    <div className="flex items-center gap-3 select-none">
      {/* Simple Static Logo Icon */}
      <div className="relative size-10 flex items-center justify-center bg-gradient-to-br from-[#FF6B00] to-[#F54A00] rounded-xl shadow-lg transform rotate-3">
        <span className="text-white font-bold text-xl">W</span>
      </div>
      
      <span className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
        Word<span className={isDark ? "text-[#F54A00]" : "text-[#1AA3A3]"}>Automate</span>
      </span>
    </div>
  );
};

export default Logo;