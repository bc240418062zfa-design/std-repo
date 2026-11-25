import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

interface MidtermRecord {
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

interface SecretMidtermMapEntry {
  rlh: string;
  driveId: string;
  filename: string;
  courseCode: string;
  type: 'OBJECTIVE' | 'SUBJECTIVE';
  slug: string;
}

function generateRlh(driveId: string): string {
  const hmac = crypto.createHmac('sha256', process.env.RLH_MASTER_SECRET || 'mihora-rlh-secret-salt-2026-secure-key');
  hmac.update(`mihora_midterm:${driveId}`);
  return `r_mid_${hmac.digest('hex').substring(0, 16)}`;
}

export function compileMidtermData() {
  const sourcePath = path.resolve('scripts/data/MIHORA-Drive-File-Links.txt'); // kept OUT of public/ so raw Drive links are never shipped in the static build
  if (!fs.existsSync(sourcePath)) {
    console.error('Source file not found:', sourcePath);
    process.exit(1);
  }

  const content = fs.readFileSync(sourcePath, 'utf-8');
  const lines = content.split(/\r?\n/);

  const clientRecords: MidtermRecord[] = [];
  const secretMap: Record<string, SecretMidtermMapEntry> = {};
  const secretFilenameMap: Record<string, SecretMidtermMapEntry> = {};

  let currentSection: 'OBJECTIVE' | 'SUBJECTIVE' = 'OBJECTIVE';

  let pendingFilename = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (line.includes('SUBJECTIVE PDFs')) {
      currentSection = 'SUBJECTIVE';
      continue;
    }
    if (line.includes('OBJECTIVE (MCQ PDFs)')) {
      currentSection = 'OBJECTIVE';
      continue;
    }

    // Match lines like: "1. ACC311-Midterm-Important-MCQs.pdf" or "ACC311-Midterm-Important-MCQs.pdf"
    const fileMatch = line.match(/^(?:\d+\.\s*)?([A-Za-z0-9_-]+\.pdf)$/i);
    if (fileMatch) {
      pendingFilename = fileMatch[1].trim();
      continue;
    }

    // Match drive URL: "https://drive.google.com/file/d/1Y6CRjsLtXOzNYxF93akwQ5CJBhFJSjCy/view"
    const linkMatch = line.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (linkMatch && pendingFilename) {
      const driveId = linkMatch[1];
      const filename = pendingFilename;
      pendingFilename = '';

      // Extract course code
      const codeMatch = filename.match(/^([a-zA-Z]{2,4}\d{3})/i);
      const courseCode = codeMatch ? codeMatch[1].toUpperCase() : 'VU';

      const isMcq = currentSection === 'OBJECTIVE' || filename.toLowerCase().includes('mcq');
      const type: 'OBJECTIVE' | 'SUBJECTIVE' = isMcq ? 'OBJECTIVE' : 'SUBJECTIVE';

      const baseName = filename.replace(/\.pdf$/i, '');
      const slug = baseName.toLowerCase();
      const rlh = generateRlh(driveId);

      const title = type === 'OBJECTIVE'
        ? `${courseCode} Midterm Important Solved MCQs (Lectures 1–22)`
        : `${courseCode} Midterm Important Subjective Solved Questions (Lectures 1–22)`;

      // Deterministic page estimate between 14 and 28
      let hashNum = 0;
      for (let c = 0; c < filename.length; c++) hashNum = (hashNum * 31 + filename.charCodeAt(c)) % 15;
      const estimatedPages = 14 + hashNum;

      const record: MidtermRecord = {
        id: slug,
        slug,
        filename,
        courseCode,
        type,
        format: 'PDF',
        title,
        termScope: 'Midterm (Lectures 1–22)',
        rlh,
        estimatedPages
      };

      const secretEntry: SecretMidtermMapEntry = {
        rlh,
        driveId,
        filename,
        courseCode,
        type,
        slug
      };

      clientRecords.push(record);
      secretMap[rlh] = secretEntry;
      secretFilenameMap[filename.toLowerCase()] = secretEntry;
      secretFilenameMap[slug] = secretEntry;
    }
  }

  console.log(`Parsed ${clientRecords.length} midterm files (${clientRecords.filter(r => r.type === 'OBJECTIVE').length} Objective, ${clientRecords.filter(r => r.type === 'SUBJECTIVE').length} Subjective).`);

  // Write client data
  const clientOutPath = path.resolve('src/data/midtermFiles.json');
  fs.writeFileSync(clientOutPath, JSON.stringify(clientRecords, null, 2), 'utf-8');
  console.log(`Saved client data to ${clientOutPath}`);

  // Write secret maps
  const secretOutPath = path.resolve('.secrets/server-midterm-map.json');
  fs.writeFileSync(secretOutPath, JSON.stringify({ rlhMap: secretMap, filenameMap: secretFilenameMap }, null, 2), 'utf-8');
  console.log(`Saved server secret map to ${secretOutPath}`);

  // Generate public/sitemap-midterm.xml
  const sitemapLines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    '  <url>',
    '    <loc>https://study.mihora.tech/midterm-prep</loc>',
    '    <lastmod>2026-11-24</lastmod>',
    '    <changefreq>weekly</changefreq>',
    '    <priority>0.9</priority>',
    '  </url>'
  ];

  for (const rec of clientRecords) {
    const pageUrl = `https://study.mihora.tech/midterm-prep/${encodeURIComponent(rec.filename)}`;
    sitemapLines.push(
      '  <url>',
      `    <loc>${pageUrl}</loc>`,
      '    <lastmod>2026-11-24</lastmod>',
      '    <changefreq>monthly</changefreq>',
      '    <priority>0.85</priority>',
      '  </url>'
    );
  }
  sitemapLines.push('</urlset>');

  const sitemapOutPath = path.resolve('public/sitemap-midterm.xml');
  fs.writeFileSync(sitemapOutPath, sitemapLines.join('\n'), 'utf-8');
  console.log(`Generated sitemap at ${sitemapOutPath} with ${clientRecords.length + 1} URLs.`);
}

compileMidtermData();
