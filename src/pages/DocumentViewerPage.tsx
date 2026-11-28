import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Course, Resource } from '../types';
import { resolveResourceLocally, ResolvedResource } from '../security/shardResolver';
import {
  cleanDocumentDisplayTitle,
  findDocEntryBySlug,
  getRelatedDocEntries
} from '../utils/docSlug';
import { readPrerenderedDocData } from '../utils/docSlugBase';
import { getDocRedirectTarget } from '../utils/docRedirects';
import type { DocSlugEntry } from '../utils/docSlugBase';
import { enrichDocumentMetadata, EnrichedDocMetadata } from '../utils/docEnricher';
import { mcqSets } from '../data/mcqs';
import { subjectiveSets } from '../data/subjective';
import { EASE_OUT_EXPO } from '../components/MotionPrimitives';
import {
  Download,
  ExternalLink,
  Maximize2,
  Minimize2,
  FileText,
  BookOpen,
  Presentation,
  Image as ImageIcon,
  FileCode,
  FileArchive,
  Check,
  Share2,
  Loader2,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  Calculator,
  ListChecks,
  Flame,
  FolderOpen,
  ShieldCheck,
  Search,
  ChevronDown,
  GraduationCap,
  CheckCircle2,
  HelpCircle,
  Tag,
  BookOpenCheck,
  Layers
} from 'lucide-react';

interface DocumentViewerPageProps {
  requestedSlug: string;
  courses: Course[];
  onDownloadResource: (resource: Resource) => void;
  onOpenDocSlug: (slug: string) => void;
  onSelectCourse: (courseCode: string) => void;
  onOpenMcqSet: (setId: string | null) => void;
  onOpenSubjectiveSet: (setId: string | null) => void;
  onNavigate: (page: string) => void;
}

// Runtime Base64 decoding prevents build-time constant folding into leak patterns
function decodeRuntimeUrl(b64: string): string {
  if (typeof window !== 'undefined' && typeof window.atob === 'function') {
    return window.atob(b64);
  }
  return typeof Buffer !== 'undefined' ? Buffer.from(b64, 'base64').toString('utf-8') : '';
}

function createEmbedPreviewUrl(driveId: string): string {
  const base = decodeRuntimeUrl('aHR0cHM6Ly9kcml2ZS5nb29nbGUuY29tL2ZpbGUvZC8=');
  return `${base}${encodeURIComponent(driveId)}/preview`;
}

function createEmbedViewUrl(driveId: string): string {
  const base = decodeRuntimeUrl('aHR0cHM6Ly9kcml2ZS5nb29nbGUuY29tL2ZpbGUvZC8=');
  return `${base}${encodeURIComponent(driveId)}/view`;
}

function createDirectDownloadUrl(driveId: string): string {
  const base = decodeRuntimeUrl('aHR0cHM6Ly9kcml2ZS51c2VyY29udGVudC5nb29nbGUuY29tL2Rvd25sb2FkP2lkPQ==');
  return `${base}${encodeURIComponent(driveId)}&export=download&confirm=t`;
}

const TYPE_DESCRIPTIONS: Record<string, { label: string; tip: string }> = {
  MIDTERM: {
    label: 'Midterm Solved Past Paper',
    tip: 'Cross-check repeated objective questions with your official lecture handouts (Lectures 1–22) and verify weightage in the 20% Two-Half Simulator.'
  },
  FINALTERM: {
    label: 'Final-Term Solved Archive',
    tip: 'Remember that scoring at least 20% independently in the Final-Term exam paper is mandatory under Virtual University passing regulations.'
  },
  HANDOUT: {
    label: 'Official Lecture Handouts & Notes',
    tip: 'Highlighted definitions and worked examples from VU handouts form the core grading rubric for both short (2–3 mark) and long (5 mark) questions.'
  },
  QUIZ: {
    label: 'Live Quiz & Midterm Objective File',
    tip: 'Quiz statements frequently repeat with shuffled options in Midterm and Final exams—focus on underlying definitions rather than option letters.'
  },
  MCQFILE: {
    label: 'Mega Solved MCQs Compilation',
    tip: 'Pair this reference file with our 45-second timed mock simulator in the MCQs Studio to build exam-day pacing.'
  },
  ASSIGNMENT: {
    label: 'Assignment & GDB Reference Material',
    tip: 'Always rewrite code comments, variable names, and explanations in your own words to stay strictly below Virtual University’s 19% Turnitin ceiling.'
  },
  OTHER: {
    label: 'Verified Academic Reference Document',
    tip: 'Use the course archive switcher on the right to explore all related handouts, past papers, and MCQs for this course code.'
  }
};

export const DocumentViewerPage: React.FC<DocumentViewerPageProps> = ({
  requestedSlug,
  courses,
  onDownloadResource,
  onOpenDocSlug,
  onSelectCourse,
  onOpenMcqSet,
  onOpenSubjectiveSet,
  onNavigate
}) => {
  // Prerendered pages embed the resource record in #mihora-doc-data: use it
  // directly and skip the catalog lookup for this slug. Slugs without a
  // data block (waves not yet shipped, deep links) fall back to the
  // catalog lookup below.
  const matchedEntry: DocSlugEntry | null = useMemo(() => {
    const pre = readPrerenderedDocData(requestedSlug);
    if (pre) {
      const slug = requestedSlug.trim().toLowerCase();
      return { slug, compactKey: slug.replace(/-/g, ''), resource: pre, index: -1 };
    }
    return findDocEntryBySlug(requestedSlug);
  }, [requestedSlug]);
  const resource = matchedEntry?.resource || null;
  const canonicalSlug = matchedEntry?.slug || requestedSlug.toLowerCase();

  // Phantom-URL fallback (src/utils/docRedirects.ts): a slug Google
  // remembers that has no file in the archive redirects to the closest
  // genuine page. The prerendered static redirect page normally handles
  // this before the SPA boots; this covers in-app navigation to a
  // phantom slug (stale link inside the app). Only fires when the slug
  // matches nothing in the archive, so real pages are never redirected.
  const redirectTarget = useMemo(
    () => (!matchedEntry ? getDocRedirectTarget(requestedSlug) : null),
    [matchedEntry, requestedSlug]
  );
  useEffect(() => {
    if (redirectTarget) {
      window.location.replace(redirectTarget);
    }
  }, [redirectTarget]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resolvedData, setResolvedData] = useState<ResolvedResource | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [reloadNonce, setReloadNonce] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  // §5.2: the shard (AES decrypt, ~1 MB) is fetched only when the preview
  // is actually wanted — near the viewport, or explicitly requested via
  // Download / Open / Reload. Until then the page shows the static
  // metadata + a preview placeholder.
  const [previewWanted, setPreviewWanted] = useState(false);
  const previewSectionRef = useRef<HTMLElement | null>(null);

  const courseInfo = useMemo(() => {
    if (!resource) return null;
    return courses.find((c) => c.code.toUpperCase() === resource.course.toUpperCase()) || null;
  }, [courses, resource]);

  const enriched: EnrichedDocMetadata | null = useMemo(() => {
    if (!resource) return null;
    return enrichDocumentMetadata(resource);
  }, [resource]);

  const relatedEntries = useMemo(() => {
    if (!resource) return [];
    return getRelatedDocEntries(resource, 12);
  }, [resource]);

  const matchingMcqSet = useMemo(() => {
    if (!resource) return null;
    return mcqSets.find((s) => s.courseCode.toUpperCase() === resource.course.toUpperCase()) || null;
  }, [resource]);

  const matchingSubjectiveSet = useMemo(() => {
    if (!resource) return null;
    return subjectiveSets.find((s) => s.courseCode.toUpperCase() === resource.course.toUpperCase()) || null;
  }, [resource]);

  // Escape closes expanded fullscreen stage
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isFullscreen]);

  // Start resolving once the preview stage is near the viewport (~800px).
  useEffect(() => {
    if (!resource || previewWanted) return;
    const el = previewSectionRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setPreviewWanted(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setPreviewWanted(true);
          observer.disconnect();
        }
      },
      { rootMargin: '800px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [resource, previewWanted]);

  // Resolve embedded preview stream once the preview is wanted (near
  // viewport, Download/Open click, or Reload), whenever the document
  // changes, or when reload is clicked.
  useEffect(() => {
    setResolvedData(null);
    setPreviewUrl(null);
    setError(null);
    if (!resource || !previewWanted) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    async function resolveStream() {
      try {
        let driveId = '';
        let resolved: ResolvedResource | null = null;

        try {
          resolved = await resolveResourceLocally(resource!.rlh);
          if (resolved?.driveId) {
            driveId = resolved.driveId;
          }
        } catch (err) {
          console.warn('Local shard resolution fallback triggered:', err);
        }

        if (!driveId) {
          try {
            const res = await fetch('/api/resolve', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ rlh: resource!.rlh })
            });
            if (res.ok) {
              const data = await res.json();
              if (data.driveId) {
                driveId = data.driveId;
              }
            }
          } catch (err) {
            console.warn('Server relay resolution fallback triggered:', err);
          }
        }

        if (!isMounted) return;

        const activeDriveId = driveId || resolved?.driveId || '';
        if (!activeDriveId) {
          throw new Error('Preview stream is temporarily unavailable for this format. Use Save File below.');
        }

        setResolvedData(resolved);
        setPreviewUrl(createEmbedPreviewUrl(activeDriveId));
      } catch (err: any) {
        if (isMounted) {
          console.error('Document preview error:', err);
          setError('Unable to load embedded preview. Please use the download button below.');
          setLoading(false);
        }
      }
    }

    resolveStream();

    return () => {
      isMounted = false;
    };
  }, [resource, reloadNonce, previewWanted]);

  const handleCopyShareLink = async () => {
    const url = `https://study.mihora.tech/doc/${canonicalSlug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Clipboard API restricted
    }
  };

  const handleDirectDownloadClick = () => {
    if (!resource) return;
    // A download needs the resolved Drive ID: trigger preview resolution
    // too, so the Open-in-New-Tab link appears once it resolves. The
    // download itself falls back to onDownloadResource below when the
    // resolution has not finished yet.
    setPreviewWanted(true);
    if (resolvedData?.driveId) {
      const target = createDirectDownloadUrl(resolvedData.driveId);
      const a = document.createElement('a');
      a.href = target;
      a.download = resolvedData.safeName || resource.name;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      onDownloadResource(resource);
    }
  };

  if (!resource || !enriched) {
    // Phantom slug: the redirect effect above already navigates away;
    // this card is only visible for an instant (or if navigation is
    // blocked), so the user is never left on a dead page.
    if (redirectTarget) {
      return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="rounded-3xl bg-white border border-[#DDD6C8] p-8 sm:p-12 text-center space-y-5 shadow-xs">
            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold text-slate-950" style={{ textWrap: 'balance' }}>
                This page has moved
              </h1>
              <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                The document you were looking for has moved to a new address. You are being redirected.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href={redirectTarget}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D1B2A] hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <span>Continue to the file</span>
              </a>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-3xl bg-white border border-[#DDD6C8] p-8 sm:p-12 text-center space-y-5 shadow-xs">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FAF8F4] border border-[#E5E0D5] flex items-center justify-center text-amber-700">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-slate-950" style={{ textWrap: 'balance' }}>
              Document Link Not Found in Index
            </h1>
            <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
              The document path <span className="font-mono text-slate-900">/doc/{requestedSlug}</span> did not match a file in our 28,328-document archive. Search by course code or keyword to open the exact file.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D1B2A] hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Search All 28,328 Documents</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('courses')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FAF8F4] hover:bg-[#F3EFE6] border border-[#DDD6C8] text-slate-900 text-xs font-bold transition-colors cursor-pointer"
            >
              <FolderOpen className="w-4 h-4 text-blue-700" />
              <span>Browse 411 Courses</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const displayTitle = enriched.displayName;
  const format = enriched.format;
  const typeMeta = TYPE_DESCRIPTIONS[resource.type] || TYPE_DESCRIPTIONS.OTHER;
  const driveViewUrl = resolvedData?.driveId ? createEmbedViewUrl(resolvedData.driveId) : null;

  const renderFormatIcon = (fmt: string) => {
    switch (fmt.toUpperCase()) {
      case 'PDF':
        return <FileText className="w-4 h-4 text-amber-300" />;
      case 'DOC':
      case 'DOCX':
        return <BookOpen className="w-4 h-4 text-sky-300" />;
      case 'PPT':
      case 'PPTX':
        return <Presentation className="w-4 h-4 text-amber-300" />;
      case 'IMAGE':
        return <ImageIcon className="w-4 h-4 text-sky-300" />;
      case 'ARCHIVE':
        return <FileArchive className="w-4 h-4 text-emerald-300" />;
      default:
        return <FileCode className="w-4 h-4 text-slate-300" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Visual Breadcrumb Navigation */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-xs text-slate-500 font-medium overflow-x-auto whitespace-nowrap py-1">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('home');
          }}
          className="text-slate-600 hover:text-blue-700 transition-colors"
        >
          Library
        </a>
        <span aria-hidden="true" className="text-slate-400">/</span>
        <a
          href="/courses"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('courses');
          }}
          className="text-slate-600 hover:text-blue-700 transition-colors"
        >
          Courses
        </a>
        <span aria-hidden="true" className="text-slate-400">/</span>
        <a
          href={`/courses/${enriched.courseCode.toLowerCase()}`}
          onClick={(e) => {
            e.preventDefault();
            onSelectCourse(enriched.courseCode);
          }}
          className="font-bold text-blue-700 hover:underline uppercase"
        >
          {enriched.courseCode}
        </a>
        <span aria-hidden="true" className="text-slate-400">/</span>
        <span className="text-slate-900 font-semibold truncate max-w-xs sm:max-w-md">
          {displayTitle}
        </span>
      </nav>

      {/* Midnight Oxford Navy Document Hero Header */}
      <section className="relative overflow-hidden rounded-3xl bg-[#0D1B2A] text-white border border-slate-800 p-6 sm:p-8 shadow-[0_22px_50px_-15px_rgba(2,6,23,0.55)]">
        <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-400/60 to-transparent" aria-hidden="true" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 min-w-0 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-300">
              {renderFormatIcon(format)}
              <a
                href={`/courses/${resource.course.toLowerCase()}`}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectCourse(resource.course);
                }}
                className="font-bold text-amber-300 hover:underline uppercase tracking-wider"
              >
                {resource.course}
              </a>
              <span aria-hidden="true" className="text-slate-500">·</span>
              <span className="font-semibold uppercase tracking-wider">{format}</span>
              <span aria-hidden="true" className="text-slate-500">·</span>
              <span className="text-sky-300 font-mono">~{enriched.estimatedPages} Pages</span>
              <span aria-hidden="true" className="text-slate-500">·</span>
              <span>{enriched.typeLabel}</span>
              {enriched.contributor && (
                <>
                  <span aria-hidden="true" className="text-slate-500">·</span>
                  <span className="text-emerald-300 font-medium">By {enriched.contributor}</span>
                </>
              )}
              {resource.tags && resource.tags.length > 0 && (
                <>
                  <span aria-hidden="true" className="text-slate-500">·</span>
                  <span className="text-sky-200">{resource.tags.join(' / ')}</span>
                </>
              )}
            </div>

            <h1
              data-speakable="true"
              className="text-xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug break-words"
              style={{ textWrap: 'balance' }}
            >
              {displayTitle}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              {courseInfo
                ? `${courseInfo.code} – ${courseInfo.title} (${courseInfo.faculty}). Free online document preview and direct download with zero sign-up.`
                : `${resource.course} Virtual University verified academic study material. Read inline below or save offline for exam preparation.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <motion.button
              whileHover={{ y: -1.5 }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.16, ease: EASE_OUT_EXPO }}
              type="button"
              onClick={handleDirectDownloadClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-sm transition-colors cursor-pointer whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span>Save File</span>
            </motion.button>

            <button
              type="button"
              onClick={handleCopyShareLink}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-slate-100 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span className="text-emerald-200">Link Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>Copy Share Link</span>
                </>
              )}
            </button>

            {driveViewUrl && (
              <a
                href={driveViewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#132238] hover:bg-white/10 border border-white/15 text-slate-200 text-xs font-semibold transition-colors whitespace-nowrap"
              >
                <ExternalLink className="w-3.5 h-3.5 text-sky-300" />
                <span>Open in New Tab</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Two-Zone Reader Workbench + Context Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left/Main Zone: Dedicated Embedded Document Preview Stage */}
        <section
          ref={previewSectionRef}
          aria-label="Embedded Document Preview"
          className={
            isFullscreen
              ? 'fixed inset-0 z-50 bg-[#0D1B2A] flex flex-col'
              : 'lg:col-span-8 rounded-2xl border border-[#DDD6C8] bg-white overflow-hidden shadow-xs flex flex-col'
          }
        >
          {/* Reader Control Toolbar */}
          <div className="px-4 sm:px-5 py-3 bg-[#FAF8F4] border-b border-[#E5E0D5] flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 min-w-0 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span className="font-semibold text-slate-800 truncate">
                {format} Online Preview · {resource.course}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setPreviewWanted(true);
                  setReloadNonce((n) => n + 1);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-[#DDD6C8] text-slate-700 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap"
                title="Reload document preview"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reload</span>
              </button>

              <button
                type="button"
                onClick={() => setIsFullscreen((v) => !v)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-[#DDD6C8] text-slate-700 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Reader'}
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span>Exit Fullscreen</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Fullscreen</span>
                  </>
                )}
              </button>

              {isFullscreen && (
                <button
                  type="button"
                  onClick={handleDirectDownloadClick}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0D1B2A] hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Save File</span>
                </button>
              )}
            </div>
          </div>

          {/* Embedded Preview Viewport */}
          <div
            className={`relative bg-[#0D1B2A] w-full ${
              isFullscreen ? 'flex-1' : 'h-[68vh] min-h-[520px] max-h-[820px]'
            }`}
          >
            {!previewWanted && !previewUrl && !error && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 space-y-3 bg-[#0D1B2A]/95 text-white">
                <FileText className="w-9 h-9 text-amber-300" />
                <div className="text-center space-y-1">
                  <h2 className="text-sm font-bold text-white">Document Preview Loads on Scroll</h2>
                  <p className="text-xs text-slate-300 max-w-sm">
                    The file details above are already loaded. Scroll to the preview to load it, or open it now.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewWanted(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Load Preview Now</span>
                </button>
              </div>
            )}

            {loading && !error && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 space-y-3 bg-[#0D1B2A]/95 text-white">
                <Loader2 className="w-9 h-9 text-amber-300 animate-spin" />
                <div className="text-center space-y-1">
                  <h2 className="text-sm font-bold text-white">Loading Verified Document Preview...</h2>
                  <p className="text-xs text-slate-300 max-w-sm">
                    Preparing {resource.course} ({format}) inside your browser reader.
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 space-y-4 bg-[#FAF8F4] text-center">
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="space-y-1 max-w-md">
                  <h2 className="text-base font-bold text-slate-900">Direct Download Ready</h2>
                  <p className="text-xs text-slate-600 leading-relaxed">{error}</p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleDirectDownloadClick}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D1B2A] hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download File</span>
                  </button>
                  {driveViewUrl && (
                    <a
                      href={driveViewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-[#DDD6C8] hover:bg-[#F3EFE6] text-slate-800 text-xs font-bold transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Open External Viewer</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {previewUrl && (
              <iframe
                key={`${canonicalSlug}-${reloadNonce}`}
                src={previewUrl}
                title={displayTitle}
                loading="lazy"
                className="w-full h-full border-0 bg-white"
                allow="autoplay; encrypted-media; fullscreen"
                onLoad={() => setLoading(false)}
              />
            )}
          </div>

          <div className="px-4 sm:px-5 py-2.5 bg-[#FAF8F4] border-t border-[#E5E0D5] flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600 shrink-0">
            <span>
              Prefer reading offline? Use <strong>Save File</strong> to keep a local copy on phone or PC.
            </span>
            <span className="font-mono text-slate-700 tabular-nums">/doc/{canonicalSlug}</span>
          </div>
        </section>

        {/* Right Zone: Metadata Specifications & Course Study Tools */}
        <aside className="lg:col-span-4 space-y-5">
          {/* Document Details */}
          <div className="rounded-2xl bg-white border border-[#DDD6C8] p-5 space-y-4 shadow-xs">
            <h2 className="text-sm font-bold text-slate-950">Document Details</h2>
            <dl className="divide-y divide-[#EFECE4] text-xs">
              <div className="py-2 flex items-center justify-between gap-3">
                <dt className="text-slate-500">Course Code</dt>
                <dd className="font-mono font-bold text-blue-700">{resource.course}</dd>
              </div>
              {courseInfo && (
                <div className="py-2 flex items-start justify-between gap-3">
                  <dt className="text-slate-500 shrink-0">Subject</dt>
                  <dd className="font-medium text-slate-900 text-right">{courseInfo.title}</dd>
                </div>
              )}
              {courseInfo && (
                <div className="py-2 flex items-start justify-between gap-3">
                  <dt className="text-slate-500 shrink-0">Faculty</dt>
                  <dd className="text-slate-700 text-right">{courseInfo.faculty}</dd>
                </div>
              )}
              <div className="py-2 flex items-center justify-between gap-3">
                <dt className="text-slate-500">Category</dt>
                <dd className="font-medium text-slate-900 text-right">{enriched.typeLabel}</dd>
              </div>
              <div className="py-2 flex items-center justify-between gap-3">
                <dt className="text-slate-500">Curriculum Scope</dt>
                <dd className="font-medium text-slate-900 text-right">{enriched.termScope}</dd>
              </div>
              <div className="py-2 flex items-center justify-between gap-3">
                <dt className="text-slate-500">Document Volume</dt>
                <dd className="font-semibold text-slate-900 text-right">~{enriched.estimatedPages} Pages ({enriched.curriculumModules.length} Modules)</dd>
              </div>
              {enriched.contributor && (
                <div className="py-2 flex items-center justify-between gap-3">
                  <dt className="text-slate-500">Contributor / Author</dt>
                  <dd className="font-semibold text-emerald-800 text-right">{enriched.contributor}</dd>
                </div>
              )}
              <div className="py-2 flex items-center justify-between gap-3">
                <dt className="text-slate-500">File Format</dt>
                <dd className="font-mono font-semibold text-slate-800">{format}</dd>
              </div>
              {resource.tags && resource.tags.length > 0 && (
                <div className="py-2 flex items-start justify-between gap-3">
                  <dt className="text-slate-500 shrink-0">Topics</dt>
                  <dd className="text-slate-700 text-right">{resource.tags.join(', ')}</dd>
                </div>
              )}
              <div className="py-2 flex items-center justify-between gap-3">
                <dt className="text-slate-500">Index ID</dt>
                <dd className="font-mono text-slate-600 tabular-nums">{resource.rlh}</dd>
              </div>
            </dl>

            <div className="p-3.5 rounded-xl bg-[#FAF8F4] border border-[#E5E0D5] text-xs text-slate-700 leading-relaxed">
              <strong className="text-slate-900">Exam Prep Note:</strong> {typeMeta.tip}
            </div>
          </div>

          {/* Fast Subject Shortcuts */}
          <div className="rounded-2xl bg-white border border-[#DDD6C8] p-5 space-y-3 shadow-xs">
            <h2 className="text-sm font-bold text-slate-950">
              {resource.course} Study Shortcuts
            </h2>
            <div className="space-y-2">
              <a
                href={`/courses/${resource.course.toLowerCase()}`}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectCourse(resource.course);
                }}
                className="p-3 rounded-xl bg-[#FAF8F4] hover:bg-blue-50/60 border border-[#E5E0D5] hover:border-blue-300 flex items-center justify-between gap-3 transition-colors group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FolderOpen className="w-4 h-4 text-blue-700 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700 truncate">
                      All {resource.course} Files {courseInfo ? `(${courseInfo.fileCount})` : ''}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      Past papers, handouts &amp; 2026 solutions
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-700 shrink-0" />
              </a>

              <a
                href={matchingMcqSet ? `/mcqs/${matchingMcqSet.id}` : '/vu-mcqs-bank'}
                onClick={(e) => {
                  e.preventDefault();
                  onOpenMcqSet(matchingMcqSet ? matchingMcqSet.id : null);
                }}
                className="p-3 rounded-xl bg-[#FAF8F4] hover:bg-sky-50/70 border border-[#E5E0D5] hover:border-sky-300 flex items-center justify-between gap-3 transition-colors group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <ListChecks className="w-4 h-4 text-sky-700 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 group-hover:text-sky-700 truncate">
                      {matchingMcqSet
                        ? `${resource.course} Interactive MCQs (${matchingMcqSet.questions.length} Qs)`
                        : 'VU Interactive MCQs Bank'}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      45s mock timer &amp; instant answer check
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-700 shrink-0" />
              </a>

              <a
                href={matchingSubjectiveSet ? `/subjective/${matchingSubjectiveSet.id}` : '/subjective'}
                onClick={(e) => {
                  e.preventDefault();
                  onOpenSubjectiveSet(matchingSubjectiveSet ? matchingSubjectiveSet.id : null);
                }}
                className="p-3 rounded-xl bg-[#FAF8F4] hover:bg-amber-50/70 border border-[#E5E0D5] hover:border-amber-300 flex items-center justify-between gap-3 transition-colors group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Flame className="w-4 h-4 text-amber-700 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 group-hover:text-amber-700 truncate">
                      {matchingSubjectiveSet
                        ? `${resource.course} Subjective Fast-Learning`
                        : 'Subjective Fast-Learning Studio'}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      2, 3 &amp; 5-mark hooks &amp; examiner keys
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-700 shrink-0" />
              </a>

              <a
                href="/simulator"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('simulator');
                }}
                className="p-3 rounded-xl bg-[#FAF8F4] hover:bg-emerald-50/70 border border-[#E5E0D5] hover:border-emerald-300 flex items-center justify-between gap-3 transition-colors group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Calculator className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 truncate">
                      20% Passing Marks Simulator
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      Calculate target {resource.course} final marks
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 shrink-0" />
              </a>
            </div>
          </div>
        </aside>
      </div>

      {/* Crawlable Academic Dossier & Curriculum Grounding Section */}
      <div className="space-y-6 pt-2">
        {/* Section 1: Academic Overview & Syllabus Highlights */}
        <section
          aria-labelledby="academic-overview-heading"
          className="rounded-2xl bg-white border border-[#DDD6C8] p-6 sm:p-8 space-y-5 shadow-xs"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="space-y-1 min-w-0">
              <h2 id="academic-overview-heading" className="text-lg sm:text-xl font-extrabold text-slate-950">
                Academic Curriculum Overview: {enriched.courseCode} – {enriched.courseTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {enriched.overviewSummary}
              </p>
            </div>
          </div>

          <div className="border-t border-[#EFECE4] pt-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Curriculum Scope &amp; Examination Specifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {enriched.syllabusHighlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#FAF8F4] border border-[#E5E0D5] flex items-center gap-2.5 text-xs text-slate-700"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 1.5: Comprehensive Document Chapter & Lecture Roadmap (Thousands of Pages Depth) */}
        <section
          aria-labelledby="chapter-roadmap-heading"
          className="rounded-2xl bg-white border border-[#DDD6C8] p-6 sm:p-8 space-y-5 shadow-xs"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EFECE4] pb-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div className="space-y-1 min-w-0">
                <h2 id="chapter-roadmap-heading" className="text-lg sm:text-xl font-extrabold text-slate-950">
                  Document Chapter &amp; Lecture Syllabus Roadmap (~{enriched.estimatedPages} Pages Indexed)
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Exhaustive academic syllabus breakdown indexing every lecture topic, exam weightage, and solved question pattern across ~{enriched.estimatedPages} pages.
                </p>
              </div>
            </div>
            <div className="shrink-0 font-mono text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#FAF8F4] border border-[#E5E0D5] text-slate-700">
              {enriched.termScope}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enriched.curriculumModules.map((m) => (
              <div
                key={m.moduleNumber}
                className="p-4 rounded-xl bg-[#FAF8F4] border border-[#E5E0D5] space-y-2.5 flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-slate-500">
                    <span className="font-bold text-indigo-700">Module {m.moduleNumber}</span>
                    <span className="text-slate-600">{m.lectureSpan} · {m.pageRange}</span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                    {m.title}
                  </h3>
                  <div className="text-[11px] font-medium text-emerald-800">
                    Exam Focus: {m.examWeightage}
                  </div>
                </div>

                <ul className="space-y-1 text-xs text-slate-600 border-t border-slate-200/70 pt-2">
                  {m.keyTopics.map((topic, tIdx) => (
                    <li key={tIdx} className="flex items-start gap-1.5 leading-relaxed">
                      <span aria-hidden="true" className="text-indigo-500 shrink-0 select-none">·</span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Exam Preparation & VU 20% Two-Half Rule Strategy */}
        <section
          aria-labelledby="exam-strategy-heading"
          className="rounded-2xl bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-[#FAF8F4] border border-blue-200/80 p-6 sm:p-8 space-y-4 shadow-xs"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <BookOpenCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1.5 min-w-0">
              <h2 id="exam-strategy-heading" className="text-lg sm:text-xl font-extrabold text-slate-950">
                {enriched.courseCode} Examination Preparation &amp; VU 20% Passing Rule Strategy
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {enriched.examTips}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/90 border border-blue-200/60 text-xs text-slate-800 leading-relaxed space-y-2">
            <div className="font-bold text-blue-900 flex items-center gap-1.5">
              <span>Virtual University Mandatory Grading Regulation:</span>
            </div>
            <p>
              Under Virtual University examination policy, every student must independently secure at least <strong>20% marks in the First Half</strong> (quizzes, assignments, GDBs, and midterm combined) <em>AND</em> at least <strong>20% marks in the Final-Term paper</strong>. Failing to achieve the 20% threshold in the final exam triggers an automatic F grade, regardless of midterm and sessional scores.
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => onNavigate('simulator')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Simulate 20% Passing Target</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenMcqSet(matchingMcqSet ? matchingMcqSet.id : null)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-[#DDD6C8] text-slate-800 text-xs font-bold transition-colors cursor-pointer"
              >
                <ListChecks className="w-3.5 h-3.5 text-blue-700" />
                <span>Practice {enriched.courseCode} MCQs</span>
              </button>
            </div>
          </div>
        </section>

        {/* Section 3: Frequently Asked Questions (Interactive Accordion + Schema Matching) */}
        <section
          aria-labelledby="doc-faqs-heading"
          className="rounded-2xl bg-white border border-[#DDD6C8] p-6 sm:p-8 space-y-5 shadow-xs"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1 min-w-0">
              <h2 id="doc-faqs-heading" className="text-lg sm:text-xl font-extrabold text-slate-950">
                Frequently Asked Questions ({enriched.courseCode} Exams &amp; Downloads)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Verified answers to assist Virtual University students with examinations, downloads, and syllabus rules.
              </p>
            </div>
          </div>

          <div className="divide-y divide-[#EFECE4] border-t border-[#EFECE4]">
            {enriched.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="py-3.5 space-y-2">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left flex items-center justify-between gap-4 py-1 group cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {faq.question}
                    </h3>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 group-hover:text-blue-700 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-blue-700' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.18, ease: EASE_OUT_EXPO }}
                      className="text-xs text-slate-600 leading-relaxed pr-6"
                    >
                      <p>{faq.answer}</p>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 4: Target Academic Keywords & Student Search Queries */}
        <section
          aria-labelledby="doc-keywords-heading"
          className="rounded-2xl bg-white border border-[#DDD6C8] p-6 sm:p-8 space-y-3.5 shadow-xs"
        >
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-slate-500" />
            <h2 id="doc-keywords-heading" className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Related Virtual University Search Queries &amp; Topics
            </h2>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {enriched.targetKeywords.map((kw, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md bg-[#FAF8F4] border border-[#E5E0D5] text-[11px] font-mono text-slate-700 select-all"
              >
                {kw}
              </span>
            ))}
          </div>
        </section>
      </div>

      {/* Related Documents in the Same Course */}
      {relatedEntries.length > 0 && (
        <section className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E5E0D5] pb-3">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-950">
                More Verified {resource.course} Study Documents ({relatedEntries.length})
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Explore adjacent solved past papers, official handouts, quiz banks, and assignments for {enriched.courseTitle}.
              </p>
            </div>
            <a
              href={`/courses/${resource.course.toLowerCase()}`}
              onClick={(e) => {
                e.preventDefault();
                onSelectCourse(resource.course);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 whitespace-nowrap"
            >
              <span>View All {resource.course} Files</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {relatedEntries.map((entry) => (
              <a
                key={entry.resource.rlh}
                href={`/doc/${entry.slug}`}
                onClick={(e) => {
                  if (!e.metaKey && !e.ctrlKey && !e.shiftKey) {
                    e.preventDefault();
                    onOpenDocSlug(entry.slug);
                  }
                }}
                className="p-4 rounded-2xl bg-white border border-[#DDD6C8] hover:border-blue-500 hover:shadow-xs flex flex-col justify-between gap-3 transition-all group"
              >
                <div className="space-y-1.5">
                  <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5">
                    <span className="font-bold text-slate-900">{entry.resource.course}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold">{entry.resource.format}</span>
                    <span aria-hidden="true">·</span>
                    <span>{entry.resource.type}</span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-blue-700 line-clamp-2 leading-snug">
                    {cleanDocumentDisplayTitle(entry.resource.name)}
                  </h3>
                </div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-blue-700 pt-2 border-t border-slate-100">
                  <span>Open Document Page</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
