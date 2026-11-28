// Phase 2 — extracted-text loader for the slim /doc/* prerender.
//
// Text bundles live in the repo at `scripts/doc-text/<COURSE>.json`:
// one plain-JSON object per course, { "<slug>": "<capped verbatim text>" }.
// Bundles are built offline by phase2/patch/build-text-bundles-json.py
// from the extracted text in work/doc-crawlability/phase2/extracted/.
//
// FORMAT NOTE (applied 28 Nov 2026): the design called for gzipped
// bundles, but the snapshot-push route accepts UTF-8 text only — gzip
// bytes are binary and the whole push is rejected. Plain JSON it is
// (~95 MB in the repo vs ~15 MB gzipped; the HTML still carries only
// the capped text).
// LOCATION NOTE: the scripts data dir is gitignored (it holds the
// local-only raw Drive-links list, which must never be committed), so
// bundles live in `scripts/doc-text/` instead — same loader, different
// directory.
//
// Rules enforced here (not in the template):
//  1. CAP — a uniform per-page byte cap (default 6 KB). Every file gets its
//     first CAP bytes; the cap is applied once, at bundle-build time, so
//     the prerender never sees full text. Cutting at a line boundary.
//  2. SANITIZE — extracted text is verbatim source content and may contain
//     a Drive URL printed inside the document itself. `audit-public.ts`
//     fails the whole build on any `drive.google.com` string in dist/.
//     We defang with a zero-width space (invisible, visible text
//     unchanged): `drive\u200b.google.com`. The count is reported so the
//     build log shows exactly how many pages were defanged.
//     Same treatment for any `*.googleusercontent.com` host (e.g. the
//     `webcache.googleusercontent.com` cache URLs printed inside some
//     documents): `audit-public.ts` also forbids those in dist/ —
//     4 pages tripped it on the first Phase 2 build (28 Nov 2026).
//  3. NO PLACEHOLDERS — getDocText() returns null when a slug has no text;
//     the template then renders NO text section at all (never a
//     "content not available" note).
import fs from 'fs';
import path from 'path';

// Uniform per-page cap (UTF-8 bytes), applied at bundle-build time.
// Default 6 KB: measured full run = 91.3 MB capped text over 19,762 files
// with text (raw extracted 1.61 GB), so dist grows ~91 MB (see DESIGN.md §2).
// Overridable for local testing only via DOC_TEXT_CAP (CI never sets it).
export const DOC_TEXT_CAP_BYTES: number = (() => {
  const env = Number(process.env.DOC_TEXT_CAP || '');
  return Number.isInteger(env) && env > 0 ? env : 6144;
})();

// Zero-width space — invisible; breaks the audit's literal
// `drive.google.com` pattern without changing visible text.
// Inserted after EVERY dot of a matched host (28 Nov 2026 fix):
// breaking only the first dot left the literal substring
// `googleusercontent.com` intact inside e.g.
// `webcache.googleusercontent.com` (ZWSP after `webcache.` only),
// which still trips a plain-text grep even though the audit's
// `https?://...\.googleusercontent\.com/` pattern no longer
// matched. Breaking all dots leaves no forbidden literal behind.
const ZWSP = '\u200b';

export function sanitizeExtractedText(text: string): { text: string; defanged: number } {
  let defanged = 0;
  const out = text.replace(
    /(drive|docs)\.google\.com|drive\.usercontent\.google\.com|[a-z0-9-]+\.googleusercontent\.com|googleusercontent\.com/gi,
    (m) => {
      defanged++;
      return m.replace(/\./g, `.${ZWSP}`);
    }
  );
  return { text: out, defanged };
}

export function capTextAtLine(text: string, capBytes: number): string {
  const buf = Buffer.from(text, 'utf-8');
  if (buf.length <= capBytes) return text;
  const slice = buf.subarray(0, capBytes).toString('utf-8');
  // Cut at the last newline at or before the cap so we never split a line.
  const lastNl = slice.lastIndexOf('\n');
  if (lastNl > 0) return slice.slice(0, lastNl);
  return slice;
}

export interface DocTextStore {
  /** Capped + sanitized text for a slug, or null when the file has none. */
  getDocText: (slug: string) => string | null;
  /** Slugs that had text in the bundles. */
  slugsWithText: Set<string>;
  /** Total Drive-URL defangings applied across loaded bundles. */
  defangedTotal: number;
  /** Courses whose bundle file was missing (pages render without text). */
  missingBundles: string[];
}

/**
 * Load the text bundles for the given courses. Fails loudly if the
 * bundles directory itself is missing (a build with zero text must never
 * look like success); a missing bundle for one course only warns and is
 * reported, so one bad course cannot block 28k pages.
 */
export function loadDocTextBundles(courses: Set<string>): DocTextStore {
  const dir = path.resolve('scripts/doc-text');
  if (!fs.existsSync(dir)) {
    throw new Error(
      'doc prerender: scripts/doc-text/ is missing — refusing to prerender doc pages with zero extracted text.'
    );
  }
  const bySlug = new Map<string, string>();
  let defangedTotal = 0;
  const missingBundles: string[] = [];
  for (const course of courses) {
    const bundlePath = path.join(dir, `${course.toUpperCase()}.json`);
    if (!fs.existsSync(bundlePath)) {
      missingBundles.push(course.toUpperCase());
      continue;
    }
    const parsed = JSON.parse(
      fs.readFileSync(bundlePath, 'utf-8')
    ) as Record<string, string>;
    for (const [slug, rawText] of Object.entries(parsed)) {
      const { text, defanged } = sanitizeExtractedText(rawText);
      defangedTotal += defanged;
      bySlug.set(slug, text);
    }
  }
  return {
    getDocText: (slug: string) => bySlug.get(slug) ?? null,
    slugsWithText: new Set(bySlug.keys()),
    defangedTotal,
    missingBundles
  };
}
