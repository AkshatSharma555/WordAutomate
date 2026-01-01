import React from 'react';
import { Search } from 'lucide-react';

const SearchHeader = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="mb-6 relative group">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Search className="text-slate-400 group-focus-within:text-[#1AA3A3] transition-colors" size={20} />
      </div>
      <input 
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search students by name..."
        className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-4 focus:ring-[#1AA3A3]/10 focus:border-[#1AA3A3] transition-all placeholder:text-slate-400 shadow-sm"
      />
    </div>
  );
};

export default SearchHeader;