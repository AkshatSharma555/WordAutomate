import React, { useState } from 'react';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, FolderOpen } from 'lucide-react';

// Sub Components
import StatsBar from '../components/workspace/StatsBar';
import WorkspaceTabs from '../components/workspace/WorkspaceTabs';
import FileCard from '../components/workspace/FileCard';

// MOCK DATA (Jab tak backend nahi judta)
const MOCK_RECEIVED = [
  { id: 1, fileName: "CN_Experiment_4_Virat.pdf", date: "Oct 24, 2025", size: "2.4 MB", sender: { name: "Virat Kohli", img: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Virat_Kohli_during_the_India_vs_Aus_4th_Test_match_at_Narendra_Modi_Stadium_on_09_March_2023.jpg" } },
  { id: 2, fileName: "DBMS_Lab_Manual_Final.pdf", date: "Oct 22, 2025", size: "5.1 MB", sender: { name: "Rohit Sharma", img: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Prime_Minister_Of_Bharat_Shri_Narendra_Damodardas_Modi_with_Shri_Rohit_Gurunath_Sharma_%28Cropped%29.jpg" } },
];

const MOCK_HISTORY = [
  { id: 101, fileName: "Web_Dev_Exp_5_Batch_A.zip", date: "Today, 10:30 AM", size: "12 MB", recipients: [
      { img: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Virat_Kohli_during_the_India_vs_Aus_4th_Test_match_at_Narendra_Modi_Stadium_on_09_March_2023.jpg" },
      { img: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Prime_Minister_Of_Bharat_Shri_Narendra_Damodardas_Modi_with_Shri_Rohit_Gurunath_Sharma_%28Cropped%29.jpg" },
      { img: "https://cdn-icons-png.flaticon.com/512/149/149071.png" },
      { img: "https://cdn-icons-png.flaticon.com/512/149/149071.png" }
  ]},
  { id: 102, fileName: "Python_Journal_Batch_B.zip", date: "Yesterday", size: "45 MB", recipients: [
      { img: "https://upload.wikimedia.org/wikipedia/commons/9/94/Hardik_Pandya_in_PMO_New_Delhi.jpg" },
      { img: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Jasprit_Bumrah_in_PMO_New_Delhi.jpg" }
  ]},
];

const Workspace = () => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('received');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter Logic
  const dataList = activeTab === 'received' ? MOCK_RECEIVED : MOCK_HISTORY;
  const filteredData = dataList.filter(item => 
    item.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F3F2ED] dark:bg-[#050505] flex flex-col">
      <DashboardNavbar user={currentUser} onLogout={logout} />

      <div className="flex-1 pt-24 pb-10 px-4 md:px-8 max-w-6xl mx-auto w-full">
        
        {/* Header */}
        <div className="mb-6">
           <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
             Workspace
           </h1>
           <p className="text-slate-500 text-sm mt-1">
             Manage your received files and generation history.
           </p>
        </div>

        {/* 1. TOP STATS */}
        <StatsBar stats={{ received: 12, generated: 45, storage: "120 MB" }} />

        {/* 2. CONTROLS (Search & Tabs) */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
           {/* Search */}
           <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search files by name..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-[#1AA3A3] transition-colors"
              />
           </div>

           {/* Tabs */}
           <WorkspaceTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* 3. FILE LIST AREA */}
        <div className="space-y-3 min-h-[300px]">
           {filteredData.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-20 text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                <FolderOpen size={40} className="mb-4 opacity-50" />
                <p>No files found.</p>
             </div>
           ) : (
             filteredData.map((file) => (
               <FileCard key={file.id} file={file} type={activeTab} />
             ))
           )}
        </div>

      </div>
    </div>
  );
};

export default Workspace;