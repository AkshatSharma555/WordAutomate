import React from 'react';
import { Moon, Sun } from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';

const AppearanceSection = ({ theme, toggleTheme, dbTheme }) => {
  // Check if current theme is different from what's saved in DB
  const isChanged = theme !== dbTheme;

  return (
    <div className="mt-8 bg-white dark:bg-[#111111] rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200/60 dark:border-slate-800 transition-colors duration-300">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-purple-500/10 text-purple-400' : 'bg-orange-100 text-orange-500'
                }`}>
                    {theme === 'dark' ? <Moon size={24} /> : <Sun size={24} />}
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Appearance</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {isChanged ? (
                          <span className="text-[#1AA3A3] font-semibold animate-pulse">
                            Theme changed. Click save to apply permanently.
                          </span>
                        ) : (
                          theme === 'dark' ? 'Dark mode is active.' : 'Light mode is active.'
                        )}
                    </p>
                </div>
            </div>
            {/* Toggle Button */}
            <ThemeToggle isDark={theme === 'dark'} toggle={toggleTheme} />
        </div>
    </div>
  );
};

export default AppearanceSection;