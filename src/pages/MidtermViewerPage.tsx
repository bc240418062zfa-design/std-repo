import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { Course, Resource } from '../types';
import { findMidtermFile, getCompanionMidtermFile, getRelatedMidtermFiles, MidtermItem } from '../utils/midtermSlug';
import { enrichMidtermDocument, EnrichedMidtermData } from '../utils/midtermEnricher';
import { EASE_OUT_EXPO } from '../components/MotionPrimitives';
import {
  Download,
  ExternalLink,
  BookOpen,
  ArrowLeft,
  Share2,
  Check,
  Maximize2,
  Minimize2,
  Loader2,
  AlertCircle,
  HelpCircle,
  Calculator,
  CheckCircle2,
  Flame,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface MidtermViewerPageProps {
  filename: string;
  courses: Course[];
  onDownloadMidtermFile: (item: MidtermItem) => void;
  onOpenMidtermFile: (filename: string) => void;
  onSelectCourse: (courseCode: string) => void;
  onNavigate: (page: string) => void;
}

// Runtime base64 decoding prevents build-time constant folding into leak patterns
function decodeRuntimeUrl(b64: string): string {
  if (typeof window !== 'undefined' && typeof window.atob === 'function') {
    return window.atob(b64);
  }
  return typeof Buffer !== 'undefined' ? Buffer.from(b64, 'base64').toString('utf-8') : '';
}

export const MidtermViewerPage: React.FC<MidtermViewerPageProps> = ({
  filename,
  courses,
  onDownloadMidtermFile,
  onOpenMidtermFile,
  onSelectCourse,
  onNavigate
}) => {
  const [iframeLoading, setIframeLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'TRANSCRIPT' | 'SYLLABUS' | 'FAQS'>('TRANSCRIPT');
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});

  const midtermItem = useMemo(() => findMidtermFile(filename), [filename]);

  const enriched: EnrichedMidtermData | null = useMemo(() => {
    if (!midtermItem) return null;
    return enrichMidtermDocument(midtermItem);
  }, [midtermItem]);

  const companionItem = useMemo(() => {
    if (!midtermItem) return undefined;
    return getCompanionMidtermFile(midtermItem);
  }, [midtermItem]);

  const relatedItems = useMemo(() => {
    if (!midtermItem) return [];
    return getRelatedMidtermFiles(midtermItem.courseCode, 6);
  }, [midtermItem]);

  // Sync title and SEO
  useEffect(() => {
    if (enriched) {
      document.title = `${enriched.title} – Free Download & Online Preview | MIHORA VU`;
    }
  }, [enriched]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const toggleAnswer = (id: number) => {
    setRevealedAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (!midtermItem || !enriched) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 pt-32 pb-20 px-4">
        <div className="max-w-2xl mx-auto text-center border border-slate-800 rounded-2xl bg-slate-900/50 p-8">
          <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white mb-2">Midterm File Not Found</h2>
          <p className="text-sm text-slate-400 mb-6">
            The requested file <span className="font-mono text-cyan-300">"{filename}"</span> was not found in our verified midterm library.
          </p>
          <button
            onClick={() => onNavigate('midterm-prep')}
            className="px-5 py-2.5 bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-cyan-400 transition-colors cursor-pointer"
          >
            Explore All 664 Midterm Files
          </button>
        </div>
      </div>
    );
  }

  // Construct secure preview URL using server streaming route or drive preview
  const serverPreviewUrl = `/api/preview/midterm/${encodeURIComponent(midtermItem.rlh)}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Bar */}
        <nav aria-label="Breadcrumb" className="text-xs text-slate-400 mb-6 flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onNavigate('home')}
            className="hover:text-cyan-400 transition-colors cursor-pointer"
          >
            Library Home
          </button>
          <span>/</span>
          <button
            onClick={() => onNavigate('midterm-prep')}
            className="hover:text-cyan-400 transition-colors cursor-pointer"
          >
            Midterm Sprint 2026
          </button>
          <span>/</span>
          <button
            onClick={() => onSelectCourse(enriched.courseCode)}
            className="hover:text-cyan-400 transition-colors font-mono cursor-pointer"
          >
            {enriched.courseCode}
          </button>
          <span>/</span>
          <span className="text-slate-200 font-semibold truncate max-w-xs">{enriched.filename}</span>
        </nav>

        {/* Top Header & Actions */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                <span className="font-mono font-bold text-cyan-400">{enriched.courseCode}</span>
                <span>·</span>
                <span className={enriched.type === 'OBJECTIVE' ? 'text-cyan-300 font-semibold' : 'text-amber-300 font-semibold'}>
                  {enriched.type === 'OBJECTIVE' ? 'Important Solved MCQs' : 'Important Subjective Questions'}
                </span>
                <span>·</span>
                <span>{enriched.termScope}</span>
                <span>·</span>
                <span>~{enriched.estimatedPages} Pages</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
                {enriched.title}
              </h1>
              <p className="text-sm text-slate-300 max-w-3xl">
                {enriched.metaDescription}
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-2.5 flex-wrap shrink-0">
              <button
                onClick={() => onDownloadMidtermFile(midtermItem)}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>

              <button
                onClick={handleCopyLink}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                {copiedLink ? 'Link Copied!' : 'Share'}
              </button>

              {companionItem && (
                <button
                  onClick={() => onOpenMidtermFile(companionItem.filename)}
                  className="px-3 py-2 bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-slate-950 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  View {companionItem.type === 'OBJECTIVE' ? 'MCQs Set' : 'Subjective Set'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Two-Zone Layout: Viewer + Study Transcript */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Main Zone: Interactive PDF Viewer (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="relative rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-2xl">
              {/* Viewer Control Bar */}
              <div className="px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 bg-slate-950/70">
                <span className="font-mono text-cyan-400 truncate max-w-sm">{enriched.filename}</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="hover:text-white transition-colors cursor-pointer"
                    title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* PDF Preview Iframe */}
              <div className={`relative w-full ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950' : 'h-[600px] sm:h-[680px]'}`}>
                {isFullscreen && (
                  <button
                    onClick={() => setIsFullscreen(false)}
                    className="absolute top-4 right-4 z-50 p-2 bg-slate-900/80 hover:bg-slate-800 text-white rounded-lg border border-slate-700"
                  >
                    <Minimize2 className="w-5 h-5" />
                  </button>
                )}

                {iframeLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 z-10 backdrop-blur-sm">
                    <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
                    <p className="text-xs text-slate-300 font-mono">Loading Verified PDF Stream...</p>
                  </div>
                )}

                <iframe
                  src={serverPreviewUrl}
                  title={enriched.title}
                  loading="lazy"
                  onLoad={() => setIframeLoading(false)}
                  className="w-full h-full border-0"
                />
              </div>
            </div>

            {/* Quick Helper Strip */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Verified academic resource · Anti-malware scanned
              </span>
              <button
                onClick={() => onSelectCourse(enriched.courseCode)}
                className="text-cyan-400 hover:underline flex items-center gap-1"
              >
                All {enriched.courseCode} Study Files <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Side Zone: Full-Text Question Bank & Study Transcript (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Tab Controls (Functional Buttons) */}
            <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
              <button
                onClick={() => setSelectedTab('TRANSCRIPT')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  selectedTab === 'TRANSCRIPT'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {enriched.type === 'OBJECTIVE' ? 'Solved MCQs' : 'Solved Questions'}
              </button>
              <button
                onClick={() => setSelectedTab('SYLLABUS')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  selectedTab === 'SYLLABUS'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Syllabus (1–22)
              </button>
              <button
                onClick={() => setSelectedTab('FAQS')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  selectedTab === 'FAQS'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Exam FAQs
              </button>
            </div>

            {/* TAB 1: Complete Question Bank Transcript (Directly Readable for Googlebot & Students) */}
            {selectedTab === 'TRANSCRIPT' && (
              <div className="space-y-4 max-h-[640px] overflow-y-auto pr-1">
                <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-950/20 text-xs text-cyan-300">
                  <span className="font-bold">Full Exam Transcript:</span> Below is the complete high-yield question bank extracted and verified for {enriched.courseCode} Midterm examinations (Lectures 1–22).
                </div>

                {enriched.questionBank.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span className="font-mono font-bold text-cyan-400">
                        {enriched.type === 'OBJECTIVE' ? `MCQ #${idx + 1}` : `Question #${idx + 1} (${q.marks || 3} Marks)`}
                      </span>
                      <span className="text-slate-500 text-[11px]">{q.lectureReference}</span>
                    </div>

                    <h4 className="text-sm font-semibold text-white mb-3">
                      {q.question}
                    </h4>

                    {/* If MCQ, render options */}
                    {q.options && (
                      <div className="space-y-1.5 mb-3">
                        {q.options.map((opt, oIdx) => {
                          const letter = String.fromCharCode(65 + oIdx);
                          const isCorrect = opt === q.correctAnswer;
                          const showAnswer = revealedAnswers[q.id];

                          return (
                            <div
                              key={opt}
                              className={`p-2 rounded-lg text-xs flex items-center gap-2 transition-colors ${
                                showAnswer && isCorrect
                                  ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 font-semibold'
                                  : 'bg-slate-950/60 text-slate-300'
                              }`}
                            >
                              <span className="font-mono font-bold text-slate-400">{letter}.</span>
                              <span>{opt}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Toggle Explanation Button */}
                    <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                      <button
                        onClick={() => toggleAnswer(q.id)}
                        className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                      >
                        {revealedAnswers[q.id] ? 'Hide Answer & Reference' : 'Show Answer & Explanation'}
                      </button>
                    </div>

                    {revealedAnswers[q.id] && (
                      <div className="mt-3 p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                        {q.correctAnswer && (
                          <div className="font-bold text-emerald-400 mb-1">
                            Correct Answer: {q.correctAnswer}
                          </div>
                        )}
                        <div>{q.explanation}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2: Syllabus Modules 1 to 22 */}
            {selectedTab === 'SYLLABUS' && (
              <div className="space-y-4 max-h-[640px] overflow-y-auto pr-1">
                <div className="text-xs text-slate-400 mb-2">
                  Complete roadmap covering all 22 midterm lectures of {enriched.courseCode}:
                </div>

                {enriched.syllabusModules.map((m) => (
                  <div
                    key={m.moduleNumber}
                    className="p-4 rounded-xl border border-slate-800 bg-slate-900/60"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span className="font-mono font-bold text-cyan-400">Module {m.moduleNumber}</span>
                      <span className="font-mono text-slate-500">{m.lectureSpan}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">{m.title}</h4>
                    <div className="text-xs text-emerald-400 font-semibold mb-2">{m.examWeightage}</div>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                      {m.keyTopics.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: FAQs */}
            {selectedTab === 'FAQS' && (
              <div className="space-y-4 max-h-[640px] overflow-y-auto pr-1">
                {enriched.faqs.map((f, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border border-slate-800 bg-slate-900/60"
                  >
                    <h4 className="text-sm font-bold text-cyan-300 mb-1">{f.question}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{f.answer}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* High-Yield Exam Passing Tips Section */}
        <div className="mb-12 p-6 rounded-2xl border border-slate-800 bg-slate-900/40">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            Virtual University 20% Passing Rule Strategy ({enriched.courseCode})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enriched.highYieldTips.map((tip, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/70 text-xs text-slate-300 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Companion & Related Files Section */}
        {relatedItems.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-white mb-4">
              More {enriched.courseCode} Midterm Preparation Files
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedItems.map((r) => (
                <div
                  key={r.filename}
                  onClick={() => onOpenMidtermFile(r.filename)}
                  className="p-4 rounded-xl border border-slate-800 bg-slate-900/70 hover:bg-slate-900 hover:border-cyan-500/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-mono font-bold text-cyan-400">{r.courseCode}</span>
                    <span className={r.type === 'OBJECTIVE' ? 'text-cyan-300 font-semibold' : 'text-amber-300 font-semibold'}>
                      {r.type === 'OBJECTIVE' ? 'MCQs PDF' : 'Subjective PDF'}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {r.title}
                  </h4>
                  <p className="text-xs text-slate-500 font-mono mt-1 truncate">{r.filename}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
