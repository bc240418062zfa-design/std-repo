import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MotionConfig, motion, AnimatePresence } from 'motion/react';
import { Resource, Course, FilterState, DownloadSession } from './types';
import { searchResources } from './search/searchEngine';
import { resolveResourceLocally } from './security/shardResolver';
import { mcqSets } from './data/mcqs';
import { subjectiveSets } from './data/subjective';
import { Navbar } from './components/Navbar';
import { BreadcrumbBar, BreadcrumbItem } from './components/BreadcrumbBar';
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
import { syncRouteSeo } from './utils/seoManager';
import observatoryArt from './assets/images/mihora_observatory_art_1795287185839.jpg';
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
import { SubjectivePage } from './pages/SubjectivePage';
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
  GraduationCap,
  Flame,
  Zap
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
  | 'subjective'
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
  subjective: '/subjective',
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
  if (
    pathname === '/subjective' ||
    pathname.startsWith('/subjective/') ||
    pathname === '/fast-learning'
  ) return 'subjective';
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
  if (hash === '#subjective' || hash === '#subjective-prep') return 'subjective';
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

function getSubjectiveSetIdFromPath(): string | null {
  if (typeof window === 'undefined') return null;
  const pathname = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length < 2) return null;
  if (parts[0] !== 'subjective') return null;

  const slug = parts[1];
  const exact = subjectiveSets.find((s) => s.id === slug);
  if (exact) return exact.id;

  const subAlias = subjectiveSets.find((s) => s.id === `${slug}-subjective`);
  if (subAlias) return subAlias.id;

  const byCourse = subjectiveSets.find((s) => s.courseCode.toLowerCase() === slug);
  return byCourse ? byCourse.id : null;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>(getPageFromPath);
  const [selectedMcqSetId, setSelectedMcqSetId] = useState<string | null>(getMcqSetIdFromPath);
  const [selectedSubjectiveSetId, setSelectedSubjectiveSetId] = useState<string | null>(
    getSubjectiveSetIdFromPath
  );
  const [examStudioTab, setExamStudioTab] = useState<'mcqs' | 'subjective'>('mcqs');
  const [pastPapersCourse, setPastPapersCourse] = useState<string>('CS101');

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
      setSelectedSubjectiveSetId(getSubjectiveSetIdFromPath());
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
    if (page === 'subjective') {
      setSelectedSubjectiveSetId(null);
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

  const handleSelectSubjectiveSet = (setId: string | null) => {
    setCurrentPage('subjective');
    setSelectedSubjectiveSetId(setId);
    const targetPath = setId ? `/subjective/${setId}` : '/subjective';
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

  // Dynamically synchronize document title, OpenGraph, canonical URL, and JSON-LD (SEO + AEO Speakable)
  useEffect(() => {
    const activeMcqSet = selectedMcqSetId
      ? mcqSets.find((s) => s.id === selectedMcqSetId) || null
      : null;
    const activeSubjectiveSet = selectedSubjectiveSetId
      ? subjectiveSets.find((s) => s.id === selectedSubjectiveSetId) || null
      : null;
    const totalMcqQuestions = mcqSets.reduce((sum, s) => sum + s.questions.length, 0);
    const totalSubjectiveQuestions = subjectiveSets.reduce((sum, s) => sum + s.questions.length, 0);

    syncRouteSeo({
      page: currentPage,
      selectedMcqSet: activeMcqSet,
      selectedSubjectiveSet: activeSubjectiveSet,
      selectedCourseCode: filters.course,
      courses,
      totalResources: resources.length,
      totalMcqQuestions,
      totalSubjectiveQuestions
    });
  }, [currentPage, filters.course, selectedMcqSetId, selectedSubjectiveSetId]);

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

  const breadcrumbConfig = useMemo<{
    items: BreadcrumbItem[];
    actionLabel?: string;
    actionHref?: string;
    onAction?: () => void;
    actionVariant?: 'clear' | 'back';
  }>(() => {
    const homeCrumb: BreadcrumbItem = {
      label: 'Library',
      href: '/',
      onClick: () => {
        setFilters((prev) => ({ ...prev, course: '' }));
        setQuery('');
        handleNavigate('home');
      }
    };

    if (currentPage === 'home') {
      if (filters.course) {
        const match = courses.find((c) => c.code === filters.course);
        return {
          items: [
            homeCrumb,
            {
              label: `Courses (${courses.length})`,
              href: '/courses',
              onClick: () => handleNavigate('courses')
            },
            {
              label: match ? `${filters.course} – ${match.title}` : filters.course
            }
          ],
          actionLabel: `Clear ${filters.course}`,
          onAction: () => {
            setFilters((prev) => ({ ...prev, course: '' }));
            if (window.location.pathname !== '/') {
              window.history.pushState(null, '', '/');
            }
          },
          actionVariant: 'clear'
        };
      }
      if (query.trim()) {
        return {
          items: [
            homeCrumb,
            { label: `Search: "${query.trim()}"` }
          ],
          actionLabel: 'Clear Search',
          onAction: () => setQuery(''),
          actionVariant: 'clear'
        };
      }
      return { items: [] };
    }

    if (currentPage === 'courses') {
      return {
        items: [homeCrumb, { label: `Courses Directory (${courses.length})` }],
        actionLabel: 'Back to Library',
        actionHref: '/',
        onAction: () => handleNavigate('home')
      };
    }

    if (currentPage === 'past-papers') {
      return {
        items: [homeCrumb, { label: 'Solved Past Papers' }],
        actionLabel: 'All Courses',
        actionHref: '/courses',
        onAction: () => handleNavigate('courses')
      };
    }

    if (currentPage === 'mcqs') {
      const activeSet = selectedMcqSetId
        ? mcqSets.find((s) => s.id === selectedMcqSetId) || null
        : null;
      if (activeSet) {
        return {
          items: [
            homeCrumb,
            {
              label: 'Interactive MCQs',
              href: '/mcqs',
              onClick: () => handleSelectMcqSet(null)
            },
            { label: `${activeSet.courseCode} ${activeSet.termLabel} (${activeSet.questions.length} Qs)` }
          ],
          actionLabel: 'All MCQ Studios',
          actionHref: '/mcqs',
          onAction: () => handleSelectMcqSet(null)
        };
      }
      return {
        items: [homeCrumb, { label: 'Interactive MCQs' }],
        actionLabel: 'Subjective Fast-Learning',
        actionHref: '/subjective',
        onAction: () => handleSelectSubjectiveSet(null)
      };
    }

    if (currentPage === 'subjective') {
      const activeSub = selectedSubjectiveSetId
        ? subjectiveSets.find((s) => s.id === selectedSubjectiveSetId) || null
        : null;
      if (activeSub) {
        return {
          items: [
            homeCrumb,
            {
              label: 'Subjective Fast-Learning',
              href: '/subjective',
              onClick: () => handleSelectSubjectiveSet(null)
            },
            { label: `${activeSub.courseCode} – ${activeSub.courseTitle}` }
          ],
          actionLabel: 'All Subjective Hubs',
          actionHref: '/subjective',
          onAction: () => handleSelectSubjectiveSet(null)
        };
      }
      return {
        items: [homeCrumb, { label: 'Subjective Fast-Learning' }],
        actionLabel: 'Interactive MCQs',
        actionHref: '/mcqs',
        onAction: () => handleSelectMcqSet(null)
      };
    }

    if (currentPage === 'assignment-guide') {
      return {
        items: [
          homeCrumb,
          {
            label: 'VU Handbook',
            href: '/handbook',
            onClick: () => handleNavigate('handbook')
          },
          { label: 'Assignments 2026 & Turnitin Guide' }
        ],
        actionLabel: 'Back to Library',
        actionHref: '/',
        onAction: () => handleNavigate('home')
      };
    }

    if (currentPage === 'handbook') {
      return {
        items: [homeCrumb, { label: 'VU Student Handbook & FAQs' }],
        actionLabel: 'Passing Simulator',
        actionHref: '/simulator',
        onAction: () => handleNavigate('simulator')
      };
    }

    if (currentPage === 'simulator') {
      return {
        items: [homeCrumb, { label: 'Passing Marks Simulator' }],
        actionLabel: 'GPA Calculator',
        actionHref: '/gpa-calculator',
        onAction: () => handleNavigate('gpa-calculator')
      };
    }

    if (currentPage === 'gpa-calculator') {
      return {
        items: [homeCrumb, { label: 'VU GPA & CGPA Calculator' }],
        actionLabel: 'Passing Simulator',
        actionHref: '/simulator',
        onAction: () => handleNavigate('simulator')
      };
    }

    if (currentPage === 'datesheet-guide') {
      return {
        items: [
          homeCrumb,
          {
            label: 'VU Handbook',
            href: '/handbook',
            onClick: () => handleNavigate('handbook')
          },
          { label: 'Datesheet Seat Strategy Guide' }
        ],
        actionLabel: 'Back to Handbook',
        actionHref: '/handbook',
        onAction: () => handleNavigate('handbook')
      };
    }

    if (currentPage === 'cs619-guide') {
      return {
        items: [
          homeCrumb,
          {
            label: `Courses (${courses.length})`,
            href: '/courses',
            onClick: () => handleNavigate('courses')
          },
          { label: 'CS619 FYP Capstone Roadmap' }
        ],
        actionLabel: 'Browse Courses',
        actionHref: '/courses',
        onAction: () => handleNavigate('courses')
      };
    }

    if (currentPage === 'security') {
      return {
        items: [
          homeCrumb,
          {
            label: 'About MIHORA',
            href: '/about',
            onClick: () => handleNavigate('about')
          },
          { label: 'Privacy & Trust Guarantee' }
        ],
        actionLabel: 'Back to Library',
        actionHref: '/',
        onAction: () => handleNavigate('home')
      };
    }

    if (currentPage === 'about') {
      return {
        items: [homeCrumb, { label: 'About MIHORA TECH' }],
        actionLabel: 'Explore Courses',
        actionHref: '/courses',
        onAction: () => handleNavigate('courses')
      };
    }

    if (currentPage === 'sitemap') {
      return {
        items: [homeCrumb, { label: 'Curriculum & Sitemap Directory' }],
        actionLabel: 'Back to Library',
        actionHref: '/',
        onAction: () => handleNavigate('home')
      };
    }

    if (currentPage === 'disclaimer') {
      return {
        items: [
          homeCrumb,
          {
            label: 'About MIHORA',
            href: '/about',
            onClick: () => handleNavigate('about')
          },
          { label: 'Academic Disclaimer' }
        ],
        actionLabel: 'Back to Library',
        actionHref: '/',
        onAction: () => handleNavigate('home')
      };
    }

    return { items: [] };
  }, [currentPage, filters.course, query, selectedMcqSetId, selectedSubjectiveSetId]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen flex flex-col bg-celestial-canvas bg-star-dust text-slate-900 font-sans">
        {/* Subtle fixed ambient ivory-sky and warm brass washes across light sections */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden z-0">
          <div className="absolute -top-40 left-1/4 w-[520px] h-[360px] rounded-full bg-sky-400/[0.055] blur-[110px]" />
          <div className="absolute top-1/2 -right-32 w-[420px] h-[380px] rounded-full bg-blue-600/[0.045] blur-[120px]" />
          <div className="absolute -bottom-32 -left-24 w-[420px] h-[340px] rounded-full bg-amber-400/[0.045] blur-[110px]" />
        </div>
        {/* Top Bar Navigation */}
        <Navbar
          currentPage={currentPage}
          onNavigate={(p) => handleNavigate(p as AppPage)}
          selectedCount={selectedRLHs.size}
        />

        {/* Contextual Accessible Breadcrumb Rail */}
        <BreadcrumbBar
          items={breadcrumbConfig.items}
          actionLabel={breadcrumbConfig.actionLabel}
          actionHref={breadcrumbConfig.actionHref}
          onAction={breadcrumbConfig.onAction}
          actionVariant={breadcrumbConfig.actionVariant}
        />

        <motion.div
          key={`${currentPage}-${selectedMcqSetId || selectedSubjectiveSetId || 'hub'}`}
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
                onOpenSubjective={() => handleSelectSubjectiveSet(null)}
                onOpenPastPapers={() => handleNavigate('past-papers')}
                onOpenSimulator={() => handleNavigate('simulator')}
              />

              {/* Dual-Track Interactive Exam Studio Showcase (Objective MCQs + Subjective Fast-Learning) */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-2 w-full">
                <ScrollReveal direction="up" distance={20} className="space-y-6">
                  {/* Editorial Section Header & Dual-Track Segmented Switcher */}
                  <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-blue-700">
                        <Zap className="w-3.5 h-3.5" />
                        <span>Interactive Exam Preparation</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950">
                        Dual-Track Objective &amp; Subjective Studio
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
                        Switch between verified Mid/Final MCQ quizzes and structured 2/3/5-mark subjective fast-learning decks designed for rapid exam recall.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
                      <div
                        className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/90 shadow-xs"
                        role="tablist"
                        aria-label="Exam preparation track"
                      >
                        <button
                          type="button"
                          role="tab"
                          aria-selected={examStudioTab === 'mcqs'}
                          onClick={() => setExamStudioTab('mcqs')}
                          className={`relative inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                            examStudioTab === 'mcqs' ? 'text-white' : 'text-slate-600 hover:text-slate-950'
                          }`}
                        >
                          {examStudioTab === 'mcqs' && (
                            <motion.span
                              layoutId="home-exam-track"
                              transition={{ type: 'spring', stiffness: 430, damping: 32 }}
                              className="absolute inset-0 bg-blue-700 rounded-lg shadow-xs"
                            />
                          )}
                          <ListChecks className={`relative z-10 w-3.5 h-3.5 ${examStudioTab === 'mcqs' ? 'text-sky-200' : 'text-slate-400'}`} />
                          <span className="relative z-10 tabular-nums">Objective MCQs ({mcqSets.length})</span>
                        </button>

                        <button
                          type="button"
                          role="tab"
                          aria-selected={examStudioTab === 'subjective'}
                          onClick={() => setExamStudioTab('subjective')}
                          className={`relative inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                            examStudioTab === 'subjective' ? 'text-white' : 'text-slate-600 hover:text-slate-950'
                          }`}
                        >
                          {examStudioTab === 'subjective' && (
                            <motion.span
                              layoutId="home-exam-track"
                              transition={{ type: 'spring', stiffness: 430, damping: 32 }}
                              className="absolute inset-0 bg-amber-600 rounded-lg shadow-xs"
                            />
                          )}
                          <Flame className={`relative z-10 w-3.5 h-3.5 ${examStudioTab === 'subjective' ? 'text-amber-100' : 'text-slate-400'}`} />
                          <span className="relative z-10 tabular-nums">Subjective Fast-Learning ({subjectiveSets.length})</span>
                        </button>
                      </div>

                      <motion.a
                        whileHover={{ x: 2 }}
                        whileTap={{ scale: 0.97 }}
                        href={examStudioTab === 'mcqs' ? '/mcqs' : '/subjective'}
                        onClick={(e) => {
                          e.preventDefault();
                          if (examStudioTab === 'mcqs') handleSelectMcqSet(null);
                          else handleSelectSubjectiveSet(null);
                        }}
                        className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors whitespace-nowrap"
                      >
                        <span>
                          {examStudioTab === 'mcqs'
                            ? `Open All ${mcqSets.length} MCQ Studios`
                            : `Open All ${subjectiveSets.length} Subjective Studios`}
                        </span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </motion.a>
                    </div>
                  </div>

                  {/* Active Track Editorial Spotlight + Varied Grid */}
                  {examStudioTab === 'mcqs' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                      {/* Asymmetric Feature Lead Panel */}
                      <div className="lg:col-span-4 rounded-2xl bg-studio-stage text-white p-6 border border-slate-800 relative overflow-hidden flex flex-col justify-between gap-5 shadow-[0_18px_40px_-15px_rgba(2,6,23,0.55)]">
                        <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-400/60 to-transparent" />
                        <div className="space-y-3 relative z-10">
                          <div className="text-[11px] font-mono uppercase tracking-wider text-sky-300 font-semibold tabular-nums">
                            {mcqSets.reduce((acc, s) => acc + s.questions.length, 0).toLocaleString()} Verified Questions · {new Set(mcqSets.map((s) => s.courseCode)).size} Subjects
                          </div>
                          <h3 className="text-xl font-extrabold tracking-tight leading-snug">
                            Practice, Timed Mock Exams &amp; Quick Flash Sheets
                          </h3>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            Instant answer checks, 45-second-per-question exam timer simulation, topic filtering, and local mastery tracking with zero sign-up.
                          </p>
                        </div>

                        <div className="space-y-3 relative z-10">
                          <button
                            type="button"
                            onClick={() => handleSelectMcqSet(null)}
                            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-sky-50 text-slate-950 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
                          >
                            <span>Browse Full MCQ Studio Directory</span>
                            <ArrowRight className="w-4 h-4 text-blue-700" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setExamStudioTab('subjective')}
                            className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-amber-300 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
                          >
                            <span>Switch to Subjective Fast-Learning ({subjectiveSets.reduce((acc, s) => acc + s.questions.length, 0)} Q&amp;As)</span>
                            <Flame className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Subject MCQ Launch Matrix */}
                      <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                        {mcqSets.map((set, idx) => {
                          const badgeColors: Record<string, string> = {
                            CS201: 'bg-blue-700 text-white',
                            CS301: 'bg-slate-800 text-white',
                            CS304: 'bg-sky-700 text-white',
                            CS403: 'bg-teal-600 text-white',
                            CS504: 'bg-sky-600 text-white',
                            CS601: 'bg-amber-600 text-white',
                            ENG101: 'bg-emerald-600 text-white',
                            ENG201: 'bg-cyan-700 text-white',
                            MGT301: 'bg-rose-600 text-white',
                            MGT501: 'bg-orange-600 text-white',
                            PAK301: 'bg-green-700 text-white'
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
                              initial={{ opacity: 0, y: 14 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true, amount: 'some' }}
                              transition={{
                                duration: 0.28,
                                delay: Math.min(idx * 0.03, 0.2),
                                ease: EASE_OUT_EXPO
                              }}
                              whileHover={{ y: -3 }}
                              whileTap={{ scale: 0.98 }}
                              className="celestial-top-glint group card-celestial rounded-2xl border p-3.5 flex items-center justify-between gap-2.5"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div
                                  className={`w-10 h-10 rounded-xl ${badgeCls} font-mono font-bold text-[11px] flex items-center justify-center shrink-0 shadow-xs transition-transform duration-150 group-hover:scale-105`}
                                >
                                  {set.courseCode}
                                </div>
                                <div className="min-w-0">
                                  <div className="text-[11px] font-mono text-slate-500 tabular-nums truncate">
                                    <span className={set.term === 'finalterm' ? 'text-amber-700 font-semibold' : ''}>
                                      {set.termLabel}
                                    </span>{' '}
                                    · {set.questions.length} Qs
                                  </div>
                                  <h3 className="text-xs sm:text-sm font-bold text-slate-950 group-hover:text-blue-700 transition-colors truncate">
                                    {set.courseTitle}
                                  </h3>
                                </div>
                              </div>

                              <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                            </motion.a>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                      {/* Asymmetric Subjective Fast-Learning Lead Panel */}
                      <div className="lg:col-span-4 rounded-2xl bg-studio-stage text-white p-6 border border-slate-800 relative overflow-hidden flex flex-col justify-between gap-5 shadow-[0_18px_40px_-15px_rgba(2,6,23,0.55)]">
                        <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />
                        <div className="space-y-3 relative z-10">
                          <div className="text-[11px] font-mono uppercase tracking-wider text-amber-300 font-semibold tabular-nums">
                            {subjectiveSets.length} Starter Studios · {subjectiveSets.reduce((acc, s) => acc + s.questions.length, 0)} High-Yield Prompts · 411 Subject Hubs
                          </div>
                          <h3 className="text-xl font-extrabold tracking-tight leading-snug">
                            10-Second Memory Hooks, Marking Keys &amp; Write-Compare Drills
                          </h3>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            Built for 2-mark, 3-mark, and 5-mark VU subjective exam prompts. Flip recall cards, scan cram sheets with answers hidden, or draft answers side-by-side against examiner rubrics.
                          </p>
                        </div>

                        <div className="space-y-3 relative z-10">
                          <button
                            type="button"
                            onClick={() => handleSelectSubjectiveSet(null)}
                            className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
                          >
                            <span>Open Subjective Studio &amp; 411 Hubs</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setExamStudioTab('mcqs')}
                            className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sky-300 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer"
                          >
                            <span>Switch to Objective MCQs ({mcqSets.reduce((acc, s) => acc + s.questions.length, 0).toLocaleString()} Qs)</span>
                            <ListChecks className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Modular Subjective Studios Grid */}
                      <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {subjectiveSets.map((sub, idx) => {
                          const badgeColors: Record<string, string> = {
                            CS201: 'bg-blue-700 text-white',
                            CS301: 'bg-slate-800 text-white',
                            CS403: 'bg-teal-600 text-white',
                            ENG201: 'bg-cyan-700 text-white',
                            MGT301: 'bg-rose-600 text-white',
                            PAK301: 'bg-green-700 text-white'
                          };
                          const badgeCls = badgeColors[sub.courseCode] || 'bg-slate-900 text-white';

                          return (
                            <motion.a
                              key={sub.id}
                              href={`/subjective/${sub.id}`}
                              onClick={(e) => {
                                e.preventDefault();
                                handleSelectSubjectiveSet(sub.id);
                              }}
                              initial={{ opacity: 0, y: 14 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true, amount: 'some' }}
                              transition={{
                                duration: 0.28,
                                delay: Math.min(idx * 0.04, 0.2),
                                ease: EASE_OUT_EXPO
                              }}
                              whileHover={{ y: -3 }}
                              whileTap={{ scale: 0.98 }}
                              className="celestial-top-glint group card-celestial rounded-2xl border hover:border-amber-400 p-4 flex flex-col justify-between gap-3"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div
                                    className={`w-11 h-11 rounded-xl ${badgeCls} font-mono font-bold text-xs flex items-center justify-center shrink-0 shadow-xs transition-transform duration-150 group-hover:scale-105`}
                                  >
                                    {sub.courseCode}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-[11px] font-mono text-amber-700 font-semibold tabular-nums">
                                      2 / 3 / 5 Marks · {sub.questions.length} Q&amp;As
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-950 group-hover:text-blue-700 transition-colors truncate">
                                      {sub.courseTitle}
                                    </h3>
                                  </div>
                                </div>

                                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                              </div>

                              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                {sub.description}
                              </p>
                            </motion.a>
                          );
                        })}
                      </div>
                    </div>
                  )}
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
                        icon: <Award className="w-5 h-5 text-sky-700" />,
                        iconBg: 'bg-sky-50 border-sky-200/70',
                        glow: 'rgba(14, 116, 144, 0.10)'
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

                {/* Direct Exam & Policy Quick Answers (AEO Briefing) */}
                <section aria-labelledby="aeo-briefing-heading" className="mt-12 space-y-5">
                  <ScrollReveal direction="up" distance={18} className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                    <div>
                      <div className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-700">
                        Verified Exam &amp; Policy Reference
                      </div>
                      <h2 id="aeo-briefing-heading" className="text-2xl sm:text-3xl font-bold text-slate-950 mt-0.5">
                        Direct Exam &amp; Policy Quick Answers
                      </h2>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-md">
                      Authoritative Virtual University evaluation, submission, and preparation standards at a glance.
                    </p>
                  </ScrollReveal>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        code: '01 · 20% TWO-HALF RULE',
                        question: 'How does the VU 20% Two-Half Passing Rule work?',
                        answer:
                          'Students must score at least 20% in the First Half (Quizzes, Assignments, GDBs, and Midterm combined) AND independently at least 20% in the Final Term Exam paper. Missing 20% in either half causes an F grade regardless of total percentage.',
                        cta: 'Simulate Marks',
                        page: 'simulator' as AppPage
                      },
                      {
                        code: '02 · 24H GRACE WINDOW',
                        question: 'Is there any penalty during the VU 24-hour assignment grace period?',
                        answer:
                          'Virtual University provides an automatic 24-hour grace period immediately after every regular assignment due date with zero marks deduction. Once the grace timer ends, VULMS closes submissions permanently.',
                        cta: 'Assignments 2026 Guide',
                        page: 'assignment-guide' as AppPage
                      },
                      {
                        code: '03 · TURNITIN < 19% LIMIT',
                        question: 'What is the safe Turnitin similarity ceiling for VU assignments?',
                        answer:
                          'Assignments and GDBs must stay strictly below 19% Turnitin similarity. Uploading verbatim WhatsApp or YouTube files triggers automated zero marks. Always rewrite variable names, code comments with Student ID, and explanations.',
                        cta: 'Read Full Handbook',
                        page: 'handbook' as AppPage
                      },
                      {
                        code: '04 · DUAL-TRACK PREP',
                        question: 'How should I prepare both Objective MCQs and Subjective 2/3/5-mark prompts?',
                        answer:
                          'Combine rapid MCQ pattern drills with 10-second memory hooks and examiner key points. Practicing both tracks cuts subjective writing hesitation while locking in repeat Midterm and Final-Term MCQs.',
                        cta: 'Open Subjective Studio',
                        page: 'subjective' as AppPage
                      }
                    ].map((item) => (
                      <article
                        key={item.code}
                        data-speakable="true"
                        className="card-celestial rounded-2xl border border-slate-200/90 p-5 sm:p-6 flex flex-col justify-between gap-4"
                      >
                        <div className="space-y-2">
                          <div className="text-[11px] font-mono font-semibold text-blue-700 tracking-wider">
                            {item.code}
                          </div>
                          <h3 className="text-base font-bold text-slate-950 leading-snug">
                            {item.question}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                        <div className="pt-3 border-t border-slate-100 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleNavigate(item.page)}
                            className="group inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 transition-colors cursor-pointer"
                          >
                            <span>{item.cta}</span>
                            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-1" />
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                {/* Dark Architectural Observatory Curriculum Callout */}
                <ScrollReveal
                  direction="up"
                  distance={22}
                  className="mt-14 relative overflow-hidden bg-studio-stage text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-[0_24px_60px_-15px_rgba(4,8,20,0.65)] grid grid-cols-1 lg:grid-cols-12 items-center gap-8"
                >
                  <CelestialOrbitalRings compact />
                  <div className="absolute inset-0 bg-academic-grid opacity-30 pointer-events-none" aria-hidden="true" />
                  <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-400/50 to-transparent" aria-hidden="true" />

                  <div className="lg:col-span-7 relative z-10 space-y-4">
                    <div className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-300">
                      Curriculum Archive · {courses.length} Accredited Subjects
                    </div>
                    <h3
                      className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight"
                      style={{ textWrap: 'balance' }}
                    >
                      Every Virtual University Subject Organized Under One Clean Archive
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                      Browse all {courses.length} accredited VU courses organized across Computer Science, Software Engineering, Mathematics, Management, Economics, and Zoology with instant direct downloads.
                    </p>
                    <div className="pt-1 flex flex-wrap items-center gap-3">
                      <AnimatedButton
                        magnetic
                        shimmer
                        type="button"
                        onClick={() => handleNavigate('courses')}
                        className="group px-6 py-3 rounded-xl bg-white hover:bg-sky-50 text-slate-950 font-bold text-xs sm:text-sm transition-colors cursor-pointer inline-flex items-center gap-2 whitespace-nowrap shadow-sm"
                      >
                        <span>Explore {courses.length} Courses</span>
                        <ChevronRight className="w-4 h-4 text-blue-700 transition-transform duration-150 group-hover:translate-x-1" />
                      </AnimatedButton>
                      <button
                        type="button"
                        onClick={() => handleNavigate('sitemap')}
                        className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 hover:text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                      >
                        Faculty Sitemap
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-5 relative z-10">
                    <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/15 bg-[#081226] shadow-2xl">
                      <img
                        src={observatoryArt}
                        alt="Architectural illustration of MIHORA Academic Study Observatory"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 px-3.5 py-2 bg-gradient-to-t from-[#050B18]/90 via-[#050B18]/50 to-transparent flex items-center justify-between text-[11px] font-mono text-slate-200">
                        <span>MIHORA VU ARCHIVE</span>
                        <span className="text-amber-300 tabular-nums">{resources.length.toLocaleString()} FILES</span>
                      </div>
                    </div>
                  </div>
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
            key={pastPapersCourse}
            initialCourse={pastPapersCourse}
            onSelectCourseInLibrary={handleSelectCourse}
          />
        )}

        {/* Page: Interactive MCQs Hub & Dedicated Subject Pages */}
        {currentPage === 'mcqs' && (
          <MCQsPage
            activeSetId={selectedMcqSetId}
            onSelectSetId={handleSelectMcqSet}
            onSelectCourseInLibrary={handleSelectCourse}
            onOpenSubjectiveSet={handleSelectSubjectiveSet}
          />
        )}

        {/* Page: Subjective Fast-Learning Studio & 411 Course Hubs */}
        {currentPage === 'subjective' && (
          <SubjectivePage
            activeSetId={selectedSubjectiveSetId}
            onSelectSetId={handleSelectSubjectiveSet}
            onOpenMcqSet={handleSelectMcqSet}
            onSelectCourseInLibrary={handleSelectCourse}
            onOpenPastPapers={(code) => {
              setPastPapersCourse(code);
              handleNavigate('past-papers');
            }}
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
                      className="hover:text-white transition-colors font-medium text-sky-300"
                    >
                      Interactive Subject MCQ Pages
                    </a>
                  </li>
                  <li>
                    <a
                      href="/subjective"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSelectSubjectiveSet(null);
                      }}
                      className="hover:text-white transition-colors font-medium text-amber-300"
                    >
                      Subjective Fast-Learning Studios
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
                  <li>
                    <a
                      href="/llms.txt"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors font-mono text-[11px] text-amber-300"
                    >
                      LLMs.txt (GEO Index)
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
