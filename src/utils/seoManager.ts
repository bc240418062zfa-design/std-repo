import { Course, McqSet, Resource, SubjectiveSet } from '../types';
import { MidtermPrepIndexEntry } from '../types/midterm';
import { cleanDocumentDisplayTitle, getDocSlug } from './docSlug';
import { enrichDocumentMetadata } from './docEnricher';

export interface SeoSyncParams {
  page: string;
  selectedMcqSet: McqSet | null;
  selectedSubjectiveSet: SubjectiveSet | null;
  selectedDocSlug?: string | null;
  selectedDoc?: Resource | null;
  selectedMidtermEntry?: MidtermPrepIndexEntry | null;
  selectedCourseCode: string;
  activeFilterType?: string;
  pathnameOverride?: string;
  courses: Course[];
  totalResources: number;
  totalMcqQuestions: number;
  totalSubjectiveQuestions: number;
}

const BASE_URL = 'https://study.mihora.tech';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-cover.jpg`;

function upsertMeta(selector: string, attrName: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertJsonLd(id: string, data: Record<string, unknown>) {
  // On prerendered route pages, update the SAME script block the prerender
  // wrote (id mihora-route-jsonld) instead of appending a second one, and
  // keep its site-wide Organization/WebSite nodes — the runtime graph only
  // carries this route's WebPage/BreadcrumbList nodes.
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!script) {
    script = document.getElementById('mihora-route-jsonld') as HTMLScriptElement | null;
    if (script) {
      try {
        const existing = JSON.parse(script.textContent || '{}') as {
          '@graph'?: Array<Record<string, unknown>>;
        };
        const kept = (existing['@graph'] || []).filter(
          (n) => n['@type'] === 'Organization' || n['@type'] === 'WebSite'
        );
        const incoming = (data['@graph'] as Array<Record<string, unknown>> | undefined) || [];
        data = { ...data, '@graph': [...kept, ...incoming] };
      } catch {
        // Unparseable existing block: overwrite it below.
      }
    }
  }
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

export function syncRouteSeo({
  page,
  selectedMcqSet,
  selectedSubjectiveSet,
  selectedDocSlug = null,
  selectedDoc = null,
  selectedMidtermEntry = null,
  selectedCourseCode,
  activeFilterType = '',
  pathnameOverride = '',
  courses,
  totalResources,
  totalMcqQuestions,
  totalSubjectiveQuestions
}: SeoSyncParams): void {
  if (typeof document === 'undefined') return;

  const cleanPath = pathnameOverride.toLowerCase().replace(/\/$/, '') || '';
  // Titles/descriptions must match the short prerendered titles exactly:
  // the runtime overwrites document.title on hydration, so a longer title
  // here would undo the prerender's ≤60-char titles in search results.
  let title = 'MIHORA VU – VU Assignment Solution 2026 & Past Papers';
  let desc = `MIHORA VU Study Library: VU Assignment Solution 2026, ${totalResources.toLocaleString()}+ solved past papers, handouts & quizzes for all ${courses.length}+ Virtual University courses.`;
  let keywords = 'vu past papers, vu mcqs bank, vu live mids mcqs, vu live quiz bank, vu solved handouts pdf, vu midterm solved papers, vu final term solved papers, vu assignment solution 2026, virtual university passing marks calculator, vu subjective solved questions, moaaz past papers, waqar siddhu past papers, mihora vu';
  let canonicalPath = '/';
  const breadcrumbs: Array<{ name: string; item: string }> = [
    { name: 'Home', item: `${BASE_URL}/` }
  ];
  const graphNodes: Array<Record<string, unknown>> = [];

  if (page === 'midterm-doc' && selectedMidtermEntry) {
    const isMcq = selectedMidtermEntry.kind === 'mcqs';
    canonicalPath = `/midterm-prep/${selectedMidtermEntry.filename}`;
    title = isMcq
      ? `${selectedMidtermEntry.courseCode} Midterm Important MCQs (${selectedMidtermEntry.itemCount} Qs) | MIHORA VU`
      : `${selectedMidtermEntry.courseCode} Midterm Subjective (${selectedMidtermEntry.itemCount} Q&As) | MIHORA VU`;
    desc = isMcq
      ? `Read all ${selectedMidtermEntry.itemCount} solved ${selectedMidtermEntry.courseCode} Midterm Important MCQs (${selectedMidtermEntry.courseTitle}) with verified answer keys directly on-page, free, no login.`
      : `Read all ${selectedMidtermEntry.itemCount} solved ${selectedMidtermEntry.courseCode} Midterm Important Subjective Q&As (${selectedMidtermEntry.courseTitle}) with model answers directly on-page, free, no login.`;
    keywords = `${selectedMidtermEntry.courseCode} midterm important ${
      isMcq ? 'mcqs' : 'subjective'
    }, ${selectedMidtermEntry.courseCode} midterm solved, ${selectedMidtermEntry.courseTitle} midterm preparation, ${selectedMidtermEntry.courseCode} past papers 2026, mihora vu`;
    breadcrumbs.push(
      { name: 'Midterm Prep 2026', item: `${BASE_URL}/midterm-prep` },
      { name: selectedMidtermEntry.courseCode, item: `${BASE_URL}/courses/${selectedMidtermEntry.courseCode.toLowerCase()}` },
      { name: selectedMidtermEntry.filename, item: `${BASE_URL}${canonicalPath}` }
    );
    graphNodes.push({
      '@type': isMcq ? 'Quiz' : 'LearningResource',
      '@id': `${BASE_URL}${canonicalPath}#resource`,
      name: `${selectedMidtermEntry.courseCode} – ${selectedMidtermEntry.courseTitle} (${
        isMcq ? 'Midterm Important MCQs' : 'Midterm Important Subjective Solved'
      })`,
      description: desc,
      learningResourceType: isMcq ? 'Practice Quiz & MCQ Bank' : 'Solved Subjective Exam Q&As',
      numberOfPages: selectedMidtermEntry.pageCount,
      ...(isMcq ? { numberOfQuestions: selectedMidtermEntry.itemCount } : {}),
      teaches: `${selectedMidtermEntry.courseCode} – ${selectedMidtermEntry.courseTitle}`,
      isAccessibleForFree: true,
      inLanguage: 'en-PK',
      url: `${BASE_URL}${canonicalPath}`
    });
  } else if (page === 'midterm-prep') {
    canonicalPath = '/midterm-prep';
    title = 'VU Midterm Prep 2026 – 664 Solved MCQs & Subjective Banks';
    desc =
      'Complete Virtual University Midterm Preparation 2026 hub covering 332 subjects (664 verified packs): read full Objective Important MCQs with answer keys and Solved Subjective Q&As directly online.';
    keywords =
      'vu midterm preparation 2026, vu midterm important mcqs, vu midterm important subjective solved, vu midterm solved question banks, acc311 midterm mcqs, cs101 midterm mcqs, cs201 midterm solved, mihora vu';
    breadcrumbs.push({ name: 'Midterm Prep 2026', item: `${BASE_URL}/midterm-prep` });
    graphNodes.push({
      '@type': 'CollectionPage',
      '@id': `${BASE_URL}/midterm-prep#collection`,
      name: 'VU Midterm Prep 2026 – 664 Solved Question Banks',
      description: desc,
      numberOfItems: 664
    });
  } else if (page === 'doc' && selectedDoc) {
    const enriched = enrichDocumentMetadata(selectedDoc);
    const canonicalSlug = getDocSlug(selectedDoc.rlh) || selectedDocSlug || '';
    canonicalPath = `/doc/${canonicalSlug}`;
    title = `${enriched.displayName} (${enriched.courseCode} ${enriched.format}) – Online Preview & Free Download | MIHORA VU`;
    desc = enriched.overviewSummary;
    keywords = enriched.targetKeywords.join(', ');
    breadcrumbs.push(
      { name: 'Courses', item: `${BASE_URL}/courses` },
      { name: enriched.courseCode, item: `${BASE_URL}/courses/${enriched.courseCode.toLowerCase()}` },
      { name: enriched.displayName, item: `${BASE_URL}${canonicalPath}` }
    );
    graphNodes.push({
      '@type': 'DigitalDocument',
      '@id': `${BASE_URL}${canonicalPath}#document`,
      name: enriched.displayName,
      fileFormat: enriched.format,
      numberOfPages: enriched.estimatedPages,
      educationalUse: enriched.typeLabel,
      description: enriched.overviewSummary,
      about: {
        '@type': 'Course',
        name: `${enriched.courseCode} – ${enriched.courseTitle}`,
        courseCode: enriched.courseCode,
        provider: {
          '@type': 'CollegeOrUniversity',
          name: 'Virtual University of Pakistan'
        }
      },
      hasPart: enriched.curriculumModules.map((m) => ({
        '@type': 'Chapter',
        position: m.moduleNumber,
        name: m.title,
        description: `${m.lectureSpan} (${m.pageRange}): ${m.keyTopics.join('; ')}. Exam focus: ${m.examWeightage}.`
      })),
      provider: {
        '@type': 'Organization',
        name: 'MIHORA VU STUDY LIBRARY',
        url: BASE_URL
      },
      isAccessibleForFree: true,
      inLanguage: 'en-PK',
      url: `${BASE_URL}${canonicalPath}`
    });

    graphNodes.push({
      '@type': 'LearningResource',
      '@id': `${BASE_URL}${canonicalPath}#learning-resource`,
      name: `${enriched.displayName} – ${enriched.courseCode} Exam Prep Material`,
      learningResourceType: enriched.typeLabel,
      educationalLevel: enriched.termScope,
      numberOfPages: enriched.estimatedPages,
      teaches: `${enriched.courseCode} – ${enriched.courseTitle}`,
      isAccessibleForFree: true,
      inLanguage: 'en-PK',
      url: `${BASE_URL}${canonicalPath}`
    });

    graphNodes.push({
      '@type': 'FAQPage',
      '@id': `${BASE_URL}${canonicalPath}#faqs`,
      name: `${enriched.courseCode} Examination & Document FAQs`,
      mainEntity: enriched.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    });
  } else if (page === 'home' && activeFilterType === 'HANDOUT' && !selectedCourseCode) {
    title = `VU Lecture Handouts PDF Free Download | MIHORA VU`;
    desc = `Download 2,625+ official Virtual University lecture handouts PDF, highlighted short notes, and reference books across CS, MTH, ENG, MGT, and all ${courses.length} subjects free with zero login.`;
    keywords = 'vu handouts pdf, virtual university lecture handouts free download, vu highlighted handouts pdf, cs101 handouts pdf, cs201 handouts pdf, mth101 handouts pdf, vu short notes pdf';
    canonicalPath = '/vu-handouts-pdf';
    breadcrumbs.push({ name: 'VU Handouts PDF', item: `${BASE_URL}/vu-handouts-pdf` });
  } else if (page === 'home' && selectedCourseCode) {
    const match = courses.find((c) => c.code === selectedCourseCode);
    const titleSuffix = match ? ` – ${match.title}` : '';
    // Keep titles ≤60 chars, mirroring the prerender: long official course
    // titles drop the brand suffix so hydration never lengthens the title.
    const coursePageTitleFull = `${selectedCourseCode}${titleSuffix} | MIHORA VU`;
    title =
      coursePageTitleFull.length > 60
        ? `${selectedCourseCode}${titleSuffix}`
        : coursePageTitleFull;
    desc = `Verified ${selectedCourseCode}${match ? ` (${match.title})` : ''} Assignment 1 & 2 Solution 2026, GDB, solved midterm & final past papers, live MCQs, handouts PDF and subjective notes — free on MIHORA VU.`;
    keywords = `${selectedCourseCode} assignment 1 solution 2026, ${selectedCourseCode} assignment 2 solution 2026, ${selectedCourseCode} assignment solution 2026, ${selectedCourseCode} gdb solution 2026, ${selectedCourseCode} past papers, ${selectedCourseCode} mcqs bank, ${selectedCourseCode} live mids mcqs, ${selectedCourseCode} handouts pdf, ${selectedCourseCode} midterm solved, ${selectedCourseCode} finalterm solved, ${selectedCourseCode} subjective`;
    canonicalPath = `/courses/${selectedCourseCode.toLowerCase()}`;
    breadcrumbs.push(
      { name: 'Courses', item: `${BASE_URL}/courses` },
      { name: selectedCourseCode, item: `${BASE_URL}${canonicalPath}` }
    );
    graphNodes.push({
      '@type': 'Course',
      '@id': `${BASE_URL}${canonicalPath}#course`,
      name: `${selectedCourseCode}${match ? ` - ${match.title}` : ''}`,
      courseCode: selectedCourseCode,
      description: desc,
      provider: {
        '@type': 'CollegeOrUniversity',
        name: 'Virtual University of Pakistan'
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'PKR',
        availability: 'https://schema.org/InStock'
      }
    });
  } else if (page === 'courses') {
    title = `VU Course List – All ${courses.length}+ Subjects, Past Papers & Handouts`;
    desc = `Complete Virtual University course list covering all ${courses.length} subject codes (CS, MTH, MGT, ENG, PAK, PSY, ZOO, EDU) with solved midterm papers, final term files, handouts PDF, and 2026 assignment guides.`;
    keywords = 'vu course list, virtual university all courses list, vu course codes, vu subjects directory, vu past papers list, vu assignment solution 2026';
    canonicalPath = '/courses';
    breadcrumbs.push({ name: `Courses (${courses.length})`, item: `${BASE_URL}/courses` });
    graphNodes.push({
      '@type': 'CollectionPage',
      '@id': `${BASE_URL}/courses#collection`,
      name: `All ${courses.length} Virtual University Courses`,
      description: desc,
      numberOfItems: courses.length
    });
  } else if (page === 'mcqs') {
    if (selectedMcqSet) {
      title = `${selectedMcqSet.courseCode} ${selectedMcqSet.termLabel} MCQs (${selectedMcqSet.questions.length} Qs) | MIHORA VU`;
      desc = `Practice ${selectedMcqSet.questions.length} verified ${selectedMcqSet.courseCode} (${selectedMcqSet.courseTitle}) ${selectedMcqSet.termLabel} MCQs online with instant answers and timed mock exam simulation.`;
      canonicalPath = `/mcqs/${selectedMcqSet.id}`;
      breadcrumbs.push(
        { name: 'Interactive MCQs', item: `${BASE_URL}/mcqs` },
        { name: `${selectedMcqSet.courseCode} ${selectedMcqSet.termLabel}`, item: `${BASE_URL}${canonicalPath}` }
      );
      graphNodes.push({
        '@type': 'Quiz',
        '@id': `${BASE_URL}${canonicalPath}#quiz`,
        name: `${selectedMcqSet.courseCode} ${selectedMcqSet.termLabel} MCQs`,
        about: selectedMcqSet.courseTitle,
        description: selectedMcqSet.description,
        numberOfQuestions: selectedMcqSet.questions.length,
        educationalAlignment: {
          '@type': 'AlignmentObject',
          alignmentType: 'educationalSubject',
          targetName: `${selectedMcqSet.courseCode} – ${selectedMcqSet.courseTitle}`
        }
      });
    } else if (cleanPath === '/live-mids-mcqs') {
      title = `VU Live Mids MCQs & Midterm Quiz Bank | MIHORA VU`;
      desc = `Practice live VU Midterm MCQs, current quiz solutions, and repeat objective exam questions online with instant answer keys, 45s mock timer, and flash-sheets.`;
      keywords = 'vu live mids mcqs, vu live quiz mcqs, vu current midterm papers 2026, vu midterm mcqs quiz bank, vu grand quiz mcqs solved';
      canonicalPath = '/live-mids-mcqs';
      breadcrumbs.push({ name: 'Live Mids MCQs', item: `${BASE_URL}/live-mids-mcqs` });
    } else if (cleanPath === '/vu-mcqs-bank') {
      title = `VU MCQs Bank – ${totalMcqQuestions.toLocaleString()} Interactive MCQs | MIHORA VU`;
      desc = `Complete Virtual University MCQs Bank for Mid-Term & Final-Term exams. Practice ${totalMcqQuestions.toLocaleString()} interactive online MCQs and download 8,989+ solved quiz & MCQ PDFs free.`;
      keywords = 'vu mcqs bank, virtual university mcqs bank pdf, vu solved mcqs file, vu quiz bank, moaaz mcqs bank, waqar siddhu mcqs';
      canonicalPath = '/vu-mcqs-bank';
      breadcrumbs.push({ name: 'VU MCQs Bank', item: `${BASE_URL}/vu-mcqs-bank` });
    } else {
      title = `Interactive VU Exam MCQs & Subject Practice Studios`;
      desc = `Practice ${totalMcqQuestions.toLocaleString()} verified Virtual University Live Mid-Term & Final-Term MCQs online with timed mock exams and rapid flash-sheets.`;
      keywords = 'vu mcqs bank, vu live mids mcqs, vu online quiz practice, vu midterm solved mcqs, vu final term mcqs';
      canonicalPath = '/mcqs';
      breadcrumbs.push({ name: 'Interactive MCQs', item: `${BASE_URL}/mcqs` });
      graphNodes.push({
        '@type': 'CollectionPage',
        '@id': `${BASE_URL}/mcqs#hub`,
        name: 'Interactive VU Exam MCQ Studios',
        description: desc
      });
    }
  } else if (page === 'subjective') {
    if (selectedSubjectiveSet) {
      title = `${selectedSubjectiveSet.courseCode} Subjective Fast-Learning (${selectedSubjectiveSet.questions.length} Q&As) | MIHORA VU`;
      desc = `Fast-learn ${selectedSubjectiveSet.questions.length} high-yield ${selectedSubjectiveSet.courseCode} (${selectedSubjectiveSet.courseTitle}) 2, 3, and 5-mark subjective questions with 10-second memory hooks and examiner rubrics.`;
      canonicalPath = `/subjective/${selectedSubjectiveSet.id}`;
      breadcrumbs.push(
        { name: 'Subjective Fast-Learning', item: `${BASE_URL}/subjective` },
        { name: selectedSubjectiveSet.courseCode, item: `${BASE_URL}${canonicalPath}` }
      );
      graphNodes.push({
        '@type': 'FAQPage',
        '@id': `${BASE_URL}${canonicalPath}#faq`,
        name: `${selectedSubjectiveSet.courseCode} Subjective Fast-Learning`,
        mainEntity: selectedSubjectiveSet.questions.slice(0, 6).map((q) => ({
          '@type': 'Question',
          name: `[${q.marks} Marks] ${q.question}`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `${q.quickHook} Key points: ${q.keyPoints.join('; ')}`
          }
        }))
      });
    } else if (cleanPath === '/vu-subjective-solved') {
      title = `Solved VU Subjective Questions (2, 3 & 5 Marks)`;
      desc = `Master Virtual University short (2 & 3 mark) and long (5 mark) subjective exam questions using 10-second memory hooks, examiner marking keys, and model answers across ${courses.length} subjects.`;
      keywords = 'vu subjective solved, vu short questions solved, vu long questions 5 marks, vu midterm subjective, vu finalterm subjective questions';
      canonicalPath = '/vu-subjective-solved';
      breadcrumbs.push({ name: 'VU Subjective Solved', item: `${BASE_URL}/vu-subjective-solved` });
    } else {
      title = `VU Subjective Fast-Learning Studio | MIHORA VU`;
      desc = `Master Virtual University 2, 3, and 5-mark subjective questions using 10-second memory hooks, examiner rubrics, cram sheets, and all ${courses.length} subject hubs.`;
      canonicalPath = '/subjective';
      breadcrumbs.push({ name: 'Subjective Fast-Learning', item: `${BASE_URL}/subjective` });
      graphNodes.push({
        '@type': 'CollectionPage',
        '@id': `${BASE_URL}/subjective#hub`,
        name: 'VU Subjective Fast-Learning Studios',
        description: desc
      });
    }
  } else if (page === 'past-papers') {
    title = 'VU Solved Past Papers – Midterm & Final Term';
    desc = 'Explore real Virtual University midterm & final-term student exam reviews, repeated subjective questions, and Moaaz/Waqar Siddhu solved archives across all 412 courses.';
    canonicalPath = '/past-papers';
    breadcrumbs.push({ name: 'Past Papers', item: `${BASE_URL}/past-papers` });
  } else if (page === 'assignment-guide') {
    title = 'VU Assignment Solution 2026 – All Courses Solved';
    desc = 'Download verified 2026 VU assignment templates, Dev-C++ boilerplate, GDB word-count rubrics, 24-hour grace period guide, and Turnitin <19% originality checklist.';
    canonicalPath = '/vu-assignment-solution-2026';
    breadcrumbs.push(
      { name: 'VU Handbook', item: `${BASE_URL}/handbook` },
      { name: 'Assignments 2026', item: `${BASE_URL}${canonicalPath}` }
    );
  } else if (page === 'handbook') {
    title = 'VU Student Handbook 2026 – FAQs, Rules & Grading';
    desc = 'Official Virtual University Student Handbook guide: Master the 20% Two-Half rule, paper rechecking (PKR 500), merit & need-based scholarships, A+ to F grading scheme, datesheet booking, CGPA probation, and paper rescheduling (PKR 2,000).';
    keywords = 'vu student handbook, handbook vu edu pk guide, virtual university student handbook, vu 20 percent passing rule, vu paper rechecking fee 500, vu merit scholarship cgpa, vu grading scale, vu paper reschedule fee';
    canonicalPath = '/handbook';
    breadcrumbs.push({ name: 'VU Handbook', item: `${BASE_URL}/handbook` });
  } else if (page === 'simulator') {
    title = 'VU Mid Calculator & Passing Marks Simulator';
    desc = 'Official VU Mid Calculator & Passing Marks Simulator: Calculate your midterm, sessional, and exact Final-Term marks required to pass or reach an A grade under Virtual University 20% Two-Half rules.';
    keywords = 'vu mid calculator, vu midterm calculator, vu passing marks simulator, vu final term marks calculator, vu 20 percent rule calculator, virtual university grade calculator';
    canonicalPath = '/simulator';
    breadcrumbs.push({ name: 'Passing Marks Simulator', item: `${BASE_URL}/simulator` });
    graphNodes.push({
      '@type': 'WebApplication',
      '@id': `${BASE_URL}/simulator#app`,
      name: 'VU Passing Marks Simulator',
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'All',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'PKR' }
    });
  } else if (page === 'gpa-calculator') {
    title = 'VU GPA & CGPA Calculator 4.0 – Grade Forecaster | MIHORA VU';
    desc = 'Calculate Virtual University semester GPA and cumulative CGPA on the HEC 4.0 scale with probation warning checks and repeat course guidance.';
    canonicalPath = '/gpa-calculator';
    breadcrumbs.push({ name: 'GPA & CGPA Calculator', item: `${BASE_URL}/gpa-calculator` });
    graphNodes.push({
      '@type': 'WebApplication',
      '@id': `${BASE_URL}/gpa-calculator#app`,
      name: 'VU GPA & CGPA Calculator',
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'All',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'PKR' }
    });
  } else if (page === 'datesheet-guide') {
    title = 'VU Datesheet Maker & Seat Booking Guide 2026';
    desc = 'Step-by-step strategy for VU datesheet opening, first-come first-served lab seats, exam timeslots, and paper reschedule rules.';
    canonicalPath = '/datesheet-guide';
    breadcrumbs.push(
      { name: 'VU Handbook', item: `${BASE_URL}/handbook` },
      { name: 'Datesheet Guide', item: `${BASE_URL}/datesheet-guide` }
    );
  } else if (page === 'cs619-guide') {
    title = 'CS619 Final Year Project (FYP) Roadmap & Viva Guide | MIHORA VU';
    desc = 'Complete CS619 capstone guide covering SRS documentation, ERD design, prototype build phases, and top viva voce defense questions.';
    canonicalPath = '/cs619-guide';
    breadcrumbs.push(
      { name: 'Courses', item: `${BASE_URL}/courses` },
      { name: 'CS619 FYP Guide', item: `${BASE_URL}/cs619-guide` }
    );
  } else if (page === 'security') {
    title = 'Privacy & Trust – Zero Data Collection | MIHORA VU';
    desc = 'Zero login walls, zero analytics cookies, verified educational files, and direct instant downloads for Virtual University students.';
    canonicalPath = '/security';
    breadcrumbs.push(
      { name: 'About MIHORA', item: `${BASE_URL}/about` },
      { name: 'Privacy & Safety', item: `${BASE_URL}/security` }
    );
  } else if (page === 'about') {
    title = 'About MIHORA TECH – Free VU Study Resources';
    desc = 'Learn about MIHORA TECH’s independent, non-commercial CSR initiative organizing Virtual University academic resources for Pakistani students.';
    canonicalPath = '/about';
    breadcrumbs.push({ name: 'About', item: `${BASE_URL}/about` });
  } else if (page === 'sitemap') {
    title = `VU Curriculum & Faculty Sitemap | MIHORA VU`;
    desc = `Complete faculty-by-faculty index of all ${courses.length} Virtual University courses, interactive quiz studios, and academic calculators.`;
    canonicalPath = '/sitemap';
    breadcrumbs.push({ name: 'Curriculum Directory', item: `${BASE_URL}/sitemap` });
  } else if (page === 'disclaimer') {
    title = 'Academic Disclaimer & Fair Use Notice | MIHORA VU';
    desc = 'Independent educational resource fair-use notice and non-affiliation disclosure for Virtual University students.';
    canonicalPath = '/disclaimer';
    breadcrumbs.push(
      { name: 'About MIHORA', item: `${BASE_URL}/about` },
      { name: 'Disclaimer', item: `${BASE_URL}/disclaimer` }
    );
  } else if (page === 'not-found') {
    title = 'Page Not Found (404) | MIHORA VU';
    desc = 'This page does not exist on MIHORA VU. Search 28,328 Virtual University past papers, midterm MCQs and solved subjective questions, or go back to the study library homepage.';
    keywords = 'mihora vu 404, page not found, vu past papers, vu mcqs bank';
    canonicalPath = '/';
  }

  // 404 pages must never be indexed; every other page stays indexable.
  const robots = page === 'not-found' ? 'noindex, nofollow' : 'index, follow';

  const canonicalUrl = `${BASE_URL}${canonicalPath}`;

  document.title = title;
  upsertMeta('meta[name="description"]', 'name', 'description', desc);
  upsertMeta('meta[name="keywords"]', 'name', 'keywords', keywords);
  upsertMeta('meta[name="robots"]', 'name', 'robots', robots);
  upsertMeta('meta[property="og:title"]', 'property', 'og:title', title);
  upsertMeta('meta[property="og:description"]', 'property', 'og:description', desc);
  upsertMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
  upsertMeta('meta[property="og:image"]', 'property', 'og:image', DEFAULT_OG_IMAGE);
  upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
  upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', desc);
  upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', DEFAULT_OG_IMAGE);

  let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.rel = 'canonical';
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.href = canonicalUrl;

  const webPageNode: Record<string, unknown> = {
    '@type': 'WebPage',
    '@id': `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: title,
    description: desc,
    inLanguage: 'en-PK',
    isPartOf: { '@id': `${BASE_URL}/#website` },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['[data-speakable="true"]', 'h1']
    }
  };

  const breadcrumbNode: Record<string, unknown> = {
    '@type': 'BreadcrumbList',
    '@id': `${canonicalUrl}#breadcrumb`,
    itemListElement: breadcrumbs.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: b.name,
      item: b.item
    }))
  };

  upsertJsonLd('mihora-dynamic-jsonld', {
    '@context': 'https://schema.org',
    '@graph': [webPageNode, breadcrumbNode, ...graphNodes]
  });
}
