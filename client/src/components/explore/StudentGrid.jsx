import React from 'react';
import { SearchSlash } from 'lucide-react';
import StudentCard from './StudentCard';
import ExploreSkeleton from './ExploreSkeleton';

const StudentGrid = ({ loading, students, setToast, onViewProfile }) => {
  
  // 1. Loading State
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => <ExploreSkeleton key={i} />)}
      </div>
    );
  }

  // 2. Empty State
  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="size-24 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-6 text-slate-400 animate-pulse">
           <SearchSlash size={40} />
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">No students found</h3>
        <p className="text-slate-500 mt-2 max-w-xs mx-auto">
           Try adjusting your filters or search for a different name.
        </p>
      </div>
    );
  }

  // 3. Data Grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {students.map((student) => (
        <StudentCard 
          key={student._id} 
          student={student} 
          setToast={setToast}
          onViewProfile={onViewProfile} // Pass the click handler
        />
      ))}
    </div>
  );
};

export default StudentGrid;