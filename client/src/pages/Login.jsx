import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/common/Logo';
import { ShieldCheck, Loader2, LockKeyhole, Building2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Breadcrumb from '../components/common/Breadcrumb';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleMicrosoftLogin = async () => {
    try {
      setLoading(true);
      await login();
      navigate('/dashboard');
    } catch (error) {
      console.error("Login Failed:", error);
      alert("Access Restricted: Please sign in with your @gst.sies.edu.in account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Main Container: Fixed Height (No Body Scroll), Center Alignment
    <div className="fixed inset-0 w-full h-[100dvh] bg-[#F3F2ED] dark:bg-[#050505] transition-colors duration-300 font-sans overflow-hidden flex flex-col items-center justify-center">
      
      {/* 1. TOP NAVIGATION (Fixed Top-Left) */}
      <div className="absolute top-6 left-6 z-30 hidden md:block">
        <Breadcrumb items={[{ label: 'Authentication', path: '/login' }]} />
      </div>

      {/* 2. AMBIENT BACKGROUND (Fixed & Static) */}
      <div className="absolute inset-0 pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] rounded-full blur-[120px] bg-[#F54A00] opacity-10 dark:opacity-[0.05]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full blur-[120px] bg-[#1AA3A3] opacity-10 dark:opacity-[0.05]" />
         <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black,transparent)]" />
      </div>

      {/* 3. CENTERED CARD WRAPPER */}
      <div className="w-full h-full overflow-y-auto overflow-x-hidden flex items-center justify-center p-4 relative z-10 scrollbar-hide">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-[420px] bg-white/80 dark:bg-[#111111]/80 p-6 md:p-8 rounded-[32px] shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-white/50 dark:border-white/10 backdrop-blur-xl flex flex-col items-center text-center mx-auto my-auto"
        >
          
          {/* Logo Section */}
          <div className="mb-6 transform hover:scale-105 transition-transform duration-300">
            <Logo isDark={false} />
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
            Student Portal
          </h2>

          <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm mb-8 leading-relaxed font-medium max-w-[260px]">
            Automate your document workflows. <br className="hidden md:block"/>
            Seamless integration for SIES GST.
          </p>

          {/* Login Button */}
          <button
            onClick={handleMicrosoftLogin}
            disabled={loading}
            className="w-full group relative flex items-center justify-center gap-3 bg-[#2F2F2F] hover:bg-black dark:bg-white dark:hover:bg-slate-200 text-white dark:text-black font-bold py-3.5 px-6 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
          >
            {loading ? (
              <Loader2 className="size-5 animate-spin text-[#1AA3A3]" />
            ) : (
              <>
                <svg className="size-5 shrink-0" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.5 0.5H0.5V10.5H10.5V0.5Z" fill="#F25022" />
                  <path d="M21.5 0.5H11.5V10.5H21.5V0.5Z" fill="#7FBA00" />
                  <path d="M10.5 11.5H0.5V21.5H10.5V11.5Z" fill="#00A4EF" />
                  <path d="M21.5 11.5H11.5V21.5H21.5V11.5Z" fill="#FFB900" />
                </svg>
                <span className="truncate">Sign in with Microsoft</span>
                <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 shrink-0" />
              </>
            )}

            {/* Shine Effect */}
            {!loading && (
              <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 dark:via-black/10 to-transparent skew-x-12 group-hover:animate-shine" />
              </div>
            )}
          </button>

          {/* Security & Restriction Info */}
          <div className="mt-6 w-full space-y-3">
              
              {/* Security Note */}
              <div className="flex items-start gap-3 text-left bg-emerald-50/50 dark:bg-emerald-900/10 p-3 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                  <div className="p-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400 shrink-0">
                      <LockKeyhole size={14} />
                  </div>
                  <div className="text-[10px] md:text-[11px] text-emerald-800 dark:text-emerald-400 font-medium leading-tight pt-0.5">
                      <p className="font-bold mb-0.5">End-to-End Secure</p>
                      <p className="opacity-80">Passwords are handled securely by Microsoft so you can safely login.</p>
                  </div>
              </div>

              {/* Domain Restriction Note */}
              <div className="flex items-center gap-3 text-left bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-100 dark:border-white/10">
                  <div className="p-1 bg-slate-200 dark:bg-white/10 rounded-lg text-slate-500 dark:text-slate-400 shrink-0">
                      <Building2 size={14} />
                  </div>
                  <div className="text-[10px] md:text-[11px] text-slate-600 dark:text-slate-300 font-medium pt-0.5">
                      <p className="mb-0.5">Institute Access Only</p>
                      <p className="leading-snug">
                        Only <span className="font-bold text-slate-900 dark:text-white bg-white dark:bg-white/10 px-1 py-0.5 rounded border border-slate-200 dark:border-white/10">@gst.sies.edu.in</span> (GSTian) accounts allowed.
                      </p>
                  </div>
              </div>

          </div>

          {/* Footer (Centered now since only one link) */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/5 w-full flex justify-center text-[10px] md:text-xs font-bold tracking-wide text-slate-400">
            <Link to="/" className="hover:text-[#F54A00] transition-colors flex items-center gap-1">
              Back to Home
            </Link>
          </div>

        </motion.div>
      </div>

      {/* Animation Style */}
      <style>{`
        @keyframes shine { 100% { left: 125%; } }
        .group-hover\\:animate-shine { animation: shine 0.75s; }
        
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
    </div>
  );
};

export default Login;