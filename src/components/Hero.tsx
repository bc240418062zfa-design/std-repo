import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  Search,
  X,
  BookOpen,
  ArrowRight,
  CornerDownLeft,
  FileText,
  ListChecks
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
  onOpenMcqs
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
    { label: 'Moaaz Past Papers', query: 'moaaz' },
    { label: 'Waqar Siddhu', query: 'waqar' },
    { label: 'Midterms', query: 'midterm' },
    { label: 'Final Term', query: 'finalterm' },
    { label: 'Handouts', query: 'handout' }
  ];

  const popularCourses = ['CS101', 'CS201', 'CS301', 'CS304', 'CS403', 'CS504', 'CS601', 'MTH101'];

  const hasSuggestions = showSuggestions && (matchingCourses.length > 0 || quickSuggestions.length > 0);

  return (
    <section className="bg-[#0B1526] text-white pt-14 pb-16 sm:pt-16 sm:pb-20 border-b border-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Clean Unboxed Editorial Metadata */}
        <div className="text-center space-y-4">
          <p className="text-xs sm:text-sm font-mono text-amber-300/95 tracking-wide tabular-nums">
            Virtual University Study Archive · {totalCourses} Courses · {totalResources.toLocaleString()} Documents
          </p>

          <h1
            className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.15] max-w-3xl mx-auto"
            style={{ textWrap: 'balance' }}
          >
            Solved Papers, Handouts &amp; Interactive Exam Practice
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Direct downloads for Virtual University past papers (Moaaz &amp; Waqar Siddhu), official handouts, 2026 assignment guides, and interactive MCQ mock tests.
          </p>
        </div>

        {/* High-Contrast Architectural Search Input */}
        <div ref={containerRef} className="max-w-3xl mx-auto relative">
          <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
            <form
              onSubmit={handleFormSubmit}
              className="flex items-center p-1.5 sm:p-2 gap-2"
            >
              <div className="pl-2.5 text-slate-400 shrink-0" aria-hidden="true">
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
                placeholder="Search by course code or topic (e.g. CS201 midterm, handouts, Moaaz)..."
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
                    className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : (
                  <kbd className="hidden sm:inline-block px-2 py-1 text-[11px] font-mono bg-slate-100 border border-slate-200 rounded text-slate-500 select-none">
                    /
                  </kbd>
                )}

                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-lg bg-[#0B1526] hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>Search</span>
                  <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
                </button>
              </div>
            </form>

            {/* Clean In-Flow Suggestions */}
            {hasSuggestions && (
              <div className="border-t border-slate-200 p-3 sm:p-4 bg-slate-50 space-y-3 text-left">
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
                          className="flex items-center justify-between p-2.5 rounded-lg bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-colors text-left cursor-pointer"
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
                          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-700 hover:text-slate-950 bg-white hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer text-left"
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
              </div>
            )}
          </div>
        </div>

        {/* Disciplined Single-Row Quick Access Strip */}
        <div className="max-w-4xl mx-auto pt-1 space-y-4 text-center">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {onOpenMcqs && (
              <button
                type="button"
                onClick={onOpenMcqs}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                <ListChecks className="w-3.5 h-3.5" />
                <span>Interactive MCQs Studio (465 Qs)</span>
              </button>
            )}

            {quickCollections.map((cat) => (
              <button
                key={cat.label}
                type="button"
                onClick={() => onCategoryClick(cat.query)}
                className="inline-flex items-center px-3.5 py-2 text-xs font-medium rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
            <span className="text-slate-500">Popular courses:</span>
            {popularCourses.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onCourseClick(c)}
                className="font-mono font-medium text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
