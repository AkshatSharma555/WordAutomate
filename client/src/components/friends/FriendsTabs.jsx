import React from 'react';
import { motion } from 'framer-motion';

const FriendsTabs = ({ activeTab, setActiveTab, counts }) => {
  const tabs = [
    { id: 'connections', label: 'My Network', count: counts.connections },
    { id: 'requests', label: 'Incoming Requests', count: counts.requests }, // Swapped order logic
  ];

  return (
    <div className="w-full md:w-auto min-w-[300px] bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-xl backdrop-blur-sm border border-slate-200 dark:border-slate-700/50">
      <div className="flex relative">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex-1 px-6 py-2.5 text-sm font-bold transition-all z-10 flex items-center justify-center gap-2.5 ${
              activeTab === tab.id 
                ? 'text-slate-900 dark:text-white' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            {/* Sliding Background */}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTabBg"
                className="absolute inset-0 bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm border border-black/5 dark:border-white/5"
                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
              />
            )}
            
            <span className="relative z-10">{tab.label}</span>
            
            {/* Count Badge (Hidden for 0) */}
            {tab.count > 0 && (
              <span className={`relative z-10 text-[10px] px-2 py-0.5 rounded-full font-extrabold transition-colors ${
                activeTab === tab.id 
                  ? 'bg-[#1AA3A3] text-white' 
                  : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FriendsTabs;