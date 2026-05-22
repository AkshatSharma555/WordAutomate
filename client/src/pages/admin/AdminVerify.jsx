import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AdminContext } from '../../context/AdminContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';

const AdminVerify = () => {
    axios.defaults.withCredentials = true;
    const { backendUrl, isAdminLoggedin, adminData, getAdminData } = useContext(AdminContext);
    const navigate = useNavigate();
    const inputRefs = useRef([]);
    
    // UX States
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleInput = (e, index) => { if (e.target.value.length > 0 && index < inputRefs.current.length - 1) inputRefs.current[index + 1].focus(); };
    const handleKeyDown = (e, index) => { if (e.key === 'Backspace' && e.target.value === '' && index > 0) inputRefs.current[index - 1].focus(); };
    const handlePaste = (e) => { const paste = e.clipboardData.getData('text'); const pasteArray = paste.split(''); pasteArray.forEach((char, index) => { if (inputRefs.current[index]) inputRefs.current[index].value = char; }); };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');

        try {
            const otpArray = inputRefs.current.map(e => e.value);
            const otp = otpArray.join('');
            // 🔥 FIX: Remove '/api'
            const { data } = await axios.post(backendUrl + '/admin/verify-account', { otp });
            
            if (data.success) {
                await getAdminData();
                navigate('/admin/dashboard');
            } else {
                setErrorMsg(data.message);
            }
        } catch (error) {
            setErrorMsg(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if(isAdminLoggedin && adminData && adminData.isAccountVerified) {
            navigate('/admin/dashboard');
        }
    }, [isAdminLoggedin, adminData, navigate]);

    return (
        <div className="min-h-screen w-full bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden font-sans text-[#F3F2ED]">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#1AA3A3] rounded-full blur-[150px] opacity-[0.1]" />

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
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-[#111111] border border-[#222] rounded-2xl shadow-2xl p-8 relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-3 bg-[#1AA3A3]/10 text-[#1AA3A3] rounded-xl mb-4">
                        <ShieldCheck size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Verification Required</h2>
                    <p className="text-gray-400 text-sm mt-2">Enter the 6-digit code sent to your email.</p>
                </div>

                <AnimatePresence>
                    {errorMsg && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2 overflow-hidden">
                            <AlertCircle size={16} className="shrink-0" /> {errorMsg}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={onSubmitHandler}>
                    <div className='flex justify-between gap-2 mb-8' onPaste={handlePaste}>
                        {Array(6).fill(0).map((_, index) => (
                            <input key={index} type="text" maxLength="1" required 
                                className='w-12 h-14 bg-[#0A0A0A] border border-[#333] rounded-xl text-white text-xl text-center focus:border-[#1AA3A3] focus:ring-1 focus:ring-[#1AA3A3] outline-none transition-all'
                                ref={e => inputRefs.current[index] = e}
                                onInput={(e) => handleInput(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                            />
                        ))}
                    </div>
                    <button disabled={isLoading} className='w-full bg-[#1AA3A3] hover:bg-[#158585] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#1AA3A3]/20 flex items-center justify-center gap-2'>
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Verify Email'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};
export default AdminVerify;