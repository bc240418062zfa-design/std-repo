import fs from 'fs';
import path from 'path';
import { mcqSets } from '../src/data/mcqs/index';
import { subjectiveSets } from '../src/data/subjective/index';
import {
  cleanDocumentDisplayTitle,
  DocSlugEntry,
  getDocSlugIndex
} from '../src/utils/docSlug';
import {
  getAllMidtermPrepEntries,
  getMidtermCoursesGrouped,
  getMidtermDocsForCourse,
  getMidtermSiblingEntry
} from '../src/utils/midtermPrep';

function escapeHtmlAttr(str: string): string {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

interface RouteSEO {
  path: string;
  title: string;
  description: string;
  canonical: string;
  keywords?: string;
  extraJsonLd?: object;
  preRenderedHtml: string;
}

// Load ALL 412 accredited Virtual University courses from canonical data
const coursesJsonPath = path.resolve('src/data/courses.json');
const resourcesJsonPath = path.resolve('src/data/resources.json');
let allCoursesList: Array<{ code: string; title: string; faculty: string; fileCount: number }> = [];
let totalResourceCount = 28328;
const typeCounts: Record<string, number> = {
  FINALTERM: 7361,
  QUIZ: 5733,
  MIDTERM: 3877,
  MCQFILE: 3256,
  HANDOUT: 2625,
  ASSIGNMENT: 419,
  OTHER: 5057
};

if (fs.existsSync(coursesJsonPath)) {
  try {
    allCoursesList = JSON.parse(fs.readFileSync(coursesJsonPath, 'utf-8'));
    console.log(`📚 Loaded ${allCoursesList.length} canonical VU courses from courses.json`);
  } catch (err) {
    console.error('Failed to parse courses.json:', err);
  }
}

const perCourseCounts: Record<string, Record<string, number>> = {};

if (fs.existsSync(resourcesJsonPath)) {
  try {
    const parsedResources = JSON.parse(fs.readFileSync(resourcesJsonPath, 'utf-8'));
    if (Array.isArray(parsedResources)) {
      totalResourceCount = parsedResources.length;
      const computed: Record<string, number> = {};
      for (const item of parsedResources as Array<{ type?: string; course?: string }>) {
        if (item.type) {
          computed[item.type] = (computed[item.type] || 0) + 1;
        }
        if (item.course) {
          const code = item.course.toUpperCase();
          if (!perCourseCounts[code]) {
            perCourseCounts[code] = {};
          }
          const t = item.type || 'OTHER';
          perCourseCounts[code][t] = (perCourseCounts[code][t] || 0) + 1;
        }
      }
      Object.assign(typeCounts, computed);
    }
  } catch (err) {
    console.error('Failed to parse resources.json:', err);
  }
}

const BUILD_DATE = new Date().toISOString().split('T')[0];

const docSlugIndex = getDocSlugIndex();
const docsByCourse = new Map<string, DocSlugEntry[]>();
for (const entry of docSlugIndex.entries) {
  const code = (entry.resource.course || '').toUpperCase();
  if (!docsByCourse.has(code)) docsByCourse.set(code, []);
  docsByCourse.get(code)!.push(entry);
}

// High-frequency searched courses for instant index prominence
const TOP_COURSES = allCoursesList.slice(0, 40);

const allMidtermEntries = getAllMidtermPrepEntries();
const groupedMidtermCourses = getMidtermCoursesGrouped();

const ROUTES: RouteSEO[] = [
  // 0. Dedicated Midterm Prep 2026 Hub (All 332 Courses / 664 Special Packs)
  {
    path: 'midterm-prep',
    title: 'VU Midterm Prep 2026 – 664 Solved MCQs & Subjective Banks',
    description: 'Complete Virtual University Midterm Preparation 2026 hub covering 332 subjects (664 verified packs): read full Objective Important MCQs with verified answer keys and Solved Subjective Q&As directly online.',
    canonical: 'https://study.mihora.tech/midterm-prep',
    keywords: 'vu midterm preparation 2026, vu midterm important mcqs, vu midterm important subjective solved, vu midterm question banks, acc311 midterm mcqs, cs101 midterm mcqs, cs201 midterm solved, mihora vu',
    extraJsonLd: {
      "@type": "CollectionPage",
      "@id": "https://study.mihora.tech/midterm-prep#collection",
      "name": "VU Midterm Prep 2026 – 664 Solved Question Banks",
      "description": "Complete extracted Objective MCQs and Solved Subjective Q&A banks across 332 Virtual University courses.",
      "numberOfItems": allMidtermEntries.length
    },
    preRenderedHtml: `
      <div style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif;">
        <h1 style="font-size: 2.25rem; font-weight: 900; color: #0f172a;">VU Midterm Prep 2026 – Complete Solved MCQs &amp; Subjective Question Banks (664 Packs)</h1>
        <p style="color: #475569; font-size: 1.05rem; line-height: 1.6;">
          Read complete solved Midterm Important MCQs (verified answer keys) and Midterm Important Subjective Q&amp;As directly on-page across ${groupedMidtermCourses.length} Virtual University courses.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; margin-top: 2rem;">
          ${groupedMidtermCourses.map((c) => `
            <div style="padding: 1.15rem; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
              <div style="font-family: monospace; font-weight: 800; color: #0f172a; font-size: 1rem;">${escapeHtmlAttr(c.courseCode)} – ${escapeHtmlAttr(c.courseTitle)}</div>
              <div style="color: #64748b; font-size: 0.8rem; margin: 0.25rem 0 0.75rem;">${escapeHtmlAttr(c.faculty)}</div>
              <div style="display: flex; flex-direction: column; gap: 0.4rem;">
                ${c.mcqsEntry ? `<a href="/midterm-prep/${escapeHtmlAttr(c.mcqsEntry.filename)}" style="color: #1d4ed8; font-weight: 700; text-decoration: none; font-size: 0.88rem;">${escapeHtmlAttr(c.mcqsEntry.filename)} (${c.mcqsEntry.itemCount} MCQs)</a>` : ''}
                ${c.subjectiveEntry ? `<a href="/midterm-prep/${escapeHtmlAttr(c.subjectiveEntry.filename)}" style="color: #b45309; font-weight: 700; text-decoration: none; font-size: 0.88rem;">${escapeHtmlAttr(c.subjectiveEntry.filename)} (${c.subjectiveEntry.itemCount} Q&amp;As)</a>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `
  },

  // 1. Course Directory (ALL 412 Courses)
  {
    path: 'courses',
    title: `VU Course List – All ${allCoursesList.length}+ Subjects, Past Papers & Handouts`,
    description: `Complete Virtual University course list covering all ${allCoursesList.length}+ subject codes (CS, MTH, MGT, ENG, PAK, PSY, ZOO, EDU). Access verified past papers, solved midterms, finals, lecture handouts PDF, and 2026 assignment 1 & 2 solutions.`,
    canonical: 'https://study.mihora.tech/courses',
    keywords: 'mihora vu, vu course list, virtual university all course codes, vu courses directory, virtual university all subjects, vu cs courses, vu mth courses, vu assignment solution 2026, vu past papers list, vu syllabus handouts',
    extraJsonLd: {
      "@type": "ItemList",
      "@id": "https://study.mihora.tech/courses#catalog",
      "name": "Virtual University Courses Directory",
      "description": `Comprehensive index of all ${allCoursesList.length}+ academic courses taught at Virtual University of Pakistan with 2026 assignment solution guides and solved past papers.`,
      "numberOfItems": allCoursesList.length,
      "itemListElement": allCoursesList.map((c, i) => ({
        "@type": "Course",
        "position": i + 1,
        "name": `${c.code} - ${c.title}`,
        "courseCode": c.code,
        "provider": {
          "@type": "Organization",
          "name": "Virtual University of Pakistan"
        },
        "url": `https://study.mihora.tech/courses/${c.code.toLowerCase()}`
      }))
    },
    preRenderedHtml: `
      <div style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif;">
        <h1 style="font-size: 2.25rem; font-weight: 900; color: #0f172a;">Virtual University Course Directory (All ${allCoursesList.length} Courses &amp; Codes)</h1>
        <p style="color: #475569; font-size: 1.1rem; line-height: 1.6;">
          Browse all ${allCoursesList.length} accredited undergraduate, graduate, and associate degree courses of Virtual University of Pakistan. Select any course to access verified midterm past papers, final term solved files, Moaaz &amp; Waqar Siddhu MCQs, updated handouts, and <strong>VU Assignment Solution 2026 (Latest)</strong>.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-top: 2rem;">
          ${allCoursesList.map(c => `
            <div style="padding: 1.25rem; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
              <a href="/courses/${c.code.toLowerCase()}" style="text-decoration: none; font-weight: 800; color: #0066ff; font-size: 1.15rem; display: block;">
                ${c.code} – ${c.title}
              </a>
              <div style="color: #64748b; font-size: 0.85rem; margin-top: 0.35rem;">
                Faculty: <strong>${c.faculty}</strong> • ${c.fileCount > 0 ? `${c.fileCount} Verified Files` : 'Midterm Prep 2026 Question Banks'}
              </div>
              <div style="margin-top: 0.75rem; font-size: 0.8rem; color: #0284c7;">
                <a href="/courses/${c.code.toLowerCase()}" style="text-decoration: underline; color: #0284c7; margin-right: 0.75rem;">Study Archive</a>
                ${c.fileCount > 0
                  ? `<a href="/vu-assignment-solution-2026?course=${c.code}" style="text-decoration: underline; color: #059669;">2026 Solutions</a>`
                  : `<a href="/midterm-prep" style="text-decoration: underline; color: #b45309;">Midterm Prep 2026</a>`}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `
  },

  // 2. Dedicated VU Assignment Solution 2026 Landing Hub
  {
    path: 'vu-assignment-solution-2026',
    title: 'VU Assignment Solution 2026 – All Courses Solved',
    description: `Download verified Virtual University Assignment Solution 2026 (Latest Spring & Fall Semesters), GDB solutions, quiz files, and Turnitin plagiarism-free templates (<19%) for CS101, CS201, MTH101, MGT101, and all ${allCoursesList.length} courses on MIHORA VU.`,
    canonical: 'https://study.mihora.tech/vu-assignment-solution-2026',
    keywords: 'mihora vu, vu assignment solution 2026, vu assignment solution latest, vu assignment 1 solution 2026, vu assignment 2 solution 2026, vu gdb solution 2026, vu quiz solution 2026, vu solved assignments 2026, cs101 assignment solution 2026, cs201 assignment solution 2026, mth101 assignment solution 2026, cs301 assignment solution 2026, cs504 assignment solution 2026, mgt101 assignment solution 2026, vu assignment grace period 24 hours, turnitin plagiarism vu',
    extraJsonLd: {
      "@type": "FAQPage",
      "@id": "https://study.mihora.tech/vu-assignment-solution-2026#faqs",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Where can I find VU Assignment Solution 2026 for all Virtual University courses?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "MIHORA VU (https://study.mihora.tech/vu-assignment-solution-2026) provides verified 2026 assignment solutions, Dev-C++ code templates, MathType formulas, and GDB rubrics for all ${allCoursesList.length} Virtual University subjects including CS101, CS201, CS301, MTH101, MGT101, and ENG101 with 100% free direct downloads."
          }
        },
        {
          "@type": "Question",
          "name": "How does the VU 24-hour assignment grace period work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Virtual University grants an automatic 24-hour grace period immediately after the published due date. Submissions during this grace window receive zero marks deduction (100% full credit). Once the grace period expires, the VULMS submission portal closes permanently."
          }
        },
        {
          "@type": "Question",
          "name": "How can students avoid zero marks from Turnitin plagiarism in VU assignments?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Never upload raw YouTube or WhatsApp group files directly. Turnitin flags identical assignments resulting in an automatic zero. Personalize your work by renaming variables, modifying logic flow, adding custom source code comments with your Student ID, and formatting equations in MathType."
          }
        },
        {
          "@type": "Question",
          "name": "What is the format for VU Graded Discussion Boards (GDB)?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "VU GDB responses should strictly adhere to the 200–300 words limit. State your clear position in the first paragraph and provide 2 to 3 concise, well-reasoned arguments. Submitting plagiarized answers or exceeding the word limit penalizes marks."
          }
        }
      ]
    },
    preRenderedHtml: `
      <div style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif;">
        <h1 style="font-size: 2.25rem; font-weight: 900; color: #0f172a;">
          VU Assignment Solution 2026 (Latest Spring &amp; Fall Sessions) – All ${allCoursesList.length} Courses
        </h1>
        <p style="color: #475569; font-size: 1.1rem; line-height: 1.6;">
          Official MIHORA VU educational portal for Virtual University students: Complete collection of verified <strong>VU Assignment Solutions 2026</strong>, Assignment 1 &amp; 2 solved files, Graded Discussion Boards (GDB), and Quizzes. Built with Turnitin plagiarism defense guidance (&lt; 19% similarity limit) and 24-hour grace period instructions.
        </p>
        <p style="margin-top: 0.75rem; color: #475569; font-size: 0.95rem;">
          Formatting help: <a href="/assignment-guide" style="color: #0066ff; font-weight: 700;">VU Assignment &amp; GDB Formatting Guide – Turnitin &lt;19%, MathType, Dev-C++ commenting</a>
        </p>

        <section style="margin-top: 2rem; padding: 1.5rem; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 16px;">
          <h2 style="font-size: 1.3rem; font-weight: 800; color: #166534;">
            Active Academic Rules for 2026 VU Assignments:
          </h2>
          <ul style="color: #14532d; line-height: 1.8; margin-top: 0.75rem;">
            <li><strong>24-Hour Grace Period:</strong> 0 marks deduction if submitted within 24 hours of deadline.</li>
            <li><strong>Plagiarism Ceiling:</strong> Turnitin similarity must stay strictly under 19%. Avoid zero marks by rewriting logic.</li>
            <li><strong>Allowed Formats:</strong> .docx for theoretical courses, .cpp / .py / .java for programming assignments.</li>
            <li><strong>Student ID Header:</strong> Always include your VU Student ID (e.g. BC240200000) at top of code comments.</li>
          </ul>
        </section>

        <section style="margin-top: 2.5rem;">
          <h2 style="font-size: 1.5rem; font-weight: 800; color: #0f172a;">
            Directory of All ${allCoursesList.length} Courses for 2026 Assignment Solutions:
          </h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-top: 1.25rem;">
            ${allCoursesList.map(c => `
              <div style="padding: 1rem; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
                <a href="/courses/${c.code.toLowerCase()}" style="text-decoration: none; font-weight: 700; color: #0066ff; font-size: 1.05rem;">
                  ${c.code} – ${c.title}
                </a>
                <div style="color: #64748b; font-size: 0.8rem; margin-top: 0.25rem;">
                  ${c.faculty} • ${c.fileCount > 0 ? '2026 Solutions &amp; Handouts' : 'Midterm Prep 2026 Question Banks'}
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      </div>
    `
  },

  // 2B. Alias Route for assignment-guide
  {
    path: 'assignment-guide',
    title: 'VU Assignment & GDB Formatting Guide | MIHORA VU',
    description: `VU assignment solution 2026 guide: 24-hour grace period rules, Turnitin 19% similarity limits, MathType formula pasting, Dev-C++ code formatting, and GDB rubrics for all ${allCoursesList.length} courses.`,
    canonical: 'https://study.mihora.tech/assignment-guide',
    keywords: 'vu assignment solution 2026, vu assignment grace period, vu turnitin plagiarism rules, vu math type equations word, vu dev c plus plus assignment, vu gdb format, mihora vu',
    preRenderedHtml: `
      <div style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif;">
        <h1 style="font-size: 2.25rem; font-weight: 900; color: #0f172a;">VU Assignment Solution 2026 &amp; GDB Formatting Master Guide</h1>
        <p style="color: #475569; font-size: 1.1rem; line-height: 1.6;">
          Master guide on achieving 100% marks in Virtual University assignments. Explains Turnitin 19% similarity limits, 24-hour grace periods, MathType equation formatting, and Dev-C++ code commenting.
        </p>
        <p style="margin-top: 1rem;"><a href="/vu-assignment-solution-2026" style="color: #0066ff; font-weight: 700;">Open 2026 Solutions Hub &rarr;</a></p>
      </div>
    `
  },

  // 2C. Dedicated Past Papers Hub (Moaaz, Waqar Siddhu, Midterms & Finals)
  {
    path: 'past-papers',
    title: 'VU Solved Past Papers – Midterm & Final Term',
    description: `Download verified Virtual University solved past papers: Moaaz & Waqar Siddhu midterm and final term papers, repeat MCQs, subjective question banks for all ${allCoursesList.length} courses on MIHORA VU.`,
    canonical: 'https://study.mihora.tech/past-papers',
    keywords: 'mihora vu, vu past papers, vu solved past papers, moaaz past papers, waqar siddhu past papers, vu midterm solved papers, vu final term solved papers, vu mcqs, virtual university solved papers',
    extraJsonLd: {
      "@type": "ItemList",
      "@id": "https://study.mihora.tech/past-papers#collection",
      "name": "Virtual University Solved Past Papers Archives",
      "description": "Collection of Moaaz, Waqar Siddhu, and topper-verified solved past papers for midterms and final exams."
    },
    preRenderedHtml: `
      <div style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif;">
        <h1 style="font-size: 2.25rem; font-weight: 900; color: #0f172a;">Virtual University Solved Past Papers (Moaaz &amp; Waqar Siddhu)</h1>
        <p style="color: #475569; font-size: 1.1rem; line-height: 1.6;">
          Direct high-speed download for over 28,328+ Virtual University past exam files. Verified Moaaz midterm solved papers, Waqar Siddhu final term objective MCQs, subjective solutions, and grand quiz files for all ${allCoursesList.length} courses.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-top: 2rem;">
          ${allCoursesList.filter((c) => c.fileCount > 0).slice(0, 50).map(c => `
            <div style="padding: 1rem; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
              <a href="/courses/${c.code.toLowerCase()}" style="text-decoration: none; font-weight: 700; color: #0066ff;">
                ${c.code} Past Papers &amp; Solved Files
              </a>
              <div style="color: #64748b; font-size: 0.85rem; margin-top: 0.25rem;">
                ${c.fileCount} Verified Files • Midterm &amp; Final
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `
  },

  // 2D. Interactive MCQs Directory Hub
  {
    path: 'mcqs',
    title: 'Interactive VU Exam MCQs & Subject Practice Studios',
    description: 'Dedicated interactive MCQ practice pages and timed mock quizzes for Virtual University Midterm and Final-Term courses including CS201, CS301, CS304, CS403, CS504, CS601, ENG101, ENG201, MGT301, MGT501, and PAK301.',
    canonical: 'https://study.mihora.tech/mcqs',
    keywords: 'mihora vu, vu interactive mcqs, eng101 midterm mcqs, eng201 midterm mcqs, mgt301 midterm mcqs, mgt501 midterm mcqs, pak301 midterm mcqs, cs201 midterm mcqs, cs301 midterm mcqs, cs304 midterm mcqs, cs403 midterm mcqs, cs504 midterm mcqs, cs601 midterm mcqs, virtual university online quiz practice',
    preRenderedHtml: `
      <div style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif;">
        <h1 style="font-size: 2.25rem; font-weight: 800; color: #0f172a;">Interactive VU Exam MCQs – Subject Pages</h1>
        <p style="color: #475569; font-size: 1.05rem; line-height: 1.6;">
          Open any subject below for its dedicated shareable MCQ practice quiz, timed mock exam simulator, and quick revision sheet.
        </p>
        <p style="margin-top: 0.75rem; color: #475569; font-size: 0.95rem;">
          Also: <a href="/live-mids-mcqs" style="color: #1d4ed8; font-weight: 700;">VU Live Mids MCQs – current midterm quiz bank</a> · <a href="/vu-mcqs-bank" style="color: #1d4ed8; font-weight: 700;">VU MCQs Bank – full library MCQ &amp; quiz file collection</a> · <a href="/midterm-prep" style="color: #1d4ed8; font-weight: 700;">Midterm Prep 2026 – 664 solved packs</a>
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
          ${mcqSets.map(s => `
            <div style="padding: 1.25rem; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
              <a href="/mcqs/${s.id}" style="text-decoration: none; font-weight: 700; color: #1d4ed8; font-size: 1.1rem; display: block;">
                ${s.courseCode} – ${s.courseTitle} (${s.termLabel})
              </a>
              <div style="color: #64748b; font-size: 0.85rem; margin-top: 0.35rem;">
                ${s.questions.length} Verified MCQs · Practice, Mock Exam &amp; Revision
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `
  },

  // 2E. Subjective Fast-Learning Studio Directory
  {
    path: 'subjective',
    title: 'VU Subjective Fast-Learning Studio | MIHORA VU',
    description: `Master VU 2, 3, and 5-mark subjective exam questions using flash-recall cards, 10-second memory hooks, rapid cram sheets, and all ${allCoursesList.length} subject hubs on MIHORA VU.`,
    canonical: 'https://study.mihora.tech/subjective',
    keywords: 'mihora vu, vu subjective questions, vu short questions 2 marks, vu long questions 5 marks, cs201 subjective, cs301 subjective, cs403 subjective, eng201 subjective, mgt301 subjective, pak301 subjective, vu fast learning',
    preRenderedHtml: `
      <div style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif;">
        <h1 style="font-size: 2.25rem; font-weight: 800; color: #0f172a;">VU Subjective Fast-Learning Studio</h1>
        <p style="color: #475569; font-size: 1.05rem; line-height: 1.6;">
          Active-recall flash decks, 10-second memory hooks, examiner key points, and rapid cram sheets for 2, 3, and 5-mark Virtual University subjective exams.
        </p>
        <p style="margin-top: 0.75rem; color: #475569; font-size: 0.95rem;">
          Also: <a href="/vu-subjective-solved" style="color: #1d4ed8; font-weight: 700;">Solved VU Subjective Questions (2, 3 &amp; 5 Marks) – complete solved subjective archive</a> · <a href="/midterm-prep" style="color: #1d4ed8; font-weight: 700;">Midterm Prep 2026 – 664 solved packs</a>
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
          ${subjectiveSets.map(s => `
            <div style="padding: 1.25rem; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
              <a href="/subjective/${s.id}" style="text-decoration: none; font-weight: 700; color: #1d4ed8; font-size: 1.1rem; display: block;">
                ${s.courseCode} – ${s.courseTitle} Subjective
              </a>
              <div style="color: #64748b; font-size: 0.85rem; margin-top: 0.35rem;">
                ${s.questions.length} Structured Q&amp;As · 10-Sec Hooks &amp; Cram Sheet
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `
  },

  // 2F. Dedicated Non-Branded VU MCQs Bank Hub
  {
    path: 'vu-mcqs-bank',
    title: `VU MCQs Bank – ${mcqSets.reduce((s, x) => s + x.questions.length, 0).toLocaleString()} Interactive MCQs | MIHORA VU`,
    description: `Complete Virtual University MCQs Bank: Practice ${mcqSets.reduce((s, x) => s + x.questions.length, 0).toLocaleString()}+ interactive midterm and final-term MCQs online, plus direct download for ${typeCounts.MCQFILE.toLocaleString()} Mega MCQ files and ${typeCounts.QUIZ.toLocaleString()} quiz compilations across all ${allCoursesList.length} courses.`,
    canonical: 'https://study.mihora.tech/vu-mcqs-bank',
    keywords: 'vu mcqs bank, virtual university mcqs bank, vu solved mcqs pdf, vu mega mcq files, vu grand quiz mcqs, vu midterm mcqs bank, vu finalterm mcqs bank, cs201 mcqs, cs301 mcqs, eng101 mcqs, pak301 mcqs',
    extraJsonLd: {
      "@type": "CollectionPage",
      "@id": "https://study.mihora.tech/vu-mcqs-bank#collection",
      "name": "Virtual University Complete MCQs Bank",
      "description": `Interactive quizzes (${mcqSets.length} studios) and ${typeCounts.MCQFILE.toLocaleString()} downloadable MCQ compilations for Virtual University exams.`
    },
    preRenderedHtml: `
      <div style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif;">
        <h1 style="font-size: 2.25rem; font-weight: 900; color: #0f172a;">Virtual University Complete MCQs Bank (${mcqSets.reduce((s, x) => s + x.questions.length, 0).toLocaleString()}+ Interactive &amp; ${typeCounts.MCQFILE.toLocaleString()} Mega MCQ Files)</h1>
        <p style="color: #475569; font-size: 1.05rem; line-height: 1.6;">
          Practice high-frequency repeated Midterm and Final-Term MCQs with 45-second timed mock exams, instant answer explanations, and quick revision sheets. Plus browse ${typeCounts.MCQFILE.toLocaleString()} Mega MCQ files and ${typeCounts.QUIZ.toLocaleString()} quiz compilations across all ${allCoursesList.length} VU courses.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
          ${mcqSets.map(s => `
            <div style="padding: 1.25rem; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
              <a href="/mcqs/${s.id}" style="text-decoration: none; font-weight: 700; color: #1d4ed8; font-size: 1.1rem; display: block;">
                ${s.courseCode} ${s.termLabel} MCQs Bank (${s.questions.length} Qs)
              </a>
              <div style="color: #64748b; font-size: 0.85rem; margin-top: 0.35rem;">
                ${s.courseTitle} · Practice, Timed Exam &amp; Cram Sheet
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `
  },

  // 2G. Dedicated Non-Branded Live Mids MCQs & Quiz Bank Hub
  {
    path: 'live-mids-mcqs',
    title: `VU Live Mids MCQs & Midterm Quiz Bank | MIHORA VU`,
    description: `Access Virtual University Live Mids MCQs, ${typeCounts.QUIZ.toLocaleString()} verified quiz files, ${typeCounts.MIDTERM.toLocaleString()} solved midterm past papers, and timed midterm practice tests across all ${allCoursesList.length} VU courses.`,
    canonical: 'https://study.mihora.tech/live-mids-mcqs',
    keywords: 'vu live mids mcqs, vu live quiz bank, vu midterm mcqs quiz bank, vu current midterm papers, vu grand quiz solved mcqs, vu quiz 1 quiz 2 mcqs, vu midterm repeat mcqs',
    extraJsonLd: {
      "@type": "FAQPage",
      "@id": "https://study.mihora.tech/live-mids-mcqs#faqs",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How does the VU Live Mids MCQs & Quiz Bank help during ongoing midterm exams?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `It combines ${typeCounts.QUIZ.toLocaleString()} student-shared quiz dumps and ${typeCounts.MIDTERM.toLocaleString()} midterm solved papers with interactive 45-second timed mock MCQ sets so VU students can revise repeated midterm questions before entering the exam lab.`
          }
        }
      ]
    },
    preRenderedHtml: `
      <div style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif;">
        <h1 style="font-size: 2.25rem; font-weight: 900; color: #0f172a;">VU Live Mids MCQs &amp; Current Midterm Quiz Bank (${typeCounts.QUIZ.toLocaleString()} Quiz Files · ${typeCounts.MIDTERM.toLocaleString()} Midterms)</h1>
        <p style="color: #475569; font-size: 1.05rem; line-height: 1.6;">
          Rapidly revise live quiz dumps, current midterm memory files, and verified Midterm MCQ banks across ${allCoursesList.length} Virtual University courses.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
          ${mcqSets.map(s => `
            <div style="padding: 1.25rem; border: 1px solid #bae6fd; border-radius: 12px; background: #ffffff;">
              <a href="/mcqs/${s.id}" style="text-decoration: none; font-weight: 700; color: #0369a1; font-size: 1.1rem; display: block;">
                ${s.courseCode} Live Midterm &amp; Quiz MCQs (${s.questions.length} Qs)
              </a>
              <div style="color: #64748b; font-size: 0.85rem; margin-top: 0.35rem;">
                ${s.courseTitle} · Timed Practice &amp; Quick Flash Review
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `
  },

  // 2H. Dedicated Non-Branded Official Handouts PDF Hub
  {
    path: 'vu-handouts-pdf',
    title: `VU Lecture Handouts PDF Free Download | MIHORA VU`,
    description: `Direct free download of ${typeCounts.HANDOUT.toLocaleString()}+ official Virtual University lecture handouts PDF, highlighted short notes, and syllabus books for CS, MTH, ENG, MGT, and all ${allCoursesList.length} VU courses.`,
    canonical: 'https://study.mihora.tech/vu-handouts-pdf',
    keywords: 'vu handouts pdf, virtual university lecture handouts free download, vu highlighted handouts pdf, cs101 handouts pdf, cs201 handouts pdf, mth101 handouts pdf, eng101 handouts pdf, vu short notes pdf',
    extraJsonLd: {
      "@type": "CollectionPage",
      "@id": "https://study.mihora.tech/vu-handouts-pdf#collection",
      "name": "Virtual University Official Lecture Handouts PDF Archive",
      "description": `${typeCounts.HANDOUT.toLocaleString()} official lecture handouts and highlighted study notes indexed across ${allCoursesList.length} subjects.`
    },
    preRenderedHtml: `
      <div style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif;">
        <h1 style="font-size: 2.25rem; font-weight: 900; color: #0f172a;">Official Virtual University Lecture Handouts PDF (${typeCounts.HANDOUT.toLocaleString()} Handouts &amp; Highlighted Notes)</h1>
        <p style="color: #475569; font-size: 1.05rem; line-height: 1.6;">
          Download complete official VU lecture handouts PDF, highlighted exam-focused short notes, and reference textbooks free with zero login across all ${allCoursesList.length} accredited subjects.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
          ${TOP_COURSES.map(c => `
            <div style="padding: 1rem; border: 1px solid #d1fae5; border-radius: 12px; background: #ffffff;">
              <a href="/courses/${c.code.toLowerCase()}" style="text-decoration: none; font-weight: 700; color: #047857;">
                ${c.code} – ${c.title} Handouts PDF
              </a>
              <div style="color: #64748b; font-size: 0.85rem; margin-top: 0.25rem;">
                ${c.faculty} · ${c.fileCount} Total Files
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `
  },

  // 2I. Dedicated Non-Branded Solved Subjective Questions Hub
  {
    path: 'vu-subjective-solved',
    title: 'Solved VU Subjective Questions (2, 3 & 5 Marks)',
    description: `Study high-yield solved 2, 3, and 5-mark Virtual University subjective short and long exam questions with 10-second memory hooks, examiner rubrics, and rapid cram sheets across all ${allCoursesList.length} courses.`,
    canonical: 'https://study.mihora.tech/vu-subjective-solved',
    keywords: 'vu short questions solved, vu long questions 5 marks solved, vu subjective solved papers, vu 2 marks 3 marks 5 marks questions, cs201 subjective solved, cs301 subjective solved, cs403 subjective solved, eng201 subjective, mgt301 subjective, pak301 subjective',
    extraJsonLd: {
      "@type": "CollectionPage",
      "@id": "https://study.mihora.tech/vu-subjective-solved#collection",
      "name": "Virtual University Solved 2/3/5-Mark Subjective Questions Hub",
      "description": `Fast-learning subjective question packs with 10-second memory hooks and examiner key points across ${allCoursesList.length} VU courses.`
    },
    preRenderedHtml: `
      <div style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif;">
        <h1 style="font-size: 2.25rem; font-weight: 900; color: #0f172a;">Solved VU Subjective Short &amp; Long Questions (2, 3 &amp; 5 Marks Fast-Prep)</h1>
        <p style="color: #475569; font-size: 1.05rem; line-height: 1.6;">
          High-yield Virtual University subjective exam answers structured by 2, 3, and 5-mark rubrics, 10-second memory hooks, and printable cram sheets.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
          ${subjectiveSets.map(s => `
            <div style="padding: 1.25rem; border: 1px solid #fde68a; border-radius: 12px; background: #ffffff;">
              <a href="/subjective/${s.id}" style="text-decoration: none; font-weight: 700; color: #b45309; font-size: 1.1rem; display: block;">
                ${s.courseCode} – ${s.courseTitle} Solved Subjective
              </a>
              <div style="color: #64748b; font-size: 0.85rem; margin-top: 0.35rem;">
                ${s.questions.length} Structured 2/3/5-Mark Q&amp;As · 10-Sec Hooks
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `
  },

  // 3. VU Student Handbook & FAQs
  {
    path: 'handbook',
    title: 'VU Student Handbook 2026 – FAQs, Rules & Grading',
    description: 'Official VU Student Handbook: 33 authentic Q&As covering the 20% two-half rule, paper rechecking (PKR 500), merit/need scholarships, grading scheme (A+ to F), datesheet booking, CGPA probation, and paper rescheduling (PKR 2,000).',
    canonical: 'https://study.mihora.tech/handbook',
    keywords: 'mihora vu, vu student handbook, handbook vu edu pk guide, virtual university student handbook, VU 20 percent rule, vu passing rules, vu paper rechecking fee 500, vu merit scholarship cgpa, vu grading scheme, vu date sheet schedule, vu academic probation, vu fee installment, vu paper reschedule fee',
    extraJsonLd: {
      "@type": "FAQPage",
      "@id": "https://study.mihora.tech/handbook#faqs",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the 20% Two-Half Passing Rule in Virtual University?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Virtual University mandates scoring at least 20% in the First Half (Quizzes, Assignments, GDBs, and Midterm exam combined) AND independently at least 20% in the Final Term Exam paper. Even if a student has high sessional marks, scoring under 20% in the Final Term results in an automatic F grade."
          }
        },
        {
          "@type": "Question",
          "name": "Why must students make their Date Sheet within the first 1 to 2 hours of opening?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Exam seats and preferred computer lab slots in every VU center are strictly allocated on a first-come, first-served basis. Morning and afternoon slots fill up within minutes. Missing the initial window may force students into distant campuses or difficult late evening timings."
          }
        },
        {
          "@type": "Question",
          "name": "How does the Assignment 24-Hour Grace Period work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Virtual University provides an automatic 24-hour grace period following the regular assignment deadline. Submitting during this grace window carries zero marks deduction. After the grace period expires, the LMS upload link closes permanently."
          }
        },
        {
          "@type": "Question",
          "name": "What happens if a student misses a Midterm or Final Term exam?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Students can apply for a Rescheduled Paper through VULMS Student Services within the announced window. A reschedule fee of PKR 2,000 per paper is charged, and all rescheduled papers are held on a designated makeup day."
          }
        },
        {
          "@type": "Question",
          "name": "How much is the VU Paper Rechecking fee and when should I apply?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Apply via VULMS > Student Services > Examinations Department within the announced 5 to 7 day window after result publication. The non-refundable fee is PKR 500 per paper (local) or $20 USD per paper (overseas), covering marks totalling and unmarked question verification."
          }
        },
        {
          "@type": "Question",
          "name": "What are the eligibility requirements for VU Merit-Based and Need-Based Scholarships?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Continuing students qualify automatically for Merit Scholarships with at least 3.00 CGPA, 3.25 Semester GPA, and full prescribed credits (1 scholarship per 50 students, max 10 per program). Need-Based Scholarships are applied per semester via VULMS > Student Services > Accounts."
          }
        },
        {
          "@type": "Question",
          "name": "What is the official Virtual University grading scheme and is a D grade Pass?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, a D grade (50% to 60%, 1.00 to 1.99 GPA) is passing and unlocks prerequisite courses, though it may be repeated optionally to improve CGPA. Top grades are A+ (90-100%, 4.00), A (85-89%, 4.00), A- (80-84%), B+ (75-79%), B (71-74%), B- (68-70%), and C (61-67%)."
          }
        },
        {
          "@type": "Question",
          "name": "What happens if a student misses Course Selection or wants to Add/Drop courses?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Courses can be added, dropped, or replaced via VULMS Course Selection up to the academic calendar Add/Drop deadline before fee vouchers lock. Skipping enrollment entirely marks a continuing student as Inactive, triggering re-admission requirements."
          }
        }
      ]
    },
    preRenderedHtml: `
      <div style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif;">
        <h1 style="font-size: 2rem; font-weight: 900; color: #0f172a;">Virtual University Academic Handbook &amp; 33 Essential Student FAQs (2026)</h1>
        <p style="color: #475569; font-size: 1.1rem; line-height: 1.6;">
          Authoritative academic policies of Virtual University of Pakistan: The 20% Two-Half evaluation rule, paper rechecking (PKR 500), merit &amp; need-based scholarships, official A+ to F grading scheme, Zero Semester &amp; credit transfer rules, 24-hour assignment grace period, fee installments, and missed paper rescheduling (PKR 2,000).
        </p>
        <p style="margin-top: 0.75rem; color: #475569; font-size: 0.95rem;">
          Related guides: <a href="/datesheet-guide" style="color: #1d4ed8; font-weight: 700;">VU Datesheet Maker &amp; Seat Booking Guide 2026</a> · <a href="/cs619-guide" style="color: #1d4ed8; font-weight: 700;">CS619 Final Year Project (FYP) Guide</a> · <a href="/vu-assignment-solution-2026" style="color: #1d4ed8; font-weight: 700;">VU Assignment Solution 2026</a>
        </p>
      </div>
    `
  },

  // 4. Exam Passing Marks Simulator / VU Mid Calculator
  {
    path: 'simulator',
    title: 'VU Mid Calculator & Passing Marks Simulator',
    description: 'Calculate exact midterm and Final-Term marks needed in Virtual University exams. Check compliance with the official 20% Two-Half passing rule and download your free academic PDF report on MIHORA VU.',
    canonical: 'https://study.mihora.tech/simulator',
    keywords: 'mihora vu, vu mid calculator, vu midterm calculator, VU passing marks simulator, vu final term marks calculator, vu 20 percent rule calculator, vu gpa target simulator, vu exam grading calculator',
    preRenderedHtml: `
      <div style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif;">
        <h1 style="font-size: 2rem; font-weight: 900; color: #0f172a;">VU Mid Calculator &amp; Exam Passing Marks Simulator</h1>
        <p style="color: #475569; font-size: 1.1rem; line-height: 1.6;">
          Real-time academic calculator calculating your Midterm standing and exact Final-Term examination score required to pass any VU course or achieve target grades (A, B, C, D) under the official 20% Two-Half Passing Rule.
        </p>
        <p style="margin-top: 0.75rem; color: #475569; font-size: 0.95rem;">
          Also try: <a href="/gpa-calculator" style="color: #1d4ed8; font-weight: 700;">VU GPA &amp; CGPA Calculator (Official 4.0 Scale)</a> · <a href="/handbook" style="color: #1d4ed8; font-weight: 700;">VU Student Handbook 2026 – FAQs, Rules &amp; Grading</a>
        </p>
      </div>
    `
  },

  // 5. VU GPA & CGPA Calculator
  {
    path: 'gpa-calculator',
    title: 'VU GPA & CGPA Calculator 4.0 | MIHORA VU',
    description: 'Calculate Virtual University semester GPA and forecast cumulative CGPA under the official HEC 4.0 scale. Includes academic probation checker and repeat policy guide on MIHORA VU.',
    canonical: 'https://study.mihora.tech/gpa-calculator',
    keywords: 'mihora vu, VU GPA calculator, vu cgpa calculator, vu grading scale 4.0, calculate vu semester gpa, vu academic probation cgpa',
    preRenderedHtml: `
      <div style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif;">
        <h1 style="font-size: 2rem; font-weight: 900; color: #0f172a;">VU GPA &amp; CGPA Calculator (Official 4.0 Scale)</h1>
        <p style="color: #475569; font-size: 1.1rem; line-height: 1.6;">
          Online academic grade point calculator modeling the official Virtual University of Pakistan 4.0 grading system.
        </p>
      </div>
    `
  },

  // 6. Datesheet Guide
  {
    path: 'datesheet-guide',
    title: 'VU Datesheet Maker & Seat Booking Guide 2026',
    description: 'Official guide to VU datesheet opening, first-come first-served lab seat allocation, preferred timeslots, and paper rescheduling procedure on MIHORA VU.',
    canonical: 'https://study.mihora.tech/datesheet-guide',
    keywords: 'mihora vu, VU datesheet maker, datesheet vu edu pk, how to make vu datesheet, vu datesheet opening date, vu exam center selection',
    preRenderedHtml: `
      <div style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif;">
        <h1 style="font-size: 2rem; font-weight: 900; color: #0f172a;">VU Datesheet Maker &amp; Seat Booking Master Strategy</h1>
        <p style="color: #475569; font-size: 1.1rem; line-height: 1.6;">
          Complete handbook for Virtual University examination schedule creation.
        </p>
      </div>
    `
  },

  // 7. CS619 FYP Capstone
  {
    path: 'cs619-guide',
    title: 'CS619 Final Year Project (FYP) Guide | MIHORA VU',
    description: 'Complete CS619 capstone project guide: Proposal, IEEE 830 SRS documentation, ERD database design, test phases, and top 25 viva voce defense questions on MIHORA VU.',
    canonical: 'https://study.mihora.tech/cs619-guide',
    keywords: 'mihora vu, CS619 project proposal, cs619 srs template, cs619 viva questions, vu final year project, cs619 design document erd',
    preRenderedHtml: `
      <div style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif;">
        <h1 style="font-size: 2rem; font-weight: 900; color: #0f172a;">CS619 Final Year Project (FYP) Capstone Roadmap &amp; Viva Voce Guide</h1>
        <p style="color: #475569; font-size: 1.1rem; line-height: 1.6;">
          Comprehensive milestone walkthrough for Virtual University BSCS, BSIT, and BSSE final year students.
        </p>
      </div>
    `
  },

  // 8. Privacy & Trust Guarantee
  {
    path: 'security',
    title: 'Privacy & Trust – Zero Data Collection | MIHORA VU',
    description: 'Our student safety commitment: zero cookies, zero telemetry, verified clean academic files, and instant direct downloads without login on MIHORA VU.',
    canonical: 'https://study.mihora.tech/security',
    keywords: 'mihora vu, mihora tech privacy, virtual university safe past papers, zero telemetry study portal',
    preRenderedHtml: `
      <div style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif;">
        <h1 style="font-size: 2rem; font-weight: 900; color: #0f172a;">Privacy, Safety &amp; Trust Guarantee</h1>
        <p style="color: #475569; font-size: 1.1rem; line-height: 1.6;">
          MIHORA STUDY LIBRARY operates as a zero-telemetry, non-commercial educational public service for Pakistani students.
        </p>
      </div>
    `
  },

  // 9. About MIHORA TECH
  {
    path: 'about',
    title: 'About MIHORA TECH – Free VU Study Resources',
    description: 'Learn about MIHORA TECH\'s non-commercial educational CSR mission to provide free, fast, and structured academic study archives for Pakistani students.',
    canonical: 'https://study.mihora.tech/about',
    keywords: 'mihora vu, about mihora tech, mihora educational csr, virtual university free study library',
    preRenderedHtml: `
      <div style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif;">
        <h1 style="font-size: 2rem; font-weight: 900; color: #0f172a;">About MIHORA TECH &amp; Academic CSR Initiative</h1>
        <p style="color: #475569; font-size: 1.1rem; line-height: 1.6;">
          MIHORA TECH is an enterprise software engineering and cloud systems organization. The MIHORA STUDY LIBRARY is a non-commercial corporate social responsibility (CSR) project dedicated to empowering higher education across Pakistan.
        </p>
      </div>
    `
  },

  // 10. Curriculum & Faculty Sitemap
  {
    path: 'sitemap',
    title: 'VU Curriculum & Faculty Sitemap | MIHORA VU',
    description: `Comprehensive portal map of all Virtual University faculties, departments, ${allCoursesList.length} courses, handbook guides, passing calculators, and XML sitemaps on MIHORA VU.`,
    canonical: 'https://study.mihora.tech/sitemap',
    keywords: 'mihora vu, vu sitemap directory, virtual university all courses list, vu curriculum map',
    preRenderedHtml: `
      <div style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif;">
        <h1 style="font-size: 2rem; font-weight: 900; color: #0f172a;">Virtual University Curriculum &amp; Portal Sitemap Directory</h1>
        <p style="color: #475569; font-size: 1.1rem; line-height: 1.6;">
          Complete navigation index for all sections of MIHORA STUDY LIBRARY, departmental course catalogs, and search crawler resources.
        </p>
        <section style="margin-top: 1.5rem; padding: 1.5rem; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="font-size: 1.25rem; font-weight: 800; color: #0f172a;">Study Hubs</h2>
          <p style="color: #475569; line-height: 2; margin-top: 0.5rem;">
            <a href="/courses" style="color: #1d4ed8; font-weight: 700;">All ${allCoursesList.length} VU Courses</a> ·
            <a href="/midterm-prep" style="color: #1d4ed8; font-weight: 700;">Midterm Prep 2026 – 664 Solved Packs</a> ·
            <a href="/mcqs" style="color: #1d4ed8; font-weight: 700;">Interactive MCQs</a> ·
            <a href="/subjective" style="color: #1d4ed8; font-weight: 700;">Subjective Fast-Learning Studio</a> ·
            <a href="/past-papers" style="color: #1d4ed8; font-weight: 700;">Solved Past Papers</a> ·
            <a href="/vu-assignment-solution-2026" style="color: #1d4ed8; font-weight: 700;">VU Assignment Solution 2026</a> ·
            <a href="/vu-mcqs-bank" style="color: #1d4ed8; font-weight: 700;">VU MCQs Bank</a> ·
            <a href="/live-mids-mcqs" style="color: #1d4ed8; font-weight: 700;">VU Live Mids MCQs</a> ·
            <a href="/vu-handouts-pdf" style="color: #1d4ed8; font-weight: 700;">VU Lecture Handouts PDF</a> ·
            <a href="/vu-subjective-solved" style="color: #1d4ed8; font-weight: 700;">Solved VU Subjective Questions</a>
          </p>
          <h2 style="font-size: 1.25rem; font-weight: 800; color: #0f172a; margin-top: 1.5rem;">Guides &amp; Calculators</h2>
          <p style="color: #475569; line-height: 2; margin-top: 0.5rem;">
            <a href="/handbook" style="color: #1d4ed8; font-weight: 700;">VU Student Handbook 2026</a> ·
            <a href="/assignment-guide" style="color: #1d4ed8; font-weight: 700;">VU Assignment &amp; GDB Formatting Guide</a> ·
            <a href="/datesheet-guide" style="color: #1d4ed8; font-weight: 700;">VU Datesheet Maker &amp; Seat Booking Guide</a> ·
            <a href="/cs619-guide" style="color: #1d4ed8; font-weight: 700;">CS619 Final Year Project Guide</a> ·
            <a href="/simulator" style="color: #1d4ed8; font-weight: 700;">VU Mid Calculator &amp; Passing Marks Simulator</a> ·
            <a href="/gpa-calculator" style="color: #1d4ed8; font-weight: 700;">VU GPA &amp; CGPA Calculator</a>
          </p>
          <h2 style="font-size: 1.25rem; font-weight: 800; color: #0f172a; margin-top: 1.5rem;">About &amp; Legal</h2>
          <p style="color: #475569; line-height: 2; margin-top: 0.5rem;">
            <a href="/about" style="color: #1d4ed8; font-weight: 700;">About MIHORA TECH</a> ·
            <a href="/security" style="color: #1d4ed8; font-weight: 700;">Privacy &amp; Trust – Zero Data Collection</a> ·
            <a href="/disclaimer" style="color: #1d4ed8; font-weight: 700;">Academic Disclaimer &amp; Fair Use Notice</a>
          </p>
        </section>
      </div>
    `
  },

  // 11. Academic Disclaimer & Terms
  {
    path: 'disclaimer',
    title: 'Academic Disclaimer & Fair Use Notice | MIHORA VU',
    description: 'Fair educational use disclosures, copyright policies, student ethics, and independent non-affiliation notice with Virtual University.',
    canonical: 'https://study.mihora.tech/disclaimer',
    keywords: 'mihora vu, academic disclaimer, fair use educational resource, virtual university terms',
    preRenderedHtml: `
      <div style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif;">
        <h1 style="font-size: 2rem; font-weight: 900; color: #0f172a;">Academic Disclaimer &amp; Fair Educational Use Notice</h1>
        <p style="color: #475569; font-size: 1.1rem; line-height: 1.6;">
          MIHORA STUDY LIBRARY is an independent educational indexing utility created for student revision purposes under international fair use doctrines.
        </p>
      </div>
    `
  }
];

// Add ALL courses in courses.json as dedicated, high-ranking static routes
for (const course of allCoursesList) {
  const cCounts = perCourseCounts[course.code.toUpperCase()] || {};
  const finalCnt = cCounts['FINALTERM'] || 0;
  const midCnt = cCounts['MIDTERM'] || 0;
  const quizCnt = cCounts['QUIZ'] || 0;
  const mcqCnt = cCounts['MCQFILE'] || 0;
  const handoutCnt = cCounts['HANDOUT'] || 0;
  const assignCnt = cCounts['ASSIGNMENT'] || 0;
  // 43 courses (e.g. MGT201, MTH102) have Midterm Prep 2026 packs but no
  // library files yet — their pages lead with the packs, never "0 files".
  const hasLibraryFiles = course.fileCount > 0;
  const courseMidterms = getMidtermDocsForCourse(course.code);
  const courseMidtermTotal = courseMidterms.reduce((s, m) => s + m.itemCount, 0);
  // Keep titles ≤60 chars: long official course titles drop the brand suffix.
  const coursePageTitleFull = `${course.code} – ${course.title} | MIHORA VU`;
  const coursePageTitle =
    coursePageTitleFull.length > 60 ? `${course.code} – ${course.title}` : coursePageTitleFull;

  ROUTES.push({
    path: `courses/${course.code.toLowerCase()}`,
    title: coursePageTitle,
    description: hasLibraryFiles
      ? `Download verified ${course.code} (${course.title}) VU Assignment 1 & 2 Solution 2026, GDB solution, ${midCnt} midterm & ${finalCnt} final-term past papers (Moaaz, Waqar Siddhu), ${quizCnt + mcqCnt} quiz/MCQ files, and ${handoutCnt} lecture handouts PDF free on MIHORA VU.`
      : `Read all ${courseMidtermTotal} solved ${course.code} (${course.title}) Midterm Prep 2026 questions — Midterm Important MCQs with verified answer keys and Subjective Q&As with model answers — directly on-page, free, no login.`,
    canonical: `https://study.mihora.tech/courses/${course.code.toLowerCase()}`,
    keywords: `mihora vu, ${course.code} assignment 1 solution 2026, ${course.code} assignment 2 solution 2026, ${course.code} assignment solution 2026, ${course.code} assignment solution latest, ${course.code} gdb solution 2026, ${course.code} past papers, ${course.code} solved midterm, ${course.code} final term papers, ${course.code} handouts pdf, ${course.code} mcqs bank, ${course.code} live mids mcqs, ${course.code} subjective, ${course.code} vu, virtual university ${course.code}`,
    extraJsonLd: {
      "@type": "Course",
      "@id": `https://study.mihora.tech/courses/${course.code.toLowerCase()}#course`,
      "name": `${course.code} - ${course.title}`,
      "courseCode": course.code,
      "description": hasLibraryFiles
        ? `Complete study archive for ${course.code} (${course.title}) featuring ${course.fileCount} verified documents: ${finalCnt} Final-Term, ${midCnt} Midterm, ${quizCnt + mcqCnt} Quiz/MCQ files, ${handoutCnt} Handouts PDF, and 2026 Assignment 1 & 2 solutions.`
        : `${course.code} (${course.title}) Midterm Prep 2026: ${courseMidterms.length} solved question banks (${courseMidtermTotal} questions) with verified answer keys and model answers, readable in full on-page.`,
      "provider": {
        "@type": "Organization",
        "name": "Virtual University of Pakistan"
      },
      "educationalCredentialAwarded": "Bachelor / Associate / Master Degree Credit",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "PKR",
        "category": "Free Educational Download"
      }
    },
    preRenderedHtml: `
      <div style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif;">
        <h1 style="font-size: 2.25rem; font-weight: 900; color: #0f172a; margin-bottom: 0.5rem;">
          ${course.code} – ${course.title}: ${hasLibraryFiles ? 'Assignment 1 &amp; 2 Solution 2026, Past Papers &amp; Handouts PDF' : 'Midterm Prep 2026 Solved Question Banks'}
        </h1>
        <p style="color: #475569; font-size: 1.1rem; line-height: 1.6;">
          ${hasLibraryFiles
            ? `Department: <strong>${course.faculty}</strong> • Total Verified Collection: <strong>${course.fileCount} Files</strong> (${finalCnt} Final-Term, ${midCnt} Midterm, ${quizCnt} Quizzes, ${mcqCnt} MCQ Banks, ${handoutCnt} Handouts PDF, ${assignCnt} Assignments).`
            : `Department: <strong>${course.faculty}</strong> • Midterm Prep 2026: <strong>${courseMidterms.length} solved question banks (${courseMidtermTotal} questions)</strong> — full text on-page. No library files for this course in the archive yet.`}
        </p>
        ${hasLibraryFiles ? `
        <div style="margin-top: 1.5rem; padding: 1.5rem; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <h2 style="font-size: 1.3rem; font-weight: 700; color: #0066ff;">Verified Study Resources for ${course.code} (${course.title}):</h2>
          <ul style="color: #475569; line-height: 1.8; margin-top: 0.5rem;">
            <li><strong>${course.code} Assignment 1 &amp; 2 Solution 2026 + GDB:</strong> Formatting templates, Turnitin &lt;19% originality defense, and 24-hour grace period calendar (${assignCnt} archived assignment files).</li>
            <li><strong>${course.code} Midterm &amp; Live Mids MCQs (${midCnt + quizCnt} Files):</strong> Solved midterm past papers (Moaaz &amp; Waqar Siddhu) and current quiz/MCQ banks.</li>
            <li><strong>${course.code} Final-Term Solved Papers (${finalCnt} Files):</strong> Complete subjective 2/3/5-mark answers and objective mega files.</li>
            <li><strong>${course.code} Lecture Handouts PDF (${handoutCnt} Files):</strong> Official Virtual University handouts, highlighted short notes, and syllabus guides.</li>
            <li><strong>${course.code} Mega MCQs &amp; Subjective Prep (${mcqCnt} MCQ Files):</strong> Practice repeat objective MCQs and 10-second subjective memory hooks.</li>
          </ul>
          <div style="margin-top: 1.5rem; display: flex; flex-wrap: wrap; gap: 0.75rem;">
            <a href="/courses?course=${course.code}" style="display: inline-block; padding: 0.75rem 1.25rem; background: #0066ff; color: #ffffff; font-weight: 700; text-decoration: none; border-radius: 8px;">
              Download ${course.code} Files (${course.fileCount})
            </a>
            <a href="/vu-assignment-solution-2026?course=${course.code}" style="display: inline-block; padding: 0.75rem 1.25rem; background: #f0fdf4; color: #166534; font-weight: 700; text-decoration: none; border-radius: 8px; border: 1px solid #bbf7d0;">
              ${course.code} 2026 Assignment Solutions
            </a>
            <a href="/vu-mcqs-bank" style="display: inline-block; padding: 0.75rem 1.25rem; background: #eff6ff; color: #1d4ed8; font-weight: 700; text-decoration: none; border-radius: 8px; border: 1px solid #bfdbfe;">
              MCQs Bank &amp; Live Mids
            </a>
            <a href="/simulator" style="display: inline-block; padding: 0.75rem 1.25rem; background: #fffbeb; color: #b45309; font-weight: 700; text-decoration: none; border-radius: 8px; border: 1px solid #fde68a;">
              ${course.code} Mid Calculator
            </a>
          </div>
        </div>` : `
        <div style="margin-top: 1.5rem; display: flex; flex-wrap: wrap; gap: 0.75rem;">
          <a href="/vu-mcqs-bank" style="display: inline-block; padding: 0.75rem 1.25rem; background: #eff6ff; color: #1d4ed8; font-weight: 700; text-decoration: none; border-radius: 8px; border: 1px solid #bfdbfe;">
            MCQs Bank &amp; Live Mids
          </a>
          <a href="/simulator" style="display: inline-block; padding: 0.75rem 1.25rem; background: #fffbeb; color: #b45309; font-weight: 700; text-decoration: none; border-radius: 8px; border: 1px solid #fde68a;">
            ${course.code} Mid Calculator
          </a>
        </div>`}
        ${(() => {
          if (courseMidterms.length === 0) return '';
          return `
        <section style="margin-top: 1.5rem; padding: 1.5rem; background: #0f172a; color: #ffffff; border-radius: 12px;">
          <h2 style="font-size: 1.25rem; font-weight: 800; color: #fcd34d; margin-bottom: 0.5rem;">
            ${course.code} Midterm Prep 2026 Special Question Banks (Full Online Text)
          </h2>
          <p style="color: #cbd5e1; font-size: 0.9rem; margin-bottom: 0.9rem;">
            Read complete extracted ${course.code} Midterm Important MCQs (verified answer keys) and Solved Subjective Q&amp;As directly on-page:
          </p>
          <div style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
            ${courseMidterms
              .map(
                (m) =>
                  `<a href="/midterm-prep/${escapeHtmlAttr(m.filename)}" style="display: inline-block; padding: 0.65rem 1rem; background: #ffffff; color: #0f172a; font-weight: 700; text-decoration: none; border-radius: 8px; font-size: 0.88rem;">${escapeHtmlAttr(m.filename)} (${m.itemCount} ${m.kind === 'mcqs' ? 'MCQs' : 'Q&As'})</a>`
              )
              .join('')}
          </div>
        </section>`;
        })()}
        ${(() => {
          const courseDocs = docsByCourse.get(course.code.toUpperCase()) || [];
          if (courseDocs.length === 0) return '';
          return `
        <section style="margin-top: 2rem; padding: 1.5rem; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="font-size: 1.25rem; font-weight: 800; color: #0f172a; margin-bottom: 0.75rem;">
            All ${course.code} Verified Document Preview Pages (${courseDocs.length} Files)
          </h2>
          <ul style="list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 0.65rem;">
            ${courseDocs
              .map(
                (entry) =>
                  `<li><a href="/doc/${escapeHtmlAttr(entry.slug)}" style="display: block; padding: 0.6rem 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px; color: #1d4ed8; text-decoration: none; font-size: 0.88rem; font-weight: 600;">${escapeHtmlAttr(cleanDocumentDisplayTitle(entry.resource.name))} <span style="color: #64748b; font-size: 0.75rem;">(${escapeHtmlAttr(entry.resource.format)} · ${escapeHtmlAttr(entry.resource.type)})</span></a></li>`
              )
              .join('')}
          </ul>
        </section>`;
        })()}
      </div>
    `
  });
}

// Add Dedicated Shareable Route for Every Subject MCQ Set (/mcqs/<setId>)
for (const set of mcqSets) {
  ROUTES.push({
    path: `mcqs/${set.id}`,
    title: `${set.courseCode} ${set.termLabel} MCQs (${set.questions.length} Qs) | MIHORA VU`,
    description: `Practice ${set.questions.length} verified ${set.courseCode} (${set.courseTitle}) ${set.termLabel} MCQs online with instant answers, timed mock exam mode, and quick revision flash-sheets on MIHORA VU.`,
    canonical: `https://study.mihora.tech/mcqs/${set.id}`,
    keywords: `mihora vu, ${set.courseCode} ${set.termLabel.toLowerCase()} mcqs, ${set.courseCode} solved mcqs, ${set.courseCode} quiz, ${set.courseTitle} mcqs`,
    extraJsonLd: {
      "@type": "Quiz",
      "@id": `https://study.mihora.tech/mcqs/${set.id}#quiz`,
      "name": `${set.courseCode} ${set.termLabel} MCQs – ${set.courseTitle}`,
      "description": set.description,
      "numberOfQuestions": set.questions.length,
      "educationalAlignment": {
        "@type": "AlignmentObject",
        "targetName": `${set.courseCode} ${set.termLabel}`
      },
      // AEO: a sample of real questions with their verified answers (verbatim data).
      "hasPart": set.questions.filter((q) => q.options[q.correctIndex]).slice(0, 10).map((q) => ({
        "@type": "Question",
        "name": q.question,
        "acceptedAnswer": { "@type": "Answer", "text": q.options[q.correctIndex] }
      }))
    },
    preRenderedHtml: `
      <div style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif;">
        <h1 style="font-size: 2.25rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem;">
          ${set.courseCode} – ${set.courseTitle} (${set.termLabel} MCQs)
        </h1>
        <p style="color: #475569; font-size: 1.05rem; line-height: 1.6;">
          ${set.questions.length} Verified Questions · ${set.description}
        </p>
        <div style="margin-top: 1.5rem; padding: 1.25rem; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="font-size: 1.2rem; font-weight: 700; color: #0f172a;">Sample Practice Questions</h2>
          <ol style="color: #334155; line-height: 1.7; margin-top: 0.75rem; padding-left: 1.25rem;">
            ${set.questions.slice(0, 5).map(q => `<li>${q.question}</li>`).join('')}
          </ol>
        </div>
      </div>
    `
  });
}

// Add Dedicated Shareable Route for Every Subjective Fast-Learning Studio (/subjective/<setId>)
for (const sub of subjectiveSets) {
  ROUTES.push({
    path: `subjective/${sub.id}`,
    title: `${sub.courseCode} Subjective Fast-Learning (${sub.questions.length} Q&As) | MIHORA VU`,
    description: `Fast-learn ${sub.questions.length} high-yield ${sub.courseCode} (${sub.courseTitle}) 2, 3, and 5-mark subjective questions with 10-second memory hooks, examiner marking keys, and model answers on MIHORA VU.`,
    canonical: `https://study.mihora.tech/subjective/${sub.id}`,
    keywords: `mihora vu, ${sub.courseCode} subjective questions, ${sub.courseCode} short questions, ${sub.courseCode} long questions, ${sub.courseTitle} subjective solved`,
    extraJsonLd: {
      "@type": "FAQPage",
      "@id": `https://study.mihora.tech/subjective/${sub.id}#qa`,
      "name": `${sub.courseCode} Subjective Fast-Learning – ${sub.courseTitle}`,
      "mainEntity": sub.questions.slice(0, 5).map(q => ({
        "@type": "Question",
        "name": q.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${q.quickHook} ${q.keyPoints.join(' ')}`
        }
      }))
    },
    preRenderedHtml: `
      <div style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif;">
        <h1 style="font-size: 2.25rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem;">
          ${sub.courseCode} – ${sub.courseTitle} (Subjective Fast-Learning)
        </h1>
        <p style="color: #475569; font-size: 1.05rem; line-height: 1.6;">
          ${sub.questions.length} High-Yield Subjective Prompts · ${sub.description}
        </p>
        <div style="margin-top: 1.5rem; padding: 1.25rem; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="font-size: 1.2rem; font-weight: 700; color: #0f172a;">High-Yield Subjective Topics</h2>
          <ol style="color: #334155; line-height: 1.7; margin-top: 0.75rem; padding-left: 1.25rem;">
            ${sub.questions.map(q => `<li><strong>[${q.marks} Marks]</strong> ${q.question}</li>`).join('')}
          </ol>
        </div>
      </div>
    `
  });
}

// --- Midterm doc pages (664): prerender every /midterm-prep/<filename>.pdf as a real
// directory index (dist/midterm-prep/<filename>.pdf/index.html) so GitHub Pages returns
// 200 instead of the SPA 404 fallback. Full question content comes from the already
// shipped public/midterm-data/*.json files.
interface MidtermDocJson {
  filename: string;
  courseCode: string;
  courseTitle: string;
  faculty: string;
  kind: 'mcqs' | 'subjective';
  itemCount: number;
  mcqs?: Array<{ number: number; topic?: string; question: string; options: string[]; correctIndex: number | null }>;
  subjective?: Array<{ number: number; topic?: string; question: string; marks?: number | null; answer?: string | null }>;
}

function buildMidtermDocRoutes(): void {
  const dataDir = path.resolve('public/midterm-data');
  // Prev/next navigation runs across all 664 packs in filename order;
  // related packs are same-faculty packs from other courses.
  const sortedMidtermEntries = [...allMidtermEntries].sort((a, b) => a.filename.localeCompare(b.filename));
  const packsByFaculty = new Map<string, typeof allMidtermEntries>();
  for (const e of allMidtermEntries) {
    const list = packsByFaculty.get(e.faculty) || [];
    list.push(e);
    packsByFaculty.set(e.faculty, list);
  }
  let loaded = 0;
  let skipped = 0;
  for (const entry of allMidtermEntries) {
    const jsonPath = path.join(dataDir, `${entry.dataKey}.json`);
    let doc: MidtermDocJson | null = null;
    try {
      doc = JSON.parse(fs.readFileSync(jsonPath, 'utf-8')) as MidtermDocJson;
    } catch {
      console.warn(`⚠️  Midterm doc JSON missing/unreadable, skipping prerender: ${entry.filename}`);
      skipped++;
      continue;
    }
    const isMcq = entry.kind === 'mcqs';
    const sibling = getMidtermSiblingEntry(entry);
    const items = isMcq ? (doc.mcqs || []) : (doc.subjective || []);
    const count = items.length || entry.itemCount;
    const courseLower = entry.courseCode.toLowerCase();
    const entryIdx = sortedMidtermEntries.findIndex((e) => e.filename === entry.filename);
    const prevEntry = entryIdx > 0 ? sortedMidtermEntries[entryIdx - 1] : null;
    const nextEntry = entryIdx >= 0 && entryIdx < sortedMidtermEntries.length - 1 ? sortedMidtermEntries[entryIdx + 1] : null;
    const relatedPacks = (packsByFaculty.get(entry.faculty) || [])
      .filter((e) => e.courseCode !== entry.courseCode)
      .sort((a, b) => a.filename.localeCompare(b.filename))
      .slice(0, 4);
    const packNavHtml = `
        <nav aria-label="More midterm packs" style="margin-top: 1rem; padding: 1rem 1.25rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;">
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem 1.5rem; font-size: 0.92rem;">
            ${prevEntry ? `<a href="/midterm-prep/${escapeHtmlAttr(prevEntry.filename)}" style="color: #1d4ed8; font-weight: 700;">&larr; ${escapeHtmlAttr(prevEntry.courseCode)} Midterm Important ${prevEntry.kind === 'mcqs' ? 'MCQs' : 'Subjective'} (${prevEntry.itemCount} ${prevEntry.kind === 'mcqs' ? 'Qs' : 'Q&As'})</a>` : '<span style="color: #94a3b8;">First pack in the series</span>'}
            ${nextEntry ? `<a href="/midterm-prep/${escapeHtmlAttr(nextEntry.filename)}" style="color: #1d4ed8; font-weight: 700;">${escapeHtmlAttr(nextEntry.courseCode)} Midterm Important ${nextEntry.kind === 'mcqs' ? 'MCQs' : 'Subjective'} (${nextEntry.itemCount} ${nextEntry.kind === 'mcqs' ? 'Qs' : 'Q&As'}) &rarr;</a>` : '<span style="color: #94a3b8;">Last pack in the series</span>'}
          </div>
          ${relatedPacks.length > 0 ? `
          <div style="margin-top: 0.75rem; font-size: 0.92rem; color: #475569;">
            Related ${escapeHtmlAttr(entry.faculty)} midterm packs:
            ${relatedPacks.map((r) => `<a href="/midterm-prep/${escapeHtmlAttr(r.filename)}" style="color: #1d4ed8; font-weight: 700; margin-right: 0.75rem;">${escapeHtmlAttr(r.courseCode)} Midterm Important ${r.kind === 'mcqs' ? 'MCQs' : 'Subjective'} (${r.itemCount} ${r.kind === 'mcqs' ? 'Qs' : 'Q&As'})</a>`).join('')}
          </div>` : ''}
        </nav>`;
    const title = isMcq
      ? `${entry.courseCode} Midterm Important MCQs (${count} Qs) | MIHORA VU`
      : `${entry.courseCode} Midterm Subjective (${count} Q&As) | MIHORA VU`;
    const description = isMcq
      ? `Read all ${count} solved ${entry.courseCode} Midterm Important MCQs (${entry.courseTitle}) with verified answer keys directly on-page, free, no login.`
      : `Read all ${count} solved ${entry.courseCode} Midterm Important Subjective Q&As (${entry.courseTitle}) with model answers directly on-page, free, no login.`;

    let bodyHtml: string;
    if (isMcq) {
      const mcqs = (doc.mcqs || []) as NonNullable<MidtermDocJson['mcqs']>;
      bodyHtml = `
      <div style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif;">
        <h1 style="font-size: 2rem; font-weight: 900; color: #0f172a;">${escapeHtmlAttr(entry.courseCode)} – ${escapeHtmlAttr(entry.courseTitle)}: Midterm Important MCQs (${count} Solved Questions)</h1>
        <p style="color: #475569; font-size: 1.05rem; line-height: 1.6;">${escapeHtmlAttr(entry.faculty)} • Read every solved MCQ with its verified answer key directly on this page. Free, no login required.</p>
        <p style="margin-top: 0.75rem;"><a href="/midterm-prep" style="color: #1d4ed8; font-weight: 700;">All 664 Midterm Packs</a> · <a href="/courses/${courseLower}" style="color: #1d4ed8; font-weight: 700;">${escapeHtmlAttr(entry.courseCode)} Course Page</a>${sibling ? ` · <a href="/midterm-prep/${escapeHtmlAttr(sibling.filename)}" style="color: #b45309; font-weight: 700;">${escapeHtmlAttr(entry.courseCode)} Subjective Pack (${sibling.itemCount} Q&As)</a>` : ''}</p>
        ${packNavHtml}
        <ol style="color: #334155; line-height: 1.7; margin-top: 1.5rem; padding-left: 1.25rem;">
          ${mcqs.map((q) => `
          <li style="margin-bottom: 1rem;">
            <strong>${escapeHtmlAttr(q.question)}</strong>
            ${q.topic ? `<div style="color: #64748b; font-size: 0.8rem;">Topic: ${escapeHtmlAttr(q.topic)}</div>` : ''}
            <ol type="A" style="margin-top: 0.35rem; padding-left: 1.25rem;">
              ${q.options.map((opt, i) => `<li${i === q.correctIndex ? ' style="font-weight: 700; color: #166534;"' : ''}>${escapeHtmlAttr(opt)}${i === q.correctIndex ? ' ✓ Correct answer' : ''}</li>`).join('')}
            </ol>
          </li>`).join('')}
        </ol>
      </div>`;
    } else {
      const subs = (doc.subjective || []) as NonNullable<MidtermDocJson['subjective']>;
      bodyHtml = `
      <div style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif;">
        <h1 style="font-size: 2rem; font-weight: 900; color: #0f172a;">${escapeHtmlAttr(entry.courseCode)} – ${escapeHtmlAttr(entry.courseTitle)}: Midterm Important Subjective (${count} Solved Q&As)</h1>
        <p style="color: #475569; font-size: 1.05rem; line-height: 1.6;">${escapeHtmlAttr(entry.faculty)} • Read every solved subjective question with its model answer directly on this page. Free, no login required.</p>
        <p style="margin-top: 0.75rem;"><a href="/midterm-prep" style="color: #1d4ed8; font-weight: 700;">All 664 Midterm Packs</a> · <a href="/courses/${courseLower}" style="color: #1d4ed8; font-weight: 700;">${escapeHtmlAttr(entry.courseCode)} Course Page</a>${sibling ? ` · <a href="/midterm-prep/${escapeHtmlAttr(sibling.filename)}" style="color: #1d4ed8; font-weight: 700;">${escapeHtmlAttr(entry.courseCode)} MCQ Pack (${sibling.itemCount} MCQs)</a>` : ''}</p>
        ${packNavHtml}
        <ol style="color: #334155; line-height: 1.7; margin-top: 1.5rem; padding-left: 1.25rem;">
          ${subs.map((q) => `
          <li style="margin-bottom: 1.25rem;">
            <strong>${escapeHtmlAttr(q.question)}</strong>
            ${q.topic ? `<div style="color: #64748b; font-size: 0.8rem;">Topic: ${escapeHtmlAttr(q.topic)}${q.marks ? ` • ${q.marks} marks` : ''}</div>` : ''}
            ${q.answer ? `<p style="margin-top: 0.35rem;">${escapeHtmlAttr(q.answer)}</p>` : `<p style="margin-top: 0.35rem; color: #b45309;"><em>Answer not available for this question yet.</em></p>`}
          </li>`).join('')}
        </ol>
      </div>`;
    }

    const extraJsonLd: Record<string, unknown> = isMcq
      ? {
          '@type': 'Quiz',
          '@id': `https://study.mihora.tech/midterm-prep/${entry.filename}#quiz`,
          name: title,
          numberOfQuestions: count,
          // AEO: a sample of real questions with their verified answers (verbatim data).
          hasPart: ((doc.mcqs || []) as NonNullable<MidtermDocJson['mcqs']>)
            .filter((q) => q.correctIndex !== null && q.options[q.correctIndex])
            .slice(0, 10)
            .map((q) => ({
              '@type': 'Question',
              name: q.question,
              acceptedAnswer: { '@type': 'Answer', text: q.options[q.correctIndex as number] }
            }))
        }
      : {
          '@type': 'FAQPage',
          '@id': `https://study.mihora.tech/midterm-prep/${entry.filename}#qa`,
          name: title,
          // AEO: only questions WITH a real model answer belong in structured
          // data — a placeholder must never be served as an acceptedAnswer.
          mainEntity: ((doc.subjective || []) as NonNullable<MidtermDocJson['subjective']>)
            .filter((q) => q.answer && q.answer.trim().length > 0)
            .slice(0, 5)
            .map((q) => ({
              '@type': 'Question',
              name: q.question,
              acceptedAnswer: { '@type': 'Answer', text: q.answer as string }
            }))
        };

    ROUTES.push({
      path: `midterm-prep/${entry.filename}`,
      title,
      description,
      canonical: `https://study.mihora.tech/midterm-prep/${entry.filename}`,
      keywords: `mihora vu, ${entry.courseCode.toLowerCase()} midterm important mcqs, ${entry.courseCode.toLowerCase()} midterm subjective solved, ${entry.courseCode.toLowerCase()} midterm preparation, ${entry.courseTitle} midterm`,
      extraJsonLd,
      preRenderedHtml: bodyHtml
    });
    loaded++;
  }
  console.log(`📄 Midterm doc prerender: ${loaded} doc pages queued, ${skipped} skipped (missing JSON).`);
}

buildMidtermDocRoutes();

export function prerenderAllRoutes() {
  console.log('🚀 Running Multi-Route Static Pre-Renderer (Fixing 404s & Maximizing SEO)...');

  const distPath = path.resolve('dist');
  if (!fs.existsSync(distPath)) {
    console.error('❌ dist/ folder not found. Run vite build first.');
    return;
  }

  const baseTemplatePath = path.join(distPath, 'index.html');
  if (!fs.existsSync(baseTemplatePath)) {
    console.error('❌ dist/index.html not found.');
    return;
  }

  const baseHtml = fs.readFileSync(baseTemplatePath, 'utf-8');

  // Site-wide structured-data nodes (Organization + WebSite) extracted once
  // from the base template. The base block also carries the homepage-only
  // FAQPage + homepage BreadcrumbList, which are WRONG on every other page,
  // so only the site-wide nodes are kept for per-route pages.
  let siteWideJsonLdNodes: Array<Record<string, unknown>> = [];
  const baseLdMatch = baseHtml.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
  if (baseLdMatch) {
    try {
      const baseLd = JSON.parse(baseLdMatch[1]) as { '@graph'?: Array<Record<string, unknown>> };
      siteWideJsonLdNodes = (baseLd['@graph'] || []).filter(
        (n) => n['@type'] === 'Organization' || n['@type'] === 'WebSite'
      );
    } catch {
      console.warn('⚠️  Base JSON-LD in dist/index.html did not parse; per-route pages will carry their own graph only.');
    }
  }

  for (const route of ROUTES) {
    const routeDir = path.join(distPath, route.path);
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }

    let pageHtml = baseHtml;

    // 1. Replace Title
    pageHtml = pageHtml.replace(/<title>.*?<\/title>/i, `<title>${route.title}</title>`);

    // 2. Replace Meta Description
    pageHtml = pageHtml.replace(
      /<meta\s+name="description"\s+content=".*?"\s*\/?>/i,
      `<meta name="description" content="${route.description.replace(/"/g, '&quot;')}" />`
    );

    // 2B. Replace Meta Keywords if present
    if (route.keywords) {
      pageHtml = pageHtml.replace(
        /<meta\s+name="keywords"\s+content=".*?"\s*\/?>/i,
        `<meta name="keywords" content="${route.keywords.replace(/"/g, '&quot;')}" />`
      );
    }

    // 3. Replace Canonical
    pageHtml = pageHtml.replace(
      /<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i,
      `<link rel="canonical" href="${route.canonical}" />`
    );

    // 4. Replace og:title & og:description & og:url
    pageHtml = pageHtml.replace(
      /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i,
      `<meta property="og:title" content="${route.title.replace(/"/g, '&quot;')}" />`
    );
    pageHtml = pageHtml.replace(
      /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i,
      `<meta property="og:description" content="${route.description.replace(/"/g, '&quot;')}" />`
    );
    pageHtml = pageHtml.replace(
      /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i,
      `<meta property="og:url" content="${route.canonical}" />`
    );

    // 5. Replace twitter:title & twitter:description
    pageHtml = pageHtml.replace(
      /<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i,
      `<meta name="twitter:title" content="${route.title.replace(/"/g, '&quot;')}" />`
    );
    pageHtml = pageHtml.replace(
      /<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/i,
      `<meta name="twitter:description" content="${route.description.replace(/"/g, '&quot;')}" />`
    );

    // 6. Inject Route-Level WebPage (AEO Speakable), BreadcrumbList, & Extra JSON-LD
    const routeBreadcrumbs: Array<{ name: string; item: string }> = [
      { name: 'Library', item: 'https://study.mihora.tech/' }
    ];
    if (route.path.startsWith('courses/')) {
      routeBreadcrumbs.push(
        { name: 'Courses', item: 'https://study.mihora.tech/courses' },
        { name: route.path.split('/')[1]?.toUpperCase() || 'Course', item: route.canonical }
      );
    } else if (route.path.startsWith('mcqs/')) {
      routeBreadcrumbs.push(
        { name: 'Interactive MCQs', item: 'https://study.mihora.tech/mcqs' },
        { name: route.path.split('/')[1]?.toUpperCase() || 'Quiz', item: route.canonical }
      );
    } else if (route.path.startsWith('subjective/')) {
      routeBreadcrumbs.push(
        { name: 'Subjective Fast-Learning', item: 'https://study.mihora.tech/subjective' },
        { name: route.path.split('/')[1]?.toUpperCase() || 'Subjective', item: route.canonical }
      );
    } else if (route.path === 'vu-assignment-solution-2026' || route.path === 'assignment-guide' || route.path === 'datesheet-guide') {
      routeBreadcrumbs.push(
        { name: 'VU Handbook', item: 'https://study.mihora.tech/handbook' },
        { name: route.title.split('|')[0].trim(), item: route.canonical }
      );
    } else if (route.path === 'cs619-guide') {
      routeBreadcrumbs.push(
        { name: 'Courses', item: 'https://study.mihora.tech/courses' },
        { name: 'CS619 FYP Roadmap', item: route.canonical }
      );
    } else if (route.path === 'security' || route.path === 'disclaimer') {
      routeBreadcrumbs.push(
        { name: 'About MIHORA', item: 'https://study.mihora.tech/about' },
        { name: route.title.split('|')[0].trim(), item: route.canonical }
      );
    } else if (route.path.startsWith('midterm-prep/')) {
      routeBreadcrumbs.push(
        { name: 'Midterm Prep 2026', item: 'https://study.mihora.tech/midterm-prep' },
        { name: route.title.split('|')[0].trim(), item: route.canonical }
      );
    } else if (route.path === 'vu-mcqs-bank') {
      routeBreadcrumbs.push({ name: 'VU MCQs Bank', item: route.canonical });
    } else if (route.path === 'live-mids-mcqs') {
      routeBreadcrumbs.push({ name: 'Live Mids MCQs & Quiz Bank', item: route.canonical });
    } else if (route.path === 'vu-handouts-pdf') {
      routeBreadcrumbs.push({ name: 'Official VU Handouts PDF', item: route.canonical });
    } else if (route.path === 'vu-subjective-solved') {
      routeBreadcrumbs.push({ name: 'Solved Subjective Questions (2/3/5 Marks)', item: route.canonical });
    } else {
      routeBreadcrumbs.push({ name: route.title.split('|')[0].trim(), item: route.canonical });
    }

    const perRouteGraphNodes: Array<Record<string, unknown>> = [
      {
        '@type': 'WebPage',
        '@id': `${route.canonical}#webpage`,
        url: route.canonical,
        name: route.title,
        description: route.description,
        inLanguage: 'en-PK',
        isPartOf: { '@id': 'https://study.mihora.tech/#website' },
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['[data-speakable="true"]', 'h1']
        }
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${route.canonical}#breadcrumb`,
        itemListElement: routeBreadcrumbs.map((b, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: b.name,
          item: b.item
        }))
      }
    ];
    if (route.extraJsonLd) {
      perRouteGraphNodes.push(route.extraJsonLd as Record<string, unknown>);
    }

    // Merge with the base homepage JSON-LD instead of appending a second
    // block: the merged script carries [Organization, WebSite, ...route nodes]
    // so no page ships the homepage FAQPage/BreadcrumbList by mistake.
    // The script gets an id so the SPA can update this same block on hydration.
    const mergedScript = `\n    <script type="application/ld+json" id="mihora-route-jsonld">\n    ${JSON.stringify(
      { '@context': 'https://schema.org', '@graph': [...siteWideJsonLdNodes, ...perRouteGraphNodes] },
      null,
      2
    )}\n    </script>`;
    // NOTE: replacer function (not a string) so `$` in question text cannot be
    // interpreted as a replacement pattern (e.g. `$&`).
    const mergedPageHtml = pageHtml.replace(
      /<script type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/,
      () => mergedScript
    );
    pageHtml =
      mergedPageHtml !== pageHtml
        ? mergedPageHtml
        : pageHtml.replace('</head>', () => `${mergedScript}\n  </head>`);

    // 7. Inject Semantic Pre-rendered Content + Accessible Breadcrumb Rail into <div id="root">
    const staticBreadcrumbHtml = `
      <div style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 0.55rem 1rem; font-family: sans-serif;">
        <nav aria-label="Breadcrumb" style="max-width: 1200px; margin: 0 auto; font-size: 0.8rem;">
          <ol style="list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 0.4rem; align-items: center;">
            ${routeBreadcrumbs
              .map((b, idx) => {
                const isLast = idx === routeBreadcrumbs.length - 1;
                const sep = idx > 0 ? '<span aria-hidden="true" style="color: #94a3b8;">&rsaquo;</span>' : '';
                if (isLast) {
                  return `<li style="display: inline-flex; align-items: center; gap: 0.4rem;">${sep}<span aria-current="page" style="color: #0f172a; font-weight: 700;">${b.name}</span></li>`;
                }
                const relHref = b.item.replace('https://study.mihora.tech', '') || '/';
                return `<li style="display: inline-flex; align-items: center; gap: 0.4rem;">${sep}<a href="${relHref}" style="color: #1d4ed8; text-decoration: none; font-weight: 600;">${b.name}</a></li>`;
              })
              .join('')}
          </ol>
        </nav>
      </div>
    `;

    const semanticContent = `
      <header style="padding: 1rem; border-bottom: 1px solid #e2e8f0; background: #ffffff;">
        <nav style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; font-family: sans-serif;">
          <a href="/" style="font-weight: 800; color: #050B18; text-decoration: none; font-size: 1.25rem;">MIHORA VU STUDY LIBRARY</a>
          <div style="display: flex; flex-wrap: wrap; gap: 1rem;">
            <a href="/courses" style="color: #475569; text-decoration: none; font-weight: 600;">Courses (${allCoursesList.length})</a>
            <a href="/midterm-prep" style="color: #1d4ed8; text-decoration: none; font-weight: 700;">Midterm Prep 2026 (664)</a>
            <a href="/mcqs" style="color: #1d4ed8; text-decoration: none; font-weight: 600;">MCQs</a>
            <a href="/subjective" style="color: #b45309; text-decoration: none; font-weight: 600;">Subjective Studio</a>
            <a href="/vu-assignment-solution-2026" style="color: #059669; text-decoration: none; font-weight: 700;">Assignments 2026</a>
            <a href="/past-papers" style="color: #475569; text-decoration: none; font-weight: 600;">Past Papers</a>
            <a href="/handbook" style="color: #475569; text-decoration: none; font-weight: 600;">VU Handbook</a>
            <a href="/simulator" style="color: #475569; text-decoration: none; font-weight: 600;">Passing Simulator</a>
          </div>
        </nav>
      </header>
      ${staticBreadcrumbHtml}
      <main>
        ${route.preRenderedHtml}
      </main>
    `;

    // NOTE: replacer function (not a string) so `$` in question text cannot be
    // interpreted as a replacement pattern (e.g. `$&`).
    pageHtml = pageHtml.replace(
      /<div id="root">[\s\S]*?<\/div>/i,
      () => `<div id="root">${semanticContent}</div>`
    );

    // Ensure absolute asset URLs for deep routes (e.g. /courses/cs101)
    pageHtml = pageHtml
      .replace(/href="\.\/assets\//g, 'href="/assets/')
      .replace(/src="\.\/assets\//g, 'src="/assets/')
      .replace(/href="\.\/logo\.svg"/g, 'href="/logo.svg"')
      .replace(/src="\.\/logo\.svg"/g, 'src="/logo.svg"')
      .replace(/href="\.\/og-cover\.jpg"/g, 'href="/og-cover.jpg"')
      .replace(/src="\.\/og-cover\.jpg"/g, 'src="/og-cover.jpg"');

    const outFilePath = path.join(routeDir, 'index.html');
    fs.writeFileSync(outFilePath, pageHtml, 'utf-8');
  }

  // Generate Comprehensive XML Sitemap containing all core pages and ALL courses
  // NOTE: midterm doc pages are listed in sitemap-midterm.xml, not here (no duplicates across sitemaps).
  const sitemapItems = ROUTES.filter((r) => !r.path.startsWith('midterm-prep/')).map((r) => {
    let priority = '0.85';
    let freq = 'weekly';
    if (r.path === '' || r.path === '/') {
      priority = '1.00';
      freq = 'daily';
    } else if (r.path === 'vu-assignment-solution-2026') {
      priority = '0.99';
      freq = 'daily';
    } else if (['courses', 'past-papers', 'mcqs', 'subjective', 'handbook', 'simulator', 'gpa-calculator', 'assignment-guide', 'vu-mcqs-bank', 'live-mids-mcqs', 'vu-handouts-pdf', 'vu-subjective-solved'].includes(r.path)) {
      priority = '0.95';
      freq = 'daily';
    } else if (['datesheet-guide', 'cs619-guide', 'security', 'about', 'sitemap'].includes(r.path)) {
      priority = '0.90';
      freq = 'weekly';
    }

    const loc = r.canonical || `https://study.mihora.tech/${r.path}`;
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${BUILD_DATE}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });

  // 1. Generate Core & Course XML Sitemap (midterm doc pages live in sitemap-midterm.xml)
  const mainSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <url>
    <loc>https://study.mihora.tech/</loc>
    <lastmod>${BUILD_DATE}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.00</priority>
  </url>
${sitemapItems.join('\n')}
</urlset>`;

  const publicPath = path.resolve('public');

  fs.writeFileSync(path.join(distPath, 'sitemap-main.xml'), mainSitemapXml, 'utf-8');
  if (fs.existsSync(publicPath)) {
    fs.writeFileSync(path.join(publicPath, 'sitemap-main.xml'), mainSitemapXml, 'utf-8');
  }

  // 2. Generate Dedicated Documents XML Sitemap covering ALL 28,328 /doc/<slug> Preview & SEO pages
  // NOTE (user order 2026-11-25): /doc/* pages and sitemap-docs.xml are NOT to be touched. They stay as-is.
  const docUrlEntries = docSlugIndex.entries.map((entry) => {
    const safeLoc = escapeHtmlAttr(`https://study.mihora.tech/doc/${entry.slug}`);
    return `  <url><loc>${safeLoc}</loc><lastmod>${BUILD_DATE}</lastmod><changefreq>monthly</changefreq><priority>0.80</priority></url>`;
  });

  const docsSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${docUrlEntries.join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(distPath, 'sitemap-docs.xml'), docsSitemapXml, 'utf-8');
  if (fs.existsSync(publicPath)) {
    fs.writeFileSync(path.join(publicPath, 'sitemap-docs.xml'), docsSitemapXml, 'utf-8');
  }

  // 2B. Generate Dedicated Midterm Prep 2026 XML Sitemap covering all 664 /midterm-prep/<Filename>.pdf pages
  // NOTE: the /midterm-prep hub itself is listed in sitemap-main.xml, not here (no duplicates across sitemaps).
  const midtermUrlEntries = [
    ...allMidtermEntries.map((entry) => {
      const safeLoc = escapeHtmlAttr(`https://study.mihora.tech/midterm-prep/${entry.filename}`);
      return `  <url><loc>${safeLoc}</loc><lastmod>${BUILD_DATE}</lastmod><changefreq>weekly</changefreq><priority>0.90</priority></url>`;
    })
  ];

  const midtermSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${midtermUrlEntries.join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(distPath, 'sitemap-midterm.xml'), midtermSitemapXml, 'utf-8');
  if (fs.existsSync(publicPath)) {
    fs.writeFileSync(path.join(publicPath, 'sitemap-midterm.xml'), midtermSitemapXml, 'utf-8');
  }

  // 3. Generate Master Sitemap Index (sitemap.xml) linking sitemap-main.xml, sitemap-midterm.xml, and sitemap-docs.xml
  const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://study.mihora.tech/sitemap-main.xml</loc>
    <lastmod>${BUILD_DATE}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://study.mihora.tech/sitemap-midterm.xml</loc>
    <lastmod>${BUILD_DATE}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://study.mihora.tech/sitemap-docs.xml</loc>
    <lastmod>${BUILD_DATE}</lastmod>
  </sitemap>
</sitemapindex>`;

  fs.writeFileSync(path.join(distPath, 'sitemap.xml'), sitemapIndexXml, 'utf-8');
  if (fs.existsSync(publicPath)) {
    fs.writeFileSync(path.join(publicPath, 'sitemap.xml'), sitemapIndexXml, 'utf-8');
  }

  // Generate GEO LLM Context Dossiers (llms.txt & llms-full.txt)
  const totalMcqQuestions = mcqSets.reduce((sum, s) => sum + s.questions.length, 0);
  const totalSubjectiveQuestions = subjectiveSets.reduce((sum, s) => sum + s.questions.length, 0);
  const totalMidtermMcqs = allMidtermEntries.filter((e) => e.kind === 'mcqs').reduce((s, e) => s + e.itemCount, 0);
  const totalMidtermSubj = allMidtermEntries.filter((e) => e.kind === 'subjective').reduce((s, e) => s + e.itemCount, 0);

  const llmsTxt = `# MIHORA VU Study Library

> Free, zero-telemetry academic study archive for students of the Virtual University of Pakistan (VU). Hosts ${totalResourceCount.toLocaleString()} verified study files across ${allCoursesList.length} courses, ${mcqSets.length} interactive MCQ studios (${totalMcqQuestions.toLocaleString()} questions), and ${subjectiveSets.length} Subjective Fast-Learning studios (${totalSubjectiveQuestions} high-yield 2/3/5-mark Q&As), engineered as an independent educational CSR initiative by MIHORA TECH.

## Core Academic Studios
- [Main Archive & Instant Search](https://study.mihora.tech/): Instant filterable catalog of ${totalResourceCount.toLocaleString()} study documents across handouts, midterms, final terms, and Moaaz/Waqar Siddhu solved archives.
- [All ${allCoursesList.length} VU Courses Directory](https://study.mihora.tech/courses): Complete index of Virtual University degree courses organized by faculty.
- [Interactive MCQ Practice Studio](https://study.mihora.tech/mcqs): ${mcqSets.length} subject-specific MCQ banks totaling ${totalMcqQuestions.toLocaleString()} questions with Practice, 45s Timed Mock Exam, and Quick Revision Sheet modes.
- [Subjective Fast-Learning Studio](https://study.mihora.tech/subjective): Structured 2, 3, and 5-mark subjective preparation with 10-second memory hooks, examiner rubrics, cram sheets, and all ${allCoursesList.length} subject hubs.
- [Solved Past Papers Hub](https://study.mihora.tech/past-papers): Curated Moaaz, Waqar Siddhu, and student exam memory archives.

## Midterm Prep 2026 — 664 Solved Question Banks (${(totalMidtermMcqs + totalMidtermSubj).toLocaleString()} Questions)
- [Midterm Prep 2026 Hub](https://study.mihora.tech/midterm-prep): 664 verified packs across 332 courses — ${totalMidtermMcqs.toLocaleString()} solved Objective MCQs with verified answer keys and ${totalMidtermSubj.toLocaleString()} solved Subjective Q&As with model answers, readable in full directly on-page, free, no login.
- [Midterm Prep Sitemap](https://study.mihora.tech/sitemap-midterm.xml): Complete index of all 664 midterm pack pages.

## Policy & Academic Calculators
- [20% Two-Half Passing Marks Simulator](https://study.mihora.tech/simulator): Calculates minimum Final-Term marks required under VU's mandatory 20% First-Half and 20% Final-Term rule.
- [VU GPA & CGPA Calculator (4.0 Scale)](https://study.mihora.tech/gpa-calculator): HEC 4.0 grading scale calculator and probation threshold analyzer.
- [VU Assignments 2026 & Turnitin Guide](https://study.mihora.tech/vu-assignment-solution-2026): Explains the 24-hour assignment grace period (0 marks penalty) and Turnitin <19% similarity rules.
- [VU Student Handbook & FAQs](https://study.mihora.tech/handbook): Official grading, rescheduling (PKR 2,000 fee), and datesheet booking rules.
- [Datesheet Seat Booking Strategy](https://study.mihora.tech/datesheet-guide): First-come, first-served VULMS exam seat booking workflow.
- [CS619 Final Year Project Roadmap](https://study.mihora.tech/cs619-guide): Proposal, IEEE 830 SRS, ERD design, and viva defense checklist.

## Live Exam Banks & Resource Breakdown (${totalResourceCount.toLocaleString()} Verified Documents)
- [VU MCQs Bank (${totalMcqQuestions.toLocaleString()} Interactive + ${typeCounts.MCQFILE.toLocaleString()} Mega MCQ Files)](https://study.mihora.tech/vu-mcqs-bank): Subject-wise interactive quizzes with 45-second exam timers plus downloadable mega MCQ compilations.
- [Live Mids MCQs & Current Midterm Quiz Bank (${typeCounts.QUIZ.toLocaleString()} Quiz Files + ${typeCounts.MIDTERM.toLocaleString()} Midterms)](https://study.mihora.tech/live-mids-mcqs): Current semester quiz dumps, student-shared live midterm MCQs, and solved midterm past paper packets.
- [Official VU Lecture Handouts PDF (${typeCounts.HANDOUT.toLocaleString()} Files)](https://study.mihora.tech/vu-handouts-pdf): Complete official Virtual University lecture handouts, highlighted short notes, and syllabus PDF books.
- [Solved Final-Term Past Papers (${typeCounts.FINALTERM.toLocaleString()} Files)](https://study.mihora.tech/past-papers): Verified Moaaz, Waqar Siddhu, and topper solved final-term archives.
- [Solved 2, 3 & 5-Mark Subjective Questions (${totalSubjectiveQuestions} High-Yield Q&As + ${allCoursesList.length} Course Hubs)](https://study.mihora.tech/vu-subjective-solved): Fast-learning short & long answers with 10-second memory hooks and cram sheets.
- [2026 Assignments & GDB Guides (${typeCounts.ASSIGNMENT.toLocaleString()} Files)](https://study.mihora.tech/vu-assignment-solution-2026): Verified templates under the Turnitin <19% rule and 24-hour grace period.

## Non-Branded Search & Topic Mapping
- **"VU MCQs bank" / "VU solved MCQs" / "VU grand quiz MCQs"** -> https://study.mihora.tech/vu-mcqs-bank
- **"VU live mids MCQs" / "VU current midterm quiz bank" / "VU live quiz"** -> https://study.mihora.tech/live-mids-mcqs
- **"VU handouts PDF free download" / "Virtual University lecture notes"** -> https://study.mihora.tech/vu-handouts-pdf
- **"VU solved subjective 2 3 5 marks" / "VU short and long questions"** -> https://study.mihora.tech/vu-subjective-solved
- **"VU passing marks 20 percent rule calculator"** -> https://study.mihora.tech/simulator
- **"VU GPA and CGPA calculator 4.0"** -> https://study.mihora.tech/gpa-calculator
- **"VU midterm important MCQs" / "VU midterm solved MCQs" / "VU midterm question bank"** -> https://study.mihora.tech/midterm-prep
- **"VU midterm solved subjective" / "VU midterm subjective questions"** -> https://study.mihora.tech/midterm-prep

## Key Virtual University Academic Facts (Canonical)
- **VU 20% Two-Half Passing Rule**: Students must achieve at least 20% marks in the First Half (Quizzes, Assignments, GDBs, Midterm combined) AND independently at least 20% in the Final-Term exam paper.
- **24-Hour Assignment Grace Period**: VULMS provides an automatic 24-hour grace window after every assignment due date with zero marks deduction.
- **Turnitin Originality Ceiling**: Submissions must remain strictly under 19% similarity to avoid automated zero marks.

## Optional Deep Context
- [Full Catalog Dossier (llms-full.txt)](https://study.mihora.tech/llms-full.txt): Complete list of interactive MCQ studios, Subjective Fast-Learning sets, all 664 Midterm Prep packs, and top accredited VU courses.
- [XML Sitemap](https://study.mihora.tech/sitemap.xml): Full index of ${ROUTES.length + 1} canonical routes.
- [Midterm Prep 2026 Sitemap](https://study.mihora.tech/sitemap-midterm.xml): Complete index of ${allMidtermEntries.length} full-text Objective MCQs and Solved Subjective Midterm Prep pages.
- [Documents XML Sitemap](https://study.mihora.tech/sitemap-docs.xml): Complete index of ${docSlugIndex.entries.length.toLocaleString()} dedicated /doc/<slug> document reader & download pages.
`;

  const llmsFullTxt = `${llmsTxt}
---

## Interactive MCQ Studios (${mcqSets.length} Sets · ${totalMcqQuestions.toLocaleString()} MCQs)
${mcqSets
  .map(
    (s) =>
      `- [${s.courseCode} ${s.termLabel} – ${s.courseTitle}](https://study.mihora.tech/mcqs/${s.id}): ${s.questions.length} verified MCQs`
  )
  .join('\n')}

## Subjective Fast-Learning Studios (${subjectiveSets.length} Starter Sets · ${totalSubjectiveQuestions} Q&As)
${subjectiveSets
  .map(
    (s) =>
      `- [${s.courseCode} – ${s.courseTitle} Subjective](https://study.mihora.tech/subjective/${s.id}): ${s.questions.length} structured 2/3/5-mark questions`
  )
  .join('\n')}

## Midterm Prep 2026 — All ${allMidtermEntries.length} Solved Packs (${(totalMidtermMcqs + totalMidtermSubj).toLocaleString()} Questions)
${allMidtermEntries
  .map(
    (e) =>
      `- [${e.courseCode} – ${e.courseTitle} (${e.kind === 'mcqs' ? 'MCQs' : 'Subjective'}, ${e.itemCount} ${e.kind === 'mcqs' ? 'Qs' : 'Q&As'})](https://study.mihora.tech/midterm-prep/${e.filename})`
  )
  .join('\n')}

## Accredited Virtual University Courses Directory (${allCoursesList.length} Courses — Assignments, Mid/Final Past Papers, Handouts & MCQs)
${allCoursesList
  .map((c) => {
    const cc = perCourseCounts[c.code.toUpperCase()] || {};
    return `- [${c.code} – ${c.title}](https://study.mihora.tech/courses/${c.code.toLowerCase()}) (${c.faculty} · ${c.fileCount} files: ${cc['FINALTERM'] || 0} final, ${cc['MIDTERM'] || 0} midterm, ${(cc['QUIZ'] || 0) + (cc['MCQFILE'] || 0)} quiz/MCQ, ${cc['HANDOUT'] || 0} handouts, ${cc['ASSIGNMENT'] || 0} assignments)`;
  })
  .join('\n')}
`;

  fs.writeFileSync(path.join(distPath, 'llms.txt'), llmsTxt, 'utf-8');
  fs.writeFileSync(path.join(distPath, 'llms-full.txt'), llmsFullTxt, 'utf-8');
  if (fs.existsSync(publicPath)) {
    fs.writeFileSync(path.join(publicPath, 'llms.txt'), llmsTxt, 'utf-8');
    fs.writeFileSync(path.join(publicPath, 'llms-full.txt'), llmsFullTxt, 'utf-8');
  }

  console.log(`🤖 Generated llms.txt and llms-full.txt (GEO context) in dist/ and public/`);
  console.log(`🗺️ Generated master sitemap.xml (${ROUTES.length + 1} routes) + sitemap-docs.xml (${docSlugIndex.entries.length.toLocaleString()} document pages) in dist/ and public/ (lastmod ${BUILD_DATE})`);
  console.log(`✅ Successfully pre-rendered ${ROUTES.length} static routes in dist/ (Zero 404s guaranteed).`);
}

prerenderAllRoutes();
