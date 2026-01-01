import React from 'react';
import { motion } from 'framer-motion';

const WorkspaceTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'received', label: 'Inbox (Received)' },
    { id: 'history', label: 'Generation History' },
  ];

  return (
    <div className="bg-slate-200 dark:bg-slate-800 p-1 rounded-xl flex w-full md:w-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`relative flex-1 md:flex-none px-6 py-2 text-sm font-bold rounded-lg transition-all z-10 ${
            activeTab === tab.id ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="workspaceTab"
              className="absolute inset-0 bg-white dark:bg-[#111111] rounded-lg shadow-sm -z-10"
              transition={{ type: "spring", duration: 0.5 }}
            />
          )}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default WorkspaceTabs;