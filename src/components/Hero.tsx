import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import {
  Search,
  X,
  BookOpen,
  ArrowRight,
  CornerDownLeft,
  ListChecks,
  Files,
  Calculator,
  Flame
} from 'lucide-react';
import { Course } from '../types';
import { mcqSets } from '../data/mcqs';
import { subjectiveSets } from '../data/subjective';
import {
  AnimatedButton,
  AnimatedCounter,
  SpotlightCard,
  CourseMarquee,
  EASE_OUT_EXPO
} from './MotionPrimitives';
import { CelestialStarfield, CelestialOrbitalRings } from './CelestialBackdrop';

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
  onOpenSubjective?: () => void;
  onOpenPastPapers?: () => void;
  onOpenSimulator?: () => void;
}

const ROTATING_HINTS = [
  'Search course code or topic (e.g. CS201 midterm, handouts, Moaaz)...',
  'Try "CS301 Data Structures" or "Waqar Siddhu finalterm"...',
  'Try "MTH101 handouts", "CS403 solved", or "ENG201"...',
  'Press "/" anytime to jump straight to instant search...'
];

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
  onOpenSubjective,
  onOpenPastPapers,
  onOpenSimulator
}) => {
  const totalMcqQuestions = useMemo(
    () => mcqSets.reduce((sum, s) => sum + s.questions.length, 0),
    []
  );
  const totalSubjectiveQuestions = useMemo(
    () => subjectiveSets.reduce((sum, s) => sum + s.questions.length, 0),
    []
  );
  const sectionRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start']
  });

  const bgGridY = useTransform(scrollYProgress, [0, 1], [0, 64]);
  const orbLeftY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const orbRightY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 28]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.92], [1, 0.85]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHintIndex((prev) => (prev + 1) % ROTATING_HINTS.length);
    }, 4200);
    return () => clearInterval(interval);
  }, []);

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

  const marqueeItems = [
    { code: 'CS101', label: 'Intro to Computing', hint: 'Mid & Final' },
    { code: 'CS201', label: 'Intro to Programming', hint: 'C++ & Solved' },
    { code: 'CS301', label: 'Data Structures', hint: 'Moaaz & MCQs' },
    { code: 'CS304', label: 'Object Oriented Prog', hint: 'Solved Bank' },
    { code: 'CS403', label: 'Database Systems', hint: 'ERD & SQL' },
    { code: 'CS504', label: 'Software Engineering', hint: 'Waqar Papers' },
    { code: 'CS601', label: 'Data Communication', hint: 'Handouts' },
    { code: 'MTH101', label: 'Calculus & Geometry', hint: 'Formulas' },
    { code: 'MTH202', label: 'Discrete Mathematics', hint: 'Practice' },
    { code: 'ENG201', label: 'Technical Writing', hint: 'Midterms' },
    { code: 'MGT101', label: 'Financial Accounting', hint: 'Solved' },
    { code: 'PAK301', label: 'Pakistan Studies', hint: 'MCQs Bank' }
  ];

  const hasSuggestions = showSuggestions && (matchingCourses.length > 0 || quickSuggestions.length > 0);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative overflow-hidden bg-studio-stage text-white pt-12 pb-16 sm:pt-18 sm:pb-22 border-b border-slate-800/80"
      >
        {/* Interactive Celestial Starfield & Constellation Threads */}
        <CelestialStarfield density={1.1} />

        {/* Rotating Orbital Astrolabe Geometry */}
        <CelestialOrbitalRings />

        {/* Scroll-parallax architectural perspective grid */}
        <motion.div
          style={{ y: bgGridY }}
          className="absolute inset-0 bg-academic-grid opacity-45 pointer-events-none"
          aria-hidden="true"
        />

        {/* Ambient floating + scroll-parallaxed aurora light orbs */}
        <motion.div
          style={{ y: orbLeftY }}
          className="pointer-events-none absolute -top-28 -left-24 w-[420px] h-[420px] rounded-full bg-blue-700/20 blur-3xl animate-aurora-breathe"
          aria-hidden="true"
        />
        <motion.div
          style={{ y: orbRightY }}
          className="pointer-events-none absolute top-10 -right-24 w-[340px] h-[340px] rounded-full bg-amber-500/10 blur-3xl animate-float-reverse"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-400/40 to-transparent"
          aria-hidden="true"
        />

        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-9"
        >
          {/* Hero Headline & Staggered Entrance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.48, ease: EASE_OUT_EXPO }}
            className="text-center space-y-4"
          >
            <p className="text-xs sm:text-sm font-mono text-sky-300/95 tracking-wide tabular-nums">
              Virtual University Academic Studio · <AnimatedCounter value={totalCourses} /> Courses ·{' '}
              <AnimatedCounter value={totalResources} /> Verified Documents
            </p>

            <h1
              className="text-3xl sm:text-5xl lg:text-[58px] font-extrabold tracking-tight text-white leading-[1.06] max-w-4xl mx-auto drop-shadow-[0_4px_24px_rgba(2,6,23,0.65)]"
              style={{ textWrap: 'balance' }}
            >
              Solved Past Papers, Handouts &amp;{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-300 to-amber-200 animate-gradient-text">
                Interactive Exam Practice
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.46, delay: 0.08, ease: EASE_OUT_EXPO }}
              className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto"
            >
              Instant downloads for Virtual University solved papers (Moaaz &amp; Waqar Siddhu), official handouts, 2026 assignment guides, and interactive subject MCQ quizzes.
            </motion.p>
          </motion.div>

          {/* Luminous Bezel Command Search Bar */}
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, y: 18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.48, delay: 0.12, ease: EASE_OUT_EXPO }}
            className="max-w-3xl mx-auto relative"
          >
            <div className="p-[1px] rounded-[17px] bg-gradient-to-r from-sky-400/45 via-slate-300/30 to-amber-300/45 shadow-[0_24px_60px_-14px_rgba(2,6,23,0.75)] transition-all duration-200 focus-within:from-sky-400 focus-within:via-blue-500 focus-within:to-amber-400 focus-within:shadow-[0_24px_68px_-12px_rgba(29,78,216,0.45)]">
              <div className="bg-white rounded-2xl overflow-hidden">
              <form
                onSubmit={handleFormSubmit}
                className="flex items-center p-1.5 sm:p-2 gap-2"
              >
                <motion.div
                  whileHover={{ rotate: -10, scale: 1.08 }}
                  className="pl-3.5 text-slate-400 shrink-0"
                  aria-hidden="true"
                >
                  <Search className="w-5 h-5" />
                </motion.div>

                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    onQueryChange(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder={ROTATING_HINTS[hintIndex]}
                  className="w-full py-2.5 px-1 text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent font-medium"
                  aria-label="Search academic study resources"
                />

                <div className="flex items-center gap-1.5 shrink-0">
                  {query ? (
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => {
                        onQueryChange('');
                        inputRef.current?.focus();
                      }}
                      className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  ) : (
                    <kbd className="hidden sm:inline-block px-2.5 py-1 text-[11px] font-mono bg-slate-100 border border-slate-200 rounded-md text-slate-500 select-none">
                      /
                    </kbd>
                  )}

                  <AnimatedButton
                    magnetic
                    shimmer
                    type="submit"
                    className="group inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap shadow-sm shadow-blue-600/25"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-3.5 h-3.5 hidden sm:inline transition-transform duration-200 group-hover:translate-x-1" />
                  </AnimatedButton>
                </div>
              </form>

              <AnimatePresence>
                {hasSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18, ease: EASE_OUT_EXPO }}
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
                          {matchingCourses.map((c, idx) => (
                            <motion.button
                              key={c.code}
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.03 }}
                              whileHover={{ x: 2 }}
                              whileTap={{ scale: 0.98 }}
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
                            </motion.button>
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
                            <motion.button
                              key={idx}
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.03 }}
                              whileHover={{ x: 2 }}
                              whileTap={{ scale: 0.98 }}
                              type="button"
                              onClick={() => handleSelectQuerySuggestion(s.value)}
                              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-700 hover:text-slate-950 bg-white hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer text-left"
                            >
                              <span className="flex items-center gap-2 truncate">
                                <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="truncate">{s.label}</span>
                              </span>
                              <CornerDownLeft className="w-3 h-3 text-slate-400 shrink-0 ml-1" />
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Quick Filter Row & Popular Course Shortcuts */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.18, ease: EASE_OUT_EXPO }}
            className="max-w-4xl mx-auto space-y-4 text-center"
          >
            <div className="flex flex-wrap items-center justify-center gap-2">
              {quickCollections.map((cat, idx) => (
                <motion.button
                  key={cat.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.035, ease: EASE_OUT_EXPO }}
                  whileHover={{ y: -3, scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => onCategoryClick(cat.query)}
                  className="btn-shimmer inline-flex items-center px-3.5 py-2 text-xs font-medium rounded-xl glass-panel-dark hover:bg-slate-800/95 hover:border-sky-400/40 text-slate-200 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                >
                  {cat.label}
                </motion.button>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
              <span className="text-slate-500">Quick courses:</span>
              {popularCourses.map((c) => (
                <motion.button
                  key={c}
                  whileHover={{ y: -2, scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  type="button"
                  onClick={() => onCourseClick(c)}
                  className="font-mono font-semibold text-slate-300 hover:text-sky-300 transition-colors cursor-pointer"
                >
                  {c}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Asymmetric 2+2 Architectural Studio Dock */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.44, delay: 0.2, ease: EASE_OUT_EXPO }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-1"
          >
            {/* Primary Interactive Exam Studios (7 cols) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {onOpenMcqs && (
                <SpotlightCard
                  onClick={onOpenMcqs}
                  spotlightColor="rgba(56, 189, 248, 0.16)"
                  className="group glass-panel-dark rounded-2xl p-5 sm:p-6 text-left transition-colors hover:border-sky-400/60 cursor-pointer flex flex-col justify-between min-h-[188px]"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/35 flex items-center justify-center text-sky-300 transition-transform duration-150 group-hover:scale-105">
                        <ListChecks className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-semibold text-sky-300 tabular-nums">
                        {totalMcqQuestions.toLocaleString()} MCQs
                      </span>
                    </div>
                    <div className="space-y-1.5 mt-4">
                      <h2 className="text-base sm:text-lg font-bold text-white group-hover:text-sky-200 transition-colors">
                        Interactive MCQ Studio
                      </h2>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Practice {mcqSets.length} verified subject banks with 45s timed mock exams and rapid flash-sheets.
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="font-mono text-[11px] text-slate-400">Practice · Mock · Sheet</span>
                    <span className="font-semibold text-sky-300 group-hover:text-white inline-flex items-center gap-1">
                      <span>Launch</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-1" />
                    </span>
                  </div>
                </SpotlightCard>
              )}

              {onOpenSubjective && (
                <SpotlightCard
                  onClick={onOpenSubjective}
                  spotlightColor="rgba(217, 119, 6, 0.18)"
                  className="group glass-panel-dark rounded-2xl p-5 sm:p-6 text-left transition-colors hover:border-amber-400/60 cursor-pointer flex flex-col justify-between min-h-[188px]"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/35 flex items-center justify-center text-amber-300 transition-transform duration-150 group-hover:scale-105">
                        <Flame className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-semibold text-amber-300 tabular-nums">
                        {totalSubjectiveQuestions} Q&amp;As
                      </span>
                    </div>
                    <div className="space-y-1.5 mt-4">
                      <h2 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-200 transition-colors">
                        Subjective Fast-Learning
                      </h2>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Master 2, 3 &amp; 5-mark prompts via 10-second memory hooks, cram sheets, and marking keys.
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="font-mono text-[11px] text-slate-400">Hooks · Rubric · Drill</span>
                    <span className="font-semibold text-amber-300 group-hover:text-white inline-flex items-center gap-1">
                      <span>Fast-Prep</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-1" />
                    </span>
                  </div>
                </SpotlightCard>
              )}
            </div>

            {/* Secondary Compact Executive Utility Column (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-4">
              {onOpenPastPapers && (
                <SpotlightCard
                  onClick={onOpenPastPapers}
                  spotlightColor="rgba(52, 211, 153, 0.14)"
                  className="group glass-panel-dark rounded-2xl p-4 sm:p-5 text-left transition-colors hover:border-emerald-400/55 cursor-pointer flex items-center justify-between gap-4 flex-1"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/18 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0 transition-transform duration-150 group-hover:scale-105">
                      <Files className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="text-[11px] font-mono text-emerald-300 uppercase tracking-wider">
                        Moaaz &amp; Waqar · {totalCourses} Courses
                      </div>
                      <h2 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-200 transition-colors">
                        Solved Past Paper Bank
                      </h2>
                      <p className="text-xs text-slate-300 line-clamp-1">
                        Verified student exam memories, repeat MCQs &amp; subjective solutions.
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-300 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
                </SpotlightCard>
              )}

              {onOpenSimulator && (
                <SpotlightCard
                  onClick={onOpenSimulator}
                  spotlightColor="rgba(56, 189, 248, 0.14)"
                  className="group glass-panel-dark rounded-2xl p-4 sm:p-5 text-left transition-colors hover:border-sky-400/55 cursor-pointer flex items-center justify-between gap-4 flex-1"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/18 border border-teal-400/30 flex items-center justify-center text-teal-300 shrink-0 transition-transform duration-150 group-hover:scale-105">
                      <Calculator className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="text-[11px] font-mono text-teal-300 uppercase tracking-wider">
                        20% Two-Half Rule
                      </div>
                      <h2 className="text-sm sm:text-base font-bold text-white group-hover:text-teal-200 transition-colors">
                        Passing Marks Simulator
                      </h2>
                      <p className="text-xs text-slate-300 line-clamp-1">
                        Compute exact Final-Term scores required to pass or hit target GPA.
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-teal-300 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
                </SpotlightCard>
              )}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Smooth Continuous Gliding Course Strip */}
      <CourseMarquee items={marqueeItems} onSelectCourse={onCourseClick} />
    </>
  );
};
