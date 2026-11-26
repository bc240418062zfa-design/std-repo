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
import { motion, AnimatePresence } from 'motion/react';
import {
  ScrollReveal,
  StaggerGrid,
  StaggerItem,
  SpotlightCard,
  AnimatedButton,
  AnimatedCounter,
  EASE_OUT_EXPO
} from '../components/MotionPrimitives';
import { CelestialOrbitalRings, CelestialPageHeader } from '../components/CelestialBackdrop';
import coursesData from '../data/courses.json';

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
  },

  // 6. Account, Calculators, Lecture Videos & Degree Rules FAQs
  {
    id: 'faq-account-blocked-fee',
    category: 'fee-freeze',
    question: 'Why does VULMS show "Account is blocked due to non-payment of fee" and how to unblock it immediately?',
    urduQuestion: 'Fee dues ki wajah se VULMS block ho jaye to foran unblock kaisay hota hai?',
    shortAnswer: 'Challan pay karne ke 15-30 minutes baad LMS auto-unblock ho jata hai. Agar delay ho to Support ticket send karein.',
    detailedPoints: [
      'Jab fee due date guzar jaye to VULMS auto-block mode mein chala jata hai aur lectures, assignments ya date sheet access suspend ho jati hai.',
      'Aap JazzCash, EasyPaisa, 1Link (1Bill), KUICKPAY ya bank challan ke zariye kisi bhi waqt fees pay kar saktay hain.',
      'Electronic payment (JazzCash / EasyPaisa / 1Link) ki confirmation aam tor par 15 se 30 minutes mein VU account system update karti hai.',
      'Agar 1 ghantay ke baad bhi LMS open na ho to support.vu.edu.pk par Accounts Department ko Challan Number aur transaction screenshot ke sath ticket open karein.'
    ],
    actionAdvice: 'Exams aur Datesheet se kam az kam 3 din pehle dues clear karein taake datesheet bananay mein koi rukawat na aye.',
    isHighFrequency: true
  },
  {
    id: 'faq-video-attendance-rule',
    category: 'sessional',
    question: 'Are watching LMS lecture videos and answering pop-up quizzes compulsory to appear in exams?',
    urduQuestion: 'Kya LMS par lecture videos dekhna aur pop-up quizzes solve karna exam dene ke liye lazmi hai?',
    shortAnswer: 'Jee haan! Designated courses mein kam az kam 80-100% lecture video progress lazmi hoti hai warna date sheet block ho jati hai.',
    detailedPoints: [
      'VU ne naye semesters mein Video Progress Enforcement lagai hui hai jisme har topic ki video poori dekhna shart hai.',
      'Video ke doran aane wale in-video reflection quizzes ka sahi jawab dena parta hai tab ja kar agla lecture unlock hota hai.',
      'Agar aap kisi subject ki required percentage complete nahi karte to datesheet banatay waqt wo subject disabled ya ineligible show hota hai.'
    ],
    actionAdvice: 'Aakhri hafte par bojh daalne ke bajaye har hafte ke lectures usi hafte cover karein taake end par rush na banay.',
    isHighFrequency: true
  },
  {
    id: 'faq-course-repeat-improvement',
    category: 'grading',
    question: 'Can I repeat a course to improve a "D" or "F" grade, and how does it calculate into the CGPA?',
    urduQuestion: 'Kya "D" ya "F" grade walay subject ko repeat karke CGPA improve kiya ja sakta hai?',
    shortAnswer: 'Jee haan! Behtar (higher) grade aapke CGPA mein add hota hai jabke puraana grade transcript par "I" (Improvement) ke sath rehta hai.',
    detailedPoints: [
      'Student kisi bhi "D" ya "F" grade walay course ko aglay semester ki Course Selection window mein dobara enroll kar sakta hai.',
      'Agar naye attempt mein behtar grade aye (maslan D se B ya A) to naya grade CGPA mein count hota hai aur puraana grade neutralize ho jata hai.',
      'Official transcript par dono attempts show hoti hain, lekin final CGPA hamesha highest obtained grade par calculate hota hai.',
      '"C" ya us se oopar ke grades ko repeat karne ki permission nahi hoti.'
    ],
    actionAdvice: 'Initial semesters ke "D" grades ko lazmi repeat karein kyunke wo CGPA ko girnay se bacha letay hain.',
    isHighFrequency: true
  },
  {
    id: 'faq-physical-calculator-exam',
    category: 'exams',
    question: 'Are physical scientific calculators allowed in the VU Exam Center, or must students use software calculators?',
    urduQuestion: 'Exam hall mein kya physical scientific calculator lay jana allowed hai ya computer software calculator use karna hota hai?',
    shortAnswer: 'Standard non-programmable physical scientific calculators allowed hain (e.g. Casio fx-82 / fx-991), programmable devices strictly banned hain.',
    detailedPoints: [
      'Invigilators entry gate par scientific calculator ko physically check karte hain; memory-storing ya graphic programmable calculators confiscated ho jatay hain.',
      'In addition, VU Examination Software ke andar built-in Scientific Calculator aur Windows Calculator har waqt available rehta hai.',
      'Mathematics aur programming courses ke liye MathType aur Dev-C++ exam computer par pre-installed hotay hain.'
    ],
    actionAdvice: 'Exam se pehle calculator ki battery check karein aur standard Casio non-programmable model carry karein.',
    isHighFrequency: true
  },
  {
    id: 'faq-exam-software-shortcuts',
    category: 'exams',
    question: 'How does copy-paste work in VU Exam Software, and can answers be copied from external files?',
    urduQuestion: 'VU Exam Software mein MathType aur Dev-C++ se answer copy-paste kaisay hota hai?',
    shortAnswer: 'MathType aur Dev-C++ se paper answer box mein Ctrl+V se paste hota hai, lekin question text copy karna disabled hota hai.',
    detailedPoints: [
      'Exam software mein question ka text copy karna intentionally block hota hai taake paper leak ya external search na ho sake.',
      'MathType equations ko select karke Ctrl+C karein aur Exam Software ke subjective box mein Ctrl+V daba kar asani se paste karein.',
      'Dev-C++ ya Notepad par likha gaya code direct paper software ke answer box mein paste kiya ja sakta hai.'
    ],
    actionAdvice: 'Shortcuts practice karne ke liye VU demo exam application ko exam se pehle chala kar check karein.'
  },
  {
    id: 'faq-cs619-final-project',
    category: 'grading',
    question: 'What happens if a student fails the Final Year Project (CS619 / MCM619) Viva Voce or SRS document?',
    urduQuestion: 'Final Year Project (CS619) ya Viva presentation mein fail honay par kya hota hai?',
    shortAnswer: 'Proposal/SRS reject hone par revision time milta hai; Final Viva fail hone par aglay semester project dobara register karna parta hai.',
    detailedPoints: [
      'CS619 teen main phases par mushtamil hota hai: Proposal & SRS, Design Document & Test Phase, aur Final Code & Viva Voce.',
      'Initial phases mein supervisor comments de kar resubmission ka chance faraham karta hai.',
      'Agar final external viva mein student viva committee ko satisfy na kar sake to project fail ho jata hai aur next semester course selection mein dobara fee ke sath enroll karna parta hai.'
    ],
    actionAdvice: 'Har phase ke supervisor deadlines ko strictly follow karein aur project ka working code khud likhein ya samjhein.'
  },
  {
    id: 'faq-grace-marks-policy',
    category: 'grading',
    question: 'Does Virtual University award Grace Marks if a student is failing by 1 or 2 marks?',
    urduQuestion: 'Kya Virtual University 1 ya 2 marks se fail honay par Grace Marks deti hai?',
    shortAnswer: 'Academic council board margin par 1-2 grace marks borderline pass karne ke liye auto-round off karti hai, lekin iska koi manual claim nahi hota.',
    detailedPoints: [
      'VU grading engine 49.5% ya 49% ko general passing threshold (50%) par push karne ke liye institutional rounding lagata hai.',
      'Lekin Two-Half 20% rule par koi grace marks nahi miltay; Final paper mein kam az kam 20% score hona strictly mandatory hai.',
      'Instructor ya Controller Examinations ko grace marks ke liye email karne se result change nahi hota.'
    ],
    actionAdvice: 'Kabhi bhi borderline 50% ka target na banayein; hamesha 65%+ ki tiyari karein taake risk zero rahay.'
  },
  {
    id: 'faq-max-degree-duration',
    category: 'fee-freeze',
    question: 'What is the maximum allowed duration to complete a BS or Master\'s degree in Virtual University?',
    urduQuestion: 'Virtual University mein 4-year BS ya 2-year Associate Degree complete karne ki maximum time limit kitni hoti hai?',
    shortAnswer: 'HEC aur VU policy ke mutabiq 4-year BS degree maximum 6 to 7 saal mein, aur 2-year degree maximum 3 to 4 saal mein complete karni hoti hai.',
    detailedPoints: [
      'Normal duration: BS (4 years / 8 semesters), ADP (2 years / 4 semesters).',
      'Maximum extension: HEC standard policy ke mutabiq actual duration se 50% zyada time allow hota hai (BS ke liye up to 6 or 7 years).',
      'Agar maximum duration ke andar degree requirements poori na hon to student status terminate ho jata hai.'
    ],
    actionAdvice: 'Semesters ko bila-wajah freeze na karein taake maximum time limit exceed na ho.'
  },

  // 7. Authentic Essential FAQs (Rechecking, Add/Drop, Scholarships, Zero Semester, Credit Transfer, Weightage, Transcript)
  {
    id: 'faq-paper-rechecking',
    category: 'exams',
    question: 'How can I apply for Paper Rechecking if my exam marks seem lower than expected?',
    urduQuestion: 'Agar exam marks umeed se kam ayein to Paper Rechecking kaisay aur kitni fee mein hoti hai?',
    shortAnswer: 'Result aane ke 5 se 7 din ke andar VULMS Student Services se apply karein; fee PKR 500 (Local) aur $20 USD (Overseas) per paper hai.',
    detailedPoints: [
      'Apply karne ka rasta: VULMS > Student Services > Examinations Department > "Apply for Paper(s) Rechecking".',
      'Time Window: Midterm ya Final-Term result announce honay ke baad sirf prescribed days (aam tor par 5 se 7 din) tak link open rehta hai.',
      'Fee Schedule: Local students ke liye PKR 500 per paper aur Overseas students ke liye $20 USD per paper non-refundable challan hota hai.',
      'Scope of Rechecking: Rechecking mein sirf marks totals aur un-checked/unmarked sawalon ki tasdeeq hoti hai; checked answers ki poori re-marking nahi hoti.'
    ],
    actionAdvice: 'Result notification par aakhri tareekh zaroor check karein; deadline guzarne par portal link automatic close ho jata hai.',
    isHighFrequency: true
  },
  {
    id: 'faq-add-drop-inactive',
    category: 'sessional',
    question: 'Can I add, drop, or replace a subject after semester classes start, and what happens if I select no courses?',
    urduQuestion: 'Classes shuru honay ke baad kya course add/drop ya change kar saktay hain, aur select na karne par kya hota hai?',
    shortAnswer: 'Jee haan! Semester ke shuru mein Add/Drop deadline tak course change ho saktay hain; agar koi course select na karein to student "Inactive" ho jata hai.',
    detailedPoints: [
      'Course Selection link semester start honay se pehle khulta hai aur ibtadai hafton ki Add/Drop deadline tak aap subjects add, drop ya replace kar saktay hain.',
      'Add/Drop deadline guzarne ke baad fee voucher lock ho jata hai aur us semester mein mazeed koi tabdeeli nahi ho sakti.',
      'Agar continuing student deadline tak koi bhi course select na kare to wo us semester ke liye "Inactive Student" declare hota hai aur aglay semester Re-Admission rules aur fine lagu hoti hai.'
    ],
    actionAdvice: 'Agar aap parhai jaari nahi rakh saktay to course selection skip karne ke bajaye proper Semester Freeze apply karein.',
    isHighFrequency: true
  },
  {
    id: 'faq-merit-need-scholarship',
    category: 'fee-freeze',
    question: 'What are the exact eligibility rules for VU Merit-Based and Need-Based Scholarships?',
    urduQuestion: 'VU mein Merit aur Need-Based Scholarship kab aur kin students ko milti hai?',
    shortAnswer: 'Merit scholarship automatic milti hai (CGPA >= 3.00 + Semester GPA >= 3.25); Need-Based ke liye har semester VULMS Accounts se apply karna hota hai.',
    detailedPoints: [
      'Merit Scholarship (Continuing Students): Aapka minimum CGPA 3.00 aur current semester GPA kam az kam 3.25 hona chahiye, aur prescribed study-scheme credits complete honay chahiyen (alag form nahi bharna parta).',
      'Allocation Limit: Har program ki separate merit list banti hai jisme per 50 students par 1 scholarship (maximum 10 per program) di jati hai.',
      'New Admissions Merit: Entry qualification mein kam az kam 65% marks (ya 3.00/4.00 CGPA) honay par merit list mein shamil kiya jata hai.',
      'Need-Based Scholarship: Deserving students har semester window khulnay par VULMS > Student Services > Accounts > "Need Based Scholarship" se apply karein. Yeh sirf tuition fee cover karti hai aur 1 semester ke liye valid hoti hai.'
    ],
    actionAdvice: 'Har semester course selection ke baad VU Notice Board check rakhein kyunke Need-Based scholarship link mehdood dino ke liye open hota hai.',
    isHighFrequency: true
  },
  {
    id: 'faq-zero-semester-rules',
    category: 'grading',
    question: 'What is the Zero Semester in VU and can courses be exempted during or after it?',
    urduQuestion: 'Zero Semester kya hota hai aur iske courses clear karne ka kya rule hai?',
    shortAnswer: 'Zero Semester 18-week bridge semester hai jisme tamama foundational courses aik hi attempt mein >= 2.00 GPA ke sath pass karne hotay hain.',
    detailedPoints: [
      'Eligibility Target: Yeh un applicants ke liye hota hai jo basic degree rakhtay hon lekin unke marks/CGPA regular admission criteria (maslan 45% ya 2.0 CGPA) se kam hon.',
      'Prescribed Courses: Aam tor par MTH001 (Elementary Math), ENG001 (Elementary English), aur CS001 (Computer Proficiency) parhaye jatay hain.',
      'Pass Requirement: Zero Semester ke tamama subjects aik hi 18-week semester mein pass karna aur kam az kam 2.00 GPA lena lazmi hai tab regular degree admission milta hai.',
      'No Exemption Rule: Zero Semester ke dauran ya iske zariye aane walay candidates ko kisi course ki exemption ya credit transfer nahi milta.'
    ],
    actionAdvice: 'Zero Semester ke kisi aik subject ko bhi halka na lein kyunke aik subject fail honay par poora eligibility attempt zaya ho jata hai.'
  },
  {
    id: 'faq-credit-transfer-exemption',
    category: 'grading',
    question: 'Can I transfer credits or get course exemption in VU from another HEC-recognized university?',
    urduQuestion: 'Doosri HEC university se parhay hue subjects ki VU mein Course Exemption ya Credit Transfer ho sakti hai?',
    shortAnswer: 'Jee haan! Equivalence Committee minimum "B" grade (71%+) aur 75% syllabus similarity honay par course exemption approve kar sakti hai.',
    detailedPoints: [
      'Grade & Similarity Condition: Pichli HEC-recognized university se course kam az kam "B" grade (ya annual system mein 71%+) ke sath pass ho aur VU course outline se kam az kam 75% mutabiqat rakhta ho.',
      'Non-Exemptible Subjects: Core Computing, Specialization subjects, aur Final Year Project / Thesis par kisi soorat exemption nahi milti.',
      'Minimum Residency: Degree award honay ke liye VU mein kam az kam 2 saal ki resident study aur Equivalence Committee ki baqaida manzoori zaroori hoti hai.'
    ],
    actionAdvice: 'Admission ke foran baad apna official transcript aur syllabus outlines Equivalence portal par upload karein taake repeat courses par fee zaya na ho.'
  },
  {
    id: 'faq-midterm-finalterm-weightage',
    category: 'exams',
    question: 'How are Midterm, Final-Term, and Sessional marks weighted in VU total course grades?',
    urduQuestion: 'Course ke 100 marks mein Midterm, Final Term aur Assignments/Quizzes ki weightage kitni hoti hai?',
    shortAnswer: 'Aam tor par Formative/First Half 35-40% (Sessional 15-20% + Midterm 20-25%) aur Final-Term Exam 60-65% weightage rakhta hai.',
    detailedPoints: [
      'First Half (Formative Assessment): Ismein Quizzes, Assignments, GDBs, aur Midterm Exam shamil hotay hain (kul mil kar taqreeban 35% se 40% course weightage).',
      'Second Half (Summative Exam): Final-Term paper akele taqreeban 60% se 65% marks hold karta hai, is liye Final-Term mein acha score pooray grade ko A/B par le jata hai.',
      'Course-Specific Check: Har subject ka exact breakdown (e.g. CS, MTH, ENG) us course ke VULMS "Grading Scheme" tab mein wazeh likha hota hai.'
    ],
    actionAdvice: 'Apne course ke VULMS Grading Scheme tab se exact % dekh kar hamare Passing Marks Simulator (/simulator) mein calculate karein.',
    isHighFrequency: true
  },
  {
    id: 'faq-exam-time-distribution',
    category: 'exams',
    question: 'How much time and how many MCQs vs Subjective questions come in VU Midterm and Final exams?',
    urduQuestion: 'VU Midterm aur Final Term paper ka time kitna hota hai aur kitne MCQs + Short/Long questions aatay hain?',
    shortAnswer: 'Midterm aam tor par 60 minutes (MCQs + 2/3/5-mark questions) aur Final-Term 90-120 minutes (~40 MCQs + short/long subjective questions) ka hota hai.',
    detailedPoints: [
      'Midterm Pattern: Lectures 1–22 (ya first half syllabus) par mushtamil 60-minute paper jisme objective MCQs ke sath 2, 3, aur 5 marks ke mukhtasar aur long subjective sawal hotay hain.',
      'Final-Term Pattern: 90 se 120 minutes ka paper jisme aam tor par ~40 MCQs aur 2, 3, aur 5 marks ke subjective questions shamil hotay hain (zyada hissa post-midterm lectures se aata hai).',
      'Choice & Order: VU exam software mein aap kisi bhi question par direct jump kar saktay hain; subjective answers point-wise aur neat likhna examiner marks barhata hai.'
    ],
    actionAdvice: 'MCQs par max 25-30 seconds per question lagayein taake subjective 3 aur 5-mark sawalon ke liye poora waqt bachay.',
    isHighFrequency: true
  },
  {
    id: 'faq-d-grade-vs-f-grade',
    category: 'grading',
    question: 'Is a "D" grade considered Pass in VU, and when should I repeat a "D" grade course?',
    urduQuestion: 'Kya VU mein "D" grade pass count hota hai aur kya "D" grade subject repeat karna zaroori hota hai?',
    shortAnswer: 'Jee haan, "D" grade (50%-60% marks, 1.00-1.99 GPA) PASS hai! Repeat karna lazmi nahi, lekin CGPA 2.00 se barhane ke liye optional repeat helpful hai.',
    detailedPoints: [
      'Prerequisite Clearance: "D" grade milnay par subject pass count hota hai aur aglay semester ke prerequisite courses bhi unlock ho jatay hain.',
      'Compulsory vs Optional: Sirf "F" grade course ko pass karne ke liye repeat karna lazmi hota hai; "D" grade repeat karna student ki apni marzi par hai.',
      'Improvement Impact: Agar aap "D" grade repeat karke "B" ya "A" le ayein to naya highest grade CGPA mein calculate hota hai ("C" ya oopar grades repeat nahi hotay).'
    ],
    actionAdvice: 'Agar aapka CGPA 2.00 ke qareeb ya neechay ho to 1st ya 2nd semester ke 3-credit "D" grade subjects ko zaroor repeat karein.'
  },
  {
    id: 'faq-vu-email-office365',
    category: 'sessional',
    question: 'How do I use my official @vu.edu.pk student email and free academic benefits?',
    urduQuestion: 'Official VU Student Email (@vu.edu.pk) kahan milta hai aur iske kya faiday hain?',
    shortAnswer: 'Har enrolled student ko VULMS Profile/Services mein bcXXXXXXXX@vu.edu.pk email milta hai jo official alerts aur free Microsoft Office / GitHub Pack deta hai.',
    detailedPoints: [
      'Identity Format: Aapka official email aam tor par aapki Student ID par mushtamil hota hai (e.g., bc240200000@vu.edu.pk).',
      'Academic Perks: Is university email ke zariye Microsoft 365 Education aur GitHub Student Developer Pack jaisi international tools free verify ki ja sakti hain.',
      'Access Issues: Agar password bhool jayein ya login na ho to VULMS Support System par IT Helpdesk category mein ticket open karke foran reset karwayein.'
    ],
    actionAdvice: 'Apne VU email ka recovery phone/email hamesha updated rakhein kyunke university announcements aur verification links wahin aatay hain.'
  },
  {
    id: 'faq-unfreeze-readmission',
    category: 'fee-freeze',
    question: 'How do I unfreeze a frozen semester, and what happens if admission is cancelled after 2 freezes?',
    urduQuestion: 'Freeze kiya hua semester unfreeze kaisay hota hai aur agar lagataar 2 se zyada semester miss ho jayein to kya hota hai?',
    shortAnswer: 'VULMS > Student Services > Semester Unfreeze se deadline se pehle apply karein; 2 consecutive freezes ke baad miss honay par fresh re-admission lena parta hai.',
    detailedPoints: [
      'Unfreeze Window: Pichlay semester ke final exams khatam honay se le kar aglay semester ki course selection deadline tak Unfreeze link active rehta hai.',
      'Procedure: VULMS > Student Services > "Semester Unfreeze" par ja kar reason darj karein aur submit karein.',
      'Cancellation Recovery: Agar 2 lagataar freezes ke baad admission cancel bhi ho jaye to fresh admission apply karte waqt aapke pehle se pass kiye hue credit hours transfer/exempt ho saktay hain.'
    ],
    actionAdvice: 'Semester unfreeze karne ke baad course selection link khulnay par foran kam az kam 1 course enroll karna na bhoolen.'
  },
  {
    id: 'faq-degree-transcript-apply',
    category: 'overseas',
    question: 'How do I apply for my Official Transcript or Degree Certificate after completing all credit hours?',
    urduQuestion: 'Degree complete honay par Official Transcript aur Degree Certificate kaisay aur kahan se apply hota hai?',
    shortAnswer: 'Tamam credit hours aur >= 2.00 CGPA poora honay par VULMS > Student Services > Examinations Department se Transcript aur Provisional/Degree apply karein.',
    detailedPoints: [
      'Audit Criteria: Final result aane ke baad verify karein ke study scheme ke tamama required credit hours, CS619/Project/Internship, aur cumulative CGPA >= 2.00 complete hain.',
      'Portal Path: VULMS > Student Services > Examinations Department ke tehat Official Transcript, Provisional Certificate, aur Degree Issuance request submit hoti hai.',
      'Clearance & Delivery: Accounts/Library clearance clear honay aur prescribed fee voucher pay karne ke baad document aapke selected VU campus ya mailing address par bheja jata hai.'
    ],
    actionAdvice: 'Transcript par apna naam, father name aur CNIC spelling pehle VULMS Profile mein check kar lein taake printing ke baad correction na karwani paray.'
  },
  {
    id: 'faq-late-center-arrival',
    category: 'exams',
    question: 'What happens if I arrive late at the VU Examination Center on exam day?',
    urduQuestion: 'Agar exam center par 10-15 minute late pohnchein to kya paper dene diya jata hai?',
    shortAnswer: 'Allowed grace window mein entry mil bhi jaye to paper timer pehle se chal raha hota hai aur extra time nahi milta; zyada late honay par paper miss ho jata hai.',
    detailedPoints: [
      'Reporting Time: Exam Entrance Slip par darj reporting time ke mutabiq paper shuru honay se 15–20 minute pehle campus pohnchna zaroori hai.',
      'Server Timer Rule: Agar late entry allow hoti bhi hai to exam software ka clock scheduled start time se chal chuka hota hai aur missed minutes wapis nahi miltay.',
      'Missed Entry: Strict cut-off guzarne ke baad lab mein dakhla band ho jata hai aur paper miss consider hota hai (jisay 24 ghantay baad PKR 2,000 fee se reschedule karna parta hai).'
    ],
    actionAdvice: 'Traffic aur biometric verification ki wajah se subah/dopehar har slot ke liye kam az kam 30 minutes pehle nikalna safe rehta hai.'
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
  },

  // 9. Paper Rechecking & Result Verification
  {
    id: 'paper-rechecking-policy',
    category: 'reschedule',
    title: 'Paper Rechecking Policy, Fee & 5–7 Day Application Window',
    shortDesc: 'PKR 500 per paper fee, result announcement window, and what rechecking actually covers.',
    details: [
      'Application Window: Students must apply within the strict announced window (typically 5 to 7 days) immediately following Midterm or Final-Term result declaration.',
      'Portal Path: VULMS > Student Services > Examinations Department > "Apply for Paper(s) Rechecking".',
      'Prescribed Fee: PKR 500 per paper for local students and $20 USD per paper for overseas students (non-refundable).',
      'Verification Scope: Rechecking verifies addition/totalling of marks and ensures no answered question was left unmarked; complete subjective re-evaluation is not performed.'
    ],
    tips: 'Always pay the generated rechecking voucher before its due date; unpaid requests are automatically rejected.',
    officialLinks: [
      { label: 'VULMS Student Services', url: 'https://vulms.vu.edu.pk/' }
    ],
    tags: ['rechecking', '500 pkr', 'result', 'marks verification', 'examinations'],
    isImportant: true
  },

  // 10. Official VU Grading Scale Table
  {
    id: 'vu-grading-scale-2026',
    category: 'grading',
    title: 'Official VU Letter Grades, Percentage Brackets & 4.00 GPA Scale',
    shortDesc: 'Exact mapping from A+ (90–100%, 4.00) down to D (50–60%, 1.00–1.99) and F (<50%).',
    details: [
      'A+ (4.00 GPA): 90% – 100% | A (4.00 GPA): 85% – 89% | A- (3.66 – 3.99 GPA): 80% – 84%.',
      'B+ (3.33 – 3.65 GPA): 75% – 79% | B (3.00 – 3.32 GPA): 71% – 74% | B- (2.66 – 2.99 GPA): 68% – 70%.',
      'C Grade Band (2.00 – 2.65 GPA): 61% – 67% (includes C+, C, C- brackets depending on official fractional GPA points).',
      'D Grade Band (1.00 – 1.99 GPA): 50% – 60% (Passing credit, unlocks prerequisite courses, eligible for optional repeat).',
      'F Grade (0.00 GPA): Below 50% OR violating the mandatory 20% First-Half / 20% Final-Term Two-Half threshold.'
    ],
    tips: 'Even 1–2% improvement across quizzes and assignments can push a 79% (B+) into an 80% (A-) and boost semester GPA noticeably.',
    officialLinks: [
      { label: 'Open VU GPA Calculator', url: '/gpa-calculator' }
    ],
    tags: ['grading scheme', 'gpa scale', 'a+', 'd grade', 'percentage', '4.0'],
    isImportant: true
  },

  // 11. Merit & Need-Based Scholarships
  {
    id: 'merit-need-scholarships',
    category: 'services',
    title: 'Merit-Based & Need-Based Scholarships Eligibility Guide',
    shortDesc: 'Automatic Merit lists (CGPA >= 3.00 & Sem GPA >= 3.25) and semester Need-Based aid.',
    details: [
      'Merit Scholarship (Continuing Students): Automatically evaluated (no application needed) for students maintaining CGPA >= 3.00 AND Semester GPA >= 3.25 while taking the full prescribed study-scheme credits.',
      'Merit Quota: Separate program-wise lists award 1 scholarship per 50 students (up to max 10 scholarships per degree program).',
      'Newly Admitted Merit: Minimum 65% marks or 3.00/4.00 CGPA in prior qualification makes freshmen eligible for initial merit evaluation.',
      'Need-Based Scholarship: Apply each semester when announced via VULMS > Student Services > Accounts > "Need Based Scholarship". Covers partial/full tuition fee only (valid for one semester).'
    ],
    tips: 'Keep supporting income/utility documents ready as PDF scans before the Need-Based Scholarship window opens on VULMS.',
    officialLinks: [
      { label: 'VULMS Accounts Portal', url: 'https://vulms.vu.edu.pk/' }
    ],
    tags: ['scholarship', 'merit', 'need based', 'cgpa 3.0', 'tuition waiver'],
    isImportant: true
  },

  // 12. Zero Semester & Credit Transfer
  {
    id: 'zero-semester-exemption',
    category: 'course-selection',
    title: 'Zero Semester Bridge Rules & Course Exemption / Credit Transfer',
    shortDesc: '18-week Zero Semester requirements and HEC credit transfer ("B" grade + 75% similarity).',
    details: [
      'Zero Semester: An 18-week foundational semester (typically MTH001, ENG001, CS001) for candidates slightly below regular admission percentage/CGPA cutoffs.',
      'Clearance Condition: Students MUST pass all prescribed Zero Semester courses in a single semester with at least 2.00 GPA to qualify for regular admission; zero course exemptions apply.',
      'Course Exemption / Credit Transfer: Prior courses from HEC-recognized universities require at least a "B" grade (71%+ annual) and >= 75% content similarity, approved by the Equivalence Committee.',
      'Non-Exemptible Areas: Core computing, specialization courses, and Final Year Projects cannot be exempted, and at least 2 years of VU resident study are mandatory.'
    ],
    tags: ['zero semester', 'credit transfer', 'exemption', 'equivalence', 'mth001', 'eng001']
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* 1. Celestial Observatory Page Header */}
      <CelestialPageHeader
        kickerIcon={<GraduationCap className="w-4 h-4" />}
        kickerText="Virtual University Academic Handbook & Essentials"
        badgeText="Updated 2026 Policy Reference"
        title={
          <>
            The Essential VU Student{' '}
            <span className="text-amber-300">
              Knowledge Base &amp; FAQs
            </span>
          </>
        }
        description={
          <>
            Everything a Virtual University student normally needs to know: <strong className="text-white">{TOP_VU_FAQS.length} most important student FAQs</strong>, verified examination rules, the <strong className="text-white">20% Two-Half passing rule</strong>, missed paper rescheduling (PKR 2,000 policy), CGPA probation limits, and assignment grace periods.
          </>
        }
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-[#132238] border border-white/10 p-3.5 rounded-xl">
            <span className="text-[11px] font-bold text-slate-300 uppercase block mb-0.5">Top FAQs</span>
            <strong className="text-sm sm:text-base font-black text-amber-300 font-mono">
              <AnimatedCounter value={TOP_VU_FAQS.length} /> Questions
            </strong>
            <span className="text-[10px] text-slate-400 block">Crucial Student Answers</span>
          </div>

          <div className="bg-[#132238] border border-white/10 p-3.5 rounded-xl">
            <span className="text-[11px] font-bold text-slate-300 uppercase block mb-0.5">Two-Half Rule</span>
            <strong className="text-sm sm:text-base font-black text-emerald-300 font-mono">Min 20% + 20%</strong>
            <span className="text-[10px] text-slate-400 block">Sessional &amp; Final Term</span>
          </div>

          <div className="bg-[#132238] border border-white/10 p-3.5 rounded-xl">
            <span className="text-[11px] font-bold text-slate-300 uppercase block mb-0.5">Reschedule Fee</span>
            <strong className="text-sm sm:text-base font-black text-white font-mono">PKR 2,000</strong>
            <span className="text-[10px] text-slate-400 block">24-Hr Window on VULMS</span>
          </div>

          <div className="bg-[#132238] border border-white/10 p-3.5 rounded-xl">
            <span className="text-[11px] font-bold text-slate-300 uppercase block mb-0.5">Grace Period</span>
            <strong className="text-sm sm:text-base font-black text-sky-200 font-mono">24 Hours</strong>
            <span className="text-[10px] text-slate-400 block">Zero marks deduction</span>
          </div>
        </div>
      </CelestialPageHeader>

      {/* 2. Search & Filter Bar */}
      <ScrollReveal delay={0.05} className="bg-white rounded-2xl border border-[#E5E0D5] p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Live Search Box */}
          <div className="relative flex-1 max-w-xl">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assignment fail, reschedule, 20%..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium rounded-2xl celestial-input text-slate-900"
            />
          </div>

          {/* Section View Tabs & Expand All */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold">
              {(
                [
                  { id: 'both', label: 'All Content' },
                  { id: 'faqs', label: `FAQs Only (${filteredFAQs.length})` },
                  { id: 'guides', label: `Guides (${filteredGuides.length})` }
                ] as const
              ).map((v) => {
                const active = viewMode === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setViewMode(v.id)}
                    className={`relative px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                      active ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="handbook-view-mode"
                        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                        className="absolute inset-0 bg-white rounded-lg shadow-2xs"
                      />
                    )}
                    <span className="relative z-10">{v.label}</span>
                  </button>
                );
              })}
            </div>

            <motion.button
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={expandAll}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Expand All
            </motion.button>
            <motion.button
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={collapseAll}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Collapse
            </motion.button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <motion.button
                key={cat.id}
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat.id)}
                className={`relative inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border whitespace-nowrap ${
                  isSelected
                    ? 'border-blue-600 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="handbook-cat-pill"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    className="absolute inset-0 rounded-xl bg-blue-600"
                  />
                )}
                <Icon className="relative z-10 w-3.5 h-3.5 shrink-0" />
                <span className="relative z-10">{cat.label}</span>
              </motion.button>
            );
          })}
        </div>
      </ScrollReveal>

      {/* 3. SECTION A: Top Important Student FAQs */}
      {(viewMode === 'both' || viewMode === 'faqs') && filteredFAQs.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider">
                <MessageSquare className="w-4 h-4 text-blue-700" />
                <span>Frequently Asked Student Questions</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Most Important VU Questions & Direct Answers
              </h2>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#F3EFE6] text-[#0D1B2A] border border-[#DDD6C8]">
              {filteredFAQs.length} Critical FAQs
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredFAQs.map((faq) => {
              const isExpanded = expandedFAQs.has(faq.id);

              return (
                <div
                  key={faq.id}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isExpanded ? 'border-blue-700 shadow-sm' : 'border-[#E5E0D5]'
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
                          <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200 font-bold text-[10px] uppercase tracking-wider">
                            Most Asked Question
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-md bg-[#F3EFE6] text-[#0D1B2A] font-mono font-semibold text-[10px] uppercase tracking-wider">
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
                      <div className="p-3 rounded-xl bg-[#FAF8F4] border border-[#DDD6C8] text-xs sm:text-sm text-slate-900 font-semibold leading-relaxed">
                        <strong className="text-blue-700 mr-1.5 font-bold">Answer:</strong>
                        <span>{faq.shortAnswer}</span>
                      </div>
                    </div>

                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-1"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </div>

                  {/* Expanded Detailed Points */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.26, ease: EASE_OUT_EXPO }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-100 space-y-4">
                          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                            Detailed Explanation &amp; Rules:
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
                      </motion.div>
                    )}
                  </AnimatePresence>
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
                <span>Official Academic &amp; Examination Rules</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                In-Depth Policy &amp; Procedure Encyclopedia
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
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isExpanded ? 'border-blue-700 shadow-sm' : 'border-[#E5E0D5]'
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

                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 mt-1"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </div>

                  {/* Expanded Details Body */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.26, ease: EASE_OUT_EXPO }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-100 space-y-5">
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
                      </motion.div>
                    )}
                  </AnimatePresence>
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

      {/* 4B. Official VU Grading Scale & Credit Thresholds Quick Reference */}
      <ScrollReveal className="bg-white rounded-2xl border border-[#E5E0D5] p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-blue-700 uppercase tracking-wider">
              <Award className="w-4 h-4 text-blue-700" />
              <span>Official HEC / VU 4.0 Scale Reference</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              Virtual University Grading Scheme &amp; Academic Thresholds
            </h2>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-500">
            Min Graduation CGPA: 2.00 / 4.00
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#050B18] text-white font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Letter Grade</th>
                <th className="py-3 px-4">Percentage</th>
                <th className="py-3 px-4">Grade Points (4.0)</th>
                <th className="py-3 px-4">Academic Standing / Policy Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {[
                { grade: 'A+', pct: '90% – 100%', gpa: '4.00', note: 'Distinction · Qualifies toward Merit List evaluation', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
                { grade: 'A', pct: '85% – 89%', gpa: '4.00', note: 'Excellent · Full 4.00 GPA credit value', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
                { grade: 'A-', pct: '80% – 84%', gpa: '3.66 – 3.99', note: 'High Honor · Strong Merit Scholarship range', badge: 'bg-sky-50 text-sky-800 border-sky-200' },
                { grade: 'B+', pct: '75% – 79%', gpa: '3.33 – 3.65', note: 'Very Good · Eligible for 21 credit overload (>=3.00 CGPA)', badge: 'bg-sky-50 text-sky-800 border-sky-200' },
                { grade: 'B', pct: '71% – 74%', gpa: '3.00 – 3.32', note: 'Good · Minimum benchmark for HEC Credit Transfer', badge: 'bg-blue-50 text-blue-800 border-blue-200' },
                { grade: 'B-', pct: '68% – 70%', gpa: '2.66 – 2.99', note: 'Above Average · Standard 18 credit hours standing', badge: 'bg-blue-50 text-blue-800 border-blue-200' },
                { grade: 'C+ / C / C-', pct: '61% – 67%', gpa: '2.00 – 2.65', note: 'Satisfactory Pass · Cannot be repeated for improvement', badge: 'bg-slate-100 text-slate-800 border-slate-300' },
                { grade: 'D+ / D', pct: '50% – 60%', gpa: '1.00 – 1.99', note: 'Passing Floor · Unlocks prerequisites · Optional Repeat allowed', badge: 'bg-amber-50 text-amber-800 border-amber-200' },
                { grade: 'F', pct: 'Below 50% (or <20% Half)', gpa: '0.00', note: 'Fail · Mandatory Repeat · Triggered if either Half < 20%', badge: 'bg-rose-50 text-rose-800 border-rose-200' }
              ].map((row) => (
                <tr key={row.grade} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-4 font-mono font-bold">
                    <span className={`inline-block px-2 py-0.5 rounded-md border text-xs ${row.badge}`}>
                      {row.grade}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 font-mono font-semibold text-slate-800 tabular-nums">{row.pct}</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-blue-700 tabular-nums">{row.gpa}</td>
                  <td className="py-2.5 px-4 text-slate-600">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ScrollReveal>

      {/* 5. Interactive Callout Banners */}
      <ScrollReveal className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Banner 1: Passing Simulator */}
        <div className="relative overflow-hidden p-6 sm:p-8 rounded-2xl bg-[#0D1B2A] text-white space-y-4 shadow-xl flex flex-col justify-between border border-white/10">
          <CelestialOrbitalRings compact />
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
              <Calculator className="w-4 h-4 text-amber-300" />
              <span>Two-Half 20% Rule Engine</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              Test Your Exam Passing Marks Live
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Wondering how many marks you need in the Final Term exam to pass or hit an A grade? Use our real-time simulator to check your exact compliance status and download an executive PDF report.
            </p>
          </div>

          <AnimatedButton
            type="button"
            magnetic
            shimmer={false}
            onClick={onNavigateToSimulator}
            className="relative z-10 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-300 hover:bg-amber-200 text-[#0D1B2A] font-bold text-xs sm:text-sm transition-colors cursor-pointer shadow-sm whitespace-nowrap"
          >
            <span>Open Passing Marks Simulator</span>
            <ExternalLink className="w-4 h-4" />
          </AnimatedButton>
        </div>

        {/* Banner 2: 455 Course Library */}
        <SpotlightCard className="group p-6 sm:p-8 rounded-2xl bg-white border border-[#E5E0D5]">
          <div className="space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>28,328+ Verified Study Files</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Explore All {coursesData.length} Real VU Courses
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Access handouts, solved past papers, grand quiz files, and mid/final term preparation notes for CS101, MTH101, ENG101, MGT101, and 400+ other real courses with our in-browser reader.
              </p>
            </div>

            <AnimatedButton
              type="button"
              magnetic
              onClick={onNavigateToCourses}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer shadow-xs whitespace-nowrap"
            >
              <span>Browse {coursesData.length} Course Directory</span>
              <ExternalLink className="w-4 h-4 text-blue-400" />
            </AnimatedButton>
          </div>
        </SpotlightCard>
      </ScrollReveal>
    </div>
  );
};
