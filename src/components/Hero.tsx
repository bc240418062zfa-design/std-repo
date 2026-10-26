import React, { useRef, useEffect, useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  Sparkles, 
  BookOpen, 
  ArrowRight, 
  CornerDownLeft, 
  Layers, 
  FileText, 
  Zap, 
  ChevronRight,
  Command,
  Compass
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
}

export const Hero: React.FC<HeroProps> = ({
  query,
  onQueryChange,
  onSearchSubmit,
  onCategoryClick,
  onCourseClick,
  totalResources,
  totalCourses,
  courses = []
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Focus search on '/' key press or Cmd/Ctrl+K
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

  // Close suggestions flyout on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute smart course matching suggestions
  const matchingCourses = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || courses.length === 0) return [];

    return courses
      .filter((c) => c.code.toLowerCase().includes(q) || c.title.toLowerCase().includes(q))
      .slice(0, 4);
  }, [query, courses]);

  // Suggested keywords based on input
  const quickSuggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    
    const base = [
      { label: `Search solved papers for "${query}"`, value: `${query} solved` },
      { label: `Search midterm past papers for "${query}"`, value: `${query} midterm` },
      { label: `Search final term papers for "${query}"`, value: `${query} finalterm` },
      { label: `Search handouts & books for "${query}"`, value: `${query} handout` }
    ];
    return base.slice(0, 4);
  }, [query]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (onSearchSubmit) {
      onSearchSubmit();
    }
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

  const quickCategories = [
    { label: 'ASSIGNMENTS 2026', query: 'assignment', badge: 'Latest' },
    { label: 'MOAAZ PAPERS', query: 'moaaz', badge: 'Solved' },
    { label: 'WAQAR SIDDHU', query: 'waqar', badge: 'Verified' },
    { label: 'MIDTERMS', query: 'midterm', badge: '3,877 Files' },
    { label: 'FINALS', query: 'finalterm', badge: '7,361 Files' },
    { label: 'MCQ FILES', query: 'mcq', badge: '3,256 Files' },
    { label: 'HANDOUTS', query: 'handout', badge: '2,625 Books' }
  ];

  const featuredCourses = ['CS101', 'CS201', 'CS301', 'CS302', 'MTH101', 'ACC311', 'MGT101', 'STA301', 'ZOO507', 'CS607'];

  const hasSuggestions = showSuggestions && (matchingCourses.length > 0 || quickSuggestions.length > 0);

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white pt-16 pb-20 sm:pt-20 sm:pb-24 border-b border-slate-800/80">
      {/* High-tech Constellation Grid Backdrop */}
      <div className="absolute inset-0 opacity-25 pointer-events-none bg-[radial-gradient(#3b82f6_1.2px,transparent_1.2px)] [background-size:28px_28px]" />
      
      {/* Ambient Radial Core Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[360px] bg-gradient-to-r from-blue-600/20 via-cyan-500/15 to-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Clean Editorial Metadata Kicker */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300 text-xs font-medium shadow-md shadow-black/20 backdrop-blur-md">
          <BookOpen className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-slate-200 font-semibold tracking-wide">VIRTUAL UNIVERSITY ARCHIVE</span>
          <span className="text-slate-600" aria-hidden="true">·</span>
          <span className="text-slate-300 font-mono text-[11px] tabular-nums">{totalCourses} Courses</span>
          <span className="text-slate-600" aria-hidden="true">·</span>
          <span className="text-slate-300 font-mono text-[11px] tabular-nums">{totalResources.toLocaleString()} Solved Documents</span>
        </div>

        {/* Hero Title & Subtext */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight" style={{ textWrap: 'balance' }}>
            MIHORA VU <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">– Solved Papers, Handouts &amp; 2026 Solutions</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            Direct high-speed downloads for 28,328+ Virtual University past papers, Moaaz &amp; Waqar Siddhu solved MCQs, official handouts, and 2026 assignment solution templates across all 411 courses.
          </p>
        </div>

        {/* Modern MIHORA Command Search Cockpit */}
        <div ref={containerRef} className="max-w-3xl mx-auto relative text-left">
          {/* Animated Ambient Border Halo */}
          <div 
            className={`absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600 blur-md opacity-35 transition-all duration-300 pointer-events-none ${
              isFocused ? 'opacity-90 blur-lg scale-[1.01]' : 'opacity-35'
            }`} 
          />

          {/* Command Bar Shell (In-Flow Integrated Card to completely eliminate overlap) */}
          <div className="relative bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-2xl shadow-2xl transition-all overflow-hidden">
            <form
              onSubmit={handleFormSubmit}
              className="flex items-center p-1.5 sm:p-2.5 gap-1.5 sm:gap-2"
            >
              {/* Branded Left Icon */}
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/25 shrink-0 ml-0.5 sm:ml-1">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-100" />
              </div>

              {/* Central Input Field */}
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  onQueryChange(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => {
                  setIsFocused(true);
                  setShowSuggestions(true);
                }}
                onBlur={() => setIsFocused(false)}
                placeholder="Search course code or topic (e.g. CS101, solved midterm)..."
                className="w-full px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-base text-white placeholder-slate-400 focus:outline-hidden bg-transparent font-medium tracking-tight"
                aria-label="Search academic study resources"
              />

              {/* Right Command Actions */}
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 mr-0.5 sm:mr-1">
                {query ? (
                  <button
                    type="button"
                    onClick={() => {
                      onQueryChange('');
                      inputRef.current?.focus();
                    }}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-400 font-mono text-[11px] select-none">
                    <Command className="w-3 h-3" />
                    <span>K</span>
                  </div>
                )}

                {/* Submit Action Button */}
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/30 transition-all cursor-pointer active:scale-95"
                >
                  <span>Search</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-200 hidden sm:inline" />
                </button>
              </div>
            </form>

            {/* Smart Suggestions - Integrated in-flow inside the card (Zero Overlap with elements below!) */}
            {hasSuggestions && (
              <div className="border-t border-slate-800/80 p-3 sm:p-4 bg-slate-950/60 space-y-3 animate-in fade-in duration-150">
                {/* Matching Courses Subsection */}
                {matchingCourses.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between px-1 text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                      <span className="flex items-center gap-1.5 text-cyan-300">
                        <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                        <span>Matching Courses ({matchingCourses.length})</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowSuggestions(false)}
                        className="text-[10px] text-slate-500 hover:text-slate-300 cursor-pointer"
                      >
                        Press ESC to close
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {matchingCourses.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => handleSelectCourseSuggestion(c.code)}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 hover:bg-blue-600/20 hover:border-blue-500/50 border border-slate-800 transition-all text-left cursor-pointer group shadow-2xs"
                        >
                          <div className="min-w-0 pr-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-black text-cyan-300 group-hover:text-cyan-200">
                                {c.code}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-slate-800 text-slate-400 font-mono">
                                {c.faculty.split(' ')[0]}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-300 truncate mt-0.5 group-hover:text-white">
                              {c.title}
                            </p>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 shrink-0 flex items-center gap-1">
                            <FileText className="w-2.5 h-2.5" />
                            <span>{c.fileCount || 0}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Query Completions */}
                {quickSuggestions.length > 0 && (
                  <div className="space-y-1.5 border-t border-slate-800/80 pt-2.5">
                    <div className="flex items-center justify-between px-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500">
                      <span>Instant Search Actions</span>
                      <span className="text-[10px] text-slate-600">Press Enter ↵ to search</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {quickSuggestions.map((s, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectQuerySuggestion(s.value)}
                          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-800/60 hover:border-slate-700 transition-colors cursor-pointer group text-left"
                        >
                          <span className="flex items-center gap-2 truncate">
                            <Search className="w-3 h-3 text-slate-500 group-hover:text-blue-400 shrink-0" />
                            <span className="truncate">{s.label}</span>
                          </span>
                          <CornerDownLeft className="w-3 h-3 text-slate-600 group-hover:text-slate-300 shrink-0 ml-1" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Interactive Search Examples - Positioned in clean document flow with proper margin */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-400">
            <span className="text-slate-500 text-[11px] font-medium">Try searching:</span>
            {['CS101 assignment solution 2026', 'CS201 midterm', 'MTH101 solved', 'Moaaz past papers', 'CS301 handouts'].map((eg) => (
              <button
                key={eg}
                type="button"
                onClick={() => {
                  onQueryChange(eg);
                  onSearchSubmit?.();
                }}
                className="px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 hover:bg-slate-800 transition-all cursor-pointer font-mono text-[11px] shadow-2xs"
              >
                {eg}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Categories Bar (Modernized Chips - In clean document flow) */}
        <div className="pt-2">
          <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-center gap-2">
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            <span>High-Yield Study Collections</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
            {quickCategories.map((cat) => (
              <button
                key={cat.label}
                type="button"
                onClick={() => onCategoryClick(cat.query)}
                className="group inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all duration-150 cursor-pointer shadow-xs hover:shadow-md hover:-translate-y-0.5 active:scale-95"
              >
                <span>{cat.label}</span>
                <span className="text-[10px] font-mono font-normal text-slate-400 group-hover:text-sky-300 transition-colors">
                  {cat.badge}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Course Shortcuts (Monospace Chips) */}
        <div className="pt-1 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
          <span className="text-slate-400 font-mono text-[11px] mr-1">Trending Courses:</span>
          {featuredCourses.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onCourseClick(c)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800/90 hover:border-blue-500/50 hover:bg-blue-950/40 text-slate-300 hover:text-white transition-all font-mono font-bold text-xs cursor-pointer shadow-2xs hover:-translate-y-0.5 active:scale-95"
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
