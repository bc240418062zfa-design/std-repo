import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
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
  Calendar,
  Award,
  FolderGit2,
  FileText,
  ListChecks,
  Files
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
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toolsDropdownRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 32,
    restDelta: 0.001
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (page: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    onNavigate(page);
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
    setToolsDropdownOpen(false);
  };

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
  const isToolsActive = [
    'simulator',
    'gpa-calculator',
    'datesheet-guide',
    'cs619-guide',
    'assignment-guide',
    'handbook'
  ].includes(currentPage);

  const primaryLinks = [
    { id: 'home', label: 'Library', href: '/' },
    { id: 'courses', label: 'Courses', href: '/courses' },
    { id: 'mcqs', label: 'MCQs', href: '/mcqs' },
    { id: 'past-papers', label: 'Past Papers', href: '/past-papers' }
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 border-b ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md border-slate-200/90 shadow-sm'
          : 'bg-white/95 backdrop-blur-xs border-slate-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="/"
          onClick={(e) => handleNavClick('home', e)}
          className="focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg whitespace-nowrap shrink-0 transition-transform duration-150 hover:scale-[1.01]"
          aria-label="Mihora Study Library Home"
        >
          <MihoraLogo variant="dark" size="sm" />
        </a>

        {/* Zone 2: Fluid Animated Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6" aria-label="Primary Navigation">
          {primaryLinks.map((link) => {
            const active = currentPage === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleNavClick(link.id, e)}
                className={`relative py-2 px-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active ? 'text-slate-950 font-semibold' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <span>{link.label}</span>
                {active && (
                  <motion.span
                    layoutId="navbar-active-underline"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    className="absolute inset-x-0 -bottom-[1px] h-0.5 bg-blue-700 rounded-full"
                  />
                )}
              </a>
            );
          })}

          {/* Tools Dropdown */}
          <div ref={toolsDropdownRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setToolsDropdownOpen(!toolsDropdownOpen);
                setMoreDropdownOpen(false);
              }}
              className={`relative py-2 px-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center gap-1 ${
                isToolsActive ? 'text-slate-950 font-semibold' : 'text-slate-600 hover:text-slate-950'
              }`}
              aria-expanded={toolsDropdownOpen}
              aria-haspopup="true"
            >
              <span>Tools &amp; Guides</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  toolsDropdownOpen ? 'rotate-180' : ''
                }`}
              />
              {isToolsActive && (
                <motion.span
                  layoutId="navbar-active-underline"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  className="absolute inset-x-0 -bottom-[1px] h-0.5 bg-blue-700 rounded-full"
                />
              )}
            </button>

            <AnimatePresence>
              {toolsDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute left-0 top-full mt-2 w-80 p-2 bg-white rounded-xl border border-slate-200 shadow-xl z-50 space-y-0.5 origin-top-left"
                >
                  <a
                    href="/vu-assignment-solution-2026"
                    onClick={(e) => handleNavClick('assignment-guide', e)}
                    className={`w-full p-2.5 rounded-lg flex items-start gap-3 transition-colors text-left ${
                      currentPage === 'assignment-guide' ? 'bg-slate-100 text-slate-950' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <FileText className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-slate-900">Assignments 2026 Guide</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">24h grace period &amp; Turnitin guidelines</div>
                    </div>
                  </a>

                  <a
                    href="/handbook"
                    onClick={(e) => handleNavClick('handbook', e)}
                    className={`w-full p-2.5 rounded-lg flex items-start gap-3 transition-colors text-left ${
                      currentPage === 'handbook' ? 'bg-slate-100 text-slate-950' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-slate-900">VU Handbook &amp; FAQs</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Official rules, grading scheme &amp; policies</div>
                    </div>
                  </a>

                  <a
                    href="/simulator"
                    onClick={(e) => handleNavClick('simulator', e)}
                    className={`w-full p-2.5 rounded-lg flex items-start gap-3 transition-colors text-left ${
                      currentPage === 'simulator' ? 'bg-slate-100 text-slate-950' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Calculator className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-slate-900">Passing Marks Simulator</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">VU 20% two-half rule &amp; target calculator</div>
                    </div>
                  </a>

                  <a
                    href="/gpa-calculator"
                    onClick={(e) => handleNavClick('gpa-calculator', e)}
                    className={`w-full p-2.5 rounded-lg flex items-start gap-3 transition-colors text-left ${
                      currentPage === 'gpa-calculator' ? 'bg-slate-100 text-slate-950' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Award className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-slate-900">VU GPA &amp; CGPA Calculator</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Official 4.0 scale &amp; semester forecaster</div>
                    </div>
                  </a>

                  <a
                    href="/datesheet-guide"
                    onClick={(e) => handleNavClick('datesheet-guide', e)}
                    className={`w-full p-2.5 rounded-lg flex items-start gap-3 transition-colors text-left ${
                      currentPage === 'datesheet-guide' ? 'bg-slate-100 text-slate-950' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Calendar className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-slate-900">Datesheet Maker Guide</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Exam seat strategy &amp; lab slot tips</div>
                    </div>
                  </a>

                  <a
                    href="/cs619-guide"
                    onClick={(e) => handleNavClick('cs619-guide', e)}
                    className={`w-full p-2.5 rounded-lg flex items-start gap-3 transition-colors text-left ${
                      currentPage === 'cs619-guide' ? 'bg-slate-100 text-slate-950' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <FolderGit2 className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-slate-900">CS619 FYP Capstone Hub</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Project milestones &amp; viva preparation</div>
                    </div>
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Portal Info Dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setMoreDropdownOpen(!moreDropdownOpen);
                setToolsDropdownOpen(false);
              }}
              className={`relative py-2 px-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center gap-1 ${
                isMoreActive ? 'text-slate-950 font-semibold' : 'text-slate-600 hover:text-slate-950'
              }`}
              aria-expanded={moreDropdownOpen}
              aria-haspopup="true"
            >
              <span>Portal Info</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  moreDropdownOpen ? 'rotate-180' : ''
                }`}
              />
              {isMoreActive && (
                <motion.span
                  layoutId="navbar-active-underline"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  className="absolute inset-x-0 -bottom-[1px] h-0.5 bg-blue-700 rounded-full"
                />
              )}
            </button>

            <AnimatePresence>
              {moreDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-0 top-full mt-2 w-72 p-2 bg-white rounded-xl border border-slate-200 shadow-xl z-50 space-y-0.5 origin-top-right"
                >
                  <a
                    href="/security"
                    onClick={(e) => handleNavClick('security', e)}
                    className={`w-full p-2.5 rounded-lg flex items-start gap-3 transition-colors text-left ${
                      currentPage === 'security' ? 'bg-slate-100 text-slate-950' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-slate-900">Privacy &amp; Safety</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Zero tracking, verified documents</div>
                    </div>
                  </a>

                  <a
                    href="/about"
                    onClick={(e) => handleNavClick('about', e)}
                    className={`w-full p-2.5 rounded-lg flex items-start gap-3 transition-colors text-left ${
                      currentPage === 'about' ? 'bg-slate-100 text-slate-950' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-slate-900">About MIHORA TECH</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Independent CSR study initiative</div>
                    </div>
                  </a>

                  <a
                    href="/sitemap"
                    onClick={(e) => handleNavClick('sitemap', e)}
                    className={`w-full p-2.5 rounded-lg flex items-start gap-3 transition-colors text-left ${
                      currentPage === 'sitemap' ? 'bg-slate-100 text-slate-950' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Network className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-slate-900">Curriculum Directory</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">All 411 subjects grouped by faculty</div>
                    </div>
                  </a>

                  <div className="border-t border-slate-100 my-1" />

                  <a
                    href="/disclaimer"
                    onClick={(e) => handleNavClick('disclaimer', e)}
                    className={`w-full p-2 rounded-lg flex items-center gap-2.5 text-xs font-medium transition-colors text-slate-600 hover:text-slate-900 hover:bg-slate-50 ${
                      currentPage === 'disclaimer' ? 'text-slate-950 font-semibold bg-slate-100' : ''
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                    <span>Academic Disclaimer</span>
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Zone 3: Single Primary Action & Mobile Menu Button */}
        <div className="flex items-center gap-3 shrink-0">
          {selectedCount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold tabular-nums"
            >
              <Download className="w-3.5 h-3.5 text-amber-700" />
              <span>{selectedCount} Selected</span>
            </motion.div>
          )}

          <motion.a
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            href="/vu-assignment-solution-2026"
            onClick={(e) => handleNavClick('assignment-guide', e)}
            className="hidden lg:inline-flex items-center px-4 py-2 rounded-lg bg-[#0B1526] hover:bg-blue-700 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
          >
            Assignments 2026
          </motion.a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 transition-colors cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5 text-slate-700" />
            <span className="text-xs font-semibold">Menu</span>
          </button>
        </div>
      </div>

      {/* Smooth Scroll Reading Progress Bar */}
      <motion.div
        style={{ scaleX }}
        className="h-[2.5px] w-full bg-gradient-to-r from-blue-600 via-sky-500 to-amber-500 origin-left"
        aria-hidden="true"
      />

      {/* Animated Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-50 lg:hidden flex justify-end"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Drawer"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/45 backdrop-blur-xs"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 360, damping: 36 }}
              className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 border-l border-slate-200"
            >
              <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                <MihoraLogo variant="dark" size="sm" />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                <div className="space-y-1">
                  <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 px-2 pb-1">
                    Study Archive
                  </div>

                  <a
                    href="/"
                    onClick={(e) => handleNavClick('home', e)}
                    className={`w-full min-h-[44px] px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between transition-colors ${
                      currentPage === 'home' ? 'bg-slate-100 text-slate-950 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Search className="w-4 h-4 text-slate-500" />
                      <span>Search Library</span>
                    </span>
                    <span className="text-xs font-mono text-slate-400 tabular-nums">28,328</span>
                  </a>

                  <a
                    href="/courses"
                    onClick={(e) => handleNavClick('courses', e)}
                    className={`w-full min-h-[44px] px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between transition-colors ${
                      currentPage === 'courses' ? 'bg-slate-100 text-slate-950 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <BookOpen className="w-4 h-4 text-slate-500" />
                      <span>Course Directory</span>
                    </span>
                    <span className="text-xs font-mono text-slate-400 tabular-nums">411</span>
                  </a>

                  <a
                    href="/mcqs"
                    onClick={(e) => handleNavClick('mcqs', e)}
                    className={`w-full min-h-[44px] px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between transition-colors ${
                      currentPage === 'mcqs' ? 'bg-slate-100 text-slate-950 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <ListChecks className="w-4 h-4 text-blue-700" />
                      <span>Interactive MCQs</span>
                    </span>
                    <span className="text-xs font-mono text-slate-400 tabular-nums">465 Qs</span>
                  </a>

                  <a
                    href="/past-papers"
                    onClick={(e) => handleNavClick('past-papers', e)}
                    className={`w-full min-h-[44px] px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between transition-colors ${
                      currentPage === 'past-papers' ? 'bg-slate-100 text-slate-950 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Files className="w-4 h-4 text-slate-500" />
                      <span>Past Papers</span>
                    </span>
                    <span className="text-xs font-mono text-slate-400">Moaaz &amp; Waqar</span>
                  </a>

                  <a
                    href="/vu-assignment-solution-2026"
                    onClick={(e) => handleNavClick('assignment-guide', e)}
                    className={`w-full min-h-[44px] px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between transition-colors ${
                      currentPage === 'assignment-guide' ? 'bg-slate-100 text-slate-950 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-emerald-700" />
                      <span>Assignments 2026</span>
                    </span>
                    <span className="text-xs font-mono text-emerald-700">Guide</span>
                  </a>
                </div>

                <div className="space-y-1 pt-4 border-t border-slate-200">
                  <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 px-2 pb-1">
                    Tools &amp; Handbooks
                  </div>

                  <a
                    href="/handbook"
                    onClick={(e) => handleNavClick('handbook', e)}
                    className={`w-full min-h-[44px] px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-3 ${
                      currentPage === 'handbook' ? 'bg-slate-100 text-slate-950 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>VU Handbook &amp; FAQs</span>
                  </a>

                  <a
                    href="/simulator"
                    onClick={(e) => handleNavClick('simulator', e)}
                    className={`w-full min-h-[44px] px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-3 ${
                      currentPage === 'simulator' ? 'bg-slate-100 text-slate-950 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Calculator className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>Passing Marks Simulator</span>
                  </a>

                  <a
                    href="/gpa-calculator"
                    onClick={(e) => handleNavClick('gpa-calculator', e)}
                    className={`w-full min-h-[44px] px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-3 ${
                      currentPage === 'gpa-calculator' ? 'bg-slate-100 text-slate-950 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Award className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>VU GPA &amp; CGPA Calculator</span>
                  </a>

                  <a
                    href="/datesheet-guide"
                    onClick={(e) => handleNavClick('datesheet-guide', e)}
                    className={`w-full min-h-[44px] px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-3 ${
                      currentPage === 'datesheet-guide' ? 'bg-slate-100 text-slate-950 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>Datesheet Maker Guide</span>
                  </a>

                  <a
                    href="/cs619-guide"
                    onClick={(e) => handleNavClick('cs619-guide', e)}
                    className={`w-full min-h-[44px] px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-3 ${
                      currentPage === 'cs619-guide' ? 'bg-slate-100 text-slate-950 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <FolderGit2 className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>CS619 FYP Capstone Hub</span>
                  </a>
                </div>

                <div className="space-y-1 pt-4 border-t border-slate-200">
                  <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 px-2 pb-1">
                    Portal &amp; Trust
                  </div>

                  <a
                    href="/security"
                    onClick={(e) => handleNavClick('security', e)}
                    className={`w-full min-h-[44px] px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-3 ${
                      currentPage === 'security' ? 'bg-slate-100 text-slate-950 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>Privacy &amp; Trust Guarantee</span>
                  </a>

                  <a
                    href="/about"
                    onClick={(e) => handleNavClick('about', e)}
                    className={`w-full min-h-[44px] px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-3 ${
                      currentPage === 'about' ? 'bg-slate-100 text-slate-950 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>About MIHORA TECH</span>
                  </a>

                  <a
                    href="/sitemap"
                    onClick={(e) => handleNavClick('sitemap', e)}
                    className={`w-full min-h-[44px] px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-3 ${
                      currentPage === 'sitemap' ? 'bg-slate-100 text-slate-950 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Network className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>Curriculum Directory</span>
                  </a>

                  <a
                    href="/disclaimer"
                    onClick={(e) => handleNavClick('disclaimer', e)}
                    className={`w-full min-h-[44px] px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-3 ${
                      currentPage === 'disclaimer' ? 'bg-slate-100 text-slate-950 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <HelpCircle className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>Academic Disclaimer</span>
                  </a>
                </div>
              </div>

              <div className="p-4 border-t border-slate-200 text-center">
                <p className="text-[11px] text-slate-500">
                  MIHORA TECH © 2026 · Free Academic Archive
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};
