import React, { useState, useEffect, useMemo, useId } from 'react';
import { 
  FileText, 
  Search, 
  BookOpen, 
  Calendar, 
  Clock, 
  User, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  HelpCircle, 
  Lock, 
  Check, 
  Copy, 
  ExternalLink,
  MessageSquareQuote,
  ListFilter,
  GraduationCap
} from 'lucide-react';
import { reviewsIndex, fetchCourseReviews, ReviewsResponse } from '../utils/reviewsClient';
import { CourseReviewSummary, ReviewItem } from '../types';

interface PastPapersPageProps {
  initialCourse?: string;
  onSelectCourseInLibrary?: (courseCode: string) => void;
}

export const PastPapersPage: React.FC<PastPapersPageProps> = ({
  initialCourse = 'CS101',
  onSelectCourseInLibrary
}) => {
  // Course Selection State
  const [selectedCourseCode, setSelectedCourseCode] = useState<string>(
    initialCourse.toUpperCase()
  );
  const [courseSearch, setCourseSearch] = useState<string>('');
  const [facultyFilter, setFacultyFilter] = useState<string>('ALL');

  // Inside-course search & pagination
  const [keywordFilter, setKeywordFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [reviewsData, setReviewsData] = useState<ReviewsResponse | null>(null);

  // Copied indicator state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Available faculties for filtering
  const faculties = useMemo(() => {
    const set = new Set<string>();
    reviewsIndex.forEach((c) => {
      if (c.faculty) set.add(c.faculty);
    });
    return Array.from(set).sort();
  }, []);

  // Filtered course catalog for picker
  const filteredCourses = useMemo(() => {
    const q = courseSearch.toLowerCase().trim();
    return reviewsIndex.filter((c) => {
      const matchesSearch =
        !q ||
        c.code.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        (c.sampleTopics || []).some((t) => t.toLowerCase().includes(q));

      const matchesFaculty =
        facultyFilter === 'ALL' || c.faculty === facultyFilter;

      return matchesSearch && matchesFaculty;
    });
  }, [courseSearch, facultyFilter]);

  // Selected course summary
  const selectedCourseSummary = useMemo(() => {
    return (
      reviewsIndex.find((c) => c.code === selectedCourseCode) || {
        code: selectedCourseCode,
        title: `${selectedCourseCode} Course Papers`,
        faculty: 'Academic Studies',
        reviewCount: 0,
        latestDate: '2026',
        sampleTopics: []
      }
    );
  }, [selectedCourseCode]);

  // Fetch reviews whenever selected course, page, or search keyword changes
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchCourseReviews(selectedCourseCode, currentPage, 10, keywordFilter).then(
      (res) => {
        if (isMounted) {
          setReviewsData(res);
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
    };
  }, [selectedCourseCode, currentPage, keywordFilter]);

  // Handle course switch
  const handleSelectCourse = (code: string) => {
    setSelectedCourseCode(code);
    setCurrentPage(1);
    setKeywordFilter('');
  };

  // Handle copy review text with ethical watermark
  const handleCopyReview = (review: ReviewItem) => {
    const textToCopy = `[VU 2026 Midterm Exam Review - ${selectedCourseCode}]\nAuthor: ${review.sharedBy}\nDate: ${review.date} (${review.time})\n\nStudent Experience:\n"${review.message}"\n\nKey Questions / Topics:\n${(review.keyPoints || []).map((k) => `• ${k}`).join('\n')}\n\n— Verified via MIHORA STUDY LIBRARY (https://study.mihora.tech/past-papers)`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(review.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Curated quick course buttons
  const quickCourses = ['CS101', 'CS201', 'CS301', 'MTH101', 'ENG201', 'STA301', 'ISL202', 'PAK301', 'MGT101', 'ACC501'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* 1. Header & Anti-Scraping Protection Banner */}
      <div className="space-y-4 max-w-4xl">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span>2026 MIDTERM & EXAM PAPERS ARCHIVE</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-mono font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>265 VU COURSES · 1,780+ EXAM REVIEWS</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-mono">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Anti-Scraping Stream Active</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          2026 Past Papers & Exam Reviews
        </h1>

        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          Ground-truth exam reviews, authentic memory-recalled questions, and subjective topics directly reported by Virtual University students across 265 courses.
        </p>

        {/* Security & Isolation Disclaimer */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-start gap-3 shadow-2xs">
          <Lock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Data Security & Anti-Dumping Architecture:</strong> This archive enforces single-stream rate limiting and paginated access. Automated mass scraping and bulk extraction are restricted to preserve server availability and source integrity.
          </p>
        </div>
      </div>

      {/* 2. Course Selection & Quick Shortcuts Cockpit */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Select Virtual University Course ({reviewsIndex.length} Available)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose a course to load verified student exam memories, key questions, and topic distributions.
            </p>
          </div>

          {/* Quick Course Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase mr-1">Popular:</span>
            {quickCourses.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => handleSelectCourse(c)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border ${
                  selectedCourseCode === c
                    ? 'bg-blue-600 border-blue-600 text-white shadow-2xs'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Search by Course Code or Keyword */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={courseSearch}
              onChange={(e) => setCourseSearch(e.target.value)}
              placeholder="Filter course (e.g. CS101, MTH, English)..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Faculty Filter Dropdown */}
          <div className="relative">
            <select
              value={facultyFilter}
              onChange={(e) => setFacultyFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-600 cursor-pointer appearance-none"
            >
              <option value="ALL">All Academic Disciplines ({reviewsIndex.length})</option>
              {faculties.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* Active Course Selector Dropdown */}
          <div className="relative">
            <select
              value={selectedCourseCode}
              onChange={(e) => handleSelectCourse(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-blue-300 bg-blue-50/50 text-blue-900 font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-600 cursor-pointer appearance-none"
            >
              {filteredCourses.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.title} ({c.reviewCount} reviews)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3. Active Course Status & Topics Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl sm:text-2xl font-black text-blue-700">
                {selectedCourseSummary.code}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                {selectedCourseSummary.faculty}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold tabular-nums">
                {selectedCourseSummary.reviewCount} Verified Reviews
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              {selectedCourseSummary.title}
            </h3>
          </div>

          {/* Jump to Course Files in Library */}
          {onSelectCourseInLibrary && (
            <button
              type="button"
              onClick={() => onSelectCourseInLibrary(selectedCourseSummary.code)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer border border-slate-200 shadow-2xs self-start sm:self-auto"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Browse All {selectedCourseSummary.code} Files in Library</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          )}
        </div>

        {/* Sample Exam Topics Chips */}
        {selectedCourseSummary.sampleTopics && selectedCourseSummary.sampleTopics.length > 0 && (
          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
              High-Frequency Exam Topics Mentioned By Students:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedCourseSummary.sampleTopics.map((topic, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setKeywordFilter(topic)}
                  className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-800 text-xs transition-colors cursor-pointer"
                >
                  #{topic}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* In-Course Keyword Filter Field */}
        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={keywordFilter}
              onChange={(e) => {
                setKeywordFilter(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={`Search within ${selectedCourseCode} reviews (e.g. MS Word, loop, MCQs, formula)...`}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            />
          </div>
          {keywordFilter && (
            <button
              type="button"
              onClick={() => {
                setKeywordFilter('');
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* 4. Student Reviews Stream Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MessageSquareQuote className="w-4 h-4 text-blue-600" />
            <span>
              Verified Student Exam Memories & Questions
              {reviewsData && ` (${reviewsData.totalReviews} Total)`}
            </span>
          </h3>

          {reviewsData && reviewsData.totalPages > 1 && (
            <span className="text-xs font-mono text-slate-500">
              Page {reviewsData.page} of {reviewsData.totalPages}
            </span>
          )}
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
            <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-mono">Loading verified exam reviews...</p>
          </div>
        )}

        {/* Error message */}
        {!loading && reviewsData && !reviewsData.ok && (
          <div className="p-6 bg-red-50 rounded-2xl border border-red-200 text-red-800 text-xs space-y-1">
            <strong>Notice:</strong> {reviewsData.error || 'Failed to retrieve reviews.'}
          </div>
        )}

        {/* Zero Results State */}
        {!loading && reviewsData && reviewsData.ok && reviewsData.reviews.length === 0 && (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
            <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">No matching student reviews found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No reviews match &ldquo;{keywordFilter}&rdquo; in {selectedCourseCode}. Try a different topic or clear the search.
            </p>
          </div>
        )}

        {/* Review Cards Grid */}
        {!loading && reviewsData && reviewsData.ok && reviewsData.reviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviewsData.reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-4 hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                {/* Review Header */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-mono font-bold text-[11px] border border-blue-100">
                        Review #{rev.reviewNum}
                      </span>
                      <span className="font-semibold text-slate-800 truncate max-w-[130px] sm:max-w-[180px]">
                        {rev.sharedBy}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px] shrink-0">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{rev.date}</span>
                      </span>
                      {rev.time && (
                        <span className="flex items-center gap-1 hidden sm:inline-flex">
                          <Clock className="w-3 h-3" />
                          <span>{rev.time}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Student Message / Exam Experience */}
                  {rev.message && (
                    <p className="text-xs text-slate-700 leading-relaxed italic bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                      &ldquo;{rev.message}&rdquo;
                    </p>
                  )}

                  {/* Key Points / Questions Remembered */}
                  {rev.keyPoints && rev.keyPoints.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                        Questions & Exam Points:
                      </span>
                      <ul className="space-y-1.5">
                        {rev.keyPoints.map((point, pIdx) => (
                          <li
                            key={pIdx}
                            className="text-xs text-slate-800 flex items-start gap-2 bg-slate-50/50 p-2 rounded-lg border border-slate-100/80 leading-snug"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Footer Controls & Copy Button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span className="text-[10px] font-mono text-slate-400">
                    Verified Student Submission
                  </span>

                  <button
                    type="button"
                    onClick={() => handleCopyReview(rev)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                    title="Copy question text to clipboard"
                  >
                    {copiedId === rev.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Questions</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 5. Pagination Bar (Anti-Dumping Single Stream Navigation) */}
        {!loading && reviewsData && reviewsData.totalPages > 1 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
            <span className="text-xs text-slate-500 font-mono">
              Showing reviews {(reviewsData.page - 1) * 10 + 1} to{' '}
              {Math.min(reviewsData.page * 10, reviewsData.totalReviews)} of{' '}
              {reviewsData.totalReviews} total
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={reviewsData.page <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-semibold text-slate-700 transition-colors cursor-pointer shadow-2xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, reviewsData.totalPages) }, (_, i) => {
                  let pageNum = i + 1;
                  if (reviewsData.totalPages > 5 && reviewsData.page > 3) {
                    pageNum = reviewsData.page - 3 + i;
                    if (pageNum > reviewsData.totalPages) pageNum = reviewsData.totalPages - (4 - i);
                  }
                  if (pageNum <= 0) return null;

                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-xl text-xs font-mono font-bold transition-colors cursor-pointer ${
                        reviewsData.page === pageNum
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                disabled={reviewsData.page >= reviewsData.totalPages}
                onClick={() => setCurrentPage((p) => Math.min(reviewsData.totalPages, p + 1))}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-semibold text-slate-700 transition-colors cursor-pointer shadow-2xs"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
