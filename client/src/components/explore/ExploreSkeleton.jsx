import React from 'react';

const ExploreSkeleton = () => {
  return (
    <div className="bg-white dark:bg-[#111111] rounded-3xl p-5 border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-4 animate-pulse">
      {/* Avatar Skeleton */}
      <div className="size-20 rounded-full bg-slate-200 dark:bg-slate-800" />
      
      {/* Text Lines */}
      <div className="w-full space-y-2 flex flex-col items-center">
        <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-full" />
        <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-800 rounded-full" />
      </div>

      {/* Badges */}
      <div className="flex gap-2 mt-2">
        <div className="h-6 w-12 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-6 w-12 bg-slate-200 dark:bg-slate-800 rounded-lg" />
      </div>

      {/* Button Skeleton */}
      <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-xl mt-2" />
    </div>
  );
};

export default ExploreSkeleton;