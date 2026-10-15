import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  RotateCcw, 
  BookOpen, 
  HelpCircle, 
  ChevronRight,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface SemesterCourse {
  id: string;
  name: string;
  creditHours: number;
  grade: string;
}

const VU_GRADE_POINTS: Record<string, { points: number; label: string; marksRange: string }> = {
  'A': { points: 4.00, label: 'A (Outstanding)', marksRange: '85% – 100%' },
  'A-': { points: 3.66, label: 'A- (Excellent)', marksRange: '80% – 84%' },
  'B+': { points: 3.33, label: 'B+ (Very Good)', marksRange: '75% – 79%' },
  'B': { points: 3.00, label: 'B (Good)', marksRange: '71% – 74%' },
  'B-': { points: 2.66, label: 'B- (Above Average)', marksRange: '68% – 70%' },
  'C': { points: 2.00, label: 'C (Average / Pass)', marksRange: '61% – 67%' },
  'D': { points: 1.00, label: 'D (Marginal Pass)', marksRange: '50% – 60%' },
  'F': { points: 0.00, label: 'F (Fail)', marksRange: 'Below 50%' }
};

interface VUGPACalculatorPageProps {
  onNavigateHome: () => void;
  onSelectCourse?: (code: string) => void;
}

export const VUGPACalculatorPage: React.FC<VUGPACalculatorPageProps> = ({ onNavigateHome, onSelectCourse }) => {
  // Semester Calculator State
  const [courses, setCourses] = useState<SemesterCourse[]>([
    { id: '1', name: 'CS101', creditHours: 3, grade: 'A' },
    { id: '2', name: 'MTH101', creditHours: 3, grade: 'B+' },
    { id: '3', name: 'ENG101', creditHours: 3, grade: 'A-' },
    { id: '4', name: 'PAK301', creditHours: 2, grade: 'B' },
    { id: '5', name: 'ISL202', creditHours: 1, grade: 'A' }
  ]);

  // Cumulative CGPA Forecaster State
  const [prevCgpa, setPrevCgpa] = useState<number>(3.15);
  const [prevCreditHours, setPrevCreditHours] = useState<number>(36);

  // Calculations
  const semesterStats = useMemo(() => {
    let totalCredits = 0;
    let totalGradePoints = 0;

    courses.forEach(c => {
      const g = VU_GRADE_POINTS[c.grade];
      if (g && c.creditHours > 0) {
        totalCredits += c.creditHours;
        totalGradePoints += g.points * c.creditHours;
      }
    });

    const gpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;
    return {
      totalCredits,
      totalGradePoints,
      gpa: Math.round(gpa * 100) / 100
    };
  }, [courses]);

  // Combined Cumulative CGPA
  const cumulativeStats = useMemo(() => {
    const prevWeighted = (prevCgpa || 0) * (prevCreditHours || 0);
    const newWeighted = semesterStats.totalGradePoints;
    const combinedCredits = (prevCreditHours || 0) + semesterStats.totalCredits;

    const newCgpa = combinedCredits > 0 ? (prevWeighted + newWeighted) / combinedCredits : 0;
    return {
      combinedCredits,
      newCgpa: Math.round(newCgpa * 100) / 100,
      diff: Math.round((newCgpa - prevCgpa) * 100) / 100
    };
  }, [prevCgpa, prevCreditHours, semesterStats]);

  const addCourse = () => {
    const nextNum = courses.length + 1;
    setCourses([
      ...courses,
      { id: Date.now().toString(), name: `Course ${nextNum}`, creditHours: 3, grade: 'B' }
    ]);
  };

  const removeCourse = (id: string) => {
    if (courses.length <= 1) return;
    setCourses(courses.filter(c => c.id !== id));
  };

  const updateCourse = (id: string, field: keyof SemesterCourse, value: any) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const resetToDefault = () => {
    setCourses([
      { id: '1', name: 'CS201', creditHours: 3, grade: 'A' },
      { id: '2', name: 'CS301', creditHours: 3, grade: 'B+' },
      { id: '3', name: 'MTH202', creditHours: 3, grade: 'B' },
      { id: '4', name: 'CS302', creditHours: 3, grade: 'A-' }
    ]);
    setPrevCgpa(3.0);
    setPrevCreditHours(30);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <a href="/" onClick={(e) => { e.preventDefault(); onNavigateHome(); }} className="hover:text-blue-600 transition-colors">
          Home
        </a>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 font-semibold">VU GPA &amp; CGPA Calculator</span>
      </nav>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 sm:p-10 border border-slate-800 shadow-xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-medium">
            <Calculator className="w-3.5 h-3.5" />
            <span>OFFICIAL 4.0 SCALE • HEC &amp; VU GRADING SCHEME</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            VU GPA &amp; CGPA Calculator &amp; Academic Forecaster
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Calculate your semester GPA, forecast your cumulative CGPA, check academic probation thresholds, and simulate grade improvements under the official Virtual University 4.0 grading scale.
          </p>
        </div>
      </div>

      {/* Main Grid: Interactive Calculator + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col (8 cols): Semester Calculator Tool */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  Semester Courses &amp; Grade Points
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter your enrolled courses, credit hours, and expected letter grades.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetToDefault}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-medium transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
                <button
                  type="button"
                  onClick={addCourse}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Course
                </button>
              </div>
            </div>

            {/* Courses Table */}
            <div className="space-y-3">
              <div className="hidden sm:grid grid-cols-12 gap-3 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <div className="col-span-5">Course Code / Name</div>
                <div className="col-span-3">Credit Hours</div>
                <div className="col-span-3">Expected Grade</div>
                <div className="col-span-1 text-center">Action</div>
              </div>

              {courses.map((course, idx) => {
                const gp = VU_GRADE_POINTS[course.grade]?.points ?? 0;
                return (
                  <div 
                    key={course.id}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center p-3 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:border-blue-200 transition-colors"
                  >
                    <div className="sm:col-span-5">
                      <label className="sm:hidden block text-[11px] font-semibold text-slate-500 mb-1">
                        Course Code
                      </label>
                      <input
                        type="text"
                        value={course.name}
                        onChange={(e) => updateCourse(course.id, 'name', e.target.value.toUpperCase())}
                        placeholder="e.g. CS101"
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-900 font-mono font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="sm:hidden block text-[11px] font-semibold text-slate-500 mb-1">
                        Credit Hours
                      </label>
                      <select
                        value={course.creditHours}
                        onChange={(e) => updateCourse(course.id, 'creditHours', parseInt(e.target.value, 10))}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={1}>1 Credit Hour</option>
                        <option value={2}>2 Credit Hours</option>
                        <option value={3}>3 Credit Hours</option>
                        <option value={4}>4 Credit Hours</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="sm:hidden block text-[11px] font-semibold text-slate-500 mb-1">
                        Grade Point
                      </label>
                      <select
                        value={course.grade}
                        onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {Object.entries(VU_GRADE_POINTS).map(([code, meta]) => (
                          <option key={code} value={code}>
                            {code} ({meta.points.toFixed(2)}) – {meta.marksRange}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-1 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeCourse(course.id)}
                        disabled={courses.length <= 1}
                        className="p-1.5 text-slate-400 hover:text-rose-600 disabled:opacity-30 disabled:hover:text-slate-400 rounded-lg transition-colors"
                        title="Remove Course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Summary Pill Bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                Total Semester Credits: <strong className="text-slate-900">{semesterStats.totalCredits} Cr. Hrs</strong>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-500 uppercase">Calculated Semester GPA:</span>
                <span className="text-2xl font-black text-blue-600 font-mono">
                  {semesterStats.gpa.toFixed(2)}
                </span>
                <span className="text-xs text-slate-400 font-mono">/ 4.00</span>
              </div>
            </div>
          </div>

          {/* Cumulative CGPA Forecaster Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Cumulative CGPA Forecaster &amp; Academic Projection
                </h3>
                <p className="text-xs text-slate-500">
                  Input your existing transcript record to see how this semester shifts your overall degree CGPA.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Previous Cumulative CGPA (up to last semester)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4.00"
                  value={prevCgpa}
                  onChange={(e) => setPrevCgpa(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold font-mono text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Total Completed Credit Hours Prior to this Semester
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="140"
                  value={prevCreditHours}
                  onChange={(e) => setPrevCreditHours(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold font-mono text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Projected Result Callout */}
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                  New Projected Degree CGPA
                </div>
                <div className="text-xs text-emerald-700 mt-0.5">
                  Based on {cumulativeStats.combinedCredits} Total Completed Credits
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-700 font-mono">
                  {cumulativeStats.newCgpa.toFixed(2)}
                </span>
                <span className="text-xs font-semibold text-emerald-600">
                  ({cumulativeStats.diff >= 0 ? `+${cumulativeStats.diff.toFixed(2)}` : `${cumulativeStats.diff.toFixed(2)}`})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col (4 cols): Official VU Grading Scale & Rules Reference */}
        <div className="lg:col-span-4 space-y-6">
          {/* Grading Scale Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Official VU Grading Scale
            </h3>
            
            <div className="divide-y divide-slate-100 text-xs">
              {Object.entries(VU_GRADE_POINTS).map(([grade, info]) => (
                <div key={grade} className="py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 w-7">{grade}</span>
                    <span className="text-slate-500">{info.marksRange}</span>
                  </div>
                  <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {info.points.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Probation Alert Box */}
          <div className="bg-amber-50/70 rounded-2xl border border-amber-200/80 p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              VU Academic Probation Rules
            </div>
            <ul className="text-xs text-amber-800/90 space-y-1.5 leading-relaxed">
              <li><strong>1st Semester:</strong> Must maintain CGPA &gt;= <strong>1.75</strong> to avoid probation.</li>
              <li><strong>2nd &amp; Subsequent Semesters:</strong> Must maintain CGPA &gt;= <strong>2.00</strong>.</li>
              <li><strong>Consecutive Probations:</strong> 3 consecutive academic probations will result in degree dismissal.</li>
            </ul>
          </div>

          {/* Course Repeat Quick Link */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-3">
            <div className="text-sm font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              Course Repeat Policy
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Students can repeat any course with a grade of <strong>D</strong> or <strong>F</strong> to improve their CGPA. When repeated, the higher/latest grade points replace the previous grade in CGPA calculation.
            </p>
          </div>
        </div>
      </div>

      {/* Comprehensive Academic Guide & Documentation Section */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
        <div className="max-w-3xl space-y-3">
          <h2 className="text-2xl font-black text-slate-900">
            How GPA and CGPA Are Calculated at Virtual University of Pakistan
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Detailed breakdown of HEC standards, credit hour weighting, semester aggregate determination, and transcript evaluation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-600 leading-relaxed">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              1. Semester GPA (Grade Point Average) Formula
            </h3>
            <p>
              GPA measures academic performance in a single semester. For each course, its credit hours are multiplied by the grade point earned. The sum of these quality points is then divided by the total number of credit hours attempted during that semester.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl font-mono text-xs text-slate-800 border border-slate-200">
              GPA = &sum;(Course Credit Hours &times; Grade Points) / Total Semester Credit Hours
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              2. Cumulative CGPA Calculation
            </h3>
            <p>
              CGPA reflects cumulative academic performance across all completed semesters. It is calculated by dividing the sum of all quality points earned across all semesters by the total number of credit hours completed up to that point.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl font-mono text-xs text-slate-800 border border-slate-200">
              CGPA = &sum;(All Quality Points Earned) / Total Completed Degree Credit Hours
            </div>
          </div>
        </div>

        {/* High Frequency Questions */}
        <div className="pt-6 border-t border-slate-100 space-y-4">
          <h3 className="text-lg font-bold text-slate-900">
            Frequently Asked Questions on VU GPA &amp; Degree Completion
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">
                What is the minimum CGPA required to graduate from Virtual University?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                For 4-year BS and 2-year ADP programs, the minimum cumulative CGPA required for degree award is <strong>2.00 out of 4.00</strong>. For MS/MPhil programs, the required threshold is 2.50.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">
                Does an 'F' grade count towards CGPA calculation?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Yes, an 'F' grade carries 0.00 grade points while the course's credit hours are included in the divisor, which significantly pulls down your CGPA until the course is successfully repeated and cleared.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
