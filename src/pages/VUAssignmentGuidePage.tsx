import React from 'react';
import { 
  FileText, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Code, 
  Binary, 
  ChevronRight,
  HelpCircle,
  Copy,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface VUAssignmentGuidePageProps {
  onNavigateHome: () => void;
  onNavigateHandbook?: () => void;
}

export const VUAssignmentGuidePage: React.FC<VUAssignmentGuidePageProps> = ({ onNavigateHome, onNavigateHandbook }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <a href="/" onClick={(e) => { e.preventDefault(); onNavigateHome(); }} className="hover:text-blue-600 transition-colors">
          Home
        </a>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 font-semibold">VU Assignment &amp; GDB Formatting Guide</span>
      </nav>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 sm:p-10 border border-slate-800 shadow-xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-emerald-600/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium">
            <FileText className="w-3.5 h-3.5" />
            <span>SUBMISSION STANDARDS • PLAGIARISM DEFENSE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            VU Assignment &amp; GDB Solutions Formatting Guide
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Essential guidelines on the 24-hour assignment grace period, Turnitin similarity index (&lt; 19%), MathType equation pasting, Dev-C++ code formatting, and GDB scoring rubrics.
          </p>
        </div>
      </div>

      {/* Core Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Grace Period */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">24-Hour Assignment Grace Period</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Virtual University provides an automatic <strong>24-hour grace window</strong> following the published due date. Submitting during this window carries <strong>zero mark penalty</strong>.
          </p>
          <div className="pt-2 text-[11px] font-semibold text-blue-700">
            Note: Grace period does NOT apply to Quizzes or GDBs.
          </div>
        </div>

        {/* 2. Turnitin Plagiarism */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Turnitin Plagiarism (&lt; 19% Limit)</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            VU instructors run submissions through Turnitin. Any assignment with similarity &gt; 19% or direct matches with public YouTube solutions receives an automatic <strong>Zero (0) marks</strong>.
          </p>
          <div className="pt-2 text-[11px] font-semibold text-rose-700">
            Always rephrase concepts in your own words.
          </div>
        </div>

        {/* 3. File Formats */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Allowed File Formats (.docx / .cpp)</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Standard theoretical assignments must be uploaded as <strong>.docx / .doc</strong>. Programming courses (CS201, CS301) specify either <strong>.cpp</strong> source code or zipped projects.
          </p>
          <div className="pt-2 text-[11px] font-semibold text-emerald-700">
            Never upload corrupted files or raw PDF unless instructed.
          </div>
        </div>
      </div>

      {/* MathType & Code Formatting Deep-Dive */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Technical Formatting: Mathematics &amp; Programming Assignments
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Prevent symbol corruption and code execution errors during instructor evaluation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
          {/* MathType Equations */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Binary className="w-5 h-5 text-blue-600" />
              MathType Formula Guidelines (MTH Courses)
            </h3>
            <p>
              When typing calculus, matrices, or discrete mathematics in MTH101, MTH202, or MTH302:
            </p>
            <ul className="space-y-2 list-disc pl-4 text-xs">
              <li>Always copy formulas from MathType as <strong>Encapsulated PostScript / MathML</strong> or paste directly into MS Word equations.</li>
              <li>Avoid taking blurry mobile camera photos of hand-written pages unless explicitly permitted.</li>
              <li>Ensure Greek symbols (&alpha;, &beta;, &theta;, &lambda;) and integral signs render cleanly on all standard fonts.</li>
            </ul>
          </div>

          {/* Dev-C++ & Programming Code */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Code className="w-5 h-5 text-emerald-600" />
              Programming Code Submissions (CS Courses)
            </h3>
            <p>
              When submitting code for CS201, CS301, CS304, or CS506:
            </p>
            <ul className="space-y-2 list-disc pl-4 text-xs">
              <li>Include your <strong>VU Student ID</strong> in a comment header at the top of every code file.</li>
              <li>Provide clean, readable indentation with descriptive variable and function names.</li>
              <li>Attach clear screenshots of the compiled command-line / GUI console window showing your output with your Student ID visible in the console.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* GDB (Graded Discussion Board) Master Strategy */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 space-y-6">
        <div className="max-w-2xl space-y-2">
          <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
            HIGH-YIELD 5-MARK ACTIVITY
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            GDB (Graded Discussion Board) Scoring Strategy
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            GDBs carry 5% of your final semester grade. Follow these strict rules to secure 5/5 marks:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
            <strong className="text-emerald-400 text-sm block">1. Strict 200–300 Words</strong>
            <p className="text-slate-300 text-xs leading-relaxed">
              Instructors penalize overly verbose essays. Be concise, direct, and address the specific core problem within 3 to 4 well-structured paragraphs.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
            <strong className="text-emerald-400 text-sm block">2. Clear Personal Stance</strong>
            <p className="text-slate-300 text-xs leading-relaxed">
              GDBs are argumentative. State your thesis clearly in the first sentence ("I agree / disagree with the statement because...") and justify with 2 logical points.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
            <strong className="text-emerald-400 text-sm block">3. Zero Copy-Paste Warning</strong>
            <p className="text-slate-300 text-xs leading-relaxed">
              VULMS detects identical GDB posts across students. If your post matches another student's post or a website, both receive 0 marks instantly.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
