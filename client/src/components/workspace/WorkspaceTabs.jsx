import React from 'react';
import { motion } from 'framer-motion';
import { Inbox, Send } from 'lucide-react';

const WorkspaceTabs = ({ activeTab, setActiveTab }) => {
  
  const tabs = [
    { 
      id: 'received', 
      label: 'Inbox', 
      icon: Inbox,
    },
    { 
      id: 'sent', 
      label: 'Outbox', 
      icon: Send,
    },
  ];

  return (
    <div className="w-full md:w-auto bg-slate-100 dark:bg-white/5 p-1.5 rounded-full border border-slate-200 dark:border-white/5">
      <div className="flex relative">
        {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative flex-1 md:flex-none px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300
                  flex items-center justify-center gap-2 outline-none select-none z-10
                  ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}
                `}
              >
                {/* Active Sliding Background */}
                {isActive && (
                  <motion.div
                    layoutId="workspaceTabBg"
                    className="absolute inset-0 bg-white dark:bg-[#151515] rounded-full shadow-sm border border-black/5 dark:border-white/10 z-0"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                {/* Tab Content */}
                <span className="relative z-10 flex items-center gap-2">
                   <Icon size={16} className={`transition-colors ${isActive ? 'text-[#1AA3A3]' : 'opacity-70'}`} />
                   <span>{tab.label}</span>
                </span>
              </button>
            )
        })}
      </div>
    </div>
  );
};

export default WorkspaceTabs;