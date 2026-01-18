import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import { ShieldCheck } from 'lucide-react'; // 👈 Using ShieldCheck for "Verified" feel
import { footerLinks } from '../config/footer';
import ThreeDLogo from '../components/common/ThreeDLogo';
import ThemeToggle from '../components/common/ThemeToggle';

const Footer = ({ className, isDark, toggleTheme }) => {
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`pt-20 pb-6 px-6 md:px-12 lg:px-20 border-t transition-colors duration-500 ${
        isDark ? "bg-black border-white/10" : "bg-[#F3F2ED] border-slate-200"
    }`}>
      
      {/* --- Main Content --- */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10 md:gap-20 mb-16">
        
        {/* Brand Section */}
        <div 
            className="md:w-1/3 space-y-4"
            onMouseEnter={() => setIsLogoHovered(true)} 
            onMouseLeave={() => setIsLogoHovered(false)} 
        >
          <div className="flex items-center gap-3">
              <ThreeDLogo className="h-16 w-16" isHovered={isLogoHovered} />
              <span className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                Word<span className={isDark ? "text-[#F54A00]" : "text-[#1AA3A3]"}>Automate</span>
              </span>
          </div>

          <p className={isDark ? "text-slate-400" : "text-slate-600"}>
            Automating lab documentation for SIES GST students.
          </p>
          
          <div className="mt-6 flex items-center gap-3">
            <span className={`text-xs font-medium uppercase tracking-wider ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                {isDark ? "Disable Effects" : "Enable Effects"}
            </span>
            <ThemeToggle isDark={isDark} toggle={toggleTheme} />
          </div>
        </div>

        {/* Links Grid */}
        <div className="md:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-8">
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h4 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, idx) => (
                  <li key={idx}>
                    <a href={link.href} className={`text-sm transition-colors ${isDark ? "text-slate-400 hover:text-[#F54A00]" : "text-slate-600 hover:text-[#1AA3A3]"}`}>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* --- 👇 COPYRIGHT & ADMIN BAR --- */}
      <div className={`max-w-7xl mx-auto pt-6 border-t flex flex-col-reverse md:flex-row justify-between items-center gap-4 transition-colors duration-500 ${
          isDark ? "border-white/5" : "border-slate-200"
      }`}>
          
          {/* Copyright Text */}
          <p className={`text-sm font-medium ${isDark ? "text-slate-600" : "text-slate-500"}`}>
             &copy; {currentYear} WordAutomate. All rights reserved.
          </p>

          {/* 🔥 PREMIUM ADMIN BADGE (Visible & Stylish) */}
          <Link 
            to="/admin-secret-access"
            className={`
                flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all duration-300 border
                ${isDark 
                    ? "bg-white/5 text-slate-400 border-white/5 hover:bg-[#F54A00]/10 hover:text-[#F54A00] hover:border-[#F54A00]/20" 
                    : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-[#1AA3A3]/10 hover:text-[#1AA3A3] hover:border-[#1AA3A3]/20"
                }
            `}
          >
             <ShieldCheck size={14} />
             <span>ADMIN PORTAL</span>
          </Link>
      </div>

    </footer>
  );
};

export default Footer;