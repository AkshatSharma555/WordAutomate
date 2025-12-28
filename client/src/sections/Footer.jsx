import React from 'react';
import { footerLinks, socialLinks } from '../config/footer';
import Logo from '../components/common/Logo';
import ThemeToggle from '../components/common/ThemeToggle'; // Import Toggle

const Footer = ({ className, isDark, toggleTheme }) => {
  return (
    <footer className={`pt-20 pb-10 px-6 md:px-12 lg:px-20 border-t transition-colors duration-500 ${
        isDark ? "bg-black border-white/10" : "bg-cream border-slate-200"
    }`}>
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10 md:gap-20">
        
        {/* Brand Section */}
        <div className="md:w-1/3 space-y-4">
          <Logo isDark={isDark} />
          <p className={isDark ? "text-slate-400" : "text-slate-600"}>
            Automating lab documentation for SIES GST students.
          </p>
          
          {/* THEME TOGGLE (Magic Switch) */}
          <div className="mt-6 flex items-center gap-3">
            <span className={`text-xs font-medium uppercase tracking-wider ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                {isDark ? "Disable Effects" : "Enable Effects"}
            </span>
            <ThemeToggle isDark={isDark} toggle={toggleTheme} />
          </div>
        </div>

        {/* Links Grid */}
        <div className="md:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-8">
            {/* ... (Loop same rahega, bas text color dynamic karna hoga) ... */}
            {footerLinks.map((section, index) => (
            <div key={index}>
              <h4 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, idx) => (
                  <li key={idx}>
                    <a href={link.href} className={`text-sm transition-colors ${isDark ? "text-slate-400 hover:text-primary" : "text-slate-600 hover:text-primary"}`}>
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