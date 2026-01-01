import React from 'react';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import Breadcrumb from '../components/common/Breadcrumb';
import { useAuth } from '../context/AuthContext';
import { Briefcase } from 'lucide-react';

const Workspace = () => {
  const { currentUser, logout } = useAuth();

  return (
    <div className="min-h-screen w-full bg-[#F3F2ED] dark:bg-[#050505] relative transition-colors duration-300">
      <DashboardNavbar user={currentUser} onLogout={logout} />
      
      <div className="relative z-10 pt-24 px-4 md:px-8 max-w-6xl mx-auto pb-20">
        <Breadcrumb items={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Workspace', path: '/workspace' }]} />
        
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Workspace</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your generated and received documents.</p>
        </div>

        {/* Placeholder UI for now */}
        <div className="bg-white dark:bg-[#111111] rounded-3xl p-12 text-center border border-dashed border-slate-300 dark:border-slate-800">
            <div className="size-20 bg-[#F54A00]/10 text-[#F54A00] rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Workspace Coming Soon</h2>
            <p className="text-slate-500 mt-2">Tabs for 'Received' and 'Generated' docs will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default Workspace;