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
  Files,
  ArrowRight,
  Flame
} from 'lucide-react';
import { EASE_OUT_EXPO } from './MotionPrimitives';
import { mcqSets } from '../data/mcqs';
import { subjectiveSets } from '../data/subjective';

const TOTAL_MCQ_QS = mcqSets.reduce((sum, s) => sum + s.questions.length, 0);
const TOTAL_SUB_QS = subjectiveSets.reduce((sum, s) => sum + s.questions.length, 0);

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
    { id: 'midterm-prep', label: 'Midterm Prep', href: '/midterm-prep' },
    { id: 'mcqs', label: 'MCQs', href: '/mcqs' },
    { id: 'subjective', label: 'Subjective', href: '/subjective' },
    { id: 'past-papers', label: 'Past Papers', href: '/past-papers' }
  ];

  const toolsItems = [
    {
      id: 'assignment-guide',
      href: '/vu-assignment-solution-2026',
      icon: <FileText className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />,
      title: 'Assignments 2026 Guide',
      desc: '24h grace period & Turnitin guidelines'
    },
    {
      id: 'handbook',
      href: '/handbook',
      icon: <GraduationCap className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />,
      title: 'VU Handbook & FAQs',
      desc: 'Official rules, grading scheme & policies'
    },
    {
      id: 'simulator',
      href: '/simulator',
      icon: <Calculator className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />,
      title: 'Passing Marks Simulator',
      desc: 'VU 20% two-half rule & target calculator'
    },
    {
      id: 'gpa-calculator',
      href: '/gpa-calculator',
      icon: <Award className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />,
      title: 'VU GPA & CGPA Calculator',
      desc: 'Official 4.0 scale & semester forecaster'
    },
    {
      id: 'datesheet-guide',
      href: '/datesheet-guide',
      icon: <Calendar className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />,
      title: 'Datesheet Maker Guide',
      desc: 'Exam seat strategy & lab slot tips'
    },
    {
      id: 'cs619-guide',
      href: '/cs619-guide',
      icon: <FolderGit2 className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />,
      title: 'CS619 FYP Capstone Hub',
      desc: 'Project milestones & viva preparation'
    }
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 border-b bg-white ${
        scrolled
          ? 'border-slate-200/90 shadow-[0_6px_30px_-12px_rgba(15,23,42,0.12)]'
          : 'border-slate-200/80'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 xl:gap-6">
        {/* Zone 1: Brand Wordmark */}
        <motion.a
          href="/"
          onClick={(e) => handleNavClick('home', e)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg whitespace-nowrap shrink-0"
          aria-label="Mihora Study Library Home"
        >
          <MihoraLogo variant="dark" size="sm" />
        </motion.a>

        {/* Zone 2: Fluid Animated Navigation Links */}
        <nav className="hidden lg:flex items-center gap-3.5 xl:gap-5" aria-label="Primary Navigation">
          {primaryLinks.map((link) => {
            const active =
              currentPage === link.id ||
              (link.id === 'midterm-prep' && currentPage === 'midterm-doc');
            return (
              <motion.a
                key={link.id}
                href={link.href}
                onClick={(e) => handleNavClick(link.id, e)}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.96 }}
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
              </motion.a>
            );
          })}

          {/* Tools Dropdown */}
          <div ref={toolsDropdownRef} className="relative">
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.96 }}
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
                  toolsDropdownOpen ? 'rotate-180 text-blue-600' : ''
                }`}
              />
              {isToolsActive && (
                <motion.span
                  layoutId="navbar-active-underline"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  className="absolute inset-x-0 -bottom-[1px] h-0.5 bg-blue-700 rounded-full"
                />
              )}
            </motion.button>

            <AnimatePresence>
              {toolsDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ duration: 0.18, ease: EASE_OUT_EXPO }}
                  className="absolute left-0 top-full mt-2 w-80 p-2 bg-white rounded-xl border border-slate-200 shadow-xl z-50 space-y-0.5 origin-top-left"
                >
                  {toolsItems.map((item, idx) => (
                    <motion.a
                      key={item.id}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.025 }}
                      whileHover={{ x: 3 }}
                      href={item.href}
                      onClick={(e) => handleNavClick(item.id, e)}
                      className={`w-full p-2.5 rounded-lg flex items-start gap-3 transition-colors text-left ${
                        currentPage === item.id ? 'bg-slate-100 text-slate-950' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {item.icon}
                      <div>
                        <div className="text-xs font-semibold text-slate-900">{item.title}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
                      </div>
                    </motion.a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Portal Info Dropdown */}
          <div ref={dropdownRef} className="relative">
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.96 }}
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
                  moreDropdownOpen ? 'rotate-180 text-blue-600' : ''
                }`}
              />
              {isMoreActive && (
                <motion.span
                  layoutId="navbar-active-underline"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  className="absolute inset-x-0 -bottom-[1px] h-0.5 bg-blue-700 rounded-full"
                />
              )}
            </motion.button>

            <AnimatePresence>
              {moreDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ duration: 0.18, ease: EASE_OUT_EXPO }}
                  className="absolute right-0 top-full mt-2 w-72 p-2 bg-white rounded-xl border border-slate-200 shadow-xl z-50 space-y-0.5 origin-top-right"
                >
                  <motion.a
                    whileHover={{ x: 3 }}
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
                  </motion.a>

                  <motion.a
                    whileHover={{ x: 3 }}
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
                  </motion.a>

                  <motion.a
                    whileHover={{ x: 3 }}
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
                  </motion.a>

                  <div className="border-t border-slate-100 my-1" />

                  <motion.a
                    whileHover={{ x: 3 }}
                    href="/disclaimer"
                    onClick={(e) => handleNavClick('disclaimer', e)}
                    className={`w-full p-2 rounded-lg flex items-center gap-2.5 text-xs font-medium transition-colors text-slate-600 hover:text-slate-900 hover:bg-slate-50 ${
                      currentPage === 'disclaimer' ? 'text-slate-950 font-semibold bg-slate-100' : ''
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                    <span>Academic Disclaimer</span>
                  </motion.a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Zone 3: Single Primary Action & Mobile Menu Button */}
        <div className="flex items-center gap-3 shrink-0">
          <AnimatePresence>
            {selectedCount > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: 4 }}
                transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold tabular-nums"
              >
                <Download className="w-3.5 h-3.5 text-amber-700" />
                <span>{selectedCount} Selected</span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.a
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 420, damping: 24 }}
            href="/vu-assignment-solution-2026"
            onClick={(e) => handleNavClick('assignment-guide', e)}
            className="btn-shimmer group hidden lg:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0B1526] hover:bg-blue-700 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
          >
            <span>Assignments 2026</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </motion.a>

          <motion.button
            whileTap={{ scale: 0.94 }}
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3 py-2 min-h-[44px] rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 transition-colors cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5 text-slate-700" />
            <span className="text-xs font-semibold">Menu</span>
          </motion.button>
        </div>
      </div>

      {/* Smooth Scroll Reading Progress Bar */}
      <motion.div
        style={{ scaleX }}
        className="h-[2px] w-full bg-gradient-to-r from-blue-700 via-sky-500 to-amber-500 origin-left"
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
              className="relative w-[92vw] max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 border-l border-slate-200"
            >
              <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                <MihoraLogo variant="dark" size="sm" />
                <motion.button
                  whileTap={{ scale: 0.9, rotate: 90 }}
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </motion.button>
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
                    href="/midterm-prep"
                    onClick={(e) => handleNavClick('midterm-prep', e)}
                    className={`w-full min-h-[44px] px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between transition-colors ${
                      currentPage === 'midterm-prep' || currentPage === 'midterm-doc'
                        ? 'bg-slate-100 text-slate-950 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <GraduationCap className="w-4 h-4 text-blue-700" />
                      <span>Midterm Prep 2026</span>
                    </span>
                    <span className="text-xs font-mono text-blue-700 tabular-nums">664 Packs</span>
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
                    <span className="text-xs font-mono text-slate-400 tabular-nums">
                      {TOTAL_MCQ_QS.toLocaleString()} Qs
                    </span>
                  </a>

                  <a
                    href="/subjective"
                    onClick={(e) => handleNavClick('subjective', e)}
                    className={`w-full min-h-[44px] px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between transition-colors ${
                      currentPage === 'subjective' ? 'bg-slate-100 text-slate-950 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Flame className="w-4 h-4 text-amber-600" />
                      <span>Subjective Fast-Prep</span>
                    </span>
                    <span className="text-xs font-mono text-slate-400 tabular-nums">
                      {TOTAL_SUB_QS} Qs
                    </span>
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
