import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bookmark,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Code2,
  Copy,
  Eye,
  EyeOff,
  FileText,
  Flame,
  Keyboard,
  Layers,
  Lightbulb,
  ListChecks,
  PenLine,
  RotateCcw,
  Search,
  Share2,
  Sparkles,
  Zap
} from 'lucide-react';
import { subjectiveSets } from '../data/subjective';
import { mcqSets } from '../data/mcqs';
import coursesData from '../data/courses.json';
import { reviewsIndex } from '../utils/reviewsClient';
import { Course, SubjectiveMarks, SubjectiveQuestion, SubjectiveSet } from '../types';
import { CelestialOrbitalRings, CelestialDivider } from '../components/CelestialBackdrop';

interface SubjectivePageProps {
  activeSetId: string | null;
  onSelectSetId: (setId: string | null) => void;
  onOpenMcqSet?: (mcqSetId: string) => void;
  onSelectCourseInLibrary?: (courseCode: string) => void;
  onOpenPastPapers?: (courseCode: string) => void;
}

type FastLearningMode = 'flashcard' | 'cram' | 'drill';
type DeckFilter = 'all' | 'unmastered' | 'mastered' | 'bookmarked';

interface SubjectiveSetProgress {
  mastered: string[];
  bookmarks: string[];
}

type StoredSubjectiveProgress = Record<string, SubjectiveSetProgress>;

const STORAGE_KEY = 'mihora_subjective_progress_v1';

interface CourseTheme {
  badgeBg: string;
  badgeText: string;
  accentBar: string;
  subtleRing: string;
}

function getCourseTheme(_code: string): CourseTheme {
  return {
    badgeBg: 'bg-[#F3EFE6] border border-[#DDD6C8] group-hover:bg-amber-700 group-hover:border-amber-700 transition-colors',
    badgeText: 'text-[#0D1B2A] group-hover:text-white',
    accentBar: 'bg-amber-700',
    subtleRing: 'hover:border-amber-700/50'
  };
}

function loadProgress(): StoredSubjectiveProgress {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function saveProgress(data: StoredSubjectiveProgress) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage quota errors
  }
}

function getShareUrl(setId: string): string {
  if (typeof window === 'undefined') return `https://study.mihora.tech/subjective/${setId}`;
  return `${window.location.origin}/subjective/${setId}`;
}

function getMarksStyle(marks: SubjectiveMarks): { label: string; colorClass: string } {
  if (marks === 2) {
    return {
      label: '2 Marks · Short Q',
      colorClass: 'text-sky-700'
    };
  }
  if (marks === 3) {
    return {
      label: '3 Marks · Conceptual',
      colorClass: 'text-amber-700'
    };
  }
  return {
    label: '5 Marks · Long Q',
    colorClass: 'text-emerald-700'
  };
}

interface MasteryRingProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
  trackColor?: string;
  strokeColor?: string;
  labelColor?: string;
  sublabel?: string;
}

const MasteryRing: React.FC<MasteryRingProps> = ({
  percent,
  size = 76,
  strokeWidth = 6,
  trackColor = 'rgba(148,163,184,0.22)',
  strokeColor = '#38BDF8',
  labelColor = 'text-white',
  sublabel
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, percent));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className={`font-mono font-bold text-sm tabular-nums ${labelColor}`}>{clamped}%</span>
        {sublabel && <span className="text-[9px] uppercase tracking-wider text-slate-400 mt-0.5">{sublabel}</span>}
      </div>
    </div>
  );
};

export const SubjectivePage: React.FC<SubjectivePageProps> = ({
  activeSetId,
  onSelectSetId,
  onOpenMcqSet,
  onSelectCourseInLibrary,
  onOpenPastPapers
}) => {
  const [hubSearch, setHubSearch] = useState<string>('');
  const [courseFinderQuery, setCourseFinderQuery] = useState<string>('');
  const [copiedSetId, setCopiedSetId] = useState<string | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const [progress, setProgress] = useState<StoredSubjectiveProgress>(loadProgress);
  const [mode, setMode] = useState<FastLearningMode>('flashcard');
  const [topicFilter, setTopicFilter] = useState<string>('ALL');
  const [marksFilter, setMarksFilter] = useState<'ALL' | SubjectiveMarks>('ALL');
  const [deckFilter, setDeckFilter] = useState<DeckFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Flashcard state
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [showFullModel, setShowFullModel] = useState<boolean>(false);

  // Cram sheet state
  const [hooksOnlyMode, setHooksOnlyMode] = useState<boolean>(false);
  const [cramBlindMode, setCramBlindMode] = useState<boolean>(false);
  const [cramRevealedIds, setCramRevealedIds] = useState<Set<string>>(new Set());

  // Drill mode state
  const [drillDrafts, setDrillDrafts] = useState<Record<string, string>>({});
  const [drillRevealed, setDrillRevealed] = useState<boolean>(false);
  const [confirmReset, setConfirmReset] = useState<boolean>(false);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const activeSet: SubjectiveSet | null = useMemo(() => {
    if (!activeSetId) return null;
    return subjectiveSets.find((s) => s.id === activeSetId) || null;
  }, [activeSetId]);

  const matchingMcqSet = useMemo(() => {
    if (!activeSet) return null;
    return (
      mcqSets.find((m) => m.courseCode.toUpperCase() === activeSet.courseCode.toUpperCase()) || null
    );
  }, [activeSet]);

  const activeProgress: SubjectiveSetProgress = useMemo(() => {
    if (!activeSet) return { mastered: [], bookmarks: [] };
    return progress[activeSet.id] || { mastered: [], bookmarks: [] };
  }, [progress, activeSet]);

  useEffect(() => {
    setTopicFilter('ALL');
    setMarksFilter('ALL');
    setDeckFilter('all');
    setSearchQuery('');
    setCurrentIndex(0);
    setIsRevealed(false);
    setShowFullModel(false);
    setDrillRevealed(false);
    setConfirmReset(false);
  }, [activeSet?.id]);

  // Reset reveal state cleanly on card switch
  useEffect(() => {
    setIsRevealed(false);
    setShowFullModel(false);
    setDrillRevealed(false);
  }, [currentIndex, mode]);

  const summary = useMemo(() => {
    let totalQuestions = 0;
    let totalMastered = 0;
    let totalTopics = 0;
    let short2Count = 0;
    let conceptual3Count = 0;
    let long5Count = 0;

    for (const s of subjectiveSets) {
      totalQuestions += s.questions.length;
      totalTopics += s.topics.length;
      const sp = progress[s.id];
      const masteredSet = new Set(sp?.mastered || []);
      for (const q of s.questions) {
        if (masteredSet.has(q.id)) totalMastered++;
        if (q.marks === 2) short2Count++;
        else if (q.marks === 3) conceptual3Count++;
        else long5Count++;
      }
    }

    const masteryPct = totalQuestions > 0 ? Math.round((totalMastered / totalQuestions) * 100) : 0;
    return {
      subjectCount: subjectiveSets.length,
      totalQuestions,
      totalMastered,
      totalTopics,
      masteryPct,
      short2Count,
      conceptual3Count,
      long5Count
    };
  }, [progress]);

  const handleCopyShareLink = async (setId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const url = getShareUrl(setId);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedSetId(setId);
      window.setTimeout(() => {
        setCopiedSetId((cur) => (cur === setId ? null : cur));
      }, 2200);
    } catch {
      // Ignore clipboard failures
    }
  };

  const handleNativeShare = async (set: SubjectiveSet) => {
    const url = getShareUrl(set.id);
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: `${set.courseCode} Subjective Fast-Prep – MIHORA VU`,
          text: `Revise ${set.questions.length} high-yield ${set.courseCode} (${set.courseTitle}) subjective questions with 10-second memory hooks & examiner key points:`,
          url
        });
        return;
      } catch {
        // Fallback to clipboard copy
      }
    }
    handleCopyShareLink(set.id);
  };

  const handleCopySnippet = async (questionId: string, snippet: string) => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopiedCodeId(questionId);
      window.setTimeout(() => {
        setCopiedCodeId((cur) => (cur === questionId ? null : cur));
      }, 1800);
    } catch {
      // Ignore clipboard failures
    }
  };

  const handleToggleMastered = useCallback(
    (questionId: string) => {
      if (!activeSet) return;
      setProgress((prev) => {
        const cur = prev[activeSet.id] || { mastered: [], bookmarks: [] };
        const exists = cur.mastered.includes(questionId);
        return {
          ...prev,
          [activeSet.id]: {
            ...cur,
            mastered: exists
              ? cur.mastered.filter((id) => id !== questionId)
              : [...cur.mastered, questionId]
          }
        };
      });
    },
    [activeSet]
  );

  const handleToggleBookmark = useCallback(
    (questionId: string) => {
      if (!activeSet) return;
      setProgress((prev) => {
        const cur = prev[activeSet.id] || { mastered: [], bookmarks: [] };
        const exists = cur.bookmarks.includes(questionId);
        return {
          ...prev,
          [activeSet.id]: {
            ...cur,
            bookmarks: exists
              ? cur.bookmarks.filter((id) => id !== questionId)
              : [...cur.bookmarks, questionId]
          }
        };
      });
    },
    [activeSet]
  );

  const handleResetProgress = () => {
    if (!activeSet) return;
    setProgress((prev) => {
      const next = { ...prev };
      delete next[activeSet.id];
      return next;
    });
    setConfirmReset(false);
    setDeckFilter('all');
    setCurrentIndex(0);
  };

  const filteredQuestions = useMemo(() => {
    if (!activeSet) return [];
    const q = searchQuery.trim().toLowerCase();

    return activeSet.questions.filter((item) => {
      if (topicFilter !== 'ALL' && item.topic !== topicFilter) return false;
      if (marksFilter !== 'ALL' && item.marks !== marksFilter) return false;

      if (q) {
        const matches =
          item.question.toLowerCase().includes(q) ||
          item.quickHook.toLowerCase().includes(q) ||
          item.topic.toLowerCase().includes(q) ||
          item.modelAnswer.toLowerCase().includes(q) ||
          item.keyPoints.some((kp) => kp.toLowerCase().includes(q));
        if (!matches) return false;
      }

      if (mode !== 'cram') {
        const isMastered = activeProgress.mastered.includes(item.id);
        const isSaved = activeProgress.bookmarks.includes(item.id);
        if (deckFilter === 'unmastered' && isMastered) return false;
        if (deckFilter === 'mastered' && !isMastered) return false;
        if (deckFilter === 'bookmarked' && !isSaved) return false;
      }

      return true;
    });
  }, [
    activeSet,
    topicFilter,
    marksFilter,
    searchQuery,
    mode,
    deckFilter,
    activeProgress.mastered,
    activeProgress.bookmarks
  ]);

  useEffect(() => {
    if (filteredQuestions.length === 0) {
      setCurrentIndex(0);
    } else if (currentIndex >= filteredQuestions.length) {
      setCurrentIndex(filteredQuestions.length - 1);
    }
  }, [filteredQuestions.length, currentIndex]);

  const currentQuestion: SubjectiveQuestion | undefined = filteredQuestions[currentIndex];

  const activeStats = useMemo(() => {
    if (!activeSet) return { total: 0, mastered: 0, bookmarked: 0, pct: 0 };
    const total = activeSet.questions.length;
    const mastered = activeProgress.mastered.length;
    const bookmarked = activeProgress.bookmarks.length;
    const pct = total > 0 ? Math.round((mastered / total) * 100) : 0;
    return { total, mastered, bookmarked, pct };
  }, [activeSet, activeProgress]);

  // Keyboard shortcuts in Flashcard mode
  useEffect(() => {
    if (!activeSet || mode !== 'flashcard' || !currentQuestion) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      if (e.code === 'Space') {
        e.preventDefault();
        setIsRevealed((r) => !r);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentIndex((i) => Math.min(filteredQuestions.length - 1, i + 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentIndex((i) => Math.max(0, i - 1));
      } else if (key === 'm') {
        e.preventDefault();
        handleToggleMastered(currentQuestion.id);
      } else if (key === 'f') {
        e.preventDefault();
        handleToggleBookmark(currentQuestion.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    activeSet,
    mode,
    currentQuestion,
    filteredQuestions.length,
    handleToggleMastered,
    handleToggleBookmark
  ]);

  const toggleCramReveal = (id: string) => {
    setCramRevealedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // =========================================================================
  // VIEW 1: SUBJECTIVE FAST-LEARNING DIRECTORY HUB (/subjective)
  // =========================================================================
  if (!activeSet) {
    const filteredHubSets = subjectiveSets.filter((s) => {
      const q = hubSearch.trim().toLowerCase();
      if (!q) return true;
      return (
        s.courseCode.toLowerCase().includes(q) ||
        s.courseTitle.toLowerCase().includes(q) ||
        s.topics.some((t) => t.toLowerCase().includes(q))
      );
    });

    const allCourses = coursesData as Course[];
    const activeCodesSet = new Set(subjectiveSets.map((s) => s.courseCode.toUpperCase()));
    const explorerCourses = allCourses
      .filter((c) => {
        const q = courseFinderQuery.trim().toLowerCase();
        if (!q) return !activeCodesSet.has(c.code.toUpperCase());
        return (
          c.code.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.faculty.toLowerCase().includes(q)
        );
      })
      .slice(0, courseFinderQuery.trim() ? 18 : 12);

    return (
      <div className="min-h-screen bg-[#FAF8F4]">
        {/* Editorial Studio Header */}
        <section className="relative overflow-hidden bg-[#0D1B2A] text-white border-b border-white/10">
          <CelestialOrbitalRings compact />
          <div className="absolute inset-0 bg-academic-grid opacity-30 pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-7 space-y-4"
              >
                <p className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.14em] text-amber-300 font-semibold tabular-nums">
                  Subjective Fast-Learning Studio · {summary.subjectCount} Active Subjects · {summary.totalQuestions} Structured Q&amp;As
                </p>

                <h1
                  className="text-3xl sm:text-5xl font-semibold tracking-tight text-white leading-[1.08]"
                  style={{ textWrap: 'balance' }}
                >
                  Master{' '}
                  <span className="text-amber-300">Short &amp; Long Questions</span>{' '}
                  in Minutes
                </h1>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                  Built for rapid exam recall: every question opens with a 10-second memory hook, examiner marking bullet points, clean code snippets, and interactive self-testing.
                </p>

                {/* Quick Filter Input inside Hero */}
                <div className="pt-2 max-w-md">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={hubSearch}
                      onChange={(e) => setHubSearch(e.target.value)}
                      placeholder="Filter active subjects (CS201, PAK301, SQL, AVL)..."
                      aria-label="Filter subjective fast-learning subjects"
                      className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#132238] border border-white/15 text-sm text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-400/70 transition-colors"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Right Console: Fast-Prep Readiness Overview */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-5 bg-[#132238] border border-white/10 rounded-2xl p-6 space-y-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-[11px] font-mono uppercase tracking-[0.14em] text-amber-300 font-semibold">
                      Fast-Recall Progress
                    </div>
                    <div className="text-2xl font-bold text-white font-mono tabular-nums">
                      {summary.totalMastered} / {summary.totalQuestions}
                    </div>
                    <p className="text-xs text-slate-300">
                      Subjective prompts marked mastered
                    </p>
                  </div>

                  <MasteryRing
                    percent={summary.masteryPct}
                    size={84}
                    strokeWidth={7}
                    strokeColor="#FBBF24"
                    sublabel="Mastered"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-white/10 text-center">
                  <div className="p-2.5 rounded-xl bg-[#0D1B2A] border border-white/5">
                    <div className="font-mono text-base font-bold text-white tabular-nums">
                      {summary.short2Count}
                    </div>
                    <div className="text-[11px] text-slate-400">2-Mark Short</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#0D1B2A] border border-white/5">
                    <div className="font-mono text-base font-bold text-amber-300 tabular-nums">
                      {summary.conceptual3Count}
                    </div>
                    <div className="text-[11px] text-slate-400">3-Mark Concept</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#0D1B2A] border border-white/5">
                    <div className="font-mono text-base font-bold text-emerald-300 tabular-nums">
                      {summary.long5Count}
                    </div>
                    <div className="text-[11px] text-slate-400">5-Mark Long</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
          {/* Active Subject Fast-Learning Decks */}
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-4 border-b border-[#E5E0D5]">
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-[#0D1B2A]">
                  Subjective Fast-Learning Studios
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Open any subject for Flash-Recall Cards, 10-Second Cram Sheets, and Write &amp; Compare exam drills.
                </p>
              </div>
              <div className="text-xs font-mono text-slate-500 tabular-nums">
                {filteredHubSets.length} of {subjectiveSets.length} active subjects
              </div>
            </div>

            {filteredHubSets.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E5E0D5] p-10 text-center space-y-3">
                <p className="text-sm font-semibold text-[#0D1B2A]">
                  No active subjective studio matched &ldquo;{hubSearch}&rdquo;
                </p>
                <button
                  type="button"
                  onClick={() => setHubSearch('')}
                  className="px-4 py-2 rounded-xl bg-[#0D1B2A] hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer transition-colors"
                >
                  Show All Subjective Studios
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredHubSets.map((set, idx) => {
                  const sp = progress[set.id] || { mastered: [], bookmarks: [] };
                  const masteredCount = sp.mastered.length;
                  const pct = Math.round((masteredCount / set.questions.length) * 100);
                  const isCopied = copiedSetId === set.id;
                  const theme = getCourseTheme(set.courseCode);

                  return (
                    <motion.div
                      key={set.id}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 'some' }}
                      transition={{
                        duration: 0.24,
                        delay: Math.min(idx * 0.03, 0.16),
                        ease: [0.16, 1, 0.3, 1]
                      }}
                      whileHover={{ y: -3 }}
                      className={`group bg-white rounded-2xl border border-[#E5E0D5] ${theme.subtleRing} overflow-hidden flex flex-col justify-between transition-all shadow-[0_1px_2px_rgba(13,27,42,0.04)] hover:shadow-[0_12px_28px_-12px_rgba(13,27,42,0.12)]`}
                    >
                      <div className={`h-1 w-full ${theme.accentBar}`} />

                      <div className="p-6 flex-1 flex flex-col justify-between gap-6">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className={`w-12 h-12 rounded-xl ${theme.badgeBg} ${theme.badgeText} font-mono font-bold text-xs flex items-center justify-center shrink-0`}
                              >
                                {set.courseCode}
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-mono text-amber-700 font-semibold tabular-nums">
                                  {set.questions.length} Subjective Qs · {set.topics.length} Topics
                                </div>
                                <a
                                  href={`/subjective/${set.id}`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    onSelectSetId(set.id);
                                  }}
                                  className="block"
                                >
                                  <h3 className="text-lg font-bold text-[#0D1B2A] group-hover:text-blue-700 transition-colors leading-snug truncate">
                                    {set.courseTitle}
                                  </h3>
                                </a>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => handleCopyShareLink(set.id, e)}
                              title="Copy shareable subjective link"
                              aria-label={`Copy shareable link for ${set.courseCode} subjective studio`}
                              className={`p-2.5 rounded-xl border transition-colors cursor-pointer shrink-0 ${
                                isCopied
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                                  : 'bg-[#FAF8F4] hover:bg-[#F3EFE6] border-[#E5E0D5] text-slate-500 hover:text-[#0D1B2A]'
                              }`}
                            >
                              {isCopied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                            </button>
                          </div>

                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
                            {set.description}
                          </p>

                          <div className="text-xs text-slate-500 truncate">
                            Focus: <span className="font-medium text-slate-700">{set.topics.slice(0, 3).join(' · ')}</span>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs font-mono text-slate-500 tabular-nums">
                              <span>
                                <strong className="text-[#0D1B2A]">{masteredCount}</strong>/{set.questions.length} mastered
                              </span>
                              <span>{pct > 0 ? `${pct}% ready` : 'Flash · Cram · Drill'}</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-[#F3EFE6] overflow-hidden">
                              <motion.div
                                className={`h-full rounded-full ${theme.accentBar}`}
                                initial={{ width: 0 }}
                                whileInView={{ width: `${pct}%` }}
                                viewport={{ once: true, amount: 'some' }}
                                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                              />
                            </div>
                          </div>

                          <a
                            href={`/subjective/${set.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              onSelectSetId(set.id);
                            }}
                            className="w-full py-2.5 px-4 rounded-xl bg-[#0D1B2A] hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold transition-colors flex items-center justify-between"
                          >
                            <span>{masteredCount > 0 ? 'Continue Fast-Prep' : 'Launch Subjective Studio'}</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </section>

          <CelestialDivider />

          {/* Curriculum Expansion Directory (All 411 Courses Linked to Real Files & Student Reviews) */}
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E5E0D5]">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-semibold text-[#0D1B2A]">
                  Full VU Curriculum Explorer ({allCourses.length} Subjects)
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
                  Expanding subject-by-subject. Jump directly to any subject&apos;s verified exam reviews and solved notes archive below.
                </p>
              </div>

              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={courseFinderQuery}
                  onChange={(e) => setCourseFinderQuery(e.target.value)}
                  placeholder="Find any course (CS101, MGT501, STA301)..."
                  aria-label="Search all 411 VU courses"
                  className="celestial-input h-10 w-full pl-10 pr-4 rounded-xl text-xs sm:text-sm text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {explorerCourses.map((course) => {
                const subPack = subjectiveSets.find(
                  (s) => s.courseCode.toUpperCase() === course.code.toUpperCase()
                );
                const reviewEntry = reviewsIndex.find(
                  (r) => r.code.toUpperCase() === course.code.toUpperCase()
                );

                return (
                  <div
                    key={course.code}
                    className="bg-white rounded-xl border border-[#E5E0D5] hover:border-[#0D1B2A]/40 p-5 flex flex-col justify-between gap-4 transition-colors"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2 text-xs font-mono text-slate-500 tabular-nums">
                        <span className="font-bold text-blue-700">{course.code}</span>
                        <span className="truncate">{course.faculty}</span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-[#0D1B2A] leading-snug line-clamp-1">
                        {course.title}
                      </h3>
                      <div className="text-xs text-slate-500 font-mono tabular-nums">
                        {course.fileCount || 0} Library Files
                        {reviewEntry ? ` · ${reviewEntry.reviewCount} Student Reviews` : ''}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#F0ECE3]">
                      {subPack && (
                        <button
                          type="button"
                          onClick={() => onSelectSetId(subPack.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#0D1B2A] hover:bg-amber-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Open Subjective Deck
                        </button>
                      )}
                      {reviewEntry && onOpenPastPapers && (
                        <button
                          type="button"
                          onClick={() => onOpenPastPapers(course.code)}
                          className="px-3 py-1.5 rounded-lg bg-[#F3EFE6] hover:bg-[#EAE4D7] text-[#0D1B2A] border border-[#DDD6C8] text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Exam Questions ({reviewEntry.reviewCount})
                        </button>
                      )}
                      {onSelectCourseInLibrary && (
                        <button
                          type="button"
                          onClick={() => onSelectCourseInLibrary(course.code)}
                          className="px-3 py-1.5 rounded-lg bg-[#FAF8F4] hover:bg-[#F3EFE6] text-slate-700 border border-[#E5E0D5] text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Notes Archive
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: DEDICATED SUBJECTIVE FAST-LEARNING STUDIO (/subjective/<setId>)
  // =========================================================================
  const courseTheme = getCourseTheme(activeSet.courseCode);
  const isCopiedActive = copiedSetId === activeSet.id;
  const otherSets = subjectiveSets.filter((s) => s.id !== activeSet.id);
  const positionPct =
    filteredQuestions.length > 0
      ? Math.round(((currentIndex + 1) / filteredQuestions.length) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-[#FAF8F4]">
      {/* Compact Studio Top Ribbon */}
      <section className="relative overflow-hidden bg-[#0D1B2A] text-white border-b border-white/10">
        <CelestialOrbitalRings compact />
        <div className="absolute inset-0 bg-academic-grid opacity-30 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-7 space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400">
              <a
                href="/subjective"
                onClick={(e) => {
                  e.preventDefault();
                  onSelectSetId(null);
                }}
                className="inline-flex items-center gap-1.5 text-slate-200 hover:text-white font-semibold transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Subjective Subjects</span>
              </a>
              <span aria-hidden="true">/</span>
              <span className="font-mono text-amber-300 font-semibold">
                {activeSet.courseCode} · Fast-Prep
              </span>
            </nav>

            <div className="flex flex-wrap items-center gap-2">
              {matchingMcqSet && onOpenMcqSet && (
                <button
                  type="button"
                  onClick={() => onOpenMcqSet(matchingMcqSet.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#132238] hover:bg-[#192D48] border border-white/15 text-amber-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{activeSet.courseCode} MCQs ({matchingMcqSet.questions.length})</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => handleCopyShareLink(activeSet.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                  isCopiedActive
                    ? 'bg-emerald-600 border-emerald-500 text-white'
                    : 'bg-[#132238] hover:bg-[#192D48] border-white/15 text-white'
                }`}
              >
                {isCopiedActive ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-amber-300" />}
                <span>{isCopiedActive ? 'Copied Link' : 'Copy Link'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleNativeShare(activeSet)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>

              {onSelectCourseInLibrary && (
                <button
                  type="button"
                  onClick={() => onSelectCourseInLibrary(activeSet.courseCode)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-[#FAF8F4] text-[#0D1B2A] text-xs font-semibold transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-700" />
                  <span>{activeSet.courseCode} Notes</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 min-w-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#132238] border border-white/15 text-amber-300 font-mono font-bold text-sm flex items-center justify-center shrink-0">
              {activeSet.courseCode}
            </div>
            <div className="min-w-0 space-y-1">
              <h1
                className="text-xl sm:text-3xl font-semibold tracking-tight text-white leading-tight truncate"
                style={{ textWrap: 'balance' }}
              >
                {activeSet.courseTitle} — Subjective Studio
              </h1>
              <p className="text-xs sm:text-sm font-mono text-slate-300 tabular-nums">
                {activeStats.total} Exam Prompts · {activeStats.mastered} Mastered ({activeStats.pct}%) · {activeSet.topics.length} Core Topics
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Studio Control Bar */}
        <section className="bg-white rounded-2xl border border-[#E5E0D5] p-3 sm:p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          {/* Fast-Learning Mode Segmented Switcher */}
          <div
            className="inline-flex flex-wrap p-1 rounded-xl bg-[#F3EFE6] border border-[#DDD6C8] self-start xl:self-auto"
            role="tablist"
            aria-label="Fast learning study mode"
          >
            {(
              [
                { id: 'flashcard' as const, label: 'Flash-Recall Deck', Icon: Flame },
                { id: 'cram' as const, label: 'Rapid Cram Sheet', Icon: ListChecks },
                { id: 'drill' as const, label: 'Write & Compare', Icon: PenLine }
              ] as const
            ).map(({ id, label, Icon }) => {
              const isActive = mode === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setMode(id)}
                  className={`relative inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    isActive ? 'text-white' : 'text-slate-700 hover:text-[#0D1B2A]'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="subjective-mode-selector"
                      transition={{ type: 'spring', stiffness: 450, damping: 34 }}
                      className="absolute inset-0 bg-[#0D1B2A] rounded-lg"
                    />
                  )}
                  <Icon className={`relative z-10 w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-slate-500'}`} />
                  <span className="relative z-10">{label}</span>
                </button>
              );
            })}
          </div>

            {/* Utility Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 sm:flex-initial sm:w-48">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentIndex(0);
                  }}
                  placeholder={`Search ${activeSet.courseCode}...`}
                  className="celestial-input h-9 w-full pl-8 pr-3 text-xs rounded-xl text-slate-900"
                  aria-label="Search subjective questions"
                />
              </div>

              {/* Topic Filter */}
              <div className="relative">
                <select
                  value={topicFilter}
                  onChange={(e) => {
                    setTopicFilter(e.target.value);
                    setCurrentIndex(0);
                  }}
                  className="celestial-input h-9 appearance-none pl-3 pr-8 text-xs rounded-xl text-slate-800 font-semibold cursor-pointer max-w-[165px] truncate"
                  aria-label="Filter by topic"
                >
                  <option value="ALL">All Topics ({activeSet.questions.length})</option>
                  {activeSet.topics.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Marks Weight Filter */}
              <div className="relative">
                <select
                  value={marksFilter === 'ALL' ? 'ALL' : String(marksFilter)}
                  onChange={(e) => {
                    const v = e.target.value;
                    setMarksFilter(v === 'ALL' ? 'ALL' : (Number(v) as SubjectiveMarks));
                    setCurrentIndex(0);
                  }}
                  className="celestial-input h-9 appearance-none pl-3 pr-8 text-xs rounded-xl text-slate-800 font-semibold cursor-pointer"
                  aria-label="Filter by marks weight"
                >
                  <option value="ALL">All Marks (2/3/5)</option>
                  <option value="2">2 Marks · Short</option>
                  <option value="3">3 Marks · Concept</option>
                  <option value="5">5 Marks · Long</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Deck Status Filter (in Flashcard / Drill modes) */}
              {mode !== 'cram' && (
                <div className="relative">
                  <select
                    value={deckFilter}
                    onChange={(e) => {
                      setDeckFilter(e.target.value as DeckFilter);
                      setCurrentIndex(0);
                    }}
                    className="celestial-input h-9 appearance-none pl-3 pr-8 text-xs rounded-xl text-slate-800 font-semibold cursor-pointer"
                    aria-label="Filter by mastery status"
                  >
                    <option value="all">All ({activeStats.total})</option>
                    <option value="unmastered">To Revise ({activeStats.total - activeStats.mastered})</option>
                    <option value="mastered">Mastered ({activeStats.mastered})</option>
                    <option value="bookmarked">Saved ({activeStats.bookmarked})</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              )}

              {(activeStats.mastered > 0 || activeStats.bookmarked > 0) &&
                (confirmReset ? (
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleResetProgress}
                      className="h-9 px-3 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
                    >
                      Confirm Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmReset(false)}
                      className="h-9 px-3 rounded-xl text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmReset(true)}
                    className="h-9 inline-flex items-center gap-1.5 px-3 rounded-xl text-xs font-medium bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-700 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Reset</span>
                  </button>
                ))}
            </div>
        </section>

        {/* =============================================================== */}
        {/* MODE 1: FLASH-RECALL DECK (ACTIVE RECALL FAST-LEARNING)          */}
        {/* =============================================================== */}
        {mode === 'flashcard' && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 space-y-4">
              {!currentQuestion ? (
                <div className="bg-white rounded-2xl border border-[#E5E0D5] p-12 text-center space-y-4">
                  <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                  <div className="space-y-1">
                    <h2 className="text-lg font-bold text-[#0D1B2A]">No subjective prompts match this filter</h2>
                    <p className="text-sm text-slate-600 max-w-md mx-auto">
                      Clear search or switch filters back to All to resume your fast-recall session.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setTopicFilter('ALL');
                      setMarksFilter('ALL');
                      setDeckFilter('all');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#0D1B2A] hover:bg-amber-700 text-white text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Show All {activeSet.courseCode} Prompts
                  </button>
                </div>
              ) : (
                (() => {
                  const isMastered = activeProgress.mastered.includes(currentQuestion.id);
                  const isBookmarked = activeProgress.bookmarks.includes(currentQuestion.id);
                  const marksMeta = getMarksStyle(currentQuestion.marks);

                  return (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentQuestion.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                        className="bg-white rounded-2xl border border-[#E5E0D5] overflow-hidden shadow-[0_1px_2px_rgba(13,27,42,0.04)]"
                      >
                        {/* Top Session Hairline Progress */}
                        <div className="h-1 w-full bg-[#F3EFE6] overflow-hidden">
                          <motion.div
                            className={`h-full ${courseTheme.accentBar}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${positionPct}%` }}
                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                          />
                        </div>

                          <div className="p-6 sm:p-8 space-y-6">
                            {/* Unboxed Metadata + Actions */}
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500 tabular-nums">
                                <span className="font-bold text-slate-950">
                                  Prompt {String(currentIndex + 1).padStart(2, '0')} / {String(filteredQuestions.length).padStart(2, '0')}
                                </span>
                                <span aria-hidden="true" className="text-slate-300">·</span>
                                <span className={`font-bold ${marksMeta.colorClass}`}>
                                  {marksMeta.label}
                                </span>
                                <span aria-hidden="true" className="text-slate-300">·</span>
                                <span className="text-slate-600 font-semibold">{currentQuestion.topic}</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleToggleBookmark(currentQuestion.id)}
                                  aria-pressed={isBookmarked}
                                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                                    isBookmarked
                                      ? 'bg-amber-50 border-amber-300 text-amber-800'
                                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                                  }`}
                                >
                                  <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500 text-amber-600' : ''}`} />
                                  <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleToggleMastered(currentQuestion.id)}
                                  aria-pressed={isMastered}
                                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                                    isMastered
                                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                                  }`}
                                >
                                  <CheckCircle2 className={`w-3.5 h-3.5 ${isMastered ? 'text-emerald-600' : 'text-slate-400'}`} />
                                  <span>{isMastered ? 'Mastered' : 'Mark Mastered'}</span>
                                </button>
                              </div>
                            </div>

                            {/* Question Stem */}
                            <h2 className="text-lg sm:text-[21px] font-semibold text-slate-950 leading-[1.55]">
                              {currentQuestion.question}
                            </h2>

                            {/* Active Recall Reveal Stage */}
                            {!isRevealed ? (
                              <div className="rounded-xl border border-dashed border-[#DDD6C8] bg-[#FAF8F4] p-6 sm:p-8 text-center space-y-4">
                                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                                  Try recalling the 10-second core rule and 2–3 key marking points mentally before flipping the answer.
                                </p>
                                <button
                                  type="button"
                                  onClick={() => setIsRevealed(true)}
                                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0D1B2A] hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold cursor-pointer transition-colors"
                                >
                                  <Eye className="w-4 h-4 text-amber-300" />
                                  <span>Reveal Fast-Recall Answer</span>
                                  <span className="hidden sm:inline font-mono text-[11px] text-slate-300">(Space)</span>
                                </button>
                              </div>
                            ) : (
                              <motion.div
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.16 }}
                                className="space-y-5"
                              >
                                {/* 10-Second Memory Hook */}
                                <div className="rounded-xl bg-[#FAF8F4] border border-[#DDD6C8] p-4 sm:p-5 space-y-1.5">
                                  <div className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-[0.12em] text-amber-800">
                                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                                    <span>10-Second Memory Hook</span>
                                  </div>
                                  <p className="text-sm sm:text-[15px] font-semibold text-[#0D1B2A] leading-relaxed">
                                    {currentQuestion.quickHook}
                                  </p>
                                </div>

                                {/* Examiner Marking Key Points */}
                                <div className="space-y-2.5">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                                      Examiner Marking Key Points
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => setIsRevealed(false)}
                                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#0D1B2A] cursor-pointer"
                                    >
                                      <EyeOff className="w-3.5 h-3.5" />
                                      <span>Hide</span>
                                    </button>
                                  </div>

                                  <ul className="space-y-2">
                                    {currentQuestion.keyPoints.map((pt, idx) => (
                                      <li
                                        key={idx}
                                        className="flex items-start gap-3 p-3 rounded-xl bg-[#FAF8F4] border border-[#E5E0D5] text-xs sm:text-sm text-slate-800 leading-relaxed"
                                      >
                                        <span className="w-5 h-5 rounded-md bg-[#0D1B2A] text-amber-300 font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                                          {idx + 1}
                                        </span>
                                        <span>{pt}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Optional Code / Syntax Block */}
                                {currentQuestion.codeSnippet && (
                                  <div className="rounded-xl bg-[#0D1B2A] border border-white/10 overflow-hidden">
                                    <div className="px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
                                      <span className="inline-flex items-center gap-1.5 text-amber-300 font-semibold">
                                        <Code2 className="w-3.5 h-3.5" />
                                        <span>Exam Syntax / Code Reference</span>
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => handleCopySnippet(currentQuestion.id, currentQuestion.codeSnippet!)}
                                        className="inline-flex items-center gap-1 text-slate-300 hover:text-white cursor-pointer"
                                      >
                                        {copiedCodeId === currentQuestion.id ? (
                                          <>
                                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                                            <span className="text-emerald-400">Copied</span>
                                          </>
                                        ) : (
                                          <>
                                            <Copy className="w-3.5 h-3.5" />
                                            <span>Copy</span>
                                          </>
                                        )}
                                      </button>
                                    </div>
                                    <pre className="p-4 text-xs sm:text-[13px] font-mono text-slate-100 overflow-x-auto leading-relaxed">
                                      <code>{currentQuestion.codeSnippet}</code>
                                    </pre>
                                  </div>
                                )}

                                {/* Full Model Answer Accordion */}
                                <div className="rounded-xl border border-[#DDD6C8] bg-white overflow-hidden">
                                  <button
                                    type="button"
                                    onClick={() => setShowFullModel((v) => !v)}
                                    className="w-full px-4 py-3 flex items-center justify-between text-xs font-semibold text-[#0D1B2A] hover:bg-[#FAF8F4] transition-colors cursor-pointer"
                                  >
                                    <span className="inline-flex items-center gap-2">
                                      <FileText className="w-3.5 h-3.5 text-blue-700" />
                                      <span>{showFullModel ? 'Hide Full Model Answer' : 'Read Complete Exam Model Answer'}</span>
                                    </span>
                                    <ChevronDown
                                      className={`w-4 h-4 text-slate-400 transition-transform ${
                                        showFullModel ? 'rotate-180' : ''
                                      }`}
                                    />
                                  </button>
                                  {showFullModel && (
                                    <div className="px-4 pb-4 pt-2 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-[#F0ECE3]">
                                      {currentQuestion.modelAnswer}
                                    </div>
                                  )}
                                </div>

                                {currentQuestion.examTip && (
                                  <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#F3EFE6] border border-[#DDD6C8] text-xs text-[#0D1B2A]">
                                    <Lightbulb className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                                    <div>
                                      <strong className="font-semibold">Paper Tip:</strong> {currentQuestion.examTip}
                                    </div>
                                  </div>
                                )}
                              </motion.div>
                            )}

                            {/* Footer Navigation */}
                            <div className="pt-4 border-t border-[#F0ECE3] flex items-center justify-between gap-3">
                              <button
                                type="button"
                                disabled={currentIndex <= 0}
                                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#DDD6C8] bg-white hover:bg-[#FAF8F4] disabled:opacity-40 disabled:pointer-events-none text-xs sm:text-sm font-semibold text-slate-700 cursor-pointer min-h-[44px]"
                              >
                                <ChevronLeft className="w-4 h-4" />
                                <span>Previous</span>
                              </button>

                              <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                                <Keyboard className="w-3.5 h-3.5" />
                                <span>Space Flip · ← → Step · M Mastered · F Save</span>
                              </div>

                              <button
                                type="button"
                                disabled={currentIndex >= filteredQuestions.length - 1}
                                onClick={() =>
                                  setCurrentIndex((i) => Math.min(filteredQuestions.length - 1, i + 1))
                                }
                                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0D1B2A] hover:bg-blue-700 disabled:opacity-40 disabled:pointer-events-none text-xs sm:text-sm font-semibold text-white transition-colors cursor-pointer min-h-[44px]"
                              >
                                <span>Next Prompt</span>
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                      </motion.div>
                    </AnimatePresence>
                  );
                })()
              )}
            </div>

            {/* Right Rail: Mastery Ring & Prompt Jump Map */}
            <aside className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-2xl border border-[#E5E0D5] p-5 sm:p-6 space-y-5">
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="text-xs font-mono font-semibold text-amber-700 uppercase tracking-wider">
                      Subject Readiness
                    </div>
                    <h3 className="text-lg font-bold text-slate-950 tabular-nums">
                      {activeStats.mastered} / {activeStats.total} Mastered
                    </h3>
                    <div className="flex items-center gap-3 text-xs font-mono tabular-nums pt-0.5 text-slate-500">
                      <span>{activeStats.total - activeStats.mastered} To Revise</span>
                      <span>·</span>
                      <span>{activeStats.bookmarked} Saved</span>
                    </div>
                  </div>

                  <MasteryRing
                    percent={activeStats.pct}
                    size={72}
                    strokeWidth={6}
                    trackColor="#E2E8F0"
                    strokeColor={activeStats.pct >= 70 ? '#059669' : '#D97706'}
                    labelColor="text-slate-950"
                    sublabel="Ready"
                  />
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Question Map</span>
                    <span className="font-mono text-[11px] tabular-nums">{activeStats.pct}% ready</span>
                  </div>

                  {filteredQuestions.length > 0 && (
                    <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-5 gap-1.5 max-h-64 overflow-y-auto p-0.5">
                      {filteredQuestions.map((q, idx) => {
                        const isMastered = activeProgress.mastered.includes(q.id);
                        const isSaved = activeProgress.bookmarks.includes(q.id);
                        const isCurrent = idx === currentIndex;

                        let btnStyle = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';
                        if (isMastered) {
                          btnStyle = 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold';
                        }
                        if (isCurrent) {
                          btnStyle += ' ring-2 ring-blue-600 border-blue-600 bg-blue-50 text-blue-800';
                        }

                        return (
                          <button
                            key={q.id}
                            type="button"
                            onClick={() => setCurrentIndex(idx)}
                            title={`Q${idx + 1} (${q.marks} Marks)`}
                            className={`relative h-9 rounded-lg border text-xs font-mono tabular-nums transition-colors cursor-pointer ${btnStyle}`}
                          >
                            {idx + 1}
                            {isSaved && (
                              <span
                                className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-white"
                                aria-label="Saved"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Mastered</span>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                    <span>Saved</span>
                  </span>
                </div>
              </div>
            </aside>
          </section>
        )}

        {/* =============================================================== */}
        {/* MODE 2: RAPID CRAM SHEET (LAST-MINUTE SPEED SCAN)               */}
        {/* =============================================================== */}
        {mode === 'cram' && (
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 px-1">
              <div className="text-xs sm:text-sm text-slate-600 font-medium">
                Showing <span className="font-mono font-bold text-slate-900 tabular-nums">{filteredQuestions.length}</span> fast-revision prompts
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setHooksOnlyMode((v) => !v)}
                  aria-pressed={hooksOnlyMode}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                    hooksOnlyMode
                      ? 'bg-amber-50 border-amber-300 text-amber-900'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>{hooksOnlyMode ? '10-Sec Hooks Only: ON' : '10-Sec Hooks Only'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCramBlindMode((v) => !v);
                    setCramRevealedIds(new Set());
                  }}
                  aria-pressed={cramBlindMode}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  {cramBlindMode ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{cramBlindMode ? 'Reveal All Answers' : 'Hide Answers (Self-Test)'}</span>
                </button>
              </div>
            </div>

            {filteredQuestions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E5E0D5] shadow-xs p-10 text-center text-sm text-slate-500">
                No questions match your current topic, marks, or search filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredQuestions.map((q) => {
                  const isItemVisible = !cramBlindMode || cramRevealedIds.has(q.id);
                  const isMastered = activeProgress.mastered.includes(q.id);
                  const marksMeta = getMarksStyle(q.marks);

                  return (
                    <div
                      key={q.id}
                      className="bg-white rounded-2xl border border-[#E5E0D5] p-5 sm:p-6 flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2 text-xs font-mono">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#0D1B2A]">Q{q.num}</span>
                            <span aria-hidden="true" className="text-slate-300">·</span>
                            <span className={`font-bold ${marksMeta.colorClass}`}>{marksMeta.label}</span>
                          </div>
                          <span className="truncate text-slate-500">{q.topic}</span>
                        </div>

                        <h3 className="text-sm sm:text-base font-bold text-[#0D1B2A] leading-snug">
                          {q.question}
                        </h3>

                        {isItemVisible ? (
                          <div className="space-y-3 pt-1">
                            <div className="p-3 rounded-xl bg-[#FAF8F4] border border-[#DDD6C8] text-xs sm:text-[13px] font-semibold text-[#0D1B2A] leading-relaxed">
                              <span className="font-mono text-[10px] uppercase tracking-wider text-amber-800 block mb-0.5">
                                10-Sec Hook
                              </span>
                              {q.quickHook}
                            </div>

                            {!hooksOnlyMode && (
                              <ul className="space-y-1.5 text-xs text-slate-700 leading-relaxed">
                                {q.keyPoints.map((kp, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <span className="font-mono font-bold text-blue-700 shrink-0">{i + 1}.</span>
                                    <span>{kp}</span>
                                  </li>
                                ))}
                              </ul>
                            )}

                            {!hooksOnlyMode && q.codeSnippet && (
                              <pre className="p-3 rounded-xl bg-[#0D1B2A] text-slate-100 text-[11px] font-mono overflow-x-auto leading-relaxed">
                                <code>{q.codeSnippet}</code>
                              </pre>
                            )}
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => toggleCramReveal(q.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F3EFE6] hover:bg-[#EAE4D7] text-xs font-semibold text-[#0D1B2A] cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Show Hook &amp; Key Points</span>
                          </button>
                        )}
                      </div>

                      <div className="pt-3 border-t border-[#F0ECE3] flex items-center justify-between gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => handleToggleMastered(q.id)}
                          className={`inline-flex items-center gap-1.5 font-semibold cursor-pointer ${
                            isMastered ? 'text-emerald-700' : 'text-slate-500 hover:text-[#0D1B2A]'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isMastered ? 'Mastered' : 'Mark Mastered'}</span>
                        </button>

                        {cramBlindMode && isItemVisible && (
                          <button
                            type="button"
                            onClick={() => toggleCramReveal(q.id)}
                            className="text-slate-500 hover:text-[#0D1B2A] font-medium cursor-pointer"
                          >
                            Hide
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* =============================================================== */}
        {/* MODE 3: WRITE & COMPARE ACTIVE OUTPUT DRILL (TWO-ZONE SANDBOX)  */}
        {/* =============================================================== */}
        {mode === 'drill' && (
          <section className="space-y-4">
            {!currentQuestion ? (
              <div className="bg-white rounded-2xl border border-[#E5E0D5] p-10 text-center text-sm text-slate-500">
                No questions match this filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Zone: Student Recall Pad */}
                <div className="lg:col-span-6 bg-white rounded-2xl border border-[#E5E0D5] p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-500 tabular-nums">
                    <span className="font-bold text-[#0D1B2A]">
                      Drill {currentIndex + 1} / {filteredQuestions.length}
                    </span>
                    <span className={`font-bold ${getMarksStyle(currentQuestion.marks).colorClass}`}>
                      {getMarksStyle(currentQuestion.marks).label}
                    </span>
                  </div>

                  <h2 className="text-base sm:text-lg font-bold text-[#0D1B2A] leading-snug">
                    {currentQuestion.question}
                  </h2>

                  <div className="space-y-2">
                    <label
                      htmlFor="subjective-drill-pad"
                      className="text-xs font-semibold text-slate-600 block"
                    >
                      Draft your bullet points or answer from memory:
                    </label>
                    <textarea
                      id="subjective-drill-pad"
                      rows={7}
                      value={drillDrafts[currentQuestion.id] || ''}
                      onChange={(e) =>
                        setDrillDrafts((prev) => ({
                          ...prev,
                          [currentQuestion.id]: e.target.value
                        }))
                      }
                      placeholder="Write 2–4 concise points, syntax, or key dates here before comparing with the examiner rubric..."
                      className="w-full p-4 rounded-xl celestial-input text-sm text-slate-900 leading-relaxed resize-y"
                    />
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 tabular-nums">
                      <span>
                        {(drillDrafts[currentQuestion.id] || '').trim()
                          ? `${(drillDrafts[currentQuestion.id] || '').trim().split(/\s+/).length} words drafted`
                          : 'Draft stays local in this session'}
                      </span>
                      <span>Target: {currentQuestion.keyPoints.length} key points</span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={currentIndex <= 0}
                        onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                        className="px-3.5 py-2 rounded-xl border border-[#DDD6C8] bg-white hover:bg-[#FAF8F4] disabled:opacity-40 text-xs font-semibold text-slate-700 cursor-pointer"
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        disabled={currentIndex >= filteredQuestions.length - 1}
                        onClick={() =>
                          setCurrentIndex((i) => Math.min(filteredQuestions.length - 1, i + 1))
                        }
                        className="px-3.5 py-2 rounded-xl border border-[#DDD6C8] bg-white hover:bg-[#FAF8F4] disabled:opacity-40 text-xs font-semibold text-slate-700 cursor-pointer"
                      >
                        Next
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setDrillRevealed((v) => !v)}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0D1B2A] hover:bg-amber-700 text-white text-xs font-semibold cursor-pointer transition-colors"
                    >
                      {drillRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{drillRevealed ? 'Hide Rubric' : 'Compare with Rubric'}</span>
                    </button>
                  </div>
                </div>

                {/* Right Zone: Examiner Marking Rubric Comparison */}
                <div className="lg:col-span-6 bg-white rounded-2xl border border-[#E5E0D5] p-6 space-y-5">
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#F0ECE3]">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700">
                      Examiner Marking Rubric
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleMastered(currentQuestion.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border cursor-pointer ${
                        activeProgress.mastered.includes(currentQuestion.id)
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : 'bg-[#FAF8F4] border-[#DDD6C8] text-slate-700'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>
                        {activeProgress.mastered.includes(currentQuestion.id) ? 'Mastered' : 'Mark Mastered'}
                      </span>
                    </button>
                  </div>

                  {!drillRevealed ? (
                    <div className="py-12 text-center space-y-3">
                      <Layers className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                        Complete your draft on the left, then click &ldquo;Compare with Rubric&rdquo; to grade your recall point by point.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-[#FAF8F4] border border-[#DDD6C8] text-xs sm:text-sm font-semibold text-[#0D1B2A]">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-amber-800 block mb-1">
                          10-Second Hook
                        </span>
                        {currentQuestion.quickHook}
                      </div>

                      <ul className="space-y-2">
                        {currentQuestion.keyPoints.map((kp, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FAF8F4] border border-[#E5E0D5] text-xs sm:text-sm text-slate-800"
                          >
                            <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                            <span>{kp}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="p-4 rounded-xl bg-[#F3EFE6] border border-[#DDD6C8] text-xs sm:text-sm text-slate-800 leading-relaxed">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-slate-600 block mb-1">
                          Model Answer Reference
                        </span>
                        {currentQuestion.modelAnswer}
                      </div>

                      {currentQuestion.codeSnippet && (
                        <pre className="p-4 rounded-xl bg-[#0D1B2A] text-slate-100 text-xs font-mono overflow-x-auto leading-relaxed">
                          <code>{currentQuestion.codeSnippet}</code>
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        )}

        <CelestialDivider className="pt-4" />

        {/* Cross-links to other Subjective Fast-Learning Studios */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-semibold text-[#0D1B2A]">Other Subjective Fast-Prep Studios</h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Switch between subjects or copy a shareable direct link.
              </p>
            </div>
            <a
              href="/subjective"
              onClick={(e) => {
                e.preventDefault();
                onSelectSetId(null);
              }}
              className="text-xs font-semibold text-blue-700 hover:text-[#0D1B2A]"
            >
              View All Subjects →
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {otherSets.map((set) => {
              const isCopied = copiedSetId === set.id;
              return (
                <div
                  key={set.id}
                  className="group bg-white rounded-xl border border-[#E5E0D5] hover:border-amber-700/50 p-4 flex items-center justify-between gap-3 transition-all"
                >
                  <a
                    href={`/subjective/${set.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectSetId(set.id);
                    }}
                    className="flex items-center gap-3 min-w-0"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#F3EFE6] border border-[#DDD6C8] group-hover:bg-amber-700 group-hover:border-amber-700 text-[#0D1B2A] group-hover:text-white font-mono font-bold text-[11px] flex items-center justify-center shrink-0 transition-colors">
                      {set.courseCode}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-mono font-semibold text-slate-500 tabular-nums">
                        {set.questions.length} Qs · {set.topics.length} Topics
                      </div>
                      <div className="text-sm font-bold text-[#0D1B2A] group-hover:text-blue-700 truncate">
                        {set.courseTitle}
                      </div>
                    </div>
                  </a>

                  <button
                    type="button"
                    onClick={(e) => handleCopyShareLink(set.id, e)}
                    aria-label={`Copy link for ${set.courseCode} subjective studio`}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold shrink-0 cursor-pointer transition-colors ${
                      isCopied
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'bg-[#FAF8F4] hover:bg-[#F3EFE6] border-[#DDD6C8] text-slate-600'
                    }`}
                  >
                    {isCopied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};
