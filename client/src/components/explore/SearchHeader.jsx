import React from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchHeader = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative group w-full">
      
      {/* Background Glow Layer (Visible on Focus) - Slightly intensified */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#1AA3A3] to-teal-400 rounded-2xl opacity-0 group-focus-within:opacity-30 transition duration-500 blur-lg"></div>

      <div className="relative flex items-center">
        {/* Search Icon */}
        <div className="absolute left-4 text-slate-400 dark:text-slate-500 group-focus-within:text-[#1AA3A3] transition-colors duration-300">
           <Search size={20} className="group-focus-within:scale-110 transition-transform duration-300" />
        </div>

        {/* Input Field - NOW TRANSPARENT */}
        <input 
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search students by name..."
          className="w-full pl-12 pr-12 py-4 
            bg-white/50 dark:bg-black/20 
            backdrop-blur-xl 
            border border-slate-200/60 dark:border-white/10 
            rounded-2xl 
            text-base font-medium text-slate-800 dark:text-white 
            placeholder:text-slate-400 dark:placeholder:text-slate-600
            focus:outline-none 
            focus:bg-white/80 dark:focus:bg-black/40 
            focus:border-[#1AA3A3]/50 
            transition-all duration-300 
            shadow-sm hover:shadow-md"
        />

        {/* Clear Button (Animated) */}
        <AnimatePresence>
          {searchTerm && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setSearchTerm('')}
              className="absolute right-4 p-1 rounded-full bg-slate-200/50 dark:bg-white/10 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all backdrop-blur-md"
            >
              <X size={14} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SearchHeader;