import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, 
  Search, 
  Calendar, 
  RotateCcw, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Globe, 
  FileText, 
  Layers, 
  Clock, 
  HelpCircle, 
  Phone, 
  ShieldCheck, 
  Calculator,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Zap,
  Sparkles,
  Info
} from 'lucide-react';

interface GuideItem {
  id: string;
  category: 'exams' | 'reschedule' | 'grading' | 'course-selection' | 'sessional' | 'overseas' | 'services' | 'portals';
  title: string;
  shortDesc: string;
  details: string[];
  tips?: string;
  officialLinks?: Array<{ label: string; url: string }>;
  tags: string[];
  isImportant?: boolean;
}

const GUIDE_ITEMS: GuideItem[] = [
  // 1. Examinations & Date Sheet
  {
    id: 'datesheet-creation',
    category: 'exams',
    title: 'Datesheet Creation & "First-Come, First-Served" Rule',
    shortDesc: 'How to make your exam date sheet on datesheet.vu.edu.pk without paying late fees.',
    details: [
      'VU does not assign fixed exam dates automatically; students must build their own datesheet through datesheet.vu.edu.pk using their VULMS credentials.',
      'Seats at each campus/exam center and time slot are strictly allocated on a first-come, first-served basis. Popular slots fill up within minutes of the link opening.',
      'All exam times are in Pakistan Standard Time (PST), applicable to both local and overseas students.',
      'Late Fee Policy: Missing the announced datesheet deadline incurs a late fee of PKR 500 (Local) / $20 (Overseas). Missing the secondary deadline incurs a double late fee of PKR 1,000 (Local) / $25 (Overseas).'
    ],
    tips: 'Log in within the first 30 minutes of datesheet link activation to secure your preferred morning/afternoon time slots at your nearest campus.',
    officialLinks: [
      { label: 'Official Datesheet Portal', url: 'https://datesheet.vu.edu.pk/' }
    ],
    tags: ['datesheet', 'exams', 'late fee', 'slots', 'center'],
    isImportant: true
  },
  {
    id: 'exam-slip-mandatory',
    category: 'exams',
    title: 'Mandatory Exam Hall Documents & Unfair Means (UFM)',
    shortDesc: 'Original CNIC/Passport + Printed Exam Entrance Slip are compulsory.',
    details: [
      'You MUST bring your printed Exam Entrance Slip (Roll No Slip) downloaded from datesheet.vu.edu.pk.',
      'Original CNIC, B-Form (for minors), Passport, or original VU Student ID card is mandatory for identity verification at the entrance gate.',
      'Strictly Prohibited: Mobile phones, smartwatches, recording devices, Bluetooth headphones, notes, and handbags are strictly banned inside the exam hall.',
      'Critical Warning: Writing any calculations, notes, or scribbles on the back or margins of your printed Exam Entrance Slip is classified as an official Unfair Means (UFM) case and can lead to semester cancellation.'
    ],
    tips: 'Use the scratch paper / rough sheet provided by the center invigilator for rough work, never your roll no slip.',
    officialLinks: [
      { label: 'VU Examination Rules', url: 'https://www.vu.edu.pk/' }
    ],
    tags: ['entrance slip', 'cnic', 'ufm', 'exam hall', 'scratch paper'],
    isImportant: true
  },

  // 2. Paper Rescheduling
  {
    id: 'rescheduling-procedure',
    category: 'reschedule',
    title: 'Missed Exam Rescheduling Policy & Fee',
    shortDesc: 'PKR 2,000 per paper fee, 24-hour window, and application on VULMS.',
    details: [
      'If you miss a Midterm or Final Term exam due to illness, travel, or unavoidable emergency, you can apply for rescheduling ONLY ONCE.',
      'Where to Apply: VULMS > Student Services > Examinations Department > "Apply for Rescheduling of Papers".',
      'Availability: A missed paper becomes available in the rescheduling portal approximately 24 hours after its scheduled time slot has passed.',
      'Prescribed Fee: PKR 2,000 per paper for local students, and $25 per paper for overseas students. The fee is non-refundable whether you sit for the rescheduled exam or not.',
      'Payment Deadline: The generated rescheduling fee voucher must be paid before the official semester result announcement.',
      'Death of Immediate Relative: Rescheduled completely free of charge upon submitting a death certificate within 7 days of the missed paper.'
    ],
    tips: 'Rescheduled exams are always conducted on the final days of the overall university examination schedule.',
    officialLinks: [
      { label: 'VULMS Student Services', url: 'https://vulms.vu.edu.pk/' }
    ],
    tags: ['reschedule', 'missed paper', 'fee', '2000 pkr', 'death certificate'],
    isImportant: true
  },

  // 3. Grading, GPA & Academic Probation
  {
    id: 'two-half-rule',
    category: 'grading',
    title: 'The Official "Two-Half" 20% Evaluation Method',
    shortDesc: 'Must score >= 20% in First Half, >= 20% in Final Term, and >= 50% / 40% aggregate.',
    details: [
      'First Half Requirement: You must score at least 20% of collective marks in sessional work (Quizzes + Assignments + GDB + Midterm).',
      'Second Half Requirement: You must score at least 20% marks in the Final Term examination paper independently (e.g., minimum 12 marks in a 60-mark paper).',
      'Overall Course Aggregate: Total combined weighted score must equal or exceed 50% (Standard D-Grade) or 40% (VU Passing Floor).',
      'Violating ANY single condition results in an automatic "F" grade, even if your total percentage is numerically high!'
    ],
    tips: 'Use our Exam Passing Simulator tool (/simulator) to calculate your exact required final paper marks in real time.',
    officialLinks: [
      { label: 'Open Passing Simulator', url: '/simulator' }
    ],
    tags: ['two half rule', '20 percent', 'passing marks', 'final term', 'sessional'],
    isImportant: true
  },
  {
    id: 'cgpa-probation-rules',
    category: 'grading',
    title: 'Academic Warning & CGPA Probation Thresholds',
    shortDesc: '1st Semester minimum CGPA 1.50, 2nd+ Semester minimum CGPA 2.00.',
    details: [
      'First Semester Threshold: CGPA below 1.50 places the student on Academic Warning / First Probation.',
      'Second & Subsequent Semesters: CGPA below 2.00 triggers Academic Probation.',
      'Workload Reduction Penalty: A student on academic probation is restricted to a maximum of 12 credit hours (instead of 18) during course selection to focus on improving low grades.',
      'Dismissal Notice: Two consecutive probations result in a serious academic review. To graduate, a minimum cumulative CGPA of 2.00 (out of 4.00) is mandatory across all BS/Associate Degree programs.'
    ],
    tips: 'Always repeat low "D" or "D+" grades in initial semesters because early courses have the biggest mathematical impact on your CGPA.',
    tags: ['probation', 'cgpa', 'warning', '1.50', '2.00', 'dismissal'],
    isImportant: true
  },

  // 4. Course Selection & Workload
  {
    id: 'course-selection-limits',
    category: 'course-selection',
    title: 'Course Selection Credit Hours Policy',
    shortDesc: 'Max credit hours allowed based on your current cumulative CGPA.',
    details: [
      'CGPA >= 3.00 (High Achievers): Permitted to select an overload of up to 21 credit hours (usually 7 subjects).',
      'CGPA 2.00 to 2.99 (Standard Standing): Permitted standard workload of up to 18 credit hours (6 subjects).',
      'CGPA < 2.00 (Academic Probation): Restricted to a maximum of 12 credit hours (4 subjects).',
      'Prerequisites: You cannot enroll in advanced courses until prerequisite courses are passed (e.g., CS201 must be passed before CS301; MTH101 before MTH202).',
      'Repeating Passed Courses: Any course passed with a "D" grade (1.00 GPA) can be repeated once to improve your CGPA.'
    ],
    tips: 'Never take maximum overload if you are working a full-time job. 5 well-prepared subjects give a much higher CGPA than 7 rushed subjects.',
    officialLinks: [
      { label: 'VULMS Course Selection', url: 'https://vulms.vu.edu.pk/' }
    ],
    tags: ['course selection', 'credit hours', 'prerequisites', 'cgpa overload', 'repeating']
  },

  // 5. Sessional Activities (Assignments, Quizzes, GDB)
  {
    id: 'assignments-grace-period',
    category: 'sessional',
    title: 'Assignment Submissions & 24-Hour Grace Period',
    shortDesc: 'The 24-hour grace window, MS Word format, and anti-plagiarism MOSS rules.',
    details: [
      '24-Hour Grace Period: Almost all assignments feature a 24-hour grace period after the official due date (unless specifically disabled in the announcement).',
      'Format Standards: Submissions must be uploaded as .doc or .docx (MS Word) or .cpp/.zip as specified. Never submit corrupted or password-protected files.',
      'Plagiarism & MOSS Check: Virtual University employs automated code similarity checkers (MOSS) and Turnitin. If your assignment matches another student or YouTube/WhatsApp group files, you will receive ZERO marks without appeal.',
      'MathType for Mathematics: Courses like MTH101, MTH202, and PHY101 require equations formatted via MathType or MS Word Equation Editor.'
    ],
    tips: 'Submit during regular hours. If you submit during the 24-hour grace period and experience a power outage, no further extension will be given.',
    tags: ['assignment', 'grace period', 'plagiarism', 'moss', 'mathtype', 'zero marks']
  },
  {
    id: 'quiz-and-gdb-guidelines',
    category: 'sessional',
    title: 'Quizzes (90 Seconds Rule) & Graded Discussion Boards (GDB)',
    shortDesc: 'Timer rules, no-tab-switching advice, and 200-word GDB limits.',
    details: [
      'Quiz Timer: Each MCQ question has a strict 90-second countdown timer. Once the timer expires, the question submits automatically.',
      'Browser Stability: Do not refresh, press the back button, or switch tabs excessively during a quiz; doing so may force-submit your session.',
      'Grand Quizzes: During semesters where physical midterms are replaced, a Grand Quiz comprising 30 MCQs in 24 hours covers Lectures 1 to 22.',
      'GDB Word Limit: Graded Discussion Boards carry 3-5% weightage. The answer must be posted directly in the LMS text box (no attachments) within 150-200 words.',
      'One-Time Submission: GDB cannot be edited, deleted, or re-posted once submitted.'
    ],
    tags: ['quiz', 'gdb', '90 seconds', 'grand quiz', 'word limit']
  },

  // 6. Overseas Students Policy
  {
    id: 'overseas-exam-setup',
    category: 'overseas',
    title: 'Overseas Student Online Examination Regulations',
    shortDesc: 'External webcam mandate, VUTES software, and Pakistan travel rules.',
    details: [
      'External Webcam Mandatory: Built-in laptop webcams are strictly prohibited. You must connect a standalone USB external webcam positioned to show your hands, face, screen, and surrounding room.',
      'Monitoring Software: Remote proctoring is conducted via VUTES and remote assistance tools (e.g. AnyViewer or RustDesk).',
      'Internet Redundancy: Overseas candidates must maintain an uninterrupted high-speed internet connection and power backup throughout the exam duration.',
      'Travel to Pakistan Rule: If an overseas student travels to Pakistan during scheduled examination dates, they CANNOT sit for the online overseas exam from Pakistan. They must apply for study status change and appear physically at a local VU campus.'
    ],
    tips: 'Test your external webcam angle and microphone 48 hours prior to exam day with the overseas support team.',
    officialLinks: [
      { label: 'VU Overseas Directorate', url: 'https://overseas.vu.edu.pk/' }
    ],
    tags: ['overseas', 'webcam', 'vutes', 'proctoring', 'anyviewer', 'travel to pakistan']
  },

  // 7. VULMS Student Services
  {
    id: 'campus-change-freeze',
    category: 'services',
    title: 'Campus Change & Semester Freeze Procedures',
    shortDesc: 'How to switch your assigned campus or freeze a semester safely.',
    details: [
      'Campus Change: Applied via VULMS > Student Services > Campus Change. You can transfer freely between any Virtual University campus in Pakistan without losing academic records.',
      'Semester Freeze: If you cannot continue studies due to personal/work reasons, apply to freeze the semester before the announced mid-term deadline.',
      'Maximum Freeze Limit: You are allowed to freeze a maximum of 2 consecutive semesters. Freezing beyond 2 consecutive semesters without permission leads to cancellation of admission.',
      'De-freeze: You must apply for "Unfreeze / De-freeze" before the commencement of the subsequent semester during the course selection window.'
    ],
    officialLinks: [
      { label: 'VULMS Student Services', url: 'https://vulms.vu.edu.pk/' }
    ],
    tags: ['campus change', 'semester freeze', 'defreeze', 'student services']
  },
  {
    id: 'transcript-degree-issuance',
    category: 'services',
    title: 'Transcripts, Provisional Certificates & HEC Attestation',
    shortDesc: 'Procedure for obtaining official transcripts, urgent degrees, and HEC clearance.',
    details: [
      'Completion of Credit Hours: After passing all required degree credit hours and achieving a CGPA >= 2.00, your status updates to "Degree Completed".',
      'Applying for Documents: Navigate to VULMS > Student Services > Examination Department > Apply for Transcript / Degree.',
      'Urgent vs Normal Processing: Normal degree processing takes 4-6 weeks after final result audit; urgent processing can be requested with the designated fee.',
      'HEC Attestation: Official VU degrees and transcripts are recognized by the Higher Education Commission (HEC) for both local employment and international embassy visas.'
    ],
    officialLinks: [
      { label: 'HEC E-Services Portal', url: 'https://eservices.hec.gov.pk/' }
    ],
    tags: ['transcript', 'degree', 'provisional', 'hec attestation', 'graduation']
  },

  // 8. Official Portals & Contact Directory
  {
    id: 'official-contacts-helpdesk',
    category: 'portals',
    title: 'Official VU Support Ticketing System & Helpdesk',
    shortDesc: 'Official ticketing portal, fee payment channels, and central helpline.',
    details: [
      'Support System: VU does not handle student queries via general email anymore. All complaints and inquiries must be submitted as tickets via support.vu.edu.pk.',
      'Categorized Ticket Routing: Select the exact department (Examinations, Finance/Accounts, Registrar Admissions, Course Selection, or IT Helpdesk) for fast 24-48 hour resolution.',
      'Fee Payment Channels: VU fees can be paid 24/7 without extra charges via 1Link 1Bill, EasyPaisa, JazzCash, KUICKPAY, ATM, and designated banks (HBL, Bank Alfalah).',
      'Central Helpline: UAN (042) 111-880-880 (Monday to Friday, 9:00 AM - 5:00 PM PST).',
      'Head Office Address: Virtual University of Pakistan, M.A. Jinnah Campus, Defence Road, Off Raiwind Road, Lahore.'
    ],
    officialLinks: [
      { label: 'Official VU Support Ticket Portal', url: 'https://www.vu.edu.pk/SupportSystem/login.aspx' },
      { label: 'VU Official Main Website', url: 'https://www.vu.edu.pk/' }
    ],
    tags: ['support', 'ticket', 'helpdesk', 'fee payment', '1link', 'helpline', 'uan']
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All Knowledge Base', icon: BookOpen },
  { id: 'exams', label: 'Exams & Date Sheet', icon: Calendar },
  { id: 'reschedule', label: 'Paper Rescheduling', icon: RotateCcw },
  { id: 'grading', label: 'Grading & Probation', icon: Award },
  { id: 'course-selection', label: 'Course Selection', icon: Layers },
  { id: 'sessional', label: 'Assignments & Quizzes', icon: Clock },
  { id: 'overseas', label: 'Overseas Students', icon: Globe },
  { id: 'services', label: 'Student Services', icon: ShieldCheck },
  { id: 'portals', label: 'Official Contacts', icon: Phone }
];

interface StudentHandbookPageProps {
  onNavigateToSimulator: () => void;
  onNavigateToCourses: () => void;
}

export const StudentHandbookPage: React.FC<StudentHandbookPageProps> = ({
  onNavigateToSimulator,
  onNavigateToCourses
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set(['datesheet-creation', 'rescheduling-procedure', 'two-half-rule'])
  );

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    setExpandedItems(new Set(GUIDE_ITEMS.map((g) => g.id)));
  };

  const collapseAll = () => {
    setExpandedItems(new Set());
  };

  const filteredItems = useMemo(() => {
    return GUIDE_ITEMS.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.shortDesc.toLowerCase().includes(q);
        const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
        const matchDetails = item.details.some((d) => d.toLowerCase().includes(q));
        return matchTitle || matchDesc || matchTags || matchDetails;
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
      {/* 1. Page Header */}
      <div className="space-y-4 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
          <GraduationCap className="w-4 h-4 text-blue-600" />
          <span>VIRTUAL UNIVERSITY ACADEMIC HANDBOOK & ESSENTIALS</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          The Essential VU Student Knowledge Base
        </h1>

        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          Everything a Virtual University of Pakistan student normally needs to know: verified examination procedures, the <strong>20% Two-Half passing rule</strong>, missed paper rescheduling (PKR 2,000 policy), CGPA probation limits, assignment grace periods, and official support directories.
        </p>

        {/* Quick Highlights Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase block mb-0.5">Reschedule Fee</span>
            <strong className="text-sm sm:text-base font-black text-blue-700 font-mono">PKR 2,000</strong>
            <span className="text-[10px] text-slate-400 block">$25 for Overseas</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase block mb-0.5">Two-Half Rule</span>
            <strong className="text-sm sm:text-base font-black text-emerald-700 font-mono">Min 20% + 20%</strong>
            <span className="text-[10px] text-slate-400 block">Sessional & Final Term</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase block mb-0.5">Probation Threshold</span>
            <strong className="text-sm sm:text-base font-black text-amber-700 font-mono">&lt; 2.00 CGPA</strong>
            <span className="text-[10px] text-slate-400 block">1.50 in 1st Semester</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase block mb-0.5">Official Helpdesk</span>
            <strong className="text-sm sm:text-base font-black text-purple-700 font-mono">Support System</strong>
            <span className="text-[10px] text-slate-400 block">support.vu.edu.pk</span>
          </div>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Live Search Box */}
          <div className="relative flex-1 max-w-xl">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search e.g. datesheet, reschedule, 20%, probation, grace period, credit hours..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium rounded-2xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-slate-900 bg-slate-50/50"
            />
          </div>

          {/* Expand / Collapse All Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={expandAll}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Expand All
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            const count = cat.id === 'all' 
              ? GUIDE_ITEMS.length 
              : GUIDE_ITEMS.filter((g) => g.category === cat.id).length;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Knowledge Items List */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
            <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No matching handbook items found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try searching with another keyword like "reschedule", "datesheet", "passing", or select "All Knowledge Base".
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isExpanded = expandedItems.has(item.id);

            return (
              <div
                key={item.id}
                className={`bg-white rounded-3xl border transition-all duration-200 overflow-hidden ${
                  isExpanded ? 'border-blue-300 shadow-md ring-1 ring-blue-100' : 'border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                {/* Header Row */}
                <div
                  onClick={() => toggleExpand(item.id)}
                  className="p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {item.isImportant && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px] uppercase tracking-wider">
                          Must Know
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono font-semibold text-[10px] uppercase tracking-wider">
                        {item.category.replace('-', ' ')}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                      {item.shortDesc}
                    </p>
                  </div>

                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-100 space-y-5 animate-in fade-in duration-150">
                    {/* Bullet Points */}
                    <div className="space-y-2.5">
                      {item.details.map((detail, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>

                    {/* Pro Tip Box if available */}
                    {item.tips && (
                      <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200/60 flex items-start gap-3">
                        <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <div className="text-xs text-blue-900 leading-relaxed">
                          <strong className="font-bold block text-blue-950 mb-0.5">Student Advice / Pro-Tip:</strong>
                          <span>{item.tips}</span>
                        </div>
                      </div>
                    )}

                    {/* Links & Tags Footer */}
                    <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Official Links */}
                      {item.officialLinks && item.officialLinks.length > 0 && (
                        <div className="flex items-center gap-2">
                          {item.officialLinks.map((link) => (
                            <a
                              key={link.url}
                              href={link.url}
                              target={link.url.startsWith('http') ? '_blank' : '_self'}
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] transition-colors shadow-2xs"
                            >
                              <span>{link.label}</span>
                              <ExternalLink className="w-3 h-3 text-blue-300" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 4. Interactive Callout Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Banner 1: Passing Simulator */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-blue-950 text-white space-y-4 shadow-md flex flex-col justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-300 uppercase tracking-wider">
              <Calculator className="w-4 h-4 text-amber-400" />
              <span>Two-Half 20% Rule Engine</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              Test Your Exam Passing Marks Live
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Wondering how many marks you need in the Final Term exam to pass or hit an A grade? Use our real-time simulator to check your exact compliance status and download an executive PDF report.
            </p>
          </div>

          <button
            type="button"
            onClick={onNavigateToSimulator}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-xs active:scale-98"
          >
            <span>Open Passing Marks Simulator</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        {/* Banner 2: 411 Course Library */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>28,328+ Verified Study Files</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Explore All 411 Real VU Courses
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Access handouts, solved past papers, grand quiz files, and mid/final term preparation notes for CS101, MTH101, ENG101, MGT101, and 400+ other real courses with our in-browser reader.
            </p>
          </div>

          <button
            type="button"
            onClick={onNavigateToCourses}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-xs active:scale-98"
          >
            <span>Browse 411 Course Directory</span>
            <ExternalLink className="w-4 h-4 text-blue-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
