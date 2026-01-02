import React from 'react';
import { ArrowDownLeft, Send, BarChart3, HardDrive } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, subtext, colorClass, loading }) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex-1 animate-pulse">
         <div className="flex items-center gap-4">
            <div className="size-12 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            <div className="space-y-2">
               <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
               <div className="h-6 w-12 bg-slate-200 dark:bg-slate-800 rounded"></div>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow flex-1">
      <div className={`size-12 rounded-xl flex items-center justify-center ${colorClass}`}>
        <Icon size={22} strokeWidth={2.5} />
      </div>
      <div>
        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">{label}</p>
        <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-none">{value}</h3>
            {subtext && <span className="text-xs font-medium text-slate-400">{subtext}</span>}
        </div>
      </div>
    </div>
  );
};

const StatsBar = ({ stats, loading }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard 
        icon={ArrowDownLeft} 
        label="Inbox" 
        value={stats?.received || 0} 
        subtext="Files Received"
        colorClass="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
        loading={loading}
      />
      <StatCard 
        icon={Send} 
        label="Sent History" 
        value={stats?.sent || 0} 
        subtext="Shared Docs"
        colorClass="bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
        loading={loading}
      />
      <StatCard 
        icon={BarChart3} 
        label="Impact Score" 
        value={stats?.impactScore || 0} 
        subtext={`${stats?.impactRate || 0}% Read Rate`}
        colorClass="bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
        loading={loading}
      />
      <StatCard 
        icon={HardDrive} 
        label="Total Generated" 
        value={stats?.generated || 0} 
        subtext="Originals"
        colorClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
        loading={loading}
      />
    </div>
  );
};

export default StatsBar;