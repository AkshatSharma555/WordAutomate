import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/common/Logo';
import { ShieldCheck, Loader2 } from 'lucide-react';
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
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#F3F2ED]">
      <div className="absolute top-6 left-6 z-20 hidden md:block">
        <Breadcrumb items={[{ label: 'Login', path: '/login' }]} />
      </div>

      <div className="absolute top-[-10%] left-[-10%] size-[300px] md:size-[600px] rounded-full blur-[100px] md:blur-[140px] opacity-15 bg-[#F54A00]" />
      <div className="absolute bottom-[-10%] right-[-10%] size-[300px] md:size-[600px] rounded-full blur-[100px] md:blur-[140px] opacity-15 bg-[#1AA3A3]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(26,163,163,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(26,163,163,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black,transparent)] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[440px] bg-white p-8 md:p-12 rounded-[2rem] shadow-2xl shadow-slate-200/60 border border-white/60 backdrop-blur-sm relative z-10 flex flex-col items-center text-center"
      >
        <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
          <Logo isDark={false} />
        </div>

        <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
          Student Portal
        </h2>

        <p className="text-slate-500 text-sm mb-10 leading-relaxed max-w-[280px] mx-auto">
          Simplify your lab submissions. <br />
          Sign in with your official college ID.
        </p>

        <button
          onClick={handleMicrosoftLogin}
          disabled={loading}
          className="w-full group relative flex items-center justify-center gap-3 bg-[#2F2F2F] hover:bg-black text-white font-medium py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
        >
          {loading ? (
            <Loader2 className="size-5 animate-spin text-[#1AA3A3]" />
          ) : (
            <>
              <svg className="size-5" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 0.5H0.5V10.5H10.5V0.5Z" fill="#F25022" />
                <path d="M21.5 0.5H11.5V10.5H21.5V0.5Z" fill="#7FBA00" />
                <path d="M10.5 11.5H0.5V21.5H10.5V11.5Z" fill="#00A4EF" />
                <path d="M21.5 11.5H11.5V21.5H21.5V11.5Z" fill="#FFB900" />
              </svg>
              <span>Sign in with Microsoft</span>
            </>
          )}

          {!loading && (
            <div className="absolute inset-0 rounded-xl pointer-events-none">
              <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:animate-shine" />
            </div>
          )}
        </button>

        <div className="mt-8 w-full flex items-start gap-3 text-left bg-[#1AA3A3]/5 p-4 rounded-2xl border border-[#1AA3A3]/10">
          <ShieldCheck className="size-5 text-[#1AA3A3] shrink-0 mt-0.5" />
          <div className="text-xs text-slate-600 font-medium leading-relaxed">
            <p className="mb-1">Secure access via SIES GST.</p>
            <p>
              <span className="opacity-70 font-normal">Only </span>
              <span className="font-bold text-[#1AA3A3] bg-[#1AA3A3]/10 px-1 rounded">
                @gst.sies.edu.in
              </span>
              <span className="opacity-70 font-normal"> emails allowed.</span>
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 w-full flex justify-between text-xs font-semibold tracking-wide">
          <Link to="/" className="text-slate-400 hover:text-[#F54A00] transition-colors">
            Back to Home
          </Link>
          <Link to="/support" className="text-slate-400 hover:text-[#1AA3A3] transition-colors">
            Need Help?
          </Link>
        </div>
      </motion.div>

      <style>{`
        @keyframes shine { 100% { left: 125%; } }
        .group-hover\\:animate-shine { animation: shine 0.75s; }
      `}</style>
    </div>
  );
};

export default Login;
