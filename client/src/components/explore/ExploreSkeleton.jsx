import React from 'react';

const ExploreSkeleton = () => {
  return (
    // Changed bg to be semi-transparent to match the glass theme
    <div className="relative flex flex-col items-center p-6 rounded-[32px] bg-white/60 dark:bg-[#151515]/60 backdrop-blur-md border border-slate-200/60 dark:border-white/5 shadow-sm overflow-hidden">
      
      {/* Pulse Animation Wrapper */}
      <div className="animate-pulse w-full flex flex-col items-center gap-5">

        {/* Avatar Placeholder */}
        <div className="size-24 rounded-full bg-slate-200/50 dark:bg-white/5" />

        {/* Text Lines */}
        <div className="w-full space-y-3 flex flex-col items-center">
          {/* Name */}
          <div className="h-5 w-2/3 bg-slate-200/50 dark:bg-white/10 rounded-full" />
          {/* Role/Branch */}
          <div className="h-3 w-1/3 bg-slate-100/50 dark:bg-white/5 rounded-full" />
        </div>

        {/* Badges / Stats */}
        <div className="flex gap-2 w-full justify-center mt-1">
           <div className="h-8 w-16 bg-slate-100/50 dark:bg-white/5 rounded-xl" />
           <div className="h-8 w-16 bg-slate-100/50 dark:bg-white/5 rounded-xl" />
        </div>

        {/* Button Placeholder */}
        <div className="h-12 w-full bg-slate-200/50 dark:bg-white/10 rounded-2xl mt-2" />
      </div>
    </div>
  );
};

export default ExploreSkeleton;