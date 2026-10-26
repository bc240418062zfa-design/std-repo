import React, { useState, useMemo } from 'react';
import { Course } from '../types';
import { 
  GraduationCap, 
  Search, 
  BookOpen, 
  ChevronRight, 
  Filter, 
  ArrowRight,
  Layers,
  FileText
} from 'lucide-react';

interface CoursesPageProps {
  courses: Course[];
  onSelectCourse: (courseCode: string) => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({ courses, onSelectCourse }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('ALL');

  // Compute distinct faculties
  const faculties = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => {
      if (c.faculty) set.add(c.faculty);
    });
    return ['ALL', ...Array.from(set).sort()];
  }, [courses]);

  // Filter courses
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

  // Aggregate stats
  const totalFiles = useMemo(() => {
    return courses.reduce((acc, c) => acc + (c.fileCount || 0), 0);
  }, [courses]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/70 text-blue-700 text-xs font-semibold">
          <GraduationCap className="w-4 h-4 text-blue-600" />
          <span>VIRTUAL UNIVERSITY ACADEMIC CURRICULUM</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight" style={{ textWrap: 'balance' }}>
          Virtual University All 411 Courses Directory
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Comprehensive curriculum index of all 411 accredited courses across 27 faculties. Select any course to access verified lecture handouts, Moaaz &amp; Waqar Siddhu solved papers, and 2026 assignment solution templates.
        </p>
      </div>

      {/* Elevated Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-sm transition-all">
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">{courses.length}</div>
          <div className="text-xs text-slate-500 font-medium mt-1">Total VU Courses</div>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-sm transition-all">
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 font-mono tabular-nums">{totalFiles.toLocaleString()}</div>
          <div className="text-xs text-slate-500 font-medium mt-1">Verified Documents</div>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-sm transition-all">
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono tabular-nums">{faculties.length - 1}</div>
          <div className="text-xs text-slate-500 font-medium mt-1">Academic Faculties</div>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-sm transition-all">
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 font-mono tabular-nums">100% Free</div>
          <div className="text-xs text-slate-500 font-medium mt-1">Open Student Access</div>
        </div>
      </div>

      {/* Search and Faculty Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by course code (e.g. CS101, MTH101, MGT101) or title..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/70 focus:bg-white transition-all font-medium"
          />
        </div>

        {/* Faculty Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mr-1 select-none">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Faculty:</span>
          </span>
          {faculties.map((fac) => {
            const isSelected = selectedFaculty === fac;
            return (
              <button
                key={fac}
                type="button"
                onClick={() => setSelectedFaculty(fac)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100/80 hover:bg-slate-200/80 text-slate-700'
                }`}
              >
                {fac === 'ALL' ? 'All Faculties (411)' : fac}
              </button>
            );
          })}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            Showing <strong className="text-slate-800 font-mono tabular-nums">{filteredCourses.length}</strong> of <strong className="text-slate-800 font-mono tabular-nums">{courses.length}</strong> courses
          </span>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
            >
              Clear search filter
            </button>
          )}
        </div>

        {filteredCourses.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/90 space-y-3 shadow-xs">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No matching courses found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find a course matching &ldquo;{searchQuery}&rdquo;. Try searching by course number or select All Faculties.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map((c) => (
              <div
                key={c.code}
                onClick={() => onSelectCourse(c.code)}
                className="group p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-sm font-extrabold px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 border border-blue-200/70 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {c.code}
                    </span>
                    <span className="text-xs font-mono font-medium text-slate-500 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>{c.fileCount || 0} files</span>
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                    {c.title}
                  </h3>

                  <p className="text-xs text-slate-500 truncate">
                    {c.faculty}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
                  <span className="text-[11px] font-medium text-slate-400">Direct Download</span>
                  <span className="font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    <span>Open Library</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
