import React from 'react';
import { User, Mail, ShieldCheck } from 'lucide-react';

const PersonalInfoSection = ({ user }) => {
  return (
    <div className="mt-8 bg-white dark:bg-[#111111] rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/60 dark:border-slate-800 transition-colors duration-300">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Personal Information</h3>
        <div className="space-y-5">
             <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                <div className="relative">
                    <User className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                    <input type="text" value={user.name} disabled className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-300 font-medium cursor-not-allowed focus:outline-none" />
                    <span className="absolute right-3.5 top-3.5 text-[10px] font-bold text-slate-400 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded bg-white dark:bg-[#222]">LOCKED</span>
                </div>
            </div>
            <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">College Email</label>
                <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                    <input type="text" value={user.email} disabled className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-300 font-medium cursor-not-allowed focus:outline-none" />
                    <div className="absolute right-3 top-3 text-[#1AA3A3]"><ShieldCheck size={20} /></div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default PersonalInfoSection;