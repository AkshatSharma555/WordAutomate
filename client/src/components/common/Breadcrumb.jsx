import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../utils/cn';

const Breadcrumb = ({ items = [], className }) => {
  return (
    <nav
      className={cn("flex items-center space-x-2 text-sm font-medium", className)}
      aria-label="Breadcrumb"
    >
      <Link
        to="/"
        className="flex items-center text-slate-400 hover:text-[#1AA3A3] transition-colors p-1 rounded-md hover:bg-[#1AA3A3]/5"
      >
        <Home size={18} />
        <span className="sr-only">Home</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center">
            <ChevronRight size={16} className="text-slate-300 mx-1" />

            {isLast ? (
              <span
                className="text-[#F54A00] font-semibold px-2 py-1 bg-[#F54A00]/5 rounded-md cursor-default"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <Link
                to={item.path}
                className="text-slate-500 hover:text-[#1AA3A3] transition-colors px-2 py-1 rounded-md hover:bg-[#1AA3A3]/5"
              >
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
