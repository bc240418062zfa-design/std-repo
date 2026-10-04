import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Sliders, 
  BookOpen, 
  ChevronRight,
  Sparkles,
  TrendingUp,
  Award,
  Layers,
  Info,
  RotateCcw
} from 'lucide-react';
import { generatePassingReportPDF, SimulatorData } from '../utils/pdfGenerator';

interface CoursePreset {
  code: string;
  title: string;
  scheme: 'standard' | 'assignHeavy' | 'noGdb';
}

const POPULAR_COURSES: CoursePreset[] = [
  { code: 'CS101', title: 'Introduction to Computing', scheme: 'standard' },
  { code: 'CS201', title: 'Introduction to Programming', scheme: 'standard' },
  { code: 'CS301', title: 'Data Structures', scheme: 'standard' },
  { code: 'CS504', title: 'Software Engineering - I', scheme: 'standard' },
  { code: 'MTH101', title: 'Calculus And Analytical Geometry', scheme: 'standard' },
  { code: 'MTH302', title: 'Business Mathematics & Statistics', scheme: 'standard' },
  { code: 'ENG101', title: 'English Comprehension', scheme: 'noGdb' },
  { code: 'MGT211', title: 'Introduction to Business', scheme: 'standard' },
  { code: 'PAK301', title: 'Pakistan Studies', scheme: 'noGdb' },
  { code: 'ISL202', title: 'Islamic Studies', scheme: 'noGdb' }
];

const SCHEMES = {
  standard: {
    name: 'Standard VU Scheme (25% Mid / 55% Final)',
    quizWeight: 5,
    assignWeight: 10,
    gdbWeight: 5,
    midWeight: 25,
    finalWeight: 55
  },
  assignHeavy: {
    name: 'Assignment Heavy Scheme (25% Mid / 45% Final)',
    quizWeight: 10,
    assignWeight: 15,
    gdbWeight: 5,
    midWeight: 25,
    finalWeight: 45
  },
  noGdb: {
    name: 'No GDB Scheme (30% Mid / 50% Final)',
    quizWeight: 10,
    assignWeight: 10,
    gdbWeight: 0,
    midWeight: 30,
    finalWeight: 50
  }
};

interface PassingSimulatorPageProps {
  onSelectCourse: (courseCode: string) => void;
}

export const PassingSimulatorPage: React.FC<PassingSimulatorPageProps> = ({ onSelectCourse }) => {
  // Course State
  const [selectedCourseCode, setSelectedCourseCode] = useState('CS101');
  const [customCourseTitle, setCustomCourseTitle] = useState('Introduction to Computing');
  const [schemeKey, setSchemeKey] = useState<'standard' | 'assignHeavy' | 'noGdb' | 'custom'>('standard');

  // Custom Weightage toggles
  const [customWeights, setCustomWeights] = useState({
    quiz: 5,
    assign: 10,
    gdb: 5,
    mid: 25,
    final: 55
  });

  // Marks Inputs
  const [quizMarks, setQuizMarks] = useState({ obtained: 25, total: 30 });
  const [assignMarks, setAssignMarks] = useState({ obtained: 42, total: 50 });
  const [gdbMarks, setGdbMarks] = useState({ obtained: 4, total: 5 });
  const [midMarks, setMidMarks] = useState({ obtained: 26, total: 40 });
  const [finalTotalMarks, setFinalTotalMarks] = useState(60);

  // Active Weights Calculation
  const activeWeights = useMemo(() => {
    if (schemeKey === 'custom') {
      return {
        quiz: customWeights.quiz,
        assign: customWeights.assign,
        gdb: customWeights.gdb,
        mid: customWeights.mid,
        final: customWeights.final
      };
    }
    const s = SCHEMES[schemeKey];
    return {
      quiz: s.quizWeight,
      assign: s.assignWeight,
      gdb: s.gdbWeight,
      mid: s.midWeight,
      final: s.finalWeight
    };
  }, [schemeKey, customWeights]);

  // Handle Preset Course Selection
  const handleSelectPreset = (p: CoursePreset) => {
    setSelectedCourseCode(p.code);
    setCustomCourseTitle(p.title);
    setSchemeKey(p.scheme);
  };

  // Calculations
  const calculations = useMemo(() => {
    const qRate = quizMarks.total > 0 ? quizMarks.obtained / quizMarks.total : 0;
    const qContrib = qRate * activeWeights.quiz;

    const aRate = assignMarks.total > 0 ? assignMarks.obtained / assignMarks.total : 0;
    const aContrib = aRate * activeWeights.assign;

    const gRate = gdbMarks.total > 0 ? gdbMarks.obtained / gdbMarks.total : 0;
    const gContrib = gRate * activeWeights.gdb;

    const mRate = midMarks.total > 0 ? midMarks.obtained / midMarks.total : 0;
    const mContrib = mRate * activeWeights.mid;

    const earnedWeightedPercent = qContrib + aContrib + gContrib + mContrib;
    const totalSessionalWeight = activeWeights.quiz + activeWeights.assign + activeWeights.gdb + activeWeights.mid;

    // Check VU 20% rule on Midterm
    const midMinRequired = midMarks.total * 0.2;
    const isMidterm20Failed = midMarks.obtained < midMinRequired && midMarks.total > 0;

    // Grade Matrix
    const gradeLevels = [
      { grade: 'D (Pass Minimum)', min: 50, gpa: 1.00 },
      { grade: 'D+', min: 54, gpa: 1.33 },
      { grade: 'C- (Acceptable)', min: 58, gpa: 1.67 },
      { grade: 'C (Standard)', min: 61, gpa: 2.00 },
      { grade: 'C+', min: 64, gpa: 2.33 },
      { grade: 'B- (Good)', min: 68, gpa: 2.67 },
      { grade: 'B (High Average)', min: 71, gpa: 3.00 },
      { grade: 'B+ (Merit)', min: 75, gpa: 3.50 },
      { grade: 'A (Distinction)', min: 80, gpa: 4.00 },
      { grade: 'A+ (Excellence)', min: 85, gpa: 4.00 }
    ];

    const targets = gradeLevels.map((lvl) => {
      const neededPercent = lvl.min - earnedWeightedPercent;
      if (neededPercent <= 0) {
        // Already secured enough points, but MUST secure 20% in Final as per VU Rule
        const rawMin = Math.ceil(finalTotalMarks * 0.2);
        return {
          grade: lvl.grade,
          minPercent: lvl.min,
          gpa: lvl.gpa,
          requiredFinalPercent: 20,
          requiredFinalRawMarks: rawMin,
          status: 'attainable' as const
        };
      }

      const requiredInFinal = (neededPercent / (activeWeights.final || 1)) * 100;
      const rawNeeded = Math.ceil((requiredInFinal / 100) * finalTotalMarks);

      // Must be at least 20% of final exam
      const enforcedRaw = Math.max(rawNeeded, Math.ceil(finalTotalMarks * 0.2));
      const enforcedPercent = Math.max(requiredInFinal, 20);

      let status: 'attainable' | 'moderate' | 'challenging' | 'impossible' = 'attainable';
      if (enforcedPercent > 100) {
        status = 'impossible';
      } else if (enforcedPercent > 75) {
        status = 'challenging';
      } else if (enforcedPercent > 50) {
        status = 'moderate';
      }

      return {
        grade: lvl.grade,
        minPercent: lvl.min,
        gpa: lvl.gpa,
        requiredFinalPercent: enforcedPercent,
        requiredFinalRawMarks: enforcedRaw,
        status
      };
    });

    // Pass target (Grade D)
    const passTarget = targets[0];

    return {
      qContrib,
      aContrib,
      gContrib,
      mContrib,
      earnedWeightedPercent,
      totalSessionalWeight,
      isMidterm20Failed,
      midMinRequired,
      targets,
      passTarget
    };
  }, [quizMarks, assignMarks, gdbMarks, midMarks, finalTotalMarks, activeWeights]);

  // Download PDF Handler
  const handleDownloadPDF = () => {
    const data: SimulatorData = {
      courseCode: selectedCourseCode,
      courseTitle: customCourseTitle,
      schemeName: schemeKey === 'custom' ? 'Custom Academic Scheme' : SCHEMES[schemeKey].name,
      quizzes: { total: quizMarks.total, obtained: quizMarks.obtained, weight: activeWeights.quiz },
      assignments: { total: assignMarks.total, obtained: assignMarks.obtained, weight: activeWeights.assign },
      gdb: { total: gdbMarks.total, obtained: gdbMarks.obtained, weight: activeWeights.gdb },
      midterm: { total: midMarks.total, obtained: midMarks.obtained, weight: activeWeights.mid },
      finalTerm: { total: finalTotalMarks, weight: activeWeights.final },
      earnedWeightedPercent: calculations.earnedWeightedPercent,
      finalWeightPercent: activeWeights.final,
      gradeTargets: calculations.targets
    };

    generatePassingReportPDF(data);
  };

  const resetToDefaults = () => {
    setQuizMarks({ obtained: 25, total: 30 });
    setAssignMarks({ obtained: 42, total: 50 });
    setGdbMarks({ obtained: 4, total: 5 });
    setMidMarks({ obtained: 26, total: 40 });
    setFinalTotalMarks(60);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Hero Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
          <Calculator className="w-4 h-4" />
          <span>VIRTUAL UNIVERSITY ACADEMIC CALCULATOR</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Exam Passing Marks & Target Simulator
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          Simulate your required Final Term examination marks to achieve a minimum passing grade (50% D) or target a high GPA (3.0+ B / 4.0 A) according to official Virtual University regulations.
        </p>

        {/* Quick Context Highlights */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-semibold text-slate-500 pt-1">
          <span className="flex items-center gap-1.5 text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>50% Overall Aggregate Passing</span>
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="flex items-center gap-1.5 text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>20% Independent Exam Rule</span>
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="flex items-center gap-1.5 text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Official 4.0 GPA Scale</span>
          </span>
        </div>
      </div>

      {/* Preset Course Chips */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
          <span>1. Select Course Preset or Custom Course</span>
          <button 
            type="button" 
            onClick={resetToDefaults}
            className="text-blue-600 hover:text-blue-800 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo Marks</span>
          </button>
        </label>
        <div className="flex flex-wrap gap-2">
          {POPULAR_COURSES.map((p) => {
            const isSelected = selectedCourseCode === p.code;
            return (
              <button
                key={p.code}
                type="button"
                onClick={() => handleSelectPreset(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50/50'
                }`}
              >
                <span className="font-mono">{p.code}</span>
                <span className="ml-1.5 font-normal opacity-85 hidden sm:inline">({p.title.split(' ')[0]})</span>
              </button>
            );
          })}
        </div>

        {/* Custom Course inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Course Code</label>
            <input
              type="text"
              value={selectedCourseCode}
              onChange={(e) => setSelectedCourseCode(e.target.value.toUpperCase())}
              placeholder="e.g. CS201"
              className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Course Title</label>
            <input
              type="text"
              value={customCourseTitle}
              onChange={(e) => setCustomCourseTitle(e.target.value)}
              placeholder="e.g. Introduction to Programming"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Grading Scheme Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>2. Select LMS Grading Scheme</span>
            </h2>
            <p className="text-xs text-slate-500">
              Matches your course syllabus weightage in VULMS.
            </p>
          </div>

          {/* Scheme Segmented Buttons */}
          <div className="flex flex-wrap gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setSchemeKey('standard')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                schemeKey === 'standard' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Standard (25% / 55%)
            </button>
            <button
              type="button"
              onClick={() => setSchemeKey('assignHeavy')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                schemeKey === 'assignHeavy' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Assignments (25% / 45%)
            </button>
            <button
              type="button"
              onClick={() => setSchemeKey('noGdb')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                schemeKey === 'noGdb' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              No GDB (30% / 50%)
            </button>
            <button
              type="button"
              onClick={() => setSchemeKey('custom')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                schemeKey === 'custom' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Custom Sliders
            </button>
          </div>
        </div>

        {/* Current Active Scheme Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Quizzes</span>
            <span className="font-bold text-slate-900">{activeWeights.quiz}%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-500 block">Assignments</span>
            <span className="font-bold text-slate-900">{activeWeights.assign}%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-500 block">GDB</span>
            <span className="font-bold text-slate-900">{activeWeights.gdb}%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100">
            <span className="text-[11px] text-indigo-700 block">Midterm</span>
            <span className="font-bold text-indigo-900">{activeWeights.mid}%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 col-span-2 sm:col-span-1">
            <span className="text-[11px] text-blue-700 block">Final Term</span>
            <span className="font-bold text-blue-900">{activeWeights.final}%</span>
          </div>
        </div>

        {/* Custom Sliders (If custom selected) */}
        {schemeKey === 'custom' && (
          <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-5 gap-4 text-xs">
            <div>
              <label className="font-medium text-slate-700 block mb-1">Quiz %: {customWeights.quiz}%</label>
              <input
                type="range"
                min="0"
                max="20"
                value={customWeights.quiz}
                onChange={(e) => setCustomWeights({ ...customWeights, quiz: Number(e.target.value) })}
                className="w-full accent-blue-600"
              />
            </div>
            <div>
              <label className="font-medium text-slate-700 block mb-1">Assign %: {customWeights.assign}%</label>
              <input
                type="range"
                min="0"
                max="25"
                value={customWeights.assign}
                onChange={(e) => setCustomWeights({ ...customWeights, assign: Number(e.target.value) })}
                className="w-full accent-blue-600"
              />
            </div>
            <div>
              <label className="font-medium text-slate-700 block mb-1">GDB %: {customWeights.gdb}%</label>
              <input
                type="range"
                min="0"
                max="10"
                value={customWeights.gdb}
                onChange={(e) => setCustomWeights({ ...customWeights, gdb: Number(e.target.value) })}
                className="w-full accent-blue-600"
              />
            </div>
            <div>
              <label className="font-medium text-slate-700 block mb-1">Mid %: {customWeights.mid}%</label>
              <input
                type="range"
                min="15"
                max="40"
                value={customWeights.mid}
                onChange={(e) => setCustomWeights({ ...customWeights, mid: Number(e.target.value) })}
                className="w-full accent-blue-600"
              />
            </div>
            <div>
              <label className="font-medium text-slate-700 block mb-1">Final %: {customWeights.final}%</label>
              <input
                type="range"
                min="35"
                max="70"
                value={customWeights.final}
                onChange={(e) => setCustomWeights({ ...customWeights, final: Number(e.target.value) })}
                className="w-full accent-blue-600"
              />
            </div>
          </div>
        )}
      </div>

      {/* Sessional Marks Input Cards */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          3. Enter Your Marks (Obtained / Total)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Quizzes */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Quizzes</span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                {activeWeights.quiz}% Weight
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Obtained</label>
                <input
                  type="number"
                  min="0"
                  max={quizMarks.total}
                  value={quizMarks.obtained}
                  onChange={(e) => setQuizMarks({ ...quizMarks, obtained: Math.max(0, Number(e.target.value)) })}
                  className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-600 text-slate-900"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Total</label>
                <input
                  type="number"
                  min="1"
                  value={quizMarks.total}
                  onChange={(e) => setQuizMarks({ ...quizMarks, total: Math.max(1, Number(e.target.value)) })}
                  className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-600 text-slate-900"
                />
              </div>
            </div>
            <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
              <span>Contribution:</span>
              <strong className="text-slate-900 font-semibold">{calculations.qContrib.toFixed(2)}%</strong>
            </div>
          </div>

          {/* Card 2: Assignments */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Assignments</span>
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                {activeWeights.assign}% Weight
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Obtained</label>
                <input
                  type="number"
                  min="0"
                  max={assignMarks.total}
                  value={assignMarks.obtained}
                  onChange={(e) => setAssignMarks({ ...assignMarks, obtained: Math.max(0, Number(e.target.value)) })}
                  className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-600 text-slate-900"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Total</label>
                <input
                  type="number"
                  min="1"
                  value={assignMarks.total}
                  onChange={(e) => setAssignMarks({ ...assignMarks, total: Math.max(1, Number(e.target.value)) })}
                  className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-600 text-slate-900"
                />
              </div>
            </div>
            <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
              <span>Contribution:</span>
              <strong className="text-slate-900 font-semibold">{calculations.aContrib.toFixed(2)}%</strong>
            </div>
          </div>

          {/* Card 3: GDB */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">GDB (Discussion)</span>
              <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                {activeWeights.gdb}% Weight
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Obtained</label>
                <input
                  type="number"
                  min="0"
                  max={gdbMarks.total}
                  disabled={activeWeights.gdb === 0}
                  value={activeWeights.gdb === 0 ? 0 : gdbMarks.obtained}
                  onChange={(e) => setGdbMarks({ ...gdbMarks, obtained: Math.max(0, Number(e.target.value)) })}
                  className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-600 text-slate-900 disabled:bg-slate-100"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Total</label>
                <input
                  type="number"
                  min="1"
                  disabled={activeWeights.gdb === 0}
                  value={activeWeights.gdb === 0 ? 0 : gdbMarks.total}
                  onChange={(e) => setGdbMarks({ ...gdbMarks, total: Math.max(1, Number(e.target.value)) })}
                  className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-600 text-slate-900 disabled:bg-slate-100"
                />
              </div>
            </div>
            <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
              <span>Contribution:</span>
              <strong className="text-slate-900 font-semibold">{calculations.gContrib.toFixed(2)}%</strong>
            </div>
          </div>

          {/* Card 4: Midterm Exam */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Midterm Exam</span>
              <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                {activeWeights.mid}% Weight
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Obtained</label>
                <input
                  type="number"
                  min="0"
                  max={midMarks.total}
                  value={midMarks.obtained}
                  onChange={(e) => setMidMarks({ ...midMarks, obtained: Math.max(0, Number(e.target.value)) })}
                  className={`w-full px-3 py-1.5 text-xs font-bold rounded-lg border focus:ring-2 focus:ring-blue-600 text-slate-900 ${
                    calculations.isMidterm20Failed ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200'
                  }`}
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Total</label>
                <input
                  type="number"
                  min="1"
                  value={midMarks.total}
                  onChange={(e) => setMidMarks({ ...midMarks, total: Math.max(1, Number(e.target.value)) })}
                  className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-600 text-slate-900"
                />
              </div>
            </div>
            <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
              <span>Contribution:</span>
              <strong className="text-slate-900 font-semibold">{calculations.mContrib.toFixed(2)}%</strong>
            </div>
          </div>
        </div>

        {/* Final Exam Total Selector */}
        <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-slate-900">Expected Final Term Paper Total Marks</span>
            <p className="text-[11px] text-slate-500">Usually 60 marks (regular courses) or 80 marks (some 4-credit courses).</p>
          </div>
          <div className="flex items-center gap-2">
            {[50, 60, 80].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFinalTotalMarks(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  finalTotalMarks === t
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-400'
                }`}
              >
                {t} Marks
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Midterm 20% Warning Alert if violated */}
      {calculations.isMidterm20Failed && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 text-xs leading-relaxed">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="font-bold block text-rose-900">VU Mandatory 20% Rule Alert!</strong>
            <p>
              Your midterm score ({midMarks.obtained}/{midMarks.total}) is below the required 20% threshold (at least {calculations.midMinRequired} marks). As per official Virtual University regulations, failure to secure 20% in Midterm can lead to an automatic <strong>F Grade</strong> regardless of assignments score. If you missed this exam, apply for rescheduled exams via VULMS.
            </p>
          </div>
        </div>
      )}

      {/* Live Simulation Analytical Dashboard */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-8 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" />
              <span>Simulation Result for {selectedCourseCode}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Exam Target & Passing Feasibility
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-xs active:scale-98"
            >
              <Download className="w-4 h-4" />
              <span>Download Official Report (PDF)</span>
            </button>
          </div>
        </div>

        {/* Visual Progress Bar (Stacked Contribution) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">
              Earned Weighted Progress: <span className="text-blue-600">{calculations.earnedWeightedPercent.toFixed(1)}%</span> / 100%
            </span>
            <span className="text-slate-500 font-medium">
              Available in Final: <strong className="text-slate-800">{activeWeights.final}%</strong>
            </span>
          </div>

          {/* Stacked Bar */}
          <div className="h-5 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
            <div 
              style={{ width: `${calculations.qContrib}%` }} 
              className="bg-emerald-500 h-full transition-all duration-300" 
              title={`Quizzes: ${calculations.qContrib.toFixed(1)}%`}
            />
            <div 
              style={{ width: `${calculations.aContrib}%` }} 
              className="bg-blue-500 h-full transition-all duration-300" 
              title={`Assignments: ${calculations.aContrib.toFixed(1)}%`}
            />
            <div 
              style={{ width: `${calculations.gContrib}%` }} 
              className="bg-purple-500 h-full transition-all duration-300" 
              title={`GDB: ${calculations.gContrib.toFixed(1)}%`}
            />
            <div 
              style={{ width: `${calculations.mContrib}%` }} 
              className="bg-indigo-600 h-full transition-all duration-300" 
              title={`Midterm: ${calculations.mContrib.toFixed(1)}%`}
            />
            {/* Minimum Pass Target Line Indicator */}
            <div 
              style={{ width: `${Math.max(0, 50 - calculations.earnedWeightedPercent)}%` }} 
              className="bg-amber-400/80 h-full transition-all duration-300 border-r-2 border-amber-600" 
              title="Required for 50% passing"
            />
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-slate-500 pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Quizzes ({calculations.qContrib.toFixed(1)}%)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Assignments ({calculations.aContrib.toFixed(1)}%)</span>
            </span>
            {activeWeights.gdb > 0 && (
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span>GDB ({calculations.gContrib.toFixed(1)}%)</span>
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              <span>Midterm ({calculations.mContrib.toFixed(1)}%)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-600" />
              <span>Required to Pass 50%</span>
            </span>
          </div>
        </div>

        {/* Primary Target Callout Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-wider text-blue-300 font-bold flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Minimum Passing Threshold (Grade D - 50% Aggregate)</span>
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              {calculations.passTarget.requiredFinalRawMarks} / {finalTotalMarks} Marks
              <span className="text-sm sm:text-base font-normal text-blue-200 ml-2">
                ({calculations.passTarget.requiredFinalPercent.toFixed(1)}% of Final Exam)
              </span>
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              You need at least <strong>{calculations.passTarget.requiredFinalRawMarks} marks</strong> in the Final Term exam to satisfy both the 20% component rule and the 50% overall course aggregate.
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-start sm:items-end gap-2">
            <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-bold text-xs">
              Status: Highly Attainable
            </span>
            <button
              type="button"
              onClick={() => onSelectCourse(selectedCourseCode)}
              className="text-xs text-blue-300 hover:text-white underline underline-offset-4 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Get {selectedCourseCode} Handouts & Past Papers</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Detailed Target Grade Table */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Target Final Term Scores For Every Grade Tier</span>
          </h3>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="py-3 px-4">Target Grade</th>
                  <th className="py-3 px-4">Min. Aggregate</th>
                  <th className="py-3 px-4">Grade Points</th>
                  <th className="py-3 px-4">Required Final Marks (/{finalTotalMarks})</th>
                  <th className="py-3 px-4">Required Final %</th>
                  <th className="py-3 px-4">Feasibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {calculations.targets.map((tgt) => (
                  <tr key={tgt.grade} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      <span>{tgt.grade}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{tgt.minPercent}%</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">{tgt.gpa.toFixed(2)}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {tgt.status === 'impossible' ? (
                        <span className="text-rose-600">Exceeds 100%</span>
                      ) : (
                        <span>{tgt.requiredFinalRawMarks} / {finalTotalMarks}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {tgt.status === 'impossible' ? 'N/A' : `${tgt.requiredFinalPercent.toFixed(1)}%`}
                    </td>
                    <td className="py-3 px-4">
                      {tgt.status === 'attainable' && (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Attainable</span>
                        </span>
                      )}
                      {tgt.status === 'moderate' && (
                        <span className="text-blue-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Moderate Effort</span>
                        </span>
                      )}
                      {tgt.status === 'challenging' && (
                        <span className="text-amber-700 font-semibold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>High Focus Target</span>
                        </span>
                      )}
                      {tgt.status === 'impossible' && (
                        <span className="text-rose-600 font-semibold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Mathematically Unattainable</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            Note: Calculations are grounded in official Virtual University of Pakistan Assessment Regulations.
          </p>
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Official PDF Report</span>
          </button>
        </div>
      </div>

      {/* Official VU Examination Policy Guide Accordion */}
      <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-600" />
          <span>Official VU Examination Policy Highlights & FAQs</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 leading-relaxed">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 shadow-2xs">
            <h3 className="font-bold text-slate-900 text-sm">What is the 20% Mandatory Component Rule?</h3>
            <p>
              Virtual University requires students to secure at least <strong>20% marks independently</strong> in both the Midterm Examination and the Final Term Examination. Scoring below 20% in either exam results in a course fail regardless of assignment or quiz scores.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 shadow-2xs">
            <h3 className="font-bold text-slate-900 text-sm">What is the Minimum Passing Aggregate?</h3>
            <p>
              To earn a passing grade ("D" with 1.00 Grade Point), your cumulative weighted sum of Quizzes, Assignments, GDB, Midterm, and Final Term must reach at least <strong>50.0%</strong>. Anything below 50.0% is assigned an "F" grade.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 shadow-2xs">
            <h3 className="font-bold text-slate-900 text-sm">Can I improve a "D" grade later?</h3>
            <p>
              Yes! VU allows repeating courses with "D" or "D+" grades to improve your cumulative CGPA. If your CGPA drops below 2.0 (Probation), repeating "D" and "F" grade courses is the fastest way to restore good standing.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 shadow-2xs">
            <h3 className="font-bold text-slate-900 text-sm">How does Relative Grading work at VU?</h3>
            <p>
              In large enrollment courses, VU may apply statistical normalization curves (Bell Curve) to adjust grade boundaries. However, the absolute floor of 50% for passing and 20% for exams remains strictly enforced.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
