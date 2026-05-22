import React, { useState, useRef, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AdminContext } from '../../context/AdminContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Key, ArrowLeft, Loader2, AlertCircle, ArrowRight } from 'lucide-react';

const AdminReset = () => {
    axios.defaults.withCredentials = true;
    const { backendUrl } = useContext(AdminContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [otp, setOtp] = useState('');
    
    // Logic States
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
    
    // UX States
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    
    const inputRefs = useRef([]);

    const handleInput = (e, index) => { if (e.target.value.length > 0 && index < inputRefs.current.length - 1) inputRefs.current[index + 1].focus(); };
    const handleKeyDown = (e, index) => { if (e.key === 'Backspace' && e.target.value === '' && index > 0) inputRefs.current[index - 1].focus(); };
    const handlePaste = (e) => { const paste = e.clipboardData.getData('text'); const pasteArray = paste.split(''); pasteArray.forEach((char, index) => { if (inputRefs.current[index]) inputRefs.current[index].value = char; }); };

    // Step 1: Send Email
    const onSubmitEmail = async (e) => {
        e.preventDefault();
        setIsLoading(true); setErrorMsg('');
        try {
            // 🔥 FIX: Remove '/api'
            const { data } = await axios.post(backendUrl + '/admin/send-reset-otp', { email });
            if (data.success) { setIsEmailSent(true); } else { setErrorMsg(data.message); }
        } catch (error) { setErrorMsg(error.message); } 
        finally { setIsLoading(false); }
    };

    // Step 2: Verify OTP
    const onSubmitOTP = (e) => {
        e.preventDefault();
        const otpArray = inputRefs.current.map(input => input.value);
        const otpValue = otpArray.join('');
        if (otpValue.length < 6) { return setErrorMsg("Enter complete 6-digit OTP"); }
        setOtp(otpValue);
        setIsOtpSubmitted(true);
        setErrorMsg('');
    };

    // Step 3: Reset Password
    const onSubmitNewPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true); setErrorMsg('');
        try {
            // 🔥 FIX: Remove '/api'
            const { data } = await axios.post(backendUrl + '/admin/reset-password', { email, otp, newPassword });
            if (data.success) { navigate('/admin-secret-access'); } else { setErrorMsg(data.message); }
        } catch (error) { setErrorMsg(error.message); } 
        finally { setIsLoading(false); }
    };

    return (
        <div className="min-h-screen w-full bg-[#050505] flex items-center justify-center p-4 font-sans text-[#F3F2ED]">
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#F54A00] rounded-full blur-[150px] opacity-[0.1]" />

            {/* 👇 Back to Landing Breadcrumb */}
            <div className="absolute top-6 left-6 md:top-10 md:left-10 z-20">
                <Link to="/" className="group flex items-center gap-3 text-sm font-medium text-gray-500 hover:text-white transition-colors">
                     <div className="p-2.5 rounded-full bg-[#111] border border-[#222] group-hover:border-[#1AA3A3]/50 transition-all shadow-sm">
                        <ArrowLeft size={18} className="text-gray-400 group-hover:text-[#1AA3A3] transition-colors group-hover:-translate-x-0.5 transform" />
                     </div>
                     <span className="opacity-80 group-hover:opacity-100 transition-opacity">Back to Landing</span>
                </Link>
            </div>

            <motion.div layout className="w-full max-w-md bg-[#111111] border border-[#222] rounded-2xl shadow-2xl p-8 relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-3 bg-[#F54A00]/10 text-[#F54A00] rounded-xl mb-4">
                        <Key size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Reset Password</h2>
                    <p className="text-gray-400 text-sm mt-2">
                        {!isEmailSent ? "Enter email to receive OTP" : !isOtpSubmitted ? "Verify your identity" : "Set a new secure password"}
                    </p>
                </div>

                <AnimatePresence>
                    {errorMsg && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2 overflow-hidden">
                            <AlertCircle size={16} className="shrink-0" /> {errorMsg}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Step 1 Form */}
                {!isEmailSent && (
                    <form onSubmit={onSubmitEmail} className="space-y-4">
                        <div className="relative group">
                            <Mail className="absolute left-3.5 top-3.5 text-gray-500 group-focus-within:text-[#F54A00] transition-colors" size={18} />
                            <input onChange={e => setEmail(e.target.value)} value={email} className="w-full bg-[#0A0A0A] border border-[#333] text-white text-sm rounded-xl px-10 py-3 outline-none focus:border-[#F54A00] focus:ring-1 focus:ring-[#F54A00]" type="email" placeholder="Admin Email" required />
                        </div>
                        <button disabled={isLoading} className="w-full bg-[#F54A00] hover:bg-[#d14000] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2">
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <>Send OTP <ArrowRight size={18} /></>}
                        </button>
                    </form>
                )}

                {/* Step 2 Form */}
                {isEmailSent && !isOtpSubmitted && (
                    <form onSubmit={onSubmitOTP} className="space-y-6">
                        <div className='flex justify-between gap-2' onPaste={handlePaste}>
                            {Array(6).fill(0).map((_, index) => (
                                <input key={index} type="text" maxLength="1" required className='w-12 h-14 bg-[#0A0A0A] border border-[#333] rounded-xl text-white text-xl text-center focus:border-[#F54A00] focus:ring-1 focus:ring-[#F54A00] outline-none' ref={el => inputRefs.current[index] = el} onInput={(e) => handleInput(e, index)} onKeyDown={(e) => handleKeyDown(e, index)} />
                            ))}
                        </div>
                        <button className="w-full bg-[#F54A00] hover:bg-[#d14000] text-white font-bold py-3.5 rounded-xl transition-all">Verify OTP</button>
                    </form>
                )}

                {/* Step 3 Form */}
                {isEmailSent && isOtpSubmitted && (
                    <form onSubmit={onSubmitNewPassword} className="space-y-4">
                        <div className="relative group">
                            <Lock className="absolute left-3.5 top-3.5 text-gray-500 group-focus-within:text-[#F54A00] transition-colors" size={18} />
                            <input onChange={e => setNewPassword(e.target.value)} value={newPassword} className="w-full bg-[#0A0A0A] border border-[#333] text-white text-sm rounded-xl px-10 py-3 outline-none focus:border-[#F54A00] focus:ring-1 focus:ring-[#F54A00]" type="password" placeholder="New Password" required />
                        </div>
                        <button disabled={isLoading} className="w-full bg-[#F54A00] hover:bg-[#d14000] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2">
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Reset Password'}
                        </button>
                    </form>
                )}
            </motion.div>
        </div>
    );
};
export default AdminReset;