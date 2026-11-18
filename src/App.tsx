import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MotionConfig, motion, AnimatePresence } from 'motion/react';
import { Resource, Course, FilterState, DownloadSession } from './types';
import { searchResources } from './search/searchEngine';
import { resolveResourceLocally } from './security/shardResolver';
import { mcqSets } from './data/mcqs';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FilterBar } from './components/FilterBar';
import { ResourceCard } from './components/ResourceCard';
import { MultiDownloadBar } from './components/MultiDownloadBar';
import { DownloadModal } from './components/DownloadModal';
import { FilePreviewModal } from './components/FilePreviewModal';
import { MihoraLogo } from './components/MihoraLogo';
import {
  ScrollReveal,
  AnimatedButton,
  SpotlightCard,
  FloatingScrollTop,
  EASE_OUT_EXPO
} from './components/MotionPrimitives';
import { CelestialStarfield, CelestialOrbitalRings, CelestialDivider } from './components/CelestialBackdrop';
import { CoursesPage } from './pages/CoursesPage';
import { SecurityPage } from './pages/SecurityPage';
import { AboutPage } from './pages/AboutPage';
import { SitemapPage } from './pages/SitemapPage';
import { DisclaimerPage } from './pages/DisclaimerPage';
import { PassingSimulatorPage } from './pages/PassingSimulatorPage';
import { StudentHandbookPage } from './pages/StudentHandbookPage';
import { VUGPACalculatorPage } from './pages/VUGPACalculatorPage';
import { VUDatesheetGuidePage } from './pages/VUDatesheetGuidePage';
import { VUCS619GuidePage } from './pages/VUCS619GuidePage';
import { VUAssignmentGuidePage } from './pages/VUAssignmentGuidePage';
import { PastPapersPage } from './pages/PastPapersPage';
import { MCQsPage } from './pages/MCQsPage';
import {
  BookOpen,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ListChecks,
  ArrowRight,
  Calculator,
  Award,
  FileText,
  GraduationCap
} from 'lucide-react';

// Static sanitized data compiled at build time
import coursesData from './data/courses.json';
import resourcesData from './data/resources.json';

const courses: Course[] = coursesData as Course[];
const resources: Resource[] = resourcesData as Resource[];

export type AppPage = 
  | 'home' 
  | 'courses' 
  | 'simulator' 
  | 'handbook' 
  | 'gpa-calculator' 
  | 'datesheet-guide' 
  | 'cs619-guide' 
  | 'assignment-guide' 
  | 'past-papers'
  | 'mcqs'
  | 'security' 
  | 'about' 
  | 'sitemap' 
  | 'disclaimer';

const pagePathMap: Record<AppPage, string> = {
  home: '/',
  courses: '/courses',
  simulator: '/simulator',
  handbook: '/handbook',
  'gpa-calculator': '/gpa-calculator',
  'datesheet-guide': '/datesheet-guide',
  'cs619-guide': '/cs619-guide',
  'assignment-guide': '/vu-assignment-solution-2026',
  'past-papers': '/past-papers',
  mcqs: '/mcqs',
  security: '/security',
  about: '/about',
  sitemap: '/sitemap',
  disclaimer: '/disclaimer'
};

function getPageFromPath(): AppPage {
  if (typeof window === 'undefined') return 'home';
  const pathname = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
  if (pathname === '/courses' || pathname.startsWith('/courses/')) return 'courses';
  if (pathname === '/simulator' || pathname === '/calculator') return 'simulator';
  if (pathname === '/handbook' || pathname === '/guide' || pathname === '/rules') return 'handbook';
  if (pathname === '/gpa-calculator' || pathname === '/cgpa-calculator' || pathname === '/gpa') return 'gpa-calculator';
  if (pathname === '/datesheet-guide' || pathname === '/datesheet' || pathname === '/datesheet-maker') return 'datesheet-guide';
  if (pathname === '/cs619-guide' || pathname === '/cs619' || pathname === '/fyp') return 'cs619-guide';
  if (
    pathname === '/vu-assignment-solution-2026' ||
    pathname === '/assignment-solutions-2026' ||
    pathname === '/assignment-guide' ||
    pathname === '/assignments' ||
    pathname === '/gdb'
  ) return 'assignment-guide';
  if (
    pathname === '/past-papers' ||
    pathname === '/pastpapers' ||
    pathname === '/reviews'
  ) return 'past-papers';
  if (
    pathname === '/mcqs' ||
    pathname.startsWith('/mcqs/') ||
    pathname === '/mcq' ||
    pathname.startsWith('/mcq/') ||
    pathname === '/quiz' ||
    pathname.startsWith('/quiz/') ||
    pathname === '/quizzes' ||
    pathname.startsWith('/quizzes/')
  ) return 'mcqs';
  if (pathname === '/security' || pathname === '/privacy') return 'security';
  if (pathname === '/about' || pathname === '/mission') return 'about';
  if (pathname === '/sitemap') return 'sitemap';
  if (pathname === '/disclaimer' || pathname === '/terms') return 'disclaimer';

  // Backward compatibility with legacy hash
  const hash = window.location.hash.toLowerCase();
  if (hash === '#courses') return 'courses';
  if (hash === '#simulator' || hash === '#calculator') return 'simulator';
  if (hash === '#handbook' || hash === '#guide') return 'handbook';
  if (hash === '#gpa' || hash === '#gpa-calculator') return 'gpa-calculator';
  if (hash === '#datesheet' || hash === '#datesheet-guide') return 'datesheet-guide';
  if (hash === '#cs619' || hash === '#cs619-guide') return 'cs619-guide';
  if (hash === '#assignments' || hash === '#assignment-guide' || hash === '#assignment-2026') return 'assignment-guide';
  if (hash === '#past-papers' || hash === '#pastpapers') return 'past-papers';
  if (hash === '#mcqs' || hash === '#mcq' || hash === '#quiz') return 'mcqs';
  if (hash === '#security' || hash === '#relay') return 'security';
  if (hash === '#about' || hash === '#mission') return 'about';
  if (hash === '#sitemap') return 'sitemap';
  if (hash === '#disclaimer' || hash === '#terms') return 'disclaimer';

  return 'home';
}

function getMcqSetIdFromPath(): string | null {
  if (typeof window === 'undefined') return null;
  const pathname = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length < 2) return null;
  if (!['mcqs', 'mcq', 'quiz', 'quizzes'].includes(parts[0])) return null;

  const slug = parts[1];
  const exact = mcqSets.find((s) => s.id === slug);
  if (exact) return exact.id;

  const midAlias = mcqSets.find((s) => s.id === `${slug}-midterm`);
  if (midAlias) return midAlias.id;

  const finalAlias = mcqSets.find((s) => s.id === slug.replace(/-final$/, '-finalterm'));
  if (finalAlias) return finalAlias.id;

  const byCourse = mcqSets.find((s) => s.courseCode.toLowerCase() === slug);
  return byCourse ? byCourse.id : null;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>(getPageFromPath);
  const [selectedMcqSetId, setSelectedMcqSetId] = useState<string | null>(getMcqSetIdFromPath);

  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    course: '',
    type: '',
    format: '',
    tags: [],
    solvedOnly: false,
    pastPapersOnly: false,
    currentOnly: false
  });
  const [limit, setLimit] = useState<number>(12);
  const [selectedRLHs, setSelectedRLHs] = useState<Set<string>>(new Set());

  // Download Session States
  const [downloadSession, setDownloadSession] = useState<DownloadSession | null>(null);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [previewResource, setPreviewResource] = useState<Resource | null>(null);
  const [showAllCoursesFooter, setShowAllCoursesFooter] = useState(false);

  const searchResultsRef = useRef<HTMLDivElement>(null);

  // Listen to popstate changes for real browser back/forward and clean URLs
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPage(getPageFromPath());
      setSelectedMcqSetId(getMcqSetIdFromPath());
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Support deep links from sitemap or external bookmarks (e.g. /courses/cs101, ?course=CS101 or ?q=midterm)
  useEffect(() => {
    try {
      const pathname = window.location.pathname.toLowerCase().replace(/\/$/, '');
      if (pathname.startsWith('/courses/')) {
        const parts = pathname.split('/');
        const code = parts[2];
        if (code) {
          setFilters((prev) => ({ ...prev, course: code.toUpperCase() }));
          setCurrentPage('home');
        }
      }

      const params = new URLSearchParams(window.location.search);
      const courseParam = params.get('course');
      const qParam = params.get('q');
      if (courseParam) {
        setFilters((prev) => ({ ...prev, course: courseParam.toUpperCase() }));
      }
      if (qParam) {
        setQuery(qParam);
      }
    } catch {
      // Ignore URL parsing errors
    }
  }, []);

  const handleNavigate = (page: AppPage) => {
    setCurrentPage(page);
    if (page === 'mcqs') {
      setSelectedMcqSetId(null);
    }
    const targetPath = pagePathMap[page] || '/';
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectMcqSet = (setId: string | null) => {
    setCurrentPage('mcqs');
    setSelectedMcqSetId(setId);
    const targetPath = setId ? `/mcqs/${setId}` : '/mcqs';
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCourse = (courseCode: string) => {
    setFilters((prev) => ({ ...prev, course: courseCode }));
    setQuery('');
    setCurrentPage('home');
    if (window.location.pathname !== '/') {
      window.history.pushState(null, '', '/');
    }
    setTimeout(() => {
      scrollToSearch();
    }, 80);
  };

  // Dynamically synchronize document title and meta description for SEO & browser history
  useEffect(() => {
    let title = 'MIHORA VU – VU Assignment Solution 2026 Latest & Solved Past Papers (All 411+ Courses)';
    let desc = 'Official MIHORA VU Study Library: Direct download VU Assignment Solution 2026 (Latest Spring & Fall), 28,328+ solved past papers (Moaaz, Waqar Siddhu), handouts & quizzes for all 411+ Virtual University courses.';
    
    if (currentPage === 'home' && filters.course) {
      const match = courses.find((c) => c.code === filters.course);
      const titleSuffix = match ? ` – ${match.title}` : '';
      title = `${filters.course}${titleSuffix} VU Assignment Solution 2026, Solved Past Papers & Handouts | MIHORA VU`;
      desc = `Download verified ${filters.course} (${match ? match.title : 'VU Course'}) 2026 assignment solutions, solved midterm past papers, final term papers, and lecture handouts with 100% direct download on MIHORA VU.`;
    } else if (currentPage === 'courses') {
      title = 'All 411+ VU Courses Directory – VU Assignment Solution 2026, Past Papers & Handouts | MIHORA VU';
      desc = 'Browse all 411 Virtual University courses. Download CS101, MTH101, MGT101, ENG101, and CS201 handouts, solved papers, and 2026 assignment solution guides.';
    } else if (currentPage === 'assignment-guide') {
      title = 'VU Assignment Solution 2026 Latest – All 411 Courses Solved Assignments & GDBs | MIHORA VU';
      desc = 'Download verified Virtual University Assignment Solution 2026 (Latest Spring & Fall Semesters), GDB solutions, quiz files, and Turnitin plagiarism-free templates (<19%) for all 411 courses.';
    } else if (currentPage === 'past-papers') {
      title = 'VU Solved Past Papers – Midterm & Final Term Papers (Moaaz & Waqar Siddhu) | MIHORA VU';
      desc = 'Download verified Virtual University solved past papers: Moaaz & Waqar Siddhu midterm and final term papers, repeat MCQs, subjective question banks for all 411 courses.';
    } else if (currentPage === 'mcqs') {
      const activeSet = selectedMcqSetId ? mcqSets.find((s) => s.id === selectedMcqSetId) : null;
      if (activeSet) {
        title = `${activeSet.courseCode} ${activeSet.termLabel} MCQs (${activeSet.questions.length} Qs) – ${activeSet.courseTitle} | MIHORA VU`;
        desc = `Practice ${activeSet.questions.length} verified ${activeSet.courseCode} (${activeSet.courseTitle}) ${activeSet.termLabel} MCQs online with instant answers, timed mock exam mode, and quick revision flash-sheets on MIHORA VU.`;
      } else {
        title = 'Interactive VU Exam MCQs & Subject Mock Quizzes (Mid-Term & Final) | MIHORA VU';
        desc = 'Practice verified Virtual University Midterm and Final-Term MCQs on dedicated subject pages with instant answers, timed mock exams, and rapid revision flash-sheets for CS201, CS301, CS304, CS403, CS504, and CS601.';
      }
    } else if (currentPage === 'handbook') {
      title = 'VU Student Handbook 2026 – 20% Passing Rule, Datesheet & Rules FAQs | MIHORA VU';
      desc = 'Official VU rules guide: Master the 20% two-half passing rule, datesheet creation, fee installments, CGPA probation, and paper reschedule policies on MIHORA VU.';
    } else if (currentPage === 'simulator') {
      title = 'VU Passing Marks Simulator – 20% Two-Half Rule & Finalterm Calculator | MIHORA VU';
      desc = 'Calculate exact marks needed in VU Final Term exams. Check compliance with the official 20% Two-Half rule and download your free academic PDF report on MIHORA VU.';
    } else if (currentPage === 'gpa-calculator') {
      title = 'VU GPA & CGPA Calculator 4.0 – Academic Grade Forecaster | MIHORA VU';
      desc = 'Calculate Virtual University semester GPA and forecast cumulative CGPA under the official HEC 4.0 scale. Includes academic probation checker and repeat policy guide.';
    } else if (currentPage === 'datesheet-guide') {
      title = 'VU Datesheet Maker & Seat Tracker Guide 2026 – Exam Slots Strategy | MIHORA VU';
      desc = 'Official guide to VU datesheet opening, first-come first-served lab seat allocation, preferred timeslots, and paper rescheduling procedure.';
    } else if (currentPage === 'cs619-guide') {
      title = 'CS619 Final Year Project (FYP) Roadmap & Viva Voce Guide | VU MIHORA';
      desc = 'Complete CS619 capstone project guide: Proposal, IEEE 830 SRS documentation, ERD database design, test phases, and top 25 viva voce defense questions.';
    } else if (currentPage === 'security') {
      title = 'Privacy & Trust Guarantee – Zero Student Data Collection | MIHORA VU';
      desc = 'Our student safety commitment: zero cookies, zero telemetry, verified clean academic files, and instant direct downloads without login.';
    } else if (currentPage === 'about') {
      title = 'About MIHORA TECH – Free Academic Resource Initiative for VU Students';
      desc = 'Learn about MIHORA TECH\'s non-commercial educational CSR mission to provide free, fast, and structured academic study archives for Pakistani students.';
    } else if (currentPage === 'sitemap') {
      title = 'VU Curriculum & Faculty Sitemap Directory – 411 Courses Index | MIHORA VU';
      desc = 'Comprehensive portal map of all Virtual University faculties, departments, 411 courses, handbook guides, passing calculators, and XML sitemaps.';
    } else if (currentPage === 'disclaimer') {
      title = 'Academic Disclaimer & Fair Educational Use Notice | MIHORA VU';
      desc = 'Fair educational use disclosures, copyright policies, student ethics, and independent non-affiliation notice with Virtual University.';
    }

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', desc);
    }
    const canonicalPath =
      currentPage === 'mcqs' && selectedMcqSetId
        ? `/mcqs/${selectedMcqSetId}`
        : pagePathMap[currentPage] || '/';
    const canonicalUrl = `https://study.mihora.tech${canonicalPath}`;
    const canonicalEl = document.querySelector('link[rel="canonical"]');
    if (canonicalEl) {
      canonicalEl.setAttribute('href', canonicalUrl);
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', desc);
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', canonicalUrl);
  }, [currentPage, filters.course, selectedMcqSetId]);

  // Compute search results with ranking algorithm
  const { resources: filteredResources, totalCount: totalMatchingCount } = useMemo(() => {
    return searchResources(resources, query, filters, limit);
  }, [query, filters, limit]);

  // Handle single resource download with Resilient Shard Fallback
  const handleDownload = async (resource: Resource) => {
    setDownloadSession({
      rlh: resource.rlh,
      name: resource.name,
      format: resource.format,
      course: resource.course,
      status: 'resolving'
    });

    try {
      let downloadUrl = '';
      let token: string | undefined = undefined;
      let expiresIn: number | undefined = undefined;

      // Stage 1A: Attempt Server-side Relay (Active in local dev or configured relay)
      try {
        const res = await fetch('/api/resolve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rlh: resource.rlh })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.ok && data.downloadUrl) {
            downloadUrl = data.downloadUrl;
            token = data.token;
            expiresIn = data.expiresIn;
          }
        }
      } catch {
        // Fallback to client-side shard resolution
      }

      // Stage 1B: Resilient Static Fallback (for GitHub Pages static deployments)
      if (!downloadUrl) {
        const resolved = await resolveResourceLocally(resource.rlh);
        downloadUrl = resolved.directDownloadUrl;
      }

      if (!downloadUrl) {
        throw new Error('Resource not available.');
      }

      setDownloadSession((prev) =>
        prev
          ? {
              ...prev,
              status: 'ready',
              token,
              downloadUrl,
              expiresIn: expiresIn || 120
            }
          : null
      );

      // Automatically trigger stage 2 download
      triggerFileStream(downloadUrl);
    } catch (err: any) {
      setDownloadSession((prev) =>
        prev
          ? {
              ...prev,
              status: 'error',
              errorMessage: err.message || 'This resource is temporarily unavailable.'
            }
          : null
      );
    }
  };

  // Trigger file stream through hidden anchor or window navigation
  const triggerFileStream = (downloadUrl: string) => {
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
      setDownloadSession((prev) => (prev ? { ...prev, status: 'complete' } : null));
    }, 1000);
  };

  // Handle multi-download ZIP archive with static fallback
  const handleDownloadZip = async () => {
    if (selectedRLHs.size === 0) return;
    setIsDownloadingZip(true);

    try {
      const rlhArray = Array.from(selectedRLHs);
      const courseLabel = filters.course || 'Mihora_Study';
      const zipName = `${courseLabel}_Selected_Resources`;

      let downloadUrl = '';

      try {
        const res = await fetch('/api/resolve-multi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rlhs: rlhArray, zipName })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.ok && data.downloadUrl) {
            downloadUrl = data.downloadUrl;
          }
        }
      } catch {
        // Fallback
      }

      if (downloadUrl) {
        triggerFileStream(downloadUrl);
      } else {
        // Static GitHub Pages fallback: sequential trigger of selected downloads
        for (const rlh of rlhArray) {
          try {
            const resolved = await resolveResourceLocally(rlh);
            triggerFileStream(resolved.directDownloadUrl);
            await new Promise((r) => setTimeout(r, 600));
          } catch (e) {
            console.warn('Could not resolve item in batch:', rlh, e);
          }
        }
      }
    } catch (err) {
      console.error('Batch download failed:', err);
    } finally {
      setIsDownloadingZip(false);
    }
  };

  const handleToggleSelect = (rlh: string) => {
    setSelectedRLHs((prev) => {
      const next = new Set(prev);
      if (next.has(rlh)) {
        next.delete(rlh);
      } else {
        if (next.size >= 50) {
          return next;
        }
        next.add(rlh);
      }
      return next;
    });
  };

  const handleSelectAllVisible = () => {
    setSelectedRLHs((prev) => {
      const next = new Set(prev);
      const visibleRLHs = filteredResources.map((r) => r.rlh);
      const allSelected = visibleRLHs.every((id) => next.has(id));

      if (allSelected) {
        visibleRLHs.forEach((id) => next.delete(id));
      } else {
        visibleRLHs.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const handleClearSelection = () => {
    setSelectedRLHs(new Set());
  };

  const scrollToSearch = () => {
    searchResultsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen flex flex-col bg-celestial-canvas bg-star-dust text-slate-900 font-sans">
        {/* Subtle fixed ambient celestial aurora washes across light sections */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden z-0">
          <div className="absolute -top-40 left-1/4 w-[520px] h-[360px] rounded-full bg-sky-400/[0.06] blur-[110px]" />
          <div className="absolute top-1/2 -right-32 w-[460px] h-[420px] rounded-full bg-indigo-500/[0.06] blur-[120px]" />
          <div className="absolute -bottom-32 -left-24 w-[420px] h-[340px] rounded-full bg-amber-400/[0.045] blur-[110px]" />
        </div>
        {/* Top Bar Navigation */}
        <Navbar
          currentPage={currentPage}
          onNavigate={(p) => handleNavigate(p as AppPage)}
          selectedCount={selectedRLHs.size}
        />

        <motion.div
          key={`${currentPage}-${selectedMcqSetId || 'hub'}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: EASE_OUT_EXPO }}
          className="relative z-10 flex-1 flex flex-col"
        >
          {/* 1. Page: Home / Search Catalog */}
          {currentPage === 'home' && (
            <>
              {/* Hero Section */}
              <Hero
                query={query}
                onQueryChange={(val) => {
                  setQuery(val);
                }}
                onSearchSubmit={() => {
                  scrollToSearch();
                }}
                onCategoryClick={(cat) => {
                  setQuery(cat);
                  scrollToSearch();
                }}
                onCourseClick={(code) => {
                  setFilters((prev) => ({ ...prev, course: code }));
                  setQuery('');
                  scrollToSearch();
                }}
                totalResources={resources.length}
                totalCourses={courses.length}
                courses={courses}
                onOpenMcqs={() => handleSelectMcqSet(null)}
                onOpenPastPapers={() => handleNavigate('past-papers')}
                onOpenSimulator={() => handleNavigate('simulator')}
              />

              {/* Scroll-Revealed Interactive Subject MCQ Bento Strip */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-2 w-full">
                <ScrollReveal direction="up" distance={20} className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-blue-700">
                        <ListChecks className="w-4 h-4" />
                        <span>Subject MCQ Studio</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 mt-0.5">
                        Interactive Mid-Term &amp; Final Quizzes
                      </h2>
                    </div>

                    <motion.a
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.97 }}
                      href="/mcqs"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSelectMcqSet(null);
                      }}
                      className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors self-start sm:self-auto"
                    >
                      <span>Open All {mcqSets.length} Subject Studios</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </motion.a>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {mcqSets.map((set, idx) => {
                      const badgeColors: Record<string, string> = {
                        CS201: 'bg-blue-600 text-white',
                        CS301: 'bg-indigo-600 text-white',
                        CS304: 'bg-violet-600 text-white',
                        CS403: 'bg-teal-600 text-white',
                        CS504: 'bg-sky-600 text-white',
                        CS601: 'bg-amber-600 text-white'
                      };
                      const badgeCls = badgeColors[set.courseCode] || 'bg-slate-900 text-white';

                      return (
                        <motion.a
                          key={set.id}
                          href={`/mcqs/${set.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            handleSelectMcqSet(set.id);
                          }}
                          initial={{ opacity: 0, y: 18, scale: 0.98 }}
                          whileInView={{ opacity: 1, y: 0, scale: 1 }}
                          viewport={{ once: true, amount: 'some' }}
                          transition={{
                            duration: 0.34,
                            delay: Math.min(idx * 0.045, 0.28),
                            ease: EASE_OUT_EXPO
                          }}
                          whileHover={{ y: -5, scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          className="celestial-top-glint group card-celestial rounded-2xl border p-4 flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-11 h-11 rounded-xl ${badgeCls} font-mono font-bold text-[11px] flex items-center justify-center shrink-0 shadow-xs transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-3`}
                            >
                              {set.courseCode}
                            </div>
                            <div className="min-w-0">
                              <div className="text-[11px] font-mono text-slate-500 tabular-nums">
                                <span className={set.term === 'finalterm' ? 'text-amber-700 font-semibold' : ''}>
                                  {set.termLabel}
                                </span>{' '}
                                · {set.questions.length} Qs
                              </div>
                              <h3 className="text-sm font-bold text-slate-950 group-hover:text-blue-700 transition-colors truncate">
                                {set.courseTitle}
                              </h3>
                            </div>
                          </div>

                          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all shrink-0" />
                        </motion.a>
                      );
                    })}
                  </div>
                </ScrollReveal>
              </section>

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-6">
                <CelestialDivider />
              </div>

              {/* Main Interactive Catalog */}
              <main
                ref={searchResultsRef}
                id="catalog"
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full"
              >
                {/* Filter Control Surface */}
                <FilterBar
                  filters={filters}
                  onFilterChange={setFilters}
                  courses={courses}
                  limit={limit}
                  onLimitChange={setLimit}
                  totalFiltered={filteredResources.length}
                  totalMatching={totalMatchingCount}
                />

                {/* Resource Cards Grid */}
                <div className="mt-8">
                  {filteredResources.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="celestial-top-glint card-celestial rounded-3xl border p-12 text-center space-y-4"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200/80 flex items-center justify-center mx-auto text-blue-600">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-slate-900">
                          No resources matched your criteria
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                          Try clearing active filters or searching with a broader keyword (e.g., &ldquo;midterm&rdquo;, &ldquo;handouts&rdquo;, or &ldquo;CS101&rdquo;).
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setQuery('');
                          setFilters({
                            course: '',
                            type: '',
                            format: '',
                            tags: [],
                            solvedOnly: false,
                            pastPapersOnly: false,
                            currentOnly: false
                          });
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
                      >
                        <span>Reset All Filters</span>
                      </button>
                    </motion.div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                      {filteredResources.map((res, idx) => (
                        <ResourceCard
                          key={res.rlh}
                          resource={res}
                          index={idx}
                          isSelected={selectedRLHs.has(res.rlh)}
                          onToggleSelect={handleToggleSelect}
                          onDownload={handleDownload}
                          onPreview={setPreviewResource}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Pagination / Load More */}
                {filteredResources.length < totalMatchingCount && (
                  <ScrollReveal direction="up" distance={16} className="mt-12 text-center space-y-2">
                    <AnimatedButton
                      magnetic
                      shimmer
                      type="button"
                      onClick={() => setLimit((prev) => prev + 24)}
                      className="px-6 py-2.5 rounded-xl card-celestial border border-sky-300/70 hover:border-blue-500 text-slate-800 hover:text-blue-700 font-semibold text-xs sm:text-sm cursor-pointer"
                    >
                      Load More Resources ({totalMatchingCount - filteredResources.length} remaining)
                    </AnimatedButton>
                    <p className="text-[11px] text-slate-400 tabular-nums">
                      Showing {filteredResources.length} of {totalMatchingCount.toLocaleString()} matching documents
                    </p>
                  </ScrollReveal>
                )}

                <CelestialDivider className="mt-12" />

                {/* Scroll-Animated VU Student Toolkit Showcase */}
                <section className="mt-10 space-y-5">
                  <ScrollReveal direction="up" distance={18} className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                    <div>
                      <div className="text-xs font-mono font-semibold uppercase tracking-wider text-blue-700">
                        Academic Toolkit &amp; Exam Planning
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 mt-0.5">
                        Essential Virtual University Tools
                      </h2>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-md">
                      Built specifically around VULMS rules, the 20% two-half passing threshold, and 2026 semester deadlines.
                    </p>
                  </ScrollReveal>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      {
                        page: 'assignment-guide' as AppPage,
                        title: 'Assignments 2026 Hub',
                        kicker: '24h Grace · Turnitin',
                        desc: 'Formatting templates, Dev-C++ boilerplate, and plagiarism-safe writing checklists.',
                        icon: <FileText className="w-5 h-5 text-emerald-700" />,
                        iconBg: 'bg-emerald-50 border-emerald-200/70',
                        glow: 'rgba(16, 185, 129, 0.10)'
                      },
                      {
                        page: 'simulator' as AppPage,
                        title: 'Passing Marks Simulator',
                        kicker: '20% Two-Half Rule',
                        desc: 'Simulate your midterms, quizzes, and assignments to see exact Final-Term marks needed.',
                        icon: <Calculator className="w-5 h-5 text-blue-700" />,
                        iconBg: 'bg-blue-50 border-blue-200/70',
                        glow: 'rgba(37, 99, 235, 0.10)'
                      },
                      {
                        page: 'gpa-calculator' as AppPage,
                        title: 'GPA & CGPA Forecaster',
                        kicker: 'HEC 4.0 Scale',
                        desc: 'Plan credit hours and predict your semester GPA and cumulative CGPA standing.',
                        icon: <Award className="w-5 h-5 text-indigo-700" />,
                        iconBg: 'bg-indigo-50 border-indigo-200/70',
                        glow: 'rgba(99, 102, 241, 0.10)'
                      },
                      {
                        page: 'handbook' as AppPage,
                        title: 'Student Handbook & FAQs',
                        kicker: 'Rules · Datesheet',
                        desc: 'Clear answers on paper rescheduling, grace periods, and exam seat strategy.',
                        icon: <GraduationCap className="w-5 h-5 text-amber-700" />,
                        iconBg: 'bg-amber-50 border-amber-200/70',
                        glow: 'rgba(217, 119, 6, 0.10)'
                      }
                    ].map((tool, idx) => (
                      <motion.div
                        key={tool.page}
                        initial={{ opacity: 0, y: 20, scale: 0.98 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true, amount: 'some' }}
                        transition={{
                          duration: 0.38,
                          delay: idx * 0.06,
                          ease: EASE_OUT_EXPO
                        }}
                      >
                        <SpotlightCard
                          onClick={() => handleNavigate(tool.page)}
                          spotlightColor={tool.glow}
                          className="group h-full card-celestial rounded-2xl border p-5 cursor-pointer"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-3 ${tool.iconBg}`}>
                                {tool.icon}
                              </div>
                              <span className="text-[11px] font-mono text-slate-500">
                                {tool.kicker}
                              </span>
                            </div>
                            <h3 className="text-base font-bold text-slate-950 group-hover:text-blue-700 transition-colors mt-4">
                              {tool.title}
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                              {tool.desc}
                            </p>
                          </div>
                          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-700">
                            <span>Open Tool</span>
                            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1.5" />
                          </div>
                        </SpotlightCard>
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* Dark Celestial Observatory Curriculum Callout */}
                <ScrollReveal
                  direction="up"
                  distance={22}
                  className="mt-14 relative overflow-hidden bg-studio-stage text-white rounded-3xl p-7 sm:p-10 border border-slate-800 shadow-[0_24px_60px_-15px_rgba(4,8,20,0.65)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <CelestialOrbitalRings compact />
                  <div className="absolute inset-0 bg-academic-grid opacity-35 pointer-events-none" aria-hidden="true" />
                  <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-400/55 to-transparent" aria-hidden="true" />
                  <div className="relative z-10 space-y-2 max-w-2xl">
                    <div className="text-xs font-mono font-semibold uppercase tracking-wider text-sky-300">
                      Curriculum Archive · 411 Accredited Subjects
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                      Looking for past papers or handouts by subject?
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Browse all 411 Virtual University courses organized across Computer Science, Software Engineering, Mathematics, Management, Economics, and Zoology.
                    </p>
                  </div>
                  <AnimatedButton
                    magnetic
                    shimmer
                    type="button"
                    onClick={() => handleNavigate('courses')}
                    className="relative z-10 group px-6 py-3.5 rounded-xl bg-gradient-to-r from-white to-sky-50 hover:from-sky-300 hover:to-amber-200 text-slate-950 font-bold text-xs sm:text-sm transition-all cursor-pointer shrink-0 inline-flex items-center gap-2 whitespace-nowrap shadow-[0_10px_30px_-8px_rgba(56,189,248,0.45)]"
                  >
                    <span>Explore 411 Courses</span>
                    <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </AnimatedButton>
                </ScrollReveal>
              </main>
            </>
          )}

        {/* 2. Page: Course Directory */}
        {currentPage === 'courses' && (
          <CoursesPage courses={courses} onSelectCourse={handleSelectCourse} />
        )}

        {/* 3. Page: Exam Passing Marks Simulator */}
        {currentPage === 'simulator' && (
          <PassingSimulatorPage onSelectCourse={handleSelectCourse} />
        )}

        {/* 3B. Page: Student Handbook & Essential Rules */}
        {currentPage === 'handbook' && (
          <StudentHandbookPage
            onNavigateToSimulator={() => handleNavigate('simulator')}
            onNavigateToCourses={() => handleNavigate('courses')}
          />
        )}

        {/* Page: VU GPA & CGPA Calculator */}
        {currentPage === 'gpa-calculator' && (
          <VUGPACalculatorPage
            onNavigateHome={() => handleNavigate('home')}
            onSelectCourse={handleSelectCourse}
          />
        )}

        {/* Page: VU Datesheet Guide & Seat Strategy */}
        {currentPage === 'datesheet-guide' && (
          <VUDatesheetGuidePage
            onNavigateHome={() => handleNavigate('home')}
            onNavigateSimulator={() => handleNavigate('simulator')}
          />
        )}

        {/* Page: CS619 Final Year Project Hub */}
        {currentPage === 'cs619-guide' && (
          <VUCS619GuidePage
            onNavigateHome={() => handleNavigate('home')}
            onSelectCourse={handleSelectCourse}
          />
        )}

        {/* Page: Assignment & GDB Solutions Formatting Guide */}
        {currentPage === 'assignment-guide' && (
          <VUAssignmentGuidePage
            onNavigateHome={() => handleNavigate('home')}
            onNavigateHandbook={() => handleNavigate('handbook')}
            onSelectCourse={handleSelectCourse}
          />
        )}

        {/* Page: Solved Past Papers (Moaaz & Waqar Siddhu Archives) */}
        {currentPage === 'past-papers' && (
          <PastPapersPage
            onSelectCourseInLibrary={handleSelectCourse}
          />
        )}

        {/* Page: Interactive MCQs Hub & Dedicated Subject Pages */}
        {currentPage === 'mcqs' && (
          <MCQsPage
            activeSetId={selectedMcqSetId}
            onSelectSetId={handleSelectMcqSet}
            onSelectCourseInLibrary={handleSelectCourse}
          />
        )}

        {/* 4. Page: Security & Relay Technical Architecture */}
        {currentPage === 'security' && (
          <SecurityPage onNavigateHome={() => handleNavigate('home')} />
        )}

        {/* 4. Page: About Mihora Tech & VU Initiative */}
        {currentPage === 'about' && (
          <AboutPage
            onNavigateHome={() => handleNavigate('home')}
            onNavigateCourses={() => handleNavigate('courses')}
          />
        )}

        {/* 5. Page: Interactive Sitemap */}
        {currentPage === 'sitemap' && (
          <SitemapPage
            courses={courses}
            onSelectCourse={handleSelectCourse}
            onNavigate={(p) => handleNavigate(p as AppPage)}
          />
        )}

        {/* 6. Page: Academic Disclaimer & Terms */}
        {currentPage === 'disclaimer' && (
          <DisclaimerPage
            onNavigateHome={() => handleNavigate('home')}
            onNavigateCourses={() => handleNavigate('courses')}
          />
        )}
        </motion.div>

        {/* Floating Multi-Download Action Bar */}
        <MultiDownloadBar
          selectedCount={selectedRLHs.size}
          totalVisible={filteredResources.length}
          onClear={handleClearSelection}
          onSelectAllVisible={handleSelectAllVisible}
          onDownloadZip={handleDownloadZip}
          isDownloadingZip={isDownloadingZip}
        />

        {/* Two-Stage Download Status Dialog */}
        <DownloadModal
          session={downloadSession}
          onClose={() => setDownloadSession(null)}
          onTriggerDownload={() => {
            if (downloadSession?.downloadUrl) {
              triggerFileStream(downloadSession.downloadUrl);
            }
          }}
        />

        {/* Online File Reading & Preview Modal */}
        <FilePreviewModal
          resource={previewResource}
          onClose={() => setPreviewResource(null)}
        />

        {/* Clean Institutional Celestial Footer */}
        <footer className="relative bg-studio-stage text-white border-t border-slate-800 mt-20 pt-14 pb-12 overflow-hidden">
          <CelestialStarfield density={0.45} interactive={false} />
          <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-400/50 to-transparent" aria-hidden="true" />
          <div className="absolute inset-0 bg-academic-grid opacity-30 pointer-events-none" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
              <div className="space-y-3">
                <MihoraLogo variant="white" size="md" />
                <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
                  MIHORA STUDY LIBRARY is an independent, non-commercial educational CSR initiative engineered by <strong>MIHORA TECH</strong> for students of the Virtual University of Pakistan.
                </p>
                <div className="pt-1">
                  <a
                    href="https://www.mihora.tech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-slate-200 hover:text-white font-medium"
                  >
                    <span>www.mihora.tech</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="font-semibold text-white uppercase tracking-wider text-[11px]">
                  Academic Portal
                </div>
                <ul className="space-y-2 text-slate-300">
                  <li>
                    <a
                      href="/"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigate('home');
                      }}
                      className="hover:text-white transition-colors"
                    >
                      Search 28,328+ Documents
                    </a>
                  </li>
                  <li>
                    <a
                      href="/courses"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigate('courses');
                      }}
                      className="hover:text-white transition-colors"
                    >
                      All 411 VU Courses
                    </a>
                  </li>
                  <li>
                    <a
                      href="/handbook"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigate('handbook');
                      }}
                      className="hover:text-white transition-colors"
                    >
                      VU Student Handbook &amp; FAQs
                    </a>
                  </li>
                  <li>
                    <a
                      href="/simulator"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigate('simulator');
                      }}
                      className="hover:text-white transition-colors"
                    >
                      Exam Passing Marks Simulator
                    </a>
                  </li>
                  <li>
                    <a
                      href="/sitemap"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigate('sitemap');
                      }}
                      className="hover:text-white transition-colors"
                    >
                      Curriculum Directory
                    </a>
                  </li>
                </ul>
              </div>

              <div className="space-y-3 text-xs">
                <div className="font-semibold text-white uppercase tracking-wider text-[11px]">
                  MCQs &amp; Study Tools
                </div>
                <ul className="space-y-2 text-slate-300">
                  <li>
                    <a
                      href="/mcqs"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSelectMcqSet(null);
                      }}
                      className="hover:text-white transition-colors font-medium text-amber-300"
                    >
                      Interactive Subject MCQ Pages
                    </a>
                  </li>
                  <li>
                    <a
                      href="/vu-assignment-solution-2026"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigate('assignment-guide');
                      }}
                      className="hover:text-white transition-colors"
                    >
                      VU Assignment Solution 2026
                    </a>
                  </li>
                  <li>
                    <a
                      href="/past-papers"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigate('past-papers');
                      }}
                      className="hover:text-white transition-colors"
                    >
                      Solved Past Papers (Moaaz &amp; Waqar)
                    </a>
                  </li>
                  <li>
                    <a
                      href="/gpa-calculator"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigate('gpa-calculator');
                      }}
                      className="hover:text-white transition-colors"
                    >
                      VU GPA &amp; CGPA Calculator (4.0)
                    </a>
                  </li>
                  <li>
                    <a
                      href="/datesheet-guide"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigate('datesheet-guide');
                      }}
                      className="hover:text-white transition-colors"
                    >
                      Datesheet Maker Guide &amp; Tips
                    </a>
                  </li>
                  <li>
                    <a
                      href="/cs619-guide"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigate('cs619-guide');
                      }}
                      className="hover:text-white transition-colors"
                    >
                      CS619 FYP Roadmap &amp; Viva Voce
                    </a>
                  </li>
                </ul>
              </div>

              <div className="space-y-3 text-xs">
                <div className="font-semibold text-white uppercase tracking-wider text-[11px]">
                  Trust &amp; Governance
                </div>
                <ul className="space-y-2 text-slate-300">
                  <li>
                    <a
                      href="/security"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigate('security');
                      }}
                      className="hover:text-white transition-colors"
                    >
                      Trust &amp; Privacy Guarantee
                    </a>
                  </li>
                  <li>
                    <a
                      href="/about"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigate('about');
                      }}
                      className="hover:text-white transition-colors"
                    >
                      About MIHORA TECH Initiative
                    </a>
                  </li>
                  <li>
                    <a
                      href="/disclaimer"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigate('disclaimer');
                      }}
                      className="hover:text-white transition-colors"
                    >
                      Academic Notice &amp; Disclaimer
                    </a>
                  </li>
                  <li>
                    <a
                      href="/sitemap.xml"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors font-mono text-[11px]"
                    >
                      XML Sitemap
                    </a>
                  </li>
                  <li>
                    <a
                      href="/robots.txt"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors font-mono text-[11px]"
                    >
                      Robots.txt
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-2 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-slate-400" />
                    <span>All 411 Courses Quick Index</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Jump directly to verified solved past papers, handouts, and assignment templates for any course code.
                  </div>
                </div>

                <motion.button
                  whileHover={{ y: -1.5 }}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={() => setShowAllCoursesFooter(!showAllCoursesFooter)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-medium border border-slate-700 transition-colors cursor-pointer self-start sm:self-auto shrink-0"
                >
                  <span>{showAllCoursesFooter ? 'Collapse 411 Courses' : 'Browse All 411 Courses'}</span>
                  {showAllCoursesFooter ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </motion.button>
              </div>

              <AnimatePresence>
                {showAllCoursesFooter && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.28, ease: EASE_OUT_EXPO }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 max-h-96 overflow-y-auto text-xs">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                        {courses.map((c) => (
                          <motion.a
                            key={c.code}
                            whileHover={{ y: -2 }}
                            href={`/courses?course=${c.code}`}
                            onClick={(e) => {
                              e.preventDefault();
                              handleSelectCourse(c.code);
                            }}
                            className="p-2 rounded-lg bg-[#0B1526] hover:bg-slate-800 border border-slate-800 hover:border-blue-500/40 text-slate-300 hover:text-white transition-colors block text-left"
                            title={`${c.code} - ${c.title}`}
                          >
                            <div className="font-mono font-semibold text-amber-300 text-[11px]">
                              {c.code}
                            </div>
                            <div className="text-[11px] text-slate-400 line-clamp-1">
                              {c.title}
                            </div>
                          </motion.a>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 pt-4 border-t border-slate-800">
              <div>
                &copy; {new Date().getFullYear()} MIHORA TECH. Free Academic Resource Initiative.
              </div>
              <div className="text-xs text-slate-400 text-center sm:text-right">
                study.mihora.tech · <a href="https://www.mihora.tech" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white hover:underline">www.mihora.tech</a>
              </div>
            </div>
          </motion.div>
        </footer>

        {/* Circular Scroll-Progress Back-to-Top Floating Button */}
        <FloatingScrollTop liftForBar={selectedRLHs.size > 0} />
      </div>
    </MotionConfig>
  );
}
