import React from 'react';
import { SearchSlash } from 'lucide-react';
import { motion } from 'framer-motion'; // Animation ke liye
import StudentCard from './StudentCard';
import ExploreSkeleton from './ExploreSkeleton';

const StudentGrid = ({ loading, students, setToast, onViewProfile }) => {
  
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50, damping: 15 } }
  };

  // 1. Loading State (Skeleton Grid)
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
            >
                <ExploreSkeleton />
            </motion.div>
        ))}
      </div>
    );
  }

  // 2. Empty State (Premium Look)
  if (students.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-32 text-center"
      >
        <div className="size-24 bg-slate-50 dark:bg-[#151515] border border-slate-200 dark:border-slate-800 rounded-full flex items-center justify-center mb-6 relative">
           <div className="absolute inset-0 bg-[#1AA3A3]/5 rounded-full animate-ping opacity-75"></div>
           <SearchSlash size={32} className="text-slate-400 dark:text-slate-600" />
        </div>
        <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">No students found</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
           We couldn't find anyone matching those filters. Try adjusting your search or filters.
        </p>
      </motion.div>
    );
  }

  // 3. Data Grid (Animated)
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {students.map((student) => (
        <motion.div key={student._id} variants={itemVariants}>
            <StudentCard 
              student={student} 
              setToast={setToast}
              onViewProfile={onViewProfile} 
            />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StudentGrid;