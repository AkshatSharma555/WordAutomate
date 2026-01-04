import React, { useState } from 'react';
import { footerLinks } from '../config/footer';
import ThreeDLogo from '../components/common/ThreeDLogo';
import ThemeToggle from '../components/common/ThemeToggle';

const Footer = ({ className, isDark, toggleTheme }) => {
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  return (
    <footer className={`pt-20 pb-10 px-6 md:px-12 lg:px-20 border-t transition-colors duration-500 ${
        isDark ? "bg-black border-white/10" : "bg-[#F3F2ED] border-slate-200"
    }`}>
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10 md:gap-20">
        
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
    </footer>
  );
};

export default Footer;