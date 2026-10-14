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
  Info,
  MessageSquare,
  CheckCircle,
  Lightbulb,
  CreditCard
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

export interface FAQItem {
  id: string;
  category: 'sessional' | 'exams' | 'grading' | 'fee-freeze' | 'overseas';
  question: string;
  urduQuestion: string;
  shortAnswer: string;
  detailedPoints: string[];
  actionAdvice?: string;
  isHighFrequency?: boolean;
}

const TOP_VU_FAQS: FAQItem[] = [
  // 1. Sessional & Grace Period FAQs
  {
    id: 'faq-assignment-missed',
    category: 'sessional',
    question: 'If I miss an assignment or score zero, will I fail the course?',
    urduQuestion: 'Agar Assignment miss ho jaye ya zero marks milein to kya subject fail ho jata hai?',
    shortAnswer: 'Bilkul nahi! Sessional activities overall 15-20% weightage rakhti hain. Subject direct fail nahi hota, lekin CGPA par asar parta hai.',
    detailedPoints: [
      'Assignments, Quizzes aur GDBs course ke First Half ka hissa hain jinka total weightage aam tor par 15% se 20% hota hai.',
      'VU ke official 20% Two-Half rule ke mutabiq aapko First Half ke majmooyi (collective) marks mein se kam az kam 20% lene hotay hain, jo ke Midterm exam se asani se cover ho jatay hain.',
      'Kisi aik assignment mein 0 aane se subject fail nahi hota, bas aapki final percentage 3-5% drop hoti hai.'
    ],
    actionAdvice: 'Agar assignment miss ho jaye to bilkul pareshan na hon, aane walay Quizzes aur Midterm paper mein achhi tiyari karke marks cover karein.',
    isHighFrequency: true
  },
  {
    id: 'faq-grace-period',
    category: 'sessional',
    question: 'How does the 24-hour Assignment Grace Period work, and are marks deducted?',
    urduQuestion: 'Assignment mein 24-Hour Grace Period ka kya rule hai aur kya ispar marks kat-tay hain?',
    shortAnswer: 'Due date ke aglay 24 ghantay grace period hota hai aur is doran submit karnay par exact 100% marks miltay hain bina kisi penalty ke!',
    detailedPoints: [
      'Virtual University har regular assignment ke baad 24 ghantay ka grace period automatically enable karti hai.',
      'Grace period ke andar submit karne par koi marks deduction nahi hoti, aapko full evaluation milti hai.',
      'Grace period khatam hotay hi LMS par upload link foran gayab ho jata hai. Virtual University instructors email par assignments kabhi accept nahi karte.'
    ],
    actionAdvice: 'Grace period ko sirf bijli ya internet emergency ke liye reserve rakhein; regular due date par submit karne ko aadat banayein.',
    isHighFrequency: true
  },
  {
    id: 'faq-quiz-disconnect',
    category: 'sessional',
    question: 'Can I retake a quiz if electricity goes off or internet disconnects?',
    urduQuestion: 'Quiz ke doran agar bijli chali jaye ya internet band ho jaye to kya re-take mil sakta hai?',
    shortAnswer: 'Nahi! Virtual University mein quizzes ka koi re-take nahi hota.',
    detailedPoints: [
      'Har MCQ question par 90-second ka server-side countdown timer chalta hai jo browser band hone par bhi rukta nahi.',
      'Agar internet disconnect ho ya browser refresh kiya jaye to current question automatic submit ho jata hai aur baqi sawal skip ho saktay hain.',
      'VU IT department ya instructor ticket generate karne par bhi quiz dobara reset nahi karta.'
    ],
    actionAdvice: 'Quiz attempt karne se pehle laptop ko charge rakhein aur mobile data hotspot ka backup zaroor connectable rakhein.',
    isHighFrequency: true
  },
  {
    id: 'faq-gdb-plagiarism',
    category: 'sessional',
    question: 'What is the word limit for GDB and what happens if I copy-paste?',
    urduQuestion: 'GDB (Graded Discussion Board) mein copy-paste karne se kya hota hai aur word limit kitni hai?',
    shortAnswer: 'Strict 150 se 200 words limit hoti hai aur copy-paste karne par direct ZERO marks miltay hain.',
    detailedPoints: [
      'GDB LMS ke message box mein direct type karke post kiya jata hai (MS Word file upload nahi hoti).',
      'Agar aapka answer kisi doosre student ya internet / YouTube group solution se match ho jaye to automated Turnitin checker 0 marks deta hai.',
      'GDB sirf aik martaba post hota hai; post karne ke baad edit ya delete karne ka koi option nahi hota.'
    ],
    actionAdvice: 'Apne alfaz mein 3-4 mukhtasar conceptual points likhein. Original likhai par pure 3 se 5 marks mil jatay hain.'
  },

  // 2. Exam & Date Sheet FAQs
  {
    id: 'faq-reschedule-procedure',
    category: 'exams',
    question: 'If I miss an exam, when and how can I apply for rescheduling?',
    urduQuestion: 'Agar paper miss ho jaye to reschedule kab aur kaisay apply hota hai?',
    shortAnswer: 'Missed paper ke 24 ghantay baad VULMS Student Services se apply karein, fee PKR 2,000 per paper hai.',
    detailedPoints: [
      'Apply karne ka rasta: VULMS > Student Services > Examinations Department > "Apply for Rescheduling of Papers".',
      'Missed paper actual time slot guzarne ke taqreeban 24 ghantay baad portal par show hota hai.',
      'Rescheduling fee: PKR 2,000 (Local students) aur $25 (Overseas students) per paper hai, jo ke non-refundable hoti hai.',
      'Rescheduled exams semester exam schedule ke aakhri do dino mein conduct hotay hain.',
      'Direct relative ki death ki soorat mein 7 din ke andar death certificate submit karne par fee maaf hoti hai.'
    ],
    actionAdvice: 'Reschedule ki sahulat har paper ke liye sirf aik dafa milti hai, is liye rescheduled time par har soorat center pohnchein.',
    isHighFrequency: true
  },
  {
    id: 'faq-mandatory-documents',
    category: 'exams',
    question: 'What documents are mandatory to enter the VU Examination Hall?',
    urduQuestion: 'Exam Hall mein entry ke liye kaunse documents hona lazmi hain?',
    shortAnswer: 'Printed Exam Entrance Slip (Roll No Slip) + Original CNIC / B-Form / VU Student ID Card / Passport.',
    detailedPoints: [
      'datesheet.vu.edu.pk se print ki hui Exam Entrance Slip lazmi honi chahiye.',
      'Original CNIC ya Nadra B-Form (18 saal se kam umar ke liye) ya Original Passport ya Original VU Student Card.',
      'Mobile phone mein tasweer ya photocopy bilkul qabil-e-qabool nahi hoti.',
      'Mobile phones, smartwatches, handsfree, storage devices, aur bags exam hall ke andar strictly prohibited hain.'
    ],
    actionAdvice: 'Exam se aik din pehle slip ka hardcopy print nikal kar apne bag/wallet mein rakh lein taake subah time zaya na ho.',
    isHighFrequency: true
  },
  {
    id: 'faq-roll-no-slip-writing',
    category: 'exams',
    question: 'Why is rough work or writing strictly prohibited on the Roll No Slip?',
    urduQuestion: 'Roll Number Slip par rough work ya pencil se likhna kyun mana hai?',
    shortAnswer: 'Slip par kuch bhi likhna official Unfair Means (UFM) case banata hai jisse semester cancel ho sakta hai!',
    detailedPoints: [
      'VU Examination Rules ke mutabiq Roll No Slip ke aglay ya pichlay hissay par koi formula, calculation ya note likhna cheating consider hota hai.',
      'Rough work ke liye exam hall invigilator official plain sheet faraham karta hai.',
      'Paper khatam hone par rough sheet invigilator ko wapis jama karwana hoti hai.'
    ],
    actionAdvice: 'Rough work ke liye sirf invigilator se scratch sheet maangein, slip par aik lafz bhi na likhein.',
    isHighFrequency: true
  },
  {
    id: 'faq-datesheet-rush',
    category: 'exams',
    question: 'Why is it critical to create the Date Sheet within the first 1-2 hours of opening?',
    urduQuestion: 'Date Sheet khultay hi pehle 1-2 ghantay mein banana kyun itna ahem hai?',
    shortAnswer: 'First-come, first-served seat allocation rule ki wajah se preferred campus aur time slots foran bhar jatay hain!',
    detailedPoints: [
      'Har exam center mein computer labs ki seats limited hoti hain.',
      'Subah aur dopehar ke asan slots pehle 30 minutes mein book ho jatay hain.',
      'Late datesheet banane par aapko door ke campus ya mushkil timings (maslan shaam late) par paper select karna parta hai.',
      'Deadline guzarne par PKR 500 se PKR 1,000 late fee fine lagta hai.'
    ],
    actionAdvice: 'Date sheet opening notification aatay hi foran login karke apna schedule bana lein.',
    isHighFrequency: true
  },

  // 3. Grading & Probation FAQs
  {
    id: 'faq-two-half-rule',
    category: 'grading',
    question: 'What is the 20% Two-Half Rule and how does it cause unexpected failure?',
    urduQuestion: 'The 20% Two-Half Rule aakhir hai kya aur iski wajah se pass student fail kaisay hota hai?',
    shortAnswer: 'Sessional mein >= 20% aur Final Term paper mein independently >= 20% score karna lazmi hai!',
    detailedPoints: [
      'First Half: Quizzes + Assignments + GDB + Midterm (minimum 20% score hona chahiye).',
      'Second Half: Final Term Examination paper (minimum 20% score hona chahiye, maslan 60 marks mein se kam az kam 12 marks).',
      'Aggregate Condition: Dono halves ko mila kar total aggregate 50% (Standard D) ya 40% (Passing Floor) hona chahiye.',
      'Critical Case: Agar kisi student ke Sessional + Midterm mein 100% marks hon lekin Final paper mein sirf 11 marks (less than 20%) ayein, to wo automatic FAIL ("F" grade) ho jata hai!'
    ],
    actionAdvice: 'Hamara Exam Passing Simulator tool (/simulator) use karein jahan aap exact marks daal kar live status check kar saktay hain.',
    isHighFrequency: true
  },
  {
    id: 'faq-academic-probation',
    category: 'grading',
    question: 'When does Academic Probation trigger and what are its penalties?',
    urduQuestion: 'Academic Probation kab lagti hai aur iske nuqsanaat kya hain?',
    shortAnswer: '1st semester mein CGPA < 1.50 aur aagay CGPA < 2.00 par probation lagti hai, aur workload 12 credit hours tak mehdood ho jata hai.',
    detailedPoints: [
      'Normal student ko 18 credit hours (6 subjects) allowed hotay hain, jabke probation par sirf 12 credit hours (4 subjects).',
      'Student ko pehle fail ya low "D" grade subjects repeat karne ki hidayat di jati hai.',
      'Lagataar do probations aane par academic review aur dismissal notice issue hota hai.',
      'Graduation ke liye overall CGPA 2.00 / 4.00 hona qanooni taur par lazmi hai.'
    ],
    actionAdvice: 'Initial semesters mein low "D" grades ko foran repeat karein kyunke shuru ke courses ka CGPA par sab se zyada impact hota hai.',
    isHighFrequency: true
  },

  // 4. Fee & Freeze FAQs
  {
    id: 'faq-fee-installments',
    category: 'fee-freeze',
    question: 'Can semester fees be converted into easy installments?',
    urduQuestion: 'Kya semester fee ko installments mein convert karwaya ja sakta hai?',
    shortAnswer: 'Jee haan! VULMS Account Book se fee voucher ko 2 se 3 installments mein convert kiya ja sakta hai.',
    detailedPoints: [
      'Course selection ke baad generate hone wale semester fee voucher ke samne "Installment" ka button aata hai.',
      'Button click karke aap 2 ya 3 monthly installments choose kar saktay hain.',
      'Installment fee JazzCash, EasyPaisa, 1Link 1Bill, KUICKPAY, ya bank challan ke zariye 24/7 pay ho sakti hai bina kisi extra charges ke.'
    ],
    actionAdvice: 'Agar budget tight ho to voucher generate hotay hi installments bana lein taake late fee fine na lage.'
  },
  {
    id: 'faq-semester-freeze',
    category: 'fee-freeze',
    question: 'How many times and when can a student freeze a semester?',
    urduQuestion: 'Semester Freeze kitni baar aur kab tak karwa saktay hain?',
    shortAnswer: 'Maximum 2 consecutive semesters freeze kiye ja saktay hain, Midterm se pehle apply karna zaroori hai.',
    detailedPoints: [
      'Procedure: VULMS > Student Services > Semester Freeze.',
      'Midterm exam se pehle freeze ki request approve karwani hoti hai.',
      'Agar koi student lagataar 2 semesters se zyada baghair permission university chor de to admission cancel ho jata hai.',
      'Semester unfreeze karne ke liye aglay semester ke start par course selection window mein apply karein.'
    ],
    actionAdvice: 'Freeze karte waqt accounts department se clear karwayein ke koi pending dues na hon.'
  },

  // 5. Overseas & Degree Clearance FAQs
  {
    id: 'faq-overseas-pakistan',
    category: 'overseas',
    question: 'If an overseas student visits Pakistan during exams, can they sit online from Pakistan?',
    urduQuestion: 'Overseas student agar exams ke doran Pakistan aaye to kya wo online exam de sakta hai?',
    shortAnswer: 'Bilkul nahi! Pakistan ke andar baith kar overseas online exam dena strictly illegal hai.',
    detailedPoints: [
      'Agar overseas student exam ke doran Pakistan travel karta hai to usay foran overseas directorate se study status local campus mein convert karwana parta hai.',
      'Pakistan mein rehtay hue sirf physical VU exam center par paper diya ja sakta hai.',
      'IP address tracking se Pakistan IP detect hone par online paper cancel aur UFM case ban jata hai.'
    ],
    actionAdvice: 'Agar Pakistan aane ka plan ho to exam se kam az kam 2 haftay pehle campus conversion apply karein.'
  },
  {
    id: 'faq-hec-attestation',
    category: 'overseas',
    question: 'How to get VU degree and transcript attested by HEC after graduation?',
    urduQuestion: 'Degree aur Transcript complete hone par HEC Attestation kaisay hoti hai?',
    shortAnswer: 'Degree audit ke baad eservices.hec.gov.pk se online attestation apply karein.',
    detailedPoints: [
      'Degree completion criteria: Tamam required credit hours pass hon aur cumulative CGPA >= 2.00 ho.',
      'VULMS Student Services se Provisional Certificate ya Official Transcript apply karein.',
      'HEC E-Services portal par account bana kar VU registration number aur degree details enter karein.',
      'TCS courier service ya walk-in appointment ke zariye HEC stamp aur verification ticket lagta hai.'
    ],
    actionAdvice: 'Overseas job ya higher studies ke liye transcript aur provisional dono attest karwayein.'
  }
];

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
  { id: 'faqs', label: 'Top Student FAQs', icon: MessageSquare },
  { id: 'exams', label: 'Exams & Date Sheet', icon: Calendar },
  { id: 'reschedule', label: 'Paper Rescheduling', icon: RotateCcw },
  { id: 'grading', label: 'Grading & 20% Rule', icon: Award },
  { id: 'sessional', label: 'Assignments & Quizzes', icon: Clock },
  { id: 'fee-freeze', label: 'Fee & Semester Freeze', icon: CreditCard },
  { id: 'overseas', label: 'Overseas Regulations', icon: Globe },
  { id: 'portals', label: 'Official Helpdesk', icon: Phone }
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
  const [viewMode, setViewMode] = useState<'both' | 'faqs' | 'guides'>('both');
  
  // Expanded IDs for Guides and FAQs
  const [expandedGuides, setExpandedGuides] = useState<Set<string>>(
    new Set(['datesheet-creation', 'rescheduling-procedure', 'two-half-rule'])
  );
  const [expandedFAQs, setExpandedFAQs] = useState<Set<string>>(
    new Set(['faq-two-half-rule', 'faq-assignment-missed', 'faq-reschedule-procedure'])
  );

  const toggleGuideExpand = (id: string) => {
    setExpandedGuides((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleFAQExpand = (id: string) => {
    setExpandedFAQs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    setExpandedGuides(new Set(GUIDE_ITEMS.map((g) => g.id)));
    setExpandedFAQs(new Set(TOP_VU_FAQS.map((f) => f.id)));
  };

  const collapseAll = () => {
    setExpandedGuides(new Set());
    setExpandedFAQs(new Set());
  };

  // Filtered FAQs
  const filteredFAQs = useMemo(() => {
    if (viewMode === 'guides') return [];
    const q = searchQuery.toLowerCase().trim();

    return TOP_VU_FAQS.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && selectedCategory !== 'faqs') {
        const catMap: Record<string, string[]> = {
          exams: ['exams'],
          reschedule: ['exams'],
          grading: ['grading'],
          sessional: ['sessional'],
          'fee-freeze': ['fee-freeze'],
          overseas: ['overseas']
        };
        const allowed = catMap[selectedCategory] || [];
        if (!allowed.includes(item.category)) return false;
      }

      // Search filter
      if (q) {
        const matchQ = item.question.toLowerCase().includes(q);
        const matchUrdu = item.urduQuestion.toLowerCase().includes(q);
        const matchAns = item.shortAnswer.toLowerCase().includes(q);
        const matchPoints = item.detailedPoints.some((p) => p.toLowerCase().includes(q));
        const matchAdvice = item.actionAdvice ? item.actionAdvice.toLowerCase().includes(q) : false;
        return matchQ || matchUrdu || matchAns || matchPoints || matchAdvice;
      }

      return true;
    });
  }, [selectedCategory, searchQuery, viewMode]);

  // Filtered Guides
  const filteredGuides = useMemo(() => {
    if (viewMode === 'faqs') return [];
    const q = searchQuery.toLowerCase().trim();

    return GUIDE_ITEMS.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'faqs') return false;
        if (item.category !== selectedCategory) return false;
      }

      // Search filter
      if (q) {
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.shortDesc.toLowerCase().includes(q);
        const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
        const matchDetails = item.details.some((d) => d.toLowerCase().includes(q));
        return matchTitle || matchDesc || matchTags || matchDetails;
      }

      return true;
    });
  }, [selectedCategory, searchQuery, viewMode]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
      {/* 1. Page Header */}
      <div className="space-y-4 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
          <GraduationCap className="w-4 h-4 text-blue-600" />
          <span>VIRTUAL UNIVERSITY ACADEMIC HANDBOOK & ESSENTIALS</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          The Essential VU Student Knowledge Base & FAQs
        </h1>

        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          Everything a Virtual University student normally needs to know: <strong>14 most important student FAQs</strong>, verified examination rules, the <strong>20% Two-Half passing rule</strong>, missed paper rescheduling (PKR 2,000 policy), CGPA probation limits, and assignment grace periods.
        </p>

        {/* Quick Highlights Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase block mb-0.5">Top FAQs</span>
            <strong className="text-sm sm:text-base font-black text-indigo-700 font-mono">14 Questions</strong>
            <span className="text-[10px] text-slate-400 block">Crucial Student Answers</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase block mb-0.5">Two-Half Rule</span>
            <strong className="text-sm sm:text-base font-black text-emerald-700 font-mono">Min 20% + 20%</strong>
            <span className="text-[10px] text-slate-400 block">Sessional & Final Term</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase block mb-0.5">Reschedule Fee</span>
            <strong className="text-sm sm:text-base font-black text-blue-700 font-mono">PKR 2,000</strong>
            <span className="text-[10px] text-slate-400 block">24-Hr Window on VULMS</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase block mb-0.5">Grace Period</span>
            <strong className="text-sm sm:text-base font-black text-amber-700 font-mono">24 Hours</strong>
            <span className="text-[10px] text-slate-400 block">Zero marks deduction</span>
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
              placeholder="Search e.g. assignment fail, reschedule, 20%, probation, grace period, installments..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium rounded-2xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-slate-900 bg-slate-50/50"
            />
          </div>

          {/* Section View Tabs & Expand All */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setViewMode('both')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'both' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Content
              </button>
              <button
                type="button"
                onClick={() => setViewMode('faqs')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'faqs' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                FAQs Only ({filteredFAQs.length})
              </button>
              <button
                type="button"
                onClick={() => setViewMode('guides')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'guides' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Guides ({filteredGuides.length})
              </button>
            </div>

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
              Collapse
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

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
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. SECTION A: Top Important Student FAQs */}
      {(viewMode === 'both' || viewMode === 'faqs') && filteredFAQs.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase tracking-wider">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <span>Frequently Asked Student Questions</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Most Important VU Questions & Direct Answers
              </h2>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {filteredFAQs.length} Critical FAQs
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredFAQs.map((faq) => {
              const isExpanded = expandedFAQs.has(faq.id);

              return (
                <div
                  key={faq.id}
                  className={`bg-white rounded-3xl border transition-all duration-200 overflow-hidden ${
                    isExpanded ? 'border-indigo-300 shadow-md ring-1 ring-indigo-100' : 'border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  {/* FAQ Header Row */}
                  <div
                    onClick={() => toggleFAQExpand(faq.id)}
                    className="p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {faq.isHighFrequency && (
                          <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold text-[10px] uppercase tracking-wider">
                            Most Asked Question
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-mono font-semibold text-[10px] uppercase tracking-wider">
                          {faq.category.replace('-', ' ')}
                        </span>
                      </div>

                      {/* Roman Urdu Question */}
                      <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                        {faq.urduQuestion}
                      </h3>

                      {/* English Translation Question */}
                      <p className="text-xs text-slate-500 font-medium italic">
                        &ldquo;{faq.question}&rdquo;
                      </p>

                      {/* Immediate Short Answer Callout */}
                      <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100/80 text-xs sm:text-sm text-indigo-950 font-semibold leading-relaxed">
                        <strong className="text-indigo-800 mr-1.5 font-bold">Answer:</strong>
                        <span>{faq.shortAnswer}</span>
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Expanded Detailed Points */}
                  {isExpanded && (
                    <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-100 space-y-4 animate-in fade-in duration-150">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Detailed Explanation & Rules:
                      </h4>

                      <div className="space-y-2">
                        {faq.detailedPoints.map((point, pIdx) => (
                          <div key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>

                      {faq.actionAdvice && (
                        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/60 flex items-start gap-3">
                          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div className="text-xs text-amber-950 leading-relaxed">
                            <strong className="font-bold block text-amber-900 mb-0.5">Student Action Tip / Mashwara:</strong>
                            <span>{faq.actionAdvice}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. SECTION B: Comprehensive Guide Cards */}
      {(viewMode === 'both' || viewMode === 'guides') && filteredGuides.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Official Academic & Examination Rules</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                In-Depth Policy & Procedure Encyclopedia
              </h2>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {filteredGuides.length} Guide Chapters
            </span>
          </div>

          <div className="space-y-4">
            {filteredGuides.map((item) => {
              const isExpanded = expandedGuides.has(item.id);

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-3xl border transition-all duration-200 overflow-hidden ${
                    isExpanded ? 'border-blue-300 shadow-md ring-1 ring-blue-100' : 'border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  {/* Header Row */}
                  <div
                    onClick={() => toggleGuideExpand(item.id)}
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
            })}
          </div>
        </div>
      )}

      {/* No Results Fallback */}
      {filteredFAQs.length === 0 && filteredGuides.length === 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No matching handbook items or FAQs found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try searching with another keyword like &ldquo;assignment fail&rdquo;, &ldquo;reschedule&rdquo;, &ldquo;grace period&rdquo;, or reset filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setViewMode('both');
            }}
            className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* 5. Interactive Callout Banners */}
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
