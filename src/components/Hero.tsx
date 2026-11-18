import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  X,
  BookOpen,
  ArrowRight,
  CornerDownLeft,
  ListChecks,
  Files,
  Calculator
} from 'lucide-react';
import { Course } from '../types';

interface HeroProps {
  query: string;
  onQueryChange: (val: string) => void;
  onSearchSubmit?: () => void;
  onCategoryClick: (category: string) => void;
  onCourseClick: (course: string) => void;
  totalResources: number;
  totalCourses: number;
  courses?: Course[];
  onOpenMcqs?: () => void;
  onOpenPastPapers?: () => void;
  onOpenSimulator?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  query,
  onQueryChange,
  onSearchSubmit,
  onCategoryClick,
  onCourseClick,
  totalResources,
  totalCourses,
  courses = [],
  onOpenMcqs,
  onOpenPastPapers,
  onOpenSimulator
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdK = (e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K');
      const isSlash = e.key === '/' && document.activeElement !== inputRef.current;

      if (isCmdK || isSlash) {
        e.preventDefault();
        inputRef.current?.focus();
        setShowSuggestions(true);
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const matchingCourses = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || courses.length === 0) return [];

    return courses
      .filter((c) => c.code.toLowerCase().includes(q) || c.title.toLowerCase().includes(q))
      .slice(0, 4);
  }, [query, courses]);

  const quickSuggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return [
      { label: `Search solved papers for "${query}"`, value: `${query} solved` },
      { label: `Search midterm papers for "${query}"`, value: `${query} midterm` },
      { label: `Search final term papers for "${query}"`, value: `${query} finalterm` },
      { label: `Search handouts for "${query}"`, value: `${query} handout` }
    ];
  }, [query]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearchSubmit?.();
  };

  const handleSelectCourseSuggestion = (courseCode: string) => {
    setShowSuggestions(false);
    onCourseClick(courseCode);
  };

  const handleSelectQuerySuggestion = (val: string) => {
    onQueryChange(val);
    setShowSuggestions(false);
    onSearchSubmit?.();
  };

  const quickCollections = [
    { label: 'Assignments 2026', query: 'assignment' },
    { label: 'Moaaz Papers', query: 'moaaz' },
    { label: 'Waqar Siddhu', query: 'waqar' },
    { label: 'Midterms', query: 'midterm' },
    { label: 'Final Term', query: 'finalterm' },
    { label: 'Handouts', query: 'handout' }
  ];

  const popularCourses = ['CS101', 'CS201', 'CS301', 'CS304', 'CS403', 'CS504', 'CS601', 'MTH101'];

  const hasSuggestions = showSuggestions && (matchingCourses.length > 0 || quickSuggestions.length > 0);

  return (
    <section className="relative overflow-hidden bg-studio-stage text-white pt-12 pb-16 sm:pt-16 sm:pb-20 border-b border-slate-800/80">
      {/* Subtle architectural perspective grid */}
      <div className="absolute inset-0 bg-academic-grid opacity-55 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-9">
        {/* Hero Headline & Staggered Entrance */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-4"
        >
          <p className="text-xs sm:text-sm font-mono text-sky-300 tracking-wide tabular-nums">
            Virtual University Academic Studio · {totalCourses} Courses · {totalResources.toLocaleString()} Verified Documents
          </p>

          <h1
            className="text-3xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-white leading-[1.08] max-w-4xl mx-auto"
            style={{ textWrap: 'balance' }}
          >
            Solved Past Papers, Handouts &amp;{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-200 to-amber-300">
              Interactive Exam Practice
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Instant downloads for Virtual University solved papers (Moaaz &amp; Waqar Siddhu), official handouts, 2026 assignment guides, and interactive subject MCQ quizzes.
          </p>
        </motion.div>

        {/* Spotlight Command Search Bar */}
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto relative"
        >
          <div className="bg-white rounded-2xl border border-white/20 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.65)] overflow-hidden transition-all focus-within:ring-2 focus-within:ring-sky-400">
            <form
              onSubmit={handleFormSubmit}
              className="flex items-center p-1.5 sm:p-2 gap-2"
            >
              <div className="pl-3.5 text-slate-400 shrink-0" aria-hidden="true">
                <Search className="w-5 h-5" />
              </div>

              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  onQueryChange(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search course code or topic (e.g. CS201 midterm, handouts, Moaaz)..."
                className="w-full py-2.5 px-1 text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent font-medium"
                aria-label="Search academic study resources"
              />

              <div className="flex items-center gap-1.5 shrink-0">
                {query ? (
                  <button
                    type="button"
                    onClick={() => {
                      onQueryChange('');
                      inputRef.current?.focus();
                    }}
                    className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : (
                  <kbd className="hidden sm:inline-block px-2.5 py-1 text-[11px] font-mono bg-slate-100 border border-slate-200 rounded-md text-slate-500 select-none">
                    /
                  </kbd>
                )}

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap shadow-xs"
                >
                  <span>Search</span>
                  <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
                </motion.button>
              </div>
            </form>

            <AnimatePresence>
              {hasSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="border-t border-slate-200 p-3 sm:p-4 bg-slate-50 space-y-3 text-left"
                >
                  {matchingCourses.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between px-1 text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500">
                        <span>Matching Courses ({matchingCourses.length})</span>
                        <button
                          type="button"
                          onClick={() => setShowSuggestions(false)}
                          className="text-[11px] text-slate-400 hover:text-slate-700 cursor-pointer"
                        >
                          ESC to close
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {matchingCourses.map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => handleSelectCourseSuggestion(c.code)}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-colors text-left cursor-pointer"
                          >
                            <div className="min-w-0 pr-2">
                              <div className="font-mono text-xs font-bold text-blue-700">
                                {c.code}
                              </div>
                              <p className="text-xs text-slate-700 truncate mt-0.5">
                                {c.title}
                              </p>
                            </div>
                            <span className="text-[11px] font-mono text-slate-400 shrink-0 tabular-nums">
                              {c.fileCount || 0} files
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {quickSuggestions.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-200">
                      <div className="px-1 text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500">
                        Quick Filters
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {quickSuggestions.map((s, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectQuerySuggestion(s.value)}
                            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-700 hover:text-slate-950 bg-white hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer text-left"
                          >
                            <span className="flex items-center gap-2 truncate">
                              <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{s.label}</span>
                            </span>
                            <CornerDownLeft className="w-3 h-3 text-slate-400 shrink-0 ml-1" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Quick Filter Row & Popular Course Shortcuts */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto space-y-4 text-center"
        >
          <div className="flex flex-wrap items-center justify-center gap-2">
            {quickCollections.map((cat) => (
              <motion.button
                key={cat.label}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => onCategoryClick(cat.query)}
                className="inline-flex items-center px-3.5 py-2 text-xs font-medium rounded-xl glass-panel-dark hover:bg-slate-800/90 text-slate-200 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                {cat.label}
              </motion.button>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
            <span className="text-slate-500">Quick courses:</span>
            {popularCourses.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onCourseClick(c)}
                className="font-mono font-semibold text-slate-300 hover:text-sky-300 transition-colors cursor-pointer"
              >
                {c}
              </button>
            ))}
          </div>
        </motion.div>

        {/* 3 Architectural Bento Feature Launch Cards */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1"
        >
          {onOpenMcqs && (
            <motion.button
              type="button"
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.99 }}
              onClick={onOpenMcqs}
              className="group glass-panel-dark rounded-2xl p-5 text-left transition-colors hover:border-sky-400/50 cursor-pointer flex flex-col justify-between gap-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-sky-300">
                  <ListChecks className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono text-amber-300 tabular-nums">
                  465 Verified MCQs
                </span>
              </div>
              <div className="space-y-1">
                <h2 className="text-base font-bold text-white group-hover:text-sky-200 transition-colors">
                  Interactive MCQ Studio
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Practice CS201, CS301, CS304, CS403, CS504 &amp; CS601 with shareable subject links, timed mock tests, and instant feedback.
                </p>
              </div>
              <div className="text-xs font-semibold text-sky-300 group-hover:text-white inline-flex items-center gap-1.5">
                <span>Launch MCQ Studio</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </motion.button>
          )}

          {onOpenPastPapers && (
            <motion.button
              type="button"
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.99 }}
              onClick={onOpenPastPapers}
              className="group glass-panel-dark rounded-2xl p-5 text-left transition-colors hover:border-indigo-400/50 cursor-pointer flex flex-col justify-between gap-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
                  <Files className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono text-slate-300 tabular-nums">
                  Moaaz &amp; Waqar
                </span>
              </div>
              <div className="space-y-1">
                <h2 className="text-base font-bold text-white group-hover:text-indigo-200 transition-colors">
                  Solved Past Paper Bank
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Explore verified Mid-Term &amp; Final-Term solved papers, repeated subjective questions, and exam notes across 411 courses.
                </p>
              </div>
              <div className="text-xs font-semibold text-indigo-300 group-hover:text-white inline-flex items-center gap-1.5">
                <span>Browse Past Papers</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </motion.button>
          )}

          {onOpenSimulator && (
            <motion.button
              type="button"
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.99 }}
              onClick={onOpenSimulator}
              className="group glass-panel-dark rounded-2xl p-5 text-left transition-colors hover:border-teal-400/50 cursor-pointer flex flex-col justify-between gap-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
                  <Calculator className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono text-teal-300 tabular-nums">
                  20% Two-Half Rule
                </span>
              </div>
              <div className="space-y-1">
                <h2 className="text-base font-bold text-white group-hover:text-teal-200 transition-colors">
                  Passing Marks Simulator
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Calculate exact Final-Term scores required under the official VU 20% rule and forecast your semester GPA.
                </p>
              </div>
              <div className="text-xs font-semibold text-teal-300 group-hover:text-white inline-flex items-center gap-1.5">
                <span>Open Calculator</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </motion.button>
          )}
        </motion.div>
      </div>
    </section>
  );
};
