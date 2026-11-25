import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Course, Resource } from '../types';
import { getAllMidtermFiles, MidtermItem } from '../utils/midtermSlug';
import { EASE_OUT_EXPO } from '../components/MotionPrimitives';
import {
  Search,
  FileText,
  Download,
  BookOpen,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Layers,
  GraduationCap,
  Calculator,
  ShieldCheck,
  Flame,
  ListChecks
} from 'lucide-react';

interface MidtermHubPageProps {
  courses: Course[];
  onOpenMidtermFile: (filename: string) => void;
  onDownloadMidtermFile: (item: MidtermItem) => void;
  onSelectCourse: (courseCode: string) => void;
  onNavigate: (page: string) => void;
}

export const MidtermHubPage: React.FC<MidtermHubPageProps> = ({
  courses,
  onOpenMidtermFile,
  onDownloadMidtermFile,
  onSelectCourse,
  onNavigate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'ALL' | 'OBJECTIVE' | 'SUBJECTIVE'>('ALL');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('ALL');

  const allFiles = useMemo(() => getAllMidtermFiles(), []);

  // Group by Course Code
  const groupedCourses = useMemo(() => {
    const map = new Map<string, { objective?: MidtermItem; subjective?: MidtermItem; course?: Course }>();

    for (const file of allFiles) {
      const code = file.courseCode.toUpperCase();
      if (!map.has(code)) {
        const foundCourse = courses.find((c) => c.code.toUpperCase() === code);
        map.set(code, { course: foundCourse });
      }
      const entry = map.get(code)!;
      if (file.type === 'OBJECTIVE') entry.objective = file;
      else entry.subjective = file;
    }

    return Array.from(map.entries()).map(([code, data]) => ({
      code,
      courseTitle: data.course?.title || `${code} Examination Prep`,
      faculty: data.course?.faculty || 'General Degree Program',
      objective: data.objective,
      subjective: data.subjective
    }));
  }, [allFiles, courses]);

  // Filtered list
  const filteredList = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return allFiles.filter((item) => {
      // Type match
      if (selectedType !== 'ALL' && item.type !== selectedType) return false;

      // Query match
      if (q) {
        const matchCode = item.courseCode.toLowerCase().includes(q);
        const matchName = item.filename.toLowerCase().includes(q);
        const matchTitle = item.title.toLowerCase().includes(q);
        if (!matchCode && !matchName && !matchTitle) return false;
      }

      return true;
    });
  }, [allFiles, searchQuery, selectedType]);

  const objectiveCount = useMemo(() => allFiles.filter((f) => f.type === 'OBJECTIVE').length, [allFiles]);
  const subjectiveCount = useMemo(() => allFiles.filter((f) => f.type === 'SUBJECTIVE').length, [allFiles]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Bar */}
        <nav aria-label="Breadcrumb" className="text-xs text-slate-400 mb-6 flex items-center gap-2">
          <button
            onClick={() => onNavigate('home')}
            className="hover:text-cyan-400 transition-colors cursor-pointer"
          >
            Library Home
          </button>
          <span>/</span>
          <span className="text-slate-200 font-semibold">Midterm Sprint 2026</span>
        </nav>

        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-900/50 to-slate-950 p-6 sm:p-10 mb-8 backdrop-blur-xl">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl">
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 mb-2">
              Virtual University of Pakistan · Semester Examination Hub
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4">
              VU Midterm Exam Sprint 2026
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-6 max-w-3xl">
              Access all <span className="font-bold text-cyan-300 font-mono">664 verified</span> Midterm
              preparation archives across 332 VU subjects. Covering Lectures 1 to 22 with comprehensive objective
              MCQ question banks, solved 2/3/5-mark subjective papers, and 20% passing threshold roadmaps.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/70">
                <div className="text-xs text-slate-400">Total Archives</div>
                <div className="text-xl font-bold font-mono text-white">664 Files</div>
              </div>
              <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/70">
                <div className="text-xs text-slate-400">Objective (MCQs)</div>
                <div className="text-xl font-bold font-mono text-cyan-400">332 Sets</div>
              </div>
              <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/70">
                <div className="text-xs text-slate-400">Subjective Solved</div>
                <div className="text-xl font-bold font-mono text-amber-400">332 Sets</div>
              </div>
              <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/70">
                <div className="text-xs text-slate-400">Syllabus Scope</div>
                <div className="text-xl font-bold font-mono text-emerald-400">Lectures 1–22</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            {/* Live Search Input */}
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search CS201, MGT101, ENG201..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Type Segmented Filter (Functional Buttons with Click Handlers) */}
            <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl shrink-0">
              <button
                onClick={() => setSelectedType('ALL')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  selectedType === 'ALL'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All (664)
              </button>
              <button
                onClick={() => setSelectedType('OBJECTIVE')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  selectedType === 'OBJECTIVE'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                MCQs ({objectiveCount})
              </button>
              <button
                onClick={() => setSelectedType('SUBJECTIVE')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  selectedType === 'SUBJECTIVE'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Subjective ({subjectiveCount})
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-400 flex items-center justify-between">
            <div>
              Showing <span className="font-mono font-bold text-slate-200">{filteredList.length}</span> matching files
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate('simulator')}
                className="text-cyan-400 hover:underline flex items-center gap-1"
              >
                <Calculator className="w-3.5 h-3.5" /> Passing Marks Calculator
              </button>
              <button
                onClick={() => onNavigate('courses')}
                className="text-cyan-400 hover:underline flex items-center gap-1"
              >
                <BookOpen className="w-3.5 h-3.5" /> All Course Handouts
              </button>
            </div>
          </div>
        </div>

        {/* Files Grid */}
        {filteredList.length === 0 ? (
          <div className="text-center py-16 px-4 border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-200 mb-1">No Midterm Files Found</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto mb-4">
              We couldn't find any midterm files matching "{searchQuery}". Try searching for course codes like CS101, MGT501, or ENG101.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('ALL');
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-white transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredList.map((item) => {
              const isMcq = item.type === 'OBJECTIVE';
              return (
                <div
                  key={item.filename}
                  className="group relative rounded-xl border border-slate-800 bg-slate-900/70 hover:bg-slate-900 hover:border-slate-700 p-5 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Metadata Line */}
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span className="font-mono font-bold text-cyan-400">{item.courseCode}</span>
                      <span>·</span>
                      <span className={isMcq ? 'text-cyan-300 font-semibold' : 'text-amber-300 font-semibold'}>
                        {isMcq ? 'Important MCQs' : 'Solved Subjective'}
                      </span>
                      <span>·</span>
                      <span>~{item.estimatedPages} Pages</span>
                    </div>

                    {/* File Title */}
                    <h3 className="text-base font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h3>

                    {/* Filename subtext */}
                    <p className="text-xs font-mono text-slate-400 mb-4 truncate" title={item.filename}>
                      {item.filename}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onOpenMidtermFile(item.filename)}
                      className="flex-1 py-2 px-3 bg-cyan-500/10 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      Read Online
                    </button>

                    <button
                      onClick={() => onDownloadMidtermFile(item)}
                      title="Download PDF"
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onSelectCourse(item.courseCode)}
                      title={`View all ${item.courseCode} archives`}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-cyan-300 rounded-lg transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 20% Passing Rule Advisory Banner */}
        <div className="mt-12 p-6 rounded-2xl border border-blue-900/60 bg-blue-950/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wide mb-1">
                Virtual University Examination Regulations
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                Need to Calculate Your Midterm Passing Score?
              </h3>
              <p className="text-sm text-slate-300 max-w-2xl">
                Under VU's mandatory 20% Two-Half Rule, you must obtain a minimum percentage in your semester evaluations to be eligible for final passing status.
              </p>
            </div>
            <button
              onClick={() => onNavigate('simulator')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg transition-colors shrink-0"
            >
              Open 20% Passing Simulator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
