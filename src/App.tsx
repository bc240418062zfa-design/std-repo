import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Resource, Course, FilterState, DownloadSession } from './types';
import { searchResources } from './search/searchEngine';
import { antiDevTools, DevToolsDetectionDetail } from './security/antiDevTools';
import { SecurityOverlay } from './security/SecurityOverlay';
import { resolveResourceLocally } from './security/shardResolver';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FilterBar } from './components/FilterBar';
import { ResourceCard } from './components/ResourceCard';
import { MultiDownloadBar } from './components/MultiDownloadBar';
import { DownloadModal } from './components/DownloadModal';
import { FilePreviewModal } from './components/FilePreviewModal';
import { MihoraLogo } from './components/MihoraLogo';
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
import { Shield, Sparkles, BookOpen, Layers, CheckCircle2, AlertCircle, ExternalLink, ChevronDown, ChevronUp, ChevronRight } from 'lucide-react';

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
  if (hash === '#security' || hash === '#relay') return 'security';
  if (hash === '#about' || hash === '#mission') return 'about';
  if (hash === '#sitemap') return 'sitemap';
  if (hash === '#disclaimer' || hash === '#terms') return 'disclaimer';

  return 'home';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>(getPageFromPath);

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

  // Security & Download Session States
  const [devToolsDetected, setDevToolsDetected] = useState(false);
  const [devToolsDetail, setDevToolsDetail] = useState<DevToolsDetectionDetail | null>(null);
  const [downloadSession, setDownloadSession] = useState<DownloadSession | null>(null);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [previewResource, setPreviewResource] = useState<Resource | null>(null);
  const [showAllCoursesFooter, setShowAllCoursesFooter] = useState(false);

  const searchResultsRef = useRef<HTMLDivElement>(null);
  const downloadSessionRef = useRef<DownloadSession | null>(null);
  downloadSessionRef.current = downloadSession;

  // Listen to popstate changes for real browser back/forward and clean URLs
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPage(getPageFromPath());
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
    const targetPath = pagePathMap[page] || '/';
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
  }, [currentPage, filters.course]);

  // Initialize anti-DevTools deterrence & subscribe to detection signals
  useEffect(() => {
    antiDevTools.init();
    const unsubscribe = antiDevTools.subscribe((detail) => {
      setDevToolsDetected(detail.detected);
      setDevToolsDetail(detail);
      if (detail.detected && downloadSessionRef.current) {
        // Invalidate active session if dev tools opened
        setDownloadSession(null);
      }
    });
    return () => {
      unsubscribe();
      antiDevTools.destroy();
    };
  }, []);

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
    <>
      {/* DevTools Deterrence Security Overlay */}
      {devToolsDetected && (
        <SecurityOverlay
          detail={devToolsDetail}
          onDismiss={() => {
            setDevToolsDetected(false);
            antiDevTools.resume();
          }}
        />
      )}

      <div
        className={`min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans transition-all duration-300 ${
          devToolsDetected
            ? 'filter blur-md pointer-events-none select-none max-h-screen overflow-hidden opacity-30'
            : ''
        }`}
      >
        {/* Top Bar Navigation */}
        <Navbar
          currentPage={currentPage}
          onNavigate={(p) => handleNavigate(p as AppPage)}
          selectedCount={selectedRLHs.size}
        />

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
            />

            {/* Main Interactive Catalog */}
            <main
              ref={searchResultsRef}
              id="catalog"
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full"
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
                  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
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
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                    {filteredResources.map((res) => (
                      <ResourceCard
                        key={res.rlh}
                        resource={res}
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
                <div className="mt-12 text-center space-y-2">
                  <button
                    type="button"
                    onClick={() => setLimit((prev) => prev + 24)}
                    className="px-6 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
                  >
                    Load More Resources ({totalMatchingCount - filteredResources.length} remaining)
                  </button>
                  <p className="text-[11px] text-slate-400">
                    Showing {filteredResources.length} of {totalMatchingCount.toLocaleString()} matching documents
                  </p>
                </div>
              )}

              {/* Informational Callout */}
              <div className="mt-14 relative overflow-hidden bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold">
                    <Shield className="w-3.5 h-3.5 text-blue-400" />
                    <span>Academic Curriculum Archive</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                    Need past papers or handouts for a specific subject?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Explore all 411 Virtual University courses categorized across Computer Science, Software Engineering, Mathematics, Management, Economics, and Zoology.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleNavigate('courses')}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm transition-all cursor-pointer shrink-0 shadow-md shadow-blue-600/30 active:scale-95 flex items-center gap-2"
                >
                  <span>Explore 411 Courses</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
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

        {/* Enterprise Footer */}
        <footer className="bg-slate-950 text-white border-t border-slate-900 mt-20 pt-14 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
              {/* Brand Column */}
              <div className="space-y-3">
                <MihoraLogo variant="white" size="md" />
                <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                  MIHORA STUDY LIBRARY is an independent, non-commercial educational technology and CSR initiative engineered by <strong>MIHORA TECH</strong> to empower students of the Virtual University of Pakistan.
                </p>
                <div className="pt-2">
                  <a
                    href="https://www.mihora.tech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    <span>Visit Official Website (www.mihora.tech)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Portal Links Column */}
              <div className="space-y-3 text-xs">
                <div className="font-bold text-white uppercase tracking-wider text-[11px]">
                  Academic Portal
                </div>
                <ul className="space-y-2 text-slate-400">
                  <li>
                    <a
                      href="/"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigate('home');
                      }}
                      className="hover:text-blue-400 transition-colors"
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
                      className="hover:text-blue-400 transition-colors"
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
                      className="hover:text-blue-400 transition-colors font-medium text-emerald-400"
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
                      className="hover:text-blue-400 transition-colors font-medium text-blue-300"
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
                      className="hover:text-blue-400 transition-colors"
                    >
                      Curriculum Directory
                    </a>
                  </li>
                </ul>
              </div>

              {/* Tools & Guides Column */}
              <div className="space-y-3 text-xs">
                <div className="font-bold text-white uppercase tracking-wider text-[11px]">
                  Tools &amp; Capstone Hub
                </div>
                <ul className="space-y-2 text-slate-400">
                  <li>
                    <a
                      href="/vu-assignment-solution-2026"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigate('assignment-guide');
                      }}
                      className="hover:text-blue-400 transition-colors font-semibold text-emerald-400 flex items-center gap-1.5"
                    >
                      <span>VU Assignment Solution 2026</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded-sm bg-emerald-500/20 text-emerald-300 font-mono font-bold">LATEST</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/past-papers"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigate('past-papers');
                      }}
                      className="hover:text-blue-400 transition-colors font-medium text-blue-300"
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
                      className="hover:text-blue-400 transition-colors font-medium text-slate-300"
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
                      className="hover:text-blue-400 transition-colors font-medium text-amber-300"
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
                      className="hover:text-blue-400 transition-colors font-medium text-indigo-300"
                    >
                      CS619 FYP Roadmap &amp; Viva Voce
                    </a>
                  </li>
                </ul>
              </div>

              {/* Trust & Governance Column */}
              <div className="space-y-3 text-xs">
                <div className="font-bold text-white uppercase tracking-wider text-[11px]">
                  Trust &amp; Governance
                </div>
                <ul className="space-y-2 text-slate-400">
                  <li>
                    <a
                      href="/security"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavigate('security');
                      }}
                      className="hover:text-blue-400 transition-colors"
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
                      className="hover:text-blue-400 transition-colors"
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
                      className="hover:text-blue-400 transition-colors"
                    >
                      Academic Notice &amp; Disclaimer
                    </a>
                  </li>
                  <li>
                    <a
                      href="/sitemap.xml"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-400 transition-colors font-mono text-[11px]"
                    >
                      XML Sitemap (Crawler Feed)
                    </a>
                  </li>
                  <li>
                    <a
                      href="/robots.txt"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-400 transition-colors font-mono text-[11px]"
                    >
                      Robots.txt Protocol
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Quick Access Course Directory / Accordion */}
            <div className="pt-6 border-t border-slate-800/80 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-400" />
                    <span>Virtual University All 411 Courses &amp; 2026 Solutions Directory</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Click any course code below to instantly inspect verified solved past papers, lecture handouts, and assignment solutions.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAllCoursesFooter(!showAllCoursesFooter)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-white text-xs font-semibold border border-slate-800 transition-colors cursor-pointer self-start sm:self-auto shrink-0"
                >
                  <span>{showAllCoursesFooter ? 'Collapse 411 Courses' : 'Browse All 411 Courses'}</span>
                  {showAllCoursesFooter ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {showAllCoursesFooter && (
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 max-h-96 overflow-y-auto space-y-3 text-xs animate-in fade-in duration-150">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {courses.map((c) => (
                      <a
                        key={c.code}
                        href={`/courses?course=${c.code}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleSelectCourse(c.code);
                        }}
                        className="p-2 rounded-lg bg-slate-950/80 hover:bg-blue-950/60 border border-slate-800 hover:border-blue-500/50 text-slate-300 hover:text-white transition-all group block text-left"
                        title={`${c.code} - ${c.title}`}
                      >
                        <div className="font-mono font-bold text-blue-400 group-hover:text-cyan-300 text-[11px]">
                          {c.code}
                        </div>
                        <div className="text-[10px] text-slate-400 line-clamp-1">
                          {c.title}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Copyright */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 pt-4 border-t border-slate-900">
              <div>
                &copy; {new Date().getFullYear()} MIHORA TECH. Educational Welfare Initiative. All rights reserved.
              </div>
              <div className="text-[11px] text-slate-400 text-center sm:text-right">
                Study Portal: <span className="font-medium text-slate-300">study.mihora.tech</span> · Corporate: <a href="https://www.mihora.tech" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-400 hover:underline">www.mihora.tech</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
