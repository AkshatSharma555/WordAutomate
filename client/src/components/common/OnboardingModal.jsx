import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, BookOpen, Calendar, Hash, ShieldCheck, Loader2 } from 'lucide-react';
import { updatePersonalInfo } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import Toast from './Toast';

const OnboardingModal = () => {
    const { currentUser, setCurrentUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Form States
    const [prn, setPrn] = useState(currentUser?.prn || '');
    const [branch, setBranch] = useState(currentUser?.branch || '');
    const [year, setYear] = useState(currentUser?.year || '');

    // SIES GST specific branches (Example)
    const branches = ["CE", "IT", "ECS", "EXTC", "MECH", "AIDS", "IOT"];
    const years = ["FE", "SE", "TE", "BE"];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!prn.trim() || !branch || !year) {
            setError("Please fill all fields to continue.");
            return;
        }

        setIsLoading(true);
        try {
            // API Call
            const response = await updatePersonalInfo({ 
                name: currentUser.name, // Name wahi rahega
                prn, 
                branch, 
                year 
            });

            if (response.success) {
                // 🔥 Update Context immediately to remove Modal
                setCurrentUser(prev => ({
                    ...prev,
                    prn: response.prn,
                    branch: response.branch,
                    year: response.year
                }));
            }
        } catch (err) {
            setError(err.message || "Failed to update profile.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            {/* 1. Blurred Backdrop (Blocks clicks) */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

            {/* 2. Glassmorphism Card */}
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative w-full max-w-md bg-[#1a1a1a]/90 border border-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl overflow-hidden"
            >
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#1AA3A3]/20 blur-[50px] rounded-full pointer-events-none" />
                
                <div className="text-center mb-6 relative z-10">
                    <div className="size-16 bg-[#1AA3A3]/10 text-[#1AA3A3] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#1AA3A3]/20">
                        <User size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Complete Your Profile 🚀</h2>
                    <p className="text-slate-400 text-sm">
                        To generate documents and connect with peers, we need a few academic details.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                    
                    {/* Name Field (Read-only) */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Full Name</label>
                        <div className="relative group">
                            <div className="absolute left-3 top-3 text-slate-500"><ShieldCheck size={18} /></div>
                            <input 
                                type="text" 
                                value={currentUser?.name || ''} 
                                disabled 
                                className="w-full bg-white/5 border border-white/10 text-slate-300 rounded-xl py-2.5 pl-10 pr-4 text-sm cursor-not-allowed opacity-70"
                            />
                        </div>
                        <p className="text-[10px] text-[#1AA3A3] mt-1.5 flex items-center gap-1">
                            <ShieldCheck size={10} /> Verified from Microsoft Account
                        </p>
                    </div>

                    {/* PRN Input */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">PRN / Roll No</label>
                        <div className="relative">
                            <div className="absolute left-3 top-3 text-slate-400"><Hash size={18} /></div>
                            <input 
                                type="text" 
                                value={prn}
                                onChange={(e) => setPrn(e.target.value.toUpperCase())}
                                placeholder="Enter your PRN"
                                className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-2.5 pl-10 pr-4 text-sm focus:border-[#1AA3A3] focus:ring-1 focus:ring-[#1AA3A3] transition-all outline-none placeholder:text-slate-600"
                            />
                        </div>
                    </div>

                    {/* Branch & Year Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Branch</label>
                            <div className="relative">
                                <div className="absolute left-3 top-3 text-slate-400"><BookOpen size={18} /></div>
                                <select 
                                    value={branch}
                                    onChange={(e) => setBranch(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-2.5 pl-10 pr-2 text-sm focus:border-[#1AA3A3] focus:ring-1 focus:ring-[#1AA3A3] transition-all outline-none appearance-none cursor-pointer"
                                >
                                    <option value="" className="bg-[#222]">Select</option>
                                    {branches.map(b => <option key={b} value={b} className="bg-[#222]">{b}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Year</label>
                            <div className="relative">
                                <div className="absolute left-3 top-3 text-slate-400"><Calendar size={18} /></div>
                                <select 
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-2.5 pl-10 pr-2 text-sm focus:border-[#1AA3A3] focus:ring-1 focus:ring-[#1AA3A3] transition-all outline-none appearance-none cursor-pointer"
                                >
                                    <option value="" className="bg-[#222]">Select</option>
                                    {years.map(y => <option key={y} value={y} className="bg-[#222]">{y}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {error && <p className="text-red-400 text-xs text-center font-medium">{error}</p>}

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-[#1AA3A3] hover:bg-[#158585] text-white font-bold py-3 rounded-xl shadow-lg shadow-[#1AA3A3]/20 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Save & Continue"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default OnboardingModal;