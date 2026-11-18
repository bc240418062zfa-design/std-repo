import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Code, 
  Binary, 
  ChevronRight, 
  Search, 
  Copy, 
  Check, 
  Sparkles, 
  BookOpen,
  Calendar,
  Layers,
  ExternalLink,
  GraduationCap,
  HelpCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import coursesData from '../data/courses.json';
import { Course } from '../types';
import {
  ScrollReveal,
  StaggerGrid,
  StaggerItem,
  SpotlightCard,
  AnimatedButton,
  EASE_OUT_EXPO
} from '../components/MotionPrimitives';
import { CelestialOrbitalRings, CelestialStarfield, CelestialDivider } from '../components/CelestialBackdrop';

const allCourses = coursesData as Course[];

interface VUAssignmentGuidePageProps {
  onNavigateHome: () => void;
  onNavigateHandbook?: () => void;
  onSelectCourse?: (code: string) => void;
}

export const VUAssignmentGuidePage: React.FC<VUAssignmentGuidePageProps> = ({ 
  onNavigateHome, 
  onNavigateHandbook,
  onSelectCourse 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('ALL');
  const [studentIdInput, setStudentIdInput] = useState('BC230400000');
  const [selectedCourseForTemplate, setSelectedCourseForTemplate] = useState('CS201');
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  // Filtered Courses for Assignment 2026 Directory
  const filteredCourses = useMemo(() => {
    return allCourses.filter(c => {
      const matchesSearch = 
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFaculty = selectedFaculty === 'ALL' || c.faculty === selectedFaculty;
      return matchesSearch && matchesFaculty;
    });
  }, [searchQuery, selectedFaculty]);

  // Unique Faculties
  const faculties = useMemo(() => {
    const list = Array.from(new Set(allCourses.map(c => c.faculty))).sort();
    return ['ALL', ...list];
  }, []);

  const activeCourseObj = useMemo(() => {
    return allCourses.find(c => c.code === selectedCourseForTemplate) || { code: 'CS201', title: 'Introduction to Programming' };
  }, [selectedCourseForTemplate]);

  const sampleTemplate = `/*
 * ==============================================================================
 * VIRTUAL UNIVERSITY OF PAKISTAN — 2026 ASSIGNMENT SOLUTION
 * Course Code  : ${activeCourseObj.code} - ${activeCourseObj.title}
 * Student ID   : ${studentIdInput.trim() || 'BCXXXXXXXXX'}
 * Semester     : Spring 2026 / Fall 2026 (Latest Session)
 * Guidelines   : Turnitin Plagiarism Compliant (< 19% Similarity Ceiling)
 * Environment  : Dev-C++ 5.11 / MinGW GCC / Visual Studio
 * ==============================================================================
 */

#include <iostream>
using namespace std;

int main() {
    cout << "VU Student ID: ${studentIdInput.trim() || 'BCXXXXXXXXX'}" << endl;
    cout << "Course: ${activeCourseObj.code} - 2026 Assignment Solution" << endl;
    // Enter your unique logical implementation here
    return 0;
}`;

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(sampleTemplate);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <a href="/" onClick={(e) => { e.preventDefault(); onNavigateHome(); }} className="hover:text-blue-600 transition-colors">
          Home
        </a>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 font-semibold">VU Assignment Solutions 2026 &amp; GDB Guide</span>
      </nav>

      {/* Hero Header */}
      <ScrollReveal className="relative overflow-hidden rounded-3xl bg-studio-stage text-white p-6 sm:p-10 border border-slate-800/90 shadow-[0_26px_64px_-16px_rgba(4,8,20,0.68)]">
        <CelestialStarfield density={0.62} />
        <CelestialOrbitalRings compact />
        <div className="absolute inset-0 bg-academic-grid opacity-35 pointer-events-none" />
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none animate-float-slow" />
        <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/65 to-transparent" aria-hidden="true" />
        <div className="pointer-events-none absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" aria-hidden="true" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 text-emerald-300 text-xs font-mono font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>2026 ACTIVE ACADEMIC SESSION · SPRING &amp; FALL</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight" style={{ textWrap: 'balance' }}>
            VU Assignment Solutions 2026 &amp; GDB Strategy Guide
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Official MIHORA VU guide for scoring full marks in Virtual University assignments. Master the 24-hour grace period, Turnitin plagiarism limits (&lt; 19%), MathType equation pasting, and download study files for all 411 courses.
          </p>
        </div>
      </ScrollReveal>

      {/* Core Highlights Alert Bar */}
      <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StaggerItem>
          <SpotlightCard className="group h-full p-6 rounded-2xl card-celestial celestial-top-glint border">
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50/90 text-blue-600 flex items-center justify-center border border-blue-200/70 transition-transform duration-300 group-hover:scale-110">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-slate-900 font-bold text-sm">
                24-Hour Grace Period (0 Marks Deduction)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every VU regular assignment automatically includes a 24-hour grace window after the due date. Submissions during grace hours receive <strong>100% full credit</strong> with zero deductions.
              </p>
            </div>
          </SpotlightCard>
        </StaggerItem>

        <StaggerItem>
          <SpotlightCard spotlightColor="rgba(225, 29, 72, 0.08)" className="group h-full p-6 rounded-2xl card-celestial celestial-top-glint border">
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-rose-50/90 text-rose-600 flex items-center justify-center border border-rose-200/70 transition-transform duration-300 group-hover:scale-110">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-slate-900 font-bold text-sm">
                Turnitin Plagiarism Ceiling (&lt; 19%)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Directly copy-pasting solutions from YouTube or WhatsApp groups yields an automatic <strong>Zero (0)</strong>. Always alter variable names, comments, and structure.
              </p>
            </div>
          </SpotlightCard>
        </StaggerItem>

        <StaggerItem>
          <SpotlightCard spotlightColor="rgba(16, 185, 129, 0.10)" className="group h-full p-6 rounded-2xl card-celestial celestial-top-glint border">
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50/90 text-emerald-600 flex items-center justify-center border border-emerald-200/70 transition-transform duration-300 group-hover:scale-110">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-slate-900 font-bold text-sm">
                Allowed File Formats (.docx / .cpp)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Theoretical assignments must be uploaded as <strong>.docx / .doc</strong>. Programming courses require raw <strong>.cpp / .java / .py</strong> or zip archives.
              </p>
            </div>
          </SpotlightCard>
        </StaggerItem>
      </StaggerGrid>

      {/* Interactive Code Header Template Generator */}
      <ScrollReveal className="celestial-bezel rounded-3xl shadow-sm">
        <div className="card-celestial celestial-top-glint rounded-[23px] p-6 sm:p-10 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Code className="w-6 h-6 text-blue-600" />
              2026 Solution Header &amp; Comment Generator
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Add this official verification header to your source code or assignment document to prove original authorship.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={studentIdInput}
              onChange={(e) => setStudentIdInput(e.target.value.toUpperCase())}
              placeholder="e.g. BC230400000"
              className="celestial-input px-3 py-1.5 rounded-lg font-mono text-xs font-bold text-slate-900 uppercase"
            />
            <AnimatedButton
              type="button"
              onClick={handleCopyTemplate}
              className="btn-shimmer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-slate-950 to-blue-950 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold text-xs transition-all cursor-pointer whitespace-nowrap"
            >
              {copiedTemplate ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedTemplate ? 'Copied Header!' : 'Copy Template'}</span>
            </AnimatedButton>
          </div>
        </div>

        <pre className="p-5 rounded-2xl bg-studio-stage text-sky-100 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800/90 shadow-lg">
          <code>{sampleTemplate}</code>
        </pre>
        </div>
      </ScrollReveal>

      {/* Directory of All 411 Courses for 2026 Assignment Solutions */}
      <section className="card-celestial celestial-top-glint rounded-3xl border p-6 sm:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-emerald-600" />
              All 411 VU Courses Directory for 2026 Assignment Solutions
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Select any Virtual University course code to access lecture handouts, past papers, and assignment guidance.
            </p>
          </div>

          {/* Quick Filter Counts */}
          <div className="text-xs font-mono font-semibold text-slate-600 self-start sm:self-auto tabular-nums">
            Showing <strong className="text-slate-900">{filteredCourses.length}</strong> of {allCourses.length} Courses
          </div>
        </div>

        {/* Filter Surface */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search course code or title (e.g. CS101, MTH101, MGT101)..."
              className="celestial-input w-full pl-10 pr-4 py-2.5 rounded-xl text-slate-900 text-xs sm:text-sm font-medium"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              className="celestial-input w-full px-3 py-2.5 rounded-xl text-slate-800 text-xs font-semibold cursor-pointer"
            >
              {faculties.map((f) => (
                <option key={f} value={f}>
                  {f === 'ALL' ? 'All Faculties (411 Courses)' : f}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Courses Cards Grid */}
        <div className="bg-star-dust rounded-2xl p-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto border border-slate-200/70">
          {filteredCourses.map((c) => (
            <div 
              key={c.code}
              className="card-celestial celestial-top-glint p-4 rounded-2xl border hover:border-emerald-300 hover:-translate-y-0.5 transition-all duration-150 flex items-start justify-between gap-3 group"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 text-xs px-2 py-0.5 rounded-lg bg-slate-100/90 group-hover:bg-emerald-50 group-hover:text-emerald-800 transition-colors">
                    {c.code}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {c.fileCount} files
                  </span>
                  {selectedCourseForTemplate === c.code && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div className="text-xs font-bold text-slate-900 truncate" title={c.title}>
                  {c.title}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {c.faculty}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 shrink-0">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.94 }}
                  onClick={() => {
                    setSelectedCourseForTemplate(c.code);
                    window.scrollTo({ top: 380, behavior: 'smooth' });
                  }}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors border border-emerald-200/80 cursor-pointer text-center"
                  title={`Use ${c.code} in solution template`}
                >
                  Template
                </motion.button>
                <a
                  href={`/courses?course=${c.code}`}
                  onClick={(e) => {
                    if (onSelectCourse) {
                      e.preventDefault();
                      onSelectCourse(c.code);
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-700 hover:bg-blue-600 hover:text-white transition-colors border border-slate-200/80 text-center cursor-pointer"
                  title={`Open ${c.code} study files`}
                >
                  Files &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CelestialDivider />

      {/* Turnitin & GDB Strategy FAQ Section */}
      <ScrollReveal className="relative overflow-hidden bg-studio-stage text-white rounded-3xl p-6 sm:p-10 space-y-6 border border-slate-800/90 shadow-[0_26px_64px_-16px_rgba(4,8,20,0.68)]">
        <CelestialStarfield density={0.5} />
        <CelestialOrbitalRings compact />
        <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" aria-hidden="true" />
        <div className="absolute inset-0 bg-academic-grid opacity-30 pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-emerald-400" />
            2026 VU Assignment &amp; GDB High-Scoring FAQs
          </h2>
          <p className="text-slate-300 text-sm mt-1">
            Answers to common questions regarding Turnitin similarity detection, YouTube solution risks, and grading schemes.
          </p>
        </div>

        <StaggerGrid className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
          <StaggerItem className="p-5 rounded-2xl glass-panel-dark space-y-2">
            <h3 className="font-bold text-emerald-400 text-sm">
              Why do YouTube assignment solutions get 0 marks?
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              When thousands of students download and submit identical solutions posted on YouTube or Telegram, Turnitin flags the submission as 100% plagiarized. Instructors assign an automatic zero to all matching files. Always rewrite the solution logic and variable names yourself.
            </p>
          </StaggerItem>

          <StaggerItem className="p-5 rounded-2xl glass-panel-dark space-y-2">
            <h3 className="font-bold text-emerald-400 text-sm">
              How does the 24-hour grace period work on VULMS?
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              If an assignment is due on October 20 at 11:59 PM, the LMS submission link remains open until October 21 at 11:59 PM. Submissions during this 24-hour extension receive 100% of their earned marks with zero late penalties.
            </p>
          </StaggerItem>

          <StaggerItem className="p-5 rounded-2xl glass-panel-dark space-y-2">
            <h3 className="font-bold text-emerald-400 text-sm">
              How to paste MathType equations into MS Word for MTH assignments?
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              Copy equations from MathType using &ldquo;MathML 2.0&rdquo; or &ldquo;TeX/LaTeX&rdquo; clipboard format, or paste directly into MS Word&apos;s Equation Editor. Avoid uploading blurry mobile photos of hand-written math sheets.
            </p>
          </StaggerItem>

          <StaggerItem className="p-5 rounded-2xl glass-panel-dark space-y-2">
            <h3 className="font-bold text-emerald-400 text-sm">
              What is the key rule for scoring 5/5 in a GDB?
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              Strictly limit your response to 200–300 words. State your stance in the opening sentence, support it with 2 concise technical arguments, and never copy text from fellow students or ChatGPT without personalization.
            </p>
          </StaggerItem>
        </StaggerGrid>
      </ScrollReveal>
    </div>
  );
};
