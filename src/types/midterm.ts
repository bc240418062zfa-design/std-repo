export interface MidtermMcqItem {
  number: number;
  topic: string;
  question: string;
  options: string[];
  correctIndex: number | null;
}

export interface MidtermSubjectiveItem {
  number: number;
  topic: string;
  question: string;
  marks: string | null;
  answer: string;
}

export interface MidtermDocPayload {
  filename: string;
  slug: string;
  dataKey: string;
  courseCode: string;
  courseTitle: string;
  faculty: string;
  kind: 'mcqs' | 'subjective';
  headerTitle: string;
  subtitle: string;
  pageCount: number;
  itemCount: number;
  topics: string[];
  mcqs?: MidtermMcqItem[];
  subjective?: MidtermSubjectiveItem[];
  extraLines?: string[];
}

export interface MidtermPrepIndexEntry {
  filename: string;
  slug: string;
  dataKey: string;
  courseCode: string;
  courseTitle: string;
  faculty: string;
  kind: 'mcqs' | 'subjective';
  pageCount: number;
  itemCount: number;
  topics: string[];
  previewSnippet: string;
}
