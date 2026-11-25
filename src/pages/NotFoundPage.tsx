import React, { useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Calculator,
  FileSearch,
  GraduationCap,
  Home,
  ListChecks,
  Search
} from 'lucide-react';

interface NotFoundPageProps {
  /** The path the visitor tried to open, shown back to them (e.g. "/psy101-notes"). */
  requestedPath?: string;
  /** Heading override (doc-not-found uses its own title). */
  title?: string;
  /** Body copy override (doc-not-found uses its own message). */
  message?: string;
  onNavigateHome: () => void;
  onOpenMidtermPrep: () => void;
  onNavigate: (page: string) => void;
  onSelectCourse: (courseCode: string) => void;
  onSearch: (query: string) => void;
}

const POPULAR_COURSES = ['CS101', 'CS201', 'PSY101', 'MGT101', 'ENG101', 'MTH101', 'ACC311', 'BIO101'];

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  requestedPath,
  title = 'Page not found',
  message = 'The page you\u2019re looking for moved, was renamed, or never existed. Check the address, or jump straight back into the library \u2014 everything you need is one search away.',
  onNavigateHome,
  onOpenMidtermPrep,
  onNavigate,
  onSelectCourse,
  onSearch
}) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchInput.trim();
    if (q) onSearch(q);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
      {/* Branded 404 hero — same dark observatory stage as the document pages */}
      <header className="relative overflow-hidden rounded-3xl bg-studio-stage text-white border border-slate-800 p-6 sm:p-10 shadow-[0_20px_50px_-15px_rgba(4,8,20,0.65)]">
        <div
          className="absolute inset-0 bg-academic-grid opacity-30 pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-400/50 to-transparent"
          aria-hidden="true"
        />
        <div className="relative z-10 text-center space-y-3">
          <p className="text-[11px] font-mono font-semibold text-amber-300 uppercase tracking-widest">
            MIHORA VU &middot; Study Library
          </p>
          <p className="font-display text-6xl sm:text-8xl font-extrabold tracking-tight leading-none">
            404
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{title}</h1>
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">{message}</p>
          {requestedPath ? (
            <p className="inline-block max-w-full font-mono text-xs text-sky-300 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 break-all">
              {requestedPath}
            </p>
          ) : null}
        </div>
      </header>

      {/* Search the library */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-slate-950 flex items-center gap-2">
          <FileSearch className="w-4 h-4 text-blue-700" />
          <span>Search the library instead</span>
        </h2>
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
          <label className="relative flex-1">
            <span className="sr-only">Search courses, papers and handouts</span>
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Try a course code, e.g. CS101, PSY101, MGT211"
              className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </label>
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#0B1526] hover:bg-blue-700 text-white text-sm font-bold transition-colors cursor-pointer"
          >
            Search the library
          </button>
        </form>
        <p className="text-xs text-slate-500">
          Search 28,328 past papers, handouts and MCQ banks by course code or topic.
        </p>
      </section>

      {/* Quick links */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-950">Where to go next</h2>
        <div className="flex flex-col sm:flex-row flex-wrap gap-2">
          <button
            type="button"
            onClick={onNavigateHome}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0B1526] hover:bg-blue-700 text-white text-sm font-bold transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Go to Homepage</span>
          </button>
          <button
            type="button"
            onClick={onOpenMidtermPrep}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Midterm Prep Hub</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('mcqs')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-800 text-sm font-bold transition-colors cursor-pointer"
          >
            <ListChecks className="w-4 h-4" />
            <span>MCQ Bank</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('courses')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-800 text-sm font-bold transition-colors cursor-pointer"
          >
            <GraduationCap className="w-4 h-4" />
            <span>All Courses</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('gpa-calculator')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-800 text-sm font-bold transition-colors cursor-pointer"
          >
            <Calculator className="w-4 h-4" />
            <span>GPA Calculator</span>
          </button>
        </div>
      </section>

      {/* Popular courses */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-950">Popular right now</h2>
        <div className="flex flex-wrap gap-2">
          {POPULAR_COURSES.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => onSelectCourse(code)}
              className="px-4 py-2.5 rounded-full border border-slate-300 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-slate-800 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
            >
              {code}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onOpenMidtermPrep}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Browse all 664 midterm packs</span>
        </button>
      </section>
    </div>
  );
};
