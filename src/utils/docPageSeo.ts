// Shared /doc/* SEO builders — single source of truth for prerender
// (scripts/doc-prerender-template.ts) and runtime (src/utils/seoManager.ts).
// Pure and DOM-free; the prerender and the hydrated page can never drift.
//
// Rules (DESIGN §1.3/§1.5/§1.7):
// - Title: "{displayName} ({CODE} {FORMAT}) | MIHORA VU", else
//   "{CODE} – {displayName}" truncated to 60 chars. H1 keeps the full name.
// - Meta description: overviewSummary truncated to <=155 chars at a word
//   boundary + '…'.
// - JSON-LD graph: WebPage + BreadcrumbList + DigitalDocument +
//   LearningResource + FAQPage (first 4 FAQs only). The caller merges the
//   site-wide Organization/WebSite nodes.
// - estimatedPages is a hardcoded heuristic: it appears ONLY inside JSON-LD
//   (numberOfPages), never as visible page-count text.
import type { EnrichedDocMetadata } from './docEnricher';

export const DOC_TYPE_LABELS: Record<string, string> = {
  MIDTERM: 'Midterm',
  FINALTERM: 'Final-Term',
  QUIZ: 'Quiz',
  HANDOUT: 'Handout',
  MCQFILE: 'MCQ Bank',
  ASSIGNMENT: 'Assignment',
  OTHER: 'Study Resource'
};

export const DOC_FAQ_LIMIT = 4;

export function docTypeLabel(type: string): string {
  return DOC_TYPE_LABELS[(type || 'OTHER').toUpperCase()] || DOC_TYPE_LABELS.OTHER;
}

export function buildDocPageTitle(enriched: EnrichedDocMetadata): string {
  const titleFull = `${enriched.displayName} (${enriched.courseCode} ${enriched.format}) | MIHORA VU`;
  if (titleFull.length <= 60) return titleFull;
  return `${enriched.courseCode} – ${enriched.displayName}`.slice(0, 60);
}

export function buildDocMetaDescription(enriched: EnrichedDocMetadata): string {
  const summary = enriched.overviewSummary || '';
  if (summary.length <= 155) return summary;
  const cut = summary.slice(0, 154);
  const boundary = cut.lastIndexOf(' ');
  return (boundary > 0 ? cut.slice(0, boundary) : cut) + '…';
}

const BASE_URL = 'https://study.mihora.tech';

export function buildDocJsonLdGraph(
  enriched: EnrichedDocMetadata,
  canonical: string
): Array<Record<string, unknown>> {
  const title = buildDocPageTitle(enriched);
  const description = buildDocMetaDescription(enriched);
  const courseLower = enriched.courseCode.toLowerCase();

  const webPage: Record<string, unknown> = {
    '@type': 'WebPage',
    '@id': `${canonical}#webpage`,
    url: canonical,
    name: title,
    description,
    inLanguage: 'en-PK',
    isPartOf: { '@id': `${BASE_URL}/#website` },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['[data-speakable="true"]', 'h1']
    }
  };

  const breadcrumbList: Record<string, unknown> = {
    '@type': 'BreadcrumbList',
    '@id': `${canonical}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Courses', item: `${BASE_URL}/courses` },
      {
        '@type': 'ListItem',
        position: 3,
        name: enriched.courseCode,
        item: `${BASE_URL}/courses/${courseLower}`
      },
      { '@type': 'ListItem', position: 4, name: enriched.displayName, item: canonical }
    ]
  };

  // hasPart carries module titles + lecture spans only — no keyTopics
  // (boilerplate lists would cost ~2.6 KB/page for zero new information).
  const digitalDocument: Record<string, unknown> = {
    '@type': 'DigitalDocument',
    '@id': `${canonical}#document`,
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
      description: `${m.lectureSpan} (${m.pageRange}): Exam focus: ${m.examWeightage}.`
    })),
    provider: {
      '@type': 'Organization',
      name: 'MIHORA VU STUDY LIBRARY',
      url: BASE_URL
    },
    isAccessibleForFree: true,
    inLanguage: 'en-PK',
    url: canonical
  };

  const learningResource: Record<string, unknown> = {
    '@type': 'LearningResource',
    '@id': `${canonical}#learning-resource`,
    name: `${enriched.displayName} – ${enriched.courseCode} Exam Prep Material`,
    learningResourceType: enriched.typeLabel,
    educationalLevel: enriched.termScope,
    numberOfPages: enriched.estimatedPages,
    teaches: `${enriched.courseCode} – ${enriched.courseTitle}`,
    isAccessibleForFree: true,
    inLanguage: 'en-PK',
    url: canonical
  };

  const faqPage: Record<string, unknown> = {
    '@type': 'FAQPage',
    '@id': `${canonical}#faqs`,
    name: `${enriched.courseCode} Examination & Document FAQs`,
    mainEntity: enriched.faqs.slice(0, DOC_FAQ_LIMIT).map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return [webPage, breadcrumbList, digitalDocument, learningResource, faqPage];
}
