// Data-backed /doc/* slug index. The pure slug helpers live in
// ./docSlugBase so the app shell can use them without bundling the
// 4.1 MB resources.json catalog; this module keeps the static import
// (the build scripts call getDocSlugIndex() synchronously at import
// time, and the doc viewer / SEO manager / library cards rely on the
// sync lookup), so its public API is unchanged.
import { Resource } from '../types';
import resourcesData from '../data/resources.json';
import {
  DocSlugEntry,
  DocSlugIndex,
  buildDocBaseSlug,
  cleanDocumentDisplayTitle,
  createDocSlugIndex,
  extractDocSlugFromPath
} from './docSlugBase';

export type { DocSlugEntry, DocSlugIndex };
export {
  buildDocBaseSlug,
  cleanDocumentDisplayTitle,
  createDocSlugIndex,
  extractDocSlugFromPath
};

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
