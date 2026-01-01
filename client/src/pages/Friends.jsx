import React from 'react';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import Breadcrumb from '../components/common/Breadcrumb';
import { useAuth } from '../context/AuthContext';
import { Users } from 'lucide-react';

const Friends = () => {
  const { currentUser, logout } = useAuth();

  return (
    <div className="min-h-screen w-full bg-[#F3F2ED] dark:bg-[#050505] relative transition-colors duration-300">
      <DashboardNavbar user={currentUser} onLogout={logout} />
      
      <div className="relative z-10 pt-24 px-4 md:px-8 max-w-6xl mx-auto pb-20">
        <Breadcrumb items={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Friends', path: '/friends' }]} />
        
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Friends Network</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your connections.</p>
        </div>

        {/* Placeholder UI */}
        <div className="bg-white dark:bg-[#111111] rounded-3xl p-12 text-center border border-dashed border-slate-300 dark:border-slate-800">
            <div className="size-20 bg-purple-500/10 text-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Friends List</h2>
            <p className="text-slate-500 mt-2">Add or remove friends to enable document generation.</p>
        </div>
      </div>
    </div>
  );
};

export default Friends;