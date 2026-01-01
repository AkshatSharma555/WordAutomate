import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Lenis from 'lenis'; 
import DashboardNavbar from '../components/layout/DashboardNavbar';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/common/Toast';
import Breadcrumb from '../components/common/Breadcrumb';

// Components
import ExploreSidebar from '../components/explore/ExploreSidebar';
import SearchHeader from '../components/explore/SearchHeader';
import StudentGrid from '../components/explore/StudentGrid';
import StudentProfileModal from '../components/explore/StudentProfileModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Explore = () => {
  const { currentUser, logout } = useAuth();
  
  // Refs
  const scrollContainerRef = useRef(null); 

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ year: '', branch: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null); 
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Mobile Filter Helpers
  const years = ["FE", "SE", "TE", "BE"];
  const branches = ["ECS", "EXTC", "IT", "AIDS", "AIML", "IOT", "CE", "ME"];

  // 1. LENIS SMOOTH SCROLL
  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const lenis = new Lenis({
      wrapper: scrollContainerRef.current,
      content: scrollContainerRef.current.firstChild,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => { lenis.destroy(); };
  }, [loading, students]); 

  // 2. SEARCH DEBOUNCE
  useEffect(() => {
    const timer = setTimeout(() => { setDebouncedSearch(searchTerm); }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 3. FETCH DATA
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.branch) params.append('branch', filters.branch);
        if (filters.year) params.append('year', filters.year);
        if (debouncedSearch) params.append('search', debouncedSearch);

        const { data } = await axios.get(`${API_URL}/user/explore?${params.toString()}`, {
          withCredentials: true
        });

        if (data.success) {
          const discoverableUsers = data.users.filter(u => u.friendStatus !== 'accepted' && u.friendStatus !== 'friends');
          setStudents(discoverableUsers);
        }
      } catch (error) {
        console.error("Explore Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [filters, debouncedSearch]); 

  const toggleFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: prev[key] === value ? '' : value }));
  };

  return (
    <div className="h-screen w-full bg-[#F3F2ED] dark:bg-[#050505] flex flex-col overflow-hidden">
      
      <DashboardNavbar user={currentUser} onLogout={logout} />
      
      {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
      {selectedStudent && <StudentProfileModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />}

      <div className="flex flex-1 overflow-hidden pt-20 max-w-[1600px] mx-auto w-full">
        
        {/* DESKTOP SIDEBAR (FIXED) */}
        <aside className="hidden md:block w-64 h-full border-r border-slate-200 dark:border-slate-800 bg-[#F3F2ED] dark:bg-[#050505] p-5 z-20">
           <ExploreSidebar 
             filters={filters} 
             setFilters={setFilters} 
             onClear={() => setFilters({ year: '', branch: '' })} 
           />
        </aside>

        {/* RIGHT CONTENT AREA */}
        <main className="flex-1 flex flex-col min-w-0 h-full relative">
           
           {/* 👇 FIXED HEADER SECTION (Title + Search) */}
           <div className="shrink-0 z-30 bg-[#F3F2ED]/95 dark:bg-[#050505]/95 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50">
              <div className="px-4 md:px-6 pt-5 pb-2">
                  <div className="mb-2">
                    <Breadcrumb items={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Explore', path: '/explore' }]} />
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    Explore GSTians
                  </h1>
              </div>

              <div className="px-4 md:px-6 pb-4">
                  <SearchHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

                  {/* Mobile Filters Row */}
                  <div className="md:hidden mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                      {years.map(y => (
                          <button key={y} onClick={() => toggleFilter('year', y)} 
                            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${filters.year === y ? 'bg-[#1AA3A3] text-white border-[#1AA3A3]' : 'bg-white dark:bg-[#1a1a1a] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'}`}>
                            {y}
                          </button>
                      ))}
                      <div className="w-px bg-slate-300 dark:bg-slate-700 mx-1 h-6 self-center"></div>
                      {branches.map(b => (
                          <button key={b} onClick={() => toggleFilter('branch', b)} 
                            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${filters.branch === b ? 'bg-[#F54A00] text-white border-[#F54A00]' : 'bg-white dark:bg-[#1a1a1a] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'}`}>
                            {b}
                          </button>
                      ))}
                  </div>
              </div>
           </div>

           {/* 👇 SCROLLABLE CARD AREA (Lenis) */}
           <div 
             ref={scrollContainerRef} 
             className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar pb-24"
           >
              {/* Extra wrapper for Lenis */}
              <div>
                {/* Result Count Badge */}
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {students.length} Found
                    </h2>
                    <span className="hidden md:block text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-md">
                      {filters.year || 'All Years'} • {filters.branch || 'All Branches'}
                    </span>
                </div>

                <StudentGrid 
                  loading={loading}
                  students={students}
                  setToast={setToast}
                  onViewProfile={setSelectedStudent}
                />
              </div>
           </div>
        </main>
      </div>
    </div>
  );
};

export default Explore;