import midtermFilesData from '../data/midtermFiles.json';

export interface MidtermItem {
  id: string;
  slug: string;
  filename: string;
  courseCode: string;
  type: 'OBJECTIVE' | 'SUBJECTIVE';
  format: 'PDF';
  title: string;
  termScope: string;
  rlh: string;
  estimatedPages: number;
}

const allMidtermFiles: MidtermItem[] = midtermFilesData as MidtermItem[];

const BY_FILENAME = new Map<string, MidtermItem>();
const BY_SLUG = new Map<string, MidtermItem>();

for (const item of allMidtermFiles) {
  BY_FILENAME.set(item.filename.toLowerCase(), item);
  BY_SLUG.set(item.slug.toLowerCase(), item);
}

export function getAllMidtermFiles(): MidtermItem[] {
  return allMidtermFiles;
}

export function findMidtermFile(query: string): MidtermItem | undefined {
  if (!query) return undefined;
  const clean = query.trim().toLowerCase().replace(/^\/midterm-prep\//i, '').replace(/^\/midterm\//i, '');
  const decoded = decodeURIComponent(clean);

  // Exact filename
  if (BY_FILENAME.has(decoded)) return BY_FILENAME.get(decoded);
  // Without .pdf
  const base = decoded.replace(/\.pdf$/i, '');
  if (BY_SLUG.has(base)) return BY_SLUG.get(base);
  if (BY_FILENAME.has(`${base}.pdf`)) return BY_FILENAME.get(`${base}.pdf`);

  // Direct slug match
  if (BY_SLUG.has(decoded)) return BY_SLUG.get(decoded);

  return undefined;
}

export function getCompanionMidtermFile(current: MidtermItem): MidtermItem | undefined {
  // If this is OBJECTIVE, find SUBJECTIVE for the same courseCode, and vice versa
  const targetType = current.type === 'OBJECTIVE' ? 'SUBJECTIVE' : 'OBJECTIVE';
  return allMidtermFiles.find(
    (item) => item.courseCode === current.courseCode && item.type === targetType
  );
}

export function getRelatedMidtermFiles(courseCode: string, limit = 6): MidtermItem[] {
  return allMidtermFiles
    .filter((item) => item.courseCode.toUpperCase() === courseCode.toUpperCase())
    .slice(0, limit);
}
