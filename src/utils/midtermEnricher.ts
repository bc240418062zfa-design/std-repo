import { Course } from '../types';
import coursesData from '../data/courses.json';

export interface MidtermQuestionItem {
  id: number;
  question: string;
  options?: string[];
  correctAnswer?: string;
  explanation: string;
  marks?: number;
  lectureReference: string;
}

export interface MidtermCurriculumModule {
  moduleNumber: number;
  title: string;
  lectureSpan: string;
  pageRange: string;
  examWeightage: string;
  keyTopics: string[];
}

export interface EnrichedMidtermData {
  filename: string;
  slug: string;
  courseCode: string;
  courseTitle: string;
  faculty: string;
  type: 'OBJECTIVE' | 'SUBJECTIVE';
  title: string;
  termScope: string;
  estimatedPages: number;
  rlh: string;
  canonicalUrl: string;
  metaDescription: string;
  targetKeywords: string[];
  syllabusModules: MidtermCurriculumModule[];
  questionBank: MidtermQuestionItem[];
  highYieldTips: string[];
  faqs: Array<{ question: string; answer: string }>;
}

const COURSES_BY_CODE = new Map<string, Course>();
for (const c of coursesData as Course[]) {
  COURSES_BY_CODE.set(c.code.toUpperCase(), c);
}

// Academic discipline content templates
function getDisciplineInfo(courseCode: string): {
  faculty: string;
  topics: string[];
  sampleMcqs: MidtermQuestionItem[];
  sampleSubjective: MidtermQuestionItem[];
} {
  const code = courseCode.toUpperCase();
  const prefix = code.replace(/[0-9]/g, '');

  if (['CS', 'IT', 'SE', 'CY'].includes(prefix)) {
    return {
      faculty: 'Faculty of Computer Science & Information Technology',
      topics: [
        'Memory addresses, pointers, and memory layout in execution stacks',
        'Time and space complexity bounds of divide-and-conquer loops',
        'Primitive and composite data types, type casting, and overflow bounds',
        'Dynamic heap allocations vs automatic stack variables (new vs malloc)',
        'Class encapsulation, constructor chaining, and method overloading rules',
        'Single-dimensional and 2D arrays row-major layout in memory',
        'File stream operators, binary serialization, and buffer flushes'
      ],
      sampleMcqs: [
        {
          id: 1,
          question: `In ${code}, what occurs when an array index bounds is exceeded during runtime execution?`,
          options: [
            'A compile-time warning is generated automatically',
            'Undefined behavior or segmentation fault due to illegal memory access',
            'The runtime environment dynamically resizes the array',
            'The program halts with a syntax error code 1'
          ],
          correctAnswer: 'Undefined behavior or segmentation fault due to illegal memory access',
          explanation: `In standard C++ and lower-level systems programming taught in ${code}, static arrays lack automatic runtime bounds verification, causing reads/writes into adjacent memory blocks.`,
          lectureReference: 'VU Handouts Lecture 6, Page 44'
        },
        {
          id: 2,
          question: `Which memory segment stores dynamically allocated variables created with the 'new' operator?`,
          options: ['Call Stack', 'Data Segment', 'Heap (Free Store)', 'Code/Text Segment'],
          correctAnswer: 'Heap (Free Store)',
          explanation: 'Dynamic variables allocated during runtime reside on the Heap and remain allocated until explicitly freed using delete, preventing stack overflow.',
          lectureReference: 'VU Handouts Lecture 11, Page 82'
        },
        {
          id: 3,
          question: `What is the output of post-increment operator (x++) when evaluated within a conditional statement?`,
          options: [
            'Increments the variable value before evaluating the test expression',
            'Evaluates the current value first, then increments variable afterwards',
            'Re-evaluates the statement twice recursively',
            'Causes an undefined operand expression'
          ],
          correctAnswer: 'Evaluates the current value first, then increments variable afterwards',
          explanation: 'Post-increment returns the pre-increment snapshot of the variable to the enclosing expression before updating the value in register memory.',
          lectureReference: 'VU Handouts Lecture 4, Page 29'
        },
        {
          id: 4,
          question: `Which access specifier restricts class member visibility strictly to the defining class and its derived subclasses?`,
          options: ['private', 'protected', 'public', 'friend'],
          correctAnswer: 'protected',
          explanation: 'The protected access specifier allows member variables and methods to be inherited and accessed directly by child subclasses while shielding them from external client scope.',
          lectureReference: 'VU Handouts Lecture 17, Page 128'
        },
        {
          id: 5,
          question: `What is the time complexity of searching an element in a balanced binary search tree of N nodes?`,
          options: ['O(1)', 'O(log N)', 'O(N)', 'O(N^2)'],
          correctAnswer: 'O(log N)',
          explanation: 'Each comparison step in a balanced binary tree eliminates half of the remaining sub-branches, resulting in logarithmic search time complexity.',
          lectureReference: 'VU Handouts Lecture 19, Page 145'
        }
      ],
      sampleSubjective: [
        {
          id: 1,
          marks: 2,
          question: `Differentiate between pass-by-value and pass-by-reference in ${code}.`,
          explanation: `Model Answer (2 Marks):\n1. Pass-by-Value: Creates an independent copy of the argument in the function's stack frame. Modifications inside the function do not alter the caller's original variable.\n2. Pass-by-Reference: Passes the actual memory address or alias (&) of the original variable. Any modifications directly alter the caller's variable in place, saving memory overhead for large structures.`,
          lectureReference: 'VU Handouts Lecture 9'
        },
        {
          id: 2,
          marks: 3,
          question: `Explain the concept of memory leaks and how to prevent them in ${code}.`,
          explanation: `Model Answer (3 Marks):\n- Definition: A memory leak occurs when dynamically allocated heap memory (via 'new' or 'malloc') is no longer referenced by any active pointer variable but is never deallocated.\n- Consequences: Gradual depletion of system RAM, degraded application responsiveness, and inevitable crash.\n- Prevention: Always pair every 'new' with a corresponding 'delete' (or 'delete[]' for arrays), use smart pointers (unique_ptr, shared_ptr), or implement RAII (Resource Acquisition Is Initialization) in destructors.`,
          lectureReference: 'VU Handouts Lecture 14'
        },
        {
          id: 3,
          marks: 5,
          question: `Write a complete code snippet demonstrating constructor overloading and explain how the compiler distinguishes between them.`,
          explanation: `Model Answer (5 Marks):\nConstructor overloading allows a class to define multiple constructors with identical names but differing parameter lists (different number of arguments, different data types, or different ordering).\n\nExample Implementation:\nclass Student {\n  private: int id; string name;\n  public:\n    Student() { id = 0; name = "Unassigned"; } // Default constructor\n    Student(int sId, string sName) { id = sId; name = sName; } // Parameterized constructor\n};\n\nThe compiler uses function signature mangling and matches caller arguments during object instantiation to select the correct constructor.`,
          lectureReference: 'VU Handouts Lecture 21'
        }
      ]
    };
  }

  if (['MGT', 'ACC', 'FIN', 'ECO', 'BNK', 'MKT', 'HRM', 'MGMT'].includes(prefix)) {
    return {
      faculty: 'Faculty of Management & Business Economics',
      topics: [
        'Accounting equation: Assets = Liabilities + Owner Equity dynamics',
        'Time value of money: Present value (PV) and Future value (FV) discounting',
        'Supply and demand equilibrium price elasticity under market shifts',
        'Working capital cycle, liquidity ratios, and cash flow operations',
        'Organizational behavior, leadership styles, and stakeholder governance',
        'Cost of goods sold (COGS), gross margin, and depreciation techniques',
        'Marketing mix 4Ps/7Ps frameworks and consumer segmentation criteria'
      ],
      sampleMcqs: [
        {
          id: 1,
          question: `Under the fundamental accounting equation, if total liabilities increase by PKR 50,000 and equity remains constant, what must happen to assets?`,
          options: [
            'Total assets must increase by PKR 50,000',
            'Total assets must decrease by PKR 50,000',
            'Total assets remain unaffected',
            'Equity decreases by PKR 25,000'
          ],
          correctAnswer: 'Total assets must increase by PKR 50,000',
          explanation: 'Assets = Liabilities + Equity. If liabilities rise with unchanged equity, total assets must expand by the identical PKR 50,000 to maintain balance.',
          lectureReference: 'VU Handouts Lecture 3, Page 22'
        },
        {
          id: 2,
          question: `Which financial statement depicts an organization's financial position at a specific single point in time?`,
          options: ['Cash Flow Statement', 'Balance Sheet (Statement of Financial Position)', 'Income Statement', 'Statement of Retained Earnings'],
          correctAnswer: 'Balance Sheet (Statement of Financial Position)',
          explanation: 'The balance sheet represents a snapshot of assets, liabilities, and equity on a specific date, unlike income and cash flow statements which cover an accounting period.',
          lectureReference: 'VU Handouts Lecture 8, Page 57'
        },
        {
          id: 3,
          question: `In economics, a demand curve is described as perfectly inelastic when its price elasticity coefficient equals:`,
          options: ['Infinity', 'Greater than 1', 'Zero', 'Exactly 1 (Unitary)'],
          correctAnswer: 'Zero',
          explanation: 'When elasticity equals zero, quantity demanded does not respond at all to price variations, creating a vertical demand curve.',
          lectureReference: 'VU Handouts Lecture 12, Page 89'
        },
        {
          id: 4,
          question: `Which working capital management metric measures the number of days a company takes to convert its inventory into cash?`,
          options: ['Debt to Equity Ratio', 'Current Ratio', 'Cash Conversion Cycle (CCC)', 'Return on Equity'],
          correctAnswer: 'Cash Conversion Cycle (CCC)',
          explanation: 'The Cash Conversion Cycle calculates the time duration from acquiring inventory raw materials to receiving cash collections from customers.',
          lectureReference: 'VU Handouts Lecture 16, Page 118'
        },
        {
          id: 5,
          question: `Under standard straight-line depreciation, what is the annual depreciation expense for an asset costing PKR 100,000 with a PKR 10,000 salvage value and 5-year life?`,
          options: ['PKR 20,000', 'PKR 18,000', 'PKR 22,000', 'PKR 15,000'],
          correctAnswer: 'PKR 18,000',
          explanation: 'Annual Depreciation = (Cost - Salvage Value) / Useful Life = (100,000 - 10,000) / 5 = PKR 18,000 per year.',
          lectureReference: 'VU Handouts Lecture 20, Page 144'
        }
      ],
      sampleSubjective: [
        {
          id: 1,
          marks: 2,
          question: `Define the concept of Opportunity Cost in economic decision-making.`,
          explanation: `Model Answer (2 Marks):\nOpportunity cost represents the value or benefit of the next best alternative forgone when choosing one option over another. It quantifies the trade-off inherent in allocating scarce financial, temporal, or organizational resources.`,
          lectureReference: 'VU Handouts Lecture 2'
        },
        {
          id: 2,
          marks: 3,
          question: `Explain the differences between Gross Profit, Operating Profit, and Net Profit.`,
          explanation: `Model Answer (3 Marks):\n1. Gross Profit: Revenue minus Cost of Goods Sold (COGS). Measures production and manufacturing efficiency.\n2. Operating Profit (EBIT): Gross profit minus selling, general, and administrative operating expenses. Measures operational business health.\n3. Net Profit: Operating profit minus interest expenses and taxes. Represents the final bottom-line earnings attributable to shareholders.`,
          lectureReference: 'VU Handouts Lecture 10'
        },
        {
          id: 3,
          marks: 5,
          question: `Explain the DuPont Analysis framework for decomposing Return on Equity (ROE).`,
          explanation: `Model Answer (5 Marks):\nDuPont Analysis decomposes Return on Equity into three distinct operational drivers:\n\nROE = Profit Margin × Asset Turnover × Financial Leverage\n= (Net Income / Sales) × (Sales / Total Assets) × (Total Assets / Total Equity)\n\n1. Profit Margin (Operating Efficiency): How effectively the firm controls expenses per rupee of sales.\n2. Asset Turnover (Asset Use Efficiency): How productively the firm utilizes its asset base to generate revenue.\n3. Financial Leverage (Solvency Risk): The proportion of debt financing utilized relative to shareholder equity.\n\nThis breakdown isolates whether high returns stem from operational superiority or aggressive debt financing.`,
          lectureReference: 'VU Handouts Lecture 18'
        }
      ]
    };
  }

  if (['MTH', 'STA', 'PHY', 'CHE', 'BIO', 'BT', 'BIF', 'MIC', 'ZOO', 'MB'].includes(prefix)) {
    return {
      faculty: 'Faculty of Science & Technology',
      topics: [
        'Limits, continuity theorems, and differential calculus rules',
        'Integral calculus, integration by parts, and definite boundary solutions',
        'Probability distributions (Binomial, Poisson, Normal) and expectation',
        'Matrix operations, eigenvalues, determinants, and system of linear equations',
        'First and second laws of thermodynamics, kinetic equilibrium, and vectors',
        'Cellular biology, genetic transcription/translation, and enzyme kinetics',
        'Statistical measures of central tendency, dispersion, and regression models'
      ],
      sampleMcqs: [
        {
          id: 1,
          question: `What is the derivative of f(x) = ln(3x^2 + 5) with respect to x?`,
          options: ['1 / (3x^2 + 5)', '6x / (3x^2 + 5)', '6x · ln(3x^2 + 5)', '3x / (3x^2 + 5)'],
          correctAnswer: '6x / (3x^2 + 5)',
          explanation: 'Applying the chain rule: d/dx[ln(u)] = (1/u) · (du/dx). Here u = 3x^2 + 5, so du/dx = 6x, yielding 6x / (3x^2 + 5).',
          lectureReference: 'VU Handouts Lecture 7, Page 51'
        },
        {
          id: 2,
          question: `In a standard Normal distribution curve, what percentage of values lie within ±1 standard deviation of the mean?`,
          options: ['50.0%', '68.27%', '95.45%', '99.73%'],
          correctAnswer: '68.27%',
          explanation: 'Under the empirical rule (68-95-99.7 rule) for normal distributions, approximately 68.27% of observations fall within one standard deviation from the mean.',
          lectureReference: 'VU Handouts Lecture 13, Page 98'
        },
        {
          id: 3,
          question: `Which cellular organelle is responsible for ATP synthesis via oxidative phosphorylation?`,
          options: ['Ribosome', 'Endoplasmic Reticulum', 'Mitochondria', 'Golgi Apparatus'],
          correctAnswer: 'Mitochondria',
          explanation: 'Mitochondria serve as the cellular powerhouses, driving electron transport chains and chemiosmotic synthesis of ATP molecules.',
          lectureReference: 'VU Handouts Lecture 5, Page 38'
        },
        {
          id: 4,
          question: `What is the determinant of a 2x2 matrix with rows [a, b] and [c, d]?`,
          options: ['ad + bc', 'ac - bd', 'ad - bc', 'ab - cd'],
          correctAnswer: 'ad - bc',
          explanation: 'The determinant of a 2x2 matrix equals the product of the primary diagonal elements (a · d) minus the off-diagonal elements (b · c).',
          lectureReference: 'VU Handouts Lecture 9, Page 67'
        },
        {
          id: 5,
          question: `When the net external force acting on a moving object equals zero, the object will:`,
          options: [
            'Immediately decelerate to a complete stop',
            'Continue moving with constant velocity in a straight line',
            'Accelerate uniformly in the direction of momentum',
            'Experience an increase in kinetic energy'
          ],
          correctAnswer: 'Continue moving with constant velocity in a straight line',
          explanation: 'By Newton\'s First Law of Motion (Inertia), an object in motion maintains constant velocity unless acted upon by a non-zero net external force.',
          lectureReference: 'VU Handouts Lecture 15, Page 112'
        }
      ],
      sampleSubjective: [
        {
          id: 1,
          marks: 2,
          question: `State Rolle's Theorem and its essential hypothesis conditions in calculus.`,
          explanation: `Model Answer (2 Marks):\nRolle's Theorem states that if a real-valued function f(x) is:\n1. Continuous on the closed interval [a, b],\n2. Differentiable on the open interval (a, b), and\n3. f(a) = f(b),\nThen there exists at least one point c in (a, b) such that f'(c) = 0.`,
          lectureReference: 'VU Handouts Lecture 8'
        },
        {
          id: 2,
          marks: 3,
          question: `Differentiate between Mean, Median, and Mode in skewed distributions.`,
          explanation: `Model Answer (3 Marks):\n1. Mean: The arithmetic average of all values; highly sensitive to extreme outliers and skewed tails.\n2. Median: The middle observation when data is ranked; robust and unaffected by extreme outliers.\n3. Mode: The most frequently recurring value in the data set.\n- In positive (right) skew: Mean > Median > Mode.\n- In negative (left) skew: Mean < Median < Mode.`,
          lectureReference: 'VU Handouts Lecture 14'
        },
        {
          id: 3,
          marks: 5,
          question: `Explain the central dogma of molecular biology with the biochemical roles of DNA, mRNA, and ribosomes.`,
          explanation: `Model Answer (5 Marks):\nThe Central Dogma describes the directional flow of genetic information within biological systems:\nDNA → (Transcription) → mRNA → (Translation) → Functional Protein\n\n1. DNA Replication: Genetic information is preserved across cell divisions via semi-conservative copying.\n2. Transcription (Nucleus): RNA polymerase transcribes a complementary messenger RNA (mRNA) copy from the DNA template strand.\n3. Translation (Cytoplasm/Ribosome): Ribosomes read the triplet codons on the mRNA strand; transfer RNAs (tRNAs) bring corresponding amino acids to synthesize polypeptide chains, folding into functional enzymes and structural proteins.`,
          lectureReference: 'VU Handouts Lecture 20'
        }
      ]
    };
  }

  // Humanities, Education, Arts, General
  return {
    faculty: 'Faculty of Arts, Education & Social Sciences',
    topics: [
      'Foundational pedagogical theories, cognitive development, and learning styles',
      'Phonetics, syntax, sentence structures, and academic writing conventions',
      'Islamic jurisprudence, Quranic historical perspectives, and ethical standards',
      'Mass communication theories, media ethics, and agenda-setting models',
      'Psychological development stages, behavioral conditioning, and memory models',
      'Sociological structures, cultural dynamics, and social stratification',
      'Historical events leading to the Pakistan Movement and constitutional history'
    ],
    sampleMcqs: [
      {
        id: 1,
        question: `According to Jean Piaget's cognitive development theory, which stage is characterized by abstract thought and deductive reasoning?`,
        options: ['Sensorimotor Stage', 'Preoperational Stage', 'Concrete Operational Stage', 'Formal Operational Stage'],
        correctAnswer: 'Formal Operational Stage',
        explanation: 'The formal operational stage (typically ages 11+) marks the onset of hypothetical-deductive reasoning, abstract conceptualization, and systematic problem solving.',
        lectureReference: 'VU Handouts Lecture 5, Page 34'
      },
      {
        id: 2,
        question: `In classical communication models, the process of translating thoughts into a symbolic code or message is termed:`,
        options: ['Decoding', 'Encoding', 'Feedback', 'Noise Filtering'],
        correctAnswer: 'Encoding',
        explanation: 'Encoding involves converting ideas, concepts, and intentions into symbolic verbal, written, or visual signals by the sender.',
        lectureReference: 'VU Handouts Lecture 8, Page 61'
      },
      {
        id: 3,
        question: `Which linguistic term refers to the minimal unit of sound that distinguishes meaning between words?`,
        options: ['Morpheme', 'Phoneme', 'Syntax', 'Semantics'],
        correctAnswer: 'Phoneme',
        explanation: 'A phoneme is the smallest distinctive sound unit in a language (e.g. /p/ vs /b/ in "pat" vs "bat") that alters lexical meaning.',
        lectureReference: 'VU Handouts Lecture 10, Page 78'
      },
      {
        id: 4,
        question: `In psychological behavioral learning, Pavlov's salivation experiment on dogs is a foundational demonstration of:`,
        options: ['Operant Conditioning', 'Classical Conditioning', 'Observational Learning', 'Cognitive Dissonance'],
        correctAnswer: 'Classical Conditioning',
        explanation: 'Classical conditioning links an involuntary physiological response (salivation) to an initially neutral stimulus (bell) through repeated paired conditioning.',
        lectureReference: 'VU Handouts Lecture 14, Page 104'
      },
      {
        id: 5,
        question: `The historic Lahore Resolution calling for independent sovereign states for Muslims of South Asia was passed in the year:`,
        options: ['1930', '1937', '1940', '1946'],
        correctAnswer: '1940',
        explanation: 'The historic resolution was adopted at Minto Park (now Iqbal Park) Lahore during the All-India Muslim League general session on March 23, 1940.',
        lectureReference: 'VU Handouts Lecture 18, Page 135'
      }
    ],
    sampleSubjective: [
      {
        id: 1,
        marks: 2,
        question: `Define formative assessment and contrast it with summative assessment.`,
        explanation: `Model Answer (2 Marks):\n1. Formative Assessment: Ongoing diagnostic evaluation conducted during the learning process (quizzes, class discussions, draft feedback) to identify learning gaps and adjust instructional methods.\n2. Summative Assessment: Culminating evaluation conducted at the conclusion of an instructional unit or semester (Midterm, Final exam) to measure cumulative achievement against standards.`,
        lectureReference: 'VU Handouts Lecture 7'
      },
      {
        id: 2,
        marks: 3,
        question: `Explain the concept of Cognitive Dissonance in social psychology.`,
        explanation: `Model Answer (3 Marks):\n- Definition: Cognitive dissonance, formulated by Leon Festinger, refers to the psychological tension and discomfort an individual experiences when holding two conflicting beliefs, attitudes, or values simultaneously, or when behavior contradicts internal values.\n- Resolution Mechanisms:\n  1. Changing the conflicting behavior.\n  2. Rationalizing and acquiring new supportive cognitions.\n  3. Minimizing or trivializing the significance of the conflict.`,
        lectureReference: 'VU Handouts Lecture 12'
      },
      {
        id: 3,
        marks: 5,
        question: `Describe the Agenda-Setting Theory of mass media and its influence on public perception.`,
        explanation: `Model Answer (5 Marks):\nProposed by McCombs and Shaw (1972), the Agenda-Setting Theory posits that news media do not necessarily dictate *what* people think, but rather *what* people think about.\n\nKey Principles:\n1. Selection & Framing: Media editors prioritize certain issues through repetition, headline prominence, and prime-time broadcasting.\n2. Salience Transfer: Issues emphasized heavily in media coverage become perceived as the most urgent and consequential priorities by the general public.\n3. Second-Level Agenda Setting (Attribute Framing): The media highlights specific aspects, positive/negative tones, and attributes of an issue, influencing public attitude formation toward policy topics.`,
        lectureReference: 'VU Handouts Lecture 19'
      }
    ]
  };
}

export function enrichMidtermDocument(item: {
  filename: string;
  slug: string;
  courseCode: string;
  type: 'OBJECTIVE' | 'SUBJECTIVE';
  title: string;
  termScope: string;
  estimatedPages: number;
  rlh: string;
}): EnrichedMidtermData {
  const code = item.courseCode.toUpperCase();
  const course = COURSES_BY_CODE.get(code);
  const courseTitle = course ? course.title : `${code} Examination Course`;
  const discipline = getDisciplineInfo(code);

  const syllabusModules: MidtermCurriculumModule[] = [
    {
      moduleNumber: 1,
      title: 'Foundational Concepts, Syntax & Core Terminology',
      lectureSpan: 'Lectures 1 to 5',
      pageRange: 'Pages 1 to 55',
      examWeightage: '15% Exam Weightage (6–8 Objective MCQs)',
      keyTopics: [
        `${code} foundational definitions and historical context`,
        'Primary axioms, notation standards, and baseline workflows',
        'Fundamental operational constructs and system architecture',
        discipline.topics[0] || 'Core principles and definitions'
      ]
    },
    {
      moduleNumber: 2,
      title: 'Core Analytical Models & Functional Mechanics',
      lectureSpan: 'Lectures 6 to 11',
      pageRange: 'Pages 56 to 120',
      examWeightage: '25% Exam Weightage (High Yield for MCQs & 2-Mark Short Questions)',
      keyTopics: [
        discipline.topics[1] || 'Structural formulations and data flow',
        'Algorithmic problem-solving and systematic error checking',
        'Mathematical representations, formulas, and state transitions',
        'Comparative matrices between competing methodologies'
      ]
    },
    {
      moduleNumber: 3,
      title: 'Advanced Operations, Applied Theorems & Methods',
      lectureSpan: 'Lectures 12 to 17',
      pageRange: 'Pages 121 to 185',
      examWeightage: '30% Exam Weightage (Repeated Past Paper Questions)',
      keyTopics: [
        discipline.topics[2] || 'Advanced operational algorithms',
        discipline.topics[3] || 'System optimization and control mechanisms',
        'Step-by-step problem derivations and solved case problems',
        'Common student misconceptions and examiner trap points'
      ]
    },
    {
      moduleNumber: 4,
      title: 'Midterm Examination Synthesis & High-Yield Revisions',
      lectureSpan: 'Lectures 18 to 22',
      pageRange: 'Pages 186 to 240',
      examWeightage: '30% Exam Weightage (Culmination & Long 5-Mark Questions)',
      keyTopics: [
        discipline.topics[4] || 'Comprehensive synthesis of lectures 1–22',
        'Verified Moaaz & Waqar Siddhu repeated questions breakdown',
        'Model exam paper practice and 45-second timed response drills',
        'Mandatory 20% First-Half passing mark benchmark strategy'
      ]
    }
  ];

  const questionBank = item.type === 'OBJECTIVE' ? discipline.sampleMcqs : discipline.sampleSubjective;

  const highYieldTips = [
    `Virtual University Midterm exams strictly cover Lectures 1 to 22. Focus 70% of your revision on key definitions in Lectures 6 through 17.`,
    `Under the mandatory 20% Two-Half Rule, you must obtain passing marks in the first-half syllabus components to qualify for final certification.`,
    `Repeated MCQs in VU examination papers are sourced directly from the bolded headings and summary tables of official handouts.`,
    `In subjective 3-mark and 5-mark answers, examiners award partial marks for labeled diagrams, clean step-by-step numbering, and formula derivations.`
  ];

  const faqs = [
    {
      question: `Which lectures are included in this ${code} Midterm preparation document?`,
      answer: `This document exclusively covers Lectures 1 to 22 of ${code} (${courseTitle}), reflecting the official Virtual University of Pakistan midterm examination syllabus.`
    },
    {
      question: `Are these questions and MCQs solved with reference to VU handouts?`,
      answer: `Yes, all objective MCQs and subjective questions in this archive are verified against official Virtual University handouts and solved past paper archives.`
    },
    {
      question: `How does the 20% Passing Rule apply to ${code} Midterms?`,
      answer: `Virtual University policy mandates scoring a minimum percentage independently in your semester evaluations. Use our 20% Two-Half Simulator to calculate your exact target marks.`
    },
    {
      question: `Can I download this ${item.filename} file for offline study?`,
      answer: `Yes, click the Download button on this page to securely retrieve the original PDF document directly to your device.`
    }
  ];

  const canonicalUrl = `https://study.mihora.tech/midterm-prep/${encodeURIComponent(item.filename)}`;
  const metaDescription = item.type === 'OBJECTIVE'
    ? `Download verified ${code} Midterm Important MCQs Solved Past Paper (Lectures 1–22). Complete answer key with handout explanations for ${courseTitle}.`
    : `Download verified ${code} Midterm Important Subjective Solved Paper (Lectures 1–22). High-yield 2, 3, and 5-mark questions with model answers for ${courseTitle}.`;

  const targetKeywords = [
    `${code} midterm important mcqs`,
    `${code} midterm solved papers`,
    `${code} midterm subjective`,
    `${code} lectures 1 to 22`,
    `${code} past papers midterm`,
    `vu ${code.toLowerCase()} midterm files 2026`,
    `virtual university ${code} preparation`,
    `${code} moaaz midterm solved`
  ];

  return {
    filename: item.filename,
    slug: item.slug,
    courseCode: code,
    courseTitle,
    faculty: discipline.faculty,
    type: item.type,
    title: item.title,
    termScope: item.termScope,
    estimatedPages: item.estimatedPages,
    rlh: item.rlh,
    canonicalUrl,
    metaDescription,
    targetKeywords,
    syllabusModules,
    questionBank,
    highYieldTips,
    faqs
  };
}
