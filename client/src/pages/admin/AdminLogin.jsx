import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AdminContext } from '../../context/AdminContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Key, ShieldCheck, ArrowRight, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';

const AdminLogin = () => {
    const navigate = useNavigate();
    const { backendUrl, setIsAdminLoggedin, getAdminData } = useContext(AdminContext);

    const [state, setState] = useState('Login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secretKey, setSecretKey] = useState('');
    
    // UX States
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');

        try {
            axios.defaults.withCredentials = true;
            let url = backendUrl;

            // 🔥 FIX: Remove '/api' from string logic
            if (state === 'Sign Up') {
                url += '/admin/register'; 
                const { data } = await axios.post(url, { name, email, password, secretKey });
                if (data.success) {
                    setIsAdminLoggedin(true);
                    await getAdminData();
                    navigate('/admin/dashboard');
                } else {
                    setErrorMsg(data.message);
                }
            } else {
                url += '/admin/login'; 
                const { data } = await axios.post(url, { email, password });
                if (data.success) {
                    setIsAdminLoggedin(true);
                    await getAdminData();
                    navigate('/admin/dashboard');
                } else {
                    setErrorMsg(data.message);
                }
            }
        } catch (error) {
            setErrorMsg(error.response?.data?.message || "Server connection failed.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden font-sans text-[#F3F2ED]">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#1AA3A3] rounded-full blur-[150px] opacity-[0.1]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#F54A00] rounded-full blur-[150px] opacity-[0.08]" />

            {/* 👇 Back to Landing Breadcrumb */}
            <div className="absolute top-6 left-6 md:top-10 md:left-10 z-20">
                <Link to="/" className="group flex items-center gap-3 text-sm font-medium text-gray-500 hover:text-white transition-colors">
                     <div className="p-2.5 rounded-full bg-[#111] border border-[#222] group-hover:border-[#1AA3A3]/50 transition-all shadow-sm">
                        <ArrowLeft size={18} className="text-gray-400 group-hover:text-[#1AA3A3] transition-colors group-hover:-translate-x-0.5 transform" />
                     </div>
                     <span className="opacity-80 group-hover:opacity-100 transition-opacity">Back to Landing</span>
                </Link>
            </div>

            <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-[#111111] border border-[#222] rounded-2xl shadow-2xl p-8 relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-3 bg-[#1AA3A3]/10 text-[#1AA3A3] rounded-xl mb-4 shadow-[0_0_15px_rgba(26,163,163,0.2)]">
                        <ShieldCheck size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                        {state === 'Sign Up' ? 'Create Master Access' : 'Admin Portal'}
                    </h2>
                    <p className="text-gray-400 text-sm mt-2">
                        {state === 'Sign Up' ? 'Enter credentials & secret key' : 'Secure access to dashboard'}
                    </p>
                </div>

                <AnimatePresence>
                    {errorMsg && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                            className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2 overflow-hidden"
                        >
                            <AlertCircle size={16} className="shrink-0" />
                            {errorMsg}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={onSubmitHandler} className="space-y-4">
                    {state === 'Sign Up' && (
                        <>
                            <div className="relative group">
                                <User className="absolute left-3.5 top-3.5 text-gray-500 group-focus-within:text-[#1AA3A3] transition-colors" size={18} />
                                <input onChange={e => setName(e.target.value)} value={name} className="w-full bg-[#0A0A0A] border border-[#333] text-white text-sm rounded-xl px-10 py-3 outline-none focus:border-[#1AA3A3] focus:ring-1 focus:ring-[#1AA3A3] transition-all" type="text" placeholder="Admin Name" required />
                            </div>
                            <div className="relative group">
                                <Key className="absolute left-3.5 top-3.5 text-[#F54A00] opacity-80 group-focus-within:opacity-100 transition-opacity" size={18} />
                                <input onChange={e => setSecretKey(e.target.value)} value={secretKey} className="w-full bg-[#0A0A0A] border border-[#F54A00]/40 text-white text-sm rounded-xl px-10 py-3 outline-none focus:border-[#F54A00] focus:ring-1 focus:ring-[#F54A00] transition-all" type="password" placeholder="Master Secret Key" required />
                            </div>
                        </>
                    )}

                    <div className="relative group">
                        <Mail className="absolute left-3.5 top-3.5 text-gray-500 group-focus-within:text-[#1AA3A3] transition-colors" size={18} />
                        <input onChange={e => setEmail(e.target.value)} value={email} className="w-full bg-[#0A0A0A] border border-[#333] text-white text-sm rounded-xl px-10 py-3 outline-none focus:border-[#1AA3A3] focus:ring-1 focus:ring-[#1AA3A3] transition-all" type="email" placeholder="Email Address" required />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-3.5 top-3.5 text-gray-500 group-focus-within:text-[#1AA3A3] transition-colors" size={18} />
                        <input onChange={e => setPassword(e.target.value)} value={password} className="w-full bg-[#0A0A0A] border border-[#333] text-white text-sm rounded-xl px-10 py-3 outline-none focus:border-[#1AA3A3] focus:ring-1 focus:ring-[#1AA3A3] transition-all" type="password" placeholder="Password" required />
                    </div>

                    <div className="flex justify-end">
                        <button type="button" onClick={() => navigate('/admin/reset-password')} className="text-xs text-[#F54A00] hover:text-[#ff6a2b] transition-colors">
                            Forgot password?
                        </button>
                    </div>

                    <button disabled={isLoading} className="w-full bg-[#1AA3A3] hover:bg-[#158585] disabled:bg-[#1AA3A3]/50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#1AA3A3]/20 flex items-center justify-center gap-2 mt-2">
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : (<>{state} <ArrowRight size={18} /></>)}
                    </button>
                </form>

                <div className="mt-6 text-center pt-4 border-t border-[#222]">
                    {state === 'Sign Up' ? (
                        <p className="text-gray-400 text-xs">
                            Already verified? <span onClick={() => setState('Login')} className="text-[#1AA3A3] cursor-pointer hover:underline font-medium">Login here</span>
                        </p>
                    ) : (
                        <p className="text-gray-400 text-xs">
                            Need new access? <span onClick={() => setState('Sign Up')} className="text-[#1AA3A3] cursor-pointer hover:underline font-medium">Register here</span>
                        </p>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

export default AdminLogin;