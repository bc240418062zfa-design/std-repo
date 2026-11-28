// Phantom /doc redirects — single source of truth for both the
// build-time prerender (scripts/prerender-routes.ts) and the SPA
// client-side fallback (src/pages/DocumentViewerPage.tsx).
//
// These slugs are URLs Google remembers that have NO matching file in the
// 28,328-document archive (0 occurrences in public/sitemap-docs.xml), so
// they can never be fixed by prerendering a real page. They redirect to
// the closest genuine page instead:
//   - the two Moaaz midterm slugs point at Moaaz files for the same
//     course (same author, same course, midterm material),
//   - the WAEC slug has no match anywhere in the archive ("waec" occurs
//     0 times), so it points at the topical past-papers hub.
//
// NEVER add these slugs to public/sitemap-docs.xml — redirects are not
// content. A redirect must never shadow a real page: the prerender
// fails loudly if a from-slug ever collides with a real doc page.
export const DOC_REDIRECTS: Readonly<Record<string, string>> = {
  'cs101-midterm-solved-past-papers-by-moaaz': '/doc/cs101-midterm-subjective-by-moaaz-pdf',
  'eng101-midterm-solved-past-papers-by-moaaz': '/doc/eng101-midterm-mcqs-solved-with-references-by-moaaz-pdf',
  'english-waec-past-questions-and-answers': '/past-papers'
};

export function getDocRedirectTarget(slug: string): string | null {
  if (!slug) return null;
  return DOC_REDIRECTS[slug.trim().toLowerCase()] ?? null;
}
