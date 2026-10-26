import React, { useState, useRef, useEffect } from 'react';
import { MihoraLogo } from './MihoraLogo';
import { 
  BookOpen, 
  ShieldCheck, 
  Download, 
  Search, 
  Network, 
  Menu, 
  X,
  Building2,
  Calculator,
  GraduationCap,
  ChevronDown,
  HelpCircle,
  SlidersHorizontal,
  Compass,
  ArrowRight,
  Calendar,
  Award,
  FolderGit2,
  FileText,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  selectedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  selectedCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toolsDropdownRef = useRef<HTMLDivElement>(null);

  const handleNavClick = (page: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    onNavigate(page);
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
    setToolsDropdownOpen(false);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMoreDropdownOpen(false);
      }
      if (toolsDropdownRef.current && !toolsDropdownRef.current.contains(e.target as Node)) {
        setToolsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMoreDropdownOpen(false);
        setToolsDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock body scroll when mobile sidebar drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const isMoreActive = ['security', 'about', 'sitemap', 'disclaimer'].includes(currentPage);
  const isToolsActive = ['gpa-calculator', 'datesheet-guide', 'cs619-guide', 'assignment-guide'].includes(currentPage);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: Brand Identity & Subtitle */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/"
            onClick={(e) => handleNavClick('home', e)}
            className="focus-visible:ring-2 focus-visible:ring-blue-600 rounded-xl transition-transform hover:scale-[1.01]"
            aria-label="Mihora Study Library Home"
          >
            <MihoraLogo variant="dark" size="sm" />
          </a>

          <div className="hidden sm:block h-4 w-px bg-slate-200" aria-hidden="true" />
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-600 tracking-tight">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden="true" />
            <span>VU Academic Archive</span>
          </div>
        </div>

        {/* Center: Clean Standard Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-sm font-semibold text-slate-600">
          {/* 1. Search Library */}
          <a
            href="/"
            onClick={(e) => handleNavClick('home', e)}
            className={`px-3 py-2 rounded-xl transition-all duration-150 flex items-center gap-2 cursor-pointer ${
              currentPage === 'home'
                ? 'bg-blue-50 text-blue-700 font-bold'
                : 'hover:text-slate-900 hover:bg-slate-100/70 text-slate-600'
            }`}
          >
            <Search className={`w-4 h-4 ${currentPage === 'home' ? 'text-blue-600' : 'text-slate-400'}`} />
            <span>Library</span>
          </a>

          {/* 2. Course Directory */}
          <a
            href="/courses"
            onClick={(e) => handleNavClick('courses', e)}
            className={`px-3 py-2 rounded-xl transition-all duration-150 flex items-center gap-2 cursor-pointer ${
              currentPage === 'courses'
                ? 'bg-blue-50 text-blue-700 font-bold'
                : 'hover:text-slate-900 hover:bg-slate-100/70 text-slate-600'
            }`}
          >
            <BookOpen className={`w-4 h-4 ${currentPage === 'courses' ? 'text-blue-600' : 'text-slate-400'}`} />
            <span>Courses</span>
            <span className="text-[11px] font-mono text-slate-400 font-normal">
              411
            </span>
          </a>

          {/* 2B. VU Assignment Solution 2026 (Prominent High-Intent Link) */}
          <a
            href="/vu-assignment-solution-2026"
            onClick={(e) => handleNavClick('assignment-guide', e)}
            className={`px-3 py-2 rounded-xl transition-all duration-150 flex items-center gap-2 cursor-pointer ${
              currentPage === 'assignment-guide'
                ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/60'
                : 'text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/60'
            }`}
          >
            <FileText className={`w-4 h-4 ${currentPage === 'assignment-guide' ? 'text-emerald-600' : 'text-emerald-500'}`} />
            <span>Assignments</span>
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded-sm">
              2026
            </span>
          </a>

          {/* 2C. Past Papers (Moaaz & Waqar Siddhu) */}
          <a
            href="/past-papers"
            onClick={(e) => handleNavClick('past-papers', e)}
            className={`hidden xl:flex px-3 py-2 rounded-xl transition-all duration-150 items-center gap-2 cursor-pointer ${
              currentPage === 'past-papers'
                ? 'bg-blue-50 text-blue-700 font-bold'
                : 'hover:text-slate-900 hover:bg-slate-100/70 text-slate-600'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${currentPage === 'past-papers' ? 'text-blue-600' : 'text-slate-400'}`} />
            <span>Past Papers</span>
          </a>

          {/* 3. VU Handbook & FAQs */}
          <a
            href="/handbook"
            onClick={(e) => handleNavClick('handbook', e)}
            className={`px-3 py-2 rounded-xl transition-all duration-150 flex items-center gap-2 cursor-pointer ${
              currentPage === 'handbook'
                ? 'bg-blue-50 text-blue-700 font-bold'
                : 'hover:text-slate-900 hover:bg-slate-100/70 text-slate-600'
            }`}
          >
            <GraduationCap className={`w-4 h-4 ${currentPage === 'handbook' ? 'text-blue-600' : 'text-slate-400'}`} />
            <span>VU Handbook</span>
          </a>

          {/* 4. Passing Simulator */}
          <a
            href="/simulator"
            onClick={(e) => handleNavClick('simulator', e)}
            className={`px-3 py-2 rounded-xl transition-all duration-150 flex items-center gap-2 cursor-pointer ${
              currentPage === 'simulator'
                ? 'bg-blue-50 text-blue-700 font-bold'
                : 'hover:text-slate-900 hover:bg-slate-100/70 text-slate-600'
            }`}
          >
            <Calculator className={`w-4 h-4 ${currentPage === 'simulator' ? 'text-blue-600' : 'text-slate-400'}`} />
            <span>Passing Calculator</span>
          </a>

          {/* 5. Academic Tools & Guides Dropdown Menu */}
          <div ref={toolsDropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                isToolsActive
                  ? 'bg-blue-50 text-blue-700 shadow-2xs font-bold'
                  : 'hover:text-slate-900 hover:bg-slate-100/80 text-slate-600'
              }`}
              aria-expanded={toolsDropdownOpen}
              aria-haspopup="true"
            >
              <Award className={`w-4 h-4 ${isToolsActive ? 'text-blue-600' : 'text-slate-400'}`} />
              <span>Tools &amp; Guides</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                toolsDropdownOpen ? 'rotate-180' : ''
              }`} />
            </button>

            {/* Tools Dropdown Menu Window */}
            {toolsDropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-80 p-2 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 animate-in fade-in slide-in-from-top-1 duration-150 space-y-1">
                <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Student Tools &amp; Capstone Guides
                </div>

                <a
                  href="/gpa-calculator"
                  onClick={(e) => handleNavClick('gpa-calculator', e)}
                  className={`w-full p-2.5 rounded-xl flex items-start gap-3 transition-colors cursor-pointer text-left ${
                    currentPage === 'gpa-calculator' ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">VU GPA &amp; CGPA Calculator</div>
                    <div className="text-[11px] text-slate-500 leading-tight mt-0.5">Official 4.0 scale &amp; probation forecaster</div>
                  </div>
                </a>

                <a
                  href="/datesheet-guide"
                  onClick={(e) => handleNavClick('datesheet-guide', e)}
                  className={`w-full p-2.5 rounded-xl flex items-start gap-3 transition-colors cursor-pointer text-left ${
                    currentPage === 'datesheet-guide' ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Datesheet Maker Guide</div>
                    <div className="text-[11px] text-slate-500 leading-tight mt-0.5">First-hour seat strategy &amp; lab slots</div>
                  </div>
                </a>

                <a
                  href="/cs619-guide"
                  onClick={(e) => handleNavClick('cs619-guide', e)}
                  className={`w-full p-2.5 rounded-xl flex items-start gap-3 transition-colors cursor-pointer text-left ${
                    currentPage === 'cs619-guide' ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                    <FolderGit2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">CS619 FYP Capstone Hub</div>
                    <div className="text-[11px] text-slate-500 leading-tight mt-0.5">5 Phases roadmap &amp; top viva questions</div>
                  </div>
                </a>

                <a
                  href="/assignment-guide"
                  onClick={(e) => handleNavClick('assignment-guide', e)}
                  className={`w-full p-2.5 rounded-xl flex items-start gap-3 transition-colors cursor-pointer text-left ${
                    currentPage === 'assignment-guide' ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Assignment &amp; GDB Formatting</div>
                    <div className="text-[11px] text-slate-500 leading-tight mt-0.5">24h grace period &amp; Turnitin rules</div>
                  </div>
                </a>
              </div>
            )}
          </div>

          {/* 5. Wide Desktop Direct Links (On xl+ screens, make better productive use of space) */}
          <a
            href="/security"
            onClick={(e) => handleNavClick('security', e)}
            className={`hidden xl:flex px-3 py-2 rounded-xl transition-all items-center gap-2 cursor-pointer ${
              currentPage === 'security'
                ? 'bg-blue-50 text-blue-700 shadow-2xs font-bold'
                : 'hover:text-slate-900 hover:bg-slate-100/80 text-slate-600'
            }`}
          >
            <ShieldCheck className={`w-4 h-4 ${currentPage === 'security' ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span>Trust & Privacy</span>
          </a>

          <a
            href="/sitemap"
            onClick={(e) => handleNavClick('sitemap', e)}
            className={`hidden xl:flex px-3 py-2 rounded-xl transition-all items-center gap-2 cursor-pointer ${
              currentPage === 'sitemap'
                ? 'bg-blue-50 text-blue-700 shadow-2xs font-bold'
                : 'hover:text-slate-900 hover:bg-slate-100/80 text-slate-600'
            }`}
          >
            <Network className={`w-4 h-4 ${currentPage === 'sitemap' ? 'text-blue-600' : 'text-slate-400'}`} />
            <span>Sitemap</span>
          </a>

          {/* 6. Institutional & Information Dropdown Menu (For lg screens or extra secondary items) */}
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                isMoreActive && !['security', 'sitemap'].includes(currentPage)
                  ? 'bg-slate-100 text-slate-900 font-bold'
                  : 'hover:text-slate-900 hover:bg-slate-100/80 text-slate-600'
              }`}
              aria-expanded={moreDropdownOpen}
              aria-haspopup="true"
            >
              <span>More</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                moreDropdownOpen ? 'rotate-180' : ''
              }`} />
            </button>

            {/* Dropdown Menu Window */}
            {moreDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 p-2 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 animate-in fade-in slide-in-from-top-1 duration-150 space-y-1">
                <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Trust & Information
                </div>

                <a
                  href="/security"
                  onClick={(e) => handleNavClick('security', e)}
                  className={`w-full p-2.5 rounded-xl flex items-start gap-3 transition-colors cursor-pointer text-left ${
                    currentPage === 'security' ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Privacy & Trust Guarantee</div>
                    <div className="text-[11px] text-slate-500 leading-tight mt-0.5">Zero student tracking, verified documents</div>
                  </div>
                </a>

                <a
                  href="/about"
                  onClick={(e) => handleNavClick('about', e)}
                  className={`w-full p-2.5 rounded-xl flex items-start gap-3 transition-colors cursor-pointer text-left ${
                    currentPage === 'about' ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">About MIHORA TECH</div>
                    <div className="text-[11px] text-slate-500 leading-tight mt-0.5">Corporate profile & student CSR initiative</div>
                  </div>
                </a>

                <a
                  href="/sitemap"
                  onClick={(e) => handleNavClick('sitemap', e)}
                  className={`w-full p-2.5 rounded-xl flex items-start gap-3 transition-colors cursor-pointer text-left ${
                    currentPage === 'sitemap' ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Network className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Curriculum Directory</div>
                    <div className="text-[11px] text-slate-500 leading-tight mt-0.5">All 411 courses grouped by faculty</div>
                  </div>
                </a>

                <div className="border-t border-slate-100 my-1" />

                <a
                  href="/disclaimer"
                  onClick={(e) => handleNavClick('disclaimer', e)}
                  className={`w-full p-2 rounded-xl flex items-center gap-2.5 text-xs font-medium transition-colors cursor-pointer text-slate-600 hover:text-slate-900 hover:bg-slate-50 ${
                    currentPage === 'disclaimer' ? 'text-blue-700 font-bold bg-blue-50/60' : ''
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  <span>Academic Disclaimer & Policy</span>
                </a>
              </div>
            )}
          </div>
        </nav>

        {/* Right Area: Dedicated space optimization on desktop + Prominent Sidebar button on phone */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Download Count Badge (Shows whenever files are selected) */}
          {selectedCount > 0 && (
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/90 text-amber-900 text-xs font-bold tabular-nums shadow-xs">
              <Download className="w-3.5 h-3.5 text-amber-700" />
              <span>{selectedCount} Selected</span>
            </div>
          )}

          {/* Desktop Right Quick Search Button (Makes productive use of space without extra blue clutter) */}
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-xs font-semibold transition-all cursor-pointer border border-slate-200/90 shadow-2xs hover:border-slate-300"
            aria-label="Quick search library"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white rounded border border-slate-200 text-slate-500 select-none">
              /
            </kbd>
          </button>

          {/* Mobile Phone Dedicated Sidebar / Menu Toggle Button (Prominent, clean, with ample space on mobile) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl border border-slate-200/90 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-800 transition-all cursor-pointer shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            aria-label="Open mobile navigation sidebar"
          >
            <Menu className="w-5 h-5 text-slate-700" />
            <span className="text-xs font-bold text-slate-800">Menu</span>
          </button>
        </div>
      </div>

      {/* Modern Well-Organized Mobile Sidebar Drawer Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 lg:hidden flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Drawer"
        >
          {/* Backdrop Blur */}
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          />

          {/* Sidebar Drawer Panel */}
          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200 border-l border-slate-200">
            {/* Drawer Header */}
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <MihoraLogo variant="dark" size="sm" />
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100/80 text-blue-700 font-bold">
                  PORTAL
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200/60"
                aria-label="Close navigation drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Section 1: Academic Essentials */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 px-1">
                  Study Essentials
                </div>

                <a
                  href="/"
                  onClick={(e) => handleNavClick('home', e)}
                  className={`w-full min-h-[48px] px-3.5 py-3 rounded-xl text-left text-sm font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    currentPage === 'home' ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/60' : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Search className="w-4 h-4 text-blue-600" />
                    <span>Search Library</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">28k+ Files</span>
                </a>

                <a
                  href="/courses"
                  onClick={(e) => handleNavClick('courses', e)}
                  className={`w-full min-h-[48px] px-3.5 py-3 rounded-xl text-left text-sm font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    currentPage === 'courses' ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/60' : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span>Course Directory</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                    411 Courses
                  </span>
                </a>

                <a
                  href="/vu-assignment-solution-2026"
                  onClick={(e) => handleNavClick('assignment-guide', e)}
                  className={`w-full min-h-[48px] px-3.5 py-3 rounded-xl text-left text-sm font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    currentPage === 'assignment-guide' ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-300' : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>Assignments 2026</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold">
                    LATEST
                  </span>
                </a>

                <a
                  href="/past-papers"
                  onClick={(e) => handleNavClick('past-papers', e)}
                  className={`w-full min-h-[48px] px-3.5 py-3 rounded-xl text-left text-sm font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    currentPage === 'past-papers' ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/60' : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>Past Papers (Moaaz &amp; Waqar)</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                    Solved
                  </span>
                </a>

                <a
                  href="/handbook"
                  onClick={(e) => handleNavClick('handbook', e)}
                  className={`w-full min-h-[48px] px-3.5 py-3 rounded-xl text-left text-sm font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    currentPage === 'handbook' ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/60' : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-4 h-4 text-emerald-600" />
                    <span>VU Handbook & FAQs</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold">
                    FAQs
                  </span>
                </a>

                {/* Passing Simulator in Mobile Menu (Treated normally like other pages, NO blue highlight) */}
                <a
                  href="/simulator"
                  onClick={(e) => handleNavClick('simulator', e)}
                  className={`w-full min-h-[48px] px-3.5 py-3 rounded-xl text-left text-sm font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    currentPage === 'simulator' ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/60' : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Calculator className="w-4 h-4 text-slate-600" />
                    <span>Passing Marks Simulator</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                    20% Rule
                  </span>
                </a>
              </div>

              {/* Section 2: Academic Tools & Guides */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 px-1">
                  Academic Tools &amp; Guides
                </div>

                <a
                  href="/gpa-calculator"
                  onClick={(e) => handleNavClick('gpa-calculator', e)}
                  className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    currentPage === 'gpa-calculator' ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/60' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Award className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>VU GPA &amp; CGPA Calculator</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">4.0 Scale</span>
                </a>

                <a
                  href="/datesheet-guide"
                  onClick={(e) => handleNavClick('datesheet-guide', e)}
                  className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    currentPage === 'datesheet-guide' ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/60' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Datesheet Maker Guide</span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-600 font-bold">Strategy</span>
                </a>

                <a
                  href="/cs619-guide"
                  onClick={(e) => handleNavClick('cs619-guide', e)}
                  className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    currentPage === 'cs619-guide' ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/60' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FolderGit2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>CS619 FYP Capstone Hub</span>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-600 font-bold">Viva 25</span>
                </a>

                <a
                  href="/assignment-guide"
                  onClick={(e) => handleNavClick('assignment-guide', e)}
                  className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    currentPage === 'assignment-guide' ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/60' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Assignment &amp; Turnitin Guide</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold">24h Grace</span>
                </a>
              </div>

              {/* Section 3: Trust & Information */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 px-1">
                  Institutional &amp; Trust
                </div>

                <a
                  href="/security"
                  onClick={(e) => handleNavClick('security', e)}
                  className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
                    currentPage === 'security' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Privacy & Trust Guarantee</span>
                </a>

                <a
                  href="/about"
                  onClick={(e) => handleNavClick('about', e)}
                  className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
                    currentPage === 'about' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>About MIHORA TECH</span>
                </a>

                <a
                  href="/sitemap"
                  onClick={(e) => handleNavClick('sitemap', e)}
                  className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
                    currentPage === 'sitemap' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Network className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Curriculum & Faculty Directory</span>
                </a>

                <a
                  href="/disclaimer"
                  onClick={(e) => handleNavClick('disclaimer', e)}
                  className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
                    currentPage === 'disclaimer' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Academic Notice & Fair Use</span>
                </a>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50/50 text-center">
              <p className="text-[11px] text-slate-500">
                MIHORA TECH © 2026 · Free Academic Resource Initiative
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
