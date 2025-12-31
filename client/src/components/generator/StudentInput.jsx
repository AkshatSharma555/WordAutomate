import React from 'react';
import { User, Hash } from 'lucide-react';

const StudentInput = ({ data, setData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
      {/* Name Input */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
          Student Name
        </label>
        <div className="relative group">
          <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-primary transition-colors">
            <User size={18} />
          </div>
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={handleChange}
            placeholder="e.g. Akshat Sharma"
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* PRN Input */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
          PRN Number
        </label>
        <div className="relative group">
          <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-primary transition-colors">
            <Hash size={18} />
          </div>
          <input
            type="text"
            name="prn"
            value={data.prn}
            onChange={handleChange}
            placeholder="e.g. 123A3049"
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-slate-800 dark:text-slate-200 placeholder:text-slate-400 uppercase"
          />
        </div>
      </div>
    </div>
  );
};

export default StudentInput;