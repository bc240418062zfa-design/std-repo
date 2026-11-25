import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Course } from '../types';
import {
  Search,
  BookOpen,
  ChevronRight,
  Filter,
  FileText
} from 'lucide-react';
import {
  ScrollReveal,
  AnimatedCounter,
  SpotlightCard,
  EASE_OUT_EXPO
} from '../components/MotionPrimitives';
import { CelestialPageHeader } from '../components/CelestialBackdrop';

interface CoursesPageProps {
  courses: Course[];
  onSelectCourse: (courseCode: string) => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({ courses, onSelectCourse }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('ALL');

  const faculties = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => {
      if (c.faculty) set.add(c.faculty);
    });
    return ['ALL', ...Array.from(set).sort()];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return courses.filter((c) => {
      const matchesFaculty = selectedFaculty === 'ALL' || c.faculty === selectedFaculty;
      const matchesQuery =
        !q ||
        c.code.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q);
      return matchesFaculty && matchesQuery;
    });
  }, [courses, selectedFaculty, searchQuery]);

  const totalFiles = useMemo(() => {
    return courses.reduce((acc, c) => acc + (c.fileCount || 0), 0);
  }, [courses]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Celestial Observatory Page Header */}
      <CelestialPageHeader
        kickerIcon={<BookOpen className="w-4 h-4" />}
        kickerText="Virtual University Academic Curriculum"
        badgeText="27 Faculties · 411 Accredited Courses"
        title={
          <>
            Virtual University{' '}
            <span className="text-amber-300">
              All 411 Courses Directory
            </span>
          </>
        }
        description="Comprehensive curriculum index of all 411 accredited courses across 27 faculties. Select any course to access verified lecture handouts, Moaaz & Waqar Siddhu solved papers, and 2026 assignment solution templates."
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
          {[
            { val: courses.length, suffix: '', color: 'text-white', label: 'Total VU Courses' },
            { val: totalFiles, suffix: '', color: 'text-amber-300', label: 'Verified Documents' },
            { val: faculties.length - 1, suffix: '', color: 'text-emerald-300', label: 'Academic Faculties' },
            { val: 100, suffix: '% Free', color: 'text-sky-200', label: 'Open Student Access' }
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.34, delay: 0.08 + idx * 0.05, ease: EASE_OUT_EXPO }}
              whileHover={{ y: -2 }}
              className="bg-[#132238] border border-white/10 p-4 rounded-xl"
            >
              <div className={`text-2xl sm:text-3xl font-extrabold font-mono tabular-nums ${stat.color}`}>
                <AnimatedCounter value={stat.val} suffix={stat.suffix} />
              </div>
              <div className="text-xs text-slate-300 font-medium mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </CelestialPageHeader>

      {/* Search and Faculty Filter Bar */}
      <ScrollReveal direction="up" distance={14} className="bg-white border border-[#E5E0D5] rounded-2xl p-4 sm:p-6 space-y-4 shadow-xs">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search CS101, MTH101, MGT101 or title..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#FAF8F4] border border-[#DDD6C8] focus:border-blue-700 focus:outline-none text-sm text-slate-900 font-medium"
            />
          </div>

          {/* Faculty Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-xs font-semibold text-slate-600 flex items-center gap-1 mr-1 select-none">
              <Filter className="w-3.5 h-3.5 text-blue-700" />
              <span>Faculty:</span>
            </span>
            {faculties.map((fac) => {
              const isSelected = selectedFaculty === fac;
              return (
                <motion.button
                  key={fac}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={() => setSelectedFaculty(fac)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-150 cursor-pointer whitespace-nowrap border ${
                    isSelected
                      ? 'bg-[#0D1B2A] border-[#0D1B2A] text-white'
                      : 'bg-[#FAF8F4] hover:bg-[#F3EFE6] border-[#E5E0D5] text-slate-700'
                  }`}
                >
                  {fac === 'ALL' ? 'All Faculties (411)' : fac}
                </motion.button>
              );
            })}
          </div>
      </ScrollReveal>

      {/* Courses Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-600 px-1">
          <span>
            Showing <strong className="text-slate-900 font-mono tabular-nums">{filteredCourses.length}</strong> of <strong className="text-slate-900 font-mono tabular-nums">{courses.length}</strong> courses
          </span>
          {searchQuery && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-blue-700 hover:text-blue-800 font-semibold cursor-pointer"
            >
              Clear search filter
            </motion.button>
          )}
        </div>

        {filteredCourses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-12 text-center bg-white border border-[#E5E0D5] rounded-2xl space-y-3"
          >
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No matching courses found</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              We couldn't find a course matching &ldquo;{searchQuery}&rdquo;. Try searching by course number or select All Faculties.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map((c, idx) => (
              <motion.div
                key={c.code}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 'some' }}
                transition={{
                  duration: 0.28,
                  delay: Math.min((idx % 12) * 0.02, 0.2),
                  ease: EASE_OUT_EXPO
                }}
              >
                <SpotlightCard
                  onClick={() => onSelectCourse(c.code)}
                  className="group h-full p-5 rounded-2xl bg-white border border-[#E5E0D5] hover:border-blue-700 cursor-pointer transition-colors"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-sm font-extrabold px-2.5 py-1 rounded-lg bg-[#F3EFE6] text-[#0D1B2A] border border-[#DDD6C8] group-hover:bg-[#0D1B2A] group-hover:text-amber-300 group-hover:border-[#0D1B2A] transition-colors">
                        {c.code}
                      </span>
                      <span className="text-xs font-mono font-medium text-slate-500 flex items-center gap-1 tabular-nums">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span>{c.fileCount || 0} files</span>
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug">
                      {c.title}
                    </h3>

                    <p className="text-xs text-slate-500 truncate">
                      {c.faculty}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-4 border-t border-[#E5E0D5] text-xs text-slate-500">
                    <span className="text-[11px] font-medium text-slate-500">Direct Download</span>
                    <span className="font-semibold text-blue-700 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      <span>Open Library</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
