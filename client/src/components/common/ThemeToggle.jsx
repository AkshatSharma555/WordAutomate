import React from 'react';

const ThemeToggle = ({ isDark, toggle }) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={isDark}
        onChange={toggle}
      />
      <div className="w-16 h-8 bg-slate-300 rounded-full peer peer-checked:bg-secondary transition-colors duration-300 shadow-inner" />
      <span className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out peer-checked:translate-x-8" />
    </label>
  );
};

export default ThemeToggle;
