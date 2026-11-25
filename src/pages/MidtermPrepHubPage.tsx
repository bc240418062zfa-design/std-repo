import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  Search,
  BookOpen,
  ListChecks,
  FileText,
  ArrowRight,
  X,
  Filter,
  GraduationCap,
  ChevronRight
} from 'lucide-react';
import {
  getAllMidtermPrepEntries,
  getMidtermCoursesGrouped
} from '../utils/midtermPrep';
import { CelestialPageHeader } from '../components/CelestialBackdrop';
import {
  AnimatedCounter,
  ScrollReveal,
  EASE_OUT_EXPO
} from '../components/MotionPrimitives';

interface MidtermPrepHubPageProps {
  onOpenMidtermDoc: (filename: string) => void;
  onSelectCourse: (courseCode: string) => void;
}

type TrackFilter = 'all' | 'mcqs' | 'subjective';

export const MidtermPrepHubPage: React.FC<MidtermPrepHubPageProps> = ({
  onOpenMidtermDoc,
  onSelectCourse
}) => {
  const allEntries = useMemo(() => getAllMidtermPrepEntries(), []);
  const groupedCourses = useMemo(() => getMidtermCoursesGrouped(), []);

  const [searchQuery, setSearchQuery] = useState('');
  const [trackFilter, setTrackFilter] = useState<TrackFilter>('all');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('ALL');
  const [selectedPrefix, setSelectedPrefix] = useState<string>('ALL');
  const [visibleLimit, setVisibleLimit] = useState<number>(48);

  const stats = useMemo(() => {
    let totalQuestions = 0;
    let totalPages = 0;
    let mcqsFiles = 0;
    let subjectiveFiles = 0;

    for (const item of allEntries) {
      totalQuestions += item.itemCount;
      totalPages += item.pageCount;
      if (item.kind === 'mcqs') mcqsFiles++;
      else subjectiveFiles++;
    }

    return {
      totalCourses: groupedCourses.length,
      totalFiles: allEntries.length,
      mcqsFiles,
      subjectiveFiles,
      totalQuestions,
      totalPages
    };
  }, [allEntries, groupedCourses]);

  const faculties = useMemo(() => {
    const set = new Set<string>();
    for (const c of groupedCourses) {
      if (c.faculty) set.add(c.faculty);
    }
    return ['ALL', ...Array.from(set).sort()];
  }, [groupedCourses]);

  const prefixes = useMemo(() => {
    const set = new Set<string>();
    for (const c of groupedCourses) {
      const p = c.courseCode.replace(/\d+.*$/, '').toUpperCase();
      if (p) set.add(p);
    }
    return ['ALL', ...Array.from(set).sort()];
  }, [groupedCourses]);

  const filteredCourses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return groupedCourses.filter((course) => {
      if (selectedFaculty !== 'ALL' && course.faculty !== selectedFaculty) return false;
      if (selectedPrefix !== 'ALL') {
        const prefix = course.courseCode.replace(/\d+.*$/, '').toUpperCase();
        if (prefix !== selectedPrefix) return false;
      }
      if (trackFilter === 'mcqs' && !course.mcqsEntry) return false;
      if (trackFilter === 'subjective' && !course.subjectiveEntry) return false;

      if (!q) return true;
      return (
        course.courseCode.toLowerCase().includes(q) ||
        course.courseTitle.toLowerCase().includes(q) ||
        course.faculty.toLowerCase().includes(q) ||
        course.topics.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [groupedCourses, searchQuery, selectedFaculty, selectedPrefix, trackFilter]);

  const visibleCourses = useMemo(() => {
    if (searchQuery.trim() || selectedFaculty !== 'ALL' || selectedPrefix !== 'ALL') {
      return filteredCourses;
    }
    return filteredCourses.slice(0, visibleLimit);
  }, [filteredCourses, searchQuery, selectedFaculty, selectedPrefix, visibleLimit]);

  const quickCourses = ['CS101', 'CS201', 'CS301', 'CS304', 'CS403', 'ENG101', 'ENG201', 'MGT101', 'MTH101', 'PAK301'];

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    trackFilter !== 'all' ||
    selectedFaculty !== 'ALL' ||
    selectedPrefix !== 'ALL';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Dark Architectural Observatory Header */}
      <CelestialPageHeader
        kickerIcon={<GraduationCap className="w-4 h-4" />}
        kickerText="Midterm Prep 2026 · Complete Question Banks & Transcripts"
        badgeText={`${stats.totalCourses} Courses · ${stats.totalFiles} Special Packs`}
        title={
          <>
            VU Midterm Prep 2026{' '}
            <span className="text-amber-300">
              Complete MCQs &amp; Subjective Hub
            </span>
          </>
        }
        description="Read complete solved Midterm Important MCQs (verified answer keys) and Solved Subjective Q&As directly on-page across 332 Virtual University courses — organized by lecture topic for rapid exam preparation."
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
          {[
            { val: stats.totalCourses, suffix: '', color: 'text-white', label: 'Midterm Courses' },
            { val: stats.totalFiles, suffix: '', color: 'text-amber-300', label: 'Special Prep Packs' },
            { val: stats.totalQuestions, suffix: '+', color: 'text-sky-200', label: 'Extracted Q&As' },
            { val: stats.totalPages, suffix: '', color: 'text-emerald-300', label: 'Pages Transcribed' }
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.34, delay: 0.06 + idx * 0.05, ease: EASE_OUT_EXPO }}
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

      {/* Search & Filter Command Bar */}
      <ScrollReveal
        direction="up"
        distance={14}
        className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xs"
      >
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search course code, subject name, or exam topic (e.g. ACC311, CS201, Auditing, OOP)..."
              className="w-full pl-11 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-700 focus:outline-none text-sm text-slate-900 font-medium transition-colors"
              aria-label="Search Midterm Prep 2026 courses and topics"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Track Switcher */}
          <div
            className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/90 shrink-0"
            role="tablist"
            aria-label="Filter by preparation track"
          >
            {[
              { id: 'all' as TrackFilter, label: `All (${stats.totalCourses})` },
              { id: 'mcqs' as TrackFilter, label: `MCQs (${stats.mcqsFiles})` },
              { id: 'subjective' as TrackFilter, label: `Subjective (${stats.subjectiveFiles})` }
            ].map((tab) => {
              const active = trackFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTrackFilter(tab.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap tabular-nums ${
                    active
                      ? 'bg-[#0B1526] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Department / Prefix & Faculty Filter Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-600 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5 text-blue-700" />
              <span>Code Prefix:</span>
            </span>
            <select
              value={selectedPrefix}
              onChange={(e) => setSelectedPrefix(e.target.value)}
              className="h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:border-blue-700 focus:outline-none cursor-pointer"
              aria-label="Filter by course code prefix"
            >
              {prefixes.map((p) => (
                <option key={p} value={p}>
                  {p === 'ALL' ? `All Departments (${prefixes.length - 1})` : `${p} Courses`}
                </option>
              ))}
            </select>

            <select
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              className="h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:border-blue-700 focus:outline-none cursor-pointer max-w-[240px]"
              aria-label="Filter by faculty"
            >
              {faculties.map((f) => (
                <option key={f} value={f}>
                  {f === 'ALL' ? 'All Faculties' : f}
                </option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setTrackFilter('all');
                  setSelectedFaculty('ALL');
                  setSelectedPrefix('ALL');
                }}
                className="h-9 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold cursor-pointer transition-colors"
              >
                Reset
              </button>
            )}
          </div>

          {/* Popular Course Quick Jump */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            <span className="text-slate-500 font-medium">Popular:</span>
            {quickCourses.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setSearchQuery(code)}
                className="font-mono font-bold text-blue-700 hover:text-blue-900 hover:underline cursor-pointer"
              >
                {code}
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Results Summary Bar */}
      <div className="flex items-center justify-between text-xs text-slate-600 px-1">
        <span className="tabular-nums">
          Showing <strong className="text-slate-950 font-mono">{visibleCourses.length}</strong> of{' '}
          <strong className="text-slate-950 font-mono">{filteredCourses.length}</strong> subjects
        </span>
        <span className="font-mono text-[11px] text-slate-500">
          Direct Full-Text Question Banks · Zero Login Required
        </span>
      </div>

      {/* Course Cards Directory */}
      {visibleCourses.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
          <h2 className="text-base font-bold text-slate-900">
            No midterm prep packs matched &ldquo;{searchQuery}&rdquo;
          </h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Try searching by exact course code (e.g. ACC311, CS101, MTH101, ZOO516) or clear filters to browse all {stats.totalCourses} courses.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleCourses.map((course) => (
            <article
              key={course.courseCode}
              className="celestial-top-glint card-celestial rounded-2xl border border-slate-200/90 p-5 flex flex-col justify-between gap-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-mono text-sm font-extrabold text-[#050B18] tracking-tight">
                    {course.courseCode}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 truncate max-w-[68%] text-right">
                    {course.faculty}
                  </span>
                </div>

                <h2 className="text-base font-bold text-slate-950 leading-snug">
                  {course.courseTitle}
                </h2>

                {course.topics.length > 0 && (
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {course.topics.slice(0, 3).join(' · ')}
                  </p>
                )}
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-100">
                {course.mcqsEntry && (trackFilter === 'all' || trackFilter === 'mcqs') && (
                  <a
                    href={`/midterm-prep/${course.mcqsEntry.filename}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onOpenMidtermDoc(course.mcqsEntry!.filename);
                    }}
                    className="group flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/90 hover:border-blue-300 transition-colors"
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <ListChecks className="w-4 h-4 text-blue-700 shrink-0" />
                      <span className="text-xs font-bold text-slate-900 group-hover:text-blue-800 truncate">
                        Midterm Important MCQs
                      </span>
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-mono font-semibold text-blue-700 shrink-0 tabular-nums">
                      <span>{course.mcqsEntry.itemCount} Qs</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
                    </span>
                  </a>
                )}

                {course.subjectiveEntry && (trackFilter === 'all' || trackFilter === 'subjective') && (
                  <a
                    href={`/midterm-prep/${course.subjectiveEntry.filename}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onOpenMidtermDoc(course.subjectiveEntry!.filename);
                    }}
                    className="group flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-amber-50/70 border border-slate-200/90 hover:border-amber-300 transition-colors"
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-amber-700 shrink-0" />
                      <span className="text-xs font-bold text-slate-900 group-hover:text-amber-900 truncate">
                        Midterm Subjective (Solved)
                      </span>
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-mono font-semibold text-amber-800 shrink-0 tabular-nums">
                      <span>{course.subjectiveEntry.itemCount} Q&amp;As</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
                    </span>
                  </a>
                )}

                <div className="pt-1 flex items-center justify-end">
                  <a
                    href={`/courses/${course.courseCode.toLowerCase()}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectCourse(course.courseCode);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-blue-700 transition-colors"
                  >
                    <span>All {course.courseCode} Course Files</span>
                    <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Load More / Show All Button */}
      {!hasActiveFilters && visibleCourses.length < filteredCourses.length && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            type="button"
            onClick={() => setVisibleLimit((prev) => prev + 60)}
            className="px-6 py-2.5 rounded-xl bg-[#0B1526] hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer shadow-xs"
          >
            Load More Subjects ({filteredCourses.length - visibleCourses.length} remaining)
          </button>
          <button
            type="button"
            onClick={() => setVisibleLimit(filteredCourses.length)}
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            Show All {filteredCourses.length} Subjects
          </button>
        </div>
      )}
    </div>
  );
};
