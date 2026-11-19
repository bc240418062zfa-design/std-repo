import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Search,
  Eye,
  EyeOff,
  Award,
  ListChecks,
  Timer,
  Flag,
  FileText,
  Check,
  Keyboard,
  Share2,
  Copy,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Zap
} from 'lucide-react';
import { mcqSets } from '../data/mcqs';
import { ExamTerm, McqQuestion, McqSet } from '../types';
import { CelestialStarfield, CelestialOrbitalRings, CelestialDivider } from '../components/CelestialBackdrop';

interface MCQsPageProps {
  activeSetId: string | null;
  onSelectSetId: (setId: string | null) => void;
  onSelectCourseInLibrary?: (courseCode: string) => void;
}

type StudyMode = 'practice' | 'exam' | 'revision';
type PracticeFilter = 'all' | 'unanswered' | 'incorrect' | 'bookmarked';

interface SetProgress {
  answers: Record<string, number>;
  bookmarks: string[];
}

type StoredProgress = Record<string, SetProgress>;

const STORAGE_KEY = 'mihora_mcq_progress_v1';
const OPTION_LETTERS = ['A', 'B', 'C', 'D'] as const;

interface CourseTheme {
  badgeBg: string;
  badgeText: string;
  accentBar: string;
  subtleRing: string;
}

const COURSE_THEMES: Record<string, CourseTheme> = {
  CS201: {
    badgeBg: 'bg-blue-600',
    badgeText: 'text-white',
    accentBar: 'from-blue-600 to-sky-500',
    subtleRing: 'hover:border-blue-400'
  },
  CS301: {
    badgeBg: 'bg-indigo-600',
    badgeText: 'text-white',
    accentBar: 'from-indigo-600 to-blue-500',
    subtleRing: 'hover:border-indigo-400'
  },
  CS304: {
    badgeBg: 'bg-violet-600',
    badgeText: 'text-white',
    accentBar: 'from-violet-600 to-indigo-500',
    subtleRing: 'hover:border-violet-400'
  },
  CS403: {
    badgeBg: 'bg-teal-600',
    badgeText: 'text-white',
    accentBar: 'from-teal-600 to-emerald-500',
    subtleRing: 'hover:border-teal-400'
  },
  CS504: {
    badgeBg: 'bg-sky-600',
    badgeText: 'text-white',
    accentBar: 'from-sky-600 to-cyan-500',
    subtleRing: 'hover:border-sky-400'
  },
  CS601: {
    badgeBg: 'bg-amber-600',
    badgeText: 'text-white',
    accentBar: 'from-amber-600 to-orange-500',
    subtleRing: 'hover:border-amber-400'
  },
  ENG101: {
    badgeBg: 'bg-emerald-600',
    badgeText: 'text-white',
    accentBar: 'from-emerald-600 to-teal-500',
    subtleRing: 'hover:border-emerald-400'
  },
  ENG201: {
    badgeBg: 'bg-cyan-600',
    badgeText: 'text-white',
    accentBar: 'from-cyan-600 to-blue-500',
    subtleRing: 'hover:border-cyan-400'
  },
  MGT301: {
    badgeBg: 'bg-rose-600',
    badgeText: 'text-white',
    accentBar: 'from-rose-600 to-pink-500',
    subtleRing: 'hover:border-rose-400'
  },
  MGT501: {
    badgeBg: 'bg-fuchsia-600',
    badgeText: 'text-white',
    accentBar: 'from-fuchsia-600 to-purple-500',
    subtleRing: 'hover:border-fuchsia-400'
  },
  PAK301: {
    badgeBg: 'bg-green-700',
    badgeText: 'text-white',
    accentBar: 'from-green-700 to-emerald-600',
    subtleRing: 'hover:border-green-500'
  }
};

function getCourseTheme(code: string): CourseTheme {
  return (
    COURSE_THEMES[code.toUpperCase()] || {
      badgeBg: 'bg-slate-900',
      badgeText: 'text-white',
      accentBar: 'from-blue-600 to-indigo-500',
      subtleRing: 'hover:border-blue-400'
    }
  );
}

function loadProgress(): StoredProgress {
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

function saveProgress(data: StoredProgress) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage quota errors
  }
}

function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function formatTimer(seconds: number): string {
  const safe = Math.max(0, seconds);
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function getShareUrl(setId: string): string {
  if (typeof window === 'undefined') return `https://study.mihora.tech/mcqs/${setId}`;
  return `${window.location.origin}/mcqs/${setId}`;
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
      <svg width={size} height={size} className="-rotate-90">
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
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className={`font-mono font-bold text-sm tabular-nums ${labelColor}`}>{clamped}%</span>
        {sublabel && <span className="text-[9px] uppercase tracking-wider text-slate-400 mt-0.5">{sublabel}</span>}
      </div>
    </div>
  );
};

export const MCQsPage: React.FC<MCQsPageProps> = ({
  activeSetId,
  onSelectSetId,
  onSelectCourseInLibrary
}) => {
  const [termFilter, setTermFilter] = useState<'all' | ExamTerm>('midterm');
  const [copiedSetId, setCopiedSetId] = useState<string | null>(null);
  const [mode, setMode] = useState<StudyMode>('practice');
  const [progress, setProgress] = useState<StoredProgress>(loadProgress);
  const [confirmReset, setConfirmReset] = useState(false);

  const [topicFilter, setTopicFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [practiceFilter, setPracticeFilter] = useState<PracticeFilter>('all');
  const [shuffledOrder, setShuffledOrder] = useState<boolean>(false);
  const [shuffleSeed, setShuffleSeed] = useState<number>(0);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(false);

  const [showAllAnswers, setShowAllAnswers] = useState<boolean>(true);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  const [examStatus, setExamStatus] = useState<'setup' | 'running' | 'submitted'>('setup');
  const [examSize, setExamSize] = useState<number>(25);
  const [examQuestions, setExamQuestions] = useState<McqQuestion[]>([]);
  const [examAnswers, setExamAnswers] = useState<Record<string, number>>({});
  const [examFlagged, setExamFlagged] = useState<Set<string>>(new Set());
  const [examIndex, setExamIndex] = useState<number>(0);
  const [examSecondsLeft, setExamSecondsLeft] = useState<number>(0);
  const [examTotalSeconds, setExamTotalSeconds] = useState<number>(0);
  const [confirmSubmitExam, setConfirmSubmitExam] = useState<boolean>(false);
  const [examReviewFilter, setExamReviewFilter] = useState<'all' | 'incorrect' | 'correct'>('all');

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const activeSet: McqSet | null = useMemo(() => {
    if (!activeSetId) return null;
    return mcqSets.find((s) => s.id === activeSetId) || null;
  }, [activeSetId]);

  const siblingTermSets = useMemo(() => {
    if (!activeSet) return [];
    return mcqSets.filter((s) => s.courseCode === activeSet.courseCode && s.id !== activeSet.id);
  }, [activeSet]);

  const activeSetProgress: SetProgress = useMemo(() => {
    if (!activeSet) return { answers: {}, bookmarks: [] };
    return progress[activeSet.id] || { answers: {}, bookmarks: [] };
  }, [progress, activeSet]);

  useEffect(() => {
    setTopicFilter('ALL');
    setSearchQuery('');
    setPracticeFilter('all');
    setCurrentIndex(0);
    setConfirmReset(false);
    setRevealedIds(new Set());
    setShuffledOrder(false);
    setExamStatus('setup');
    setConfirmSubmitExam(false);
  }, [activeSet?.id]);

  const visibleHubSets = useMemo(() => {
    if (termFilter === 'all') return mcqSets;
    return mcqSets.filter((s) => s.term === termFilter);
  }, [termFilter]);

  const bankSummary = useMemo(() => {
    let midtermCount = 0;
    let finalCount = 0;
    let solvedTotal = 0;
    let correctTotal = 0;
    for (const s of mcqSets) {
      if (s.term === 'midterm') midtermCount += s.questions.length;
      else finalCount += s.questions.length;

      const p = progress[s.id];
      if (p) {
        for (const q of s.questions) {
          const ans = p.answers[q.id];
          if (ans !== undefined) {
            solvedTotal++;
            if (ans === q.correctIndex) correctTotal++;
          }
        }
      }
    }
    const totalCount = midtermCount + finalCount;
    const totalSubjects = new Set(mcqSets.map((s) => s.courseCode)).size;
    const overallAcc = solvedTotal > 0 ? Math.round((correctTotal / solvedTotal) * 100) : 0;
    return {
      midtermCount,
      finalCount,
      totalCount,
      totalSubjects,
      solvedTotal,
      correctTotal,
      overallAcc
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
      setTimeout(() => {
        setCopiedSetId((cur) => (cur === setId ? null : cur));
      }, 2200);
    } catch {
      // Clipboard blocked in restricted context
    }
  };

  const handleNativeShare = async (set: McqSet) => {
    const url = getShareUrl(set.id);
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: `${set.courseCode} ${set.termLabel} MCQs – MIHORA VU`,
          text: `Practice ${set.questions.length} verified ${set.courseCode} (${set.courseTitle}) ${set.termLabel} MCQs & Mock Quiz on MIHORA VU:`,
          url
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    handleCopyShareLink(set.id);
  };

  const filteredQuestions = useMemo(() => {
    if (!activeSet) return [];
    const q = searchQuery.trim().toLowerCase();
    const list = activeSet.questions.filter((item) => {
      if (topicFilter !== 'ALL' && item.topic !== topicFilter) return false;
      if (q) {
        const matchesText =
          item.question.toLowerCase().includes(q) ||
          item.options.some((opt) => opt.toLowerCase().includes(q)) ||
          (item.topic && item.topic.toLowerCase().includes(q));
        if (!matchesText) return false;
      }
      if (mode === 'practice') {
        const chosen = activeSetProgress.answers[item.id];
        if (practiceFilter === 'unanswered' && chosen !== undefined) return false;
        if (
          practiceFilter === 'incorrect' &&
          (chosen === undefined || chosen === item.correctIndex)
        ) {
          return false;
        }
        if (
          practiceFilter === 'bookmarked' &&
          !activeSetProgress.bookmarks.includes(item.id)
        ) {
          return false;
        }
      }
      return true;
    });

    if (shuffledOrder) {
      return shuffleArray(list);
    }
    return list;
  }, [
    activeSet,
    topicFilter,
    searchQuery,
    mode,
    practiceFilter,
    activeSetProgress.answers,
    activeSetProgress.bookmarks,
    shuffledOrder,
    shuffleSeed
  ]);

  useEffect(() => {
    if (filteredQuestions.length === 0) {
      setCurrentIndex(0);
    } else if (currentIndex >= filteredQuestions.length) {
      setCurrentIndex(filteredQuestions.length - 1);
    }
  }, [filteredQuestions.length, currentIndex]);

  const currentQuestion: McqQuestion | undefined = filteredQuestions[currentIndex];

  const activeStats = useMemo(() => {
    if (!activeSet) {
      return { total: 0, answered: 0, correct: 0, accuracy: 0, completion: 0, bookmarked: 0 };
    }
    const total = activeSet.questions.length;
    let answered = 0;
    let correct = 0;
    for (const q of activeSet.questions) {
      const a = activeSetProgress.answers[q.id];
      if (a !== undefined) {
        answered++;
        if (a === q.correctIndex) correct++;
      }
    }
    const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;
    const completion = total > 0 ? Math.round((answered / total) * 100) : 0;
    return {
      total,
      answered,
      correct,
      accuracy,
      completion,
      bookmarked: activeSetProgress.bookmarks.length
    };
  }, [activeSet, activeSetProgress]);

  const handleSelectAnswer = useCallback(
    (questionId: string, optionIndex: number) => {
      if (!activeSet) return;
      setProgress((prev) => {
        const current = prev[activeSet.id] || { answers: {}, bookmarks: [] };
        return {
          ...prev,
          [activeSet.id]: {
            ...current,
            answers: {
              ...current.answers,
              [questionId]: optionIndex
            }
          }
        };
      });

      if (autoAdvance) {
        setTimeout(() => {
          setCurrentIndex((idx) => (idx < filteredQuestions.length - 1 ? idx + 1 : idx));
        }, 420);
      }
    },
    [activeSet, autoAdvance, filteredQuestions.length]
  );

  const handleToggleBookmark = useCallback(
    (questionId: string) => {
      if (!activeSet) return;
      setProgress((prev) => {
        const current = prev[activeSet.id] || { answers: {}, bookmarks: [] };
        const exists = current.bookmarks.includes(questionId);
        return {
          ...prev,
          [activeSet.id]: {
            ...current,
            bookmarks: exists
              ? current.bookmarks.filter((id) => id !== questionId)
              : [...current.bookmarks, questionId]
          }
        };
      });
    },
    [activeSet]
  );

  const handleResetSetProgress = () => {
    if (!activeSet) return;
    setProgress((prev) => {
      const next = { ...prev };
      delete next[activeSet.id];
      return next;
    });
    setConfirmReset(false);
    setPracticeFilter('all');
    setCurrentIndex(0);
  };

  useEffect(() => {
    if (!activeSet || mode !== 'practice' || !currentQuestion) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT')
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      if (key === '1' || key === 'a') {
        e.preventDefault();
        handleSelectAnswer(currentQuestion.id, 0);
      } else if (key === '2' || key === 'b') {
        e.preventDefault();
        handleSelectAnswer(currentQuestion.id, 1);
      } else if (key === '3' || key === 'c') {
        e.preventDefault();
        handleSelectAnswer(currentQuestion.id, 2);
      } else if (key === '4' || key === 'd') {
        e.preventDefault();
        handleSelectAnswer(currentQuestion.id, 3);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentIndex((i) => Math.min(filteredQuestions.length - 1, i + 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentIndex((i) => Math.max(0, i - 1));
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
    handleSelectAnswer,
    handleToggleBookmark
  ]);

  useEffect(() => {
    if (!activeSet || mode !== 'exam' || examStatus !== 'running') return;
    if (examSecondsLeft <= 0) {
      setExamStatus('submitted');
      setConfirmSubmitExam(false);
      return;
    }

    const timer = window.setInterval(() => {
      setExamSecondsLeft((s) => {
        if (s <= 1) {
          setExamStatus('submitted');
          setConfirmSubmitExam(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [activeSet, mode, examStatus, examSecondsLeft]);

  const handleStartExam = () => {
    if (!activeSet) return;
    const pool =
      topicFilter === 'ALL'
        ? activeSet.questions
        : activeSet.questions.filter((q) => q.topic === topicFilter);
    const chosenCount = Math.min(examSize, pool.length);
    const picked = shuffleArray(pool).slice(0, chosenCount);
    const totalSecs = chosenCount * 45;

    setExamQuestions(picked);
    setExamAnswers({});
    setExamFlagged(new Set());
    setExamIndex(0);
    setExamSecondsLeft(totalSecs);
    setExamTotalSeconds(totalSecs);
    setConfirmSubmitExam(false);
    setExamReviewFilter('all');
    setExamStatus('running');
  };

  const handleToggleExamFlag = (questionId: string) => {
    setExamFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  };

  const examScoreSummary = useMemo(() => {
    let correct = 0;
    let attempted = 0;
    for (const q of examQuestions) {
      const a = examAnswers[q.id];
      if (a !== undefined) {
        attempted++;
        if (a === q.correctIndex) correct++;
      }
    }
    const total = examQuestions.length;
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    const usedSecs = Math.max(0, examTotalSeconds - examSecondsLeft);
    return {
      correct,
      attempted,
      wrong: attempted - correct,
      unanswered: total - attempted,
      total,
      pct,
      usedSecs
    };
  }, [examQuestions, examAnswers, examTotalSeconds, examSecondsLeft]);

  const toggleRevisionReveal = (id: string) => {
    setRevealedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const examActiveQuestion = examQuestions[examIndex];

  // =========================================================================
  // VIEW 1: MCQs BENTO STUDIO DIRECTORY (/mcqs)
  // =========================================================================
  if (!activeSet) {
    const termTabs = [
      { id: 'midterm' as const, label: `Mid-Term (${bankSummary.midtermCount})` },
      { id: 'finalterm' as const, label: `Final-Term (${bankSummary.finalCount})` },
      { id: 'all' as const, label: `All (${bankSummary.totalCount})` }
    ];

    return (
      <div className="min-h-screen bg-celestial-canvas bg-star-dust">
        {/* Atmospheric Split Studio Hero */}
        <section className="relative overflow-hidden bg-studio-stage text-white border-b border-slate-800/90">
          <CelestialStarfield density={0.75} />
          <CelestialOrbitalRings compact />
          <div className="absolute inset-0 bg-academic-grid opacity-35 pointer-events-none" />
          <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-400/65 to-transparent" aria-hidden="true" />
          <div className="pointer-events-none absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-400/50 to-transparent" aria-hidden="true" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-7 space-y-4"
              >
                <p className="text-xs sm:text-sm font-mono text-sky-300 tracking-wide tabular-nums">
                  Interactive Assessment Studio · {bankSummary.totalSubjects} Subjects · {bankSummary.totalCount} Verified MCQs
                </p>

                <h1
                  className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.08]"
                  style={{ textWrap: 'balance' }}
                >
                  Practice Subject MCQs,{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-amber-300">
                    Timed Mock Exams
                  </span>{' '}
                  &amp; Flash Sheets
                </h1>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                  Open any dedicated subject quiz page for instant verification, timed exam simulation, or share its direct URL straight with classmates.
                </p>

                {/* Term Filter Switcher */}
                <div className="pt-2">
                  <div
                    className="inline-flex p-1 rounded-xl glass-panel-dark"
                    role="tablist"
                    aria-label="Filter MCQ subjects by term"
                  >
                    {termTabs.map((tab) => {
                      const active = termFilter === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          role="tab"
                          aria-selected={active}
                          onClick={() => setTermFilter(tab.id)}
                          className={`relative px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                            active ? 'text-white' : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          {active && (
                            <motion.span
                              layoutId="mcq-term-filter"
                              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                              className={`absolute inset-0 rounded-lg ${
                                tab.id === 'all' ? 'bg-slate-700' : 'bg-blue-600'
                              }`}
                            />
                          )}
                          <span className="relative z-10">{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>

              {/* Right Bento: Live Practice Telemetry Console */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.42, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-5 glass-panel-dark rounded-2xl p-6 space-y-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-xs font-mono uppercase tracking-wider text-sky-300 font-semibold">
                      Your Readiness Overview
                    </div>
                    <div className="text-2xl font-bold text-white font-mono tabular-nums">
                      {bankSummary.solvedTotal} / {bankSummary.totalCount}
                    </div>
                    <p className="text-xs text-slate-300">
                      Questions mastered across all subjects
                    </p>
                  </div>

                  <MasteryRing
                    percent={bankSummary.overallAcc}
                    size={84}
                    strokeWidth={7}
                    strokeColor="#38BDF8"
                    sublabel="Accuracy"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-white/10 text-center">
                  <div className="p-2.5 rounded-xl bg-white/5">
                    <div className="font-mono text-base font-bold text-white tabular-nums">
                      {mcqSets.length}
                    </div>
                    <div className="text-[11px] text-slate-400">Subject Pages</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5">
                    <div className="font-mono text-base font-bold text-emerald-300 tabular-nums">
                      {bankSummary.correctTotal}
                    </div>
                    <div className="text-[11px] text-slate-400">Verified Right</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5">
                    <div className="font-mono text-base font-bold text-amber-300 tabular-nums">
                      3 Modes
                    </div>
                    <div className="text-[11px] text-slate-400">Study &amp; Exam</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Subject Cards Bento Grid */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-950">
                {termFilter === 'midterm'
                  ? 'Mid-Term Subject Studios'
                  : termFilter === 'finalterm'
                  ? 'Final-Term Subject Studios'
                  : 'All Interactive MCQ Subjects'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Pick a subject below to start practicing, or copy its direct URL to share with study groups.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleHubSets.map((set, idx) => {
              const p = progress[set.id] || { answers: {}, bookmarks: [] };
              const answeredCount = Object.keys(p.answers).length;
              let correctCount = 0;
              for (const q of set.questions) {
                if (p.answers[q.id] === q.correctIndex) correctCount++;
              }
              const pct = Math.round((answeredCount / set.questions.length) * 100);
              const acc = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
              const isCopied = copiedSetId === set.id;
              const theme = getCourseTheme(set.courseCode);

              return (
                <motion.div
                  key={set.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 'some' }}
                  transition={{
                    duration: 0.32,
                    delay: Math.min(idx * 0.04, 0.2),
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  whileHover={{ y: -4 }}
                  className={`group card-celestial celestial-top-glint rounded-2xl border ${theme.subtleRing} overflow-hidden flex flex-col justify-between`}
                >
                  {/* Top Signature Color Accent Hairline */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${theme.accentBar}`} />

                  <div className="p-6 flex-1 flex flex-col justify-between gap-6">
                    <div className="space-y-4">
                      {/* Monogram Badge + Unboxed Term Info */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-12 h-12 rounded-xl ${theme.badgeBg} ${theme.badgeText} font-mono font-bold text-xs flex items-center justify-center shrink-0 shadow-xs`}
                          >
                            {set.courseCode}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-mono text-slate-500 tabular-nums">
                              {set.termLabel} · {set.questions.length} MCQs
                            </div>
                            <a
                              href={`/mcqs/${set.id}`}
                              onClick={(e) => {
                                e.preventDefault();
                                onSelectSetId(set.id);
                              }}
                              className="block"
                            >
                              <h3 className="text-lg font-bold text-slate-950 group-hover:text-blue-700 transition-colors leading-snug truncate">
                                {set.courseTitle}
                              </h3>
                            </a>
                          </div>
                        </div>

                        <motion.button
                          whileTap={{ scale: 0.92 }}
                          type="button"
                          onClick={(e) => handleCopyShareLink(set.id, e)}
                          title="Copy shareable subject link"
                          aria-label={`Copy shareable link for ${set.courseCode}`}
                          className={`p-2.5 rounded-xl border transition-colors cursor-pointer shrink-0 ${
                            isCopied
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {isCopied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                        </motion.button>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
                        {set.description}
                      </p>

                      {set.topics.length > 0 && (
                        <div className="text-xs text-slate-500 truncate">
                          Topics: <span className="font-medium text-slate-700">{set.topics.slice(0, 3).join(' · ')}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      {/* Clean Progress Track */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-mono text-slate-500 tabular-nums">
                          <span>
                            <strong className="text-slate-900">{answeredCount}</strong>/{set.questions.length} solved
                          </span>
                          <span>
                            {answeredCount > 0 ? `${acc}% accuracy` : 'Ready to start'}
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full bg-gradient-to-r ${theme.accentBar}`}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${pct}%` }}
                            viewport={{ once: true, amount: 'some' }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                          />
                        </div>
                      </div>

                      {/* Primary Card Launch Action */}
                      <motion.a
                        whileTap={{ scale: 0.98 }}
                        href={`/mcqs/${set.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          onSelectSetId(set.id);
                        }}
                        className="btn-shimmer w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 hover:from-blue-600 hover:to-indigo-600 text-white text-xs sm:text-sm font-semibold transition-all flex items-center justify-between shadow-xs"
                      >
                        <span>{answeredCount > 0 ? 'Continue Practice' : 'Start Interactive Quiz'}</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </main>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: DEDICATED SUBJECT QUIZ STUDIO (/mcqs/<setId>)
  // =========================================================================
  const isCopiedActive = copiedSetId === activeSet.id;
  const otherSets = mcqSets.filter((s) => s.id !== activeSet.id);
  const courseTheme = getCourseTheme(activeSet.courseCode);
  const positionPct =
    filteredQuestions.length > 0
      ? Math.round(((currentIndex + 1) / filteredQuestions.length) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-celestial-canvas bg-star-dust">
      {/* Compact Focused Studio Top Ribbon */}
      <section className="relative overflow-hidden bg-studio-stage text-white border-b border-slate-800/90">
        <CelestialStarfield density={0.5} />
        <CelestialOrbitalRings compact />
        <div className="absolute inset-0 bg-academic-grid opacity-35 pointer-events-none" />
        <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-400/65 to-transparent" aria-hidden="true" />
        <div className="pointer-events-none absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-400/50 to-transparent" aria-hidden="true" />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-7 space-y-4"
        >
          {/* Breadcrumb & Share Controls Row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400">
              <a
                href="/mcqs"
                onClick={(e) => {
                  e.preventDefault();
                  onSelectSetId(null);
                }}
                className="inline-flex items-center gap-1.5 text-slate-200 hover:text-white font-semibold transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Subjects</span>
              </a>
              <span aria-hidden="true">/</span>
              <span className="font-mono text-sky-300 font-semibold">
                {activeSet.courseCode} · {activeSet.termLabel}
              </span>
            </nav>

            <div className="flex flex-wrap items-center gap-2">
              {siblingTermSets.map((sib) => (
                <a
                  key={sib.id}
                  href={`/mcqs/${sib.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectSetId(sib.id);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-panel-dark hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-medium transition-colors"
                >
                  <span>Switch to {sib.termLabel} ({sib.questions.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              ))}

              <motion.button
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() => handleCopyShareLink(activeSet.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                  isCopiedActive
                    ? 'bg-emerald-600 border-emerald-500 text-white'
                    : 'glass-panel-dark hover:bg-slate-800 text-white'
                }`}
              >
                {isCopiedActive ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-sky-300" />}
                <span>{isCopiedActive ? 'Copied Link' : 'Copy Link'}</span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() => handleNativeShare(activeSet)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </motion.button>

              {onSelectCourseInLibrary && (
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={() => onSelectCourseInLibrary(activeSet.courseCode)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-900 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-700" />
                  <span>{activeSet.courseCode} Notes</span>
                </motion.button>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${courseTheme.badgeBg} ${courseTheme.badgeText} font-mono font-extrabold text-sm flex items-center justify-center shrink-0 shadow-lg`}
              >
                {activeSet.courseCode}
              </div>
              <div className="min-w-0 space-y-1">
                <h1
                  className="text-xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight truncate"
                  style={{ textWrap: 'balance' }}
                >
                  {activeSet.courseTitle}
                </h1>
                <p className="text-xs sm:text-sm font-mono text-slate-300 tabular-nums">
                  {activeSet.termLabel} Bank · {activeStats.total} Verified Questions · {activeStats.answered} Solved ({activeStats.accuracy}% accuracy)
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Streamlined Single-Row Studio Control Bar */}
        <section className="celestial-bezel rounded-2xl shadow-sm">
          <div className="surface-frosted rounded-[15px] p-3 sm:p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          {/* Study Mode Segmented Switcher */}
          <div
            className="inline-flex flex-wrap p-1 rounded-xl bg-slate-100/90 border border-slate-200/80 self-start xl:self-auto"
            role="tablist"
            aria-label="Study mode"
          >
            {(
              [
                { id: 'practice' as const, label: 'Practice Studio', Icon: BookOpen },
                { id: 'exam' as const, label: 'Mock Exam', Icon: Timer },
                { id: 'revision' as const, label: 'Quick Revision', Icon: ListChecks }
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
                    isActive ? 'text-white' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="mcq-mode-selector"
                      transition={{ type: 'spring', stiffness: 450, damping: 34 }}
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-xs"
                    />
                  )}
                  <Icon className={`relative z-10 w-3.5 h-3.5 ${isActive ? 'text-sky-200' : 'text-slate-400'}`} />
                  <span className="relative z-10">{label}</span>
                </button>
              );
            })}
          </div>

          {/* Inline Utility Controls (Hidden during active timed exam) */}
          {!(mode === 'exam' && examStatus === 'running') && (
            <div className="flex flex-wrap items-center gap-2">
              {/* Compact Search */}
              <div className="relative flex-1 sm:flex-initial sm:w-52">
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
                  aria-label="Search questions"
                />
              </div>

              {/* Topic Selector */}
              {activeSet.topics.length > 0 && (
                <div className="relative">
                  <select
                    value={topicFilter}
                    onChange={(e) => {
                      setTopicFilter(e.target.value);
                      setCurrentIndex(0);
                    }}
                    className="celestial-input h-9 appearance-none pl-3 pr-8 text-xs rounded-xl text-slate-800 font-semibold cursor-pointer max-w-[175px] truncate"
                    aria-label="Filter by topic"
                  >
                    <option value="ALL">All Topics ({activeSet.questions.length})</option>
                    {activeSet.topics.map((t) => {
                      const count = activeSet.questions.filter((q) => q.topic === t).length;
                      return (
                        <option key={t} value={t}>
                          {t} ({count})
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              )}

              {/* Compact Practice Status Filter */}
              {mode === 'practice' && (
                <div className="relative">
                  <select
                    value={practiceFilter}
                    onChange={(e) => {
                      setPracticeFilter(e.target.value as PracticeFilter);
                      setCurrentIndex(0);
                    }}
                    className="celestial-input h-9 appearance-none pl-3 pr-8 text-xs rounded-xl text-slate-800 font-semibold cursor-pointer"
                    aria-label="Filter by practice status"
                  >
                    <option value="all">All ({activeStats.total})</option>
                    <option value="unanswered">Unanswered ({activeStats.total - activeStats.answered})</option>
                    <option value="incorrect">Missed ({activeStats.answered - activeStats.correct})</option>
                    <option value="bookmarked">Saved ({activeStats.bookmarked})</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              )}

              {/* Auto-Advance Quick Toggle */}
              {mode === 'practice' && (
                <button
                  type="button"
                  onClick={() => setAutoAdvance((v) => !v)}
                  aria-pressed={autoAdvance}
                  title="Automatically move to next question after answering"
                  className={`h-9 inline-flex items-center gap-1.5 px-3 rounded-xl text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
                    autoAdvance
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Auto-Next</span>
                </button>
              )}

              {/* Shuffle */}
              {mode === 'practice' && (
                <button
                  type="button"
                  onClick={() => {
                    setShuffledOrder((s) => !s);
                    setShuffleSeed((n) => n + 1);
                    setCurrentIndex(0);
                  }}
                  className={`h-9 inline-flex items-center gap-1.5 px-3 rounded-xl text-xs font-semibold border transition-colors cursor-pointer whitespace-nowrap ${
                    shuffledOrder
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>{shuffledOrder ? 'Shuffled' : 'Shuffle'}</span>
                </button>
              )}

              {/* Reset */}
              {(activeStats.answered > 0 || activeStats.bookmarked > 0) &&
                (confirmReset ? (
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleResetSetProgress}
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
          )}
          </div>
        </section>

        {/* MODE 1: INTERACTIVE PRACTICE STUDIO */}
        {mode === 'practice' && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Focus Question Canvas */}
            <div className="lg:col-span-8 space-y-4">
              {!currentQuestion ? (
                <div className="card-celestial celestial-top-glint rounded-2xl border p-12 text-center space-y-4">
                  <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900">No matching questions in this filter</h3>
                    <p className="text-sm text-slate-500 max-w-md mx-auto">
                      Clear the search keyword or switch your filter back to All questions to continue practicing.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setTopicFilter('ALL');
                      setPracticeFilter('all');
                    }}
                    className="btn-shimmer px-5 py-2.5 rounded-xl bg-gradient-to-r from-slate-950 to-blue-950 hover:from-blue-600 hover:to-indigo-600 text-white text-xs font-semibold cursor-pointer transition-all"
                  >
                    Show All {activeSet.courseCode} Questions
                  </button>
                </div>
              ) : (
                (() => {
                  const chosen = activeSetProgress.answers[currentQuestion.id];
                  const isAnswered = chosen !== undefined;
                  const isCorrect = isAnswered && chosen === currentQuestion.correctIndex;
                  const isBookmarked = activeSetProgress.bookmarks.includes(currentQuestion.id);

                  return (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentQuestion.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                        className="celestial-bezel rounded-2xl shadow-sm"
                      >
                        <div className="card-celestial celestial-top-glint rounded-[15px] overflow-hidden">
                        {/* Integrated Top Session Hairline Progress */}
                        <div className="h-1.5 w-full bg-slate-100 overflow-hidden">
                          <motion.div
                            className={`h-full bg-gradient-to-r ${courseTheme.accentBar}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${positionPct}%` }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          />
                        </div>

                        <div className="p-6 sm:p-8 space-y-6">
                          {/* Question Kicker & Bookmark */}
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500 tabular-nums">
                              <span className="font-bold text-slate-950">
                                Question {String(currentIndex + 1).padStart(2, '0')} / {String(filteredQuestions.length).padStart(2, '0')}
                              </span>
                              <span aria-hidden="true" className="text-slate-300">·</span>
                              <span>Paper #{currentQuestion.num}</span>
                              {currentQuestion.topic && (
                                <>
                                  <span aria-hidden="true" className="text-slate-300">·</span>
                                  <span className="text-blue-700 font-semibold">{currentQuestion.topic}</span>
                                </>
                              )}
                            </div>

                            <motion.button
                              whileTap={{ scale: 0.94 }}
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
                            </motion.button>
                          </div>

                          {/* Question Stem */}
                          <h2 className="text-lg sm:text-[21px] font-semibold text-slate-950 leading-[1.55]">
                            {currentQuestion.question}
                          </h2>

                          {/* Interactive Tactile Option Tiles */}
                          <div
                            className="space-y-3"
                            role="radiogroup"
                            aria-label={`Options for question ${currentQuestion.num}`}
                          >
                            {currentQuestion.options.map((opt, idx) => {
                              const isSelected = chosen === idx;
                              const isRightOption = idx === currentQuestion.correctIndex;

                              let containerStyle =
                                'bg-slate-50/40 border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 text-slate-800';
                              let letterBadgeStyle =
                                'bg-white text-slate-700 border-slate-200 shadow-2xs';
                              let statusLabel: string | null = null;

                              if (isAnswered) {
                                if (isRightOption) {
                                  containerStyle =
                                    'bg-emerald-50/90 border-emerald-500 text-emerald-950 shadow-xs';
                                  letterBadgeStyle =
                                    'bg-emerald-600 text-white border-emerald-600';
                                  statusLabel = 'Verified Answer';
                                } else if (isSelected && !isRightOption) {
                                  containerStyle =
                                    'bg-rose-50/90 border-rose-500 text-rose-950';
                                  letterBadgeStyle =
                                    'bg-rose-600 text-white border-rose-600';
                                  statusLabel = 'Your Selection';
                                } else {
                                  containerStyle =
                                    'bg-slate-50/50 border-slate-200/70 text-slate-400 opacity-75';
                                  letterBadgeStyle =
                                    'bg-slate-100 text-slate-400 border-slate-200';
                                }
                              }

                              return (
                                <motion.button
                                  key={idx}
                                  whileHover={!isAnswered ? { x: 4 } : undefined}
                                  whileTap={{ scale: 0.99 }}
                                  type="button"
                                  role="radio"
                                  aria-checked={isSelected}
                                  onClick={() => handleSelectAnswer(currentQuestion.id, idx)}
                                  className={`w-full min-h-[56px] p-4 rounded-2xl border-2 text-left transition-colors flex items-center justify-between gap-3 cursor-pointer ${containerStyle}`}
                                >
                                  <div className="flex items-start gap-3.5 min-w-0">
                                    <span
                                      className={`w-8 h-8 rounded-xl border font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${letterBadgeStyle}`}
                                    >
                                      {OPTION_LETTERS[idx]}
                                    </span>
                                    <span className="text-sm sm:text-base font-medium leading-snug break-words pt-1">
                                      {opt}
                                    </span>
                                  </div>

                                  {isAnswered && (isRightOption || isSelected) && (
                                    <span
                                      className={`inline-flex items-center gap-1.5 text-xs font-semibold shrink-0 ${
                                        isRightOption ? 'text-emerald-700' : 'text-rose-700'
                                      }`}
                                    >
                                      {isRightOption ? (
                                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                                      ) : (
                                        <XCircle className="w-5 h-5 shrink-0" />
                                      )}
                                      <span className="hidden sm:inline">{statusLabel}</span>
                                    </span>
                                  )}
                                </motion.button>
                              );
                            })}
                          </div>

                          {/* Answer Verification Feedback */}
                          <div aria-live="polite">
                            <AnimatePresence>
                              {isAnswered && (
                                <motion.div
                                  initial={{ opacity: 0, y: 6 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -4 }}
                                  transition={{ duration: 0.2 }}
                                  className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm ${
                                    isCorrect
                                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                                      : 'bg-rose-50 border-rose-200 text-rose-950'
                                  }`}
                                >
                                  <div className="flex items-center gap-2.5 font-semibold">
                                    {isCorrect ? (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                                    ) : (
                                      <XCircle className="w-4 h-4 text-rose-700 shrink-0" />
                                    )}
                                    <span>
                                      {isCorrect
                                        ? `Spot on! Option ${OPTION_LETTERS[currentQuestion.correctIndex]} is correct.`
                                        : `Correct option is ${OPTION_LETTERS[currentQuestion.correctIndex]}: ${currentQuestion.options[currentQuestion.correctIndex]}`}
                                    </span>
                                  </div>

                                  {!isCorrect && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setProgress((prev) => {
                                          const cur = prev[activeSet.id] || { answers: {}, bookmarks: [] };
                                          const nextAns = { ...cur.answers };
                                          delete nextAns[currentQuestion.id];
                                          return { ...prev, [activeSet.id]: { ...cur, answers: nextAns } };
                                        });
                                      }}
                                      className="text-xs font-semibold underline underline-offset-2 text-rose-800 hover:text-rose-950 cursor-pointer self-start sm:self-auto shrink-0"
                                    >
                                      Clear &amp; Retry
                                    </button>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Navigation Footer */}
                          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                            <motion.button
                              whileTap={{ scale: 0.96 }}
                              type="button"
                              disabled={currentIndex <= 0}
                              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs sm:text-sm font-semibold text-slate-700 cursor-pointer min-h-[44px]"
                            >
                              <ChevronLeft className="w-4 h-4" />
                              <span>Previous</span>
                            </motion.button>

                            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                              <Keyboard className="w-3.5 h-3.5" />
                              <span>A–D / 1–4 Answer · ← → Step · F Save</span>
                            </div>

                            <motion.button
                              whileTap={{ scale: 0.96 }}
                              type="button"
                              disabled={currentIndex >= filteredQuestions.length - 1}
                              onClick={() =>
                                setCurrentIndex((i) => Math.min(filteredQuestions.length - 1, i + 1))
                              }
                              className="btn-shimmer inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-slate-950 to-blue-950 hover:from-blue-600 hover:to-indigo-600 disabled:opacity-40 disabled:pointer-events-none text-xs sm:text-sm font-semibold text-white transition-all cursor-pointer min-h-[44px]"
                            >
                              <span>Next Question</span>
                              <ChevronRight className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  );
                })()
              )}
            </div>

            {/* Right Rail: Live Mastery Telemetry & Question Jump Map */}
            <aside className="lg:col-span-4 space-y-4">
              <div className="card-celestial celestial-top-glint rounded-2xl border p-5 sm:p-6 space-y-5">
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="text-xs font-mono font-semibold text-blue-700 uppercase tracking-wider">
                      Session Mastery
                    </div>
                    <h3 className="text-lg font-bold text-slate-950 tabular-nums">
                      {activeStats.answered} / {activeStats.total} Solved
                    </h3>
                    <div className="flex items-center gap-3 text-xs font-mono tabular-nums pt-0.5">
                      <span className="text-emerald-700 font-semibold">{activeStats.correct} Right</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-rose-700 font-semibold">
                        {activeStats.answered - activeStats.correct} Missed
                      </span>
                    </div>
                  </div>

                  <MasteryRing
                    percent={activeStats.accuracy}
                    size={72}
                    strokeWidth={6}
                    trackColor="#E2E8F0"
                    strokeColor={activeStats.accuracy >= 70 ? '#059669' : '#2563EB'}
                    labelColor="text-slate-950"
                    sublabel="Score"
                  />
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Question Map</span>
                    <span className="font-mono text-[11px] tabular-nums">{activeStats.completion}% done</span>
                  </div>

                  {filteredQuestions.length > 0 && (
                    <div className="grid grid-cols-7 sm:grid-cols-8 lg:grid-cols-6 gap-1.5 max-h-72 overflow-y-auto p-0.5">
                      {filteredQuestions.map((q, idx) => {
                        const ans = activeSetProgress.answers[q.id];
                        const isCurrent = idx === currentIndex;
                        const isBookmarked = activeSetProgress.bookmarks.includes(q.id);

                        let btnStyle = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';
                        if (ans !== undefined) {
                          btnStyle =
                            ans === q.correctIndex
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                              : 'bg-rose-50 border-rose-300 text-rose-800 font-bold';
                        }
                        if (isCurrent) {
                          btnStyle += ' ring-2 ring-blue-600 border-blue-600 bg-blue-50 text-blue-800';
                        }

                        return (
                          <button
                            key={q.id}
                            type="button"
                            onClick={() => setCurrentIndex(idx)}
                            title={`Question ${idx + 1} (Paper #${q.num})`}
                            className={`relative h-9 rounded-lg border text-xs font-mono tabular-nums transition-colors cursor-pointer ${btnStyle}`}
                          >
                            {idx + 1}
                            {isBookmarked && (
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
                    <span>Correct</span>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Missed</span>
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

        {/* MODE 2: TIMED MOCK EXAM SIMULATION */}
        {mode === 'exam' && (
          <section>
            {examStatus === 'setup' && (
              <div className="celestial-bezel rounded-2xl max-w-3xl mx-auto shadow-sm">
                <div className="card-celestial celestial-top-glint rounded-[15px] p-6 sm:p-10 space-y-7">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-blue-700">
                    <Timer className="w-4 h-4" />
                    <span>VU Exam Simulation</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-950">
                    Configure {activeSet.courseCode} Timed Mock Exam
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Randomized questions drawn from {activeSet.courseCode} ({activeSet.termLabel}
                    {topicFilter !== 'ALL' ? ` · Topic: ${topicFilter}` : ''}). Graded upon completion or timer expiry.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500">
                    Select Question Length (45 sec / question)
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[15, 25, 40, activeSet.questions.length].map((count, i) => {
                      const available =
                        topicFilter === 'ALL'
                          ? activeSet.questions.length
                          : activeSet.questions.filter((q) => q.topic === topicFilter).length;
                      const actualCount = Math.min(count, available);
                      const label = i === 3 ? `Full (${available})` : `${actualCount} MCQs`;
                      const mins = Math.round((actualCount * 45) / 60);
                      const isPicked = examSize === count;

                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setExamSize(count)}
                          className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                            isPicked
                              ? 'bg-gradient-to-br from-slate-950 to-blue-950 border-blue-500 text-white shadow-md'
                              : 'surface-frosted hover:border-blue-300 border-slate-200/80 text-slate-800'
                          }`}
                        >
                          <div className="font-mono text-base font-bold tabular-nums">{label}</div>
                          <div
                            className={`text-xs mt-1 font-mono tabular-nums ${
                              isPicked ? 'text-sky-300' : 'text-slate-500'
                            }`}
                          >
                            ~{mins} min timer
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-5 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200/70">
                  <div className="text-xs text-slate-500">
                    Target benchmark: <strong className="text-slate-900">70%+</strong> for VU distinction.
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={handleStartExam}
                    className="btn-shimmer inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all cursor-pointer min-h-[48px] shadow-sm"
                  >
                    <Timer className="w-4 h-4" />
                    <span>Begin Timed Mock Exam</span>
                  </motion.button>
                </div>
                </div>
              </div>
            )}

            {examStatus === 'running' && examActiveQuestion && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-8 celestial-bezel rounded-2xl shadow-sm">
                  <div className="card-celestial celestial-top-glint rounded-[15px] overflow-hidden">
                  <div className="h-1.5 w-full bg-slate-100">
                    <div
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{
                        width: `${Math.round(((examIndex + 1) / examQuestions.length) * 100)}%`
                      }}
                    />
                  </div>

                  <div className="p-6 sm:p-8 space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-2 text-xs font-mono text-slate-600 tabular-nums">
                        <span className="font-bold text-slate-950">
                          Exam Q {examIndex + 1} / {examQuestions.length}
                        </span>
                        {examActiveQuestion.topic && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-blue-700 font-semibold">{examActiveQuestion.topic}</span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleExamFlag(examActiveQuestion.id)}
                          aria-pressed={examFlagged.has(examActiveQuestion.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer ${
                            examFlagged.has(examActiveQuestion.id)
                              ? 'bg-amber-50 border-amber-300 text-amber-800'
                              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                          }`}
                        >
                          <Flag className="w-3.5 h-3.5" />
                          <span>{examFlagged.has(examActiveQuestion.id) ? 'Flagged' : 'Flag'}</span>
                        </button>

                        <div
                          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border font-mono text-xs font-bold tabular-nums ${
                            examSecondsLeft <= 60
                              ? 'bg-rose-50 border-rose-300 text-rose-700'
                              : 'bg-slate-950 border-slate-800 text-sky-300'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>{formatTimer(examSecondsLeft)}</span>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-lg sm:text-[21px] font-semibold text-slate-950 leading-[1.55]">
                      {examActiveQuestion.question}
                    </h3>

                    <div className="space-y-3" role="radiogroup" aria-label="Exam answer choices">
                      {examActiveQuestion.options.map((opt, idx) => {
                        const isChosen = examAnswers[examActiveQuestion.id] === idx;
                        return (
                          <button
                            key={idx}
                            type="button"
                            role="radio"
                            aria-checked={isChosen}
                            onClick={() =>
                              setExamAnswers((prev) => ({
                                ...prev,
                                [examActiveQuestion.id]: idx
                              }))
                            }
                            className={`w-full min-h-[56px] p-4 rounded-2xl border-2 text-left transition-colors flex items-center gap-3.5 cursor-pointer ${
                              isChosen
                                ? 'bg-blue-50/90 border-blue-600 text-blue-950'
                                : 'bg-slate-50/40 border-slate-200 hover:border-blue-400 hover:bg-slate-50 text-slate-800'
                            }`}
                          >
                            <span
                              className={`w-8 h-8 rounded-xl border font-mono text-xs font-bold flex items-center justify-center shrink-0 ${
                                isChosen
                                  ? 'bg-blue-600 border-blue-600 text-white'
                                  : 'bg-white border-slate-200 text-slate-700'
                              }`}
                            >
                              {OPTION_LETTERS[idx]}
                            </span>
                            <span className="text-sm sm:text-base font-medium leading-snug">{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        disabled={examIndex <= 0}
                        onClick={() => setExamIndex((i) => Math.max(0, i - 1))}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs sm:text-sm font-semibold text-slate-700 cursor-pointer min-h-[44px]"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Previous</span>
                      </button>

                      <div className="flex items-center gap-2">
                        {examIndex < examQuestions.length - 1 ? (
                          <button
                            type="button"
                            onClick={() => setExamIndex((i) => i + 1)}
                            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-blue-600 text-white text-xs sm:text-sm font-semibold cursor-pointer min-h-[44px]"
                          >
                            <span>Save &amp; Next</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmSubmitExam(true)}
                            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold cursor-pointer min-h-[44px]"
                          >
                            <Check className="w-4 h-4" />
                            <span>Finish &amp; Grade</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  </div>
                </div>

                <aside className="lg:col-span-4 card-celestial celestial-top-glint rounded-2xl border p-5 sm:p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-slate-950">Exam Sheet</h4>
                    <span className="text-xs font-mono font-semibold text-slate-500 tabular-nums">
                      {Object.keys(examAnswers).length}/{examQuestions.length} Answered
                    </span>
                  </div>

                  <div className="grid grid-cols-7 sm:grid-cols-8 lg:grid-cols-5 gap-1.5 max-h-72 overflow-y-auto p-0.5">
                    {examQuestions.map((q, idx) => {
                      const answered = examAnswers[q.id] !== undefined;
                      const flagged = examFlagged.has(q.id);
                      const isCur = idx === examIndex;

                      let cls = 'bg-slate-50 border-slate-200 text-slate-700';
                      if (answered) cls = 'bg-blue-600 border-blue-600 text-white font-bold';
                      if (flagged && !answered) cls = 'bg-amber-50 border-amber-300 text-amber-900 font-bold';
                      if (isCur) cls += ' ring-2 ring-amber-500';

                      return (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => setExamIndex(idx)}
                          className={`relative h-9 rounded-lg border text-xs font-mono tabular-nums cursor-pointer ${cls}`}
                        >
                          {idx + 1}
                          {flagged && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-white" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    {!confirmSubmitExam ? (
                      <button
                        type="button"
                        onClick={() => setConfirmSubmitExam(true)}
                        className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm cursor-pointer transition-colors"
                      >
                        Submit Mock Exam
                      </button>
                    ) : (
                      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-2.5 text-xs">
                        <p className="font-semibold text-amber-950">
                          Submit exam now? ({Object.keys(examAnswers).length} of {examQuestions.length} answered)
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setExamStatus('submitted');
                              setConfirmSubmitExam(false);
                            }}
                            className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer"
                          >
                            Yes, Submit
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmSubmitExam(false)}
                            className="flex-1 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium cursor-pointer"
                          >
                            Keep Going
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </aside>
              </div>
            )}

            {examStatus === 'submitted' && (
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.98, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  className="relative overflow-hidden bg-studio-stage text-white rounded-2xl border border-slate-800/90 p-6 sm:p-8 shadow-xl"
                >
                  <CelestialStarfield density={0.55} />
                  <CelestialOrbitalRings compact />
                  <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-400/65 to-transparent" aria-hidden="true" />
                  <div className="absolute inset-0 bg-academic-grid opacity-30 pointer-events-none" />
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                      <MasteryRing
                        percent={examScoreSummary.pct}
                        size={92}
                        strokeWidth={8}
                        strokeColor={examScoreSummary.pct >= 70 ? '#34D399' : '#38BDF8'}
                        sublabel="Result"
                      />
                      <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-sky-300">
                          <Award className="w-4 h-4" />
                          <span>{activeSet.courseCode} Mock Result</span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
                          {examScoreSummary.correct} / {examScoreSummary.total} Correct
                        </h3>
                        <p className="text-sm text-slate-300">
                          {examScoreSummary.pct >= 80
                            ? 'Distinction readiness achieved.'
                            : examScoreSummary.pct >= 50
                            ? 'Passing performance — review missed questions below.'
                            : 'Needs additional practice — study missed concepts below and retake.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="px-4 py-3 rounded-xl glass-panel-dark text-center">
                        <div className="font-mono text-lg font-bold text-emerald-400 tabular-nums">
                          {examScoreSummary.correct}
                        </div>
                        <div className="text-[11px] text-slate-400">Correct</div>
                      </div>
                      <div className="px-4 py-3 rounded-xl glass-panel-dark text-center">
                        <div className="font-mono text-lg font-bold text-rose-400 tabular-nums">
                          {examScoreSummary.wrong + examScoreSummary.unanswered}
                        </div>
                        <div className="text-[11px] text-slate-400">Missed</div>
                      </div>
                      <div className="px-4 py-3 rounded-xl glass-panel-dark text-center">
                        <div className="font-mono text-lg font-bold text-sky-300 tabular-nums">
                          {formatTimer(examScoreSummary.usedSecs)}
                        </div>
                        <div className="text-[11px] text-slate-400">Time</div>
                      </div>

                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        type="button"
                        onClick={() => setExamStatus('setup')}
                        className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm cursor-pointer"
                      >
                        Retake Mock Exam
                      </motion.button>
                    </div>
                  </div>
                </motion.div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h4 className="text-lg font-bold text-slate-950">Detailed Answer Review</h4>
                  <div className="inline-flex p-1 rounded-xl surface-frosted border border-slate-200/80">
                    {(
                      [
                        { id: 'all', label: `All (${examQuestions.length})` },
                        { id: 'incorrect', label: `Missed (${examScoreSummary.wrong + examScoreSummary.unanswered})` },
                        { id: 'correct', label: `Correct (${examScoreSummary.correct})` }
                      ] as const
                    ).map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setExamReviewFilter(tab.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                          examReviewFilter === tab.id
                            ? 'bg-gradient-to-r from-slate-950 to-blue-950 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {examQuestions
                    .filter((q) => {
                      const ans = examAnswers[q.id];
                      const right = ans === q.correctIndex;
                      if (examReviewFilter === 'incorrect') return !right;
                      if (examReviewFilter === 'correct') return right;
                      return true;
                    })
                    .map((q, idx) => {
                      const chosen = examAnswers[q.id];
                      const right = chosen === q.correctIndex;

                      return (
                        <div
                          key={q.id}
                          className="card-celestial celestial-top-glint rounded-2xl border p-5 sm:p-6 space-y-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                            <span className="text-slate-500 font-semibold">
                              Review #{idx + 1} · Paper Q{q.num}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 font-semibold ${
                                right ? 'text-emerald-700' : 'text-rose-700'
                              }`}
                            >
                              {right ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : (
                                <XCircle className="w-4 h-4" />
                              )}
                              <span>
                                {chosen === undefined
                                  ? 'Unanswered'
                                  : right
                                  ? 'Correct'
                                  : 'Incorrect'}
                              </span>
                            </span>
                          </div>

                          <p className="text-sm sm:text-base font-semibold text-slate-900">
                            {q.question}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                            {q.options.map((opt, oIdx) => {
                              const isRightOpt = oIdx === q.correctIndex;
                              const isUserOpt = chosen === oIdx;
                              let cls = 'bg-slate-50 border-slate-200 text-slate-600';
                              if (isRightOpt) cls = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold';
                              else if (isUserOpt) cls = 'bg-rose-50 border-rose-400 text-rose-950 font-semibold';

                              return (
                                <div key={oIdx} className={`p-3 rounded-xl border flex items-center gap-2 ${cls}`}>
                                  <span className="font-mono font-bold">{OPTION_LETTERS[oIdx]}.</span>
                                  <span>{opt}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </section>
        )}

        {/* MODE 3: QUICK REVISION SHEET */}
        {mode === 'revision' && (
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 px-1">
              <div className="text-xs sm:text-sm text-slate-600 font-medium">
                Showing <span className="font-mono font-bold text-slate-900 tabular-nums">{filteredQuestions.length}</span> verified MCQs for rapid last-minute review
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowAllAnswers((v) => !v);
                  setRevealedIds(new Set());
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                {showAllAnswers ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showAllAnswers ? 'Hide All Answers (Self-Test)' : 'Reveal All Answers'}</span>
              </button>
            </div>

            {filteredQuestions.length === 0 ? (
              <div className="card-celestial celestial-top-glint rounded-2xl border p-10 text-center text-sm text-slate-500">
                No questions match your search or topic filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredQuestions.map((q, idx) => {
                  const isRevealed = showAllAnswers || revealedIds.has(q.id);
                  return (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 'some' }}
                      transition={{
                        duration: 0.22,
                        delay: Math.min((idx % 6) * 0.025, 0.14),
                        ease: [0.16, 1, 0.3, 1]
                      }}
                      className="card-celestial celestial-top-glint rounded-2xl border p-5 space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2 text-xs font-mono text-slate-500">
                          <span className="font-bold text-blue-700">Q{q.num}</span>
                          {q.topic && <span className="truncate text-slate-500">{q.topic}</span>}
                        </div>
                        <p className="text-sm font-semibold text-slate-900 leading-snug">
                          {q.question}
                        </p>
                        <ul className="space-y-1.5 text-xs">
                          {q.options.map((opt, oIdx) => {
                            const isRight = oIdx === q.correctIndex;
                            return (
                              <li
                                key={oIdx}
                                className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                                  isRevealed && isRight
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold'
                                    : 'bg-slate-50/70 border-slate-100 text-slate-700'
                                }`}
                              >
                                <span>
                                  <span className="font-mono font-bold mr-1.5">{OPTION_LETTERS[oIdx]}.</span>
                                  {opt}
                                </span>
                                {isRevealed && isRight && (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </div>

                      {!showAllAnswers && (
                        <button
                          type="button"
                          onClick={() => toggleRevisionReveal(q.id)}
                          className="self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 cursor-pointer"
                        >
                          {isRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          <span>{isRevealed ? 'Hide Answer' : 'Show Answer'}</span>
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        <CelestialDivider className="pt-4" />

        {/* Cross-links to other dedicated Subject MCQ Pages */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Other Subject MCQ Pages</h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Switch courses or copy a shareable quiz link for classmates.
              </p>
            </div>
            <a
              href="/mcqs"
              onClick={(e) => {
                e.preventDefault();
                onSelectSetId(null);
              }}
              className="text-xs font-semibold text-blue-700 hover:text-blue-800"
            >
              View All Subjects →
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {otherSets.map((set, idx) => {
              const isCopied = copiedSetId === set.id;
              const t = getCourseTheme(set.courseCode);
              return (
                <motion.div
                  key={set.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 'some' }}
                  transition={{
                    duration: 0.25,
                    delay: Math.min(idx * 0.04, 0.2),
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  whileHover={{ y: -3 }}
                  className="card-celestial celestial-top-glint rounded-2xl border hover:border-blue-300 p-4 flex items-center justify-between gap-3 transition-colors"
                >
                  <a
                    href={`/mcqs/${set.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectSetId(set.id);
                    }}
                    className="flex items-center gap-3 min-w-0 group"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl ${t.badgeBg} ${t.badgeText} font-mono font-bold text-[11px] flex items-center justify-center shrink-0`}
                    >
                      {set.courseCode}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-mono font-semibold text-slate-500">
                        {set.termLabel} · {set.questions.length} MCQs
                      </div>
                      <div className="text-sm font-bold text-slate-900 group-hover:text-blue-700 truncate">
                        {set.courseTitle}
                      </div>
                    </div>
                  </a>

                  <button
                    type="button"
                    onClick={(e) => handleCopyShareLink(set.id, e)}
                    aria-label={`Copy link for ${set.courseCode} ${set.termLabel}`}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold shrink-0 cursor-pointer ${
                      isCopied
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                    }`}
                  >
                    {isCopied ? 'Copied' : 'Copy'}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};
