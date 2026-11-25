import express, { Request, Response } from 'express';
import compression from 'compression';
import { createServer as createViteServer } from 'vite';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import { Readable } from 'stream';
import {
  cleanDocumentDisplayTitle,
  extractDocSlugFromPath,
  findDocEntryBySlug,
  getRelatedDocEntries
} from './src/utils/docSlug';
import {
  extractMidtermSlugFromPath,
  findMidtermEntryBySlug,
  getAllMidtermPrepEntries,
  getMidtermCoursesGrouped,
  getMidtermCoursePrefixNeighbors,
  getMidtermSiblingEntry
} from './src/utils/midtermPrep';
import { MidtermDocPayload } from './src/types/midterm';
import { enrichDocumentMetadata } from './src/utils/docEnricher';
import coursesData from './src/data/courses.json';

// In-memory caches for near-instant TTFB and Googlebot crawl budget efficiency
let cachedDistTemplate: string | null = null;
let cachedDevTemplate: string | null = null;
const docSsrCache = new Map<string, { html: string; timestamp: number }>();
const midtermSsrCache = new Map<string, { html: string; timestamp: number }>();
const SSR_CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

function escapeHtmlValue(str: string): string {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function injectDocumentSsrSeo(html: string, reqPath: string): string {
  const slugPart = extractDocSlugFromPath(reqPath);
  if (!slugPart) return html;
  const entry = findDocEntryBySlug(slugPart);
  if (!entry) return html;

  const doc = entry.resource;
  const enriched = enrichDocumentMetadata(doc);
  const canonicalUrl = `https://study.mihora.tech/doc/${entry.slug}`;
  const title = `${enriched.displayName} (${enriched.courseCode} ${enriched.format}) – Online Preview & Free Download | MIHORA VU`;
  const desc = enriched.overviewSummary;
  const keywords = enriched.targetKeywords.join(', ');

  let out = html
    .replace(/<title>.*?<\/title>/i, `<title>${escapeHtmlValue(title)}</title>`)
    .replace(
      /<meta\s+name="description"\s+content=".*?"\s*\/?>/i,
      `<meta name="description" content="${escapeHtmlValue(desc)}" />`
    )
    .replace(
      /<meta\s+name="keywords"\s+content=".*?"\s*\/?>/i,
      `<meta name="keywords" content="${escapeHtmlValue(keywords)}" />`
    )
    .replace(
      /<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i,
      `<link rel="canonical" href="${escapeHtmlValue(canonicalUrl)}" />`
    )
    .replace(
      /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i,
      `<meta property="og:title" content="${escapeHtmlValue(title)}" />`
    )
    .replace(
      /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i,
      `<meta property="og:description" content="${escapeHtmlValue(desc)}" />`
    )
    .replace(
      /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i,
      `<meta property="og:url" content="${escapeHtmlValue(canonicalUrl)}" />`
    )
    .replace(
      /<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i,
      `<meta name="twitter:title" content="${escapeHtmlValue(title)}" />`
    )
    .replace(
      /<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/i,
      `<meta name="twitter:description" content="${escapeHtmlValue(desc)}" />`
    );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: title,
        description: desc,
        inLanguage: 'en-PK',
        isPartOf: { '@id': 'https://study.mihora.tech/#website' },
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['h1', '[data-speakable="true"]']
        }
      },
      {
        '@type': 'DigitalDocument',
        '@id': `${canonicalUrl}#document`,
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
          url: 'https://study.mihora.tech'
        },
        isAccessibleForFree: true,
        inLanguage: 'en-PK',
        url: canonicalUrl
      },
      {
        '@type': 'LearningResource',
        '@id': `${canonicalUrl}#learning-resource`,
        name: `${enriched.displayName} – ${enriched.courseCode} Exam Prep Material`,
        learningResourceType: enriched.typeLabel,
        educationalLevel: enriched.termScope,
        numberOfPages: enriched.estimatedPages,
        teaches: `${enriched.courseCode} – ${enriched.courseTitle}`,
        isAccessibleForFree: true,
        inLanguage: 'en-PK',
        url: canonicalUrl
      },
      {
        '@type': 'FAQPage',
        '@id': `${canonicalUrl}#faqs`,
        name: `${enriched.courseCode} Examination & Document FAQs`,
        mainEntity: enriched.faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer
          }
        }))
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://study.mihora.tech/' },
          { '@type': 'ListItem', position: 2, name: 'Courses', item: 'https://study.mihora.tech/courses' },
          {
            '@type': 'ListItem',
            position: 3,
            name: enriched.courseCode,
            item: `https://study.mihora.tech/courses/${enriched.courseCode.toLowerCase()}`
          },
          { '@type': 'ListItem', position: 4, name: enriched.displayName, item: canonicalUrl }
        ]
      }
    ]
  };

  out = out.replace(
    '</head>',
    `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n  </head>`
  );

  const related = getRelatedDocEntries(doc, 10);
  const ssrBody = `
    <main style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; line-height: 1.6;">
      <nav aria-label="Breadcrumb" style="font-size: 0.85rem; margin-bottom: 1.25rem;">
        <a href="/" style="color: #1d4ed8; text-decoration: none; font-weight: 600;">Library</a> &rsaquo;
        <a href="/courses" style="color: #1d4ed8; text-decoration: none; font-weight: 600;">Courses</a> &rsaquo;
        <a href="/courses/${escapeHtmlValue(enriched.courseCode.toLowerCase())}" style="color: #1d4ed8; text-decoration: none; font-weight: 600;">${escapeHtmlValue(enriched.courseCode)}</a> &rsaquo;
        <span style="color: #64748b; font-weight: 600;">${escapeHtmlValue(enriched.displayName)}</span>
      </nav>

      <header style="margin-bottom: 2rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 1.5rem;">
        <div style="font-family: monospace; font-size: 0.8rem; font-weight: 700; color: #1d4ed8; text-transform: uppercase; margin-bottom: 0.5rem;">
          ${escapeHtmlValue(enriched.courseCode)} · ${escapeHtmlValue(enriched.format)} · ${escapeHtmlValue(enriched.typeLabel)} · ~${escapeHtmlValue(String(enriched.estimatedPages))} Pages
        </div>
        <h1 style="font-size: 2.25rem; font-weight: 900; line-height: 1.25; margin-bottom: 0.75rem; color: #0f172a;">
          ${escapeHtmlValue(enriched.displayName)}
        </h1>
        <p style="font-size: 1.1rem; color: #475569; max-width: 900px;">
          ${escapeHtmlValue(enriched.overviewSummary)}
        </p>
      </header>

      <!-- Academic Overview & Scope -->
      <section style="margin-bottom: 2rem; padding: 1.5rem; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="font-size: 1.35rem; font-weight: 800; color: #0f172a; margin-bottom: 0.75rem;">
          Academic Overview &amp; Curriculum Scope
        </h2>
        <p style="color: #334155; margin-bottom: 1rem;">
          This resource belongs to <strong>${escapeHtmlValue(enriched.courseCode)}: ${escapeHtmlValue(enriched.courseTitle)}</strong> under the <em>${escapeHtmlValue(enriched.faculty)}</em> at Virtual University of Pakistan. It is tailored for students preparing for examinations, assignments, and semester evaluations.
        </p>
        <ul style="color: #475569; padding-left: 1.25rem; margin-bottom: 1rem;">
          ${enriched.syllabusHighlights.map((h) => `<li style="margin-bottom: 0.35rem;">${escapeHtmlValue(h)}</li>`).join('')}
        </ul>
      </section>

      <!-- Comprehensive Document Chapter & Lecture Roadmap (Thousands of Pages Depth) -->
      <section style="margin-bottom: 2rem; padding: 1.5rem; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem; border-bottom: 1px solid #f1f5f9; padding-bottom: 0.75rem;">
          <h2 style="font-size: 1.35rem; font-weight: 800; color: #0f172a; margin: 0;">
            Document Chapter &amp; Lecture Syllabus Roadmap (~${escapeHtmlValue(String(enriched.estimatedPages))} Pages Indexed)
          </h2>
          <span style="font-size: 0.8rem; font-weight: 700; color: #1d4ed8; background: #eff6ff; padding: 0.35rem 0.75rem; border-radius: 6px;">
            ${escapeHtmlValue(enriched.termScope)}
          </span>
        </div>
        <p style="color: #475569; font-size: 0.95rem; margin-bottom: 1.25rem;">
          This ${escapeHtmlValue(enriched.format)} study document encompasses approximately ${escapeHtmlValue(String(enriched.estimatedPages))} pages across ${escapeHtmlValue(String(enriched.curriculumModules.length))} structured academic modules. Below is the complete syllabus roadmap indexing every lecture topic, exam weightage, and solved question pattern for Googlebot and students:
        </p>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${enriched.curriculumModules.map((m) => `
            <div style="padding: 1rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem;">
                <h3 style="font-size: 1.05rem; font-weight: 700; color: #0f172a; margin: 0;">
                  Module ${m.moduleNumber}: ${escapeHtmlValue(m.title)}
                </h3>
                <span style="font-size: 0.8rem; font-family: monospace; color: #64748b; font-weight: 600;">
                  ${escapeHtmlValue(m.lectureSpan)} · ${escapeHtmlValue(m.pageRange)}
                </span>
              </div>
              <div style="font-size: 0.8rem; font-weight: 600; color: #166534; margin-bottom: 0.5rem;">
                Exam Focus: ${escapeHtmlValue(m.examWeightage)}
              </div>
              <ul style="color: #334155; font-size: 0.875rem; padding-left: 1.25rem; margin: 0;">
                ${m.keyTopics.map((t) => `<li style="margin-bottom: 0.25rem;">${escapeHtmlValue(t)}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Exam Prep & 20% Two-Half Rule Strategy -->
      <section style="margin-bottom: 2rem; padding: 1.5rem; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px;">
        <h2 style="font-size: 1.35rem; font-weight: 800; color: #1e40af; margin-bottom: 0.75rem;">
          ${escapeHtmlValue(enriched.courseCode)} Examination &amp; 20% Passing Rule Strategy
        </h2>
        <p style="color: #1e3a8a; margin-bottom: 0.75rem;">
          ${escapeHtmlValue(enriched.examTips)}
        </p>
        <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1rem;">
          <a href="/courses/${escapeHtmlValue(enriched.courseCode.toLowerCase())}" style="display: inline-block; padding: 0.6rem 1rem; background: #1d4ed8; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 0.9rem;">All ${escapeHtmlValue(enriched.courseCode)} Files</a>
          <a href="/vu-mcqs-bank" style="display: inline-block; padding: 0.6rem 1rem; background: #ffffff; color: #1d4ed8; border: 1px solid #bfdbfe; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 0.9rem;">Practice MCQs Bank</a>
          <a href="/simulator" style="display: inline-block; padding: 0.6rem 1rem; background: #ffffff; color: #1d4ed8; border: 1px solid #bfdbfe; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 0.9rem;">Passing Marks Simulator</a>
        </div>
      </section>

      <!-- Frequently Asked Questions -->
      <section style="margin-bottom: 2.5rem; padding: 1.5rem; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="font-size: 1.35rem; font-weight: 800; color: #0f172a; margin-bottom: 1rem;">
          Frequently Asked Questions (${escapeHtmlValue(enriched.courseCode)} Exams &amp; Downloads)
        </h2>
        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          ${enriched.faqs
            .map(
              (f) => `
            <div>
              <h3 style="font-size: 1.05rem; font-weight: 700; color: #0066ff; margin-bottom: 0.35rem;">${escapeHtmlValue(f.question)}</h3>
              <p style="color: #475569; font-size: 0.95rem;">${escapeHtmlValue(f.answer)}</p>
            </div>
          `
            )
            .join('')}
        </div>
      </section>

      <!-- Target Search Keywords & Topics -->
      <section style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.15rem; font-weight: 700; color: #0f172a; margin-bottom: 0.5rem;">
          Related Virtual University Search Queries
        </h2>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          ${enriched.targetKeywords
            .map(
              (kw) =>
                `<span style="display: inline-block; padding: 0.35rem 0.65rem; background: #f1f5f9; border-radius: 6px; font-size: 0.8rem; color: #475569; font-family: monospace;">${escapeHtmlValue(kw)}</span>`
            )
            .join('')}
        </div>
      </section>

      <!-- Related Course Documents -->
      ${
        related.length > 0
          ? `
      <section style="margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid #e2e8f0;">
        <h2 style="font-size: 1.35rem; font-weight: 800; color: #0f172a; margin-bottom: 1rem;">
          More Verified ${escapeHtmlValue(enriched.courseCode)} Study Documents
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 0.75rem;">
          ${related
            .map(
              (r) =>
                `<a href="/doc/${escapeHtmlValue(r.slug)}" style="display: block; padding: 0.85rem; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; text-decoration: none; color: #1d4ed8; font-weight: 600; font-size: 0.9rem;">${escapeHtmlValue(cleanDocumentDisplayTitle(r.resource.name))} <span style="display: block; color: #64748b; font-size: 0.75rem; margin-top: 0.25rem;">${escapeHtmlValue(r.resource.format)} · ${escapeHtmlValue(r.resource.type)}</span></a>`
            )
            .join('')}
        </div>
      </section>
      `
          : ''
      }
    </main>
  `;

  out = out.replace(
    /<div id="root">[\s\S]*?(?=\s*(?:<!-- Client-side SPA|<script type="module"))/i,
    `<div id="root">${ssrBody}</div>\n    `
  );
  return out
    .replace(/href="\.\/assets\//g, 'href="/assets/')
    .replace(/src="\.\/assets\//g, 'src="/assets/')
    .replace(/href="\.\/logo\.svg"/g, 'href="/logo.svg"')
    .replace(/src="\.\/logo\.svg"/g, 'src="/logo.svg"')
    .replace(/href="\.\/og-cover\.jpg"/g, 'href="/og-cover.jpg"')
    .replace(/src="\.\/og-cover\.jpg"/g, 'src="/og-cover.jpg"');
}

const LETTERS_LIST = ['a', 'b', 'c', 'd', 'e', 'f'] as const;

function applyHeadMetaTags(
  html: string,
  meta: { title: string; desc: string; keywords: string; canonicalUrl: string }
): string {
  return html
    .replace(/<title>.*?<\/title>/i, `<title>${escapeHtmlValue(meta.title)}</title>`)
    .replace(
      /<meta\s+name="description"\s+content=".*?"\s*\/?>/i,
      `<meta name="description" content="${escapeHtmlValue(meta.desc)}" />`
    )
    .replace(
      /<meta\s+name="keywords"\s+content=".*?"\s*\/?>/i,
      `<meta name="keywords" content="${escapeHtmlValue(meta.keywords)}" />`
    )
    .replace(
      /<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i,
      `<link rel="canonical" href="${escapeHtmlValue(meta.canonicalUrl)}" />`
    )
    .replace(
      /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i,
      `<meta property="og:title" content="${escapeHtmlValue(meta.title)}" />`
    )
    .replace(
      /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i,
      `<meta property="og:description" content="${escapeHtmlValue(meta.desc)}" />`
    )
    .replace(
      /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i,
      `<meta property="og:url" content="${escapeHtmlValue(meta.canonicalUrl)}" />`
    )
    .replace(
      /<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i,
      `<meta name="twitter:title" content="${escapeHtmlValue(meta.title)}" />`
    )
    .replace(
      /<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/i,
      `<meta name="twitter:description" content="${escapeHtmlValue(meta.desc)}" />`
    );
}

function normalizeAssetUrls(html: string): string {
  return html
    .replace(/href="\.\/assets\//g, 'href="/assets/')
    .replace(/src="\.\/assets\//g, 'src="/assets/')
    .replace(/href="\.\/logo\.svg"/g, 'href="/logo.svg"')
    .replace(/src="\.\/logo\.svg"/g, 'src="/logo.svg"')
    .replace(/href="\.\/og-cover\.jpg"/g, 'href="/og-cover.jpg"')
    .replace(/src="\.\/og-cover\.jpg"/g, 'src="/og-cover.jpg"');
}

function readMidtermPayloadFromDisk(dataKey: string, isProd: boolean): MidtermDocPayload | null {
  const candidates = isProd
    ? [
        path.resolve('dist/midterm-data', `${dataKey}.json`),
        path.resolve('public/midterm-data', `${dataKey}.json`)
      ]
    : [
        path.resolve('public/midterm-data', `${dataKey}.json`),
        path.resolve('dist/midterm-data', `${dataKey}.json`)
      ];

  for (const filePath of candidates) {
    if (fs.existsSync(filePath)) {
      try {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as MidtermDocPayload;
      } catch (err) {
        console.error(`Failed to parse midterm JSON ${filePath}:`, err);
      }
    }
  }
  return null;
}

function injectMidtermHubSsrSeo(html: string): string {
  const allEntries = getAllMidtermPrepEntries();
  const groupedCourses = getMidtermCoursesGrouped();
  const canonicalUrl = 'https://study.mihora.tech/midterm-prep';
  const title = `VU Midterm Prep 2026 — ${allEntries.length} Special Question Banks (${groupedCourses.length} Subjects) | MIHORA`;
  const desc = `Complete Virtual University Midterm Preparation 2026 Hub: ${allEntries.length} locally hosted MCQs & Subjective Q&A banks across ${groupedCourses.length} VU courses with full on-page transcripts and verified answers.`;
  const keywords =
    'vu midterm prep 2026, virtual university midterm important mcqs, vu midterm solved subjective questions, cs101 midterm 2026, mgt101 midterm mcqs, mth101 midterm files, study mihora tech';

  let out = applyHeadMetaTags(html, { title, desc, keywords, canonicalUrl });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: title,
        description: desc,
        inLanguage: 'en-PK',
        isPartOf: { '@id': 'https://study.mihora.tech/#website' }
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://study.mihora.tech/' },
          { '@type': 'ListItem', position: 2, name: 'Midterm Prep 2026', item: canonicalUrl }
        ]
      }
    ]
  };

  out = out.replace(
    '</head>',
    `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n  </head>`
  );

  const ssrBody = `
    <main style="max-width: 1200px; margin: 2rem auto; padding: 0 1rem; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; line-height: 1.6;">
      <nav aria-label="Breadcrumb" style="font-size: 0.85rem; margin-bottom: 1.25rem;">
        <a href="/" style="color: #1d4ed8; text-decoration: none; font-weight: 600;">Library</a> &rsaquo;
        <span style="color: #64748b; font-weight: 600;">Midterm Prep 2026</span>
      </nav>
      <header style="margin-bottom: 2rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 1.5rem;">
        <div style="font-family: monospace; font-size: 0.8rem; font-weight: 700; color: #1d4ed8; text-transform: uppercase; margin-bottom: 0.5rem;">
          VU MIDTERM PREP 2026 · ${allEntries.length} QUESTION BANKS · ${groupedCourses.length} SUBJECTS
        </div>
        <h1 style="font-size: 2.25rem; font-weight: 900; line-height: 1.2; margin-bottom: 0.75rem; color: #0f172a;">
          Virtual University Midterm Prep 2026 — Complete Question Banks &amp; Transcripts
        </h1>
        <p style="font-size: 1.05rem; color: #475569; max-width: 900px;">
          ${escapeHtmlValue(desc)}
        </p>
      </header>
      <section style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 0.85rem;">
        ${groupedCourses
          .map((c) => {
            const mcqLink = c.mcqsEntry
              ? `<a href="/midterm-prep/${escapeHtmlValue(c.mcqsEntry.filename)}" style="display: inline-block; padding: 0.45rem 0.75rem; background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; border-radius: 6px; font-weight: 700; font-size: 0.8rem; text-decoration: none;">MCQs (${c.mcqsEntry.itemCount})</a>`
              : '';
            const subLink = c.subjectiveEntry
              ? `<a href="/midterm-prep/${escapeHtmlValue(c.subjectiveEntry.filename)}" style="display: inline-block; padding: 0.45rem 0.75rem; background: #fffbeb; color: #b45309; border: 1px solid #fde68a; border-radius: 6px; font-weight: 700; font-size: 0.8rem; text-decoration: none;">Subjective (${c.subjectiveEntry.itemCount})</a>`
              : '';
            return `<article style="padding: 1rem; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px;">
              <div style="font-family: monospace; font-size: 0.75rem; font-weight: 700; color: #1d4ed8;">${escapeHtmlValue(c.courseCode)} · ${escapeHtmlValue(c.faculty)}</div>
              <h2 style="font-size: 1rem; font-weight: 800; margin: 0.25rem 0 0.65rem 0; color: #0f172a;">
                <a href="/courses/${escapeHtmlValue(c.courseCode.toLowerCase())}" style="color: inherit; text-decoration: none;">${escapeHtmlValue(c.courseTitle)}</a>
              </h2>
              <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">${mcqLink}${subLink}</div>
            </article>`;
          })
          .join('')}
      </section>
    </main>
  `;

  out = out.replace(
    /<div id="root">[\s\S]*?(?=\s*(?:<!-- Client-side SPA|<script type="module"))/i,
    `<div id="root">${ssrBody}</div>\n    `
  );
  return normalizeAssetUrls(out);
}

function injectMidtermDocSsrSeo(html: string, reqPath: string, isProd: boolean): string {
  const slugPart = extractMidtermSlugFromPath(reqPath);
  if (!slugPart) return injectMidtermHubSsrSeo(html);

  const entry = findMidtermEntryBySlug(slugPart);
  if (!entry) return html;

  const payload = readMidtermPayloadFromDisk(entry.dataKey, isProd);
  const sibling = getMidtermSiblingEntry(entry);
  const neighbors = getMidtermCoursePrefixNeighbors(entry, 8);

  const isMcq = entry.kind === 'mcqs';
  const totalItems = payload?.itemCount ?? entry.itemCount;
  const pageCount = payload?.pageCount ?? entry.pageCount;
  const topics = payload?.topics?.length ? payload.topics : entry.topics;
  const courseTitle = payload?.courseTitle || entry.courseTitle;

  const canonicalUrl = `https://study.mihora.tech/midterm-prep/${entry.filename}`;
  const title = isMcq
    ? `${entry.courseCode} Midterm Important MCQs 2026 (${totalItems} Solved MCQs) – ${courseTitle} | MIHORA VU`
    : `${entry.courseCode} Midterm Important Subjective Questions 2026 (${totalItems} Solved Q&As) – ${courseTitle} | MIHORA VU`;

  const topTopicSnippet = topics.slice(0, 5).join(', ');
  const desc = isMcq
    ? `Complete solved midterm MCQ bank for ${entry.courseCode} (${courseTitle}): ${totalItems} verified objective questions across ${pageCount} pages covering ${topTopicSnippet}. Read all answers online or test yourself in quiz mode.`
    : `Complete solved midterm subjective Q&A transcript for ${entry.courseCode} (${courseTitle}): ${totalItems} exam-focused subjective questions with full answers across ${pageCount} pages covering ${topTopicSnippet}.`;

  const keywords = [
    `${entry.courseCode} midterm important ${isMcq ? 'mcqs' : 'subjective'} 2026`,
    `${entry.courseCode} midterm solved questions`,
    `${entry.courseCode} ${courseTitle}`,
    entry.filename,
    ...topics.slice(0, 6)
  ].join(', ');

  let out = applyHeadMetaTags(html, { title, desc, keywords, canonicalUrl });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: title,
        description: desc,
        inLanguage: 'en-PK',
        isPartOf: { '@id': 'https://study.mihora.tech/#website' },
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['h1', 'h2']
        }
      },
      {
        '@type': isMcq ? 'Quiz' : 'LearningResource',
        '@id': `${canonicalUrl}#resource`,
        name: `${entry.courseCode} Midterm Important ${isMcq ? 'MCQs' : 'Subjective Questions (Solved)'} 2026`,
        description: desc,
        learningResourceType: isMcq ? 'Midterm MCQ Bank' : 'Solved Subjective Q&A Transcript',
        educationalLevel: 'Midterm Exam 2026',
        isAccessibleForFree: true,
        inLanguage: 'en-PK',
        about: {
          '@type': 'Course',
          name: `${entry.courseCode} – ${courseTitle}`,
          courseCode: entry.courseCode,
          provider: {
            '@type': 'CollegeOrUniversity',
            name: 'Virtual University of Pakistan'
          }
        },
        hasPart: topics.slice(0, 20).map((t, i) => ({
          '@type': 'CreativeWork',
          position: i + 1,
          name: t
        })),
        url: canonicalUrl
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://study.mihora.tech/' },
          { '@type': 'ListItem', position: 2, name: 'Midterm Prep 2026', item: 'https://study.mihora.tech/midterm-prep' },
          {
            '@type': 'ListItem',
            position: 3,
            name: entry.courseCode,
            item: `https://study.mihora.tech/courses/${entry.courseCode.toLowerCase()}`
          },
          { '@type': 'ListItem', position: 4, name: entry.filename, item: canonicalUrl }
        ]
      }
    ]
  };

  const inlineJsonTag = payload
    ? `<script id="mihora-midterm-ssr-data" type="application/json">${JSON.stringify(payload).replace(/<\/script/gi, '<\\/script')}</script>`
    : '';

  out = out.replace(
    '</head>',
    `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n    ${inlineJsonTag}\n  </head>`
  );

  const mcqsHtml =
    payload?.mcqs && payload.mcqs.length > 0
      ? payload.mcqs
          .map(
            (q) => `
          <article style="margin-bottom: 1.15rem; padding: 1rem 1.15rem; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px;">
            <div style="font-size: 0.78rem; font-family: monospace; color: #1d4ed8; font-weight: 700; margin-bottom: 0.35rem;">
              MCQ #${q.number} · ${escapeHtmlValue(q.topic)}
            </div>
            <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin: 0 0 0.65rem 0;">
              ${escapeHtmlValue(q.question)}
            </h3>
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.35rem;">
              ${q.options
                .map((opt, idx) => {
                  const isCorrect = q.correctIndex === idx;
                  const letter = LETTERS_LIST[idx] || String(idx + 1);
                  return `<li style="padding: 0.45rem 0.75rem; border-radius: 6px; border: 1px solid ${isCorrect ? '#86efac' : '#e2e8f0'}; background: ${isCorrect ? '#ecfdf5' : '#f8fafc'}; font-weight: ${isCorrect ? '700' : '400'}; color: ${isCorrect ? '#065f46' : '#334155'};">
                    <span style="font-family: monospace; font-weight: 700;">${letter})</span> ${escapeHtmlValue(opt)}${isCorrect ? ' <strong>[Correct Answer]</strong>' : ''}
                  </li>`;
                })
                .join('')}
            </ul>
          </article>`
          )
          .join('')
      : '';

  const subjectiveHtml =
    payload?.subjective && payload.subjective.length > 0
      ? payload.subjective
          .map(
            (item) => `
          <article style="margin-bottom: 1.25rem; padding: 1.1rem 1.25rem; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px;">
            <div style="font-size: 0.78rem; font-family: monospace; color: #b45309; font-weight: 700; margin-bottom: 0.35rem;">
              Q${item.number}${item.marks ? ` (${escapeHtmlValue(item.marks)})` : ''} · ${escapeHtmlValue(item.topic)}
            </div>
            <h3 style="font-size: 1.02rem; font-weight: 700; color: #0f172a; margin: 0 0 0.65rem 0;">
              ${escapeHtmlValue(item.question)}
            </h3>
            ${
              item.answer
                ? `<div style="padding: 0.75rem 0.9rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; color: #1e293b; font-size: 0.94rem;">
                    <strong style="color: #065f46; font-family: monospace; font-size: 0.78rem; display: block; margin-bottom: 0.25rem;">VERIFIED ANSWER:</strong>
                    ${escapeHtmlValue(item.answer)}
                  </div>`
                : ''
            }
          </article>`
          )
          .join('')
      : '';

  const extraLinesHtml =
    payload?.extraLines && payload.extraLines.length > 0
      ? `<section style="margin-top: 1.5rem; padding: 1rem; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px;">
          <h2 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 0.5rem;">Additional Notes</h2>
          ${payload.extraLines.map((l) => `<p style="margin: 0.3rem 0; color: #334155;">${escapeHtmlValue(l)}</p>`).join('')}
        </section>`
      : '';

  const ssrBody = `
    <main style="max-width: 1100px; margin: 2rem auto; padding: 0 1rem; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; line-height: 1.6;">
      <nav aria-label="Breadcrumb" style="font-size: 0.85rem; margin-bottom: 1.25rem;">
        <a href="/" style="color: #1d4ed8; text-decoration: none; font-weight: 600;">Library</a> &rsaquo;
        <a href="/midterm-prep" style="color: #1d4ed8; text-decoration: none; font-weight: 600;">Midterm Prep 2026</a> &rsaquo;
        <a href="/courses/${escapeHtmlValue(entry.courseCode.toLowerCase())}" style="color: #1d4ed8; text-decoration: none; font-weight: 600;">${escapeHtmlValue(entry.courseCode)}</a> &rsaquo;
        <span style="color: #64748b; font-weight: 600;">${escapeHtmlValue(entry.filename)}</span>
      </nav>

      <header style="margin-bottom: 1.75rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 1.25rem;">
        <div style="font-family: monospace; font-size: 0.8rem; font-weight: 700; color: #1d4ed8; text-transform: uppercase; margin-bottom: 0.45rem;">
          ${escapeHtmlValue(entry.courseCode)} · MIDTERM PREP 2026 · ${totalItems} ${isMcq ? 'SOLVED MCQS' : 'SOLVED QUESTIONS'} · ${pageCount} PAGES
        </div>
        <h1 style="font-size: 2rem; font-weight: 900; line-height: 1.2; margin: 0 0 0.6rem 0; color: #0f172a;">
          ${escapeHtmlValue(payload?.headerTitle || `${entry.courseCode} — ${courseTitle}`)} · ${escapeHtmlValue(payload?.subtitle || (isMcq ? 'Midterm Important MCQs' : 'Midterm Important Subjective Questions (Solved)'))}
        </h1>
        <p style="font-size: 1rem; color: #475569; margin: 0 0 1rem 0;">${escapeHtmlValue(desc)}</p>
        <div style="display: flex; flex-wrap: wrap; gap: 0.65rem;">
          <a href="/api/midterm-pdf/${encodeURIComponent(entry.filename)}" style="display: inline-block; padding: 0.55rem 1rem; background: #1d4ed8; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 0.88rem;">Download Original PDF</a>
          ${
            sibling
              ? `<a href="/midterm-prep/${escapeHtmlValue(sibling.filename)}" style="display: inline-block; padding: 0.55rem 1rem; background: #fffbeb; color: #92400e; border: 1px solid #fde68a; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 0.88rem;">Switch to ${sibling.kind === 'mcqs' ? 'Important MCQs' : 'Solved Subjective'} (${sibling.itemCount})</a>`
              : ''
          }
          <a href="/courses/${escapeHtmlValue(entry.courseCode.toLowerCase())}" style="display: inline-block; padding: 0.55rem 1rem; background: #ffffff; color: #1d4ed8; border: 1px solid #cbd5e1; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 0.88rem;">All ${escapeHtmlValue(entry.courseCode)} Materials</a>
        </div>
      </header>

      <section style="margin-bottom: 1.75rem; padding: 1rem 1.25rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;">
        <h2 style="font-size: 1.1rem; font-weight: 800; margin: 0 0 0.5rem 0;">Syllabus Topics Covered (${topics.length})</h2>
        <ul style="margin: 0; padding-left: 1.2rem; columns: 2; color: #334155; font-size: 0.9rem;">
          ${topics.map((tp) => `<li style="margin-bottom: 0.25rem;">${escapeHtmlValue(tp)}</li>`).join('')}
        </ul>
      </section>

      <section>
        <h2 style="font-size: 1.35rem; font-weight: 800; margin-bottom: 1rem;">
          Complete ${escapeHtmlValue(entry.courseCode)} Midterm ${isMcq ? 'MCQ Bank with Verified Answers' : 'Subjective Question &amp; Answer Transcript'} (${totalItems} Items)
        </h2>
        ${isMcq ? mcqsHtml : subjectiveHtml}
        ${extraLinesHtml}
      </section>

      ${
        neighbors.length > 0
          ? `<section style="margin-top: 2rem; padding-top: 1.25rem; border-top: 1px solid #e2e8f0;">
              <h2 style="font-size: 1.2rem; font-weight: 800; margin-bottom: 0.75rem;">Related Midterm Prep 2026 Packs</h2>
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 0.75rem;">
                ${neighbors
                  .map(
                    (n) => `<a href="/midterm-prep/${escapeHtmlValue(n.filename)}" style="display: block; padding: 0.8rem; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; text-decoration: none; color: #1d4ed8; font-weight: 700; font-size: 0.88rem;">${escapeHtmlValue(n.filename)} <span style="display: block; color: #64748b; font-size: 0.76rem; font-weight: 500;">${escapeHtmlValue(n.courseTitle)} · ${n.itemCount} Qs</span></a>`
                  )
                  .join('')}
              </div>
            </section>`
          : ''
      }
    </main>
  `;

  out = out.replace(
    /<div id="root">[\s\S]*?(?=\s*(?:<!-- Client-side SPA|<script type="module"))/i,
    `<div id="root">${ssrBody}</div>\n    `
  );
  return normalizeAssetUrls(out);
}

const app = express();
const PORT = 3000;

app.use(express.json());

// Dedicated Case-Insensitive Sitemap & Robots.txt Handler (Guarantees Google Search Console 100% Success for /sitemap.xml, /Sitemap.xml, /sitemap-docs.xml, etc.)
app.get(/^\/(sitemap.*|robots\.txt)$/i, (req: Request, res: Response, next) => {
  const cleanPath = req.path.toLowerCase().replace(/\/+$/, '');
  const isProd = process.env.NODE_ENV === 'production';
  const baseDir = isProd && fs.existsSync(path.resolve('dist')) ? path.resolve('dist') : path.resolve('public');

  if (cleanPath === '/robots.txt') {
    const file = path.join(baseDir, 'robots.txt');
    if (fs.existsSync(file)) {
      return res.status(200).type('text/plain; charset=utf-8').sendFile(file);
    }
  }

  if (cleanPath === '/sitemap.xml' || cleanPath === '/sitemap_index.xml') {
    const file = path.join(baseDir, 'sitemap.xml');
    if (fs.existsSync(file)) {
      return res.status(200).type('application/xml; charset=utf-8').sendFile(file);
    }
  }

  if (cleanPath === '/sitemap-main.xml' || cleanPath === '/sitemap_main.xml') {
    const file = path.join(baseDir, 'sitemap-main.xml');
    if (fs.existsSync(file)) {
      return res.status(200).type('application/xml; charset=utf-8').sendFile(file);
    }
  }

  if (cleanPath === '/sitemap-docs.xml' || cleanPath === '/sitemap_docs.xml') {
    const file = path.join(baseDir, 'sitemap-docs.xml');
    if (fs.existsSync(file)) {
      return res.status(200).type('application/xml; charset=utf-8').sendFile(file);
    }
  }

  if (cleanPath === '/sitemap-midterm.xml' || cleanPath === '/sitemap_midterm.xml') {
    const file = path.join(baseDir, 'sitemap-midterm.xml');
    if (fs.existsSync(file)) {
      return res.status(200).type('application/xml; charset=utf-8').sendFile(file);
    }
    const entries = getAllMidtermPrepEntries();
    const today = new Date().toISOString().split('T')[0];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://study.mihora.tech/midterm-prep</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.95</priority>
  </url>
${entries
  .map(
    (entry) => `  <url>
    <loc>https://study.mihora.tech/midterm-prep/${escapeHtmlValue(entry.filename)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;
    return res.status(200).type('application/xml; charset=utf-8').send(xml);
  }

  return next();
});

// Server Secrets
const DOWNLOAD_TOKEN_SECRET = process.env.DOWNLOAD_TOKEN_SECRET || 'mihora-download-token-dev-secret-key-2026';
const RESOURCE_MAP_PATH = path.resolve('.secrets/server-resource-map.json');

// In-memory nonce tracking for single-use download tokens
const usedNonces = new Set<string>();
const ipRequestCounts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string, limit = 100, windowMs = 60000): boolean {
  const now = Date.now();
  if (ipRequestCounts.size > 5000) {
    for (const [k, v] of ipRequestCounts.entries()) {
      if (now > v.resetAt) ipRequestCounts.delete(k);
    }
  }
  const entry = ipRequestCounts.get(ip);
  if (!entry || now > entry.resetAt) {
    ipRequestCounts.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

// Extraction helper for raw index line parsing
function parseRawLineToRecord(line: string): { rlh: string; driveId: string; safeName: string; format: string; course: string; link: string } | null {
  if (line.startsWith('- ')) line = line.slice(2).trim();
  const m = line.match(/^COURSE=([^\s]+)\s+NAME=(.+?)\s+FORMAT=([^\s]+)\s+TYPE=([^\s]+)\s+TAGS=([^\s]+)\s+LINK=([^\s]+)$/);
  if (!m) return null;
  const course = m[1].toUpperCase();
  if (course.startsWith('<')) return null;
  const safeName = m[2].trim();
  const format = m[3].toUpperCase();
  const link = m[6].trim();
  const fileDMatch = link.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  const driveId = fileDMatch ? fileDMatch[1] : '';
  if (!driveId) return null;

  const hmac = crypto.createHmac('sha256', process.env.RLH_MASTER_SECRET || 'mihora-rlh-secret-salt-2026-secure-key');
  hmac.update(`mihora_res:${driveId}`);
  const rlh = `r_${hmac.digest('hex').substring(0, 16)}`;

  return { rlh, driveId, safeName, format, course, link };
}

// Load server-side resource mapping with auto-recovery
let serverResourceMap: Record<string, { rlh: string; driveId: string; safeName: string; format: string; course: string; link?: string }> = {};

function initServerResourceMap() {
  if (fs.existsSync(RESOURCE_MAP_PATH)) {
    try {
      serverResourceMap = JSON.parse(fs.readFileSync(RESOURCE_MAP_PATH, 'utf-8'));
      if (Object.keys(serverResourceMap).length > 0) return;
    } catch (err) {
      console.error('Failed to load server resource map from cache:', err);
    }
  }

  // Resilient fallback: parse canonical source if cached file is missing.
  // The canonical index lives in gitignored private-input/ (it contains raw
  // Drive links and must NOT be committed to the public repo). The repo-root
  // path is kept only as a last fallback for older local checkouts that
  // still have the file there; it is inert once the file is deleted from
  // the repo because fs.existsSync() is false. First candidate with >0
  // parsed records wins, mirroring scripts/import-index.ts.
  const masterCandidates = [
    path.resolve('private-input/VU_Mega_Index_Bot.md'),
    path.resolve('private-input/VU_Mega_Index_Bot.txt'),
    path.resolve('VU_Mega_Index_Bot.md'),
    path.resolve('VU_Mega_Index_Bot.txt')
  ];
  for (const masterPath of masterCandidates) {
    if (!fs.existsSync(masterPath)) continue;
    console.log('🔄 Building server resource mapping from canonical source:', masterPath);
    try {
      const content = fs.readFileSync(masterPath, 'utf-8');
      const lines = content.split(/\r?\n/);
      for (const line of lines) {
        if (!line.includes('COURSE=') || !line.includes('NAME=') || !line.includes('LINK=')) continue;
        const rec = parseRawLineToRecord(line);
        if (rec) serverResourceMap[rec.rlh] = rec;
      }
      if (Object.keys(serverResourceMap).length === 0) continue;
      console.log(`✅ Loaded ${Object.keys(serverResourceMap).length} verified records into server memory.`);
      // Cache to disk
      const dir = path.dirname(RESOURCE_MAP_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(RESOURCE_MAP_PATH, JSON.stringify(serverResourceMap), 'utf-8');
      break;
    } catch (parseErr) {
      console.error('Failed to parse canonical index:', parseErr);
    }
  }
}

initServerResourceMap();

// Private server-side Midterm PDF map (664 files, Drive IDs never exposed to client bundle)
const MIDTERM_MAP_PATH = path.resolve('.secrets/midterm-server-map.json');
const MIDTERM_LINKS_RAW_PATH = path.resolve('.secrets/midterm-drive-links.txt');
let midtermServerMap: Record<
  string,
  { filename: string; driveId: string; courseCode: string; kind: 'mcqs' | 'subjective' }
> = {};

function initMidtermServerMap() {
  if (fs.existsSync(MIDTERM_MAP_PATH)) {
    try {
      midtermServerMap = JSON.parse(fs.readFileSync(MIDTERM_MAP_PATH, 'utf-8'));
      if (Object.keys(midtermServerMap).length > 0) return;
    } catch (err) {
      console.error('Failed to load midterm server map:', err);
    }
  }
  if (fs.existsSync(MIDTERM_LINKS_RAW_PATH)) {
    try {
      const lines = fs.readFileSync(MIDTERM_LINKS_RAW_PATH, 'utf-8').split(/\r?\n/);
      for (let i = 0; i < lines.length; i++) {
        const m = lines[i].match(/^\s*\d+\.\s+(.+\.pdf)\s*$/i);
        if (m && i + 1 < lines.length) {
          const lm = lines[i + 1].match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
          if (lm) {
            const filename = m[1].trim();
            const courseMatch = filename.match(/^([A-Z0-9]+)-/i);
            midtermServerMap[filename.toLowerCase()] = {
              filename,
              driveId: lm[1],
              courseCode: courseMatch ? courseMatch[1].toUpperCase() : 'VU',
              kind: /subjective/i.test(filename) ? 'subjective' : 'mcqs'
            };
          }
        }
      }
    } catch (err) {
      console.error('Failed to parse fallback midterm links:', err);
    }
  }
}

initMidtermServerMap();

// Safe filename sanitizer against path traversal, header injection & CRLF
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[\r\n\0]/g, '')
    .replace(/[/\\]/g, '_')
    .replace(/["']/g, '')
    .replace(/\.\.+/g, '.')
    .trim() || 'study-resource';
}

// HMAC Token Generator
function generateDownloadToken(payloadStr: string): string {
  const sig = crypto.createHmac('sha256', DOWNLOAD_TOKEN_SECRET).update(payloadStr).digest('hex').substring(0, 32);
  const encodedPayload = Buffer.from(payloadStr).toString('base64url');
  return `dt_${encodedPayload}.${sig}`;
}

// Timing-Safe HMAC Token Verifier
function verifyDownloadToken(token: string): { valid: boolean; payload?: string; reason?: string } {
  if (!token || typeof token !== 'string' || !token.startsWith('dt_')) {
    return { valid: false, reason: 'Invalid token prefix' };
  }
  const parts = token.slice(3).split('.');
  if (parts.length !== 2) return { valid: false, reason: 'Malformed token structure' };

  const [encodedPayload, clientSig] = parts;
  if (!encodedPayload || !clientSig || clientSig.length !== 32) {
    return { valid: false, reason: 'Malformed signature format' };
  }

  let payloadStr = '';
  try {
    payloadStr = Buffer.from(encodedPayload, 'base64url').toString('utf-8');
  } catch {
    return { valid: false, reason: 'Malformed payload encoding' };
  }

  const expectedSig = crypto.createHmac('sha256', DOWNLOAD_TOKEN_SECRET).update(payloadStr).digest('hex').substring(0, 32);

  const clientSigBuf = Buffer.from(clientSig, 'hex');
  const expectedSigBuf = Buffer.from(expectedSig, 'hex');

  if (clientSigBuf.length !== expectedSigBuf.length || !crypto.timingSafeEqual(clientSigBuf, expectedSigBuf)) {
    return { valid: false, reason: 'Cryptographic signature mismatch' };
  }

  return { valid: true, payload: payloadStr };
}

// Rate limit & security header middleware
app.use((req, res, next) => {
  const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please slow down.' });
  }

  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  next();
});

// Reject arbitrary proxy parameters globally (Anti-SSRF & Anti-Proxy abuse)
app.use((req, res, next) => {
  if (req.query.url || req.query.driveId || req.query.fileId || req.query.drive || req.body?.url || req.body?.driveId) {
    return res.status(400).json({ error: 'Invalid parameter. Arbitrary queries are forbidden.' });
  }
  next();
});

// Relay Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'mihora-study-relay-proxy',
    environment: 'production-ready',
    activeSessions: usedNonces.size,
    indexedRecords: Object.keys(serverResourceMap).length
  });
});

// 1. Stage 1: Resolve RLH to short-lived signed token (POST /api/resolve)
app.post('/api/resolve', (req: Request, res: Response) => {
  const { rlh } = req.body || {};

  // Strict anti-enumeration validation: exact r_[16 hex chars]
  if (!rlh || typeof rlh !== 'string' || !/^r_[a-f0-9]{16}$/i.test(rlh)) {
    return res.status(400).json({ error: 'Resource locator format is invalid.' });
  }

  const resource = serverResourceMap[rlh];
  if (!resource) {
    // Zero-fabrication: Never invent fake tokens for non-existent resources
    return res.status(404).json({ error: 'Resource not found in library index.' });
  }

  const now = Math.floor(Date.now() / 1000);
  const expiresIn = 120;
  const exp = now + expiresIn;
  const nonce = crypto.randomBytes(8).toString('hex');
  const payload = `${rlh}:${now}:${exp}:${nonce}:single`;
  const token = generateDownloadToken(payload);

  return res.json({
    ok: true,
    token,
    expiresIn,
    downloadUrl: `/api/download?token=${encodeURIComponent(token)}`,
    resource: {
      name: resource.safeName,
      format: resource.format,
      course: resource.course
    }
  });
});

// Real Google Drive streaming helper (zero dummy documents)
async function fetchDriveStream(driveId: string): Promise<{ ok: boolean; stream?: ReadableStream<Uint8Array>; contentType?: string; contentLength?: string | null }> {
  const directUrl = `https://drive.usercontent.google.com/download?id=${encodeURIComponent(driveId)}&export=download&confirm=t`;
  const ucUrl = `https://drive.google.com/uc?export=download&id=${encodeURIComponent(driveId)}&confirm=t`;

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': '*/*'
  };

  try {
    let driveRes = await fetch(directUrl, { headers, redirect: 'follow' });
    if (!driveRes.ok || !driveRes.body) {
      driveRes = await fetch(ucUrl, { headers, redirect: 'follow' });
    }
    if (driveRes.ok && driveRes.body) {
      return {
        ok: true,
        stream: driveRes.body,
        contentType: driveRes.headers.get('content-type') || undefined,
        contentLength: driveRes.headers.get('content-length')
      };
    }
  } catch (err) {
    console.error(`Failed to fetch Drive ID ${driveId}:`, err);
  }
  return { ok: false };
}

// 1b. Direct Midterm Prep 2026 PDF Streaming Proxy (GET /api/midterm-pdf/:filename)
app.get('/api/midterm-pdf/:filename', async (req: Request, res: Response) => {
  const rawName = (req.params.filename || '').trim().toLowerCase();
  const lookupKey = rawName.endsWith('.pdf') ? rawName : `${rawName}.pdf`;
  const record = midtermServerMap[lookupKey];
  if (!record || !record.driveId) {
    return res.status(404).send('Midterm PDF file not found in library index.');
  }

  try {
    const driveResult = await fetchDriveStream(record.driveId);
    if (driveResult.ok && driveResult.stream) {
      const safeName = sanitizeFilename(record.filename);
      const isDownload = req.query.download === '1';
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `${isDownload ? 'attachment' : 'inline'}; filename="${encodeURIComponent(safeName)}"`
      );
      res.setHeader('Cache-Control', 'public, max-age=604800');
      if (driveResult.contentLength) {
        res.setHeader('Content-Length', driveResult.contentLength);
      }
      Readable.fromWeb(driveResult.stream as any).pipe(res);
      return;
    }
  } catch (err) {
    console.error('Midterm PDF proxy error:', err);
  }

  return res.status(502).send('Unable to stream midterm PDF right now. Please try again shortly.');
});

// 2. Stage 2: Stream File via Token (GET /api/download)
app.get('/api/download', async (req: Request, res: Response) => {
  const token = req.query.token as string;
  if (!token) {
    return res.status(400).send('Missing download session token.');
  }

  const verification = verifyDownloadToken(token);
  if (!verification.valid || !verification.payload) {
    return res.status(403).send(`Unauthorized: ${verification.reason || 'Invalid download session'}`);
  }

  const [rlh, iatStr, expStr, nonce] = verification.payload.split(':');
  const now = Math.floor(Date.now() / 1000);
  const exp = parseInt(expStr, 10);

  if (now > exp) {
    return res.status(410).send('Download session expired. Please return to the library and click download again.');
  }

  if (usedNonces.has(nonce)) {
    return res.status(409).send('This download token has already been consumed. One-time link expired.');
  }
  usedNonces.add(nonce);
  if (usedNonces.size > 20000) usedNonces.clear();

  const record = serverResourceMap[rlh];
  if (!record || !record.driveId) {
    return res.status(404).send('Resource file not found in library index.');
  }

  const safeName = record.safeName || `Mihora_Resource_${rlh}.pdf`;
  const format = (record.format || 'PDF').toLowerCase();

  let contentType = 'application/pdf';
  if (format === 'doc' || format === 'docx' || safeName.endsWith('.docx') || safeName.endsWith('.doc')) {
    contentType = safeName.endsWith('.docx')
      ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      : 'application/msword';
  } else if (format === 'ppt' || format === 'pptx' || safeName.endsWith('.pptx') || safeName.endsWith('.ppt')) {
    contentType = safeName.endsWith('.pptx')
      ? 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      : 'application/vnd.ms-powerpoint';
  } else if (format === 'archive' || format === 'zip' || safeName.endsWith('.zip')) {
    contentType = 'application/zip';
  } else if (format === 'image' || safeName.match(/\.(png|jpe?g|gif|webp)$/i)) {
    const ext = safeName.split('.').pop()?.toLowerCase();
    contentType = ext === 'png' ? 'image/png' : 'image/jpeg';
  } else if (format === 'xls' || safeName.match(/\.xlsx?$/i)) {
    contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  } else if (format === 'txt' || safeName.endsWith('.txt')) {
    contentType = 'text/plain; charset=utf-8';
  }

  // Stream actual real file from Google Drive via direct proxy
  try {
    const isInline = req.query.inline === '1' || req.query.preview === '1';
    const driveResult = await fetchDriveStream(record.driveId);
    if (driveResult.ok && driveResult.stream) {
      res.setHeader('Content-Type', driveResult.contentType || contentType);
      res.setHeader('Content-Disposition', `${isInline ? 'inline' : 'attachment'}; filename="${encodeURIComponent(safeName)}"`);
      res.setHeader('Cache-Control', 'private, no-store');
      if (driveResult.contentLength) {
        res.setHeader('Content-Length', driveResult.contentLength);
      }
      Readable.fromWeb(driveResult.stream as any).pipe(res);
      return;
    }
  } catch (streamErr) {
    console.error('Streaming error from Google Drive:', streamErr);
  }

  return res.status(502).send('Unable to retrieve file from source storage. Please try again shortly.');
});

// 3. Multi-Download Resolution (POST /api/resolve-multi)
app.post('/api/resolve-multi', (req: Request, res: Response) => {
  const { rlhs, zipName } = req.body || {};

  if (!Array.isArray(rlhs) || rlhs.length === 0 || rlhs.length > 50) {
    return res.status(400).json({ error: 'Please select between 1 and 50 resources for ZIP generation.' });
  }

  // Validate all RLHs
  for (const rlh of rlhs) {
    if (typeof rlh !== 'string' || !rlh.startsWith('r_')) {
      return res.status(400).json({ error: 'One or more resource locators are invalid.' });
    }
  }

  const now = Math.floor(Date.now() / 1000);
  const expiresIn = 180; // 3 minutes for multi-download
  const exp = now + expiresIn;
  const nonce = crypto.randomBytes(8).toString('hex');
  const payload = `${rlhs.join(',')}:${now}:${exp}:${nonce}:multi:${zipName || 'Mihora_Resources'}`;
  const token = generateDownloadToken(payload);

  return res.json({
    ok: true,
    token,
    expiresIn,
    count: rlhs.length,
    downloadUrl: `/api/download-multi?token=${encodeURIComponent(token)}`
  });
});

// 4. Multi-Download Stream ZIP (GET /api/download-multi)
app.get('/api/download-multi', async (req: Request, res: Response) => {
  const token = req.query.token as string;
  if (!token) return res.status(400).send('Missing multi-download token.');

  const verification = verifyDownloadToken(token);
  if (!verification.valid || !verification.payload) {
    return res.status(403).send('Unauthorized token.');
  }

  const [rlhsStr, iatStr, expStr, nonce, mode, zipLabel] = verification.payload.split(':');
  const now = Math.floor(Date.now() / 1000);
  if (now > parseInt(expStr, 10)) {
    return res.status(410).send('Multi-download session expired.');
  }

  if (usedNonces.has(nonce)) {
    return res.status(409).send('Multi-download token already consumed.');
  }
  usedNonces.add(nonce);

  const rlhs = rlhsStr.split(',');
  const zip = new JSZip();

  for (let i = 0; i < rlhs.length; i++) {
    const rlh = rlhs[i];
    const record = serverResourceMap[rlh];
    if (!record || !record.driveId) continue;
    const safeName = record.safeName || `Resource_${i + 1}_${rlh}.pdf`;

    try {
      const driveRes = await fetch(`https://drive.usercontent.google.com/download?id=${encodeURIComponent(record.driveId)}&export=download&confirm=t`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        },
        redirect: 'follow'
      });
      if (driveRes.ok) {
        const arrayBuf = await driveRes.arrayBuffer();
        zip.file(safeName, Buffer.from(arrayBuf));
      }
    } catch (err) {
      console.warn(`Failed to fetch file for zip: ${safeName}`, err);
    }
  }

  const safeZipName = `${zipLabel || 'Mihora_Selected_Resources'}.zip`;
  const zipContent = await zip.generateAsync({ type: 'nodebuffer' });

  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(safeZipName)}"`);
  res.setHeader('Cache-Control', 'private, no-store');
  res.send(zipContent);
});

// Vite Middleware & Production Routing Integration
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const distPath = path.resolve('dist');

  // Fast Gzip & Deflate Compression for all text, HTML, and XML sitemaps
  app.use(compression());

  if (isProd && fs.existsSync(distPath)) {
    console.log('📦 Serving production pre-rendered assets from dist/');
    app.use(express.static(distPath));

    app.get(/^\/doc\/(.+)/i, (req: Request, res: Response) => {
      const cleanSlug = extractDocSlugFromPath(req.path) || req.path.toLowerCase();
      const cached = docSsrCache.get(cleanSlug);
      if (cached && Date.now() - cached.timestamp < SSR_CACHE_TTL_MS) {
        res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400');
        res.setHeader('Vary', 'Accept-Encoding');
        return res.status(200).set({ 'Content-Type': 'text/html; charset=utf-8' }).send(cached.html);
      }

      if (!cachedDistTemplate) {
        const templatePath = path.join(distPath, 'index.html');
        cachedDistTemplate = fs.readFileSync(templatePath, 'utf-8');
      }
      const rendered = injectDocumentSsrSeo(cachedDistTemplate, req.path);
      docSsrCache.set(cleanSlug, { html: rendered, timestamp: Date.now() });

      res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400');
      res.setHeader('Vary', 'Accept-Encoding');
      return res.status(200).set({ 'Content-Type': 'text/html; charset=utf-8' }).send(rendered);
    });

    app.get(/^\/midterm-prep(?:-2026)?(?:\/(.*))?$/i, (req: Request, res: Response) => {
      const cleanPath = req.path.toLowerCase().replace(/\/+$/, '') || '/midterm-prep';
      const cached = midtermSsrCache.get(cleanPath);
      if (cached && Date.now() - cached.timestamp < SSR_CACHE_TTL_MS) {
        res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400');
        res.setHeader('Vary', 'Accept-Encoding');
        return res.status(200).set({ 'Content-Type': 'text/html; charset=utf-8' }).send(cached.html);
      }

      if (!cachedDistTemplate) {
        const templatePath = path.join(distPath, 'index.html');
        cachedDistTemplate = fs.readFileSync(templatePath, 'utf-8');
      }
      const rendered = /^\/midterm-prep(?:-2026)?\/?$/i.test(req.path)
        ? injectMidtermHubSsrSeo(cachedDistTemplate)
        : injectMidtermDocSsrSeo(cachedDistTemplate, req.path, true);
      midtermSsrCache.set(cleanPath, { html: rendered, timestamp: Date.now() });

      res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400');
      res.setHeader('Vary', 'Accept-Encoding');
      return res.status(200).set({ 'Content-Type': 'text/html; charset=utf-8' }).send(rendered);
    });

    app.get('*', (req: Request, res: Response) => {
      const cleanPath = req.path.replace(/^\/|\/$/g, '');
      const specificFile = path.join(distPath, cleanPath, 'index.html');
      if (cleanPath && fs.existsSync(specificFile)) {
        return res.sendFile(specificFile);
      }
      return res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    app.get(/^\/doc\/(.+)/i, async (req: Request, res: Response, next) => {
      try {
        const cleanSlug = extractDocSlugFromPath(req.path) || req.path.toLowerCase();
        const cached = docSsrCache.get(cleanSlug);
        if (cached && Date.now() - cached.timestamp < SSR_CACHE_TTL_MS) {
          res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400');
          res.setHeader('Vary', 'Accept-Encoding');
          return res.status(200).set({ 'Content-Type': 'text/html; charset=utf-8' }).end(cached.html);
        }

        if (!cachedDevTemplate) {
          const indexPath = path.resolve('index.html');
          cachedDevTemplate = fs.readFileSync(indexPath, 'utf-8');
        }
        const template = await vite.transformIndexHtml(req.originalUrl, cachedDevTemplate);
        const rendered = injectDocumentSsrSeo(template, req.path);
        docSsrCache.set(cleanSlug, { html: rendered, timestamp: Date.now() });

        res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400');
        res.setHeader('Vary', 'Accept-Encoding');
        return res.status(200).set({ 'Content-Type': 'text/html; charset=utf-8' }).end(rendered);
      } catch (e) {
        return next(e);
      }
    });

    app.get(/^\/midterm-prep(?:-2026)?(?:\/(.*))?$/i, async (req: Request, res: Response, next) => {
      try {
        const cleanPath = req.path.toLowerCase().replace(/\/+$/, '') || '/midterm-prep';
        const cached = midtermSsrCache.get(cleanPath);
        if (cached && Date.now() - cached.timestamp < SSR_CACHE_TTL_MS) {
          res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400');
          res.setHeader('Vary', 'Accept-Encoding');
          return res.status(200).set({ 'Content-Type': 'text/html; charset=utf-8' }).end(cached.html);
        }

        if (!cachedDevTemplate) {
          const indexPath = path.resolve('index.html');
          cachedDevTemplate = fs.readFileSync(indexPath, 'utf-8');
        }
        const template = await vite.transformIndexHtml(req.originalUrl, cachedDevTemplate);
        const rendered = /^\/midterm-prep(?:-2026)?\/?$/i.test(req.path)
          ? injectMidtermHubSsrSeo(template)
          : injectMidtermDocSsrSeo(template, req.path, false);
        midtermSsrCache.set(cleanPath, { html: rendered, timestamp: Date.now() });

        res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400');
        res.setHeader('Vary', 'Accept-Encoding');
        return res.status(200).set({ 'Content-Type': 'text/html; charset=utf-8' }).end(rendered);
      } catch (e) {
        return next(e);
      }
    });

    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌐 MIHORA STUDY LIBRARY server running at http://0.0.0.0:${PORT}`);
    console.log(`🔒 Secure relay endpoints mounted on /api/resolve and /api/download`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
