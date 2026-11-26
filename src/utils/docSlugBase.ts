// Pure slug helpers for /doc/* URLs — NO data import.
//
// Split out of ./docSlug so the app shell can use the pure helpers
// (title cleanup, slug parsing) WITHOUT pulling the 4.1 MB resources.json
// catalog into the main JS bundle. The data-backed index lives in
// ./docSlug (static import, used by the build scripts, the doc viewer,
// the SEO manager and the library cards) and keeps the exact same API.
import { Resource } from '../types';

export interface DocSlugEntry {
  slug: string;
  compactKey: string;
  resource: Resource;
  index: number;
}

export interface DocSlugIndex {
  slugByRlh: Map<string, string>;
  entryBySlug: Map<string, DocSlugEntry>;
  entryByCompactKey: Map<string, DocSlugEntry>;
  entries: DocSlugEntry[];
}

const KNOWN_EXTENSIONS = new Set([
  'pdf',
  'doc',
  'docx',
  'ppt',
  'pptx',
  'xls',
  'xlsx',
  'txt',
  'zip',
  'rar',
  '7z',
  'png',
  'jpg',
  'jpeg',
  'webp',
  'csv',
  'html'
]);

const MAX_SLUG_LENGTH = 96;

export function cleanDocumentDisplayTitle(rawName: string): string {
  return (rawName || 'Virtual University Study Document')
    .normalize('NFKC')
    .replace(/\s+/g, ' ')
    .trim();
}

export function buildDocBaseSlug(resource: Pick<Resource, 'name' | 'course' | 'format'>): string {
  const normalized = (resource.name || '').normalize('NFKC').toLowerCase().trim();
  const tokens = normalized
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!tokens) {
    const coursePart = (resource.course || 'vu')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '') || 'vu';
    const formatPart = (resource.format || 'file')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '') || 'file';
    return `${coursePart}-${formatPart}`;
  }

  if (tokens.length <= MAX_SLUG_LENGTH) {
    return tokens;
  }

  // Preserve recognizable extension token (e.g., -pdf, -docx) when truncating long names
  const lastDash = tokens.lastIndexOf('-');
  if (lastDash > 0) {
    const ext = tokens.slice(lastDash + 1);
    if (KNOWN_EXTENSIONS.has(ext) && ext.length + 2 < MAX_SLUG_LENGTH) {
      const maxStemLen = MAX_SLUG_LENGTH - ext.length - 1;
      const stem = tokens.slice(0, lastDash).slice(0, maxStemLen).replace(/-+$/g, '');
      if (stem) {
        return `${stem}-${ext}`;
      }
    }
  }

  return tokens.slice(0, MAX_SLUG_LENGTH).replace(/-+$/g, '');
}

export function createDocSlugIndex(resourcesList: Resource[]): DocSlugIndex {
  const seenSlugs = new Set<string>();
  const slugByRlh = new Map<string, string>();
  const entryBySlug = new Map<string, DocSlugEntry>();
  const entryByCompactKey = new Map<string, DocSlugEntry>();
  const entries: DocSlugEntry[] = [];

  for (let i = 0; i < resourcesList.length; i++) {
    const resource = resourcesList[i];
    const baseSlug = buildDocBaseSlug(resource);
    let slug = baseSlug;

    if (seenSlugs.has(slug)) {
      const courseClean = (resource.course || '')
        .normalize('NFKC')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '');

      const withCourse =
        courseClean && !baseSlug.includes(courseClean)
          ? `${baseSlug}-${courseClean}`
          : '';

      if (withCourse && !seenSlugs.has(withCourse)) {
        slug = withCourse;
      } else {
        let counter = 2;
        while (seenSlugs.has(`${baseSlug}-${counter}`)) {
          counter++;
        }
        slug = `${baseSlug}-${counter}`;
      }
    }

    seenSlugs.add(slug);
    const compactKey = slug.replace(/-/g, '');
    const entry: DocSlugEntry = {
      slug,
      compactKey,
      resource,
      index: i
    };

    entries.push(entry);
    slugByRlh.set(resource.rlh, slug);
    entryBySlug.set(slug, entry);

    if (!entryByCompactKey.has(compactKey)) {
      entryByCompactKey.set(compactKey, entry);
    }
  }

  return {
    slugByRlh,
    entryBySlug,
    entryByCompactKey,
    entries
  };
}

export function extractDocSlugFromPath(pathname: string): string | null {
  const clean = (pathname || '').split('?')[0].split('#')[0];
  const match = clean.match(/^\/doc\/(.+?)\/?$/i);
  if (!match || !match[1]) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}
