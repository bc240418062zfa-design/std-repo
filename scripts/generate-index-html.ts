import fs from 'fs';
import path from 'path';

interface Course {
  code: string;
  title: string;
  faculty: string;
  fileCount: number;
}

const coursesPath = path.resolve('src/data/courses.json');
const courses: Course[] = JSON.parse(fs.readFileSync(coursesPath, 'utf-8'));

const faculties: Record<string, Course[]> = {};
courses.forEach(c => {
  faculties[c.faculty] = faculties[c.faculty] || [];
  faculties[c.faculty].push(c);
});

let coursesCatalogHtml = '';
for (const [fac, list] of Object.entries(faculties)) {
  coursesCatalogHtml += `
    <div style="margin-bottom: 1.5rem;">
      <h3 style="font-size: 1.15rem; font-weight: 700; color: #1e293b; margin-bottom: 0.5rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.25rem;">
        ${fac} (${list.length} Courses)
      </h3>
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
        ${list.map(c => `
          <a href="/courses/${c.code.toLowerCase()}" style="display: inline-block; padding: 0.35rem 0.65rem; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.85rem; color: #0066ff; text-decoration: none; font-weight: 600;">
            <strong>${c.code}</strong> – ${c.title}
          </a>
        `).join('')}
      </div>
    </div>
  `;
}

const TOP_FEATURED = [
  'CS101', 'CS201', 'CS301', 'CS302', 'CS401', 'CS402', 'CS403', 'CS501', 'CS502', 'CS504',
  'CS506', 'CS601', 'CS602', 'CS604', 'CS605', 'CS607', 'CS610', 'CS619', 'MTH101', 'MTH202',
  'MTH301', 'MTH302', 'MTH501', 'ENG101', 'ENG201', 'MGT101', 'MGT211', 'MGT301', 'MGT501',
  'ACC311', 'ACC501', 'STA301', 'ECO401', 'ISL202', 'PAK301', 'PHY101'
];

const featuredHtml = TOP_FEATURED.map(code => {
  const match = courses.find(c => c.code === code);
  const title = match ? match.title : code;
  return `
    <a href="/courses/${code.toLowerCase()}" style="padding: 0.6rem 1rem; background: #ffffff; border: 1px solid #93c5fd; border-radius: 8px; color: #1d4ed8; text-decoration: none; font-weight: 700; font-size: 0.95rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
      ${code} – ${title}
    </a>
  `;
}).join('');

const fullHtml = `<!doctype html>
<html lang="en-PK">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- Primary High-Ranking Search Engine Title & Description (Targeting 'mihora vu' & 'vu assignment solution 2026') -->
    <title>MIHORA VU – VU Assignment Solution 2026 Latest &amp; Solved Past Papers (All 411+ Courses)</title>
    <meta name="description" content="Official MIHORA VU Study Library: Direct download VU Assignment Solution 2026 (Latest Spring &amp; Fall), 28,328+ solved past papers (Moaaz, Waqar Siddhu), handouts &amp; quizzes for all 411+ Virtual University courses." />
    <meta name="keywords" content="mihora vu, mihora tech vu, mihora study library, study mihora tech, mihora vu portal, vu assignment solution 2026, vu assignment solution latest, vu assignment 1 solution 2026, vu assignment 2 solution 2026, vu gdb solution 2026, vu quiz solution 2026, vu solved assignments 2026, vu assignment spring 2026, vu assignment fall 2026, vu past papers 2026, vu solved past papers, moaaz past papers, waqar siddhu past papers, vu midterm solved papers 2026, vu final term solved papers 2026, vu handouts, cs101 assignment solution 2026, cs201 assignment solution 2026, mth101 assignment solution 2026, cs301 assignment solution 2026, cs504, mgt101, eng101, pak301, isl202, cs619 fyp, virtual university of pakistan, vulms, vu datesheet, vu 20 percent rule" />
    <meta name="author" content="MIHORA TECH" />
    <meta name="publisher" content="MIHORA TECH" />
    
    <!-- Geographic & Regional Targeting (Pakistan Nationwide & Overseas VU Campuses) -->
    <meta name="geo.region" content="PK" />
    <meta name="geo.placename" content="Pakistan" />
    <meta name="geo.position" content="31.5204;74.3587" />
    <meta name="ICBM" content="31.5204, 74.3587" />
    <meta name="target" content="all" />
    <meta name="audience" content="all" />
    <meta name="coverage" content="Pakistan, Worldwide" />
    <meta name="distribution" content="Global" />
    <meta name="rating" content="General" />
    <link rel="alternate" href="https://study.mihora.tech/" hreflang="en-PK" />
    <link rel="alternate" href="https://study.mihora.tech/" hreflang="ur-PK" />
    <link rel="alternate" href="https://study.mihora.tech/" hreflang="x-default" />

    <!-- OpenGraph Social Sharing Card (Facebook, WhatsApp, LinkedIn, Discord) -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="MIHORA VU STUDY LIBRARY" />
    <meta property="og:locale" content="en_PK" />
    <meta property="og:title" content="MIHORA VU – VU Assignment Solution 2026 Latest &amp; Solved Past Papers (All 411+ Courses)" />
    <meta property="og:description" content="Direct high-speed download for 28,328+ Virtual University solved past papers, midterms, finals, handouts, MCQs &amp; latest 2026 assignment solution guides for all 411 courses." />
    <meta property="og:url" content="https://study.mihora.tech/" />
    <meta property="og:image" content="https://study.mihora.tech/logo.svg" />
    <meta property="og:image:alt" content="MIHORA VU Study Library Logo" />

    <!-- Twitter / X Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="MIHORA VU – VU Assignment Solution 2026 Latest &amp; Solved Past Papers (All 411+ Courses)" />
    <meta name="twitter:description" content="Direct high-speed download for 28,328+ Virtual University solved past papers, midterms, finals, handouts, MCQs &amp; latest 2026 assignment solution guides for all 411 courses." />
    <meta name="twitter:image" content="https://study.mihora.tech/logo.svg" />

    <!-- Technical Webmaster & Indexing Directives -->
    <meta name="theme-color" content="#001738" />
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
    <meta name="google-site-verification" content="googlefb6d7fd888a3a4a2" />
    <link rel="canonical" href="https://study.mihora.tech/" />
    <link rel="icon" type="image/svg+xml" href="/logo.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

    <!-- Comprehensive Schema.org Structured Data (JSON-LD) with FAQPage & Sitelinks Searchbox -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://www.mihora.tech/#organization",
          "name": "MIHORA TECH",
          "url": "https://www.mihora.tech",
          "logo": "https://study.mihora.tech/logo.svg",
          "description": "Enterprise software engineering, cloud systems, and educational technology initiatives.",
          "sameAs": [
            "https://study.mihora.tech"
          ]
        },
        {
          "@type": "WebSite",
          "@id": "https://study.mihora.tech/#website",
          "url": "https://study.mihora.tech/",
          "name": "MIHORA VU STUDY LIBRARY",
          "alternateName": [
            "MIHORA VU",
            "VU Study Library",
            "Virtual University Past Papers Library",
            "VU Assignment Solution 2026 Portal"
          ],
          "description": "Comprehensive academic library for Virtual University of Pakistan containing 28,328+ past papers, lecture handouts, and 2026 assignment solutions for all 411+ courses.",
          "publisher": {
            "@id": "https://www.mihora.tech/#organization"
          },
          "inLanguage": "en-PK",
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://study.mihora.tech/?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        },
        {
          "@type": "FAQPage",
          "@id": "https://study.mihora.tech/#faqs",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Where can I download VU Assignment Solution 2026 for CS101, CS201, MTH101, and all subjects?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "MIHORA VU (https://study.mihora.tech/vu-assignment-solution-2026) offers verified 2026 assignment solutions, GDB answers, quiz files, and Dev-C++ code templates for all 411 Virtual University courses with 100% free direct downloads."
              }
            },
            {
              "@type": "Question",
              "name": "What is the 24-hour assignment grace period in Virtual University?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Virtual University gives students an automatic 24-hour grace period after the official assignment deadline. Submissions during this grace window are awarded full credit with 0 marks deduction."
              }
            },
            {
              "@type": "Question",
              "name": "How to avoid zero marks in VU assignments due to Turnitin plagiarism?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Never copy-paste solutions directly from YouTube or public groups. Keep Turnitin similarity under 19% by renaming code variables, rearranging logical statements, and writing custom explanations."
              }
            },
            {
              "@type": "Question",
              "name": "Where can I get Moaaz and Waqar Siddhu solved midterm and final past papers?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "MIHORA VU hosts over 28,328 verified documents including complete Moaaz and Waqar Siddhu past paper collections for all 411 VU subjects, available via direct download without registration."
              }
            },
            {
              "@type": "Question",
              "name": "What is the 20% Two-Half passing rule in Virtual University?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Students must score at least 20% in the First Half (Quizzes, Assignments, GDBs, and Midterms) AND independently at least 20% in the Final Term exam paper to pass any course."
              }
            }
          ]
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://study.mihora.tech/#breadcrumb",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://study.mihora.tech/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "VU Assignment Solution 2026",
              "item": "https://study.mihora.tech/vu-assignment-solution-2026"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": "Courses Directory (411)",
              "item": "https://study.mihora.tech/courses"
            },
            {
              "@type": "ListItem",
              "position": 4,
              "name": "Past Papers",
              "item": "https://study.mihora.tech/past-papers"
            }
          ]
        }
      ]
    }
    </script>
  </head>
  <body class="bg-slate-50 text-slate-900 antialiased selection:bg-blue-600 selection:text-white min-h-screen">
    <!-- Static pre-rendered semantic fallback for search engines (hydrated by React) -->
    <div id="root">
      <header style="padding: 1rem; border-bottom: 1px solid #e2e8f0; background: #ffffff;">
        <nav style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; font-family: sans-serif;">
          <a href="/" style="font-weight: 800; color: #001738; text-decoration: none; font-size: 1.25rem;">MIHORA VU STUDY LIBRARY</a>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap; font-size: 0.95rem; font-weight: 600;">
            <a href="/courses" style="color: #475569; text-decoration: none;">Courses (411)</a>
            <a href="/vu-assignment-solution-2026" style="color: #059669; text-decoration: none; font-weight: 700;">VU Assignment Solution 2026</a>
            <a href="/past-papers" style="color: #475569; text-decoration: none;">Past Papers</a>
            <a href="/handbook" style="color: #475569; text-decoration: none;">VU Handbook</a>
            <a href="/simulator" style="color: #475569; text-decoration: none;">Passing Simulator</a>
            <a href="/sitemap" style="color: #475569; text-decoration: none;">Sitemap</a>
          </div>
        </nav>
      </header>

      <main style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif;">
        <h1 style="font-size: 2.35rem; font-weight: 900; color: #0f172a; margin-bottom: 0.75rem; line-height: 1.2;">
          MIHORA VU – Virtual University Assignment Solutions 2026, Solved Past Papers &amp; All 411+ Courses
        </h1>
        <p style="font-size: 1.15rem; color: #475569; max-width: 850px; line-height: 1.6;">
          Official MIHORA TECH academic repository offering 28,328+ verified study documents for all 411+ Virtual University of Pakistan courses. Access <strong>VU Assignment Solution 2026 (Latest Session)</strong>, Moaaz &amp; Waqar Siddhu solved midterm &amp; final papers, lecture handouts, and quizzes with 100% direct high-speed links.
        </p>

        <!-- Dedicated Section 1: VU Assignment Solution 2026 -->
        <section style="margin-top: 2rem; padding: 1.5rem; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 16px;">
          <div style="display: inline-block; padding: 0.25rem 0.75rem; background: #dcfce7; color: #166534; font-size: 0.8rem; font-weight: 800; border-radius: 9999px; margin-bottom: 0.5rem;">
            SPRING 2026 / FALL 2026 ACTIVE SESSION
          </div>
          <h2 style="font-size: 1.5rem; font-weight: 800; color: #14532d; margin-top: 0.25rem;">
            VU Assignment Solution 2026 (Latest Solved Assignments, GDBs &amp; Quizzes)
          </h2>
          <p style="color: #166534; font-size: 1rem; line-height: 1.6; margin-top: 0.5rem;">
            Get high-scoring solutions for Assignment 1, Assignment 2, and Graded Discussion Boards across Computer Science, Mathematics, Management, English, and Economics. Compliant with Turnitin similarity limits (&lt; 19%) and official 24-hour grace periods.
          </p>
          <div style="margin-top: 1rem;">
            <a href="/vu-assignment-solution-2026" style="display: inline-block; padding: 0.75rem 1.5rem; background: #16a34a; color: #ffffff; font-weight: 700; text-decoration: none; border-radius: 8px;">
              Open VU Assignment Solution 2026 Hub &rarr;
            </a>
          </div>
        </section>

        <!-- Dedicated Section 2: Popular Courses Quick Links -->
        <section style="margin-top: 2.5rem;">
          <h2 style="font-size: 1.5rem; font-weight: 800; color: #1e293b; margin-bottom: 1rem;">
            Popular Virtual University Courses (2026 Solved Papers &amp; Solutions):
          </h2>
          <div style="display: flex; flex-wrap: wrap; gap: 0.65rem;">
            ${featuredHtml}
          </div>
        </section>

        <!-- Dedicated Section 3: Comprehensive Directory of ALL 411 VU Courses -->
        <section style="margin-top: 3rem;">
          <h2 style="font-size: 1.65rem; font-weight: 900; color: #0f172a; margin-bottom: 0.5rem;">
            Complete Directory of All 411 Virtual University Courses &amp; Codes
          </h2>
          <p style="color: #64748b; font-size: 1rem; line-height: 1.6; margin-bottom: 1.5rem;">
            Browse the complete curriculum of all 411 accredited courses across 27 faculties of Virtual University of Pakistan. Every course includes verified lecture handouts, Moaaz &amp; Waqar Siddhu solved papers, and 2026 assignment solution templates.
          </p>
          <div>
            ${coursesCatalogHtml}
          </div>
        </section>

        <!-- Dedicated Section 4: Academic Policies & Simulator -->
        <section style="margin-top: 3rem; padding: 1.5rem; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 16px;">
          <h2 style="font-size: 1.4rem; font-weight: 800; color: #1e40af; margin-bottom: 0.5rem;">
            Core Student Calculators &amp; Rules Handbooks
          </h2>
          <ul style="color: #1e3a8a; line-height: 1.8; margin-top: 0.5rem;">
            <li><strong>20% Two-Half Passing Rule Simulator:</strong> Calculate required final exam marks under official VU grading criteria.</li>
            <li><strong>VU GPA &amp; CGPA Calculator 4.0:</strong> Semester grade forecaster and repeat policy probation checker.</li>
            <li><strong>Datesheet Booking Strategy:</strong> First-hour booking guide for morning and afternoon lab terminals.</li>
            <li><strong>CS619 FYP Roadmap:</strong> IEEE 830 SRS, ERD diagram design, and external viva voce defense questions.</li>
          </ul>
        </section>

        <!-- Dedicated Section 5: High-Frequency Student Questions (FAQ) -->
        <section style="margin-top: 3rem; margin-bottom: 3rem;">
          <h2 style="font-size: 1.5rem; font-weight: 800; color: #0f172a; margin-bottom: 1rem;">
            Frequently Asked Questions – MIHORA VU Study Library
          </h2>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div style="padding: 1.25rem; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
              <h3 style="font-size: 1.1rem; font-weight: 700; color: #0066ff; margin-bottom: 0.25rem;">
                Where can I download VU Assignment Solution 2026 for all subjects?
              </h3>
              <p style="color: #475569; line-height: 1.6; font-size: 0.95rem;">
                MIHORA VU (<a href="/vu-assignment-solution-2026" style="color: #0066ff;">study.mihora.tech/vu-assignment-solution-2026</a>) provides verified 2026 assignment solutions, Dev-C++ templates, and GDB guides for all 411 VU courses.
              </p>
            </div>
            <div style="padding: 1.25rem; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
              <h3 style="font-size: 1.1rem; font-weight: 700; color: #0066ff; margin-bottom: 0.25rem;">
                How does the VU 24-hour assignment grace period work?
              </h3>
              <p style="color: #475569; line-height: 1.6; font-size: 0.95rem;">
                Virtual University grants an automatic 24-hour grace window after the due date with zero marks penalty. Submissions during grace hours receive full credit.
              </p>
            </div>
            <div style="padding: 1.25rem; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
              <h3 style="font-size: 1.1rem; font-weight: 700; color: #0066ff; margin-bottom: 0.25rem;">
                Are Moaaz and Waqar Siddhu past papers updated for 2026 exams?
              </h3>
              <p style="color: #475569; line-height: 1.6; font-size: 0.95rem;">
                Yes, our archive includes Moaaz midterm solved papers, Waqar Siddhu final term MCQs, and recent exam files verified by VU toppers.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer style="padding: 2rem 1rem; border-top: 1px solid #e2e8f0; background: #001738; color: #ffffff; font-family: sans-serif; text-align: center;">
        <p style="font-size: 0.9rem; color: #94a3b8;">
          &copy; ${new Date().getFullYear()} MIHORA TECH. Educational Welfare &amp; CSR Initiative.
        </p>
        <p style="font-size: 0.8rem; color: #64748b; margin-top: 0.5rem;">
          MIHORA VU STUDY LIBRARY – Comprehensive academic index for Virtual University of Pakistan.
        </p>
      </footer>
    </div>

    <!-- Client-side SPA Application Mount -->
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

fs.writeFileSync(path.resolve('index.html'), fullHtml, 'utf-8');
console.log('✅ Generated comprehensive index.html with all 411 courses & 2026 assignment solutions!');
