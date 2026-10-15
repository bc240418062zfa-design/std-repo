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

const TOP_COURSES = [
  { code: 'CS101', title: 'Introduction to Computing', faculty: 'Computer Science & IT', fileCount: 462 },
  { code: 'CS201', title: 'Introduction to Programming', faculty: 'Computer Science & IT', fileCount: 268 },
  { code: 'CS301', title: 'Data Structures', faculty: 'Computer Science & IT', fileCount: 161 },
  { code: 'CS302', title: 'Digital Logic Design', faculty: 'Computer Science & IT', fileCount: 228 },
  { code: 'CS401', title: 'Computer Architecture & Assembly Language', faculty: 'Computer Science & IT', fileCount: 195 },
  { code: 'CS402', title: 'Theory of Automata', faculty: 'Computer Science & IT', fileCount: 135 },
  { code: 'CS403', title: 'Database Management Systems', faculty: 'Computer Science & IT', fileCount: 154 },
  { code: 'CS501', title: 'Advance Computer Architecture', faculty: 'Computer Science & IT', fileCount: 112 },
  { code: 'CS502', title: 'Fundamental of Algorithms', faculty: 'Computer Science & IT', fileCount: 96 },
  { code: 'CS504', title: 'Software Engineering - I', faculty: 'Computer Science & IT', fileCount: 172 },
  { code: 'CS506', title: 'Web Design and Development', faculty: 'Computer Science & IT', fileCount: 184 },
  { code: 'CS601', title: 'Data Communication', faculty: 'Computer Science & IT', fileCount: 142 },
  { code: 'CS602', title: 'Computer Graphics', faculty: 'Computer Science & IT', fileCount: 110 },
  { code: 'CS604', title: 'Operating Systems', faculty: 'Computer Science & IT', fileCount: 125 },
  { code: 'CS605', title: 'Software Engineering - II', faculty: 'Computer Science & IT', fileCount: 95 },
  { code: 'CS607', title: 'Artificial Intelligence', faculty: 'Computer Science & IT', fileCount: 138 },
  { code: 'CS610', title: 'Computer Networks', faculty: 'Computer Science & IT', fileCount: 215 },
  { code: 'CS619', title: 'Final Year Project', faculty: 'Computer Science & IT', fileCount: 42 },
  { code: 'MTH101', title: 'Calculus And Analytical Geometry', faculty: 'Mathematics', fileCount: 290 },
  { code: 'MTH202', title: 'Discrete Mathematics', faculty: 'Mathematics', fileCount: 168 },
  { code: 'MTH301', title: 'Calculus II', faculty: 'Mathematics', fileCount: 135 },
  { code: 'MTH302', title: 'Business Mathematics & Statistics', faculty: 'Mathematics', fileCount: 210 },
  { code: 'MTH501', title: 'Linear Algebra', faculty: 'Mathematics', fileCount: 122 },
  { code: 'ENG101', title: 'English Comprehension', faculty: 'Humanities & Social Sciences', fileCount: 310 },
  { code: 'ENG201', title: 'Business and Technical English', faculty: 'Humanities & Social Sciences', fileCount: 195 },
  { code: 'MGT101', title: 'Financial Accounting', faculty: 'Management & Business', fileCount: 245 },
  { code: 'MGT211', title: 'Introduction to Business', faculty: 'Management & Business', fileCount: 185 },
  { code: 'MGT301', title: 'Principles of Marketing', faculty: 'Management & Business', fileCount: 160 },
  { code: 'MGT501', title: 'Human Resource Management', faculty: 'Management & Business', fileCount: 140 },
  { code: 'ACC311', title: 'Fundamentals of Auditing', faculty: 'Accounting & Finance', fileCount: 94 },
  { code: 'ACC501', title: 'Business Finance', faculty: 'Accounting & Finance', fileCount: 128 },
  { code: 'STA301', title: 'Statistics and Probability', faculty: 'Mathematics & Statistics', fileCount: 175 },
  { code: 'ECO401', title: 'Economics', faculty: 'Economics', fileCount: 165 },
  { code: 'ISL202', title: 'Islamic Studies', faculty: 'Humanities & Social Sciences', fileCount: 190 },
  { code: 'PAK301', title: 'Pakistan Studies', faculty: 'Humanities & Social Sciences', fileCount: 220 },
  { code: 'PHY101', title: 'Physics', faculty: 'Physics', fileCount: 115 }
];

const ROUTES: RouteSEO[] = [
  // 1. Course Directory
  {
    path: 'courses',
    title: 'All 411+ VU Courses Directory – Past Papers, Handouts & Solved MCQs | MIHORA',
    description: 'Complete directory of 411+ Virtual University of Pakistan courses. Access past papers, solved midterms, finals, and lecture handouts for CS, MTH, MGT, ENG, and more.',
    canonical: 'https://study.mihora.tech/courses',
    keywords: 'VU courses directory, virtual university all subjects, vu cs courses, vu mth courses, vu past papers list, vu syllabus handouts',
    extraJsonLd: {
      "@type": "ItemList",
      "@id": "https://study.mihora.tech/courses#catalog",
      "name": "Virtual University Courses Directory",
      "description": "Comprehensive index of all 411+ academic courses taught at Virtual University of Pakistan.",
      "numberOfItems": 411,
      "itemListElement": TOP_COURSES.map((c, i) => ({
        "@type": "Course",
        "position": i + 1,
        "name": `${c.code} - ${c.title}`,
        "courseCode": c.code,
        "provider": {
          "@type": "Organization",
          "name": "Virtual University of Pakistan"
        },
        "url": `https://study.mihora.tech/courses?course=${c.code}`
      }))
    },
    preRenderedHtml: `
      <div style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif;">
        <h1 style="font-size: 2rem; font-weight: 900; color: #0f172a;">Virtual University Course Directory (All 411 Courses)</h1>
        <p style="color: #475569; font-size: 1.1rem; line-height: 1.6;">
          Browse all 411 accredited undergraduate, graduate, and associate degree courses of Virtual University of Pakistan. Select any course to access verified midterm past papers, final term solved files, Moaaz &amp; Waqar Siddhu MCQs, and updated handouts.
        </p>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-top: 2rem;">
          ${TOP_COURSES.map(c => `
            <div style="padding: 1rem; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
              <a href="/courses?course=${c.code}" style="text-decoration: none; font-weight: 700; color: #0066ff; font-size: 1.1rem;">
                ${c.code} – ${c.title}
              </a>
              <div style="color: #64748b; font-size: 0.85rem; margin-top: 0.25rem;">
                Faculty: ${c.faculty} • ${c.fileCount} Verified Files
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `
  },

  // 2. VU Student Handbook & FAQs (With Google FAQ Rich Snippet schema!)
  {
    path: 'handbook',
    title: 'VU Student Handbook 2026 – 20% Passing Rule, Datesheet & Rules FAQs | MIHORA',
    description: 'Official VU rules guide: Master the 20% two-half passing rule, datesheet creation, fee installments, CGPA probation, and paper reschedule policies.',
    canonical: 'https://study.mihora.tech/handbook',
    keywords: 'VU 20 percent rule, vu student handbook, vu passing rules, vu date sheet schedule, vu academic probation, vu fee installment, vu paper reschedule fee',
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
          "name": "How to unblock VULMS account after fee non-payment?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Pay fee via 1Link, 1Bill, JazzCash, EasyPaisa, or bank challan. The LMS system automatically unblocks within 15 to 30 minutes. If delayed, open a ticket at support.vu.edu.pk under Accounts with the transaction receipt."
          }
        },
        {
          "@type": "Question",
          "name": "Are physical scientific calculators allowed in VU exam center?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, standard non-programmable physical scientific calculators (e.g. Casio fx-82 / fx-991 non-programmable) are permitted after physical inspection by invigilators. Programmable calculators are prohibited. Additionally, the VU Exam Software includes a built-in calculator."
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

        <section style="margin-top: 2rem;">
          <h2 style="font-size: 1.5rem; font-weight: 700; color: #0066ff;">Top High-Frequency Student Questions:</h2>
          <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 1.5rem;">
            <article style="padding: 1.25rem; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
              <h3 style="font-size: 1.2rem; font-weight: 700; color: #0f172a;">1. What is the 20% Two-Half Passing Rule?</h3>
              <p style="color: #475569; line-height: 1.6;">
                Students must score &gt;= 20% in First Half (Sessional + Midterm) and &gt;= 20% in the Final Term exam paper independently. Additionally, the cumulative aggregate must reach 50% (Standard D Grade) or 40% (Passing floor).
              </p>
            </article>

            <article style="padding: 1.25rem; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
              <h3 style="font-size: 1.2rem; font-weight: 700; color: #0f172a;">2. Datesheet Opening &amp; First-Come, First-Served Seat Allocation</h3>
              <p style="color: #475569; line-height: 1.6;">
                Date sheet seats are strictly first-come, first-served. Create your schedule on datesheet.vu.edu.pk within 1-2 hours of opening to secure your preferred center and morning/afternoon slots without late fee fines.
              </p>
            </article>

            <article style="padding: 1.25rem; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
              <h3 style="font-size: 1.2rem; font-weight: 700; color: #0f172a;">3. Missed Paper Rescheduling Fee (PKR 2,000)</h3>
              <p style="color: #475569; line-height: 1.6;">
                If you miss an exam due to an emergency, apply for rescheduling via VULMS Student Services. Fee is PKR 2,000 per paper and the exam takes place on the official makeup exam date.
              </p>
            </article>
          </div>
        </section>
      </div>
    `
  },

  // 3. Exam Passing Marks Simulator
  {
    path: 'simulator',
    title: 'VU Passing Marks Simulator – 20% Two-Half Rule & Finalterm Calculator',
    description: 'Calculate exact marks needed in VU Final Term exams. Check compliance with the official 20% Two-Half rule and download your free academic PDF report.',
    canonical: 'https://study.mihora.tech/simulator',
    keywords: 'VU passing marks simulator, vu final term marks calculator, vu 20 percent rule calculator, vu gpa target simulator, vu exam grading calculator',
    extraJsonLd: {
      "@type": "WebApplication",
      "@id": "https://study.mihora.tech/simulator#app",
      "name": "Virtual University Exam Passing Marks Simulator",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires JavaScript. Requires HTML5.",
      "description": "Interactive grade simulation engine modeling Virtual University Two-Half 20% evaluation rule and weighted score requirements.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "PKR"
      }
    },
    preRenderedHtml: `
      <div style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif;">
        <h1 style="font-size: 2rem; font-weight: 900; color: #0f172a;">Virtual University Exam Passing Marks &amp; Grade Simulator</h1>
        <p style="color: #475569; font-size: 1.1rem; line-height: 1.6;">
          Real-time academic simulator calculating the exact Final Term examination score required to pass any VU course or achieve target grades (A, B, C, D) under the official 20% Two-Half Passing Rule.
        </p>
        <div style="margin-top: 2rem; padding: 1.5rem; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="font-size: 1.3rem; font-weight: 700; color: #0066ff;">How the Simulation Engine Works:</h2>
          <ul style="color: #475569; line-height: 1.8; margin-top: 0.5rem;">
            <li><strong>First-Half Verification:</strong> Calculates Quizzes, Assignments, GDBs, and Midterm exam weighted contributions.</li>
            <li><strong>Second-Half Requirement:</strong> Computes the mandatory 20% threshold in the Final Term exam paper.</li>
            <li><strong>Aggregate Threshold:</strong> Evaluates overall 50% standard passing cutoff or 40% grade boundary.</li>
            <li><strong>Executive PDF Report:</strong> Instant export with academic calculation audit.</li>
          </ul>
        </div>
      </div>
    `
  },

  // 4. Privacy & Trust Guarantee
  {
    path: 'security',
    title: 'Privacy & Trust Guarantee – Zero Student Data Collection | MIHORA',
    description: 'Our student safety commitment: zero cookies, zero telemetry, verified clean academic files, and instant direct downloads without login.',
    canonical: 'https://study.mihora.tech/security',
    preRenderedHtml: `
      <div style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif;">
        <h1 style="font-size: 2rem; font-weight: 900; color: #0f172a;">Privacy, Safety &amp; Trust Guarantee</h1>
        <p style="color: #475569; font-size: 1.1rem; line-height: 1.6;">
          MIHORA STUDY LIBRARY operates as a zero-telemetry, non-commercial educational public service for Pakistani students.
        </p>
        <ul style="color: #475569; line-height: 1.8; margin-top: 1rem;">
          <li>Zero student registration or personal identity collection.</li>
          <li>Cryptographically signed single-use download tokens.</li>
          <li>Safe, malware-scanned past papers and lecture handouts.</li>
          <li>Direct high-speed Google Cloud CDN delivery.</li>
        </ul>
      </div>
    `
  },

  // 5. About MIHORA TECH
  {
    path: 'about',
    title: 'About MIHORA TECH – Free Academic Resource Initiative for VU Students',
    description: 'Learn about MIHORA TECH\'s non-commercial educational CSR mission to provide free, fast, and structured academic study archives for Pakistani students.',
    canonical: 'https://study.mihora.tech/about',
    preRenderedHtml: `
      <div style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif;">
        <h1 style="font-size: 2rem; font-weight: 900; color: #0f172a;">About MIHORA TECH &amp; Academic CSR Initiative</h1>
        <p style="color: #475569; font-size: 1.1rem; line-height: 1.6;">
          MIHORA TECH is an enterprise software engineering and cloud systems organization. The MIHORA STUDY LIBRARY is a non-commercial corporate social responsibility (CSR) project dedicated to empowering higher education across Pakistan.
        </p>
      </div>
    `
  },

  // 6. Curriculum & Faculty Sitemap
  {
    path: 'sitemap',
    title: 'VU Curriculum & Faculty Sitemap Directory – 411 Courses Index | MIHORA',
    description: 'Comprehensive portal map of all Virtual University faculties, departments, 411 courses, handbook guides, passing calculators, and XML sitemaps.',
    canonical: 'https://study.mihora.tech/sitemap',
    preRenderedHtml: `
      <div style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif;">
        <h1 style="font-size: 2rem; font-weight: 900; color: #0f172a;">Virtual University Curriculum &amp; Portal Sitemap Directory</h1>
        <p style="color: #475569; font-size: 1.1rem; line-height: 1.6;">
          Complete navigation index for all sections of MIHORA STUDY LIBRARY, departmental course catalogs, and search crawler resources.
        </p>
      </div>
    `
  },

  // 7. Academic Disclaimer & Terms
  {
    path: 'disclaimer',
    title: 'Academic Disclaimer & Fair Educational Use Notice | MIHORA',
    description: 'Fair educational use disclosures, copyright policies, student ethics, and independent non-affiliation notice with Virtual University.',
    canonical: 'https://study.mihora.tech/disclaimer',
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

// Add Top Courses as dedicated static routes
for (const course of TOP_COURSES) {
  ROUTES.push({
    path: `courses/${course.code.toLowerCase()}`,
    title: `${course.code} – ${course.title} Solved Past Papers, Handouts &amp; MCQs | VU MIHORA`,
    description: `Download verified ${course.code} (${course.title}) Virtual University solved midterm past papers, final term past papers, lecture handouts, and quizzes with direct high-speed download.`,
    canonical: `https://study.mihora.tech/courses/${course.code.toLowerCase()}`,
    keywords: `${course.code} past papers, ${course.code} solved midterm, ${course.code} final term papers, ${course.code} handouts, ${course.code} mcqs, ${course.code} vu`,
    extraJsonLd: {
      "@type": "Course",
      "@id": `https://study.mihora.tech/courses/${course.code.toLowerCase()}#course`,
      "name": `${course.code} - ${course.title}`,
      "courseCode": course.code,
      "description": `Academic course study resources for ${course.code} (${course.title}) including solved past papers, handouts, and MCQs.`,
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
          ${course.code} – ${course.title} Solved Past Papers &amp; Handouts
        </h1>
        <p style="color: #475569; font-size: 1.1rem; line-height: 1.6;">
          Department: <strong>${course.faculty}</strong> • Resource Collection: <strong>${course.fileCount} Verified Files</strong>.
        </p>
        <div style="margin-top: 1.5rem; padding: 1.5rem; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="font-size: 1.3rem; font-weight: 700; color: #0066ff;">Available Study Materials for ${course.code}:</h2>
          <ul style="color: #475569; line-height: 1.8; margin-top: 0.5rem;">
            <li><strong>Midterm Solved Past Papers:</strong> Moaaz &amp; Waqar Siddhu verified midterm papers.</li>
            <li><strong>Final Term Solved Past Papers:</strong> Comprehensive subjective &amp; objective past exams.</li>
            <li><strong>Lecture Handouts &amp; Books:</strong> Complete official course handouts in high-resolution PDF.</li>
            <li><strong>Grand Quizzes &amp; Solved MCQs:</strong> Repeat MCQ files with correct answer keys.</li>
          </ul>
          <div style="margin-top: 1.5rem;">
            <a href="/courses?course=${course.code}" style="display: inline-block; padding: 0.75rem 1.5rem; background: #0066ff; color: #ffffff; font-weight: 700; text-decoration: none; border-radius: 8px;">
              Open ${course.code} Library Archive (${course.fileCount} Files)
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
          <a href="/" style="font-weight: 800; color: #001738; text-decoration: none; font-size: 1.25rem;">MIHORA STUDY LIBRARY</a>
          <div>
            <a href="/courses" style="margin-right: 1rem; color: #475569; text-decoration: none; font-weight: 600;">Courses (411)</a>
            <a href="/handbook" style="margin-right: 1rem; color: #475569; text-decoration: none; font-weight: 600;">VU Handbook &amp; FAQs</a>
            <a href="/simulator" style="margin-right: 1rem; color: #475569; text-decoration: none; font-weight: 600;">Passing Marks Simulator</a>
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

  console.log(`✅ Successfully pre-rendered ${ROUTES.length} static routes in dist/ (Zero 404s guaranteed).`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  prerenderAllRoutes();
}
