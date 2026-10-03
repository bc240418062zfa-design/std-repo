import React from 'react';
import { 
  HelpCircle, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  ArrowRight,
  BookOpen
} from 'lucide-react';

interface DisclaimerPageProps {
  onNavigateHome: () => void;
  onNavigateCourses: () => void;
}

export const DisclaimerPage: React.FC<DisclaimerPageProps> = ({ onNavigateHome, onNavigateCourses }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
          <HelpCircle className="w-4 h-4" />
          <span>LEGAL & ACADEMIC POLICIES</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Academic Notice & Disclaimer
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Please review the operational principles, intellectual property attribution, and fair educational use terms governing the MIHORA STUDY LIBRARY.
        </p>
      </div>

      {/* Main Notice Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-amber-50 border border-amber-200 text-amber-950 space-y-4 shadow-xs">
        <div className="flex items-center gap-2.5 font-bold text-amber-900 text-base">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>Independent Student Welfare Approach</span>
        </div>
        <p className="text-xs sm:text-sm leading-relaxed text-amber-900/90">
          <strong>MIHORA STUDY LIBRARY (<a href="https://study.mihora.tech" className="underline font-semibold">study.mihora.tech</a>)</strong> is an independent digital educational portal engineered by <strong>MIHORA TECH</strong>. This portal is <strong>not</strong> officially associated with, sponsored by, or an official product of the Virtual University of Pakistan (VU).
        </p>
      </div>

      {/* Detailed Sections */}
      <div className="space-y-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <div className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            1. Intellectual Property & Copyright Ownership
          </h2>
          <p>
            All course syllabus outlines, video lecture transcript references, official handouts, and institutional exam formats are and remain the exclusive intellectual property of their respective educators, course directors, and the Virtual University of Pakistan.
          </p>
          <p>
            Study notes, solved past papers, and objective question compilations curated within this library were authored by student community contributors (including distinguished alumni contributors such as Moaaz, Waqar Siddhu, and other senior student peers) who originally distributed them publicly for peer assistance.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            2. Fair Educational Use Doctrine
          </h2>
          <p>
            This portal is provided strictly for non-commercial, non-profit academic assistance. It operates under fair educational use principles to assist remote, working, and distance-learning students in Pakistan in accessing necessary study materials without financial, technical, or geographical barriers.
          </p>
          <p>
            No user fees, subscriptions, or paywalls are charged. MIHORA TECH does not sell, license, or monetize any academic documents housed in this directory.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            3. Accuracy & Verification Disclaimer
          </h2>
          <p>
            While MIHORA TECH utilizes automated verification scripts to ensure link integrity and eliminate malware or spam, students are advised to cross-reference past paper solutions with their official handouts and video lectures. Solution keys compiled by student peers may contain occasional typographical or human errors.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            4. Takedown & Copyright Notice Procedure
          </h2>
          <p>
            If you are an educator, author, or copyright holder and believe any specific document should be removed or updated, please contact our administrative team via <a href="https://www.mihora.tech" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline">www.mihora.tech</a>. We honor valid academic takedown requests expeditiously.
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
        <button
          type="button"
          onClick={onNavigateCourses}
          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors cursor-pointer"
        >
          Browse All Courses
        </button>
        <button
          type="button"
          onClick={onNavigateHome}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span>Return to Study Library</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
