import midtermIndexData from '../data/midterm-prep-index.json';
import { MidtermDocPayload, MidtermPrepIndexEntry } from '../types/midterm';

const entries = midtermIndexData as MidtermPrepIndexEntry[];

const entryByExactLower = new Map<string, MidtermPrepIndexEntry>();
const entryByBaseLower = new Map<string, MidtermPrepIndexEntry>();
const entriesByCourse = new Map<string, MidtermPrepIndexEntry[]>();

for (const entry of entries) {
  entryByExactLower.set(entry.filename.toLowerCase(), entry);
  entryByBaseLower.set(entry.dataKey.toLowerCase(), entry);

  const code = entry.courseCode.toUpperCase();
  if (!entriesByCourse.has(code)) {
    entriesByCourse.set(code, []);
  }
  entriesByCourse.get(code)!.push(entry);
}

export function getAllMidtermPrepEntries(): MidtermPrepIndexEntry[] {
  return entries;
}

export function getMidtermCoursesGrouped(): Array<{
  courseCode: string;
  courseTitle: string;
  faculty: string;
  mcqsEntry?: MidtermPrepIndexEntry;
  subjectiveEntry?: MidtermPrepIndexEntry;
  topics: string[];
}> {
  const result: Array<{
    courseCode: string;
    courseTitle: string;
    faculty: string;
    mcqsEntry?: MidtermPrepIndexEntry;
    subjectiveEntry?: MidtermPrepIndexEntry;
    topics: string[];
  }> = [];

  for (const [courseCode, list] of entriesByCourse.entries()) {
    const mcqsEntry = list.find((e) => e.kind === 'mcqs');
    const subjectiveEntry = list.find((e) => e.kind === 'subjective');
    const primary = mcqsEntry || subjectiveEntry!;
    const topicSet = new Set<string>([
      ...(mcqsEntry?.topics || []),
      ...(subjectiveEntry?.topics || [])
    ]);

    result.push({
      courseCode,
      courseTitle: primary.courseTitle,
      faculty: primary.faculty,
      mcqsEntry,
      subjectiveEntry,
      topics: Array.from(topicSet)
    });
  }

  result.sort((a, b) => a.courseCode.localeCompare(b.courseCode));
  return result;
}

export function extractMidtermSlugFromPath(pathname: string): string | null {
  const clean = (pathname || '').split('?')[0].split('#')[0];
  const match = clean.match(/^\/midterm-prep\/(.+?)\/?$/i);
  if (!match || !match[1]) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

export function findMidtermEntryBySlug(rawSlugOrPath: string): MidtermPrepIndexEntry | null {
  if (!rawSlugOrPath) return null;
  let clean = rawSlugOrPath.trim();
  try {
    clean = decodeURIComponent(clean);
  } catch {
    // Use raw value if malformed encoding
  }
  clean = clean
    .replace(/^https?:\/\/[^/]+/i, '')
    .replace(/^\/?midterm-prep\//i, '')
    .replace(/\/+$/g, '')
    .toLowerCase();

  if (!clean) return null;

  const exact = entryByExactLower.get(clean);
  if (exact) return exact;

  const withoutExt = clean.replace(/\.pdf$/i, '');
  const byBase = entryByBaseLower.get(withoutExt);
  if (byBase) return byBase;

  const withPdf = `${withoutExt}.pdf`;
  const byWithPdf = entryByExactLower.get(withPdf);
  if (byWithPdf) return byWithPdf;

  return null;
}

export function getMidtermDocsForCourse(courseCode: string): MidtermPrepIndexEntry[] {
  if (!courseCode) return [];
  return entriesByCourse.get(courseCode.toUpperCase()) || [];
}

export function getMidtermSiblingEntry(entry: MidtermPrepIndexEntry): MidtermPrepIndexEntry | null {
  const list = entriesByCourse.get(entry.courseCode.toUpperCase()) || [];
  return list.find((item) => item.kind !== entry.kind) || null;
}

export function getMidtermCoursePrefixNeighbors(
  entry: MidtermPrepIndexEntry,
  limit = 8
): MidtermPrepIndexEntry[] {
  const prefix = entry.courseCode.replace(/\d+.*$/, '').toUpperCase();
  return entries
    .filter(
      (item) =>
        item.filename !== entry.filename &&
        item.courseCode.toUpperCase().startsWith(prefix)
    )
    .slice(0, limit);
}

export function readInlineSsrMidtermDoc(targetDataKey: string): MidtermDocPayload | null {
  if (typeof document === 'undefined') return null;
  try {
    const scriptEl = document.getElementById('mihora-midterm-ssr-data');
    if (!scriptEl || !scriptEl.textContent) return null;
    const parsed = JSON.parse(scriptEl.textContent) as MidtermDocPayload;
    if (parsed && parsed.dataKey?.toLowerCase() === targetDataKey.toLowerCase()) {
      return parsed;
    }
  } catch {
    // Ignore parse errors and fall back to network fetch
  }
  return null;
}
