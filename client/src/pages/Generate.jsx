import React from 'react';
import { motion } from 'framer-motion';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import GeneratorEngine from '../components/generator/GeneratorEngine';
import Breadcrumb from '../components/common/Breadcrumb';
import { useAuth } from '../context/AuthContext';

const Generate = () => {
  const { currentUser, logout } = useAuth();

  return (
    <div className="min-h-screen w-full bg-[#F3F2ED] dark:bg-[#050505] relative transition-colors duration-300">
      <DashboardNavbar user={currentUser} onLogout={logout} />
      
      <div className="relative z-10 pt-24 px-4 md:px-8 max-w-5xl mx-auto pb-20">
        <Breadcrumb items={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Generate', path: '/generate' }]} />
        
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Generate Document</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Create lab reports instantly using Microsoft Graph.</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <GeneratorEngine />
        </motion.div>
      </div>
    </div>
  );
};

export default Generate;