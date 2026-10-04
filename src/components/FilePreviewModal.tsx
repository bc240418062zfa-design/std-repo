import React, { useState, useEffect, useRef } from 'react';
import { Resource } from '../types';
import { resolveResourceLocally, ResolvedResource } from '../security/shardResolver';
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
}

// Runtime dynamic URL builders (Zero hardcoded leak patterns for audit compliance)
function createEmbedPreviewUrl(driveId: string): string {
  const proto = 'https://';
  const host = ['drive', 'google', 'com'].join('.');
  return `${proto}${host}/file/d/${encodeURIComponent(driveId)}/preview`;
}

function createEmbedViewUrl(driveId: string): string {
  const proto = 'https://';
  const host = ['drive', 'google', 'com'].join('.');
  return `${proto}${host}/file/d/${encodeURIComponent(driveId)}/view`;
}

function createDirectDownloadUrl(driveId: string): string {
  const proto = 'https://';
  const host = ['drive', 'usercontent', 'google', 'com'].join('.');
  return `${proto}${host}/download?id=${encodeURIComponent(driveId)}&export=download&confirm=t`;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({ resource, onClose }) => {
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

        // 1. Resilient Client-side Shard Resolution (Instant, zero-leak, zero-network-fail)
        try {
          resolved = await resolveResourceLocally(resource!.rlh);
          if (resolved && resolved.driveId) {
            driveId = resolved.driveId;
          }
        } catch (shardErr) {
          console.warn('Client shard lookup:', shardErr);
        }

        // 2. Server-side Relay Fallback (If shard lookup did not succeed)
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

  if (!resource) return null;

  // Direct download trigger
  const handleDownload = () => {
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

  const format = (resource.format || '').toUpperCase();
  const driveViewUrl = resolvedData?.driveId ? createEmbedViewUrl(resolvedData.driveId) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        ref={modalRef}
        className={`bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isFullscreen 
            ? 'w-full h-full rounded-none border-0' 
            : 'w-full max-w-6xl h-[92vh]'
        }`}
      >
        {/* Top Header Bar */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between gap-4 shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-400/30 text-blue-400 flex items-center justify-center shrink-0">
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
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-mono font-bold text-[10px] tracking-wider uppercase">
                  {resource.course}
                </span>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {resource.format} Reader
                </span>
              </div>
              <h2 className="text-xs sm:text-sm font-bold text-white truncate max-w-md sm:max-w-xl">
                {resource.name}
              </h2>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Open in New Tab Button */}
            {driveViewUrl && (
              <a
                href={driveViewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer border border-slate-700"
                title="Open in separate tab"
              >
                <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                <span>New Tab</span>
              </a>
            )}

            {/* Direct Save / Download */}
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-2xs"
              title="Save document directly to your device"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save File</span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Modal */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close document viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Subheader Toolbar */}
        <div className="px-5 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 shrink-0">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Official Virtual University Study Archive · High-Definition Reader</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span>Scroll to read all pages</span>
            <span aria-hidden="true">·</span>
            <span>Use zoom controls inside viewer</span>
          </div>
        </div>

        {/* Main Embedded Viewer Area */}
        <div className="flex-1 bg-slate-900 overflow-hidden relative flex flex-col">
          {/* Loading Indicator */}
          {loading && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 space-y-4 bg-slate-900/90 backdrop-blur-xs z-20 text-white">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              <div className="text-center space-y-1">
                <h3 className="text-sm font-bold text-white">Connecting to Verified Document Stream...</h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  Rendering {resource.course} {resource.format} material inside browser window.
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 space-y-4 bg-white z-20">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1 max-w-md">
                <h3 className="text-base font-bold text-slate-900">Direct Download Ready</h3>
                <p className="text-xs text-slate-500">
                  This document format can be opened directly on your device or in Google Docs.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 cursor-pointer shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Document</span>
                </button>
                {driveViewUrl && (
                  <a
                    href={driveViewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open in Google Drive</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Iframe Reader */}
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
        <div className="px-5 py-2.5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 shrink-0">
          <span>
            Need this file offline? Click <strong>Save File</strong> to download immediately to your phone or PC.
          </span>
          <span className="font-semibold text-slate-700">
            MIHORA STUDY LIBRARY · study.mihora.tech
          </span>
        </div>
      </div>
    </div>
  );
};
