import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus } from 'lucide-react';

const FriendsTabs = ({ activeTab, setActiveTab, counts }) => {
  const tabs = [
    { id: 'connections', label: 'My Network', count: counts.connections, icon: Users },
    { id: 'requests', label: 'Incoming Requests', count: counts.requests, icon: UserPlus },
  ];

  return (
    // Container: Glassmorphic Pill
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
                  relative flex-1 md:flex-none px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300
                  flex items-center justify-center gap-2 outline-none select-none
                  ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}
                `}
              >
                {/* Active Sliding Background */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabBg"
                    className="absolute inset-0 bg-white dark:bg-[#151515] rounded-full shadow-sm border border-black/5 dark:border-white/10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                {/* Tab Content */}
                <span className="relative z-10 flex items-center gap-2">
                   <Icon size={16} className={`transition-colors ${isActive ? 'text-[#1AA3A3]' : 'opacity-70'}`} />
                   <span>{tab.label}</span>
                   
                   {/* Count Badge */}
                   {tab.count > 0 && (
                     <span className={`
                       ml-1 text-[10px] h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full transition-all
                       ${isActive 
                         ? 'bg-[#1AA3A3] text-white shadow-md shadow-[#1AA3A3]/20' 
                         : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400'
                       }
                     `}>
                       {tab.count}
                     </span>
                   )}
                </span>
              </button>
            )
        })}
      </div>
    </div>
  );
};

export default FriendsTabs;