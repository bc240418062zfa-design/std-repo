import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calculator,
  Check,
  CheckCircle2,
  ChevronDown,
  Download,
  Eye,
  EyeOff,
  FileText,
  Layers,
  ListChecks,
  Loader2,
  Printer,
  RefreshCw,
  RotateCcw,
  Search,
  Share2,
  SlidersHorizontal,
  X,
  XCircle
} from 'lucide-react';
import { MidtermDocPayload } from '../types/midterm';
import { NotFoundPage } from './NotFoundPage';
import {
  findMidtermEntryBySlug,
  getMidtermCoursePrefixNeighbors,
  getMidtermSiblingEntry,
  readInlineSsrMidtermDoc
} from '../utils/midtermPrep';

interface MidtermDocPageProps {
  requestedSlug: string;
  onOpenMidtermDoc: (filename: string) => void;
  onOpenMidtermHub: () => void;
  onSelectCourse: (courseCode: string) => void;
  onNavigate: (page: string) => void;
  /** Library search from the not-found state (optional; falls back to home). */
  onSearch?: (query: string) => void;
}

const LETTERS = ['a', 'b', 'c', 'd', 'e', 'f'] as const;

export const MidtermDocPage: React.FC<MidtermDocPageProps> = ({
  requestedSlug,
  onOpenMidtermDoc,
  onOpenMidtermHub,
  onSelectCourse,
  onNavigate,
  onSearch
}) => {
  const entry = useMemo(() => findMidtermEntryBySlug(requestedSlug), [requestedSlug]);
  const siblingEntry = useMemo(
    () => (entry ? getMidtermSiblingEntry(entry) : null),
    [entry]
  );
  const neighborEntries = useMemo(
    () => (entry ? getMidtermCoursePrefixNeighbors(entry, 8) : []),
    [entry]
  );

  const [docData, setDocData] = useState<MidtermDocPayload | null>(() =>
    entry ? readInlineSsrMidtermDoc(entry.dataKey) : null
  );
  const [loading, setLoading] = useState<boolean>(() =>
    Boolean(entry && !readInlineSsrMidtermDoc(entry.dataKey))
  );
  const [error, setError] = useState<string | null>(null);
  const [reloadNonce, setReloadNonce] = useState(0);

  // Study / Interactive controls
  const [mcqMode, setMcqMode] = useState<'study' | 'quiz'>('study');
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [subMode, setSubMode] = useState<'transcript' | 'recall'>('transcript');
  const [revealedSubIds, setRevealedSubIds] = useState<Set<number>>(new Set());

  const [selectedTopic, setSelectedTopic] = useState<string>('ALL');
  // Mobile: the sidebar rail (study controls + topics) is collapsed by
  // default so the questions are visible immediately on a phone.
  const [mobileRailOpen, setMobileRailOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    setSelectedTopic('ALL');
    setSearchQuery('');
    setQuizAnswers({});
    setRevealedSubIds(new Set());
    setMcqMode('study');
    setSubMode('transcript');

    if (!entry) {
      setDocData(null);
      setLoading(false);
      return;
    }

    const inlineDoc = readInlineSsrMidtermDoc(entry.dataKey);
    if (inlineDoc && reloadNonce === 0) {
      setDocData(inlineDoc);
      setLoading(false);
      setError(null);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    fetch(`/midterm-data/${encodeURIComponent(entry.dataKey)}.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<MidtermDocPayload>;
      })
      .then((payload) => {
        if (!active) return;
        setDocData(payload);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setError((err as Error).message || 'Unable to load midterm study bank.');
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [entry, reloadNonce]);

  const filteredMcqs = useMemo(() => {
    if (!docData?.mcqs) return [];
    const qLower = searchQuery.trim().toLowerCase();
    return docData.mcqs.filter((item) => {
      if (selectedTopic !== 'ALL' && item.topic !== selectedTopic) return false;
      if (!qLower) return true;
      return (
        item.question.toLowerCase().includes(qLower) ||
        item.topic.toLowerCase().includes(qLower) ||
        item.options.some((o) => o.toLowerCase().includes(qLower))
      );
    });
  }, [docData, selectedTopic, searchQuery]);

  const filteredSubjective = useMemo(() => {
    if (!docData?.subjective) return [];
    const qLower = searchQuery.trim().toLowerCase();
    return docData.subjective.filter((item) => {
      if (selectedTopic !== 'ALL' && item.topic !== selectedTopic) return false;
      if (!qLower) return true;
      return (
        item.question.toLowerCase().includes(qLower) ||
        item.answer.toLowerCase().includes(qLower) ||
        item.topic.toLowerCase().includes(qLower)
      );
    });
  }, [docData, selectedTopic, searchQuery]);

  const quizStats = useMemo(() => {
    const list = docData?.mcqs || [];
    let answered = 0;
    let correct = 0;
    for (const item of list) {
      const picked = quizAnswers[item.number];
      if (picked !== undefined) {
        answered++;
        if (item.correctIndex !== null && picked === item.correctIndex) {
          correct++;
        }
      }
    }
    return {
      total: list.length,
      answered,
      correct,
      accuracy: answered > 0 ? Math.round((correct / answered) * 100) : 0
    };
  }, [docData, quizAnswers]);

  const handleCopyLink = async () => {
    if (!entry) return;
    const url = `https://study.mihora.tech/midterm-prep/${entry.filename}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Clipboard blocked
    }
  };

  if (!entry) {
    return (
      <NotFoundPage
        title="Midterm Preparation File Not Found"
        message={`We couldn't locate a midterm preparation file matching "${requestedSlug}". Browse all 664 solved objective & subjective packs in the Midterm Prep 2026 Hub.`}
        requestedPath={`/midterm-prep/${requestedSlug}`}
        onNavigateHome={() => onNavigate('home')}
        onOpenMidtermPrep={onOpenMidtermHub}
        onNavigate={onNavigate}
        onSelectCourse={onSelectCourse}
        onSearch={(q) => (onSearch ? onSearch(q) : onNavigate('home'))}
      />
    );
  }

  const isMcq = entry.kind === 'mcqs';
  const topicsList = docData?.topics?.length ? docData.topics : entry.topics;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-7">
      {/* Dark Observatory Document Header */}
      <header className="relative overflow-hidden rounded-3xl bg-studio-stage text-white border border-slate-800 p-6 sm:p-8 shadow-[0_20px_50px_-15px_rgba(4,8,20,0.65)]">
        <div className="absolute inset-0 bg-academic-grid opacity-30 pointer-events-none" aria-hidden="true" />
        <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-400/50 to-transparent" aria-hidden="true" />

        <div className="relative z-10 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <a
              href="/midterm-prep"
              onClick={(e) => {
                e.preventDefault();
                onOpenMidtermHub();
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Midterm Prep 2026 Hub</span>
            </a>

            <div className="text-[11px] font-mono font-semibold text-amber-300 uppercase tracking-wider tabular-nums">
              {entry.courseCode} · {isMcq ? 'OBJECTIVE MCQS BANK' : 'SOLVED SUBJECTIVE Q&AS'} · {entry.itemCount}{' '}
              {isMcq ? 'QUESTIONS' : 'SOLVED Q&AS'} · {entry.pageCount} PAGES
            </div>
          </div>

          <div className="space-y-2">
            <h1
              data-speakable="true"
              className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight"
              style={{ textWrap: 'balance' }}
            >
              {entry.courseCode} — {entry.courseTitle}:{' '}
              <span className={isMcq ? 'text-sky-300' : 'text-amber-300'}>
                {isMcq ? 'Midterm Important MCQs' : 'Midterm Important Subjective (Solved)'}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Department: <strong className="text-white">{entry.faculty}</strong>. Complete extracted{' '}
              {isMcq
                ? 'multiple-choice question bank with verified bold answer keys and interactive self-test mode.'
                : 'solved midterm subjective questions and model answers organized by syllabus topic.'}
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            {siblingEntry && (
              <a
                href={`/midterm-prep/${siblingEntry.filename}`}
                onClick={(e) => {
                  e.preventDefault();
                  onOpenMidtermDoc(siblingEntry.filename);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-white hover:bg-sky-50 text-slate-950 text-xs font-bold transition-colors shadow-xs"
              >
                {siblingEntry.kind === 'mcqs' ? (
                  <ListChecks className="w-4 h-4 text-blue-700" />
                ) : (
                  <FileText className="w-4 h-4 text-amber-700" />
                )}
                <span>
                  Switch to {siblingEntry.kind === 'mcqs' ? `Important MCQs (${siblingEntry.itemCount})` : `Solved Subjective (${siblingEntry.itemCount})`}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            )}

            <a
              href={`/midterm-data/${encodeURIComponent(entry.dataKey)}.json`}
              download={`${entry.dataKey}.json`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Questions (.json)</span>
            </a>

            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 min-h-[44px] rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-slate-100 text-xs font-semibold transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied' : 'Copy Share Link'}</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-slate-100 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Notes</span>
            </button>

            <a
              href={`/courses/${entry.courseCode.toLowerCase()}`}
              onClick={(e) => {
                e.preventDefault();
                onSelectCourse(entry.courseCode);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 min-h-[44px] rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-sky-200 text-xs font-semibold transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>All {entry.courseCode} Files</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Layout: Left Topic & Control Rail + Right Complete Bank */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sidebar Topic Index & Mode Controls */}
        <aside className="lg:col-span-4 lg:sticky lg:top-20 space-y-4">
          {/* Mobile-only toggle: the sidebar rail collapses on phones so the
              questions are visible immediately; one tap opens the controls. */}
          <button
            type="button"
            onClick={() => setMobileRailOpen((v) => !v)}
            aria-expanded={mobileRailOpen}
            className="lg:hidden w-full min-h-[44px] px-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between text-xs font-bold text-slate-900 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-blue-700" />
              <span>Study Controls &amp; Topics</span>
            </span>
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${mobileRailOpen ? 'rotate-180' : ''}`}
            />
          </button>
          <div className={`${mobileRailOpen ? 'block' : 'hidden'} lg:block space-y-4`}>
          {/* Study Mode Control Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                Study Controls
              </span>
              {isMcq && mcqMode === 'quiz' && (
                <span className="text-xs font-mono font-bold text-blue-700 tabular-nums">
                  Score: {quizStats.correct}/{quizStats.answered} ({quizStats.accuracy}%)
                </span>
              )}
            </div>

            {isMcq ? (
              <div className="space-y-2.5">
                <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setMcqMode('study')}
                    className={`py-2 px-2.5 min-h-[44px] rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      mcqMode === 'study'
                        ? 'bg-[#0B1526] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-950'
                    }`}
                  >
                    Study Key View
                  </button>
                  <button
                    type="button"
                    onClick={() => setMcqMode('quiz')}
                    className={`py-2 px-2.5 min-h-[44px] rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      mcqMode === 'quiz'
                        ? 'bg-blue-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-950'
                    }`}
                  >
                    Self-Test Quiz
                  </button>
                </div>

                {mcqMode === 'quiz' && (
                  <div className="flex items-center justify-between pt-1 text-xs text-slate-600">
                    <span className="tabular-nums">
                      Answered {quizStats.answered} of {quizStats.total}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuizAnswers({})}
                      className="inline-flex items-center gap-1 text-blue-700 hover:underline font-semibold cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setSubMode('transcript')}
                    className={`py-2 px-2.5 min-h-[44px] rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      subMode === 'transcript'
                        ? 'bg-[#0B1526] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-950'
                    }`}
                  >
                    Full Transcript
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubMode('recall')}
                    className={`py-2 px-2.5 min-h-[44px] rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      subMode === 'recall'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-950'
                    }`}
                  >
                    Recall Flash Mode
                  </button>
                </div>
                {subMode === 'recall' && (
                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        setRevealedSubIds(new Set((docData?.subjective || []).map((q) => q.number)))
                      }
                      className="inline-flex items-center gap-1 text-blue-700 hover:underline font-semibold cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Reveal All</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRevealedSubIds(new Set())}
                      className="inline-flex items-center gap-1 text-slate-600 hover:underline font-semibold cursor-pointer"
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hide All</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* In-File Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter questions in this file..."
                className="w-full pl-9 pr-8 py-2.5 min-h-[44px] rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-700 focus:outline-none text-xs text-slate-900"
                aria-label="Filter questions inside this midterm file"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  aria-label="Clear question filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Extracted Syllabus Topic Filter */}
          {topicsList.length > 0 && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-700" />
                  <span>Topics Covered ({topicsList.length})</span>
                </h2>
                {selectedTopic !== 'ALL' && (
                  <button
                    type="button"
                    onClick={() => setSelectedTopic('ALL')}
                    className="text-[11px] font-semibold text-blue-700 hover:underline cursor-pointer"
                  >
                    Show All
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto space-y-1 pr-1">
                <button
                  type="button"
                  onClick={() => setSelectedTopic('ALL')}
                  className={`w-full text-left px-3 py-2 min-h-[44px] rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    selectedTopic === 'ALL'
                      ? 'bg-[#0B1526] text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  All Syllabus Topics ({entry.itemCount})
                </button>
                {topicsList.map((topic) => {
                  const active = selectedTopic === topic;
                  return (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => setSelectedTopic(topic)}
                      className={`w-full text-left px-3 py-2 min-h-[44px] rounded-lg text-xs transition-colors cursor-pointer leading-snug ${
                        active
                          ? 'bg-blue-700 text-white font-semibold'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {topic}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Passing Calculator Link Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-2.5 border border-slate-800">
            <div className="text-[11px] font-mono text-amber-300 uppercase tracking-wider font-semibold">
              VU 20% Two-Half Rule
            </div>
            <h2 className="text-sm font-bold leading-snug">
              Check Your {entry.courseCode} Midterm &amp; Final Passing Target
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Simulate your quiz, assignment, and midterm marks to calculate the exact Final-Term score needed.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('simulator')}
              className="w-full py-2 px-3 min-h-[44px] rounded-xl bg-white hover:bg-sky-50 text-slate-950 text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer mt-1"
            >
              <Calculator className="w-3.5 h-3.5 text-blue-700" />
              <span>Open Passing Simulator</span>
            </button>
          </div>
          </div>
        </aside>

        {/* Complete Question Bank / Transcript Main Column */}
        <main className="lg:col-span-8 space-y-4">
          {loading ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
              <Loader2 className="w-7 h-7 animate-spin text-blue-700 mx-auto" />
              <p className="text-sm font-semibold text-slate-800">
                Loading full {entry.courseCode} midterm bank...
              </p>
            </div>
          ) : error ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 text-center space-y-4 shadow-xs">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-extrabold text-slate-950">
                  Couldn&rsquo;t load this question bank
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                  The file couldn&rsquo;t be fetched right now. Your connection
                  may have dropped, or the file is temporarily unavailable.
                  Nothing is lost &mdash; try again, or head back to the hub.
                </p>
                <p className="text-xs font-mono text-slate-400 break-words">
                  Error: {error}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setReloadNonce((n) => n + 1)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0B1526] hover:bg-blue-700 text-white text-sm font-bold transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Try again</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenMidtermHub}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-800 text-sm font-bold transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Midterm Hub</span>
                </button>
              </div>
            </div>
          ) : isMcq ? (
            <>
              <div className="flex items-center justify-between px-1 text-xs text-slate-600">
                <span className="tabular-nums">
                  Showing <strong className="text-slate-950 font-mono">{filteredMcqs.length}</strong> of{' '}
                  <strong className="text-slate-950 font-mono">{docData?.mcqs?.length || 0}</strong> verified MCQs
                </span>
                <span className="font-mono text-[11px] text-slate-500">
                  {mcqMode === 'study' ? 'Verified Correct Answers Marked' : 'Interactive Self-Test Active'}
                </span>
              </div>

              {filteredMcqs.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-2">
                  <p className="text-sm font-bold text-slate-900">No questions matched your filter.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTopic('ALL');
                      setSearchQuery('');
                    }}
                    className="text-xs font-semibold text-blue-700 hover:underline cursor-pointer"
                  >
                    Reset Question Filter
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredMcqs.map((q) => {
                    const userPick = quizAnswers[q.number];
                    const hasPicked = userPick !== undefined;

                    return (
                      <article
                        key={`${q.number}-${q.question.slice(0, 24)}`}
                        className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs"
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-2 pb-2.5 border-b border-slate-100">
                          <span className="text-xs font-mono font-extrabold text-blue-700 tabular-nums">
                            Question {q.number}
                          </span>
                          <span className="text-[11px] font-mono text-slate-500">
                            {q.topic}
                          </span>
                        </div>

                        <h3 className="text-sm sm:text-base font-bold text-slate-950 leading-relaxed break-words">
                          {q.question}
                        </h3>

                        <div className="grid grid-cols-1 gap-2">
                          {q.options.map((optText, optIdx) => {
                            const letter = LETTERS[optIdx] || String(optIdx + 1);
                            const isCorrect = q.correctIndex === optIdx;
                            const hasVerifiedAnswer =
                              q.correctIndex !== null && q.correctIndex !== undefined;
                            const isUserPick = userPick === optIdx;

                            let rowClass =
                              'bg-slate-50/80 border-slate-200/90 text-slate-800';
                            if (mcqMode === 'study') {
                              if (isCorrect) {
                                rowClass =
                                  'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold';
                              }
                            } else if (hasPicked) {
                              if (isCorrect) {
                                rowClass =
                                  'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold';
                              } else if (isUserPick && !isCorrect && hasVerifiedAnswer) {
                                rowClass =
                                  'bg-rose-50 border-rose-300 text-rose-900 font-medium';
                              }
                            } else {
                              rowClass =
                                'bg-slate-50 hover:bg-blue-50/60 border-slate-200 hover:border-blue-300 text-slate-800 cursor-pointer';
                            }

                            if (mcqMode === 'quiz') {
                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  onClick={() =>
                                    setQuizAnswers((prev) => ({
                                      ...prev,
                                      [q.number]: optIdx
                                    }))
                                  }
                                  className={`w-full text-left px-4 py-3 rounded-xl border text-xs sm:text-sm flex items-start justify-between gap-3 transition-colors ${rowClass}`}
                                >
                                  <span className="flex items-start gap-2.5 leading-relaxed min-w-0">
                                    <span className="font-mono font-bold uppercase text-slate-500 shrink-0">
                                      {letter})
                                    </span>
                                    <span className="min-w-0 break-words">{optText}</span>
                                  </span>
                                  {hasPicked && isCorrect && (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                  )}
                                  {hasPicked && isUserPick && !isCorrect && hasVerifiedAnswer && (
                                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                                  )}
                                </button>
                              );
                            }

                            return (
                              <div
                                key={optIdx}
                                className={`px-4 py-3 rounded-xl border text-xs sm:text-sm flex items-start justify-between gap-3 ${rowClass}`}
                              >
                                <span className="flex items-start gap-2.5 leading-relaxed min-w-0">
                                  <span className="font-mono font-bold uppercase text-slate-500 shrink-0">
                                    {letter})
                                  </span>
                                  <span className="min-w-0 break-words">{optText}</span>
                                </span>
                                {isCorrect && (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-700 shrink-0">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span className="hidden sm:inline">Correct</span>
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center justify-between px-1 text-xs text-slate-600">
                <span className="tabular-nums">
                  Showing <strong className="text-slate-950 font-mono">{filteredSubjective.length}</strong> of{' '}
                  <strong className="text-slate-950 font-mono">{docData?.subjective?.length || 0}</strong> solved subjective questions
                </span>
                <span className="font-mono text-[11px] text-slate-500">
                  {subMode === 'transcript' ? 'Complete Solved Answers' : 'Tap Card to Reveal Answer'}
                </span>
              </div>

              {filteredSubjective.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-2">
                  <p className="text-sm font-bold text-slate-900">No subjective questions matched your filter.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTopic('ALL');
                      setSearchQuery('');
                    }}
                    className="text-xs font-semibold text-blue-700 hover:underline cursor-pointer"
                  >
                    Reset Question Filter
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredSubjective.map((item) => {
                    const isRevealed =
                      subMode === 'transcript' || revealedSubIds.has(item.number);

                    return (
                      <article
                        key={`${item.number}-${item.question.slice(0, 24)}`}
                        className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 space-y-3.5 shadow-xs"
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-2 pb-2.5 border-b border-slate-100">
                          <span className="text-xs font-mono font-extrabold text-amber-800 tabular-nums">
                            Q{item.number}{item.marks ? ` · ${item.marks}` : ''}
                          </span>
                          <span className="text-[11px] font-mono text-slate-500">
                            {item.topic}
                          </span>
                        </div>

                        <h3 className="text-sm sm:text-base font-bold text-slate-950 leading-relaxed break-words">
                          {item.question}
                        </h3>

                        {subMode === 'recall' && (
                          <div>
                            <button
                              type="button"
                              onClick={() =>
                                setRevealedSubIds((prev) => {
                                  const next = new Set(prev);
                                  if (next.has(item.number)) next.delete(item.number);
                                  else next.add(item.number);
                                  return next;
                                })
                              }
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 cursor-pointer"
                            >
                              {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              <span>{isRevealed ? 'Hide Solved Answer' : 'Reveal Solved Answer'}</span>
                            </button>
                          </div>
                        )}

                        {isRevealed && item.answer && (
                          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-800 leading-relaxed space-y-1.5">
                            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700">
                              Verified Answer
                            </div>
                            <p className="whitespace-pre-line break-words">{item.answer}</p>
                          </div>
                        )}
                        {isRevealed && !item.answer && (
                          <p className="text-xs text-slate-500 italic">
                            Model answer was not extracted for this question in the source PDF.
                          </p>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* Supplemental / Unstructured lines if present in source PDF */}
          {docData?.extraLines && docData.extraLines.length > 0 && (
            <section className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 space-y-2">
              <h2 className="text-sm font-bold text-slate-900">
                Additional Reference Notes from {entry.courseCode} PDF
              </h2>
              <div className="space-y-1.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                {docData.extraLines.map((line, i) => (
                  <p key={i} className="break-words">{line}</p>
                ))}
              </div>
            </section>
          )}

          {/* Related Same-Department Midterm Prep Packs */}
          {neighborEntries.length > 0 && (
            <section className="pt-4 space-y-3">
              <h2 className="text-lg font-bold text-slate-950">
                Related Midterm Prep 2026 Packs
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {neighborEntries.map((n) => (
                  <a
                    key={n.filename}
                    href={`/midterm-prep/${n.filename}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onOpenMidtermDoc(n.filename);
                    }}
                    className="group p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-400 transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="text-[11px] font-mono font-semibold text-blue-700 tabular-nums">
                        {n.courseCode} · {n.kind === 'mcqs' ? 'MCQs' : 'Subjective'} · {n.itemCount} Qs
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-700 leading-snug mt-0.5">
                        {n.courseTitle}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </a>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};
