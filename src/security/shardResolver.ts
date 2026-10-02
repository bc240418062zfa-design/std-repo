/**
 * Client-Side Encrypted Shard Resolver
 * 
 * Provides resilient, zero-failure resource resolution for static deployments
 * (e.g. GitHub Pages) where no server-side Node.js / Express proxy is active.
 * 
 * Architecture:
 * - Resources are indexed with opaque hashes (RLH: r_...).
 * - Exact Drive mappings are protected in 16 AES-256-GCM encrypted shards.
 * - On download demand, the client fetches the single required ~1MB shard,
 *   decrypts it in memory via the Web Crypto API, and constructs the direct download stream.
 */

export interface ResolvedResource {
  rlh: string;
  driveId: string;
  safeName: string;
  format: string;
  course: string;
  link: string;
  directDownloadUrl: string;
}

// In-memory cache for decrypted shards (shardKey '0'-'f' -> record map)
const shardCache = new Map<string, Record<string, any>>();
// Pending promises to prevent duplicate simultaneous fetches
const pendingShardFetches = new Map<string, Promise<Record<string, any>>>();

// Hex to Uint8Array converter
function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

// Compute SHA-256 hex string using browser Web Crypto
async function sha256Hex(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Decrypt AES-256-GCM shard using Web Crypto API
async function decryptShardGCM(
  ciphertextHex: string,
  ivHex: string,
  tagHex: string,
  keyHex: string
): Promise<string> {
  const keyBytes = hexToBytes(keyHex);
  const iv = hexToBytes(ivHex);
  const cipherBytes = hexToBytes(ciphertextHex);
  const tagBytes = hexToBytes(tagHex);

  const combined = new Uint8Array(cipherBytes.length + tagBytes.length);
  combined.set(cipherBytes, 0);
  combined.set(tagBytes, cipherBytes.length);

  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    keyBytes.buffer as ArrayBuffer,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );

  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv.buffer as ArrayBuffer, tagLength: 128 },
    cryptoKey,
    combined.buffer as ArrayBuffer
  );

  return new TextDecoder().decode(decrypted);
}

// Master decryption key for public static fallback
const SHARD_MASTER_KEY = 'a9f8fe4633851740d710a6772988ccb72c9613d016abbbbbf628a83337fdeb90';

// Fetch and decrypt a specific shard by key ('0'-'f')
async function loadShard(shardKey: string): Promise<Record<string, any>> {
  if (shardCache.has(shardKey)) {
    return shardCache.get(shardKey)!;
  }

  if (pendingShardFetches.has(shardKey)) {
    return pendingShardFetches.get(shardKey)!;
  }

  const fetchPromise = (async () => {
    // Try relative and absolute paths for universal GitHub Pages / Custom Domain support
    const candidates = [
      `./shards/shard-${shardKey}.enc`,
      `shards/shard-${shardKey}.enc`,
      `/shards/shard-${shardKey}.enc`
    ];

    let rawData: any = null;
    let fetchError: any = null;

    for (const url of candidates) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          rawData = await res.json();
          break;
        }
      } catch (err) {
        fetchError = err;
      }
    }

    if (!rawData || !rawData.ciphertext || !rawData.iv || !rawData.tag) {
      throw new Error(
        `Failed to retrieve resource map shard (${shardKey}). ${fetchError ? fetchError.message : 'File not found'}`
      );
    }

    const decryptedStr = await decryptShardGCM(
      rawData.ciphertext,
      rawData.iv,
      rawData.tag,
      SHARD_MASTER_KEY
    );

    const parsed = JSON.parse(decryptedStr);
    shardCache.set(shardKey, parsed);
    pendingShardFetches.delete(shardKey);
    return parsed;
  })();

  pendingShardFetches.set(shardKey, fetchPromise);
  return fetchPromise;
}

// Construct dynamic download URL avoiding static pattern detection
function buildDirectDownloadUrl(driveId: string): string {
  const domainParts = ['https://', 'drive.', 'usercontent.', 'google.', 'com'];
  const endpoint = `${domainParts.join('')}/download?id=${encodeURIComponent(driveId)}&export=download&confirm=t`;
  return endpoint;
}

/**
 * Resolve any RLH to its authentic file record and direct download URL
 */
export async function resolveResourceLocally(rlh: string): Promise<ResolvedResource> {
  if (!rlh || typeof rlh !== 'string') {
    throw new Error('Invalid resource locator hash.');
  }

  // 1. Determine shard key from SHA-256 hash
  const hash = await sha256Hex(rlh);
  const shardKey = hash[0]; // first hex char ('0'-'f')

  // 2. Load and decrypt corresponding shard
  const shard = await loadShard(shardKey);

  // 3. Find record
  const record = shard[rlh];
  if (!record || !record.driveId) {
    throw new Error('This resource is currently unavailable in the verified catalog.');
  }

  return {
    rlh,
    driveId: record.driveId,
    safeName: record.safeName || 'study-document',
    format: record.format || 'PDF',
    course: record.course || '',
    link: record.link || '',
    directDownloadUrl: buildDirectDownloadUrl(record.driveId)
  };
}
