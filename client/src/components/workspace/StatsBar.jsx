import React from 'react';
import { FileDown, FileUp, HardDrive } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center gap-4 shadow-sm flex-1">
    <div className={`size-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{label}</p>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{value}</h3>
    </div>
  </div>
);

const StatsBar = ({ stats }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <StatCard 
        icon={FileDown} 
        label="Received" 
        value={stats.received} 
        color="bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
      />
      <StatCard 
        icon={FileUp} 
        label="Generated" 
        value={stats.generated} 
        color="bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
      />
      <StatCard 
        icon={HardDrive} 
        label="Storage Used" 
        value={stats.storage} 
        color="bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
      />
    </div>
  );
};

export default StatsBar;