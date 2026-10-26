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
import coursesData from '../data/courses.json';
import { Course } from '../types';

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
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 sm:p-10 border border-slate-800 shadow-xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-emerald-600/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
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
      </div>

      {/* Core Highlights Alert Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-sm transition-all space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-slate-900 font-bold text-sm">
            24-Hour Grace Period (0 Marks Deduction)
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every VU regular assignment automatically includes a 24-hour grace window after the due date. Submissions during grace hours receive <strong>100% full credit</strong> with zero deductions.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-sm transition-all space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h3 className="text-slate-900 font-bold text-sm">
            Turnitin Plagiarism Ceiling (&lt; 19%)
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Directly copy-pasting solutions from YouTube or WhatsApp groups yields an automatic <strong>Zero (0)</strong>. Always alter variable names, comments, and structure.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-sm transition-all space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="text-slate-900 font-bold text-sm">
            Allowed File Formats (.docx / .cpp)
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Theoretical assignments must be uploaded as <strong>.docx / .doc</strong>. Programming courses require raw <strong>.cpp / .java / .py</strong> or zip archives.
          </p>
        </div>
      </div>

      {/* Interactive Code Header Template Generator */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
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
              className="px-3 py-1.5 rounded-lg border border-slate-200 font-mono text-xs font-bold text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleCopyTemplate}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              {copiedTemplate ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedTemplate ? 'Copied Header!' : 'Copy Template'}</span>
            </button>
          </div>
        </div>

        <pre className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
          <code>{sampleTemplate}</code>
        </pre>
      </section>

      {/* Directory of All 411 Courses for 2026 Assignment Solutions */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
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
          <div className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full self-start sm:self-auto">
            Showing {filteredCourses.length} of {allCourses.length} Courses
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
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto p-1">
          {filteredCourses.map((c) => (
            <div 
              key={c.code}
              className="p-4 rounded-2xl border border-slate-200/90 bg-white hover:border-emerald-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 flex items-start justify-between gap-3 group"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 text-xs px-2 py-0.5 rounded-lg bg-slate-100 group-hover:bg-emerald-50 group-hover:text-emerald-800 transition-colors">
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
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCourseForTemplate(c.code);
                    window.scrollTo({ top: 380, behavior: 'smooth' });
                  }}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors border border-emerald-200/80 cursor-pointer text-center"
                  title={`Use ${c.code} in solution template`}
                >
                  Template
                </button>
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

      {/* Turnitin & GDB Strategy FAQ Section */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 space-y-6">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-emerald-400" />
            2026 VU Assignment &amp; GDB High-Scoring FAQs
          </h2>
          <p className="text-slate-300 text-sm mt-1">
            Answers to common questions regarding Turnitin similarity detection, YouTube solution risks, and grading schemes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
            <h3 className="font-bold text-emerald-400 text-sm">
              Why do YouTube assignment solutions get 0 marks?
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              When thousands of students download and submit identical solutions posted on YouTube or Telegram, Turnitin flags the submission as 100% plagiarized. Instructors assign an automatic zero to all matching files. Always rewrite the solution logic and variable names yourself.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
            <h3 className="font-bold text-emerald-400 text-sm">
              How does the 24-hour grace period work on VULMS?
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              If an assignment is due on October 20 at 11:59 PM, the LMS submission link remains open until October 21 at 11:59 PM. Submissions during this 24-hour extension receive 100% of their earned marks with zero late penalties.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
            <h3 className="font-bold text-emerald-400 text-sm">
              How to paste MathType equations into MS Word for MTH assignments?
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              Copy equations from MathType using "MathML 2.0" or "TeX/LaTeX" clipboard format, or paste directly into MS Word's Equation Editor. Avoid uploading blurry mobile photos of hand-written math sheets.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
            <h3 className="font-bold text-emerald-400 text-sm">
              What is the key rule for scoring 5/5 in a GDB?
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              Strictly limit your response to 200–300 words. State your stance in the opening sentence, support it with 2 concise technical arguments, and never copy text from fellow students or ChatGPT without personalization.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
