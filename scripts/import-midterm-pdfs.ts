import fs from 'fs';
import path from 'path';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import coursesData from '../src/data/courses.json';

interface CourseEntry {
  code: string;
  title: string;
  faculty: string;
  fileCount: number;
}

interface RawPdfLink {
  filename: string;
  driveId: string;
  courseCode: string;
  kind: 'mcqs' | 'subjective';
}

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

interface SpanInfo {
  x: number;
  font: string;
  height: number;
  str: string;
}

interface LineInfo {
  page: number;
  y: number;
  minX: number;
  maxHeight: number;
  text: string;
  spans: SpanInfo[];
  dominantFont: string;
  boldCharRatio: number;
}

const LINKS_FILE = path.resolve('.secrets/midterm-drive-links.txt');
const SERVER_MAP_OUT = path.resolve('.secrets/midterm-server-map.json');
const TMP_PDF_DIR = '/tmp/midterm_pdfs';
const PUBLIC_DATA_DIR = path.resolve('public/midterm-data');
const INDEX_OUT = path.resolve('src/data/midterm-prep-index.json');

const coursesMap = new Map<string, CourseEntry>();
for (const c of coursesData as CourseEntry[]) {
  coursesMap.set(c.code.toUpperCase(), c);
}

function sanitizeText(str: string): string {
  return str
    .replace(/https?:\/\/drive\.google\.com\/[^\s"')]+/gi, '')
    .replace(/https?:\/\/[a-z0-9.-]+\.googleusercontent\.com\/[^\s"')]+/gi, '')
    .replace(/paradox/gi, 'study')
    .replace(/\u0000/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseDriveLinksFile(): RawPdfLink[] {
  const txt = fs.readFileSync(LINKS_FILE, 'utf-8');
  const lines = txt.split(/\r?\n/);
  const result: RawPdfLink[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^\s*\d+\.\s+(.+\.pdf)\s*$/i);
    if (m && i + 1 < lines.length) {
      const lm = lines[i + 1].match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (lm) {
        const filename = m[1].trim();
        if (seen.has(filename.toLowerCase())) continue;
        seen.add(filename.toLowerCase());
        const courseMatch = filename.match(/^([A-Z0-9]+)-Midterm-Important-(MCQs|Subjective)\.pdf$/i);
        const courseCode = courseMatch
          ? courseMatch[1].toUpperCase()
          : filename.split('-')[0].toUpperCase();
        const kind: 'mcqs' | 'subjective' = /subjective/i.test(filename) ? 'subjective' : 'mcqs';
        result.push({
          filename,
          driveId: lm[1],
          courseCode,
          kind
        });
      }
    }
  }
  return result;
}

async function downloadWithRetry(driveId: string, destPath: string, retries = 4): Promise<void> {
  if (fs.existsSync(destPath) && fs.statSync(destPath).size > 500) {
    const head = fs.readFileSync(destPath).subarray(0, 5).toString('utf-8');
    if (head === '%PDF-') return;
    fs.unlinkSync(destPath);
  }

  const urls = [
    `https://drive.usercontent.google.com/download?id=${encodeURIComponent(driveId)}&export=download&confirm=t`,
    `https://drive.google.com/uc?export=download&id=${encodeURIComponent(driveId)}&confirm=t`
  ];

  for (let attempt = 1; attempt <= retries; attempt++) {
    const targetUrl = urls[(attempt - 1) % urls.length];
    try {
      const res = await fetch(targetUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          Accept: 'application/pdf,*/*'
        },
        redirect: 'follow',
        signal: AbortSignal.timeout(45000)
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.subarray(0, 5).toString('utf-8') !== '%PDF-') {
        throw new Error(`Non-PDF response (size=${buf.length})`);
      }

      fs.writeFileSync(destPath, buf);
      return;
    } catch (err) {
      if (attempt === retries) {
        throw new Error(`Failed to download ${driveId} after ${retries} attempts: ${(err as Error).message}`);
      }
      await new Promise((r) => setTimeout(r, 800 * attempt));
    }
  }
}

function isBoilerplateLine(text: string, y: number, height: number): boolean {
  const trimmed = text.trim();
  const lower = trimmed.toLowerCase();
  if (
    lower.includes('https://study.mihora.tech') ||
    lower.includes('youtube.com/@mihoratech') ||
    lower.includes('mihora.tech@gmail.com') ||
    lower.includes('03295415317') ||
    lower.includes('03297115355')
  ) {
    return true;
  }
  if (/^--\s*\d+\s+of\s+\d+\s*--$/i.test(trimmed)) return true;
  if (/^Page\s+\d+(?:\s+of\s+\d+)?$/i.test(trimmed)) return true;
  if (height <= 9.6 && (y >= 746 || y <= 45)) return true;
  return false;
}

async function extractPdfLines(pdfPath: string): Promise<{
  pageCount: number;
  lines: LineInfo[];
  boldFonts: Set<string>;
  bodyFontSize: number;
}> {
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await pdfjsLib.getDocument({ data, verbosity: 0 }).promise;
  const pageCount = doc.numPages;

  const rawItemsPerPage: Array<Array<{ page: number; y: number; x: number; height: number; font: string; str: string }>> = [];
  const boldScoreByFont = new Map<string, number>();
  const fontCharCounts = new Map<string, number>();
  const heightCharCounts = new Map<number, number>();

  for (let p = 1; p <= pageCount; p++) {
    const page = await doc.getPage(p);
    const tc = await page.getTextContent();
    const pageItems: Array<{ page: number; y: number; x: number; height: number; font: string; str: string }> = [];

    for (const item of tc.items as Array<{
      str?: string;
      transform?: number[];
      fontName?: string;
    }>) {
      if (!item.str || !item.transform) continue;
      const y = item.transform[5];
      const x = item.transform[4];
      const height = Math.max(Math.abs(item.transform[0]), Math.abs(item.transform[3]));
      const font = item.fontName || 'unknown';
      const trimmed = item.str;
      if (!trimmed.trim()) continue;
      if (isBoilerplateLine(trimmed, y, height)) continue;

      pageItems.push({ page: p, y, x, height, font, str: trimmed });
      const charLen = trimmed.trim().length;
      fontCharCounts.set(font, (fontCharCounts.get(font) || 0) + charLen);
      const roundedH = Math.round(height * 2) / 2;
      heightCharCounts.set(roundedH, (heightCharCounts.get(roundedH) || 0) + charLen);
    }

    rawItemsPerPage.push(pageItems);
  }

  // Group spans on same page & Y into lines
  const preliminaryLines: Array<{
    page: number;
    y: number;
    minX: number;
    maxHeight: number;
    text: string;
    spans: SpanInfo[];
    dominantFont: string;
  }> = [];

  for (const pageItems of rawItemsPerPage) {
    // Sort top-to-bottom (higher y first), then left-to-right
    pageItems.sort((a, b) => {
      if (Math.abs(a.y - b.y) > 2.8) return b.y - a.y;
      return a.x - b.x;
    });

    const groups: Array<{ y: number; items: typeof pageItems }> = [];
    for (const item of pageItems) {
      const last = groups[groups.length - 1];
      if (last && Math.abs(last.y - item.y) <= 2.8) {
        last.items.push(item);
      } else {
        groups.push({ y: item.y, items: [item] });
      }
    }

    for (const g of groups) {
      g.items.sort((a, b) => a.x - b.x);
      let lineStr = '';
      let prevEnd = -1;
      const spans: SpanInfo[] = [];
      const fontChars = new Map<string, number>();
      let maxHeight = 0;

      for (const it of g.items) {
        if (lineStr && prevEnd >= 0 && it.x - prevEnd > 2) {
          if (!lineStr.endsWith(' ') && !it.str.startsWith(' ')) {
            lineStr += ' ';
          }
        }
        lineStr += it.str;
        prevEnd = it.x + it.str.length * (it.height * 0.45);
        maxHeight = Math.max(maxHeight, it.height);
        spans.push({ x: it.x, font: it.font, height: it.height, str: it.str });
        fontChars.set(it.font, (fontChars.get(it.font) || 0) + it.str.trim().length);
      }

      const text = sanitizeText(lineStr);
      if (!text || isBoilerplateLine(text, g.y, maxHeight)) continue;

      let dominantFont = spans[0]?.font || 'unknown';
      let bestCount = -1;
      for (const [f, cnt] of fontChars.entries()) {
        if (cnt > bestCount) {
          bestCount = cnt;
          dominantFont = f;
        }
      }

      // Score fonts that appear on headings, question stems, "Midterm Important", or "Answer:"
      if (
        maxHeight >= 11.8 ||
        /Midterm Important/i.test(text) ||
        /^(?:Q\s*)?\d+\.\s+/i.test(text) ||
        /^Answer:/i.test(text)
      ) {
        const prefixFont = spans[0]?.font || dominantFont;
        boldScoreByFont.set(prefixFont, (boldScoreByFont.get(prefixFont) || 0) + 1);
      }

      preliminaryLines.push({
        page: g.items[0].page,
        y: g.y,
        minX: Math.min(...spans.map((s) => s.x)),
        maxHeight,
        text,
        spans,
        dominantFont
      });
    }
  }

  // Determine bold font(s): highest score on structural headings/stems
  const boldFonts = new Set<string>();
  let topBoldFont = '';
  let topBoldScore = 0;
  for (const [font, score] of boldScoreByFont.entries()) {
    if (score > topBoldScore) {
      topBoldScore = score;
      topBoldFont = font;
    }
  }
  if (topBoldFont) boldFonts.add(topBoldFont);

  // In case there's another font with a very high bold score (>= 60% of topBoldScore and not the most common body font)
  let mostCommonBodyFont = '';
  let mostCommonBodyChars = -1;
  for (const [f, cnt] of fontCharCounts.entries()) {
    if (cnt > mostCommonBodyChars) {
      mostCommonBodyChars = cnt;
      mostCommonBodyFont = f;
    }
  }
  for (const [font, score] of boldScoreByFont.entries()) {
    if (font !== mostCommonBodyFont && score >= Math.max(3, topBoldScore * 0.4)) {
      boldFonts.add(font);
    }
  }

  const lines: LineInfo[] = preliminaryLines.map((l) => {
    let boldChars = 0;
    let totalChars = 0;
    for (const s of l.spans) {
      const len = s.str.trim().length;
      if (len === 0) continue;
      totalChars += len;
      if (boldFonts.has(s.font)) boldChars += len;
    }
    return {
      ...l,
      boldCharRatio: totalChars > 0 ? boldChars / totalChars : 0
    };
  });

  let bodyFontSize = 11;
  let maxHeightChars = -1;
  for (const [h, cnt] of heightCharCounts.entries()) {
    if (h >= 9 && h <= 13 && cnt > maxHeightChars) {
      maxHeightChars = cnt;
      bodyFontSize = h;
    }
  }

  await doc.destroy();
  return { pageCount, lines, boldFonts, bodyFontSize };
}

function parseMcqDocument(
  meta: RawPdfLink,
  pageCount: number,
  lines: LineInfo[],
  bodyFontSize: number,
  courseInfo?: CourseEntry
): MidtermDocPayload {
  let headerTitle = `${meta.courseCode} — ${courseInfo?.title || meta.courseCode}`;
  let subtitle = 'Midterm Important MCQs';
  let currentTopic = 'Core Midterm Concepts';
  const topicsSet = new Set<string>();
  const mcqs: MidtermMcqItem[] = [];
  const extraLines: string[] = [];

  const titleMinHeight = bodyFontSize + 4.2;
  const topicMinHeight = bodyFontSize + 1.4;
  const topicMaxHeight = bodyFontSize + 4.1;

  let currentQ: {
    number: number;
    topic: string;
    stemParts: string[];
    options: Array<{ letter: string; parts: string[]; boldChars: number; totalChars: number }>;
  } | null = null;

  const flushCurrentQ = () => {
    if (!currentQ) return;
    const question = sanitizeText(currentQ.stemParts.join(' '));
    const options = currentQ.options.map((o) => sanitizeText(o.parts.join(' ')));

    let correctIndex: number | null = null;
    let bestRatio = 0.45;
    currentQ.options.forEach((opt, idx) => {
      const ratio = opt.totalChars > 0 ? opt.boldChars / opt.totalChars : 0;
      if (ratio > bestRatio) {
        bestRatio = ratio;
        correctIndex = idx;
      }
    });

    if (question && options.length >= 2) {
      mcqs.push({
        number: currentQ.number,
        topic: currentQ.topic,
        question,
        options,
        correctIndex
      });
    } else if (question) {
      extraLines.push(`${currentQ.number}. ${question}`);
    }
    currentQ = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const t = line.text;

    if (i < 6 && line.page === 1) {
      if (line.maxHeight >= titleMinHeight) {
        let fullTitle = t;
        while (
          i + 1 < lines.length &&
          lines[i + 1].page === 1 &&
          lines[i + 1].maxHeight >= titleMinHeight
        ) {
          i++;
          fullTitle += ' ' + lines[i].text;
        }
        headerTitle = sanitizeText(fullTitle);
        continue;
      }
      if (/^Midterm Important/i.test(t) || (line.maxHeight >= topicMinHeight && /midterm important/i.test(t))) {
        subtitle = t;
        continue;
      }
      if (/^Total\s+(?:MCQs|Questions)\s*:\s*\d+/i.test(t)) {
        continue;
      }
    }

    const isQStart = /^(?:Q\s*)?(\d+)\.\s*(.+)$/i.exec(t);
    const isOptStart = /^([a-eA-E])(?:\)\s*|\.\s+)(.+)$/.exec(t);

    if (
      !isQStart &&
      !isOptStart &&
      line.maxHeight >= topicMinHeight &&
      line.maxHeight <= topicMaxHeight &&
      line.minX <= 80
    ) {
      let topicFull = t;
      while (
        i + 1 < lines.length &&
        lines[i + 1].page === line.page &&
        lines[i + 1].maxHeight >= topicMinHeight &&
        lines[i + 1].maxHeight <= topicMaxHeight &&
        !/^(?:Q\s*)?(\d+)\.\s+/i.test(lines[i + 1].text) &&
        !/^([a-eA-E])(?:\)\s*|\.\s+)/.test(lines[i + 1].text)
      ) {
        i++;
        topicFull += ' ' + lines[i].text;
      }
      flushCurrentQ();
      currentTopic = sanitizeText(topicFull);
      topicsSet.add(currentTopic);
      continue;
    }

    if (isQStart) {
      const qNum = parseInt(isQStart[1], 10);
      const qText = isQStart[2].trim();
      flushCurrentQ();
      topicsSet.add(currentTopic);
      currentQ = {
        number: qNum,
        topic: currentTopic,
        stemParts: [qText],
        options: []
      };
      continue;
    }

    if (isOptStart && currentQ) {
      const letter = isOptStart[1].toLowerCase();
      const optText = isOptStart[2].trim();
      const optTotal = t.length;
      const optBold = Math.round(line.boldCharRatio * optTotal);
      currentQ.options.push({
        letter,
        parts: [optText],
        boldChars: optBold,
        totalChars: optTotal
      });
      continue;
    }

    if (currentQ) {
      if (currentQ.options.length > 0) {
        const lastOpt = currentQ.options[currentQ.options.length - 1];
        lastOpt.parts.push(t);
        const len = t.length;
        lastOpt.totalChars += len;
        lastOpt.boldChars += Math.round(line.boldCharRatio * len);
      } else {
        currentQ.stemParts.push(t);
      }
    } else {
      extraLines.push(t);
    }
  }

  flushCurrentQ();

  const extractedCourseTitle =
    headerTitle.split(/—|--|-/).slice(1).join('—').trim() ||
    courseInfo?.title ||
    meta.courseCode;

  return {
    filename: meta.filename,
    slug: meta.filename,
    dataKey: meta.filename.replace(/\.pdf$/i, ''),
    courseCode: meta.courseCode,
    courseTitle: extractedCourseTitle,
    faculty: courseInfo?.faculty || 'Virtual University of Pakistan',
    kind: 'mcqs',
    headerTitle,
    subtitle,
    pageCount,
    itemCount: mcqs.length,
    topics: Array.from(topicsSet),
    mcqs,
    ...(extraLines.length > 0 ? { extraLines } : {})
  };
}

function parseSubjectiveDocument(
  meta: RawPdfLink,
  pageCount: number,
  lines: LineInfo[],
  bodyFontSize: number,
  courseInfo?: CourseEntry
): MidtermDocPayload {
  let headerTitle = `${meta.courseCode} — ${courseInfo?.title || meta.courseCode}`;
  let subtitle = 'Midterm Important Subjective Questions (Solved)';
  let currentTopic = 'Core Subjective Topics';
  const topicsSet = new Set<string>();
  const subjective: MidtermSubjectiveItem[] = [];
  const extraLines: string[] = [];

  const titleMinHeight = bodyFontSize + 4.2;
  const topicMinHeight = bodyFontSize + 1.4;
  const topicMaxHeight = bodyFontSize + 4.1;

  // Detect whether question stems are predominantly Qn. or bold n.
  const explicitQPrefixCount = lines.filter((l) => /^Q\d+\.\s+/i.test(l.text)).length;
  const boldNumberedCount = lines.filter(
    (l) => /^(?:Q\s*)?\d+\.\s+/i.test(l.text) && l.boldCharRatio >= 0.45
  ).length;
  const useBoldNumberRule = explicitQPrefixCount < 3 && boldNumberedCount >= 3;

  let currentItem: {
    number: number;
    topic: string;
    questionParts: string[];
    answerParts: string[];
    inAnswer: boolean;
  } | null = null;

  const flushItem = () => {
    if (!currentItem) return;
    let rawQ = sanitizeText(currentItem.questionParts.join(' '));
    let marks: string | null = null;
    const marksMatch = rawQ.match(/\((\d+(?:\s*-\s*\d+)?\s*marks?)\)\s*$/i);
    if (marksMatch) {
      marks = marksMatch[1];
      rawQ = rawQ.replace(/\(\d+(?:\s*-\s*\d+)?\s*marks?\)\s*$/i, '').trim();
    }
    const answer = sanitizeText(currentItem.answerParts.join(' '));
    if (rawQ) {
      subjective.push({
        number: currentItem.number,
        topic: currentItem.topic,
        question: rawQ,
        marks,
        answer
      });
    }
    currentItem = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const t = line.text;

    if (i < 6 && line.page === 1) {
      if (line.maxHeight >= titleMinHeight) {
        let fullTitle = t;
        while (
          i + 1 < lines.length &&
          lines[i + 1].page === 1 &&
          lines[i + 1].maxHeight >= titleMinHeight
        ) {
          i++;
          fullTitle += ' ' + lines[i].text;
        }
        headerTitle = sanitizeText(fullTitle);
        continue;
      }
      if (/^Midterm Important/i.test(t) || (line.maxHeight >= topicMinHeight && /midterm important/i.test(t))) {
        subtitle = t;
        continue;
      }
      if (/^Total\s+(?:Questions|MCQs)\s*:\s*\d+/i.test(t)) {
        continue;
      }
    }

    const explicitQMatch = /^Q\s*(\d+)\.\s*(.+)$/i.exec(t);
    const numMatch = /^(\d+)\.\s*(.+)$/.exec(t);
    const ansMatch = /^Answer:\s*(.*)$/i.exec(t);

    // Determine whether this line starts a new subjective question
    let qMatch: RegExpExecArray | null = null;
    if (explicitQMatch) {
      qMatch = explicitQMatch;
    } else if (numMatch) {
      const qNum = parseInt(numMatch[1], 10);
      const isExpectedSequence = !currentItem
        ? qNum >= 1 && qNum <= 5
        : qNum === currentItem.number + 1;
      if (useBoldNumberRule) {
        if (line.boldCharRatio >= 0.45 && (isExpectedSequence || !currentItem?.inAnswer || qNum > (currentItem?.number || 0))) {
          qMatch = numMatch;
        }
      } else if (!currentItem || !currentItem.inAnswer || isExpectedSequence) {
        // When Answer: delimiter is used, allow 1. Question ... lines when not inside an Answer block or when sequentially numbered after an answer
        if (!currentItem?.inAnswer || isExpectedSequence) {
          qMatch = numMatch;
        }
      }
    }

    if (
      !qMatch &&
      !ansMatch &&
      line.maxHeight >= topicMinHeight &&
      line.maxHeight <= topicMaxHeight &&
      line.minX <= 80
    ) {
      let topicFull = t;
      while (
        i + 1 < lines.length &&
        lines[i + 1].page === line.page &&
        lines[i + 1].maxHeight >= topicMinHeight &&
        lines[i + 1].maxHeight <= topicMaxHeight &&
        !/^(?:Q\s*)?\d+\.\s+/i.test(lines[i + 1].text) &&
        !/^Answer:/i.test(lines[i + 1].text)
      ) {
        i++;
        topicFull += ' ' + lines[i].text;
      }
      flushItem();
      currentTopic = sanitizeText(topicFull);
      topicsSet.add(currentTopic);
      continue;
    }

    if (qMatch) {
      flushItem();
      topicsSet.add(currentTopic);
      currentItem = {
        number: parseInt(qMatch[1], 10),
        topic: currentTopic,
        questionParts: [qMatch[2].trim()],
        answerParts: [],
        inAnswer: false
      };
      continue;
    }

    if (ansMatch && currentItem) {
      currentItem.inAnswer = true;
      if (ansMatch[1].trim()) {
        currentItem.answerParts.push(ansMatch[1].trim());
      }
      continue;
    }

    if (currentItem) {
      // If document uses bold question stems without "Answer:" prefix, transition to answer when line drops to body font
      if (!currentItem.inAnswer && useBoldNumberRule && line.boldCharRatio < 0.45) {
        currentItem.inAnswer = true;
      }
      if (currentItem.inAnswer) {
        currentItem.answerParts.push(t);
      } else {
        currentItem.questionParts.push(t);
      }
    } else {
      extraLines.push(t);
    }
  }

  flushItem();

  const extractedCourseTitle =
    headerTitle.split(/—|--|-/).slice(1).join('—').trim() ||
    courseInfo?.title ||
    meta.courseCode;

  return {
    filename: meta.filename,
    slug: meta.filename,
    dataKey: meta.filename.replace(/\.pdf$/i, ''),
    courseCode: meta.courseCode,
    courseTitle: extractedCourseTitle,
    faculty: courseInfo?.faculty || 'Virtual University of Pakistan',
    kind: 'subjective',
    headerTitle,
    subtitle,
    pageCount,
    itemCount: subjective.length,
    topics: Array.from(topicsSet),
    subjective,
    ...(extraLines.length > 0 ? { extraLines } : {})
  };
}

async function runPool<T>(items: T[], concurrency: number, worker: (item: T, idx: number) => Promise<void>) {
  let cursor = 0;
  const workers = Array.from({ length: concurrency }, async () => {
    while (true) {
      const idx = cursor++;
      if (idx >= items.length) break;
      await worker(items[idx], idx);
    }
  });
  await Promise.all(workers);
}

async function main() {
  if (!fs.existsSync(LINKS_FILE)) {
    console.error(`❌ Missing ${LINKS_FILE}`);
    process.exit(1);
  }

  const links = parseDriveLinksFile();
  console.log(`📚 Parsed ${links.length} midterm PDF entries from ${LINKS_FILE}`);

  if (!fs.existsSync(TMP_PDF_DIR)) fs.mkdirSync(TMP_PDF_DIR, { recursive: true });
  if (!fs.existsSync(PUBLIC_DATA_DIR)) fs.mkdirSync(PUBLIC_DATA_DIR, { recursive: true });

  // Save private server-side Drive ID map (never exposed in public/ or src/data/)
  const serverMap: Record<string, { filename: string; driveId: string; courseCode: string; kind: 'mcqs' | 'subjective' }> = {};
  for (const item of links) {
    serverMap[item.filename.toLowerCase()] = {
      filename: item.filename,
      driveId: item.driveId,
      courseCode: item.courseCode,
      kind: item.kind
    };
  }
  fs.writeFileSync(SERVER_MAP_OUT, JSON.stringify(serverMap, null, 2), 'utf-8');
  console.log(`🔒 Wrote private server map (${Object.keys(serverMap).length} items) to .secrets/midterm-server-map.json`);

  // Step 1: Download all 664 PDFs into /tmp/midterm_pdfs
  let downloadedCount = 0;
  const downloadFailures: string[] = [];
  await runPool(links, 10, async (item, idx) => {
    const dest = path.join(TMP_PDF_DIR, item.filename);
    try {
      await downloadWithRetry(item.driveId, dest);
      downloadedCount++;
      if (downloadedCount % 50 === 0 || downloadedCount === links.length) {
        console.log(`⬇️  Downloaded ${downloadedCount}/${links.length} PDFs...`);
      }
    } catch (err) {
      downloadFailures.push(`${item.filename}: ${(err as Error).message}`);
      console.error(`❌ [${idx + 1}] ${item.filename}:`, (err as Error).message);
    }
  });

  if (downloadFailures.length > 0) {
    console.error(`❌ ${downloadFailures.length} downloads failed. Aborting before index generation.`);
    process.exit(1);
  }

  // Step 2: Parse every PDF into structured JSON
  const indexEntries: MidtermPrepIndexEntry[] = [];
  let totalMcqs = 0;
  let totalMcqsWithAnswers = 0;
  let totalSubjective = 0;
  const zeroItemFiles: string[] = [];

  let parsedCount = 0;
  await runPool(links, 6, async (item) => {
    const pdfPath = path.join(TMP_PDF_DIR, item.filename);
    const courseInfo = coursesMap.get(item.courseCode.toUpperCase());
    const { pageCount, lines, bodyFontSize } = await extractPdfLines(pdfPath);

    const docPayload =
      item.kind === 'mcqs'
        ? parseMcqDocument(item, pageCount, lines, bodyFontSize, courseInfo)
        : parseSubjectiveDocument(item, pageCount, lines, bodyFontSize, courseInfo);

    if (docPayload.itemCount === 0) {
      zeroItemFiles.push(item.filename);
    }

    if (docPayload.mcqs) {
      totalMcqs += docPayload.mcqs.length;
      totalMcqsWithAnswers += docPayload.mcqs.filter((q) => q.correctIndex !== null).length;
    }
    if (docPayload.subjective) {
      totalSubjective += docPayload.subjective.length;
    }

    const outJsonPath = path.join(PUBLIC_DATA_DIR, `${docPayload.dataKey}.json`);
    fs.writeFileSync(outJsonPath, JSON.stringify(docPayload), 'utf-8');

    const previewSnippet =
      item.kind === 'mcqs' && docPayload.mcqs && docPayload.mcqs.length > 0
        ? docPayload.mcqs[0].question.slice(0, 140)
        : item.kind === 'subjective' && docPayload.subjective && docPayload.subjective.length > 0
        ? docPayload.subjective[0].question.slice(0, 140)
        : docPayload.topics.slice(0, 3).join(' · ');

    indexEntries.push({
      filename: docPayload.filename,
      slug: docPayload.slug,
      dataKey: docPayload.dataKey,
      courseCode: docPayload.courseCode,
      courseTitle: docPayload.courseTitle,
      faculty: docPayload.faculty,
      kind: docPayload.kind,
      pageCount: docPayload.pageCount,
      itemCount: docPayload.itemCount,
      topics: docPayload.topics,
      previewSnippet
    });

    parsedCount++;
    if (parsedCount % 100 === 0 || parsedCount === links.length) {
      console.log(`📖 Extracted ${parsedCount}/${links.length} PDFs...`);
    }
  });

  indexEntries.sort((a, b) => {
    const codeCmp = a.courseCode.localeCompare(b.courseCode);
    if (codeCmp !== 0) return codeCmp;
    return a.kind.localeCompare(b.kind);
  });

  fs.writeFileSync(INDEX_OUT, JSON.stringify(indexEntries), 'utf-8');

  console.log('\n✅ EXTRACTION SUMMARY:');
  console.log(`   Files extracted: ${indexEntries.length}/${links.length}`);
  console.log(`   Total MCQs parsed: ${totalMcqs} (${totalMcqsWithAnswers} with bold correct answer = ${((totalMcqsWithAnswers / Math.max(1, totalMcqs)) * 100).toFixed(1)}%)`);
  console.log(`   Total Subjective Q&As parsed: ${totalSubjective}`);
  console.log(`   Zero-item files: ${zeroItemFiles.length}${zeroItemFiles.length ? ' -> ' + zeroItemFiles.join(', ') : ''}`);
  console.log(`   Manifest saved: ${INDEX_OUT}`);
  console.log(`   Per-file JSON dir: ${PUBLIC_DATA_DIR}`);
}

main().catch((err) => {
  console.error('Fatal extraction error:', err);
  process.exit(1);
});
