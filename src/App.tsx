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
import { Shield, Sparkles, BookOpen, Layers, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';

// Static sanitized data compiled at build time
import coursesData from './data/courses.json';
import resourcesData from './data/resources.json';

const courses: Course[] = coursesData as Course[];
const resources: Resource[] = resourcesData as Resource[];

export type AppPage = 'home' | 'courses' | 'simulator' | 'handbook' | 'security' | 'about' | 'sitemap' | 'disclaimer';

const pagePathMap: Record<AppPage, string> = {
  home: '/',
  courses: '/courses',
  simulator: '/simulator',
  handbook: '/handbook',
  security: '/security',
  about: '/about',
  sitemap: '/sitemap',
  disclaimer: '/disclaimer'
};

function getPageFromPath(): AppPage {
  if (typeof window === 'undefined') return 'home';
  const pathname = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
  if (pathname === '/courses') return 'courses';
  if (pathname === '/simulator' || pathname === '/calculator') return 'simulator';
  if (pathname === '/handbook' || pathname === '/guide' || pathname === '/rules') return 'handbook';
  if (pathname === '/security' || pathname === '/privacy') return 'security';
  if (pathname === '/about' || pathname === '/mission') return 'about';
  if (pathname === '/sitemap') return 'sitemap';
  if (pathname === '/disclaimer' || pathname === '/terms') return 'disclaimer';

  // Backward compatibility with legacy hash
  const hash = window.location.hash.toLowerCase();
  if (hash === '#courses') return 'courses';
  if (hash === '#simulator' || hash === '#calculator') return 'simulator';
  if (hash === '#handbook' || hash === '#guide') return 'handbook';
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
              <div className="mt-14 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700">
                    <Shield className="w-4 h-4" />
                    <span>Virtual University Student Empowerment Network</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Looking for a specific course archive?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    Explore our comprehensive 411 course directory categorized by Computer Science, Mathematics, Management, Economics, and Mass Media.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleNavigate('courses')}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer shrink-0 shadow-xs"
                >
                  Open Course Directory
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
              {/* Brand Column */}
              <div className="space-y-3 md:col-span-2">
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
                      VU Student Handbook & Rules
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

              {/* Trust & Governance Column */}
              <div className="space-y-3 text-xs">
                <div className="font-bold text-white uppercase tracking-wider text-[11px]">
                  Trust & About
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
                      Trust & Privacy Guarantee
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
                      About Mihora Tech Initiative
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
                      Academic Notice & Disclaimer
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Copyright */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
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
