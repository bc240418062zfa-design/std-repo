import fs from 'fs';
import path from 'path';

interface RawCourseMeta {
  code: string;
  title: string;
  faculty: string;
}

export interface ReviewItem {
  id: string;
  reviewNum: number;
  sharedBy: string;
  date: string;
  time: string;
  message: string;
  keyPoints: string[];
}

export interface CourseReviewSummary {
  code: string;
  title: string;
  faculty: string;
  reviewCount: number;
  latestDate: string;
  sampleTopics: string[];
}

const repoPath = '/tmp/past-papers-2026-mids';
const outDir = path.resolve('src/data/reviews');
const coursesDir = path.join(outDir, 'courses');

if (!fs.existsSync(coursesDir)) {
  fs.mkdirSync(coursesDir, { recursive: true });
}

// Load courses.json for accurate faculty & titles
const coursesList: RawCourseMeta[] = JSON.parse(
  fs.readFileSync(path.resolve('src/data/courses.json'), 'utf-8')
);
const courseMap = new Map<string, RawCourseMeta>(coursesList.map((c) => [c.code.toUpperCase(), c]));

function getFacultyForCode(code: string): string {
  if (code.startsWith('CS') || code.startsWith('IT') || code.startsWith('SE') || code.startsWith('CCS')) return 'Computer Science & IT';
  if (code.startsWith('MTH')) return 'Mathematics';
  if (code.startsWith('ENG')) return 'English';
  if (code.startsWith('MGT') || code.startsWith('MGMT') || code.startsWith('HRM') || code.startsWith('FIN') || code.startsWith('ACC') || code.startsWith('BNK')) return 'Management & Commerce';
  if (code.startsWith('ECO')) return 'Economics';
  if (code.startsWith('STA')) return 'Statistics';
  if (code.startsWith('PHY')) return 'Physics';
  if (code.startsWith('BIO') || code.startsWith('BT') || code.startsWith('BIF') || code.startsWith('ZOO') || code.startsWith('MIC')) return 'Biological Sciences';
  if (code.startsWith('ISL') || code.startsWith('ETH')) return 'Islamic Studies & Ethics';
  if (code.startsWith('PAK')) return 'Pakistan Studies';
  if (code.startsWith('PSY')) return 'Psychology';
  if (code.startsWith('SOC')) return 'Sociology';
  if (code.startsWith('MCM') || code.startsWith('MC')) return 'Mass Communication';
  if (code.startsWith('EDU')) return 'Education';
  if (code.startsWith('URD')) return 'Urdu';
  return 'General Academic';
}

function parseAndDedupeReviews(courseCode: string, text: string): ReviewItem[] {
  const reviewBlocks = text.split(/📝\s*\*REVIEW\s*#(\d+)\*/i);
  const reviews: ReviewItem[] = [];
  const seen = new Set<string>();

  for (let i = 1; i < reviewBlocks.length; i += 2) {
    const block = reviewBlocks[i + 1] || '';

    // Author
    const authorMatch = block.match(/👤\s*\*Shared by:\*\s*([^\n\r]+)/i);
    const sharedBy = authorMatch ? authorMatch[1].trim().replace(/^\*/, '').replace(/\*$/, '') : 'VU Student';

    // Date & Time
    const dateMatch = block.match(/📅\s*\*Date:\*\s*([0-9\/-]+)/i);
    const date = dateMatch ? dateMatch[1].trim() : '2026 Mids';

    const timeMatch = block.match(/⏰\s*([0-9:]+\s*[APMapm]+)/i);
    const time = timeMatch ? timeMatch[1].trim() : '';

    // Message
    let message = '';
    const quoteMatch = block.match(/💬\s*"([^"]+)"/s);
    if (quoteMatch) {
      message = quoteMatch[1].trim();
    } else {
      const msgMatch = block.match(/💬\s*([^\n\r]+(?:\n[^\n\r*📍✨]+)*)/);
      if (msgMatch) message = msgMatch[1].trim().replace(/^"|"$/g, '');
    }

    // Sanitize any raw drive or storage links from message for zero-leak audit compliance
    message = message
      .replace(/https?:\/\/drive\.google\.com\/[^\s"')]+/gi, '[Verified Student Reference Attachment]')
      .replace(/https?:\/\/[a-z0-9.-]+\.googleusercontent\.com\/[^\s"')]+/gi, '[Verified Student Reference Attachment]');

    // Key points
    const keyPoints: string[] = [];
    const pointsMatches = block.matchAll(/📍\s*([^\n\r]+)/g);
    for (const pm of pointsMatches) {
      const pt = pm[1].trim();
      if (pt && !pt.toLowerCase().includes('questions i remember') && !pt.toLowerCase().includes('topics:')) {
        keyPoints.push(pt);
      }
    }

    if (!message && keyPoints.length === 0) {
      const cleanBlock = block
        .replace(/👤[^\n\r]+/g, '')
        .replace(/📅[^\n\r]+/g, '')
        .replace(/✨[^\n\r]+/g, '')
        .trim();
      if (cleanBlock.length > 10) {
        message = cleanBlock.substring(0, 500);
      }
    }

    if (message || keyPoints.length > 0) {
      // Signature for deduplication
      const sig = `${sharedBy}:::${date}:::${message.substring(0, 70)}:::${keyPoints.slice(0, 2).join(',')}`;
      if (seen.has(sig)) continue;
      seen.add(sig);

      const reviewNum = reviews.length + 1;
      reviews.push({
        id: `${courseCode}-r${reviewNum}`,
        reviewNum,
        sharedBy: sharedBy || 'Verified VU Student',
        date,
        time,
        message,
        keyPoints
      });
    }
  }

  return reviews;
}

export function importAllReviews() {
  console.log('🔄 Importing and deduplicating past papers & reviews from repository...');
  if (!fs.existsSync(repoPath)) {
    console.error('❌ Repository path not found:', repoPath);
    return;
  }

  const files = fs.readdirSync(repoPath).filter((f) => f.endsWith('.txt'));
  const indexEntries: CourseReviewSummary[] = [];
  let totalReviewsCount = 0;

  for (const file of files) {
    const code = file.replace(/\.txt$/i, '').trim().toUpperCase();
    const text = fs.readFileSync(path.join(repoPath, file), 'utf-8');
    const reviews = parseAndDedupeReviews(code, text);

    if (reviews.length === 0) continue;

    totalReviewsCount += reviews.length;
    const courseMeta = courseMap.get(code);
    const title = courseMeta
      ? courseMeta.title
      : code === 'UNKNOWN'
      ? 'General & Untagged Exam Reviews'
      : `${code} Exam Questions & Papers`;
    const faculty = courseMeta ? courseMeta.faculty : getFacultyForCode(code);

    // Extract sample topics
    const topicSet = new Set<string>();
    for (const r of reviews) {
      for (const kp of r.keyPoints) {
        const shortKp = kp.split(/[\(\:\,\.\-]/)[0].trim();
        if (shortKp.length > 3 && shortKp.length < 35 && !topicSet.has(shortKp)) {
          topicSet.add(shortKp);
          if (topicSet.size >= 5) break;
        }
      }
      if (topicSet.size >= 5) break;
    }

    const sampleTopics = Array.from(topicSet);

    indexEntries.push({
      code,
      title,
      faculty,
      reviewCount: reviews.length,
      latestDate: reviews[0]?.date || '2026',
      sampleTopics
    });

    // Save individual course shard
    const shardPath = path.join(coursesDir, `${code}.json`);
    fs.writeFileSync(shardPath, JSON.stringify(reviews), 'utf-8');
  }

  // Sort by review count descending
  indexEntries.sort((a, b) => b.reviewCount - a.reviewCount);

  // Write lightweight index.json
  fs.writeFileSync(path.join(outDir, 'index.json'), JSON.stringify(indexEntries, null, 2), 'utf-8');

  console.log(`✅ Successfully generated reviews archive for ${indexEntries.length} courses!`);
  console.log(`✅ Stored ${totalReviewsCount} high-yield, unique student exam reviews.`);
}

importAllReviews();
