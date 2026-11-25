import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  BookOpen, 
  ChevronRight,
  TrendingUp,
  Award,
  Layers,
  Info,
  RotateCcw,
  Search,
  Check,
  Percent,
  Compass,
  FileCheck,
  ShieldCheck,
  Sparkles,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generatePassingReportPDF, SimulatorData } from '../utils/pdfGenerator';
import coursesData from '../data/courses.json';
import { Course } from '../types';
import {
  ScrollReveal,
  StaggerGrid,
  StaggerItem,
  AnimatedButton,
  EASE_OUT_EXPO
} from '../components/MotionPrimitives';
import { CelestialPageHeader } from '../components/CelestialBackdrop';

const allCourses = coursesData as Course[];

// Curated top searched VU courses from real data
const HIGHLIGHTED_CODES = [
  'CS101', 'CS201', 'CS301', 'CS401', 'CS504', 'CS601',
  'MTH101', 'MTH202', 'MTH302', 'ENG101', 'MGT101', 'MGT211',
  'PAK301', 'ISL202', 'ECO401', 'PHY101'
];

const SCHEMES = {
  standard: {
    name: 'Standard VU Scheme (25% Mid / 55% Final)',
    desc: 'Most CS, IT, and Management lecture courses',
    quizWeight: 5,
    assignWeight: 10,
    gdbWeight: 5,
    midWeight: 25,
    finalWeight: 55
  },
  assignHeavy: {
    name: 'Assignment Heavy Scheme (25% Mid / 45% Final)',
    desc: 'Programming & mathematics courses with regular submissions',
    quizWeight: 10,
    assignWeight: 15,
    gdbWeight: 5,
    midWeight: 25,
    finalWeight: 45
  },
  noGdb: {
    name: 'No GDB Scheme (30% Mid / 50% Final)',
    desc: 'General studies, Islamic & Pakistan studies',
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
  // Course State (Real VU courses from courses.json)
  const [selectedCourseCode, setSelectedCourseCode] = useState('CS101');
  const [courseSearchQuery, setCourseSearchQuery] = useState('');
  const [schemeKey, setSchemeKey] = useState<'standard' | 'assignHeavy' | 'noGdb' | 'custom'>('standard');
  const [passingThreshold, setPassingThreshold] = useState<40 | 50>(50); // 50% standard, 40% VU floor rule

  // Custom Weightage State
  const [customWeights, setCustomWeights] = useState({
    quiz: 5,
    assign: 10,
    gdb: 5,
    mid: 25,
    final: 55
  });

  // Marks Inputs State
  const [quizMarks, setQuizMarks] = useState({ obtained: 26, total: 30 });
  const [assignMarks, setAssignMarks] = useState({ obtained: 42, total: 50 });
  const [gdbMarks, setGdbMarks] = useState({ obtained: 4, total: 5 });
  const [midMarks, setMidMarks] = useState({ obtained: 27, total: 40 });
  const [finalTotalMarks, setFinalTotalMarks] = useState(60);

  // Interactive What-If Simulator Slider
  const [simulatedFinalScore, setSimulatedFinalScore] = useState(36);

  // Current selected course details from real database
  const selectedCourse = useMemo(() => {
    return allCourses.find((c) => c.code === selectedCourseCode) || {
      code: selectedCourseCode,
      title: 'Selected VU Course',
      faculty: 'Computer Science & IT',
      fileCount: 50
    };
  }, [selectedCourseCode]);

  // Filtered courses for search dropdown
  const filteredCourseList = useMemo(() => {
    if (!courseSearchQuery.trim()) return [];
    const q = courseSearchQuery.toLowerCase().trim();
    return allCourses
      .filter((c) => c.code.toLowerCase().includes(q) || c.title.toLowerCase().includes(q))
      .slice(0, 8);
  }, [courseSearchQuery]);

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

  // Calculations Engine
  const calculations = useMemo(() => {
    const qRate = quizMarks.total > 0 ? quizMarks.obtained / quizMarks.total : 0;
    const qContrib = qRate * activeWeights.quiz;

    const aRate = assignMarks.total > 0 ? assignMarks.obtained / assignMarks.total : 0;
    const aContrib = aRate * activeWeights.assign;

    const gRate = gdbMarks.total > 0 ? gdbMarks.obtained / gdbMarks.total : 0;
    const gContrib = gRate * activeWeights.gdb;

    const mRate = midMarks.total > 0 ? midMarks.obtained / midMarks.total : 0;
    const mContrib = mRate * activeWeights.mid;

    // Total Sessional Weight available (e.g. 45% or 50%)
    const sessionalWeightAvailable = activeWeights.quiz + activeWeights.assign + activeWeights.gdb + activeWeights.mid;
    
    // Earned weighted percentage in hand
    const earnedWeightedPercent = qContrib + aContrib + gContrib + mContrib;

    // Official VU Rule: First Half Collective 20%
    const totalFirstHalfObtained = quizMarks.obtained + assignMarks.obtained + (activeWeights.gdb > 0 ? gdbMarks.obtained : 0) + midMarks.obtained;
    const totalFirstHalfPossible = quizMarks.total + assignMarks.total + (activeWeights.gdb > 0 ? gdbMarks.total : 0) + midMarks.total;
    const firstHalfRate = totalFirstHalfPossible > 0 ? (totalFirstHalfObtained / totalFirstHalfPossible) * 100 : 0;
    const firstHalfPassed = firstHalfRate >= 20;

    // Final Term 20% Mandatory Rule
    const final20PercentMarks = Math.ceil(finalTotalMarks * 0.2);

    // Grade Targets Matrix
    const gradeScales = [
      { grade: 'A+ (Excellence)', label: 'Distinction', min: 90, gpa: 4.00 },
      { grade: 'A (High Honor)', label: 'Honor Roll', min: 85, gpa: 4.00 },
      { grade: 'B+ (Merit)', label: 'Dean List', min: 75, gpa: 3.50 },
      { grade: 'B (High Average)', label: 'Very Good', min: 71, gpa: 3.00 },
      { grade: 'C (Standard)', label: 'Satisfactory', min: 61, gpa: 2.00 },
      { grade: 'D (Pass)', label: 'Course Pass', min: 50, gpa: 1.00 },
      { grade: 'E / Pass Floor', label: 'Conditional Pass', min: 40, gpa: 0.70 }
    ];

    const targets = gradeScales.map((scale) => {
      const neededPercent = scale.min - earnedWeightedPercent;
      if (neededPercent <= 0) {
        return {
          grade: scale.grade,
          label: scale.label,
          minPercent: scale.min,
          gpa: scale.gpa,
          requiredFinalPercent: 20,
          requiredFinalRawMarks: final20PercentMarks,
          status: 'attainable' as const
        };
      }

      const requiredInFinal = (neededPercent / (activeWeights.final || 1)) * 100;
      const rawNeeded = Math.ceil((requiredInFinal / 100) * finalTotalMarks);

      // Must be at least 20% of final exam
      const enforcedRaw = Math.max(rawNeeded, final20PercentMarks);
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
        grade: scale.grade,
        label: scale.label,
        minPercent: scale.min,
        gpa: scale.gpa,
        requiredFinalPercent: enforcedPercent,
        requiredFinalRawMarks: enforcedRaw,
        status
      };
    });

    // Pass target based on selected threshold (50% or 40%)
    const targetLvl = passingThreshold === 50 ? 50 : 40;
    const neededForPass = targetLvl - earnedWeightedPercent;
    const finalRawForPass = neededForPass <= 0 
      ? final20PercentMarks 
      : Math.max(final20PercentMarks, Math.ceil(((neededForPass / activeWeights.final) * 100 / 100) * finalTotalMarks));
    const finalPercentForPass = (finalRawForPass / finalTotalMarks) * 100;

    // What-If Simulation
    const simRate = finalTotalMarks > 0 ? (simulatedFinalScore / finalTotalMarks) : 0;
    const simFinalContrib = simRate * activeWeights.final;
    const simTotalPercent = earnedWeightedPercent + simFinalContrib;
    const simFinalMeets20 = simulatedFinalScore >= final20PercentMarks;

    let simGrade = 'F';
    let simGpa = 0.00;
    let simVerdict = 'Failed';
    let simColor = 'text-rose-600 bg-rose-50 border-rose-200';

    if (!firstHalfPassed || !simFinalMeets20 || simTotalPercent < passingThreshold) {
      simGrade = 'F';
      simGpa = 0.00;
      simVerdict = !firstHalfPassed 
        ? 'Fail: First Half 20% Rule Violated'
        : !simFinalMeets20 
          ? 'Fail: Final Term 20% Rule Violated' 
          : 'Fail: Overall Aggregate Below Passing Floor';
      simColor = 'text-rose-700 bg-rose-50 border-rose-200';
    } else if (simTotalPercent >= 90) {
      simGrade = 'A+';
      simGpa = 4.00;
      simVerdict = 'Distinction Excellence (Gold Grade)';
      simColor = 'text-amber-700 bg-amber-50 border-amber-200';
    } else if (simTotalPercent >= 85) {
      simGrade = 'A';
      simGpa = 4.00;
      simVerdict = 'Honor Roll Standing';
      simColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    } else if (simTotalPercent >= 75) {
      simGrade = 'B+';
      simGpa = 3.50;
      simVerdict = 'Dean’s Honor List';
      simColor = 'text-blue-700 bg-blue-50 border-blue-200';
    } else if (simTotalPercent >= 71) {
      simGrade = 'B';
      simGpa = 3.00;
      simVerdict = 'Solid Merit Standing';
      simColor = 'text-[#0D1B2A] bg-[#F3EFE6] border-[#DDD6C8]';
    } else if (simTotalPercent >= 61) {
      simGrade = 'C';
      simGpa = 2.00;
      simVerdict = 'Safe Academic Good Standing';
      simColor = 'text-teal-700 bg-teal-50 border-teal-200';
    } else if (simTotalPercent >= 50) {
      simGrade = 'D';
      simGpa = 1.00;
      simVerdict = 'Course Passed (Improvement Recommended)';
      simColor = 'text-slate-800 bg-slate-100 border-slate-300';
    } else {
      simGrade = 'E / Pass';
      simGpa = 0.70;
      simVerdict = 'Conditional Floor Pass (Probation Alert)';
      simColor = 'text-amber-800 bg-amber-50 border-amber-200';
    }

    return {
      qContrib,
      aContrib,
      gContrib,
      mContrib,
      earnedWeightedPercent,
      sessionalWeightAvailable,
      firstHalfRate,
      firstHalfPassed,
      final20PercentMarks,
      targets,
      finalRawForPass,
      finalPercentForPass,
      simTotalPercent,
      simGrade,
      simGpa,
      simVerdict,
      simColor,
      simFinalContrib,
      simFinalMeets20
    };
  }, [quizMarks, assignMarks, gdbMarks, midMarks, finalTotalMarks, activeWeights, passingThreshold, simulatedFinalScore]);

  // Preset quick score loader
  const applyScorePreset = (type: 'high' | 'average' | 'borderline' | 'zeroMid') => {
    if (type === 'high') {
      setQuizMarks({ obtained: 27, total: 30 });
      setAssignMarks({ obtained: 46, total: 50 });
      setGdbMarks({ obtained: 5, total: 5 });
      setMidMarks({ obtained: 34, total: 40 });
      setSimulatedFinalScore(50);
    } else if (type === 'average') {
      setQuizMarks({ obtained: 21, total: 30 });
      setAssignMarks({ obtained: 38, total: 50 });
      setGdbMarks({ obtained: 4, total: 5 });
      setMidMarks({ obtained: 25, total: 40 });
      setSimulatedFinalScore(38);
    } else if (type === 'borderline') {
      setQuizMarks({ obtained: 15, total: 30 });
      setAssignMarks({ obtained: 25, total: 50 });
      setGdbMarks({ obtained: 2, total: 5 });
      setMidMarks({ obtained: 12, total: 40 });
      setSimulatedFinalScore(24);
    } else {
      setQuizMarks({ obtained: 20, total: 30 });
      setAssignMarks({ obtained: 35, total: 50 });
      setGdbMarks({ obtained: 3, total: 5 });
      setMidMarks({ obtained: 0, total: 40 });
      setSimulatedFinalScore(32);
    }
  };

  // PDF Export
  const handleDownloadPDF = () => {
    const data: SimulatorData = {
      courseCode: selectedCourse.code,
      courseTitle: selectedCourse.title,
      schemeName: schemeKey === 'custom' ? 'Custom Academic Weightage' : SCHEMES[schemeKey].name,
      passingThreshold,
      quizzes: { total: quizMarks.total, obtained: quizMarks.obtained, weight: activeWeights.quiz },
      assignments: { total: assignMarks.total, obtained: assignMarks.obtained, weight: activeWeights.assign },
      gdb: { total: gdbMarks.total, obtained: gdbMarks.obtained, weight: activeWeights.gdb },
      midterm: { total: midMarks.total, obtained: midMarks.obtained, weight: activeWeights.mid },
      finalTerm: { total: finalTotalMarks, weight: activeWeights.final },
      earnedWeightedPercent: calculations.earnedWeightedPercent,
      firstHalfObtainedPercent: calculations.firstHalfRate,
      firstHalfPassed: calculations.firstHalfPassed,
      finalWeightPercent: activeWeights.final,
      simulatedFinalMarks: simulatedFinalScore,
      simulatedTotalPercent: calculations.simTotalPercent,
      simulatedGrade: calculations.simGrade,
      simulatedGpa: calculations.simGpa,
      gradeTargets: calculations.targets
    };

    generatePassingReportPDF(data);
  };

  // Gauge circular calculation
  const gaugePercent = Math.min(100, Math.max(0, calculations.earnedWeightedPercent));
  const strokeDashoffset = 283 - (283 * gaugePercent) / 100;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* 1. Celestial Observatory Header & Official Context */}
      <CelestialPageHeader
        kickerIcon={<Award className="w-4 h-4" />}
        kickerText="Virtual University Academic Simulation Engine"
        badgeText="20% Two-Half Compliance Engine"
        title={
          <>
            Exam Passing Marks &amp;{' '}
            <span className="text-amber-300">
              Grade Target Simulator
            </span>
          </>
        }
        description={
          <>
            Ground-truth simulator modeled on official Virtual University of Pakistan examination regulations: evaluate the <strong className="text-white">Two-Half 20% Evaluation Rule</strong>, calculate required Final Term scores, and download an executive Academic Intelligence Report in PDF.
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="bg-[#132238] border border-white/10 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-400/35 text-emerald-300 flex items-center justify-center shrink-0 font-mono font-bold text-xs">
              20%
            </div>
            <div className="text-xs">
              <strong className="block text-white font-bold">First-Half Rule</strong>
              <span className="text-slate-300">Min 20% in sessional &amp; mid</span>
            </div>
          </div>

          <div className="bg-[#132238] border border-white/10 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-500/20 border border-sky-400/35 text-sky-300 flex items-center justify-center shrink-0 font-mono font-bold text-xs">
              20%
            </div>
            <div className="text-xs">
              <strong className="block text-white font-bold">Final Term Rule</strong>
              <span className="text-slate-300">Min 20% in final exam paper</span>
            </div>
          </div>

          <div className="bg-[#132238] border border-white/10 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-400/15 border border-amber-300/30 text-amber-300 flex items-center justify-center shrink-0 font-mono font-bold text-xs">
              50%
            </div>
            <div className="text-xs">
              <strong className="block text-white font-bold">Aggregate Pass</strong>
              <span className="text-slate-300">Official D-Grade Threshold</span>
            </div>
          </div>
        </div>
      </CelestialPageHeader>

      {/* 2. Course Selection & Presets */}
      <ScrollReveal delay={0.05} className="bg-white rounded-2xl border border-[#E5E0D5] shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E5E0D5]">
          <div>
            <h2 className="text-base font-bold text-[#0D1B2A] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-700" />
              <span>Select Real Virtual University Course</span>
            </h2>
            <p className="text-xs text-slate-500">
              Pick from 411 real courses or search by course code (e.g., CS101, MTH101, ENG101).
            </p>
          </div>

          {/* Quick Presets Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-slate-500 uppercase mr-1">Sample Profiles:</span>
            <motion.button
              type="button"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => applyScorePreset('high')}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors cursor-pointer border border-emerald-200"
            >
              High Performer (4.0)
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => applyScorePreset('average')}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-800 transition-colors cursor-pointer border border-blue-200"
            >
              Average Student
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => applyScorePreset('borderline')}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 transition-colors cursor-pointer border border-amber-200"
            >
              Borderline Passing
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => applyScorePreset('zeroMid')}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-800 transition-colors cursor-pointer border border-rose-200"
            >
              Missed Midterm
            </motion.button>
          </div>
        </div>

        {/* Highlighted Course Chips */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Popular Courses:
          </label>
          <div className="flex flex-wrap gap-2">
            {HIGHLIGHTED_CODES.map((code) => {
              const isSelected = selectedCourseCode === code;
              return (
                <motion.button
                  key={code}
                  type="button"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => {
                    setSelectedCourseCode(code);
                    setCourseSearchQuery('');
                  }}
                  className={`relative px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                    isSelected
                      ? 'border-blue-600 text-white shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50/50'
                  }`}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="sim-course-pill"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                      className="absolute inset-0 rounded-xl bg-blue-600"
                    />
                  )}
                  <span className="relative z-10 font-mono">{code}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Real Course Search Autocomplete Box */}
        <div className="relative max-w-xl">
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
            Search All 411 Real Courses:
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={courseSearchQuery}
              onChange={(e) => setCourseSearchQuery(e.target.value)}
              placeholder="Search CS201, MTH302, Management..."
              className="w-full pl-9 pr-4 py-2.5 text-xs font-medium rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-slate-900 bg-white"
            />
          </div>

          {/* Autocomplete Dropdown */}
          {filteredCourseList.length > 0 && (
            <div className="absolute left-0 right-0 mt-1 z-30 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden divide-y divide-slate-100">
              {filteredCourseList.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    setSelectedCourseCode(c.code);
                    setCourseSearchQuery('');
                  }}
                  className="w-full px-4 py-2.5 text-left text-xs hover:bg-blue-50 transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <strong className="font-mono font-bold text-blue-600 mr-2">{c.code}</strong>
                    <span className="text-slate-700 font-medium">{c.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 group-hover:text-blue-600">{c.faculty}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Course Banner */}
        <div className="p-4 rounded-xl bg-[#FAF8F4] border border-[#DDD6C8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-[#0D1B2A] text-white font-mono font-bold text-xs">
                {selectedCourse.code}
              </span>
              <h3 className="text-sm font-bold text-[#0D1B2A]">{selectedCourse.title}</h3>
            </div>
            <p className="text-[11px] text-slate-600">
              Department: {selectedCourse.faculty} · Available Solved Files: {selectedCourse.fileCount || 50}+
            </p>
          </div>

          <AnimatedButton
            type="button"
            shimmer={false}
            onClick={() => onSelectCourse(selectedCourse.code)}
            className="text-xs font-bold text-[#0D1B2A] hover:text-blue-700 flex items-center gap-1 cursor-pointer transition-colors bg-white px-3.5 py-2 rounded-xl border border-[#DDD6C8] shadow-2xs whitespace-nowrap"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Open Study Files</span>
          </AnimatedButton>
        </div>
      </ScrollReveal>

      {/* 3. Weightage Scheme & Passing Policy Selector */}
      <ScrollReveal delay={0.07} className="bg-white rounded-2xl border border-[#E5E0D5] shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E0D5]">
          <div>
            <h2 className="text-base font-bold text-[#0D1B2A] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-700" />
              <span>Assessment Scheme &amp; Passing Threshold</span>
            </h2>
            <p className="text-xs text-slate-500">
              Set LMS course weightage and your target passing threshold.
            </p>
          </div>

          {/* Passing Floor Selector (50% vs 40%) */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {([50, 40] as const).map((threshold) => {
              const active = passingThreshold === threshold;
              return (
                <button
                  key={threshold}
                  type="button"
                  onClick={() => setPassingThreshold(threshold)}
                  className={`relative px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    active ? 'text-blue-700' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="sim-threshold-pill"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                      className="absolute inset-0 bg-white rounded-lg shadow-2xs"
                    />
                  )}
                  <span className="relative z-10">
                    {threshold === 50 ? '50% (Standard D-Grade)' : '40% (VU Floor Rule)'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scheme Selector Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {(['standard', 'assignHeavy', 'noGdb', 'custom'] as const).map((key) => {
            const isSelected = schemeKey === key;
            const desc = key === 'custom' ? 'Custom syllabus weightage' : SCHEMES[key].desc;
            return (
              <motion.button
                key={key}
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSchemeKey(key)}
                className={`p-3.5 rounded-2xl text-left border transition-colors cursor-pointer space-y-1 ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/50 shadow-2xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isSelected ? 'text-blue-700' : 'text-slate-900'}`}>
                    {key === 'standard' ? 'Standard VU' : key === 'assignHeavy' ? 'Assignment Heavy' : key === 'noGdb' ? 'No GDB' : 'Custom'}
                  </span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">{desc}</p>
              </motion.button>
            );
          })}
        </div>

        {/* Interactive Custom Sliders if Custom Selected */}
        <AnimatePresence>
          {schemeKey === 'custom' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
              className="overflow-hidden"
            >
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-5 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Quizzes: {customWeights.quiz}%</label>
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
                  <label className="font-bold text-slate-700 block mb-1">Assignments: {customWeights.assign}%</label>
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
                  <label className="font-bold text-slate-700 block mb-1">GDB: {customWeights.gdb}%</label>
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
                  <label className="font-bold text-slate-700 block mb-1">Midterm: {customWeights.mid}%</label>
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
                  <label className="font-bold text-slate-700 block mb-1">Final Term: {customWeights.final}%</label>
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
            </motion.div>
          )}
        </AnimatePresence>
      </ScrollReveal>

      {/* 4. Sessional Marks Input Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Enter Your Marks (Obtained / Total)</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">Real-time percentage contributions</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Quizzes */}
          <div className="bg-white rounded-2xl border border-[#E5E0D5] shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0D1B2A]">Quizzes (All)</span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                {activeWeights.quiz}% Weight
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Obtained</label>
                <input
                  type="number"
                  min="0"
                  max={quizMarks.total}
                  value={quizMarks.obtained}
                  onChange={(e) => setQuizMarks({ ...quizMarks, obtained: Math.max(0, Number(e.target.value)) })}
                  className="w-full px-3 py-2 text-sm font-bold rounded-xl celestial-input text-[#0D1B2A]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Total</label>
                <input
                  type="number"
                  min="1"
                  value={quizMarks.total}
                  onChange={(e) => setQuizMarks({ ...quizMarks, total: Math.max(1, Number(e.target.value)) })}
                  className="w-full px-3 py-2 text-sm font-bold rounded-xl celestial-input text-[#0D1B2A]"
                />
              </div>
            </div>
            <div className="pt-2 border-t border-[#E5E0D5] flex items-center justify-between text-xs">
              <span className="text-slate-500">Contribution:</span>
              <strong className="text-emerald-700 font-bold">{calculations.qContrib.toFixed(2)}%</strong>
            </div>
          </div>

          {/* Card 2: Assignments */}
          <div className="bg-white rounded-2xl border border-[#E5E0D5] shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0D1B2A]">Assignments (All)</span>
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                {activeWeights.assign}% Weight
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Obtained</label>
                <input
                  type="number"
                  min="0"
                  max={assignMarks.total}
                  value={assignMarks.obtained}
                  onChange={(e) => setAssignMarks({ ...assignMarks, obtained: Math.max(0, Number(e.target.value)) })}
                  className="w-full px-3 py-2 text-sm font-bold rounded-xl celestial-input text-[#0D1B2A]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Total</label>
                <input
                  type="number"
                  min="1"
                  value={assignMarks.total}
                  onChange={(e) => setAssignMarks({ ...assignMarks, total: Math.max(1, Number(e.target.value)) })}
                  className="w-full px-3 py-2 text-sm font-bold rounded-xl celestial-input text-[#0D1B2A]"
                />
              </div>
            </div>
            <div className="pt-2 border-t border-[#E5E0D5] flex items-center justify-between text-xs">
              <span className="text-slate-500">Contribution:</span>
              <strong className="text-blue-700 font-bold">{calculations.aContrib.toFixed(2)}%</strong>
            </div>
          </div>

          {/* Card 3: GDB */}
          <div className="bg-white rounded-2xl border border-[#E5E0D5] shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0D1B2A]">GDB (Discussion)</span>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                {activeWeights.gdb}% Weight
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Obtained</label>
                <input
                  type="number"
                  min="0"
                  max={gdbMarks.total}
                  disabled={activeWeights.gdb === 0}
                  value={activeWeights.gdb === 0 ? 0 : gdbMarks.obtained}
                  onChange={(e) => setGdbMarks({ ...gdbMarks, obtained: Math.max(0, Number(e.target.value)) })}
                  className="w-full px-3 py-2 text-sm font-bold rounded-xl celestial-input text-[#0D1B2A] disabled:bg-[#F3EFE6]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Total</label>
                <input
                  type="number"
                  min="1"
                  disabled={activeWeights.gdb === 0}
                  value={activeWeights.gdb === 0 ? 0 : gdbMarks.total}
                  onChange={(e) => setGdbMarks({ ...gdbMarks, total: Math.max(1, Number(e.target.value)) })}
                  className="w-full px-3 py-2 text-sm font-bold rounded-xl celestial-input text-[#0D1B2A] disabled:bg-[#F3EFE6]"
                />
              </div>
            </div>
            <div className="pt-2 border-t border-[#E5E0D5] flex items-center justify-between text-xs">
              <span className="text-slate-500">Contribution:</span>
              <strong className="text-amber-700 font-bold">{calculations.gContrib.toFixed(2)}%</strong>
            </div>
          </div>

          {/* Card 4: Midterm Examination */}
          <div className="bg-white rounded-2xl border border-[#E5E0D5] shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0D1B2A]">Midterm Exam</span>
              <span className="text-[11px] font-bold text-[#0D1B2A] bg-[#F3EFE6] px-2 py-0.5 rounded-lg border border-[#DDD6C8]">
                {activeWeights.mid}% Weight
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Obtained</label>
                <input
                  type="number"
                  min="0"
                  max={midMarks.total}
                  value={midMarks.obtained}
                  onChange={(e) => setMidMarks({ ...midMarks, obtained: Math.max(0, Number(e.target.value)) })}
                  className="w-full px-3 py-2 text-sm font-bold rounded-xl celestial-input text-[#0D1B2A]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Total</label>
                <input
                  type="number"
                  min="1"
                  value={midMarks.total}
                  onChange={(e) => setMidMarks({ ...midMarks, total: Math.max(1, Number(e.target.value)) })}
                  className="w-full px-3 py-2 text-sm font-bold rounded-xl celestial-input text-[#0D1B2A]"
                />
              </div>
            </div>
            <div className="pt-2 border-t border-[#E5E0D5] flex items-center justify-between text-xs">
              <span className="text-slate-500">Contribution:</span>
              <strong className="text-[#0D1B2A] font-bold">{calculations.mContrib.toFixed(2)}%</strong>
            </div>
          </div>
        </div>

        {/* Final Exam Total Selector */}
        <div className="p-4 rounded-2xl bg-white border border-[#E5E0D5] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-[#0D1B2A]">Expected Final Term Paper Total Marks:</span>
            <p className="text-[11px] text-slate-500">Regular VU courses have 60 marks (MCQs + Subjective).</p>
          </div>
          <div className="flex items-center gap-2">
            {[40, 50, 60, 80].map((t) => (
              <motion.button
                key={t}
                type="button"
                whileTap={{ scale: 0.94 }}
                onClick={() => setFinalTotalMarks(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  finalTotalMarks === t
                    ? 'bg-[#0D1B2A] text-white shadow-xs'
                    : 'bg-[#FAF8F4] text-slate-700 border border-[#DDD6C8] hover:border-blue-600'
                }`}
              >
                {t} Marks
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Live Analytical Dashboard with Circular Gauge & Two-Half Compliance */}
      <ScrollReveal className="bg-white rounded-2xl border border-[#E5E0D5] p-6 sm:p-10 space-y-8 shadow-xs">
        {/* Header & Download Action */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#E5E0D5]">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" />
              <span>Real-Time Academic Audit for {selectedCourse.code}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0D1B2A] tracking-tight">
              Exam Feasibility &amp; Passing Verdict
            </h2>
          </div>

          <AnimatedButton
            type="button"
            shimmer={false}
            onClick={handleDownloadPDF}
            className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-[#0D1B2A] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer shadow-xs whitespace-nowrap"
          >
            <Download className="w-4 h-4 text-amber-300" />
            <span>Download Official PDF Report</span>
          </AnimatedButton>
        </div>

        {/* Circular Gauge & Status Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Circular SVG Gauge (4 cols) */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-3xl bg-white/85 border border-slate-200/80 shadow-2xs">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-200"
                  fill="transparent"
                />
                {/* Progress Ring */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray="264"
                  initial={{ strokeDashoffset: 264 }}
                  animate={{
                    strokeDashoffset:
                      264 -
                      (264 *
                        Math.min(
                          100,
                          (calculations.earnedWeightedPercent / (100 - activeWeights.final)) * 100
                        )) /
                        100
                  }}
                  transition={{ duration: 0.65, ease: EASE_OUT_EXPO }}
                  strokeLinecap="round"
                  className="text-blue-600"
                  fill="transparent"
                />
              </svg>
              {/* Centered Number */}
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tabular-nums">
                  {calculations.earnedWeightedPercent.toFixed(1)}%
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Sessional Marks
                </span>
                <span className="text-[10px] text-blue-600 font-semibold">
                  out of {100 - activeWeights.final}%
                </span>
              </div>
            </div>

            <div className="text-center pt-3 space-y-1">
              <strong className="text-xs font-bold text-slate-800 block">
                First-Half Collective Rate: {calculations.firstHalfRate.toFixed(1)}%
              </strong>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-block ${
                calculations.firstHalfPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {calculations.firstHalfPassed ? '✓ 20% First-Half Rule Met' : '⚠ First-Half Rule Failed (<20%)'}
              </span>
            </div>
          </div>

          {/* Core Findings & Pass Target Box (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Primary Pass Target Banner */}
            <div className="relative overflow-hidden p-6 rounded-2xl bg-[#0D1B2A] text-white space-y-3 border border-white/10 shadow-sm">
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-300" />
                  <span>Passing Target for {passingThreshold}% Aggregate</span>
                </span>
                <span className="px-3 py-1 rounded-xl bg-[#132238] border border-white/10 text-white text-[11px] font-bold font-mono">
                  Final Exam: {finalTotalMarks} Marks
                </span>
              </div>

              <div className="relative z-10 flex flex-col sm:flex-row sm:items-baseline gap-2">
                <h3 className="text-3xl sm:text-4xl font-black text-white font-mono tabular-nums">
                  {calculations.finalRawForPass} / {finalTotalMarks} Marks
                </h3>
                <span className="text-sm font-semibold text-slate-300">
                  ({calculations.finalPercentForPass.toFixed(1)}% required in paper)
                </span>
              </div>

              <p className="relative z-10 text-xs text-slate-300 leading-relaxed max-w-xl">
                To satisfy both the <strong className="text-white">20% Final Term independent rule</strong> (min {calculations.final20PercentMarks} marks) and the <strong className="text-white">{passingThreshold}% overall course passing aggregate</strong>, you must score at least <strong className="text-amber-300">{calculations.finalRawForPass} marks</strong> in the final examination.
              </p>
            </div>

            {/* Three Real VU Compliance Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className={`p-3.5 rounded-xl border ${
                calculations.firstHalfPassed ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
              }`}>
                <span className="font-bold text-[#0D1B2A] block mb-0.5">1. First-Half 20% Rule</span>
                <span className={`font-semibold ${calculations.firstHalfPassed ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {calculations.firstHalfPassed ? '✓ Satisfied' : '✗ Danger: <20%'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
                <span className="font-bold text-[#0D1B2A] block mb-0.5">2. Final Term 20% Floor</span>
                <span className="font-semibold text-blue-700">
                  Min {calculations.final20PercentMarks} / {finalTotalMarks} Marks
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F3EFE6] border border-[#DDD6C8]">
                <span className="font-bold text-[#0D1B2A] block mb-0.5">3. Final Weight Remaining</span>
                <span className="font-semibold text-[#0D1B2A]">
                  {activeWeights.final}% of Course Grade
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Interactive "What-If" Final Term Score Explorer */}
        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Compass className="w-4 h-4 text-blue-600" />
                <span>Interactive Final Exam Score Explorer ("What If I Score...?")</span>
              </h3>
              <p className="text-xs text-slate-500">
                Slide to simulate any final exam score and instantly see your predicted course grade and GPA.
              </p>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-slate-900 shadow-2xs">
              Simulated: <span className="text-blue-600">{simulatedFinalScore}</span> / {finalTotalMarks} Marks ({( (simulatedFinalScore/finalTotalMarks)*100 ).toFixed(1)}%)
            </div>
          </div>

          {/* Slider */}
          <div className="space-y-1">
            <input
              type="range"
              min="0"
              max={finalTotalMarks}
              value={simulatedFinalScore}
              onChange={(e) => setSimulatedFinalScore(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0 Marks</span>
              <span className="text-amber-600 font-bold">20% Threshold ({calculations.final20PercentMarks})</span>
              <span>Full ({finalTotalMarks} Marks)</span>
            </div>
          </div>

          {/* Simulation Output Card */}
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${calculations.simColor}`}>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                Simulated Result
              </span>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black font-mono">{calculations.simGrade}</span>
                <div>
                  <strong className="text-sm font-bold block">{calculations.simVerdict}</strong>
                  <span className="text-xs opacity-90">
                    Course Aggregate: <strong>{calculations.simTotalPercent.toFixed(1)}%</strong> · GPA: <strong>{calculations.simGpa.toFixed(2)}</strong>
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectCourse(selectedCourse.code)}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 text-xs font-bold transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
            >
              Study Past Papers for {selectedCourse.code}
            </button>
          </div>
        </div>

        {/* 7. Target Grade Matrix Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              <span>Required Final Term Marks For Every VU Grade Tier</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">Official 4.00 Grade Point Scale</span>
          </div>

          <div className="overflow-x-auto border border-[#E5E0D5] rounded-2xl shadow-2xs bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0D1B2A] border-b border-white/10 text-white font-bold">
                <tr>
                  <th className="py-3 px-4">Target Grade</th>
                  <th className="py-3 px-4">Grade Points</th>
                  <th className="py-3 px-4">Min. Aggregate</th>
                  <th className="py-3 px-4">Required Final Marks (/{finalTotalMarks})</th>
                  <th className="py-3 px-4">Paper Percentage</th>
                  <th className="py-3 px-4">Feasibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {calculations.targets.map((tgt) => (
                  <tr key={tgt.grade} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      <span>{tgt.grade}</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">{tgt.gpa.toFixed(2)}</td>
                    <td className="py-3 px-4 text-slate-600">{tgt.minPercent}%</td>
                    <td className="py-3 px-4 font-bold text-slate-900 font-mono">
                      {tgt.status === 'impossible' ? (
                        <span className="text-rose-600 font-semibold">Exceeds 100%</span>
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
                          <span>Highly Attainable</span>
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
                          <span>Unattainable</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E5E0D5]">
          <div className="text-xs text-slate-500">
            All calculations strictly verify Virtual University Two-Half examination assessment guidelines.
          </div>
          <AnimatedButton
            type="button"
            shimmer={false}
            onClick={handleDownloadPDF}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0D1B2A] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer shadow-xs whitespace-nowrap"
          >
            <Download className="w-4 h-4 text-amber-300" />
            <span>Download Official PDF Report</span>
          </AnimatedButton>
        </div>
      </ScrollReveal>

      {/* 8. Official VU Regulations FAQ & Rules Guide */}
      <ScrollReveal className="bg-white rounded-2xl border border-[#E5E0D5] shadow-xs p-6 sm:p-8 space-y-6">
        <h2 className="text-lg font-bold text-[#0D1B2A] flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-700" />
          <span>Official Virtual University Examination Policies (Verified)</span>
        </h2>

        <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 leading-relaxed">
          <StaggerItem className="bg-[#FAF8F4] p-5 rounded-xl border border-[#E5E0D5] space-y-2">
            <h3 className="font-bold text-[#0D1B2A] text-sm">1. The Two-Half Evaluation Model</h3>
            <p>
              Under official Virtual University regulations, course assessment is split into two halves: <strong>First Half (Sessional work + Midterm)</strong> and <strong>Second Half (Final Term examination)</strong>. A student must achieve at least 20% in the First Half and at least 20% in the Second Half independently.
            </p>
          </StaggerItem>

          <StaggerItem className="bg-[#FAF8F4] p-5 rounded-xl border border-[#E5E0D5] space-y-2">
            <h3 className="font-bold text-[#0D1B2A] text-sm">2. Passing Aggregate Threshold</h3>
            <p>
              In addition to the 20% independent requirements, the total weighted cumulative score of both halves combined must equal or exceed <strong>50% (Standard D grade)</strong> or the university&apos;s <strong>40% floor rule</strong> depending on the course announcement.
            </p>
          </StaggerItem>

          <StaggerItem className="bg-[#FAF8F4] p-5 rounded-xl border border-[#E5E0D5] space-y-2">
            <h3 className="font-bold text-[#0D1B2A] text-sm">3. Missed Midterm Exam</h3>
            <p>
              If a student is unable to appear for the Midterm Exam on their scheduled date, they receive 0 marks for that component. However, they can apply for <strong>Rescheduled Examinations</strong> through the official VULMS link by paying the designated rescheduling fee within the announced window.
            </p>
          </StaggerItem>

          <StaggerItem className="bg-[#FAF8F4] p-5 rounded-xl border border-[#E5E0D5] space-y-2">
            <h3 className="font-bold text-[#0D1B2A] text-sm">4. Course Repeat &amp; Grade Improvement</h3>
            <p>
              Any course with an &ldquo;F&rdquo; grade must be repeated in a subsequent semester during Course Selection. Courses with &ldquo;D&rdquo; or &ldquo;D+&rdquo; grades can also be repeated to improve cumulative CGPA and escape academic probation.
            </p>
          </StaggerItem>
        </StaggerGrid>
      </ScrollReveal>
    </div>
  );
};
