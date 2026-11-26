import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Course } from '../types';
import { Search, X, ChevronRight, GraduationCap } from 'lucide-react';
import { EASE_OUT_EXPO } from './MotionPrimitives';

interface CoursesBrowserProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  onSelectCourse: (courseCode: string) => void;
}

export const CoursesBrowser: React.FC<CoursesBrowserProps> = ({
  isOpen,
  onClose,
  courses,
  onSelectCourse
}) => {
  const [courseSearch, setCourseSearch] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('ALL');

  // Distinct faculties
  const faculties = useMemo(() => {
    const set = new Set<string>();
    courses.forEach(c => set.add(c.faculty));
    return ['ALL', ...Array.from(set)];
  }, [courses]);

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      const matchesFaculty = selectedFaculty === 'ALL' || c.faculty === selectedFaculty;
      const matchesQuery =
        !courseSearch ||
        c.code.toLowerCase().includes(courseSearch.toLowerCase()) ||
        c.title.toLowerCase().includes(courseSearch.toLowerCase());
      return matchesFaculty && matchesQuery;
    });
  }, [courses, selectedFaculty, courseSearch]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="course-browser-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.24, ease: EASE_OUT_EXPO }}
            className="w-full max-w-4xl bg-[#FAF8F4] rounded-2xl shadow-2xl border border-[#DDD6C8] flex flex-col max-h-[85vh] overflow-hidden"
          >
            {/* Modal Header */}
            <div className="relative p-4 sm:p-6 bg-[#0D1B2A] text-white border-b border-white/10 flex items-center justify-between gap-4">
              <div className="relative z-10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#132238] border border-white/15 flex items-center justify-center text-amber-300">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h2 id="course-browser-title" className="text-lg sm:text-xl font-bold text-white leading-tight">
                    Curated Course Directory
                  </h2>
                  <p className="text-xs text-slate-300">
                    Browse through all {courses.length}+ Virtual University course resource catalogues
                  </p>
                </div>
              </div>

              <motion.button
                type="button"
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.92 }}
                transition={{ duration: 0.18 }}
                onClick={onClose}
                className="relative z-10 text-slate-300 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-colors cursor-pointer"
                aria-label="Close course directory"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Search & Faculty Tabs */}
            <div className="p-4 bg-white border-b border-[#E5E0D5] space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                  placeholder="Search CS302, Digital Logic, Calculus..."
                  className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-[#FAF8F4] border border-[#DDD6C8] focus:border-blue-700 focus:outline-none rounded-xl text-slate-900 placeholder-slate-400"
                />
              </div>

              {/* Faculty Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                {faculties.map((fac) => {
                  const isActive = selectedFaculty === fac;
                  return (
                    <motion.button
                      key={fac}
                      type="button"
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setSelectedFaculty(fac)}
                      className={`relative px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer border ${
                        isActive
                          ? 'bg-[#0D1B2A] border-[#0D1B2A] text-white'
                          : 'bg-[#FAF8F4] border-[#E5E0D5] text-slate-700 hover:border-slate-400'
                      }`}
                    >
                      <span>{fac}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Course Grid */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FAF8F4] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredCourses.length === 0 ? (
                <div className="col-span-full py-12 text-center text-slate-500 text-sm">
                  No courses matching your filter.
                </div>
              ) : (
                filteredCourses.map((c) => (
                  <motion.button
                    key={c.code}
                    type="button"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.16, ease: EASE_OUT_EXPO }}
                    onClick={() => {
                      onSelectCourse(c.code);
                      onClose();
                    }}
                    className="text-left bg-white border border-[#E5E0D5] hover:border-blue-700 rounded-xl p-3.5 group flex flex-col justify-between gap-2 cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="font-mono font-bold text-xs px-2 py-0.5 rounded-md bg-[#F3EFE6] text-[#0D1B2A] border border-[#DDD6C8] group-hover:bg-blue-700 group-hover:text-white group-hover:border-blue-700 transition-colors">
                          {c.code}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium truncate">
                          {c.faculty}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-blue-700 line-clamp-2 transition-colors">
                        {c.title}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-[#E5E0D5]">
                      <span>{c.fileCount ? `${c.fileCount} files available` : 'Explore files'}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </motion.button>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-white border-t border-[#E5E0D5] text-center text-xs text-slate-500">
              Click any course to load its dedicated resource archive.
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
