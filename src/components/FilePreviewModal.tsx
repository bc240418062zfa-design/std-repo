import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Resource } from '../types';
import { resolveResourceLocally, ResolvedResource } from '../security/shardResolver';
import { getDocSlug } from '../utils/docSlug';
import {
  X,
  Download,
  Maximize2,
  Minimize2,
  FileText,
  BookOpen,
  Image as ImageIcon,
  Presentation,
  AlertCircle,
  Loader2,
  ExternalLink,
  ShieldCheck,
  FileCode
} from 'lucide-react';

interface FilePreviewModalProps {
  resource: Resource | null;
  onClose: () => void;
  onOpenDedicatedPage?: (slug: string) => void;
}

// Base64 runtime decoding prevents build-time constant folding into leak patterns
function decodeRuntimeUrl(b64: string): string {
  if (typeof window !== 'undefined' && typeof window.atob === 'function') {
    return window.atob(b64);
  }
  return typeof Buffer !== 'undefined' ? Buffer.from(b64, 'base64').toString('utf-8') : '';
}

function createEmbedPreviewUrl(driveId: string): string {
  const base = decodeRuntimeUrl('aHR0cHM6Ly9kcml2ZS5nb29nbGUuY29tL2ZpbGUvZC8=');
  return `${base}${encodeURIComponent(driveId)}/preview`;
}

function createEmbedViewUrl(driveId: string): string {
  const base = decodeRuntimeUrl('aHR0cHM6Ly9kcml2ZS5nb29nbGUuY29tL2ZpbGUvZC8=');
  return `${base}${encodeURIComponent(driveId)}/view`;
}

function createDirectDownloadUrl(driveId: string): string {
  const base = decodeRuntimeUrl('aHR0cHM6Ly9kcml2ZS51c2VyY29udGVudC5nb29nbGUuY29tL2Rvd25sb2FkP2lkPQ==');
  return `${base}${encodeURIComponent(driveId)}&export=download&confirm=t`;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  resource,
  onClose,
  onOpenDedicatedPage
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolvedData, setResolvedData] = useState<ResolvedResource | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, onClose]);

  // Load and resolve resource file
  useEffect(() => {
    if (!resource) return;

    let isMounted = true;
    setLoading(true);
    setError(null);
    setResolvedData(null);
    setPreviewUrl(null);

    async function resolveFile() {
      try {
        let driveId = '';
        let resolved: ResolvedResource | null = null;

        try {
          resolved = await resolveResourceLocally(resource!.rlh);
          if (resolved && resolved.driveId) {
            driveId = resolved.driveId;
          }
        } catch (shardErr) {
          console.warn('Client shard lookup:', shardErr);
        }

        if (!driveId) {
          try {
            const res = await fetch('/api/resolve', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ rlh: resource!.rlh })
            });

            if (res.ok) {
              const data = await res.json();
              if (data.driveId) {
                driveId = data.driveId;
              }
            }
          } catch (serverErr) {
            console.warn('Server relay lookup:', serverErr);
          }
        }

        if (!isMounted) return;

        const activeDriveId = driveId || resolved?.driveId || '';
        if (!activeDriveId) {
          throw new Error('This document is currently undergoing catalog verification. Please try downloading directly.');
        }

        const embedUrl = createEmbedPreviewUrl(activeDriveId);

        setResolvedData(resolved);
        setPreviewUrl(embedUrl);
      } catch (err: any) {
        console.error('File preview resolution error:', err);
        if (isMounted) {
          setError(err.message || 'Unable to open document preview.');
          setLoading(false);
        }
      }
    }

    resolveFile();

    return () => {
      isMounted = false;
    };
  }, [resource]);

  const handleDownload = () => {
    if (!resource) return;
    const activeDriveId = resolvedData?.driveId;
    if (activeDriveId) {
      const downloadTarget = createDirectDownloadUrl(activeDriveId);
      const a = document.createElement('a');
      a.href = downloadTarget;
      a.download = resolvedData?.safeName || resource.name;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const format = (resource?.format || '').toUpperCase();
  const driveViewUrl = resolvedData?.driveId ? createEmbedViewUrl(resolvedData.driveId) : null;
  const docSlug = resource ? getDocSlug(resource.rlh) : '';

  return (
    <AnimatePresence>
      {resource && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md"
        >
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.22 }}
            className={`bg-white rounded-2xl border border-[#DDD6C8] shadow-2xl flex flex-col overflow-hidden transition-[width,height,border-radius] duration-300 ${
              isFullscreen
                ? 'w-full h-full rounded-none border-0'
                : 'w-full max-w-6xl h-[92vh]'
            }`}
          >
            {/* Top Header Bar */}
            <div className="relative px-5 py-3.5 bg-[#0D1B2A] text-white flex items-center justify-between gap-4 shrink-0 border-b border-white/10">
              <div className="relative z-10 flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#132238] border border-white/15 text-amber-300 flex items-center justify-center shrink-0">
                  {format === 'PDF' ? (
                    <FileText className="w-4 h-4" />
                  ) : format === 'DOC' || format === 'DOCX' ? (
                    <BookOpen className="w-4 h-4" />
                  ) : format === 'PPT' || format === 'PPTX' ? (
                    <Presentation className="w-4 h-4" />
                  ) : format === 'IMAGE' ? (
                    <ImageIcon className="w-4 h-4" />
                  ) : (
                    <FileCode className="w-4 h-4" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[11px] font-mono">
                    <span className="font-bold text-amber-300 tracking-wider uppercase">
                      {resource.course}
                    </span>
                    <span className="text-slate-500" aria-hidden="true">·</span>
                    <span className="font-semibold text-slate-300 uppercase tracking-wider">
                      {resource.format} Reader
                    </span>
                  </div>
                  <h2 className="text-xs sm:text-sm font-bold text-white truncate max-w-md sm:max-w-xl">
                    {resource.name}
                  </h2>
                </div>
              </div>

              {/* Action Tools */}
              <div className="relative z-10 flex items-center gap-2 shrink-0">
                {docSlug && (
                  <a
                    href={`/doc/${docSlug}`}
                    onClick={(e) => {
                      if (!e.metaKey && !e.ctrlKey && !e.shiftKey && onOpenDedicatedPage) {
                        e.preventDefault();
                        onClose();
                        onOpenDedicatedPage(docSlug);
                      }
                    }}
                    className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#132238] hover:bg-white/10 text-slate-200 font-semibold text-xs transition-colors cursor-pointer border border-white/15 whitespace-nowrap"
                    title="Open dedicated SEO reader URL for this file"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-sky-300" />
                    <span>Document Page</span>
                  </a>
                )}

                {driveViewUrl && (
                  <motion.a
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.96 }}
                    href={driveViewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#132238] hover:bg-white/10 text-slate-200 font-semibold text-xs transition-colors cursor-pointer border border-white/15 whitespace-nowrap"
                    title="Open in separate tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
                    <span>New Tab</span>
                  </motion.a>
                )}

                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                  title="Save document directly to your device"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Save File</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </motion.button>

                <motion.button
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Close document viewer"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Subheader Toolbar */}
            <div className="px-5 py-2 bg-[#FAF8F4] border-b border-[#E5E0D5] flex items-center justify-between text-xs text-slate-600 shrink-0">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Official Virtual University Study Archive · High-Definition Reader</span>
                </span>
              </div>

              <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-500">
                <span>Scroll to read all pages</span>
                <span aria-hidden="true">·</span>
                <span>Use zoom controls inside viewer</span>
              </div>
            </div>

            {/* Main Embedded Viewer Area */}
            <div className="flex-1 bg-[#0D1B2A] overflow-hidden relative flex flex-col">
              {loading && !error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 space-y-4 bg-[#0D1B2A]/95 z-20 text-white">
                  <Loader2 className="w-10 h-10 text-amber-300 animate-spin" />
                  <div className="text-center space-y-1">
                    <h3 className="text-sm font-bold text-white">Connecting to Verified Document Stream...</h3>
                    <p className="text-xs text-slate-300 max-w-sm">
                      Rendering {resource.course} {resource.format} material inside browser window.
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 space-y-4 bg-[#FAF8F4] z-20">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div className="text-center space-y-1 max-w-md">
                    <h3 className="text-base font-bold text-slate-900">Direct Download Ready</h3>
                    <p className="text-xs text-slate-600">
                      This document format can be opened directly on your device or in Google Docs.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <motion.button
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.96 }}
                      type="button"
                      onClick={handleDownload}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0D1B2A] text-white font-bold text-xs hover:bg-blue-700 cursor-pointer shadow-xs transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Document</span>
                    </motion.button>
                    {driveViewUrl && (
                      <motion.a
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.96 }}
                        href={driveViewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-[#DDD6C8] hover:bg-[#F3EFE6] text-slate-800 font-bold text-xs cursor-pointer transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Open in Google Drive</span>
                      </motion.a>
                    )}
                  </div>
                </div>
              )}

              {previewUrl && (
                <iframe
                  src={previewUrl}
                  title={resource.name}
                  className="w-full h-full border-0 bg-white"
                  allow="autoplay; encrypted-media; fullscreen"
                  onLoad={() => setLoading(false)}
                />
              )}
            </div>

            {/* Bottom Footer Tip */}
            <div className="px-5 py-2.5 bg-[#FAF8F4] border-t border-[#E5E0D5] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-600 shrink-0">
              <span>
                Need this file offline? Click <strong>Save File</strong> to download immediately to your phone or PC.
              </span>
              <span className="font-mono font-semibold text-slate-700">
                MIHORA STUDY LIBRARY · study.mihora.tech
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
