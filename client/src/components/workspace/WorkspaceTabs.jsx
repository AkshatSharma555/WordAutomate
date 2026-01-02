import React from 'react';
import { motion } from 'framer-motion';
import { Inbox, Send } from 'lucide-react';

const WorkspaceTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { 
      id: 'received', 
      label: 'Inbox', 
      icon: Inbox,
      subLabel: 'Received'
    },
    { 
      id: 'sent', // Changed 'history' to 'sent' to match backend type logic
      label: 'Outbox', 
      icon: Send,
      subLabel: 'History'
    },
  ];

  return (
    <div className="w-full md:w-auto p-1.5 bg-slate-100/80 dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-xl flex relative">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold rounded-lg transition-all z-10 select-none ${
              isActive 
                ? 'text-slate-900 dark:text-white' 
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300'
            }`}
          >
            {/* Active Background Animation */}
            {isActive && (
              <motion.div
                layoutId="workspaceTab"
                className="absolute inset-0 bg-white dark:bg-[#1f1f1f] rounded-lg shadow-sm border border-slate-200/50 dark:border-slate-700 -z-10"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            
            {/* Content */}
            <Icon size={16} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-[#1AA3A3]' : 'opacity-70'} />
            <span className="flex flex-col items-start leading-none">
                <span>{tab.label}</span>
                {/* Mobile pe sublabel hide kar sakte ho agar space kam ho */}
                {/* <span className="text-[9px] font-normal opacity-60 hidden sm:inline-block">{tab.subLabel}</span> */}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default WorkspaceTabs;