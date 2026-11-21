import { Resource } from '../types';
import resourcesData from '../data/resources.json';

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

let cachedIndex: DocSlugIndex | null = null;

export function getDocSlugIndex(): DocSlugIndex {
  if (!cachedIndex) {
    cachedIndex = createDocSlugIndex(resourcesData as Resource[]);
  }
  return cachedIndex;
}

export function getDocSlug(rlh: string): string {
  return getDocSlugIndex().slugByRlh.get(rlh) || rlh.toLowerCase();
}

export function findDocEntryBySlug(rawSlugOrPath: string): DocSlugEntry | null {
  if (!rawSlugOrPath) return null;

  let clean = rawSlugOrPath.trim();
  try {
    clean = decodeURIComponent(clean);
  } catch {
    // Use raw input if malformed percent encoding
  }

  // Accept full paths like "/DOC/CS201.pdf/" or just slug strings like "CS201PDF"
  clean = clean
    .normalize('NFKC')
    .toLowerCase()
    .replace(/^https?:\/\/[^/]+/i, '')
    .replace(/^\/?doc\//i, '')
    .replace(/\/+$/g, '');

  if (!clean) return null;

  const idx = getDocSlugIndex();

  // 1. Direct exact canonical slug hit
  const exact = idx.entryBySlug.get(clean);
  if (exact) return exact;

  // 2. Normalized hyphenated form (handles e.g. /DOC/CS201.pdf or underscores/spaces)
  const hyphenated = clean
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (hyphenated) {
    const byHyphen = idx.entryBySlug.get(hyphenated);
    if (byHyphen) return byHyphen;
  }

  // 3. Compact alphanumeric form (handles e.g. /DOC/CS201PDF -> matches cs201-pdf or cs201-handouts-pdf fallback)
  const compact = clean.replace(/[^a-z0-9]+/g, '');
  if (compact) {
    const byCompact = idx.entryByCompactKey.get(compact);
    if (byCompact) return byCompact;

    // 4. Direct RLH fallback if someone enters /doc/r_...
    if (compact.startsWith('r')) {
      const slugForRlh = idx.slugByRlh.get(clean);
      if (slugForRlh) {
        return idx.entryBySlug.get(slugForRlh) || null;
      }
    }

    // 5. Course+format shorthand fallback (e.g., /DOC/CS201PDF -> first CS201 PDF, prioritizing handouts)
    const courseFmtMatch = compact.match(/^([a-z]{2,4}\d{3}[a-z]?)(pdf|doc|docx|ppt|pptx|zip|rar)?$/);
    if (courseFmtMatch) {
      const targetCourse = courseFmtMatch[1].toUpperCase();
      const targetFmt = (courseFmtMatch[2] || '').toUpperCase();
      const normalizedTargetFmt =
        targetFmt === 'DOCX'
          ? 'DOC'
          : targetFmt === 'PPTX'
          ? 'PPT'
          : targetFmt === 'ZIP' || targetFmt === 'RAR'
          ? 'ARCHIVE'
          : targetFmt;

      const courseMatches = idx.entries.filter(
        (e) =>
          e.resource.course.toUpperCase() === targetCourse &&
          (!normalizedTargetFmt || e.resource.format.toUpperCase() === normalizedTargetFmt)
      );
      if (courseMatches.length > 0) {
        return (
          courseMatches.find((e) => e.resource.type === 'HANDOUT') ||
          courseMatches.find((e) => e.resource.type === 'MIDTERM') ||
          courseMatches[0]
        );
      }
    }
  }

  return null;
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

export function getRelatedDocEntries(resource: Resource, limit = 8): DocSlugEntry[] {
  const idx = getDocSlugIndex();
  const sameCourse = idx.entries.filter(
    (e) => e.resource.course === resource.course && e.resource.rlh !== resource.rlh
  );

  // Prioritize documents of complementary types or similar tags, keeping deterministic order
  const prioritized = sameCourse.sort((a, b) => {
    const aSameType = a.resource.type === resource.type ? 0 : 1;
    const bSameType = b.resource.type === resource.type ? 0 : 1;
    if (aSameType !== bSameType) return aSameType - bSameType;
    return a.index - b.index;
  });

  return prioritized.slice(0, limit);
}
