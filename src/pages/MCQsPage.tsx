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
  Layers,
  ListChecks,
  Timer,
  Flag,
  FileText,
  Sparkles,
  Check,
  Filter,
  Keyboard
} from 'lucide-react';
import { mcqSets } from '../data/mcqs';
import { ExamTerm, McqQuestion, McqSet } from '../types';

interface MCQsPageProps {
  initialSetId?: string;
  onSelectCourseInLibrary?: (courseCode: string) => void;
}

type StudyMode = 'practice' | 'exam' | 'revision';
type PracticeFilter = 'all' | 'unanswered' | 'incorrect' | 'bookmarked';

interface SetProgress {
  // questionId -> selected option index (0..3)
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

export const MCQsPage: React.FC<MCQsPageProps> = ({
  initialSetId,
  onSelectCourseInLibrary
}) => {
  // Term & Subject Selection
  const [termFilter, setTermFilter] = useState<'all' | ExamTerm>('midterm');
  const [selectedSetId, setSelectedSetId] = useState<string>(
    initialSetId && mcqSets.some((s) => s.id === initialSetId)
      ? initialSetId
      : mcqSets[0].id
  );

  // Study Mode
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

  // Visible sets according to term tab
  const visibleSets = useMemo(() => {
    if (termFilter === 'all') return mcqSets;
    return mcqSets.filter((s) => s.term === termFilter);
  }, [termFilter]);

  // Ensure selectedSetId matches visibleSets when switching term filter
  useEffect(() => {
    if (!visibleSets.some((s) => s.id === selectedSetId) && visibleSets.length > 0) {
      setSelectedSetId(visibleSets[0].id);
    }
  }, [visibleSets, selectedSetId]);

  const activeSet: McqSet = useMemo(() => {
    return mcqSets.find((s) => s.id === selectedSetId) || mcqSets[0];
  }, [selectedSetId]);

  const activeSetProgress: SetProgress = useMemo(() => {
    return progress[activeSet.id] || { answers: {}, bookmarks: [] };
  }, [progress, activeSet.id]);

  // Reset sub-filters when changing subject set
  useEffect(() => {
    setTopicFilter('ALL');
    setSearchQuery('');
    setPracticeFilter('all');
    setCurrentIndex(0);
    setConfirmReset(false);
    setRevealedIds(new Set());
    if (examStatus === 'running') {
      setExamStatus('setup');
      setConfirmSubmitExam(false);
    }
  }, [activeSet.id]);

  // Filtered Questions for Practice & Revision
  const filteredQuestions = useMemo(() => {
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
      // Deterministic per shuffleSeed by calling shuffleArray inside memo
      return shuffleArray(list);
    }
    return list;
  }, [
    activeSet.questions,
    topicFilter,
    searchQuery,
    mode,
    practiceFilter,
    activeSetProgress.answers,
    activeSetProgress.bookmarks,
    shuffledOrder,
    shuffleSeed
  ]);

  // Keep currentIndex within bounds
  useEffect(() => {
    if (filteredQuestions.length === 0) {
      setCurrentIndex(0);
    } else if (currentIndex >= filteredQuestions.length) {
      setCurrentIndex(filteredQuestions.length - 1);
    }
  }, [filteredQuestions.length, currentIndex]);

  const currentQuestion: McqQuestion | undefined = filteredQuestions[currentIndex];

  // Aggregate summary stats for active set
  const activeStats = useMemo(() => {
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
    return { total, answered, correct, accuracy, completion, bookmarked: activeSetProgress.bookmarks.length };
  }, [activeSet.questions, activeSetProgress]);

  // Global summary across all sets in current term view
  const bankSummary = useMemo(() => {
    const midtermCount = mcqSets
      .filter((s) => s.term === 'midterm')
      .reduce((acc, s) => acc + s.questions.length, 0);
    const finalCount = mcqSets
      .filter((s) => s.term === 'finalterm')
      .reduce((acc, s) => acc + s.questions.length, 0);
    const totalSubjects = new Set(mcqSets.map((s) => s.courseCode)).size;
    return { midtermCount, finalCount, totalCount: midtermCount + finalCount, totalSubjects };
  }, []);

  // Handlers
  const handleSelectAnswer = useCallback(
    (questionId: string, optionIndex: number) => {
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
        }, 480);
      }
    },
    [activeSet.id, autoAdvance, filteredQuestions.length]
  );

  const handleToggleBookmark = useCallback(
    (questionId: string) => {
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
    [activeSet.id]
  );

  const handleResetSetProgress = () => {
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
    if (mode !== 'practice' || !currentQuestion) return;

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
    mode,
    currentQuestion,
    filteredQuestions.length,
    handleSelectAnswer,
    handleToggleBookmark
  ]);

  // Mock Exam Countdown Timer
  useEffect(() => {
    if (mode !== 'exam' || examStatus !== 'running') return;
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
  }, [mode, examStatus, examSecondsLeft]);

  const handleStartExam = () => {
    const pool =
      topicFilter === 'ALL'
        ? activeSet.questions
        : activeSet.questions.filter((q) => q.topic === topicFilter);
    const chosenCount = Math.min(examSize, pool.length);
    const picked = shuffleArray(pool).slice(0, chosenCount);
    const totalSecs = chosenCount * 45; // 45 seconds per VU MCQ

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
    return { correct, attempted, wrong: attempted - correct, unanswered: total - attempted, total, pct, usedSecs };
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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 1. Compact Oxford Dark Academic Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#060D1A] via-[#0A192F] to-[#0D203D] text-white border-b border-blue-900/40">
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1.1px,transparent_1.1px)] [background-size:28px_28px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex flex-wrap items-center gap-2 text-xs font-medium text-amber-200/95">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span className="font-mono font-bold uppercase tracking-wider">Interactive MCQ Practice Studio</span>
                <span className="text-slate-500" aria-hidden="true">·</span>
                <span className="font-mono text-slate-200 tabular-nums">{bankSummary.totalSubjects} Core Subjects</span>
                <span className="text-slate-500" aria-hidden="true">·</span>
                <span className="font-mono text-slate-200 tabular-nums">{bankSummary.totalCount} Verified MCQs</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight" style={{ textWrap: 'balance' }}>
                Interactive Exam MCQs{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-200 to-amber-200">
                  &amp; Timed Mock Quizzes
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                Practice verified Mid-Term MCQ banks with instant feedback, simulate timed Virtual University exams, or review fast flash-sheets across CS201, CS301, CS304, CS403, CS504, and CS601.
              </p>
            </div>

            {/* Term Switcher */}
            <div
              className="inline-flex p-1 rounded-xl bg-[#060D1A]/90 border border-slate-700/80 self-start lg:self-auto shrink-0"
              role="tablist"
              aria-label="Filter MCQ banks by exam term"
            >
              <button
                type="button"
                role="tab"
                aria-selected={termFilter === 'midterm'}
                onClick={() => setTermFilter('midterm')}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  termFilter === 'midterm'
                    ? 'bg-blue-600 text-white shadow-xs'
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
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  termFilter === 'finalterm'
                    ? 'bg-amber-600 text-white shadow-xs'
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
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  termFilter === 'all'
                    ? 'bg-slate-700 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                All ({bankSummary.totalCount})
              </button>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* 2. Subject Cards Selector */}
        <section aria-labelledby="mcq-subject-heading" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 id="mcq-subject-heading" className="text-xl sm:text-2xl font-bold text-slate-900">
                Select Subject MCQ Bank
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                {termFilter === 'midterm'
                  ? 'Showing 6 Mid-Term courses · Additional Final-Term & Mid-Term subjects will be added here progressively.'
                  : termFilter === 'finalterm'
                  ? 'Showing CS201 Final-Term bank · Switch to Mid-Term for CS201, CS301, CS304, CS403, CS504 & CS601.'
                  : 'Showing all available Mid-Term & Final-Term MCQ sets.'}
              </p>
            </div>

            {onSelectCourseInLibrary && (
              <button
                type="button"
                onClick={() => onSelectCourseInLibrary(activeSet.courseCode)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Open {activeSet.courseCode} Files in Library</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleSets.map((set) => {
              const isSelected = set.id === activeSet.id;
              const p = progress[set.id] || { answers: {}, bookmarks: [] };
              const answeredCount = Object.keys(p.answers).length;
              let correctCount = 0;
              for (const q of set.questions) {
                if (p.answers[q.id] === q.correctIndex) correctCount++;
              }
              const pct = Math.round((answeredCount / set.questions.length) * 100);
              const acc = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

              return (
                <button
                  key={set.id}
                  type="button"
                  onClick={() => setSelectedSetId(set.id)}
                  className={`text-left p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                    isSelected
                      ? 'bg-[#0A192F] text-white border-blue-600 shadow-lg ring-2 ring-blue-500/25'
                      : 'bg-white text-slate-900 border-slate-200 hover:border-blue-300 hover:shadow-sm'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`font-mono text-sm font-bold tracking-tight ${
                          isSelected ? 'text-amber-300' : 'text-blue-700'
                        }`}
                      >
                        {set.courseCode}
                      </span>
                      <span
                        className={`text-[11px] font-mono font-semibold tabular-nums ${
                          isSelected ? 'text-slate-300' : 'text-slate-500'
                        }`}
                      >
                        {set.termLabel} · {set.questions.length} MCQs
                      </span>
                    </div>

                    <h3
                      className={`text-base sm:text-lg font-bold leading-snug ${
                        isSelected ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {set.courseTitle}
                    </h3>

                    <p
                      className={`text-xs leading-relaxed line-clamp-2 ${
                        isSelected ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      {set.description}
                    </p>
                  </div>

                  {/* Single clean progress indicator */}
                  <div className="space-y-1.5 pt-1">
                    <div
                      className={`flex items-center justify-between text-[11px] font-mono tabular-nums ${
                        isSelected ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      <span>
                        {answeredCount}/{set.questions.length} practiced
                      </span>
                      <span>
                        {answeredCount > 0 ? `${acc}% accuracy` : 'Not started'}
                      </span>
                    </div>
                    <div
                      className={`h-1.5 w-full rounded-full overflow-hidden ${
                        isSelected ? 'bg-slate-800' : 'bg-slate-100'
                      }`}
                    >
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isSelected ? 'bg-amber-400' : 'bg-blue-600'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. Active Studio Workspace Header & Mode Bar */}
        <section className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-semibold text-slate-500">
                <span className="text-blue-700 font-bold">{activeSet.courseCode}</span>
                <span aria-hidden="true">·</span>
                <span className="text-amber-700 font-bold">{activeSet.termLabel}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{activeStats.total} Questions</span>
                {activeStats.answered > 0 && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-700 font-bold tabular-nums">
                      {activeStats.correct}/{activeStats.answered} Correct ({activeStats.accuracy}%)
                    </span>
                  </>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                {activeSet.courseTitle} — MCQ Studio
              </h2>
            </div>

            {/* Study Mode Selector Tabs */}
            <div
              className="inline-flex flex-wrap p-1 rounded-xl bg-slate-100 border border-slate-200 self-start lg:self-auto"
              role="tablist"
              aria-label="Study mode"
            >
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'practice'}
                onClick={() => setMode('practice')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer min-h-[40px] ${
                  mode === 'practice'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Practice Mode</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'exam'}
                onClick={() => setMode('exam')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer min-h-[40px] ${
                  mode === 'exam'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Timer className="w-3.5 h-3.5" />
                <span>Timed Mock Exam</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'revision'}
                onClick={() => setMode('revision')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer min-h-[40px] ${
                  mode === 'revision'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ListChecks className="w-3.5 h-3.5" />
                <span>Quick Revision</span>
              </button>
            </div>
          </div>

          {/* Controls Toolbar (Shared Topic/Search when not mid-exam) */}
          {!(mode === 'exam' && examStatus === 'running') && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* Search inside MCQs */}
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
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  aria-label="Search questions"
                />
              </div>

              {/* Topic Filter (if topics exist) or Status Filter */}
              <div className="md:col-span-4 flex items-center gap-2">
                {activeSet.topics.length > 0 ? (
                  <select
                    value={topicFilter}
                    onChange={(e) => {
                      setTopicFilter(e.target.value);
                      setCurrentIndex(0);
                    }}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-600 cursor-pointer"
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
                    className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-600 cursor-pointer"
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

              {/* Action Controls */}
              <div className="md:col-span-3 flex flex-wrap items-center justify-start md:justify-end gap-2">
                {mode === 'practice' && (
                  <button
                    type="button"
                    onClick={() => {
                      setShuffledOrder((s) => !s);
                      setShuffleSeed((n) => n + 1);
                      setCurrentIndex(0);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer min-h-[40px] ${
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
                        className="px-2.5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer min-h-[40px]"
                      >
                        Confirm Reset
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmReset(false)}
                        className="px-2.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer min-h-[40px]"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmReset(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-700 hover:text-rose-700 transition-colors cursor-pointer min-h-[40px]"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  )
                ) : null}
              </div>
            </div>
          )}

          {/* Practice secondary status filter row when course ALSO has topics */}
          {mode === 'practice' && activeSet.topics.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase mr-1 flex items-center gap-1">
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
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                      practiceFilter === f.id
                        ? 'bg-blue-50 border-blue-300 text-blue-700'
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

        {/* 4A. MODE 1: INTERACTIVE PRACTICE MODE */}
        {mode === 'practice' && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left/Main Stage (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {!currentQuestion ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-4">
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
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
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
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                      {/* Question Header */}
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
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer min-h-[36px] ${
                            isBookmarked
                              ? 'bg-amber-50 border-amber-300 text-amber-800'
                              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                          }`}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500 text-amber-600' : ''}`} />
                          <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                        </button>
                      </div>

                      {/* Question Prompt */}
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">
                        {currentQuestion.question}
                      </h3>

                      {/* 4 Interactive Option Cards */}
                      <div
                        className="space-y-3"
                        role="radiogroup"
                        aria-label={`Options for question ${currentQuestion.num}`}
                      >
                        {currentQuestion.options.map((opt, idx) => {
                          const isSelected = chosen === idx;
                          const isRightOption = idx === currentQuestion.correctIndex;

                          let containerStyle =
                            'bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-slate-800';
                          let letterBadgeStyle =
                            'bg-slate-100 text-slate-700 border-slate-200';
                          let statusLabel: string | null = null;

                          if (isAnswered) {
                            if (isRightOption) {
                              containerStyle =
                                'bg-emerald-50/80 border-emerald-500 text-emerald-950 ring-1 ring-emerald-500/20';
                              letterBadgeStyle =
                                'bg-emerald-600 text-white border-emerald-600';
                              statusLabel = 'Correct Answer';
                            } else if (isSelected && !isRightOption) {
                              containerStyle =
                                'bg-rose-50/80 border-rose-500 text-rose-950 ring-1 ring-rose-500/20';
                              letterBadgeStyle =
                                'bg-rose-600 text-white border-rose-600';
                              statusLabel = 'Your Answer (Incorrect)';
                            } else {
                              containerStyle =
                                'bg-slate-50/70 border-slate-200 text-slate-500 opacity-80';
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
                              className={`w-full min-h-[52px] p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${containerStyle}`}
                            >
                              <div className="flex items-start gap-3.5 min-w-0">
                                <span
                                  className={`w-7 h-7 rounded-lg border font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${letterBadgeStyle}`}
                                >
                                  {OPTION_LETTERS[idx]}
                                </span>
                                <span className="text-sm sm:text-base font-medium leading-snug break-words">
                                  {opt}
                                </span>
                              </div>

                              {isAnswered && (isRightOption || isSelected) && (
                                <span
                                  className={`inline-flex items-center gap-1.5 text-xs font-bold shrink-0 ${
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

                      {/* Dual-coded Live Feedback Banner */}
                      <div aria-live="polite">
                        {isAnswered && (
                          <div
                            className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm ${
                              isCorrect
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                                : 'bg-rose-50 border-rose-200 text-rose-900'
                            }`}
                          >
                            <div className="flex items-center gap-2 font-bold">
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
                                className="text-xs font-bold underline underline-offset-2 text-rose-800 hover:text-rose-950 cursor-pointer self-start sm:self-auto shrink-0"
                              >
                                Try Again
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Footer Prev / Next Bar */}
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          disabled={currentIndex <= 0}
                          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs sm:text-sm font-semibold text-slate-700 cursor-pointer min-h-[44px]"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>Previous</span>
                        </button>

                        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                          <Keyboard className="w-3.5 h-3.5" />
                          <span>Keys A–D / 1–4 · ← → Navigate · F Bookmark</span>
                        </div>

                        <button
                          type="button"
                          disabled={currentIndex >= filteredQuestions.length - 1}
                          onClick={() =>
                            setCurrentIndex((i) => Math.min(filteredQuestions.length - 1, i + 1))
                          }
                          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0A192F] hover:bg-blue-700 disabled:opacity-40 disabled:pointer-events-none text-xs sm:text-sm font-bold text-white transition-colors cursor-pointer min-h-[44px]"
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

            {/* Right Sidebar: Progress & Question Navigator Grid (4 cols) */}
            <aside className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">Question Navigator</h3>
                  <span className="text-xs font-mono font-bold text-slate-500 tabular-nums">
                    {activeStats.answered}/{activeStats.total} Solved
                  </span>
                </div>

                {/* Live Accuracy Stats Grid */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="font-mono text-base font-bold text-slate-900 tabular-nums">
                      {activeStats.completion}%
                    </div>
                    <div className="text-[11px] text-slate-500">Done</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80">
                    <div className="font-mono text-base font-bold text-emerald-700 tabular-nums">
                      {activeStats.correct}
                    </div>
                    <div className="text-[11px] text-emerald-800">Correct</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200/80">
                    <div className="font-mono text-base font-bold text-rose-700 tabular-nums">
                      {activeStats.answered - activeStats.correct}
                    </div>
                    <div className="text-[11px] text-rose-800">Wrong</div>
                  </div>
                </div>

                {/* Clickable Question Map */}
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
                          className={`relative h-9 rounded-lg border text-xs font-mono tabular-nums transition-all cursor-pointer ${btnStyle}`}
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

                {/* Legend */}
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

        {/* 4B. MODE 2: TIMED MOCK EXAM SIMULATION */}
        {mode === 'exam' && (
          <section>
            {examStatus === 'setup' && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs max-w-3xl mx-auto space-y-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-blue-700">
                    <Timer className="w-4 h-4" />
                    <span>VU Exam Simulation Setup</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    Start Timed {activeSet.courseCode} Mock Quiz
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Randomized questions drawn from {activeSet.courseCode} ({activeSet.termLabel}
                    {topicFilter !== 'ALL' ? ` · Topic: ${topicFilter}` : ''}). Answers are graded together after you submit or when the countdown reaches zero.
                  </p>
                </div>

                {/* Quiz Size Selector */}
                <div className="space-y-2">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
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
                          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                            examSize === count
                              ? 'bg-[#0A192F] border-blue-600 text-white shadow-sm'
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

                <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100">
                  <div className="text-xs text-slate-500">
                    VU Passing Benchmark reminder: Aim for <strong className="text-slate-800">70%+</strong> accuracy for distinction.
                  </div>
                  <button
                    type="button"
                    onClick={handleStartExam}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all cursor-pointer min-h-[48px]"
                  >
                    <Timer className="w-4 h-4" />
                    <span>Begin Timed Mock Exam</span>
                  </button>
                </div>
              </div>
            )}

            {examStatus === 'running' && examActiveQuestion && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Active Question Card */}
                <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
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
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer min-h-[36px] ${
                          examFlagged.has(examActiveQuestion.id)
                            ? 'bg-amber-50 border-amber-300 text-amber-800'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                        }`}
                      >
                        <Flag className="w-3.5 h-3.5" />
                        <span>{examFlagged.has(examActiveQuestion.id) ? 'Flagged' : 'Mark for Review'}</span>
                      </button>

                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-xs font-bold tabular-nums ${
                          examSecondsLeft <= 60
                            ? 'bg-rose-50 border-rose-300 text-rose-700'
                            : 'bg-[#0A192F] border-slate-800 text-amber-300'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatTimer(examSecondsLeft)}</span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">
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
                          className={`w-full min-h-[52px] p-4 rounded-2xl border text-left transition-all flex items-center gap-3.5 cursor-pointer ${
                            isChosen
                              ? 'bg-blue-50 border-blue-600 text-blue-950 ring-1 ring-blue-600/20'
                              : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-800'
                          }`}
                        >
                          <span
                            className={`w-7 h-7 rounded-lg border font-mono text-xs font-bold flex items-center justify-center shrink-0 ${
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
                          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0A192F] hover:bg-blue-700 text-white text-xs sm:text-sm font-bold cursor-pointer min-h-[44px]"
                        >
                          <span>Save &amp; Next</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmSubmitExam(true)}
                          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold cursor-pointer min-h-[44px]"
                        >
                          <Check className="w-4 h-4" />
                          <span>Finish &amp; Grade Exam</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Exam Navigator & Submit Panel */}
                <aside className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-slate-900">Exam Sheet</h4>
                    <span className="text-xs font-mono font-bold text-slate-500 tabular-nums">
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
                          className={`relative h-9 rounded-lg border text-xs font-mono tabular-nums cursor-pointer ${cls}`}
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
                        className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm cursor-pointer transition-colors"
                      >
                        Submit Mock Exam
                      </button>
                    ) : (
                      <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2.5 text-xs">
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
                            className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                          >
                            Yes, Submit
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmSubmitExam(false)}
                            className="flex-1 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold cursor-pointer"
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
                {/* Score Summary Card */}
                <div className="bg-[#0A192F] text-white rounded-3xl border border-blue-900/50 p-6 sm:p-8 shadow-lg">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                        <Award className="w-4 h-4" />
                        <span>{activeSet.courseCode} Mock Exam Result</span>
                      </div>
                      <h3 className="text-3xl sm:text-4xl font-bold text-white tabular-nums">
                        {examScoreSummary.correct} / {examScoreSummary.total} ({examScoreSummary.pct}%)
                      </h3>
                      <p className="text-sm text-slate-300">
                        {examScoreSummary.pct >= 80
                          ? 'Excellent mastery — well above VU distinction readiness.'
                          : examScoreSummary.pct >= 50
                          ? 'Good passing score — review the missed questions below to push above 80%.'
                          : 'Needs more practice — review every missed concept below and retake.'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="px-4 py-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
                        <div className="font-mono text-lg font-bold text-emerald-400 tabular-nums">
                          {examScoreSummary.correct}
                        </div>
                        <div className="text-[11px] text-slate-400">Correct</div>
                      </div>
                      <div className="px-4 py-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
                        <div className="font-mono text-lg font-bold text-rose-400 tabular-nums">
                          {examScoreSummary.wrong + examScoreSummary.unanswered}
                        </div>
                        <div className="text-[11px] text-slate-400">Missed</div>
                      </div>
                      <div className="px-4 py-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
                        <div className="font-mono text-lg font-bold text-sky-300 tabular-nums">
                          {formatTimer(examScoreSummary.usedSecs)}
                        </div>
                        <div className="text-[11px] text-slate-400">Time Used</div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setExamStatus('setup')}
                        className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm cursor-pointer"
                      >
                        Retake New Mock Exam
                      </button>
                    </div>
                  </div>
                </div>

                {/* Review Sheet Filter */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h4 className="text-lg font-bold text-slate-900">Detailed Answer Review</h4>
                  <div className="inline-flex p-1 rounded-xl bg-white border border-slate-200">
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
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                          examReviewFilter === tab.id
                            ? 'bg-blue-600 text-white'
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
                          className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                            <span className="text-slate-500 font-bold">
                              Review #{idx + 1} · Paper Q{q.num}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 font-bold ${
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

                          <p className="text-sm sm:text-base font-bold text-slate-900">
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

        {/* 4C. MODE 3: QUICK REVISION SHEET */}
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
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
              >
                {showAllAnswers ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showAllAnswers ? 'Hide All Answers (Self-Test)' : 'Reveal All Answers'}</span>
              </button>
            </div>

            {filteredQuestions.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center text-sm text-slate-500">
                No questions match your search or topic filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredQuestions.map((q) => {
                  const isRevealed = showAllAnswers || revealedIds.has(q.id);
                  return (
                    <div
                      key={q.id}
                      className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2 text-xs font-mono text-slate-500">
                          <span className="font-bold text-blue-700">Q{q.num}</span>
                          {q.topic && <span className="truncate text-slate-500">{q.topic}</span>}
                        </div>
                        <p className="text-sm font-bold text-slate-900 leading-snug">
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
      </main>
    </div>
  );
};
