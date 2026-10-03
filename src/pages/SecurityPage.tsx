import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Cpu, 
  Server, 
  Database, 
  EyeOff, 
  Key, 
  CheckCircle2, 
  ArrowRight, 
  FileCode2, 
  Layers, 
  Terminal,
  ExternalLink
} from 'lucide-react';
import { MihoraLogo } from '../components/MihoraLogo';

export const SecurityPage: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  const [testRlh, setTestRlh] = useState('r_919d3fbc9b7b99c0');
  const [calculatedShard, setCalculatedShard] = useState<string | null>('4');
  const [isCalculating, setIsCalculating] = useState(false);

  // Real SHA-256 Shard key calculator demonstration
  const handleTestShard = async () => {
    if (!testRlh || !testRlh.startsWith('r_')) return;
    setIsCalculating(true);
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(testRlh);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      const shardKey = hashHex[0]; // First character (0-f)
      setCalculatedShard(shardKey);
    } catch {
      setCalculatedShard(null);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
      {/* Page Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>TECHNICAL ARCHITECTURE WHITEPAPER</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Security & Download Relay Architecture
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          MIHORA STUDY LIBRARY operates on a production-grade dual-engine architecture engineered to deliver fast, authentic educational materials to Virtual University of Pakistan students with zero data leakage, zero personal tracking, and zero database dependencies.
        </p>
      </div>

      {/* Core Architectural Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Zero Direct URL Exposure</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            The client-side bundle never exposes raw Google Drive URLs, storage folder keys, or service account credentials. All 28,328 resources are referenced via opaque 18-character HMAC Resource Locator Hashes (<code className="font-mono text-slate-700 bg-slate-100 px-1 py-0.5 rounded">r_[16 hex]</code>).
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Layers className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">AES-256-GCM Encrypted Shards</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            The catalog is mathematically partitioned into 16 encrypted shards (<code className="font-mono text-slate-700 bg-slate-100 px-1 py-0.5 rounded">shard-0</code> to <code className="font-mono text-slate-700 bg-slate-100 px-1 py-0.5 rounded">shard-f</code>). Code-split dynamic chunks load only the exact partition requested by the student, keeping bundle sizes under 115 KB per partition.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Server className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Two-Stage Signed Relay</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            When deployed with our Cloudflare Worker or Node.js relay backend (<code className="font-mono text-slate-700 bg-slate-100 px-1 py-0.5 rounded">dl.study.mihora.tech</code>), resolution executes in two stages using 120-second short-lived HMAC-SHA256 tokens with single-use nonce consumption.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
            <Cpu className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Multi-Vector Anti-DevTools</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Real-time heuristic detection monitors browser dimension deltas, undocked window debugger timing traps, and console inspection objects to protect academic index integrity against automated bulk-scraping bots.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Database className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Zero-Database Privacy</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            No external database (Firestore, SQL, MongoDB) is maintained. No student account creation, no cookies, no tracking pixels, and no personal logs exist. Student privacy is protected at the cryptographic protocol level.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
            <EyeOff className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Zero-Leak CI Auditing</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Automated CI pipelines run <code className="font-mono text-slate-700 bg-slate-100 px-1 py-0.5 rounded">npm run audit-public</code> on every build, scanning all compiled JavaScript chunks to mathematically guarantee zero unencrypted Drive IDs or API secrets exist in the public bundle.
          </p>
        </div>
      </div>

      {/* Technical Workflow Comparison */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white space-y-8 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
            <Terminal className="w-4 h-4" />
            <span>Dual-Engine Operational Flow</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            How File Resolution Works in Practice
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            The platform supports two distinct operational modes: Static Edge Sharding (active on GitHub Pages) and Dedicated Relay Streaming (active on Cloudflare Workers / Express server).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mode 1: Static Hosting (GitHub Pages) */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-sm font-bold text-white">Mode A: Static Edge Sharding</span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ACTIVE ON GITHUB PAGES
              </span>
            </div>
            <ol className="space-y-3 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
              <li>
                <strong className="text-white">User clicks Download</strong> on any resource card.
              </li>
              <li>
                <strong className="text-white">Hash Routing:</strong> Browser computes <code className="font-mono text-blue-300">SHA-256(rlh)</code> to determine which of the 16 shard partitions stores the document record.
              </li>
              <li>
                <strong className="text-white">Dynamic Chunk Fetch:</strong> Vite loads only that specific 115 KB shard chunk asynchronously (zero initial page weight).
              </li>
              <li>
                <strong className="text-white">In-Memory Decryption:</strong> Web Crypto decrypts the AES-256-GCM payload in browser RAM and validates file integrity.
              </li>
              <li>
                <strong className="text-white">Verified Stream:</strong> File stream is initiated directly to user storage without intermediary ads or redirects.
              </li>
            </ol>
          </div>

          {/* Mode 2: Dedicated Relay (Cloudflare Worker) */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-sm font-bold text-white">Mode B: Serverless Relay Stream</span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                dl.study.mihora.tech
              </span>
            </div>
            <ol className="space-y-3 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
              <li>
                <strong className="text-white">Stage 1 Request:</strong> Frontend issues <code className="font-mono text-blue-300">POST /api/resolve</code> with the opaque RLH.
              </li>
              <li>
                <strong className="text-white">Rate-Limit & Nonce:</strong> Edge worker verifies client IP rate limits and generates a cryptographic nonce.
              </li>
              <li>
                <strong className="text-white">HMAC Signed Token:</strong> Worker returns a signed token <code className="font-mono text-blue-300">dt_[payload].[sig]</code> valid for 120 seconds.
              </li>
              <li>
                <strong className="text-white">Stage 2 Stream:</strong> Browser calls <code className="font-mono text-blue-300">GET /api/download?token=...</code>.
              </li>
              <li>
                <strong className="text-white">Binary Stream Proxy:</strong> The worker streams the file directly with sanitized headers, consuming the nonce so the token can never be replayed.
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* Interactive Cryptographic Shard Demonstrator */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider">
            <FileCode2 className="w-4 h-4" />
            <span>Interactive Shard Routing Inspector</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Verify Shard Partitioning in Real Time
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Enter any Resource Locator Hash (RLH) to inspect how the client-side router derives the exact AES-256-GCM partition (<code className="font-mono text-slate-700">shard-0</code> through <code className="font-mono text-slate-700">shard-f</code>).
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={testRlh}
              onChange={(e) => setTestRlh(e.target.value)}
              placeholder="e.g. r_919d3fbc9b7b99c0"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-slate-50"
            />
          </div>
          <button
            type="button"
            onClick={handleTestShard}
            disabled={isCalculating}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer shrink-0 disabled:opacity-50"
          >
            {isCalculating ? 'Computing Hash...' : 'Inspect Shard Routing'}
          </button>
        </div>

        {calculatedShard !== null && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Routing Result: Partition Shard-{calculatedShard}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px] pt-1">
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-400 block text-[10px]">INPUT RLH</span>
                <span className="text-slate-800 font-semibold">{testRlh}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-400 block text-[10px]">DERIVED SHARD</span>
                <span className="text-blue-600 font-semibold">src/data/shards/shard-{calculatedShard}.json</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-400 block text-[10px]">ENCRYPTION ALGORITHM</span>
                <span className="text-emerald-700 font-semibold">AES-256-GCM (128-bit Tag)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CTA Back to Catalog */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-md">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-white">Explore Verified VU Study Catalog</h2>
          <p className="text-xs sm:text-sm text-blue-200">
            Search 28,328+ course handouts, midterm papers, final papers, and solved MCQs.
          </p>
        </div>
        <button
          type="button"
          onClick={onNavigateHome}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-blue-50 text-blue-950 font-bold text-xs sm:text-sm transition-colors cursor-pointer shrink-0 flex items-center gap-2 shadow-xs"
        >
          <span>Return to Library</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
