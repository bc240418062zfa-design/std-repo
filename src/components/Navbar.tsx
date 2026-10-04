import React, { useState } from 'react';
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
  GraduationCap
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

  const handleNavClick = (page: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="/"
          onClick={(e) => handleNavClick('home', e)}
          className="focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg shrink-0"
          aria-label="Mihora Study Library Home"
        >
          <MihoraLogo variant="dark" size="md" />
        </a>

        {/* Zone 2: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium text-slate-600">
          <a
            href="/"
            onClick={(e) => handleNavClick('home', e)}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              currentPage === 'home'
                ? 'bg-blue-50 text-blue-700 font-bold'
                : 'hover:text-blue-600 hover:bg-slate-50'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </a>

          <a
            href="/courses"
            onClick={(e) => handleNavClick('courses', e)}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              currentPage === 'courses'
                ? 'bg-blue-50 text-blue-700 font-bold'
                : 'hover:text-blue-600 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Courses</span>
          </a>

          {/* New Important Student Handbook Tab */}
          <a
            href="/handbook"
            onClick={(e) => handleNavClick('handbook', e)}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              currentPage === 'handbook'
                ? 'bg-blue-50 text-blue-700 font-bold'
                : 'hover:text-blue-600 hover:bg-slate-50'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            <span>VU Handbook</span>
          </a>

          <a
            href="/simulator"
            onClick={(e) => handleNavClick('simulator', e)}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              currentPage === 'simulator'
                ? 'bg-blue-50 text-blue-700 font-bold'
                : 'hover:text-blue-600 hover:bg-slate-50'
            }`}
          >
            <Calculator className="w-4 h-4 text-blue-600" />
            <span>Passing Simulator</span>
          </a>

          <a
            href="/security"
            onClick={(e) => handleNavClick('security', e)}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              currentPage === 'security'
                ? 'bg-blue-50 text-blue-700 font-bold'
                : 'hover:text-blue-600 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Trust & Privacy</span>
          </a>

          <a
            href="/about"
            onClick={(e) => handleNavClick('about', e)}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              currentPage === 'about'
                ? 'bg-blue-50 text-blue-700 font-bold'
                : 'hover:text-blue-600 hover:bg-slate-50'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>About</span>
          </a>

          <a
            href="/sitemap"
            onClick={(e) => handleNavClick('sitemap', e)}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              currentPage === 'sitemap'
                ? 'bg-blue-50 text-blue-700 font-bold'
                : 'hover:text-blue-600 hover:bg-slate-50'
            }`}
          >
            <Network className="w-4 h-4" />
            <span>Curriculum</span>
          </a>
        </nav>

        {/* Zone 3: Primary Actions & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {selectedCount > 0 ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold tabular-nums">
              <Download className="w-3.5 h-3.5" />
              <span>{selectedCount} Selected</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => handleNavClick('simulator')}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap shadow-xs"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Calculate Passing Marks</span>
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <a
            href="/"
            onClick={(e) => handleNavClick('home', e)}
            className={`w-full px-3 py-2 rounded-xl text-left text-sm font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
              currentPage === 'home'
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Search className="w-4 h-4 text-blue-600" />
            <span>Search Library</span>
          </a>

          <a
            href="/courses"
            onClick={(e) => handleNavClick('courses', e)}
            className={`w-full px-3 py-2 rounded-xl text-left text-sm font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
              currentPage === 'courses'
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Course Directory (411 Courses)</span>
          </a>

          <a
            href="/handbook"
            onClick={(e) => handleNavClick('handbook', e)}
            className={`w-full px-3 py-2 rounded-xl text-left text-sm font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
              currentPage === 'handbook'
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            <span>VU Student Handbook & Essential Rules</span>
          </a>

          <a
            href="/simulator"
            onClick={(e) => handleNavClick('simulator', e)}
            className={`w-full px-3 py-2 rounded-xl text-left text-sm font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
              currentPage === 'simulator'
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Calculator className="w-4 h-4 text-blue-600" />
            <span>Exam Passing Marks Simulator & Report</span>
          </a>

          <a
            href="/security"
            onClick={(e) => handleNavClick('security', e)}
            className={`w-full px-3 py-2 rounded-xl text-left text-sm font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
              currentPage === 'security'
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Trust & Privacy Guarantee</span>
          </a>

          <a
            href="/about"
            onClick={(e) => handleNavClick('about', e)}
            className={`w-full px-3 py-2 rounded-xl text-left text-sm font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
              currentPage === 'about'
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Building2 className="w-4 h-4 text-purple-600" />
            <span>About Mihora Tech & VU Initiative</span>
          </a>

          <a
            href="/sitemap"
            onClick={(e) => handleNavClick('sitemap', e)}
            className={`w-full px-3 py-2 rounded-xl text-left text-sm font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
              currentPage === 'sitemap'
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Network className="w-4 h-4 text-slate-500" />
            <span>Curriculum Directory</span>
          </a>

          <a
            href="/disclaimer"
            onClick={(e) => handleNavClick('disclaimer', e)}
            className={`w-full px-3 py-2 rounded-xl text-left text-sm font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
              currentPage === 'disclaimer'
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Info className="w-4 h-4 text-amber-600" />
            <span>Academic Notice & Disclaimer</span>
          </a>
        </div>
      )}
    </header>
  );
};
