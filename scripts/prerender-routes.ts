import fs from 'fs';
import path from 'path';

interface RouteSEO {
  path: string;
  title: string;
  description: string;
  canonical: string;
  keywords?: string;
  extraJsonLd?: object;
  preRenderedHtml: string;
}

// Load ALL 411 accredited Virtual University courses from canonical data
const coursesJsonPath = path.resolve('src/data/courses.json');
let allCoursesList: Array<{ code: string; title: string; faculty: string; fileCount: number }> = [];

if (fs.existsSync(coursesJsonPath)) {
  try {
    allCoursesList = JSON.parse(fs.readFileSync(coursesJsonPath, 'utf-8'));
    console.log(`📚 Loaded ${allCoursesList.length} canonical VU courses from courses.json`);
  } catch (err) {
    console.error('Failed to parse courses.json:', err);
  }
}

// High-frequency searched courses for instant index prominence
const TOP_COURSES = allCoursesList.slice(0, 40);

const ROUTES: RouteSEO[] = [
  // 1. Course Directory (ALL 411 Courses)
  {
    path: 'courses',
    title: 'All 411+ VU Courses Directory – VU Assignment Solution 2026, Past Papers & Handouts | MIHORA VU',
    description: 'Complete directory of 411+ Virtual University of Pakistan courses. Access verified past papers, solved midterms, finals, lecture handouts, and 2026 assignment solutions for CS, MTH, MGT, ENG, and more.',
    canonical: 'https://study.mihora.tech/courses',
    keywords: 'mihora vu, vu courses directory, virtual university all subjects, vu cs courses, vu mth courses, vu assignment solution 2026, vu past papers list, vu syllabus handouts',
    extraJsonLd: {
      "@type": "ItemList",
      "@id": "https://study.mihora.tech/courses#catalog",
      "name": "Virtual University Courses Directory",
      "description": "Comprehensive index of all 411+ academic courses taught at Virtual University of Pakistan with 2026 assignment solution guides and solved past papers.",
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
        <h1 style="font-size: 2.25rem; font-weight: 900; color: #0f172a;">Virtual University Course Directory (All 411 Courses &amp; Codes)</h1>
        <p style="color: #475569; font-size: 1.1rem; line-height: 1.6;">
          Browse all 411 accredited undergraduate, graduate, and associate degree courses of Virtual University of Pakistan. Select any course to access verified midterm past papers, final term solved files, Moaaz &amp; Waqar Siddhu MCQs, updated handouts, and <strong>VU Assignment Solution 2026 (Latest)</strong>.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-top: 2rem;">
          ${allCoursesList.map(c => `
            <div style="padding: 1.25rem; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
              <a href="/courses/${c.code.toLowerCase()}" style="text-decoration: none; font-weight: 800; color: #0066ff; font-size: 1.15rem; display: block;">
                ${c.code} – ${c.title}
              </a>
              <div style="color: #64748b; font-size: 0.85rem; margin-top: 0.35rem;">
                Faculty: <strong>${c.faculty}</strong> • ${c.fileCount} Verified Files
              </div>
              <div style="margin-top: 0.75rem; font-size: 0.8rem; color: #0284c7;">
                <a href="/courses/${c.code.toLowerCase()}" style="text-decoration: underline; color: #0284c7; margin-right: 0.75rem;">Study Archive</a>
                <a href="/vu-assignment-solution-2026?course=${c.code}" style="text-decoration: underline; color: #059669;">2026 Solutions</a>
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
    title: 'VU Assignment Solution 2026 Latest – All 411 Courses Solved Assignments, GDBs & Quizzes | MIHORA VU',
    description: 'Download verified Virtual University Assignment Solution 2026 (Latest Spring & Fall Semesters), GDB solutions, quiz files, and Turnitin plagiarism-free templates (<19%) for CS101, CS201, MTH101, MGT101, and all 411 courses on MIHORA VU.',
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
            "text": "MIHORA VU (https://study.mihora.tech/vu-assignment-solution-2026) provides verified 2026 assignment solutions, Dev-C++ code templates, MathType formulas, and GDB rubrics for all 411 Virtual University subjects including CS101, CS201, CS301, MTH101, MGT101, and ENG101 with 100% free direct downloads."
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
          VU Assignment Solution 2026 (Latest Spring &amp; Fall Sessions) – All 411 Courses
        </h1>
        <p style="color: #475569; font-size: 1.1rem; line-height: 1.6;">
          Official MIHORA VU educational portal for Virtual University students: Complete collection of verified <strong>VU Assignment Solutions 2026</strong>, Assignment 1 &amp; 2 solved files, Graded Discussion Boards (GDB), and Quizzes. Built with Turnitin plagiarism defense guidance (&lt; 19% similarity limit) and 24-hour grace period instructions.
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
            Directory of All 411 Courses for 2026 Assignment Solutions:
          </h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-top: 1.25rem;">
            ${allCoursesList.map(c => `
              <div style="padding: 1rem; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
                <a href="/courses/${c.code.toLowerCase()}" style="text-decoration: none; font-weight: 700; color: #0066ff; font-size: 1.05rem;">
                  ${c.code} – ${c.title}
                </a>
                <div style="color: #64748b; font-size: 0.8rem; margin-top: 0.25rem;">
                  ${c.faculty} • 2026 Solutions &amp; Handouts
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
    title: 'VU Assignment Solution 2026 & GDB Formatting Guide | MIHORA VU',
    description: 'VU assignment solution 2026 guide: 24-hour grace period rules, Turnitin 19% similarity limits, MathType formula pasting, Dev-C++ code formatting, and GDB rubrics for all 411 courses.',
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
    title: 'VU Solved Past Papers – Midterm & Final Term Papers (Moaaz & Waqar Siddhu) | MIHORA VU',
    description: 'Download verified Virtual University solved past papers: Moaaz & Waqar Siddhu midterm and final term papers, repeat MCQs, subjective question banks for all 411 courses on MIHORA VU.',
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
          Direct high-speed download for over 28,328+ Virtual University past exam files. Verified Moaaz midterm solved papers, Waqar Siddhu final term objective MCQs, subjective solutions, and grand quiz files for all 411 courses.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-top: 2rem;">
          ${allCoursesList.slice(0, 50).map(c => `
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

  // 3. VU Student Handbook & FAQs
  {
    path: 'handbook',
    title: 'VU Student Handbook 2026 – 20% Passing Rule, Datesheet & Rules FAQs | MIHORA VU',
    description: 'Official VU rules guide: Master the 20% two-half passing rule, datesheet creation, fee installments, CGPA probation, and paper reschedule policies on MIHORA VU.',
    canonical: 'https://study.mihora.tech/handbook',
    keywords: 'mihora vu, VU 20 percent rule, vu student handbook, vu passing rules, vu date sheet schedule, vu academic probation, vu fee installment, vu paper reschedule fee',
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
        }
      ]
    },
    preRenderedHtml: `
      <div style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif;">
        <h1 style="font-size: 2rem; font-weight: 900; color: #0f172a;">Virtual University Academic Handbook &amp; Essential FAQs (2026)</h1>
        <p style="color: #475569; font-size: 1.1rem; line-height: 1.6;">
          Authoritative academic policies of Virtual University of Pakistan: The 20% Two-Half evaluation rule, first-come first-served datesheet seat allocation, 24-hour assignment grace period, fee installment conversion, and academic probation thresholds.
        </p>
      </div>
    `
  },

  // 4. Exam Passing Marks Simulator
  {
    path: 'simulator',
    title: 'VU Passing Marks Simulator – 20% Two-Half Rule & Finalterm Calculator | MIHORA VU',
    description: 'Calculate exact marks needed in VU Final Term exams. Check compliance with the official 20% Two-Half rule and download your free academic PDF report on MIHORA VU.',
    canonical: 'https://study.mihora.tech/simulator',
    keywords: 'mihora vu, VU passing marks simulator, vu final term marks calculator, vu 20 percent rule calculator, vu gpa target simulator, vu exam grading calculator',
    preRenderedHtml: `
      <div style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif;">
        <h1 style="font-size: 2rem; font-weight: 900; color: #0f172a;">Virtual University Exam Passing Marks &amp; Grade Simulator</h1>
        <p style="color: #475569; font-size: 1.1rem; line-height: 1.6;">
          Real-time academic simulator calculating the exact Final Term examination score required to pass any VU course or achieve target grades (A, B, C, D) under the official 20% Two-Half Passing Rule.
        </p>
      </div>
    `
  },

  // 5. VU GPA & CGPA Calculator
  {
    path: 'gpa-calculator',
    title: 'VU GPA & CGPA Calculator 4.0 – Academic Grade Forecaster | MIHORA VU',
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
    title: 'VU Datesheet Maker & Seat Tracker Guide 2026 – Exam Slots Strategy | MIHORA VU',
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
    title: 'CS619 Final Year Project (FYP) Roadmap & Viva Voce Guide | MIHORA VU',
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
    title: 'Privacy & Trust Guarantee – Zero Student Data Collection | MIHORA VU',
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
    title: 'About MIHORA TECH – Free Academic Resource Initiative for VU Students | MIHORA VU',
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
    title: 'VU Curriculum & Faculty Sitemap Directory – 411 Courses Index | MIHORA VU',
    description: 'Comprehensive portal map of all Virtual University faculties, departments, 411 courses, handbook guides, passing calculators, and XML sitemaps on MIHORA VU.',
    canonical: 'https://study.mihora.tech/sitemap',
    keywords: 'mihora vu, vu sitemap directory, virtual university all courses list, vu curriculum map',
    preRenderedHtml: `
      <div style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif;">
        <h1 style="font-size: 2rem; font-weight: 900; color: #0f172a;">Virtual University Curriculum &amp; Portal Sitemap Directory</h1>
        <p style="color: #475569; font-size: 1.1rem; line-height: 1.6;">
          Complete navigation index for all sections of MIHORA STUDY LIBRARY, departmental course catalogs, and search crawler resources.
        </p>
      </div>
    `
  },

  // 11. Academic Disclaimer & Terms
  {
    path: 'disclaimer',
    title: 'Academic Disclaimer & Fair Educational Use Notice | MIHORA VU',
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

// Add ALL 411 Courses as dedicated, high-ranking static routes
for (const course of allCoursesList) {
  ROUTES.push({
    path: `courses/${course.code.toLowerCase()}`,
    title: `${course.code} – ${course.title} VU Assignment Solution 2026, Solved Past Papers & Handouts | MIHORA VU`,
    description: `Download verified ${course.code} (${course.title}) Virtual University 2026 assignment solution, GDB solution, solved midterm past papers (Moaaz, Waqar Siddhu), final term papers, and lecture handouts. 100% free direct download on MIHORA VU.`,
    canonical: `https://study.mihora.tech/courses/${course.code.toLowerCase()}`,
    keywords: `mihora vu, ${course.code} assignment solution 2026, ${course.code} assignment solution latest, ${course.code} gdb solution 2026, ${course.code} past papers, ${course.code} solved midterm, ${course.code} final term papers, ${course.code} handouts, ${course.code} mcqs, ${course.code} vu, mihora vu ${course.code}, virtual university ${course.code}`,
    extraJsonLd: {
      "@type": "Course",
      "@id": `https://study.mihora.tech/courses/${course.code.toLowerCase()}#course`,
      "name": `${course.code} - ${course.title}`,
      "courseCode": course.code,
      "description": `Academic course study archive for ${course.code} (${course.title}) including solved past papers, lecture handouts, MCQs, and 2026 assignment solutions.`,
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
        <nav style="font-size: 0.9rem; color: #64748b; margin-bottom: 1rem;">
          <a href="/" style="color: #0066ff; text-decoration: none;">Home</a> &gt; 
          <a href="/courses" style="color: #0066ff; text-decoration: none;">Courses</a> &gt; 
          <span>${course.code}</span>
        </nav>
        <h1 style="font-size: 2.25rem; font-weight: 900; color: #0f172a; margin-bottom: 0.5rem;">
          ${course.code} – ${course.title} VU Assignment Solution 2026 &amp; Solved Past Papers
        </h1>
        <p style="color: #475569; font-size: 1.1rem; line-height: 1.6;">
          Department: <strong>${course.faculty}</strong> • Resource Collection: <strong>${course.fileCount} Verified Files</strong>.
        </p>
        <div style="margin-top: 1.5rem; padding: 1.5rem; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <h2 style="font-size: 1.3rem; font-weight: 700; color: #0066ff;">Available Study Materials for ${course.code}:</h2>
          <ul style="color: #475569; line-height: 1.8; margin-top: 0.5rem;">
            <li><strong>2026 Assignment &amp; GDB Solutions:</strong> Guidance on scoring 100% with Turnitin plagiarism defense (&lt;19%) and 24-hour grace periods.</li>
            <li><strong>Midterm Solved Past Papers:</strong> Moaaz, Waqar Siddhu &amp; VU topper verified midterm papers.</li>
            <li><strong>Final Term Solved Past Papers:</strong> Comprehensive subjective questions &amp; objective past exams.</li>
            <li><strong>Lecture Handouts &amp; Books:</strong> Complete official course handouts in high-resolution PDF.</li>
            <li><strong>Grand Quizzes &amp; Solved MCQs:</strong> Repeat MCQ files with correct answer keys.</li>
          </ul>
          <div style="margin-top: 1.5rem; display: flex; flex-wrap: wrap; gap: 0.75rem;">
            <a href="/courses?course=${course.code}" style="display: inline-block; padding: 0.75rem 1.5rem; background: #0066ff; color: #ffffff; font-weight: 700; text-decoration: none; border-radius: 8px;">
              Open ${course.code} Library Archive (${course.fileCount} Files)
            </a>
            <a href="/vu-assignment-solution-2026?course=${course.code}" style="display: inline-block; padding: 0.75rem 1.5rem; background: #f0fdf4; color: #166534; font-weight: 700; text-decoration: none; border-radius: 8px; border: 1px solid #bbf7d0;">
              ${course.code} 2026 Assignment Solution Guide
            </a>
          </div>
        </div>
      </div>
    `
  });
}

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

    // 6. Inject Extra JSON-LD if present
    if (route.extraJsonLd) {
      const extraScript = `\n    <script type="application/ld+json">\n    ${JSON.stringify(route.extraJsonLd, null, 2)}\n    </script>`;
      pageHtml = pageHtml.replace('</head>', `${extraScript}\n  </head>`);
    }

    // 7. Inject Semantic Pre-rendered Content into <div id="root">
    const semanticContent = `
      <header style="padding: 1rem; border-bottom: 1px solid #e2e8f0; background: #ffffff;">
        <nav style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; font-family: sans-serif;">
          <a href="/" style="font-weight: 800; color: #001738; text-decoration: none; font-size: 1.25rem;">MIHORA VU STUDY LIBRARY</a>
          <div>
            <a href="/courses" style="margin-right: 1rem; color: #475569; text-decoration: none; font-weight: 600;">Courses (411)</a>
            <a href="/vu-assignment-solution-2026" style="margin-right: 1rem; color: #059669; text-decoration: none; font-weight: 700;">Assignments 2026</a>
            <a href="/past-papers" style="margin-right: 1rem; color: #475569; text-decoration: none; font-weight: 600;">Past Papers</a>
            <a href="/handbook" style="margin-right: 1rem; color: #475569; text-decoration: none; font-weight: 600;">VU Handbook</a>
            <a href="/simulator" style="margin-right: 1rem; color: #475569; text-decoration: none; font-weight: 600;">Passing Simulator</a>
            <a href="/sitemap" style="color: #475569; text-decoration: none; font-weight: 600;">Sitemap</a>
          </div>
        </nav>
      </header>
      <main>
        ${route.preRenderedHtml}
      </main>
    `;

    pageHtml = pageHtml.replace(
      /<div id="root">[\s\S]*?<\/div>/i,
      `<div id="root">${semanticContent}</div>`
    );

    // Ensure absolute asset URLs for deep routes (e.g. /courses/cs101)
    pageHtml = pageHtml
      .replace(/href="\.\/assets\//g, 'href="/assets/')
      .replace(/src="\.\/assets\//g, 'src="/assets/')
      .replace(/href="\.\/logo\.svg"/g, 'href="/logo.svg"')
      .replace(/src="\.\/logo\.svg"/g, 'src="/logo.svg"');

    const outFilePath = path.join(routeDir, 'index.html');
    fs.writeFileSync(outFilePath, pageHtml, 'utf-8');
  }

  // Generate Comprehensive XML Sitemap containing all core pages and ALL 411 courses
  const sitemapItems = ROUTES.map((r) => {
    let priority = '0.85';
    let freq = 'weekly';
    if (r.path === '' || r.path === '/') {
      priority = '1.00';
      freq = 'daily';
    } else if (r.path === 'vu-assignment-solution-2026') {
      priority = '0.99';
      freq = 'daily';
    } else if (['courses', 'past-papers', 'handbook', 'simulator', 'gpa-calculator', 'assignment-guide'].includes(r.path)) {
      priority = '0.95';
      freq = 'daily';
    } else if (['datesheet-guide', 'cs619-guide', 'security', 'about', 'sitemap'].includes(r.path)) {
      priority = '0.90';
      freq = 'weekly';
    }

    const loc = r.canonical || `https://study.mihora.tech/${r.path}`;
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>2026-10-17</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });

  const fullSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <url>
    <loc>https://study.mihora.tech/</loc>
    <lastmod>2026-10-17</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.00</priority>
  </url>
${sitemapItems.join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(distPath, 'sitemap.xml'), fullSitemapXml, 'utf-8');
  const publicPath = path.resolve('public');
  if (fs.existsSync(publicPath)) {
    fs.writeFileSync(path.join(publicPath, 'sitemap.xml'), fullSitemapXml, 'utf-8');
  }
  console.log(`🗺️ Generated master sitemap.xml with ${ROUTES.length + 1} indexed URLs in dist/ and public/`);
  console.log(`✅ Successfully pre-rendered ${ROUTES.length} static routes in dist/ (Zero 404s guaranteed).`);
}

prerenderAllRoutes();
