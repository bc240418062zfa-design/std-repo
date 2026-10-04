import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import { Readable } from 'stream';

const app = express();
const PORT = 3000;

app.use(express.json());

// Server Secrets
const DOWNLOAD_TOKEN_SECRET = process.env.DOWNLOAD_TOKEN_SECRET || 'mihora-download-token-dev-secret-key-2026';
const RESOURCE_MAP_PATH = path.resolve('.secrets/server-resource-map.json');

// In-memory nonce tracking for single-use download tokens
const usedNonces = new Set<string>();
const ipRequestCounts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string, limit = 100, windowMs = 60000): boolean {
  const now = Date.now();
  if (ipRequestCounts.size > 5000) {
    for (const [k, v] of ipRequestCounts.entries()) {
      if (now > v.resetAt) ipRequestCounts.delete(k);
    }
  }
  const entry = ipRequestCounts.get(ip);
  if (!entry || now > entry.resetAt) {
    ipRequestCounts.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

// Extraction helper for raw index line parsing
function parseRawLineToRecord(line: string): { rlh: string; driveId: string; safeName: string; format: string; course: string; link: string } | null {
  if (line.startsWith('- ')) line = line.slice(2).trim();
  const m = line.match(/^COURSE=([^\s]+)\s+NAME=(.+?)\s+FORMAT=([^\s]+)\s+TYPE=([^\s]+)\s+TAGS=([^\s]+)\s+LINK=([^\s]+)$/);
  if (!m) return null;
  const course = m[1].toUpperCase();
  if (course.startsWith('<')) return null;
  const safeName = m[2].trim();
  const format = m[3].toUpperCase();
  const link = m[6].trim();
  const fileDMatch = link.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  const driveId = fileDMatch ? fileDMatch[1] : '';
  if (!driveId) return null;

  const hmac = crypto.createHmac('sha256', process.env.RLH_MASTER_SECRET || 'mihora-rlh-secret-salt-2026-secure-key');
  hmac.update(`mihora_res:${driveId}`);
  const rlh = `r_${hmac.digest('hex').substring(0, 16)}`;

  return { rlh, driveId, safeName, format, course, link };
}

// Load server-side resource mapping with auto-recovery
let serverResourceMap: Record<string, { rlh: string; driveId: string; safeName: string; format: string; course: string; link?: string }> = {};

function initServerResourceMap() {
  if (fs.existsSync(RESOURCE_MAP_PATH)) {
    try {
      serverResourceMap = JSON.parse(fs.readFileSync(RESOURCE_MAP_PATH, 'utf-8'));
      if (Object.keys(serverResourceMap).length > 0) return;
    } catch (err) {
      console.error('Failed to load server resource map from cache:', err);
    }
  }

  // Resilient fallback: parse canonical source if cached file is missing
  const masterPath = path.resolve('VU_Mega_Index_Bot.md');
  if (fs.existsSync(masterPath)) {
    console.log('🔄 Building server resource mapping from canonical source:', masterPath);
    try {
      const content = fs.readFileSync(masterPath, 'utf-8');
      const lines = content.split(/\r?\n/);
      for (const line of lines) {
        if (!line.includes('COURSE=') || !line.includes('NAME=') || !line.includes('LINK=')) continue;
        const rec = parseRawLineToRecord(line);
        if (rec) serverResourceMap[rec.rlh] = rec;
      }
      console.log(`✅ Loaded ${Object.keys(serverResourceMap).length} verified records into server memory.`);
      // Cache to disk
      const dir = path.dirname(RESOURCE_MAP_PATH);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(RESOURCE_MAP_PATH, JSON.stringify(serverResourceMap), 'utf-8');
    } catch (parseErr) {
      console.error('Failed to parse canonical index:', parseErr);
    }
  }
}

initServerResourceMap();

// Safe filename sanitizer against path traversal, header injection & CRLF
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[\r\n\0]/g, '')
    .replace(/[/\\]/g, '_')
    .replace(/["']/g, '')
    .replace(/\.\.+/g, '.')
    .trim() || 'study-resource';
}

// HMAC Token Generator
function generateDownloadToken(payloadStr: string): string {
  const sig = crypto.createHmac('sha256', DOWNLOAD_TOKEN_SECRET).update(payloadStr).digest('hex').substring(0, 32);
  const encodedPayload = Buffer.from(payloadStr).toString('base64url');
  return `dt_${encodedPayload}.${sig}`;
}

// Timing-Safe HMAC Token Verifier
function verifyDownloadToken(token: string): { valid: boolean; payload?: string; reason?: string } {
  if (!token || typeof token !== 'string' || !token.startsWith('dt_')) {
    return { valid: false, reason: 'Invalid token prefix' };
  }
  const parts = token.slice(3).split('.');
  if (parts.length !== 2) return { valid: false, reason: 'Malformed token structure' };

  const [encodedPayload, clientSig] = parts;
  if (!encodedPayload || !clientSig || clientSig.length !== 32) {
    return { valid: false, reason: 'Malformed signature format' };
  }

  let payloadStr = '';
  try {
    payloadStr = Buffer.from(encodedPayload, 'base64url').toString('utf-8');
  } catch {
    return { valid: false, reason: 'Malformed payload encoding' };
  }

  const expectedSig = crypto.createHmac('sha256', DOWNLOAD_TOKEN_SECRET).update(payloadStr).digest('hex').substring(0, 32);

  const clientSigBuf = Buffer.from(clientSig, 'hex');
  const expectedSigBuf = Buffer.from(expectedSig, 'hex');

  if (clientSigBuf.length !== expectedSigBuf.length || !crypto.timingSafeEqual(clientSigBuf, expectedSigBuf)) {
    return { valid: false, reason: 'Cryptographic signature mismatch' };
  }

  return { valid: true, payload: payloadStr };
}

// Rate limit & security header middleware
app.use((req, res, next) => {
  const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please slow down.' });
  }

  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  next();
});

// Reject arbitrary proxy parameters globally (Anti-SSRF & Anti-Proxy abuse)
app.use((req, res, next) => {
  if (req.query.url || req.query.driveId || req.query.fileId || req.query.drive || req.body?.url || req.body?.driveId) {
    return res.status(400).json({ error: 'Invalid parameter. Arbitrary queries are forbidden.' });
  }
  next();
});

// Relay Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'mihora-study-relay-proxy',
    environment: 'production-ready',
    activeSessions: usedNonces.size,
    indexedRecords: Object.keys(serverResourceMap).length
  });
});

// 1. Stage 1: Resolve RLH to short-lived signed token (POST /api/resolve)
app.post('/api/resolve', (req: Request, res: Response) => {
  const { rlh } = req.body || {};

  // Strict anti-enumeration validation: exact r_[16 hex chars]
  if (!rlh || typeof rlh !== 'string' || !/^r_[a-f0-9]{16}$/i.test(rlh)) {
    return res.status(400).json({ error: 'Resource locator format is invalid.' });
  }

  const resource = serverResourceMap[rlh];
  if (!resource) {
    // Zero-fabrication: Never invent fake tokens for non-existent resources
    return res.status(404).json({ error: 'Resource not found in library index.' });
  }

  const now = Math.floor(Date.now() / 1000);
  const expiresIn = 120;
  const exp = now + expiresIn;
  const nonce = crypto.randomBytes(8).toString('hex');
  const payload = `${rlh}:${now}:${exp}:${nonce}:single`;
  const token = generateDownloadToken(payload);

  return res.json({
    ok: true,
    token,
    expiresIn,
    downloadUrl: `/api/download?token=${encodeURIComponent(token)}`,
    resource: {
      name: resource.safeName,
      format: resource.format,
      course: resource.course
    }
  });
});

// Real Google Drive streaming helper (zero dummy documents)
async function fetchDriveStream(driveId: string): Promise<{ ok: boolean; stream?: ReadableStream<Uint8Array>; contentType?: string; contentLength?: string | null }> {
  const directUrl = `https://drive.usercontent.google.com/download?id=${encodeURIComponent(driveId)}&export=download&confirm=t`;
  const ucUrl = `https://drive.google.com/uc?export=download&id=${encodeURIComponent(driveId)}&confirm=t`;

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': '*/*'
  };

  try {
    let driveRes = await fetch(directUrl, { headers, redirect: 'follow' });
    if (!driveRes.ok || !driveRes.body) {
      driveRes = await fetch(ucUrl, { headers, redirect: 'follow' });
    }
    if (driveRes.ok && driveRes.body) {
      return {
        ok: true,
        stream: driveRes.body,
        contentType: driveRes.headers.get('content-type') || undefined,
        contentLength: driveRes.headers.get('content-length')
      };
    }
  } catch (err) {
    console.error(`Failed to fetch Drive ID ${driveId}:`, err);
  }
  return { ok: false };
}

// 2. Stage 2: Stream File via Token (GET /api/download)
app.get('/api/download', async (req: Request, res: Response) => {
  const token = req.query.token as string;
  if (!token) {
    return res.status(400).send('Missing download session token.');
  }

  const verification = verifyDownloadToken(token);
  if (!verification.valid || !verification.payload) {
    return res.status(403).send(`Unauthorized: ${verification.reason || 'Invalid download session'}`);
  }

  const [rlh, iatStr, expStr, nonce] = verification.payload.split(':');
  const now = Math.floor(Date.now() / 1000);
  const exp = parseInt(expStr, 10);

  if (now > exp) {
    return res.status(410).send('Download session expired. Please return to the library and click download again.');
  }

  if (usedNonces.has(nonce)) {
    return res.status(409).send('This download token has already been consumed. One-time link expired.');
  }
  usedNonces.add(nonce);
  if (usedNonces.size > 20000) usedNonces.clear();

  const record = serverResourceMap[rlh];
  if (!record || !record.driveId) {
    return res.status(404).send('Resource file not found in library index.');
  }

  const safeName = record.safeName || `Mihora_Resource_${rlh}.pdf`;
  const format = (record.format || 'PDF').toLowerCase();

  let contentType = 'application/pdf';
  if (format === 'doc' || format === 'docx' || safeName.endsWith('.docx') || safeName.endsWith('.doc')) {
    contentType = safeName.endsWith('.docx')
      ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      : 'application/msword';
  } else if (format === 'ppt' || format === 'pptx' || safeName.endsWith('.pptx') || safeName.endsWith('.ppt')) {
    contentType = safeName.endsWith('.pptx')
      ? 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      : 'application/vnd.ms-powerpoint';
  } else if (format === 'archive' || format === 'zip' || safeName.endsWith('.zip')) {
    contentType = 'application/zip';
  } else if (format === 'image' || safeName.match(/\.(png|jpe?g|gif|webp)$/i)) {
    const ext = safeName.split('.').pop()?.toLowerCase();
    contentType = ext === 'png' ? 'image/png' : 'image/jpeg';
  } else if (format === 'xls' || safeName.match(/\.xlsx?$/i)) {
    contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  } else if (format === 'txt' || safeName.endsWith('.txt')) {
    contentType = 'text/plain; charset=utf-8';
  }

  // Stream actual real file from Google Drive via direct proxy
  try {
    const isInline = req.query.inline === '1' || req.query.preview === '1';
    const driveResult = await fetchDriveStream(record.driveId);
    if (driveResult.ok && driveResult.stream) {
      res.setHeader('Content-Type', driveResult.contentType || contentType);
      res.setHeader('Content-Disposition', `${isInline ? 'inline' : 'attachment'}; filename="${encodeURIComponent(safeName)}"`);
      res.setHeader('Cache-Control', 'private, no-store');
      if (driveResult.contentLength) {
        res.setHeader('Content-Length', driveResult.contentLength);
      }
      Readable.fromWeb(driveResult.stream as any).pipe(res);
      return;
    }
  } catch (streamErr) {
    console.error('Streaming error from Google Drive:', streamErr);
  }

  return res.status(502).send('Unable to retrieve file from source storage. Please try again shortly.');
});

// 3. Multi-Download Resolution (POST /api/resolve-multi)
app.post('/api/resolve-multi', (req: Request, res: Response) => {
  const { rlhs, zipName } = req.body || {};

  if (!Array.isArray(rlhs) || rlhs.length === 0 || rlhs.length > 50) {
    return res.status(400).json({ error: 'Please select between 1 and 50 resources for ZIP generation.' });
  }

  // Validate all RLHs
  for (const rlh of rlhs) {
    if (typeof rlh !== 'string' || !rlh.startsWith('r_')) {
      return res.status(400).json({ error: 'One or more resource locators are invalid.' });
    }
  }

  const now = Math.floor(Date.now() / 1000);
  const expiresIn = 180; // 3 minutes for multi-download
  const exp = now + expiresIn;
  const nonce = crypto.randomBytes(8).toString('hex');
  const payload = `${rlhs.join(',')}:${now}:${exp}:${nonce}:multi:${zipName || 'Mihora_Resources'}`;
  const token = generateDownloadToken(payload);

  return res.json({
    ok: true,
    token,
    expiresIn,
    count: rlhs.length,
    downloadUrl: `/api/download-multi?token=${encodeURIComponent(token)}`
  });
});

// 4. Multi-Download Stream ZIP (GET /api/download-multi)
app.get('/api/download-multi', async (req: Request, res: Response) => {
  const token = req.query.token as string;
  if (!token) return res.status(400).send('Missing multi-download token.');

  const verification = verifyDownloadToken(token);
  if (!verification.valid || !verification.payload) {
    return res.status(403).send('Unauthorized token.');
  }

  const [rlhsStr, iatStr, expStr, nonce, mode, zipLabel] = verification.payload.split(':');
  const now = Math.floor(Date.now() / 1000);
  if (now > parseInt(expStr, 10)) {
    return res.status(410).send('Multi-download session expired.');
  }

  if (usedNonces.has(nonce)) {
    return res.status(409).send('Multi-download token already consumed.');
  }
  usedNonces.add(nonce);

  const rlhs = rlhsStr.split(',');
  const zip = new JSZip();

  for (let i = 0; i < rlhs.length; i++) {
    const rlh = rlhs[i];
    const record = serverResourceMap[rlh];
    if (!record || !record.driveId) continue;
    const safeName = record.safeName || `Resource_${i + 1}_${rlh}.pdf`;

    try {
      const driveRes = await fetch(`https://drive.usercontent.google.com/download?id=${encodeURIComponent(record.driveId)}&export=download&confirm=t`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        },
        redirect: 'follow'
      });
      if (driveRes.ok) {
        const arrayBuf = await driveRes.arrayBuffer();
        zip.file(safeName, Buffer.from(arrayBuf));
      }
    } catch (err) {
      console.warn(`Failed to fetch file for zip: ${safeName}`, err);
    }
  }

  const safeZipName = `${zipLabel || 'Mihora_Selected_Resources'}.zip`;
  const zipContent = await zip.generateAsync({ type: 'nodebuffer' });

  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(safeZipName)}"`);
  res.setHeader('Cache-Control', 'private, no-store');
  res.send(zipContent);
});

// Vite Middleware Integration
async function startServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌐 MIHORA STUDY LIBRARY server running at http://0.0.0.0:${PORT}`);
    console.log(`🔒 Secure relay endpoints mounted on /api/resolve and /api/download`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
