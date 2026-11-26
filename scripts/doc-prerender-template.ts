// Slim /doc/* prerender template (DESIGN §1).
//
// Doc pages do NOT go through the base-template clone loop in
// prerender-routes.ts: cloning the 191 KB homepage shell for 28,328 pages
// would be ~5.7 GB. This standalone template averages ~13.4 KB/page.
// It shares only three things with the existing pipeline:
//   1. escapeHtmlAttr() (same escaping rules as prerender-routes.ts),
//   2. the site-wide JSON-LD nodes (Organization + WebSite) extracted from
//      dist/index.html by the caller,
//   3. the hashed SPA asset URLs extracted from dist/index.html.
//
// Deliberate omissions: no Google Fonts, no meta keywords, no homepage
// catalog/hero. No Drive URL or Drive ID ever appears in the output
// (Phase 1 decision — scripts/audit-public.ts fails the build otherwise).
import { DocSlugEntry } from '../src/utils/docSlugBase';
import { cleanDocumentDisplayTitle } from '../src/utils/docSlugBase';
import { getRelatedDocEntries } from '../src/utils/docSlug';
import { enrichDocumentMetadata } from '../src/utils/docEnricher';
import {
  buildDocJsonLdGraph,
  buildDocMetaDescription,
  buildDocPageTitle,
  docTypeLabel
} from '../src/utils/docPageSeo';

export function escapeHtmlAttr(str: string): string {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export interface SpaAssetTags {
  js: string;
  css: string;
}

// Extract the hashed SPA asset URLs from the built dist/index.html.
// Throws (fails the build loudly) if either tag is missing — never ship
// doc pages whose preview/download bootstrap cannot load.
export function extractSpaAssetTags(baseHtml: string): SpaAssetTags {
  const jsMatch = baseHtml.match(/\/assets\/index-[^"'`\s]+\.js/);
  const cssMatch = baseHtml.match(/\/assets\/index-[^"'`\s]+\.css/);
  if (!jsMatch || !cssMatch) {
    throw new Error(
      'doc prerender: could not extract SPA asset tags (index JS/CSS) from dist/index.html — refusing to emit JS-less doc pages.'
    );
  }
  return { js: jsMatch[0], css: cssMatch[0] };
}

export interface SlimDocPageContext {
  siteWideJsonLdNodes: Array<Record<string, unknown>>;
  spaAssets: SpaAssetTags;
  docsByCourse: Map<string, DocSlugEntry[]>;
  includedSlugs: Set<string>;
}

const BASE_URL = 'https://study.mihora.tech';

// Minimal inline CSS (~700 B): system font stack, 800px column, link colour.
const SLIM_CSS =
  'body{margin:0;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#0f172a;background:#fff;line-height:1.6}' +
  'a{color:#1d4ed8}header{background:#0d1b2a;padding:.9rem 1rem}header nav{max-width:800px;margin:0 auto;display:flex;flex-wrap:wrap;gap:.4rem 1.2rem;align-items:center}' +
  'header a{color:#fff;text-decoration:none;font-weight:700;font-size:.9rem}header a:first-child{font-size:1rem}' +
  'main{max-width:800px;margin:0 auto;padding:1.5rem 1rem 3rem}h1{font-size:1.5rem;line-height:1.3;overflow-wrap:break-word}' +
  'h2{font-size:1.15rem;margin-top:2rem}h3{font-size:1rem;margin:.9rem 0 .2rem}p{margin:.6rem 0}' +
  'dl{display:grid;grid-template-columns:auto 1fr;gap:.3rem 1rem;font-size:.92rem}dt{color:#64748b}dd{margin:0}' +
  'ol,ul{padding-left:1.25rem}li{margin:.35rem 0}footer{border-top:1px solid #e2e8f0;padding:1rem;text-align:center;font-size:.85rem;color:#64748b}' +
  'nav.breadcrumb{max-width:800px;margin:0 auto;padding:.7rem 1rem 0;font-size:.85rem;color:#64748b}';

function truncateLinkText(text: string, max = 60): string {
  return text.length > max ? text.slice(0, max) : text;
}

// JSON for the <script type="application/json"> block: escape '<' so a
// filename can never break out of the script element.
function safeJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export function buildSlimDocPage(entry: DocSlugEntry, ctx: SlimDocPageContext): string {
  const { resource } = entry;
  const enriched = enrichDocumentMetadata(resource);
  const slug = entry.slug;
  const canonical = `${BASE_URL}/doc/${slug}`;
  const title = buildDocPageTitle(enriched);
  const description = buildDocMetaDescription(enriched);
  const code = enriched.courseCode;
  const courseLower = code.toLowerCase();

  // Prev/next within the same course, in resources.json order, filtered to
  // slugs already prerendered (current or earlier waves). A filtered-out
  // neighbour is omitted, never linked to a 404ing slug.
  const courseEntries = ctx.docsByCourse.get(code) || [];
  const idxInCourse = courseEntries.findIndex((e) => e.slug === slug);
  const prevEntry =
    idxInCourse > 0 && ctx.includedSlugs.has(courseEntries[idxInCourse - 1].slug)
      ? courseEntries[idxInCourse - 1]
      : null;
  const nextEntry =
    idxInCourse >= 0 &&
    idxInCourse < courseEntries.length - 1 &&
    ctx.includedSlugs.has(courseEntries[idxInCourse + 1].slug)
      ? courseEntries[idxInCourse + 1]
      : null;

  const relatedEntries = getRelatedDocEntries(resource, 8).filter((e) =>
    ctx.includedSlugs.has(e.slug)
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [...ctx.siteWideJsonLdNodes, ...buildDocJsonLdGraph(enriched, canonical)]
  };

  // Per-page pre-resolved resource record (§5.1): lets the viewer + SEO
  // sync use this file's data without the 4.1 MB catalog lookup. It
  // carries only the rlh hash (already public in the shipped catalog
  // chunk) — never a Drive ID or Drive URL.
  const dataBlock = safeJson({
    course: resource.course,
    name: resource.name,
    format: resource.format,
    type: resource.type,
    tags: resource.tags || [],
    rlh: resource.rlh,
    slug
  });

  const esc = escapeHtmlAttr;
  const typeLabel = docTypeLabel(enriched.type);

  const metaRows: string[] = [
    `<dt>Course</dt><dd><a href="/courses/${esc(courseLower)}">${esc(code)} – ${esc(enriched.courseTitle)}</a></dd>`,
    `<dt>Faculty</dt><dd>${esc(enriched.faculty)}</dd>`,
    `<dt>Format</dt><dd>${esc(enriched.format)}</dd>`,
    `<dt>Type</dt><dd>${esc(typeLabel)}</dd>`,
    `<dt>Coverage</dt><dd>${esc(enriched.termScope)}</dd>`
  ];
  if (enriched.contributor) {
    metaRows.push(`<dt>Compiled by</dt><dd>${esc(enriched.contributor)}</dd>`);
  }
  if (resource.tags && resource.tags.length > 0) {
    metaRows.push(`<dt>Tags</dt><dd>${esc(resource.tags.join(', '))}</dd>`);
  }

  const modulesHtml = enriched.curriculumModules
    .map(
      (m) =>
        `<li><strong>${esc(m.title)}</strong> — ${esc(m.lectureSpan)} (${esc(m.pageRange)}). ${esc(m.examWeightage)}</li>`
    )
    .join('');

  const faqsHtml = enriched.faqs
    .slice(0, 4)
    .map((f) => `<h3>${esc(f.question)}</h3><p>${esc(f.answer)}</p>`)
    .join('');

  const prevNextHtml = `<nav>${prevEntry ? `<a href="/doc/${esc(prevEntry.slug)}">&larr; ${esc(truncateLinkText(cleanDocumentDisplayTitle(prevEntry.resource.name)))}</a>` : ''}${prevEntry && nextEntry ? ' · ' : ''}${nextEntry ? `<a href="/doc/${esc(nextEntry.slug)}">${esc(truncateLinkText(cleanDocumentDisplayTitle(nextEntry.resource.name)))} &rarr;</a>` : ''}</nav>`;

  const relatedHtml =
    relatedEntries.length > 0
      ? `<section><h2>More ${esc(code)} files</h2><ul>${relatedEntries
          .map(
            (e) =>
              `<li><a href="/doc/${esc(e.slug)}">${esc(truncateLinkText(cleanDocumentDisplayTitle(e.resource.name)))}</a> (${esc(e.resource.format)} · ${esc(docTypeLabel(e.resource.type))})</li>`
          )
          .join('')}</ul>`
      : '';

  return `<!doctype html>
<html lang="en-PK">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
<link rel="canonical" href="${esc(canonical)}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="MIHORA VU STUDY LIBRARY">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${BASE_URL}/og-cover.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="theme-color" content="#001738">
<style>${SLIM_CSS}</style>
<link rel="stylesheet" crossorigin href="${esc(ctx.spaAssets.css)}">
<script type="application/ld+json">${safeJson(jsonLd)}</script>
<script type="application/json" id="mihora-doc-data">${dataBlock}</script>
</head>
<body>
<div id="root">
<header><nav><a href="/">MIHORA VU STUDY LIBRARY</a><a href="/courses">Courses</a><a href="/midterm-prep">Midterm Prep 2026</a><a href="/past-papers">Past Papers</a></nav></header>
<nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a> › <a href="/courses">Courses</a> › <a href="/courses/${esc(courseLower)}">${esc(code)}</a> › ${esc(enriched.displayName)}</nav>
<main>
<h1>${esc(enriched.displayName)}</h1>
<p>${esc(enriched.overviewSummary)}</p>
<dl>${metaRows.join('')}</dl>
<p><em>${esc(enriched.examTips)}</em></p>
<section><h2>What this file covers — ${esc(code)} syllabus roadmap</h2><ol>${modulesHtml}</ol></section>
<section><h2>Frequently asked questions</h2>${faqsHtml}</section>
${prevNextHtml}
${relatedHtml}
<p><a href="/courses/${esc(courseLower)}">All ${esc(code)} files</a> · <a href="/midterm-prep">Midterm Prep 2026</a> · <a href="/vu-mcqs-bank">MCQs Bank</a></p>
</main>
<footer><p>© MIHORA TECH · <a href="/about">About</a> · <a href="/disclaimer">Disclaimer</a> · <a href="/security">Privacy</a></p></footer>
</div>
<script type="module" crossorigin src="${esc(ctx.spaAssets.js)}"></script>
</body>
</html>
`;
}
