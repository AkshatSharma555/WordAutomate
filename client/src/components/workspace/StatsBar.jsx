import React from 'react';
import { ArrowDownLeft, Send, BarChart3, HardDrive, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, subtext, colorTheme, loading }) => {
  
  // Theme Maps (Optimized for Compact Look)
  const themes = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border-blue-100 dark:border-blue-500/20",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 border-purple-100 dark:border-purple-500/20",
    orange: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 border-orange-100 dark:border-orange-500/20",
    teal: "bg-teal-50 text-[#1AA3A3] dark:bg-[#1AA3A3]/10 dark:text-[#1AA3A3] border-teal-100 dark:border-[#1AA3A3]/20",
  };

  const currentTheme = themes[colorTheme] || themes.blue;

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#151515] border border-slate-200 dark:border-white/5 p-3.5 rounded-2xl shadow-sm flex-1 animate-pulse h-[84px] flex items-center">
         <div className="flex items-center gap-3.5 w-full">
            <div className="size-10 bg-slate-100 dark:bg-white/5 rounded-xl shrink-0"></div>
            <div className="space-y-2 flex-1">
               <div className="h-2.5 w-1/2 bg-slate-100 dark:bg-white/5 rounded-full"></div>
               <div className="h-5 w-10 bg-slate-200 dark:bg-white/10 rounded-full"></div>
            </div>
         </div>
      </div>
    );
  }

  return (
    <motion.div 
      whileHover={{ y: -2, boxShadow: "0 8px 20px -8px rgba(0,0,0,0.1)" }}
      className="bg-white dark:bg-[#151515] border border-slate-200/60 dark:border-white/5 p-3.5 rounded-2xl flex items-center gap-3.5 shadow-sm transition-all duration-300 flex-1 relative overflow-hidden group min-h-[84px]"
    >
      {/* Background Gradient on Hover */}
      <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-transparent to-current opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-bl-[60px] pointer-events-none ${currentTheme.split(' ')[1]}`}></div>

      {/* Icon Box (Compact) */}
      <div className={`size-11 rounded-xl flex items-center justify-center border shadow-sm shrink-0 transition-transform group-hover:scale-105 ${currentTheme}`}>
        <Icon size={20} strokeWidth={2.5} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5 truncate">
            {label}
        </p>
        <div className="flex items-end justify-between gap-2">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-none tracking-tight">
                {value}
            </h3>
            {subtext && (
                <div className="flex items-center gap-1 mb-0.5">
                    {colorTheme === 'orange' && <TrendingUp size={10} className="text-orange-500" />}
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-1.5 py-0.5 rounded-[5px] truncate max-w-[80px]">
                        {subtext}
                    </span>
                </div>
            )}
        </div>
      </div>
    </motion.div>
  );
};

const StatsBar = ({ stats, loading }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard 
        icon={ArrowDownLeft} 
        label="Received" 
        value={stats?.received || 0} 
        subtext="Inbox"
        colorTheme="blue"
        loading={loading}
      />
      <StatCard 
        icon={Send} 
        label="Shared" 
        value={stats?.sent || 0} 
        subtext="Sent"
        colorTheme="purple"
        loading={loading}
      />
      <StatCard 
        icon={BarChart3} 
        label="Impact Score" 
        value={stats?.impactScore || 0} 
        subtext={`${stats?.impactRate || 0}% Read`}
        colorTheme="orange"
        loading={loading}
      />
      <StatCard 
        icon={HardDrive} 
        label="Generated" 
        value={stats?.generated || 0} 
        subtext="Originals"
        colorTheme="teal"
        loading={loading}
      />
    </div>
  );
};

export default StatsBar;