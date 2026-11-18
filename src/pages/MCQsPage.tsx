import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  Filter,
  Keyboard,
  Share2,
  Copy,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { mcqSets } from '../data/mcqs';
import { ExamTerm, McqQuestion, McqSet } from '../types';

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

export const MCQsPage: React.FC<MCQsPageProps> = ({
  activeSetId,
  onSelectSetId,
  onSelectCourseInLibrary
}) => {
  // Hub Term Switcher
  const [termFilter, setTermFilter] = useState<'all' | ExamTerm>('midterm');

  // Share / Copy feedback state
  const [copiedSetId, setCopiedSetId] = useState<string | null>(null);

  // Study Mode inside a subject page
  const [mode, setMode] = useState<StudyMode>('practice');

  // Persistent Progress State
  const [progress, setProgress] = useState<StoredProgress>(loadProgress);
  const [confirmReset, setConfirmReset] = useState(false);

  // Filtering & Ordering inside Active Set
  const [topicFilter, setTopicFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [practiceFilter, setPracticeFilter] = useState<PracticeFilter>('all');
  const [shuffledOrder, setShuffledOrder] = useState<boolean>(false);
  const [shuffleSeed, setShuffleSeed] = useState<number>(0);

  // Practice Mode Active Question State
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(false);

  // Quick Revision Reveal State
  const [showAllAnswers, setShowAllAnswers] = useState<boolean>(true);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  // Mock Exam Simulation State
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

  // Persist progress changes
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  // Resolve dedicated subject set when activeSetId is present
  const activeSet: McqSet | null = useMemo(() => {
    if (!activeSetId) return null;
    return mcqSets.find((s) => s.id === activeSetId) || null;
  }, [activeSetId]);

  // Sibling term sets for the same course code (e.g. CS201 Mid-Term <-> Final-Term)
  const siblingTermSets = useMemo(() => {
    if (!activeSet) return [];
    return mcqSets.filter(
      (s) => s.courseCode === activeSet.courseCode && s.id !== activeSet.id
    );
  }, [activeSet]);

  const activeSetProgress: SetProgress = useMemo(() => {
    if (!activeSet) return { answers: {}, bookmarks: [] };
    return progress[activeSet.id] || { answers: {}, bookmarks: [] };
  }, [progress, activeSet]);

  // Reset sub-filters when switching between subject pages
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

  // Hub sets filtered by term
  const visibleHubSets = useMemo(() => {
    if (termFilter === 'all') return mcqSets;
    return mcqSets.filter((s) => s.term === termFilter);
  }, [termFilter]);

  const bankSummary = useMemo(() => {
    const midtermCount = mcqSets
      .filter((s) => s.term === 'midterm')
      .reduce((acc, s) => acc + s.questions.length, 0);
    const finalCount = mcqSets
      .filter((s) => s.term === 'finalterm')
      .reduce((acc, s) => acc + s.questions.length, 0);
    const totalSubjects = new Set(mcqSets.map((s) => s.courseCode)).size;
    return {
      midtermCount,
      finalCount,
      totalCount: midtermCount + finalCount,
      totalSubjects
    };
  }, []);

  // Copy & Share Handlers
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
      // Clipboard blocked in restricted context; ignore silently
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
        // User cancelled or share unsupported -> copy fallback
      }
    }
    handleCopyShareLink(set.id);
  };

  // Filtered Questions for Practice & Revision
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
          setCurrentIndex((idx) =>
            idx < filteredQuestions.length - 1 ? idx + 1 : idx
          );
        }, 450);
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

  // Keyboard shortcuts during Practice mode
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

  // Mock Exam Countdown Timer
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
  // VIEW 1: MCQs DIRECTORY HUB (/mcqs)
  // =========================================================================
  if (!activeSet) {
    return (
      <div className="min-h-screen bg-slate-50">
        <section className="bg-[#0B1526] text-white border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="space-y-3 max-w-3xl">
                <p className="text-xs sm:text-sm font-mono text-amber-300 tracking-wide tabular-nums">
                  Interactive Exam Practice · {bankSummary.totalSubjects} Subjects · {bankSummary.totalCount} Verified MCQs
                </p>

                <h1
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight"
                  style={{ textWrap: 'balance' }}
                >
                  Subject-Wise Interactive MCQ Pages
                </h1>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                  Every subject has its own dedicated shareable quiz page with Practice Mode, Timed Mock Exams, and Quick Revision flash-sheets. Copy any subject link directly to share with classmates.
                </p>
              </div>

              {/* Term Switcher */}
              <div
                className="inline-flex p-1 rounded-lg bg-slate-900 border border-slate-700 self-start lg:self-auto shrink-0"
                role="tablist"
                aria-label="Filter MCQ subjects by term"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={termFilter === 'midterm'}
                  onClick={() => setTermFilter('midterm')}
                  className={`px-3.5 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    termFilter === 'midterm'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Mid-Term ({bankSummary.midtermCount})
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={termFilter === 'finalterm'}
                  onClick={() => setTermFilter('finalterm')}
                  className={`px-3.5 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    termFilter === 'finalterm'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Final-Term ({bankSummary.finalCount})
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={termFilter === 'all'}
                  onClick={() => setTermFilter('all')}
                  className={`px-3.5 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    termFilter === 'all'
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  All ({bankSummary.totalCount})
                </button>
              </div>
            </div>
          </div>
        </section>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {termFilter === 'midterm'
                  ? 'Mid-Term MCQ Subject Pages'
                  : termFilter === 'finalterm'
                  ? 'Final-Term MCQ Subject Pages'
                  : 'All MCQ Subject Pages'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Select any course to open its dedicated quiz workspace, or copy its direct URL to share.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleHubSets.map((set) => {
              const p = progress[set.id] || { answers: {}, bookmarks: [] };
              const answeredCount = Object.keys(p.answers).length;
              let correctCount = 0;
              for (const q of set.questions) {
                if (p.answers[q.id] === q.correctIndex) correctCount++;
              }
              const pct = Math.round((answeredCount / set.questions.length) * 100);
              const acc = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
              const isCopied = copiedSetId === set.id;

              return (
                <div
                  key={set.id}
                  className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 p-5 sm:p-6 flex flex-col justify-between gap-5 transition-colors"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2 text-xs font-mono">
                      <span className="font-bold text-blue-700">{set.courseCode}</span>
                      <span className="text-slate-500 tabular-nums">
                        {set.termLabel} · {set.questions.length} MCQs
                      </span>
                    </div>

                    <a
                      href={`/mcqs/${set.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onSelectSetId(set.id);
                      }}
                      className="block group"
                    >
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                        {set.courseTitle}
                      </h3>
                    </a>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
                      {set.description}
                    </p>

                    <div className="text-[11px] font-mono text-slate-400 truncate">
                      /mcqs/{set.id}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Progress */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 tabular-nums">
                        <span>
                          {answeredCount}/{set.questions.length} practiced
                        </span>
                        <span>
                          {answeredCount > 0 ? `${acc}% accuracy` : 'Not started'}
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-600 transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleCopyShareLink(set.id, e)}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer min-h-[40px] ${
                          isCopied
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Copied Link</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>

                      <a
                        href={`/mcqs/${set.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          onSelectSetId(set.id);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0B1526] hover:bg-blue-700 text-white text-xs font-semibold transition-colors min-h-[40px] whitespace-nowrap"
                      >
                        <span>Open Quiz</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: DEDICATED SUBJECT MCQ PAGE (/mcqs/<setId>)
  // =========================================================================
  const isCopiedActive = copiedSetId === activeSet.id;
  const sharePath = `/mcqs/${activeSet.id}`;
  const otherSets = mcqSets.filter((s) => s.id !== activeSet.id);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dedicated Subject Header */}
      <section className="bg-[#0B1526] text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-5">
          {/* Breadcrumb Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-slate-400">
              <a
                href="/mcqs"
                onClick={(e) => {
                  e.preventDefault();
                  onSelectSetId(null);
                }}
                className="inline-flex items-center gap-1.5 text-slate-200 hover:text-white font-medium transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All MCQ Subjects</span>
              </a>
              <span aria-hidden="true">/</span>
              <span className="font-mono text-amber-300 font-semibold">
                {activeSet.courseCode} ({activeSet.termLabel})
              </span>
            </nav>

            <span className="font-mono text-[11px] text-slate-400 hidden sm:inline">
              {sharePath}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2.5 max-w-3xl">
              <p className="text-xs sm:text-sm font-mono text-amber-300 tracking-wide tabular-nums">
                {activeSet.courseCode} · {activeSet.termLabel} · {activeStats.total} Verified MCQs
                {activeStats.answered > 0 && ` · ${activeStats.correct}/${activeStats.answered} Correct (${activeStats.accuracy}%)`}
              </p>

              <h1
                className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight"
                style={{ textWrap: 'balance' }}
              >
                {activeSet.courseCode} – {activeSet.courseTitle} ({activeSet.termLabel} MCQs)
              </h1>

              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                {activeSet.description}
              </p>
            </div>

            {/* Subject Share & Action Controls */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => handleCopyShareLink(activeSet.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer min-h-[40px] ${
                  isCopiedActive
                    ? 'bg-emerald-600 border-emerald-500 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
                }`}
              >
                {isCopiedActive ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Link Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-amber-300" />
                    <span>Copy Subject Link</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleNativeShare(activeSet)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer min-h-[40px]"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>

              {siblingTermSets.map((sib) => (
                <a
                  key={sib.id}
                  href={`/mcqs/${sib.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectSetId(sib.id);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-xs font-medium transition-colors min-h-[40px]"
                >
                  <span>{sib.termLabel} ({sib.questions.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              ))}

              {onSelectCourseInLibrary && (
                <button
                  type="button"
                  onClick={() => onSelectCourseInLibrary(activeSet.courseCode)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-white hover:bg-slate-100 text-slate-900 text-xs font-semibold transition-colors cursor-pointer min-h-[40px]"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-700" />
                  <span>{activeSet.courseCode} Files</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Studio Toolbar & Study Mode Switcher */}
        <section className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="space-y-1">
              <div className="text-xs font-mono text-slate-500 tabular-nums">
                {activeSet.courseCode} · {activeSet.termLabel} · {activeStats.answered}/{activeStats.total} practiced
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Quiz &amp; Revision Workspace
              </h2>
            </div>

            {/* Study Mode Selector Tabs */}
            <div
              className="inline-flex flex-wrap p-1 rounded-lg bg-slate-100 border border-slate-200 self-start lg:self-auto"
              role="tablist"
              aria-label="Study mode"
            >
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'practice'}
                onClick={() => setMode('practice')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer min-h-[38px] ${
                  mode === 'practice'
                    ? 'bg-white text-slate-950 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-blue-700" />
                <span>Practice Mode</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'exam'}
                onClick={() => setMode('exam')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer min-h-[38px] ${
                  mode === 'exam'
                    ? 'bg-white text-slate-950 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <Timer className="w-3.5 h-3.5 text-blue-700" />
                <span>Timed Mock Exam</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'revision'}
                onClick={() => setMode('revision')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer min-h-[38px] ${
                  mode === 'revision'
                    ? 'bg-white text-slate-950 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <ListChecks className="w-3.5 h-3.5 text-blue-700" />
                <span>Quick Revision</span>
              </button>
            </div>
          </div>

          {/* Search, Topic & Status Filters */}
          {!(mode === 'exam' && examStatus === 'running') && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="relative md:col-span-5">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentIndex(0);
                  }}
                  placeholder={`Search keywords in ${activeSet.courseCode} questions...`}
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  aria-label="Search questions"
                />
              </div>

              <div className="md:col-span-4 flex items-center gap-2">
                {activeSet.topics.length > 0 ? (
                  <select
                    value={topicFilter}
                    onChange={(e) => {
                      setTopicFilter(e.target.value);
                      setCurrentIndex(0);
                    }}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                    aria-label="Filter by topic"
                  >
                    <option value="ALL">All Topics ({activeSet.questions.length} Qs)</option>
                    {activeSet.topics.map((t) => {
                      const count = activeSet.questions.filter((q) => q.topic === t).length;
                      return (
                        <option key={t} value={t}>
                          {t} ({count})
                        </option>
                      );
                    })}
                  </select>
                ) : mode === 'practice' ? (
                  <select
                    value={practiceFilter}
                    onChange={(e) => {
                      setPracticeFilter(e.target.value as PracticeFilter);
                      setCurrentIndex(0);
                    }}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                    aria-label="Filter by practice status"
                  >
                    <option value="all">All Questions ({activeStats.total})</option>
                    <option value="unanswered">Unanswered ({activeStats.total - activeStats.answered})</option>
                    <option value="incorrect">Missed / Incorrect ({activeStats.answered - activeStats.correct})</option>
                    <option value="bookmarked">Bookmarked ({activeStats.bookmarked})</option>
                  </select>
                ) : (
                  <div className="text-xs text-slate-500 font-mono px-2">
                    All {activeSet.questions.length} questions loaded
                  </div>
                )}
              </div>

              <div className="md:col-span-3 flex flex-wrap items-center justify-start md:justify-end gap-2">
                {mode === 'practice' && (
                  <button
                    type="button"
                    onClick={() => {
                      setShuffledOrder((s) => !s);
                      setShuffleSeed((n) => n + 1);
                      setCurrentIndex(0);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer min-h-[40px] ${
                      shuffledOrder
                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>{shuffledOrder ? 'Shuffled' : 'Shuffle'}</span>
                  </button>
                )}

                {activeStats.answered > 0 || activeStats.bookmarked > 0 ? (
                  confirmReset ? (
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleResetSetProgress}
                        className="px-3 py-2 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer min-h-[40px]"
                      >
                        Confirm Reset
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmReset(false)}
                        className="px-3 py-2 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer min-h-[40px]"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmReset(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-700 hover:text-rose-700 transition-colors cursor-pointer min-h-[40px]"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  )
                ) : null}
              </div>
            </div>
          )}

          {mode === 'practice' && activeSet.topics.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3" />
                  <span>Filter:</span>
                </span>
                {(
                  [
                    { id: 'all', label: `All (${activeStats.total})` },
                    { id: 'unanswered', label: `Unanswered (${activeStats.total - activeStats.answered})` },
                    { id: 'incorrect', label: `Missed (${activeStats.answered - activeStats.correct})` },
                    { id: 'bookmarked', label: `Bookmarked (${activeStats.bookmarked})` }
                  ] as const
                ).map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      setPracticeFilter(f.id);
                      setCurrentIndex(0);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                      practiceFilter === f.id
                        ? 'bg-[#0B1526] border-[#0B1526] text-white'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <label className="inline-flex items-center gap-2 text-xs text-slate-600 font-medium cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoAdvance}
                  onChange={(e) => setAutoAdvance(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Auto-advance after answering</span>
              </label>
            </div>
          )}

          {mode === 'practice' && activeSet.topics.length === 0 && (
            <div className="flex items-center justify-end">
              <label className="inline-flex items-center gap-2 text-xs text-slate-600 font-medium cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoAdvance}
                  onChange={(e) => setAutoAdvance(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Auto-advance to next question after answering</span>
              </label>
            </div>
          )}
        </section>

        {/* MODE 1: INTERACTIVE PRACTICE MODE */}
        {mode === 'practice' && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 space-y-4">
              {!currentQuestion ? (
                <div className="bg-white rounded-xl border border-slate-200 p-10 text-center space-y-4">
                  <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900">No matching questions in this filter</h3>
                    <p className="text-sm text-slate-500 max-w-md mx-auto">
                      Clear the search keyword or switch your filter back to All Questions to continue practicing.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setTopicFilter('ALL');
                      setPracticeFilter('all');
                    }}
                    className="px-4 py-2.5 rounded-lg bg-[#0B1526] hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
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
                    <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500 tabular-nums">
                          <span className="font-bold text-slate-900">
                            Question {currentIndex + 1} of {filteredQuestions.length}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>Paper #{currentQuestion.num}</span>
                          {currentQuestion.topic && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-blue-700 font-semibold">{currentQuestion.topic}</span>
                            </>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleBookmark(currentQuestion.id)}
                          aria-pressed={isBookmarked}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer min-h-[36px] ${
                            isBookmarked
                              ? 'bg-amber-50 border-amber-300 text-amber-800'
                              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                          }`}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500 text-amber-600' : ''}`} />
                          <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                        </button>
                      </div>

                      <h3 className="text-lg sm:text-xl font-semibold text-slate-900 leading-relaxed">
                        {currentQuestion.question}
                      </h3>

                      <div
                        className="space-y-2.5"
                        role="radiogroup"
                        aria-label={`Options for question ${currentQuestion.num}`}
                      >
                        {currentQuestion.options.map((opt, idx) => {
                          const isSelected = chosen === idx;
                          const isRightOption = idx === currentQuestion.correctIndex;

                          let containerStyle =
                            'bg-white border-slate-200 hover:border-blue-400 hover:bg-slate-50 text-slate-800';
                          let letterBadgeStyle =
                            'bg-slate-100 text-slate-700 border-slate-200';
                          let statusLabel: string | null = null;

                          if (isAnswered) {
                            if (isRightOption) {
                              containerStyle =
                                'bg-emerald-50/80 border-emerald-500 text-emerald-950';
                              letterBadgeStyle =
                                'bg-emerald-700 text-white border-emerald-700';
                              statusLabel = 'Correct Answer';
                            } else if (isSelected && !isRightOption) {
                              containerStyle =
                                'bg-rose-50/80 border-rose-500 text-rose-950';
                              letterBadgeStyle =
                                'bg-rose-700 text-white border-rose-700';
                              statusLabel = 'Your Answer (Incorrect)';
                            } else {
                              containerStyle =
                                'bg-slate-50/60 border-slate-200 text-slate-500';
                              letterBadgeStyle =
                                'bg-slate-100 text-slate-400 border-slate-200';
                            }
                          }

                          return (
                            <button
                              key={idx}
                              type="button"
                              role="radio"
                              aria-checked={isSelected}
                              onClick={() => handleSelectAnswer(currentQuestion.id, idx)}
                              className={`w-full min-h-[52px] p-4 rounded-xl border text-left transition-colors flex items-center justify-between gap-3 cursor-pointer ${containerStyle}`}
                            >
                              <div className="flex items-start gap-3.5 min-w-0">
                                <span
                                  className={`w-7 h-7 rounded-md border font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${letterBadgeStyle}`}
                                >
                                  {OPTION_LETTERS[idx]}
                                </span>
                                <span className="text-sm sm:text-base font-medium leading-snug break-words">
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
                                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                                  ) : (
                                    <XCircle className="w-4 h-4 shrink-0" />
                                  )}
                                  <span className="hidden sm:inline">{statusLabel}</span>
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      <div aria-live="polite">
                        {isAnswered && (
                          <div
                            className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm ${
                              isCorrect
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                                : 'bg-rose-50 border-rose-200 text-rose-950'
                            }`}
                          >
                            <div className="flex items-center gap-2 font-semibold">
                              {isCorrect ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                              ) : (
                                <XCircle className="w-4 h-4 text-rose-700 shrink-0" />
                              )}
                              <span>
                                {isCorrect
                                  ? `Correct! Option ${OPTION_LETTERS[currentQuestion.correctIndex]} is verified.`
                                  : `Incorrect — Correct option is ${OPTION_LETTERS[currentQuestion.correctIndex]}: ${currentQuestion.options[currentQuestion.correctIndex]}`}
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
                                Try Again
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          disabled={currentIndex <= 0}
                          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs sm:text-sm font-medium text-slate-700 cursor-pointer min-h-[44px]"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>Previous</span>
                        </button>

                        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                          <Keyboard className="w-3.5 h-3.5" />
                          <span>A–D / 1–4 Answer · ← → Navigate · F Bookmark</span>
                        </div>

                        <button
                          type="button"
                          disabled={currentIndex >= filteredQuestions.length - 1}
                          onClick={() =>
                            setCurrentIndex((i) => Math.min(filteredQuestions.length - 1, i + 1))
                          }
                          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#0B1526] hover:bg-blue-700 disabled:opacity-40 disabled:pointer-events-none text-xs sm:text-sm font-semibold text-white transition-colors cursor-pointer min-h-[44px]"
                        >
                          <span>Next Question</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>

            <aside className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">Question Navigator</h3>
                  <span className="text-xs font-mono font-semibold text-slate-500 tabular-nums">
                    {activeStats.answered}/{activeStats.total} Solved
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="font-mono text-base font-bold text-slate-900 tabular-nums">
                      {activeStats.completion}%
                    </div>
                    <div className="text-[11px] text-slate-500">Done</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                    <div className="font-mono text-base font-bold text-emerald-700 tabular-nums">
                      {activeStats.correct}
                    </div>
                    <div className="text-[11px] text-emerald-800">Correct</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200">
                    <div className="font-mono text-base font-bold text-rose-700 tabular-nums">
                      {activeStats.answered - activeStats.correct}
                    </div>
                    <div className="text-[11px] text-rose-800">Wrong</div>
                  </div>
                </div>

                {filteredQuestions.length > 0 && (
                  <div className="grid grid-cols-7 sm:grid-cols-8 lg:grid-cols-6 gap-1.5 max-h-80 overflow-y-auto pr-1">
                    {filteredQuestions.map((q, idx) => {
                      const ans = activeSetProgress.answers[q.id];
                      const isCurrent = idx === currentIndex;
                      const isBookmarked = activeSetProgress.bookmarks.includes(q.id);

                      let btnStyle = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';
                      if (ans !== undefined) {
                        btnStyle =
                          ans === q.correctIndex
                            ? 'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold'
                            : 'bg-rose-100 border-rose-300 text-rose-900 font-bold';
                      }
                      if (isCurrent) {
                        btnStyle += ' ring-2 ring-blue-600 border-blue-600';
                      }

                      return (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => setCurrentIndex(idx)}
                          title={`Question ${idx + 1} (Paper #${q.num})`}
                          className={`relative h-9 rounded-md border text-xs font-mono tabular-nums transition-colors cursor-pointer ${btnStyle}`}
                        >
                          {idx + 1}
                          {isBookmarked && (
                            <span
                              className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 border border-white"
                              aria-label="Bookmarked"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Correct</span>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Incorrect</span>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                    <span>Bookmarked</span>
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
              <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-10 max-w-3xl mx-auto space-y-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-blue-700">
                    <Timer className="w-4 h-4" />
                    <span>VU Exam Simulation Setup</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Start Timed {activeSet.courseCode} Mock Quiz
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Randomized questions drawn from {activeSet.courseCode} ({activeSet.termLabel}
                    {topicFilter !== 'ALL' ? ` · Topic: ${topicFilter}` : ''}). Answers are graded together after submission or when the timer ends.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500">
                    Number of Questions (45 seconds / MCQ)
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[15, 25, 40, activeSet.questions.length].map((count, i) => {
                      const available =
                        topicFilter === 'ALL'
                          ? activeSet.questions.length
                          : activeSet.questions.filter((q) => q.topic === topicFilter).length;
                      const actualCount = Math.min(count, available);
                      const label = i === 3 ? `Full Bank (${available})` : `${actualCount} MCQs`;
                      const mins = Math.round((actualCount * 45) / 60);

                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setExamSize(count)}
                          className={`p-3.5 rounded-lg border text-left transition-colors cursor-pointer ${
                            examSize === count
                              ? 'bg-[#0B1526] border-[#0B1526] text-white'
                              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                          }`}
                        >
                          <div className="font-mono text-sm font-bold tabular-nums">{label}</div>
                          <div
                            className={`text-[11px] mt-0.5 font-mono tabular-nums ${
                              examSize === count ? 'text-amber-300' : 'text-slate-500'
                            }`}
                          >
                            ~{mins} min timer
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100">
                  <div className="text-xs text-slate-500">
                    VU Passing Benchmark: Aim for <strong className="text-slate-800">70%+</strong> accuracy for distinction.
                  </div>
                  <button
                    type="button"
                    onClick={handleStartExam}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors cursor-pointer min-h-[48px]"
                  >
                    <Timer className="w-4 h-4" />
                    <span>Begin Timed Mock Exam</span>
                  </button>
                </div>
              </div>
            )}

            {examStatus === 'running' && examActiveQuestion && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-600 tabular-nums">
                      <span className="font-bold text-slate-900">
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
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer min-h-[36px] ${
                          examFlagged.has(examActiveQuestion.id)
                            ? 'bg-amber-50 border-amber-300 text-amber-800'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                        }`}
                      >
                        <Flag className="w-3.5 h-3.5" />
                        <span>{examFlagged.has(examActiveQuestion.id) ? 'Flagged' : 'Mark for Review'}</span>
                      </button>

                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-xs font-bold tabular-nums ${
                          examSecondsLeft <= 60
                            ? 'bg-rose-50 border-rose-300 text-rose-700'
                            : 'bg-[#0B1526] border-slate-800 text-amber-300'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatTimer(examSecondsLeft)}</span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 leading-relaxed">
                    {examActiveQuestion.question}
                  </h3>

                  <div className="space-y-2.5" role="radiogroup" aria-label="Exam answer choices">
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
                          className={`w-full min-h-[52px] p-4 rounded-xl border text-left transition-colors flex items-center gap-3.5 cursor-pointer ${
                            isChosen
                              ? 'bg-blue-50 border-blue-600 text-blue-950'
                              : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-800'
                          }`}
                        >
                          <span
                            className={`w-7 h-7 rounded-md border font-mono text-xs font-bold flex items-center justify-center shrink-0 ${
                              isChosen
                                ? 'bg-blue-600 border-blue-600 text-white'
                                : 'bg-slate-100 border-slate-200 text-slate-700'
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
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs sm:text-sm font-medium text-slate-700 cursor-pointer min-h-[44px]"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {examIndex < examQuestions.length - 1 ? (
                        <button
                          type="button"
                          onClick={() => setExamIndex((i) => i + 1)}
                          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#0B1526] hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold cursor-pointer min-h-[44px]"
                        >
                          <span>Save &amp; Next</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmSubmitExam(true)}
                          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold cursor-pointer min-h-[44px]"
                        >
                          <Check className="w-4 h-4" />
                          <span>Finish &amp; Grade Exam</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <aside className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-5 sm:p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-slate-900">Exam Sheet</h4>
                    <span className="text-xs font-mono font-semibold text-slate-500 tabular-nums">
                      {Object.keys(examAnswers).length}/{examQuestions.length} Answered
                    </span>
                  </div>

                  <div className="grid grid-cols-7 sm:grid-cols-8 lg:grid-cols-5 gap-1.5 max-h-72 overflow-y-auto pr-1">
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
                          className={`relative h-9 rounded-md border text-xs font-mono tabular-nums cursor-pointer ${cls}`}
                        >
                          {idx + 1}
                          {flagged && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 border border-white" />
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
                        className="w-full py-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm cursor-pointer transition-colors"
                      >
                        Submit Mock Exam
                      </button>
                    ) : (
                      <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 space-y-2.5 text-xs">
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
                            className="flex-1 py-2 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white font-semibold cursor-pointer"
                          >
                            Yes, Submit
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmSubmitExam(false)}
                            className="flex-1 py-2 rounded-md bg-white border border-slate-200 text-slate-700 font-medium cursor-pointer"
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
                <div className="bg-[#0B1526] text-white rounded-xl border border-slate-800 p-6 sm:p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-amber-300">
                        <Award className="w-4 h-4" />
                        <span>{activeSet.courseCode} Mock Exam Result</span>
                      </div>
                      <h3 className="text-3xl sm:text-4xl font-bold text-white tabular-nums">
                        {examScoreSummary.correct} / {examScoreSummary.total} ({examScoreSummary.pct}%)
                      </h3>
                      <p className="text-sm text-slate-300">
                        {examScoreSummary.pct >= 80
                          ? 'Strong mastery — well above distinction readiness.'
                          : examScoreSummary.pct >= 50
                          ? 'Passing score — review missed questions below to raise your accuracy.'
                          : 'Needs additional revision — review every missed concept below and retake.'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="px-4 py-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                        <div className="font-mono text-lg font-bold text-emerald-400 tabular-nums">
                          {examScoreSummary.correct}
                        </div>
                        <div className="text-[11px] text-slate-400">Correct</div>
                      </div>
                      <div className="px-4 py-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                        <div className="font-mono text-lg font-bold text-rose-400 tabular-nums">
                          {examScoreSummary.wrong + examScoreSummary.unanswered}
                        </div>
                        <div className="text-[11px] text-slate-400">Missed</div>
                      </div>
                      <div className="px-4 py-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                        <div className="font-mono text-lg font-bold text-sky-300 tabular-nums">
                          {formatTimer(examScoreSummary.usedSecs)}
                        </div>
                        <div className="text-[11px] text-slate-400">Time Used</div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setExamStatus('setup')}
                        className="px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm cursor-pointer"
                      >
                        Retake Mock Exam
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h4 className="text-lg font-bold text-slate-900">Detailed Answer Review</h4>
                  <div className="inline-flex p-1 rounded-lg bg-white border border-slate-200">
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
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer ${
                          examReviewFilter === tab.id
                            ? 'bg-[#0B1526] text-white'
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
                          className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 space-y-3"
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
                                <div key={oIdx} className={`p-3 rounded-lg border flex items-center gap-2 ${cls}`}>
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
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                {showAllAnswers ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showAllAnswers ? 'Hide All Answers (Self-Test)' : 'Reveal All Answers'}</span>
              </button>
            </div>

            {filteredQuestions.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-sm text-slate-500">
                No questions match your search or topic filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredQuestions.map((q) => {
                  const isRevealed = showAllAnswers || revealedIds.has(q.id);
                  return (
                    <div
                      key={q.id}
                      className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 flex flex-col justify-between"
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
                          {q.options.map((opt, idx) => {
                            const isRight = idx === q.correctIndex;
                            return (
                              <li
                                key={idx}
                                className={`p-2 rounded-lg border flex items-center justify-between gap-2 ${
                                  isRevealed && isRight
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold'
                                    : 'bg-slate-50/70 border-slate-100 text-slate-700'
                                }`}
                              >
                                <span>
                                  <span className="font-mono font-bold mr-1.5">{OPTION_LETTERS[idx]}.</span>
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
                          className="self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 cursor-pointer"
                        >
                          {isRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          <span>{isRevealed ? 'Hide Answer' : 'Show Answer'}</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* Cross-links to other dedicated Subject MCQ Pages */}
        <section className="pt-6 border-t border-slate-200 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Other Subject MCQ Pages</h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Open or copy a direct shareable link for any other subject.
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
              View All MCQ Subjects →
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {otherSets.map((set) => {
              const isCopied = copiedSetId === set.id;
              return (
                <div
                  key={set.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between gap-3"
                >
                  <a
                    href={`/mcqs/${set.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectSetId(set.id);
                    }}
                    className="min-w-0 group"
                  >
                    <div className="text-xs font-mono font-bold text-blue-700">
                      {set.courseCode} · {set.termLabel} ({set.questions.length})
                    </div>
                    <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 truncate">
                      {set.courseTitle}
                    </div>
                  </a>

                  <button
                    type="button"
                    onClick={(e) => handleCopyShareLink(set.id, e)}
                    aria-label={`Copy link for ${set.courseCode} ${set.termLabel}`}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium shrink-0 cursor-pointer ${
                      isCopied
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
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
