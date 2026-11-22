import { Course, Resource } from '../types';
import coursesData from '../data/courses.json';
import { cleanDocumentDisplayTitle, getDocSlug } from './docSlug';

export interface EnrichedDocMetadata {
  displayName: string;
  courseCode: string;
  courseTitle: string;
  faculty: string;
  format: string;
  type: string;
  typeLabel: string;
  termScope: string;
  contributor: string | null;
  canonicalUrl: string;
  targetKeywords: string[];
  examTips: string;
  overviewSummary: string;
  syllabusHighlights: string[];
  faqs: Array<{ question: string; answer: string }>;
}

const KNOWN_CONTRIBUTORS: Array<{ match: RegExp; name: string }> = [
  { match: /moaaz/i, name: 'Moaaz Siddhu' },
  { match: /waqar(\s*sidd?hu)?/i, name: 'Waqar Siddhu' },
  { match: /team\s*hadi|hadi/i, name: 'Team Hadi' },
  { match: /rana(\s*abubakar)?/i, name: 'Rana Abubakar Khan' },
  { match: /mehwish/i, name: 'Miss Mehwish' },
  { match: /zaman/i, name: 'Muhammad Zaman' },
  { match: /sulman/i, name: 'Sulman Ali' },
  { match: /arshad|zainab/i, name: 'Zainab Arshad' },
  { match: /amina/i, name: 'Amina Zee' },
  { match: /kainat/i, name: 'Kainat Alvi' },
  { match: /vuanswer/i, name: 'VUAnswer' },
  { match: /vupapers/i, name: 'VUPapers' },
  { match: /vulmshelp/i, name: 'VULMSHelp' },
  { match: /virtualustaad/i, name: 'Virtual Ustaad' },
  { match: /jiya(\s*ali)?/i, name: 'Jiya Ali' },
  { match: /mishi/i, name: 'Innocent Mishi' }
];

const COURSES_BY_CODE = new Map<string, Course>();
for (const c of coursesData as Course[]) {
  COURSES_BY_CODE.set(c.code.toUpperCase(), c);
}

export function enrichDocumentMetadata(resource: Resource): EnrichedDocMetadata {
  const code = (resource.course || 'VU').toUpperCase();
  const courseMatch = COURSES_BY_CODE.get(code);
  const courseTitle = courseMatch ? courseMatch.title : `${code} Academic Course`;
  const faculty = courseMatch ? courseMatch.faculty : 'Virtual University Academic Division';
  const displayName = cleanDocumentDisplayTitle(resource.name);
  const format = (resource.format || 'PDF').toUpperCase();
  const type = (resource.type || 'OTHER').toUpperCase();
  const slug = getDocSlug(resource.rlh);
  const canonicalUrl = `https://study.mihora.tech/doc/${slug}`;

  // Detect contributor / author from filename
  let contributor: string | null = null;
  for (const c of KNOWN_CONTRIBUTORS) {
    if (c.match.test(resource.name)) {
      contributor = c.name;
      break;
    }
  }

  // Determine Term Scope (Midterm vs Final vs Full Session)
  let termScope = 'Full Course Curriculum';
  if (type === 'MIDTERM' || resource.name.toLowerCase().includes('mid')) {
    termScope = 'Mid-Term Exam Scope (Lectures 1 to 22)';
  } else if (type === 'FINALTERM' || resource.name.toLowerCase().includes('final')) {
    termScope = 'Final-Term Exam Scope (Lectures 23 to 45)';
  } else if (type === 'QUIZ' || resource.name.toLowerCase().includes('quiz')) {
    termScope = 'Quizzes & Objective Exam Scope';
  } else if (type === 'HANDOUT') {
    termScope = 'Complete Course Handouts (Lectures 1 to 45)';
  } else if (type === 'ASSIGNMENT') {
    termScope = 'Active 2026 Semester Graded Activities';
  }

  // Determine Type Label & Exam Strategy
  let typeLabel = 'Verified Study Resource';
  let examTips = 'Review this document alongside the official handouts and test your retention in the Interactive MCQs Studio.';
  if (type === 'MIDTERM') {
    typeLabel = 'Midterm Solved Past Paper & Revision File';
    examTips = `Focus on core definitions and repeated MCQs from Lectures 1–22. Remember that scoring in the First Half builds your safety buffer toward the mandatory 20% Two-Half passing rule in ${code}.`;
  } else if (type === 'FINALTERM') {
    typeLabel = 'Final-Term Solved Past Paper & Examination Pack';
    examTips = `Virtual University regulations strictly require achieving at least 20% marks in the Final-Term exam paper alone (typically 12+ marks out of 60) to pass ${code}, regardless of midterm scores.`;
  } else if (type === 'HANDOUT') {
    typeLabel = 'Official Lecture Handouts & Highlighted Notes';
    examTips = `Virtual University examiners construct 100% of objective MCQs and subjective marking schemes directly from the official ${code} handouts.`;
  } else if (type === 'QUIZ') {
    typeLabel = 'Live Quiz Dumps & Solved Objective Bank';
    examTips = `Quiz questions often repeat with modified parameter values in both Midterm and Final exams. Practice with our 45-second timed simulator to master exam pacing.`;
  } else if (type === 'MCQFILE') {
    typeLabel = 'Mega Solved MCQs Question Bank';
    examTips = `Cross-verify solutions against official lecture handouts. Practice active recall before checking answers to ensure true concept retention.`;
  } else if (type === 'ASSIGNMENT') {
    typeLabel = '2026 Assignment & GDB Solution Guide';
    examTips = `Always personalize your submission by rewriting explanations and renaming code variables. Keep Turnitin similarity under 19% and leverage the official 24-hour grace period with zero marks penalty.`;
  }

  // Generate 15–20 High-Ranking Student Search Queries / Keywords
  const targetKeywords: string[] = [
    `${code.toLowerCase()} past papers`,
    `${code.toLowerCase()} solved past papers`,
    `${code.toLowerCase()} handouts pdf`,
    `${code.toLowerCase()} ${format.toLowerCase()}`,
    `${code.toLowerCase()} ${type.toLowerCase()}`,
    `${code.toLowerCase()} assignment solution 2026`,
    `${code.toLowerCase()} assignment 1 solution 2026`,
    `${code.toLowerCase()} assignment 2 solution 2026`,
    `${code.toLowerCase()} gdb solution 2026`,
    `${code.toLowerCase()} midterm solved papers`,
    `${code.toLowerCase()} final term solved papers`,
    `${code.toLowerCase()} mcqs bank`,
    `${code.toLowerCase()} live mids mcqs`,
    `${code.toLowerCase()} subjective solved questions`,
    `${code.toLowerCase()} 20 percent passing rule`,
    `${code.toLowerCase()} virtual university`,
    `mihora ${code.toLowerCase()}`,
    displayName.toLowerCase()
  ];
  if (contributor) {
    targetKeywords.push(`${code.toLowerCase()} past papers by ${contributor.toLowerCase()}`);
    targetKeywords.push(`${code.toLowerCase()} ${contributor.toLowerCase()}`);
  }

  // Academic Overview
  const contributorMention = contributor ? ` compiled by ${contributor}` : '';
  const overviewSummary = `Verified academic study resource for ${code} (${courseTitle}) under the ${faculty} at Virtual University of Pakistan. This ${format} document (${typeLabel}${contributorMention}) covers ${termScope} and is indexed for student examination review with instant in-browser preview and 100% free direct download.`;

  // Syllabus Highlights
  const syllabusHighlights: string[] = [
    `Accredited Subject: ${code} – ${courseTitle}`,
    `Academic Department: ${faculty}`,
    `Curriculum Coverage: ${termScope}`,
    `Document Classification: ${typeLabel}`,
    `Format & Compatibility: ${format} (Accessible on Windows, macOS, Android & iOS)`,
    `Verification Status: Verified zero-login educational download on MIHORA VU`
  ];

  // Tailored FAQs (Google SERP FAQPage Schema + On-Page Content)
  const faqs = [
    {
      question: `Where can I download ${displayName} for free?`,
      answer: `You can preview and download "${displayName}" (${code} ${format}) directly from the MIHORA VU Study Library (https://study.mihora.tech/doc/${slug}) with 100% free high-speed downloads and zero registration requirements.`
    },
    {
      question: `What is the passing criteria for ${code} under the VU 20% Two-Half Rule?`,
      answer: `Under official Virtual University regulations, students must score at least 20% in the First Half (Quizzes, Assignments, GDBs, and Midterm combined) AND independently at least 20% in the Final-Term examination paper. Scoring under 20% in the final exam results in an automatic F grade regardless of earlier marks.`
    },
    {
      question: `Are ${code} solved past papers and handouts verified for 2026 exams?`,
      answer: `Yes. All ${code} materials on MIHORA VU—including Moaaz, Waqar Siddhu, and team archives—are reviewed against the current VU syllabus to help students prepare for 2026 Midterm, Final-Term, and online quiz examinations.`
    },
    {
      question: `How can I practice ${code} MCQs with a timed exam simulator?`,
      answer: `Visit MIHORA VU's Interactive MCQs Studio at https://study.mihora.tech/vu-mcqs-bank to practice verified ${code} objective questions with an authentic 45-second exam countdown timer, instant answer validation, and revision sheets.`
    }
  ];

  return {
    displayName,
    courseCode: code,
    courseTitle,
    faculty,
    format,
    type,
    typeLabel,
    termScope,
    contributor,
    canonicalUrl,
    targetKeywords,
    examTips,
    overviewSummary,
    syllabusHighlights,
    faqs
  };
}
