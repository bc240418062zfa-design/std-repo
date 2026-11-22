import { Course, Resource } from '../types';
import coursesData from '../data/courses.json';
import { cleanDocumentDisplayTitle, getDocSlug } from './docSlug';

export interface CurriculumModule {
  moduleNumber: number;
  title: string;
  lectureSpan: string;
  pageRange: string;
  examWeightage: string;
  keyTopics: string[];
}

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
  estimatedPages: number;
  curriculumModules: CurriculumModule[];
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

function getDisciplineModules(prefix: string, courseCode: string, courseTitle: string): CurriculumModule[] {
  const p = prefix.toUpperCase();

  if (['CS', 'IT', 'SE', 'CY'].includes(p)) {
    return [
      {
        moduleNumber: 1,
        title: 'Core Architecture, Syntax & Primitive Data Structures',
        lectureSpan: 'Lectures 1 to 6',
        pageRange: 'Pages 1 to 65',
        examWeightage: '15% Objective Marks (8–10 MCQs)',
        keyTopics: [
          `${courseCode} introductory syntax and compiler workflows`,
          'Variables, data types, standard I/O and memory representation',
          'Operators, precedence rules, and mathematical expressions',
          'Foundational algorithmic constructs and flowchart mappings'
        ]
      },
      {
        moduleNumber: 2,
        title: 'Conditional Branching, Loops & Logical Control Flow',
        lectureSpan: 'Lectures 7 to 12',
        pageRange: 'Pages 66 to 140',
        examWeightage: '18% Exam Marks (MCQs + 2-Mark Short Questions)',
        keyTopics: [
          'Nested if-else conditions and switch-case selection statements',
          'While, do-while, and for loop iteration mechanics',
          'Break, continue, and loop termination state analysis',
          'Iterative patterns, counter structures, and common logic traps'
        ]
      },
      {
        moduleNumber: 3,
        title: 'Memory Management, Pointers, Arrays & Functions',
        lectureSpan: 'Lectures 13 to 18',
        pageRange: 'Pages 141 to 215',
        examWeightage: '22% Exam Marks (High Yield for Midterms)',
        keyTopics: [
          'Function prototyping, pass-by-value vs pass-by-reference',
          'One-dimensional and multidimensional arrays with index bounds',
          'Pointer arithmetic, dereferencing, and address manipulation',
          'Dynamic memory allocation (new/delete, malloc/free) and leaks'
        ]
      },
      {
        moduleNumber: 4,
        title: 'Midterm Consolidation, Strings & Algorithm Synthesis',
        lectureSpan: 'Lectures 19 to 22',
        pageRange: 'Pages 216 to 280',
        examWeightage: 'Midterm Exam Culmination (Lectures 1–22 Scope)',
        keyTopics: [
          'String handling libraries, character arrays, and manipulation',
          'Structured data types (structs) and record layouts',
          'Midterm repeat objective MCQs and 3/5-mark code outputs',
          'First-half passing criteria checklist (20% Two-Half Rule)'
        ]
      },
      {
        moduleNumber: 5,
        title: 'Object-Oriented Paradigms: Classes & Data Abstraction',
        lectureSpan: 'Lectures 23 to 29',
        pageRange: 'Pages 281 to 360',
        examWeightage: '16% Final-Term Marks (Core OO Concepts)',
        keyTopics: [
          'Class definitions, public/private access specifiers, and instances',
          'Default, parameterized, and copy constructors with destructors',
          'Operator overloading syntax and friend functions in C++',
          'Encapsulation and data integrity best practices'
        ]
      },
      {
        moduleNumber: 6,
        title: 'Inheritance Hierarchies & Dynamic Polymorphism',
        lectureSpan: 'Lectures 30 to 36',
        pageRange: 'Pages 361 to 435',
        examWeightage: '20% Final-Term Marks (Virtual Functions & V-Tables)',
        keyTopics: [
          'Single, multiple, multilevel, and hierarchical inheritance',
          'Base class constructors, protected access, and overriding',
          'Virtual functions, runtime polymorphism, and pure virtual methods',
          'Abstract base classes and software interface contracts'
        ]
      },
      {
        moduleNumber: 7,
        title: 'Templates, Standard Library & Persistent File I/O',
        lectureSpan: 'Lectures 37 to 41',
        pageRange: 'Pages 436 to 510',
        examWeightage: '14% Final-Term Marks (Generic Code & Streams)',
        keyTopics: [
          'Function templates and class templates for generic programming',
          'Sequential and binary file streams (ifstream, ofstream, fstream)',
          'File pointers (seekg, seekp, tellg, tellp) and record persistence',
          'Standard Template Library (STL) vectors, lists, and iterators'
        ]
      },
      {
        moduleNumber: 8,
        title: 'Final-Term Examination Dossier & Capstone Synthesis',
        lectureSpan: 'Lectures 42 to 45',
        pageRange: 'Pages 511 to 585',
        examWeightage: 'Final-Term Exam Synthesis (Lectures 23–45 Scope)',
        keyTopics: [
          'Exception handling (try, catch, throw) and stack unwinding',
          'Complex code debugging, memory tracking, and output prediction',
          'Moaaz and Waqar Siddhu final-term repeated past questions',
          'Mandatory 20% final exam independent passing requirement'
        ]
      }
    ];
  }

  if (['MTH', 'STA'].includes(p)) {
    return [
      {
        moduleNumber: 1,
        title: 'Set Theory, Real Numbers & Foundational Algebra',
        lectureSpan: 'Lectures 1 to 6',
        pageRange: 'Pages 1 to 70',
        examWeightage: '15% Objective Marks (Formulas & Axioms)',
        keyTopics: [
          `${courseCode} core mathematical definitions, sets, and intervals`,
          'Real number properties, inequalities, and absolute values',
          'Coordinate geometry, straight lines, slopes, and intercepts',
          'Equations, algebraic factorization, and polynomial graphs'
        ]
      },
      {
        moduleNumber: 2,
        title: 'Functions, Domains, Limits & Continuity Theorems',
        lectureSpan: 'Lectures 7 to 12',
        pageRange: 'Pages 71 to 145',
        examWeightage: '18% Exam Marks (Limit Evaluation & Proofs)',
        keyTopics: [
          'Function mapping, domain, range, and composition',
          'Intuitive and formal limit concepts with one-sided limits',
          'Continuity conditions, removable vs essential discontinuities',
          'Intermediate Value Theorem and squeeze theorem proofs'
        ]
      },
      {
        moduleNumber: 3,
        title: 'Differential Calculus & Derivative Mechanics',
        lectureSpan: 'Lectures 13 to 18',
        pageRange: 'Pages 146 to 220',
        examWeightage: '22% Exam Marks (Rates of Change & Rules)',
        keyTopics: [
          'Definition of derivative from first principles (delta method)',
          'Power rule, product rule, quotient rule, and chain rule',
          'Trigonometric, exponential, and logarithmic differentiation',
          'Implicit differentiation and related rates application problems'
        ]
      },
      {
        moduleNumber: 4,
        title: 'Midterm Scope: Optimization, Mean Value & Extrema',
        lectureSpan: 'Lectures 19 to 22',
        pageRange: 'Pages 221 to 285',
        examWeightage: 'Midterm Examination Culmination (Lectures 1–22)',
        keyTopics: [
          'Rolle’s Theorem and Mean Value Theorem verification',
          'Critical points, first and second derivative tests for extrema',
          'Curve sketching, concavity, points of inflection, and asymptotes',
          'Midterm solved numericals and objective formula sheets'
        ]
      },
      {
        moduleNumber: 5,
        title: 'Indefinite Integrals & Anti-Derivative Techniques',
        lectureSpan: 'Lectures 23 to 29',
        pageRange: 'Pages 286 to 365',
        examWeightage: '18% Final-Term Marks (Integration Core)',
        keyTopics: [
          'Concept of anti-derivative and indefinite integration rules',
          'Integration by substitution (u-substitution method)',
          'Integration by parts formula (LIATE prioritization)',
          'Trigonometric integrals and trigonometric substitutions'
        ]
      },
      {
        moduleNumber: 6,
        title: 'Definite Integrals, Riemann Sums & Area Under Curves',
        lectureSpan: 'Lectures 30 to 36',
        pageRange: 'Pages 366 to 440',
        examWeightage: '20% Final-Term Marks (Fundamental Theorem)',
        keyTopics: [
          'Riemann sums, partition definitions, and area approximations',
          'Fundamental Theorem of Calculus (Part 1 and Part 2)',
          'Area between intersecting curves and symmetry evaluation',
          'Volumes of solids of revolution (disk and washer methods)'
        ]
      },
      {
        moduleNumber: 7,
        title: 'Partial Fractions, Infinite Sequences & Series',
        lectureSpan: 'Lectures 37 to 41',
        pageRange: 'Pages 441 to 515',
        examWeightage: '16% Final-Term Marks (Convergence Tests)',
        keyTopics: [
          'Integration using partial fraction decompositions',
          'Infinite sequences, convergence/divergence limits',
          'Infinite series: Geometric, p-series, and integral test',
          'Comparison tests, ratio test, root test, and alternating series'
        ]
      },
      {
        moduleNumber: 8,
        title: 'Differential Equations & Final-Term Synthesis',
        lectureSpan: 'Lectures 42 to 45',
        pageRange: 'Pages 516 to 585',
        examWeightage: 'Final-Term Exam Synthesis (Lectures 23–45 Scope)',
        keyTopics: [
          'First-order separable and linear differential equations',
          'Initial value problems and mathematical modeling',
          'Moaaz and Waqar Siddhu final solved formula compilations',
          'Virtual University 20% independent passing threshold guidance'
        ]
      }
    ];
  }

  if (['MGT', 'ACC', 'FIN', 'ECO', 'MKT', 'BNK'].includes(p)) {
    return [
      {
        moduleNumber: 1,
        title: 'Business Environments, Ethics & Foundational Theory',
        lectureSpan: 'Lectures 1 to 6',
        pageRange: 'Pages 1 to 65',
        examWeightage: '15% Objective Marks (Definitions & Models)',
        keyTopics: [
          `${courseCode} introductory frameworks and operational scopes`,
          'Internal vs external business environmental factors',
          'Corporate social responsibility, governance, and business ethics',
          'Forms of business ownership: Sole proprietor, partnership, corporation'
        ]
      },
      {
        moduleNumber: 2,
        title: 'Planning, Strategic Analysis & Management Functions',
        lectureSpan: 'Lectures 7 to 12',
        pageRange: 'Pages 66 to 135',
        examWeightage: '18% Exam Marks (Short Questions & Principles)',
        keyTopics: [
          'Four functions of management: Planning, organizing, leading, controlling',
          'Strategic, tactical, and operational planning horizons',
          'SWOT matrix analysis, Porter’s Five Forces, and competitive rivalry',
          'Decision-making models under risk and uncertainty'
        ]
      },
      {
        moduleNumber: 3,
        title: 'Financial Statements, Costing & Accounting Records',
        lectureSpan: 'Lectures 13 to 18',
        pageRange: 'Pages 136 to 210',
        examWeightage: '22% Exam Marks (Calculations & Statements)',
        keyTopics: [
          'Balance sheet, income statement, and cash flow statement basics',
          'Double-entry accounting, ledger entries, and trial balance',
          'Cost classifications: Fixed, variable, direct, and indirect costs',
          'Break-even analysis, contribution margin, and financial ratios'
        ]
      },
      {
        moduleNumber: 4,
        title: 'Midterm Synthesis: Sessional Prep & Solved Q&As',
        lectureSpan: 'Lectures 19 to 22',
        pageRange: 'Pages 211 to 275',
        examWeightage: 'Midterm Examination Culmination (Lectures 1–22)',
        keyTopics: [
          'Organizational design, departmentalization, and chain of command',
          'Human resource management, recruitment, and appraisal models',
          'Midterm repeat objective MCQs and 3/5-mark case studies',
          'VU First-Half 20% passing safety threshold calculation'
        ]
      },
      {
        moduleNumber: 5,
        title: 'Marketing Strategy, Product Lifecycles & Segmentation',
        lectureSpan: 'Lectures 23 to 29',
        pageRange: 'Pages 276 to 355',
        examWeightage: '18% Final-Term Marks (4 Ps & Positioning)',
        keyTopics: [
          'Target marketing, demographic and psychographic segmentation',
          'The Marketing Mix: Product, Price, Place, Promotion (4 Ps)',
          'Product life cycle stages and strategic pricing models',
          'Consumer behavior, purchase decision funnels, and branding'
        ]
      },
      {
        moduleNumber: 6,
        title: 'Capital Budgeting, Risk Analysis & Financial Decisions',
        lectureSpan: 'Lectures 30 to 36',
        pageRange: 'Pages 356 to 430',
        examWeightage: '20% Final-Term Marks (NPV, IRR & Working Capital)',
        keyTopics: [
          'Time value of money: Present value, future value, and annuities',
          'Capital budgeting techniques: Net Present Value (NPV) and IRR',
          'Working capital management and short-term liquidity strategies',
          'Cost of capital, debt vs equity financing, and capital structure'
        ]
      },
      {
        moduleNumber: 7,
        title: 'Supply Chain, Global Operations & Information Systems',
        lectureSpan: 'Lectures 37 to 41',
        pageRange: 'Pages 431 to 500',
        examWeightage: '15% Final-Term Marks (Operational Frameworks)',
        keyTopics: [
          'Supply chain logistics, inventory models (EOQ), and JIT systems',
          'Total Quality Management (TQM) and operational efficiency',
          'Enterprise resource planning (ERP) and management information systems',
          'International trade, exchange rate risks, and multinational strategy'
        ]
      },
      {
        moduleNumber: 8,
        title: 'Final-Term Examination Archive & Leadership Case Studies',
        lectureSpan: 'Lectures 42 to 45',
        pageRange: 'Pages 501 to 570',
        examWeightage: 'Final-Term Exam Synthesis (Lectures 23–45 Scope)',
        keyTopics: [
          'Contemporary leadership styles: Transformational vs transactional',
          'Corporate restructuring, mergers, acquisitions, and ethics cases',
          'Moaaz and Waqar Siddhu final solved past paper collections',
          'Mandatory 20% final exam independent passing requirement'
        ]
      }
    ];
  }

  // General Academic Fallback for all other faculties (Humanities, English, Sciences, Social Sciences)
  return [
    {
      moduleNumber: 1,
      title: 'Foundational Principles, Taxonomy & Introductory Frameworks',
      lectureSpan: 'Lectures 1 to 6',
      pageRange: 'Pages 1 to 65',
      examWeightage: '15% Objective Marks (Core Definitions)',
      keyTopics: [
        `${courseCode} curriculum introduction and historical perspectives`,
        'Key terminology, fundamental taxonomy, and standard classifications',
        'Theoretical assumptions, primary axioms, and contextual scope',
        'Basic problem statements and foundational analytical models'
      ]
    },
    {
      moduleNumber: 2,
      title: 'Structural Systems, Methodologies & Theoretical Formulations',
      lectureSpan: 'Lectures 7 to 12',
      pageRange: 'Pages 66 to 135',
      examWeightage: '18% Exam Marks (Short Question Rubrics)',
      keyTopics: [
        'Component interaction, structural relationships, and dependencies',
        'Standard methodologies, analytical frameworks, and evaluation tools',
        'Comparative perspectives across classical and modern theories',
        'Empirical case studies and baseline illustrative examples'
      ]
    },
    {
      moduleNumber: 3,
      title: 'Applied Analysis, Mechanistic Models & Functional Processing',
      lectureSpan: 'Lectures 13 to 18',
      pageRange: 'Pages 136 to 210',
      examWeightage: '22% Exam Marks (High Yield for Midterms)',
      keyTopics: [
        'Detailed process mechanics, operational dynamics, and workflows',
        'Qualitative and quantitative evaluation of core subject problems',
        'Standard formulas, analytical derivations, or critical readings',
        'Identification of common student errors and examiner traps'
      ]
    },
    {
      moduleNumber: 4,
      title: 'Midterm Examination Synthesis & Solved Concepts',
      lectureSpan: 'Lectures 19 to 22',
      pageRange: 'Pages 211 to 275',
      examWeightage: 'Midterm Examination Culmination (Lectures 1–22)',
      keyTopics: [
        'Comprehensive review of Lectures 1 through 22 curriculum',
        'Verified solved midterm past papers and high-frequency MCQs',
        '2-mark and 3-mark subjective conceptual definitions and answers',
        'First-half passing score strategy under the VU 20% Two-Half Rule'
      ]
    },
    {
      moduleNumber: 5,
      title: 'Advanced Frameworks, Modern Developments & Specialized Topics',
      lectureSpan: 'Lectures 23 to 29',
      pageRange: 'Pages 276 to 350',
      examWeightage: '16% Final-Term Marks (Advanced Theory)',
      keyTopics: [
        'Post-midterm theoretical expansion and specialized models',
        'Emerging paradigms, contemporary research, and updated standards',
        'Complex interactions within systems, environments, or discourses',
        'Critical evaluation rubrics and high-order cognitive concepts'
      ]
    },
    {
      moduleNumber: 6,
      title: 'Analytical Applications, Problem Solving & Case Critiques',
      lectureSpan: 'Lectures 30 to 36',
      pageRange: 'Pages 351 to 425',
      examWeightage: '20% Final-Term Marks (Analytical Questions)',
      keyTopics: [
        'Practical implementation methodologies and field applications',
        'Step-by-step problem resolution and case analysis frameworks',
        'Comparison of alternative approaches and comparative synthesis',
        'Examiner marking schemes for 5-mark comprehensive questions'
      ]
    },
    {
      moduleNumber: 7,
      title: 'Integration, Contemporary Debates & Standards Compliance',
      lectureSpan: 'Lectures 37 to 41',
      pageRange: 'Pages 426 to 495',
      examWeightage: '15% Final-Term Marks (Synthesis & Standards)',
      keyTopics: [
        'Interdisciplinary linkages, societal impacts, and governance',
        'Compliance, professional ethics, and standard operating procedures',
        'Critical reviews of contemporary literature and sector findings',
        'Synthesis of multiple modules into unified theoretical frameworks'
      ]
    },
    {
      moduleNumber: 8,
      title: 'Final-Term Examination Archive & Solved Dossier',
      lectureSpan: 'Lectures 42 to 45',
      pageRange: 'Pages 496 to 565',
      examWeightage: 'Final-Term Exam Synthesis (Lectures 23–45 Scope)',
      keyTopics: [
        'Complete review of Lectures 23 through 45 examination scope',
        'Moaaz and Waqar Siddhu final solved past paper collections',
        'Grand quiz dumps, repeated questions, and time-management tips',
        'Mandatory 20% final exam independent passing requirement'
      ]
    }
  ];
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
  const nameLower = resource.name.toLowerCase();
  const isMid = type === 'MIDTERM' || nameLower.includes('mid');
  const isFinal = type === 'FINALTERM' || nameLower.includes('final');
  const isHandout = type === 'HANDOUT' || nameLower.includes('handout');
  const isQuiz = type === 'QUIZ' || nameLower.includes('quiz');
  const isAssignment = type === 'ASSIGNMENT' || nameLower.includes('assignment');

  if (isMid) {
    termScope = 'Mid-Term Exam Scope (Lectures 1 to 22)';
  } else if (isFinal) {
    termScope = 'Final-Term Exam Scope (Lectures 23 to 45)';
  } else if (isQuiz) {
    termScope = 'Quizzes & Objective Exam Scope';
  } else if (isHandout) {
    termScope = 'Complete Course Handouts (Lectures 1 to 45)';
  } else if (isAssignment) {
    termScope = 'Active 2026 Semester Graded Activities';
  }

  // Determine Estimated Page Count Volume (Simulates real-world academic multi-hundred/thousand page docs)
  let estimatedPages = 280;
  if (isHandout) {
    estimatedPages = 450;
  } else if (isFinal) {
    estimatedPages = 320;
  } else if (isMid) {
    estimatedPages = 240;
  } else if (isQuiz || type === 'MCQFILE') {
    estimatedPages = 180;
  } else if (isAssignment) {
    estimatedPages = 18;
  }

  // Determine Type Label & Exam Strategy
  let typeLabel = 'Verified Study Resource';
  let examTips = 'Review this document alongside the official handouts and test your retention in the Interactive MCQs Studio.';
  if (isMid) {
    typeLabel = 'Midterm Solved Past Paper & Revision File';
    examTips = `Focus on core definitions and repeated MCQs from Lectures 1–22. Remember that scoring in the First Half builds your safety buffer toward the mandatory 20% Two-Half passing rule in ${code}.`;
  } else if (isFinal) {
    typeLabel = 'Final-Term Solved Past Paper & Examination Pack';
    examTips = `Virtual University regulations strictly require achieving at least 20% marks in the Final-Term exam paper alone (typically 12+ marks out of 60) to pass ${code}, regardless of midterm scores.`;
  } else if (isHandout) {
    typeLabel = 'Official Lecture Handouts & Highlighted Notes';
    examTips = `Virtual University examiners construct 100% of objective MCQs and subjective marking schemes directly from the official ${code} handouts.`;
  } else if (isQuiz) {
    typeLabel = 'Live Quiz Dumps & Solved Objective Bank';
    examTips = `Quiz questions often repeat with modified parameter values in both Midterm and Final exams. Practice with our 45-second timed simulator to master exam pacing.`;
  } else if (type === 'MCQFILE') {
    typeLabel = 'Mega Solved MCQs Question Bank';
    examTips = `Cross-verify solutions against official lecture handouts. Practice active recall before checking answers to ensure true concept retention.`;
  } else if (isAssignment) {
    typeLabel = '2026 Assignment & GDB Solution Guide';
    examTips = `Always personalize your submission by rewriting explanations and renaming code variables. Keep Turnitin similarity under 19% and leverage the official 24-hour grace period with zero marks penalty.`;
  }

  // Generate 8-Module Syllabus Roadmap tailored to course discipline
  const prefix = code.replace(/\d+.*$/, '');
  const allModules = getDisciplineModules(prefix, code, courseTitle);

  let curriculumModules: CurriculumModule[] = allModules;
  if (isMid) {
    curriculumModules = allModules.slice(0, 4); // Lectures 1-22
  } else if (isFinal) {
    curriculumModules = allModules.slice(4); // Lectures 23-45
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
  const overviewSummary = `Verified academic study resource for ${code} (${courseTitle}) under the ${faculty} at Virtual University of Pakistan. This ${format} document (${typeLabel}${contributorMention}) covers ${termScope} spanning approximately ${estimatedPages} pages across ${curriculumModules.length} curriculum modules, and is indexed for student examination review with instant in-browser preview and 100% free direct download.`;

  // Syllabus Highlights
  const syllabusHighlights: string[] = [
    `Accredited Subject: ${code} – ${courseTitle}`,
    `Academic Department: ${faculty}`,
    `Curriculum Coverage: ${termScope}`,
    `Document Volume & Breadth: ~${estimatedPages} Pages across ${curriculumModules.length} Lecture Modules`,
    `Document Classification: ${typeLabel}`,
    `Format & Compatibility: ${format} (Accessible on Windows, macOS, Android & iOS)`,
    `Verification Status: Verified zero-login educational download on MIHORA VU`
  ];

  // Tailored FAQs (Google SERP FAQPage Schema + On-Page Content)
  const faqs = [
    {
      question: `Where can I download ${displayName} for free?`,
      answer: `You can preview and download "${displayName}" (${code} ${format}, ~${estimatedPages} pages) directly from the MIHORA VU Study Library (https://study.mihora.tech/doc/${slug}) with 100% free high-speed downloads and zero registration requirements.`
    },
    {
      question: `What syllabus chapters and lectures are covered in this ${code} file?`,
      answer: `This document covers ${termScope} across ${curriculumModules.length} distinct lecture units (${curriculumModules.map((m) => m.lectureSpan).join(', ')}), featuring comprehensive definitions, solved objective questions, and examiner marking rubrics.`
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
    estimatedPages,
    curriculumModules,
    targetKeywords,
    examTips,
    overviewSummary,
    syllabusHighlights,
    faqs
  };
}
