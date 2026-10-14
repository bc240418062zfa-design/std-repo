import React, { useState, useRef, useEffect } from 'react';
import { MihoraLogo } from './MihoraLogo';
import { 
  BookOpen, 
  Info, 
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
  Sparkles,
  ExternalLink,
  HelpCircle,
  Layers,
  ArrowRight
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleNavClick = (page: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    onNavigate(page);
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMoreDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isMoreActive = ['security', 'about', 'sitemap', 'disclaimer'].includes(currentPage);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Identity & Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/"
            onClick={(e) => handleNavClick('home', e)}
            className="focus-visible:ring-2 focus-visible:ring-blue-600 rounded-xl transition-transform hover:scale-[1.01]"
            aria-label="Mihora Study Library Home"
          >
            <MihoraLogo variant="dark" size="md" />
          </a>

          {/* Academic Portal Pill (Desktop Only) */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-mono font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <span>VU PORTAL</span>
          </div>
        </div>

        {/* Center: Clean, Well-Organized Primary Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-sm font-semibold text-slate-600">
          {/* 1. Search Library */}
          <a
            href="/"
            onClick={(e) => handleNavClick('home', e)}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              currentPage === 'home'
                ? 'bg-blue-50 text-blue-700 shadow-2xs font-bold'
                : 'hover:text-slate-900 hover:bg-slate-100/80 text-slate-600'
            }`}
          >
            <Search className={`w-4 h-4 ${currentPage === 'home' ? 'text-blue-600' : 'text-slate-400'}`} />
            <span>Library</span>
          </a>

          {/* 2. Course Directory */}
          <a
            href="/courses"
            onClick={(e) => handleNavClick('courses', e)}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              currentPage === 'courses'
                ? 'bg-blue-50 text-blue-700 shadow-2xs font-bold'
                : 'hover:text-slate-900 hover:bg-slate-100/80 text-slate-600'
            }`}
          >
            <BookOpen className={`w-4 h-4 ${currentPage === 'courses' ? 'text-blue-600' : 'text-slate-400'}`} />
            <span>Courses</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-500 border border-slate-200">
              411
            </span>
          </a>

          {/* 3. VU Handbook & FAQs */}
          <a
            href="/handbook"
            onClick={(e) => handleNavClick('handbook', e)}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              currentPage === 'handbook'
                ? 'bg-emerald-50 text-emerald-800 shadow-2xs font-bold'
                : 'hover:text-slate-900 hover:bg-slate-100/80 text-slate-600'
            }`}
          >
            <GraduationCap className={`w-4 h-4 ${currentPage === 'handbook' ? 'text-emerald-600' : 'text-emerald-500'}`} />
            <span>VU Handbook</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-emerald-100/80 text-emerald-800 font-bold border border-emerald-200">
              FAQs
            </span>
          </a>

          {/* 4. Passing Simulator */}
          <a
            href="/simulator"
            onClick={(e) => handleNavClick('simulator', e)}
            className={`px-3 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              currentPage === 'simulator'
                ? 'bg-blue-50 text-blue-700 shadow-2xs font-bold'
                : 'hover:text-slate-900 hover:bg-slate-100/80 text-slate-600'
            }`}
          >
            <Calculator className={`w-4 h-4 ${currentPage === 'simulator' ? 'text-blue-600' : 'text-blue-500'}`} />
            <span>Passing Simulator</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-blue-100/80 text-blue-800 font-bold border border-blue-200">
              20%
            </span>
          </a>

          {/* 5. Institutional & Trust Popover Dropdown (Organized clean grouping) */}
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                isMoreActive
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

        {/* Right: High-Value Actions & Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          {selectedCount > 0 ? (
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tabular-nums shadow-2xs">
              <Download className="w-3.5 h-3.5" />
              <span>{selectedCount} Selected</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => handleNavClick('simulator')}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Calculator className="w-3.5 h-3.5 text-blue-200" />
              <span className="hidden sm:inline">Calculate</span> Passing Marks
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Modern Well-Organized Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-150">
          {/* Section 1: Academic Essentials */}
          <div className="space-y-1">
            <div className="px-2 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Study Essentials
            </div>

            <a
              href="/"
              onClick={(e) => handleNavClick('home', e)}
              className={`w-full px-3 py-2.5 rounded-xl text-left text-sm font-bold flex items-center justify-between transition-colors cursor-pointer ${
                currentPage === 'home' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
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
              className={`w-full px-3 py-2.5 rounded-xl text-left text-sm font-bold flex items-center justify-between transition-colors cursor-pointer ${
                currentPage === 'courses' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Course Directory</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                411 Courses
              </span>
            </a>

            <a
              href="/handbook"
              onClick={(e) => handleNavClick('handbook', e)}
              className={`w-full px-3 py-2.5 rounded-xl text-left text-sm font-bold flex items-center justify-between transition-colors cursor-pointer ${
                currentPage === 'handbook' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <span>VU Handbook & FAQs</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                14 FAQs
              </span>
            </a>

            <a
              href="/simulator"
              onClick={(e) => handleNavClick('simulator', e)}
              className={`w-full px-3 py-2.5 rounded-xl text-left text-sm font-bold flex items-center justify-between transition-colors cursor-pointer ${
                currentPage === 'simulator' ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Calculator className="w-4 h-4 text-blue-600" />
                <span>Passing Marks Simulator</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-blue-100 text-blue-800 border border-blue-200">
                20% Rule
              </span>
            </a>
          </div>

          {/* Section 2: Trust & Information */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <div className="px-2 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Institutional & Trust
            </div>

            <a
              href="/security"
              onClick={(e) => handleNavClick('security', e)}
              className={`w-full px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                currentPage === 'security' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Privacy & Trust Guarantee</span>
            </a>

            <a
              href="/about"
              onClick={(e) => handleNavClick('about', e)}
              className={`w-full px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                currentPage === 'about' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-purple-600" />
              <span>About MIHORA TECH</span>
            </a>

            <a
              href="/sitemap"
              onClick={(e) => handleNavClick('sitemap', e)}
              className={`w-full px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                currentPage === 'sitemap' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Network className="w-3.5 h-3.5 text-slate-500" />
              <span>Curriculum & Faculty Directory</span>
            </a>

            <a
              href="/disclaimer"
              onClick={(e) => handleNavClick('disclaimer', e)}
              className={`w-full px-3 py-2 rounded-xl text-left text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                currentPage === 'disclaimer' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Academic Notice & Fair Use Policy</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
