import React from 'react';
import { cn } from '../../utils/cn';

const Badge = ({ children, className }) => {
  return (
    <span className={cn(
      "px-3 py-1 text-xs font-medium rounded-full",
      "bg-secondary/10 text-primary border border-primary/20",
      className
    )}>
      {children}
    </span>
  );
};

export default Badge;