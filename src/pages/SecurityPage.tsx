import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Zap,
  EyeOff,
  FileCheck2,
  HeartHandshake,
  Server
} from 'lucide-react';

export const SecurityPage: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Editorial Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-blue-700">
          <ShieldCheck className="w-4 h-4" />
          <span>Student Trust &amp; Safety Guarantee</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          Privacy, Security &amp; Resource Safety
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          MIHORA STUDY LIBRARY is built with a student-first philosophy. We prioritize absolute user privacy, verified document safety, and zero commercial interruptions for every Virtual University student across Pakistan.
        </p>
      </div>

      {/* Trust Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-blue-700">
            <EyeOff className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 font-sans">Zero Personal Data Collection</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            We never require student account registration, LMS credentials, university roll numbers, or personal contact info. You can freely search, browse, practice MCQs, and download study files without tracking cookies or personal profile tracking.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-emerald-700">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 font-sans">Verified &amp; Clean Study Files</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            All 28,328 academic documents (handouts, solved past papers, MCQs, presentation slides) are verified educational files (PDF, DOCX, PPTX). No malicious executables, spam installers, or corrupted archives are ever served.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-amber-700">
            <Zap className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 font-sans">100% Ad-Free &amp; Direct Access</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Unlike informal blogs or ad-heavy download sites, MIHORA STUDY has zero popup ads, zero countdown timers, and zero monetization link shorteners. Every document opens or downloads directly with a single click.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
            <Server className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 font-sans">High-Availability Cloud CDN</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            During high-stress midterm and final examination seasons, our distributed edge infrastructure ensures the portal stays online 24/7 with fast load times across PTCL, Nayatel, StormFiber, Jazz, Zong, and overseas connections.
          </p>
        </div>
      </div>

      {/* Educational Commitments List */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 font-sans">
          <HeartHandshake className="w-5 h-5 text-blue-700" />
          <span>Our Operational Commitments to Students</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-1" />
            <div>
              <strong className="text-slate-900">Permanent Free Access:</strong> All study materials and interactive MCQs remain 100% free with no paywalls or subscription fees.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-1" />
            <div>
              <strong className="text-slate-900">Link Integrity Checks:</strong> Links are continuously maintained to prevent broken downloads before and during exams.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-1" />
            <div>
              <strong className="text-slate-900">Fast Mobile Performance:</strong> Lightweight interface engineered to run smoothly on smartphones and low-bandwidth connections.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-1" />
            <div>
              <strong className="text-slate-900">Independent Academic CSR:</strong> Supported by MIHORA TECH as a corporate social responsibility initiative for Pakistan.
            </div>
          </div>
        </div>
      </div>

      {/* Return to Library CTA */}
      <div className="p-6 sm:p-8 rounded-xl bg-[#0B1526] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white font-sans">Ready to start studying?</h2>
          <p className="text-sm text-slate-300">
            Search 28,328+ course handouts, midterm papers, final papers, and solved MCQs.
          </p>
        </div>
        <button
          type="button"
          onClick={onNavigateHome}
          className="px-5 py-2.5 rounded-lg bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm transition-colors cursor-pointer shrink-0 flex items-center gap-2"
        >
          <span>Return to Study Library</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
