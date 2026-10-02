/**
 * Client-Side Encrypted Shard Resolver (Bundled via Vite Dynamic Imports)
 * 
 * Guarantees zero 404 errors on static hosts (GitHub Pages) by bundling
 * AES-256-GCM encrypted shards directly into Vite code-split chunks.
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

// In-memory cache for decrypted shards
const shardCache = new Map<string, Record<string, any>>();
const pendingShardFetches = new Map<string, Promise<Record<string, any>>>();

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

async function sha256Hex(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

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

const SHARD_MASTER_KEY = 'a9f8fe4633851740d710a6772988ccb72c9613d016abbbbbf628a83337fdeb90';

async function loadShard(shardKey: string): Promise<Record<string, any>> {
  if (shardCache.has(shardKey)) {
    return shardCache.get(shardKey)!;
  }

  if (pendingShardFetches.has(shardKey)) {
    return pendingShardFetches.get(shardKey)!;
  }

  const fetchPromise = (async () => {
    let rawData: any = null;

    try {
      switch (shardKey) {
        case '0': rawData = await import('../data/shards/shard-0.json'); break;
        case '1': rawData = await import('../data/shards/shard-1.json'); break;
        case '2': rawData = await import('../data/shards/shard-2.json'); break;
        case '3': rawData = await import('../data/shards/shard-3.json'); break;
        case '4': rawData = await import('../data/shards/shard-4.json'); break;
        case '5': rawData = await import('../data/shards/shard-5.json'); break;
        case '6': rawData = await import('../data/shards/shard-6.json'); break;
        case '7': rawData = await import('../data/shards/shard-7.json'); break;
        case '8': rawData = await import('../data/shards/shard-8.json'); break;
        case '9': rawData = await import('../data/shards/shard-9.json'); break;
        case 'a': rawData = await import('../data/shards/shard-a.json'); break;
        case 'b': rawData = await import('../data/shards/shard-b.json'); break;
        case 'c': rawData = await import('../data/shards/shard-c.json'); break;
        case 'd': rawData = await import('../data/shards/shard-d.json'); break;
        case 'e': rawData = await import('../data/shards/shard-e.json'); break;
        case 'f': rawData = await import('../data/shards/shard-f.json'); break;
        default:
          throw new Error(`Unknown shard key: ${shardKey}`);
      }
    } catch (err) {
      throw new Error(`Failed to load resource shard (${shardKey}): ${err}`);
    }

    const shardPayload = rawData.default || rawData;

    if (!shardPayload || !shardPayload.ciphertext || !shardPayload.iv || !shardPayload.tag) {
      throw new Error(`Invalid shard payload for (${shardKey})`);
    }

    const decryptedStr = await decryptShardGCM(
      shardPayload.ciphertext,
      shardPayload.iv,
      shardPayload.tag,
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

function buildDirectDownloadUrl(driveId: string): string {
  const domainParts = ['https://', 'drive.', 'usercontent.', 'google.', 'com'];
  const endpoint = `${domainParts.join('')}/download?id=${encodeURIComponent(driveId)}&export=download&confirm=t`;
  return endpoint;
}

export async function resolveResourceLocally(rlh: string): Promise<ResolvedResource> {
  if (!rlh || typeof rlh !== 'string') {
    throw new Error('Invalid resource locator hash.');
  }

  const hash = await sha256Hex(rlh);
  const shardKey = hash[0];

  const shard = await loadShard(shardKey);

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
