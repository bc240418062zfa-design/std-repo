import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  EyeOff, 
  FileCheck2, 
  HeartHandshake,
  Server,
  Cpu,
  Terminal,
  ShieldAlert
} from 'lucide-react';

export const SecurityPage: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>STUDENT TRUST & SAFETY GUARANTEE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Privacy, Security & Resource Safety
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          MIHORA STUDY LIBRARY is built with a student-first philosophy. We prioritize absolute user privacy, verified document safety, zero commercial interruptions, and advanced anti-tamper security for every Virtual University student across Pakistan.
        </p>
      </div>

      {/* Trust Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pillar 1 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <EyeOff className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Zero Personal Data Collection</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            We never require student account registration, LMS credentials, university roll numbers, or personal contact info. You can freely search, browse, and study without any tracking cookies or personal profile tracking.
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Verified & Clean Study Files</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            All 28,328 academic documents (handouts, solved past papers, MCQs, presentation slides) are verified educational files (PDF, DOCX, PPTX). No malicious executables, spam installers, or corrupted archives are ever served.
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
            <Zap className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">100% Ad-Free & Direct Access</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Unlike informal blogs or ad-heavy download sites, MIHORA STUDY has zero popup ads, zero countdown timers, and zero monetization link shorteners. Every document downloads directly with a single click.
          </p>
        </div>

        {/* Pillar 4 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Server className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">High-Availability Cloud CDN</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            During high-stress midterm and final examination seasons, our distributed edge infrastructure ensures the portal stays online 24/7 with fast load times across PTCL, Nayatel, StormFiber, Jazz, Zong, and overseas connections.
          </p>
        </div>
      </div>

      {/* Advanced Anti-DevTools & Resource Protection Section */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 text-white space-y-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[10px] font-mono uppercase tracking-wider">
              <span>disable-devtool Integration</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Multi-Vector Inspection Deterrence Architecture
            </h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          To prevent unauthorized automated harvesting, link scraping, and credential interception, MIHORA STUDY LIBRARY integrates the full capabilities of the industry-standard <strong>disable-devtool</strong> anti-tamper framework across the entire web application.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-1.5 text-blue-400 font-semibold text-[11px]">
              <Terminal className="w-3.5 h-3.5" />
              <span>Multi-Detector Array</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Monitors 8 distinct vectors including RegToString, DefineId, DateToString, FuncToString, and Debugger timing probes.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
              <Lock className="w-3.5 h-3.5" />
              <span>Shortcut Deterrence</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Intercepts F12, Ctrl+Shift+I/J/C, Cmd+Option+I/J/C, Ctrl+U (source view), and right-click context menu calls.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-1.5 text-purple-400 font-semibold text-[11px]">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Continuous Console Flush</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Runs active console log wiping (<code className="text-purple-300">clearLog</code>) to prevent scraping of transient memory objects.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-[11px]">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Student Session Resume</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Legitimate students triggering inspection mode can resume their reading session with a single click.
            </p>
          </div>
        </div>
      </div>

      {/* Educational Commitments List */}
      <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <HeartHandshake className="w-5 h-5 text-blue-600" />
          <span>Our Operational Commitments to Students</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-600">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800">Permanent Free Access:</strong> All study materials remain 100% free with no premium paywalls or subscription fees.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800">Anti-Spam Link Integrity:</strong> Links are continuously monitored to prevent broken downloads before and during exams.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800">No Mobile Intrusions:</strong> Optimized lightweight interface that runs smoothly on low-end smartphones and low-bandwidth connections.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800">Independent Academic CSR:</strong> Supported by MIHORA TECH as a corporate social responsibility initiative for Pakistan.
            </div>
          </div>
        </div>
      </div>

      {/* Return to Library CTA */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-md">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-white">Ready to start studying?</h2>
          <p className="text-xs sm:text-sm text-blue-200">
            Search 28,328+ course handouts, midterm papers, final papers, and solved MCQs.
          </p>
        </div>
        <button
          type="button"
          onClick={onNavigateHome}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-blue-50 text-blue-950 font-bold text-xs sm:text-sm transition-colors cursor-pointer shrink-0 flex items-center gap-2 shadow-xs"
        >
          <span>Return to Study Library</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
