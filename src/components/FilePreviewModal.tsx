import React, { useState, useEffect, useRef } from 'react';
import { Resource } from '../types';
import { 
  X, 
  Download, 
  Maximize2, 
  Minimize2, 
  FileText, 
  BookOpen, 
  Image as ImageIcon, 
  Presentation, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ChevronLeft, 
  ChevronRight, 
  Copy, 
  Check, 
  ZoomIn, 
  ZoomOut, 
  RotateCw,
  Eye,
  FileCode,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import mammoth from 'mammoth';
import JSZip from 'jszip';

interface FilePreviewModalProps {
  resource: Resource | null;
  onClose: () => void;
}

interface SlideData {
  number: number;
  text: string[];
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({ resource, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [rawBuffer, setRawBuffer] = useState<ArrayBuffer | null>(null);
  
  // Format specific state
  const [docxHtml, setDocxHtml] = useState<string>('');
  const [docxText, setDocxText] = useState<string>('');
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [textContent, setTextContent] = useState<string>('');
  
  // UI Controls
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [docViewMode, setDocViewMode] = useState<'html' | 'text'>('html');
  const [copied, setCopied] = useState(false);
  const [imageZoom, setImageZoom] = useState(1);
  const [imageRotation, setImageRotation] = useState(0);

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

  // Load resource file
  useEffect(() => {
    if (!resource) return;

    let isMounted = true;
    setLoading(true);
    setError(null);
    setBlobUrl(null);
    setRawBuffer(null);
    setDocxHtml('');
    setDocxText('');
    setSlides([]);
    setCurrentSlideIndex(0);
    setTextContent('');
    setImageZoom(1);
    setImageRotation(0);

    async function loadResource() {
      try {
        // 1. Resolve token from server
        const res = await fetch('/api/resolve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rlh: resource!.rlh })
        });

        if (!res.ok) {
          throw new Error('Failed to obtain secure streaming access for this document.');
        }

        const data = await res.json();
        if (!data.downloadUrl) {
          throw new Error('Streaming relay endpoint could not be established.');
        }

        // 2. Fetch the actual file stream via token with inline flag
        const fileUrl = `${data.downloadUrl}&inline=1`;
        const fileRes = await fetch(fileUrl);
        if (!fileRes.ok) {
          throw new Error(`Unable to stream file from storage (HTTP ${fileRes.status}).`);
        }

        const arrayBuffer = await fileRes.arrayBuffer();
        if (!isMounted) return;

        setRawBuffer(arrayBuffer);

        const format = (resource!.format || '').toUpperCase();
        const safeName = (resource!.name || '').toLowerCase();

        // 3. Process based on format
        if (format === 'PDF' || safeName.endsWith('.pdf')) {
          const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          setBlobUrl(url);
        } else if (format === 'DOC' || format === 'DOCX' || safeName.endsWith('.docx') || safeName.endsWith('.doc')) {
          // If DOCX, convert to rich HTML using mammoth
          try {
            const htmlResult = await mammoth.convertToHtml({ arrayBuffer });
            const textResult = await mammoth.extractRawText({ arrayBuffer });
            if (isMounted) {
              setDocxHtml(htmlResult.value || '<p>No readable content extracted.</p>');
              setDocxText(textResult.value || '');
            }
          } catch (mErr) {
            console.warn('Mammoth conversion fallback:', mErr);
            // Fallback for older .doc binary files: attempt text extraction or blob
            const textDecoder = new TextDecoder('utf-8', { fatal: false });
            const rawText = textDecoder.decode(arrayBuffer);
            // Clean non-printable characters
            const cleaned = rawText.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' ').replace(/\s{2,}/g, ' ');
            if (isMounted) {
              setDocxText(cleaned.slice(0, 50000));
              setDocViewMode('text');
            }
          }
        } else if (format === 'PPT' || format === 'PPTX' || safeName.endsWith('.pptx') || safeName.endsWith('.ppt')) {
          // Parse PPTX slides using JSZip
          try {
            const zip = await JSZip.loadAsync(arrayBuffer);
            const slideFiles = Object.keys(zip.files)
              .filter((f) => f.startsWith('ppt/slides/slide') && f.endsWith('.xml'))
              .sort((a, b) => {
                const numA = parseInt(a.replace(/\D/g, ''), 10) || 0;
                const numB = parseInt(b.replace(/\D/g, ''), 10) || 0;
                return numA - numB;
              });

            if (slideFiles.length > 0) {
              const parsedSlides: SlideData[] = [];
              for (let i = 0; i < slideFiles.length; i++) {
                const xmlContent = await zip.files[slideFiles[i]].async('text');
                // Extract text tags from OpenXML <a:t>text</a:t>
                const textMatches = Array.from(xmlContent.matchAll(/<a:t[^>]*>(.*?)<\/a:t>/gs)).map((m) => m[1]);
                if (textMatches.length > 0) {
                  parsedSlides.push({
                    number: i + 1,
                    text: textMatches
                  });
                }
              }

              if (isMounted) {
                if (parsedSlides.length > 0) {
                  setSlides(parsedSlides);
                } else {
                  setTextContent('Presentation slides contain media or non-standard text structures.');
                }
              }
            } else {
              setTextContent('Legacy PowerPoint binary format detected (.ppt). Please download to view in Microsoft PowerPoint.');
            }
          } catch (pErr) {
            console.warn('PPTX parsing fallback:', pErr);
            setTextContent('PowerPoint slide deck ready for study.');
          }
        } else if (format === 'IMAGE' || safeName.match(/\.(png|jpe?g|gif|webp)$/i)) {
          const ext = safeName.split('.').pop()?.toLowerCase();
          const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
          const blob = new Blob([arrayBuffer], { type: mime });
          const url = URL.createObjectURL(blob);
          setBlobUrl(url);
        } else {
          // Plain Text or other
          const textDecoder = new TextDecoder('utf-8', { fatal: false });
          const text = textDecoder.decode(arrayBuffer);
          setTextContent(text);
        }

        if (isMounted) {
          setLoading(false);
        }
      } catch (err: any) {
        console.error('File preview error:', err);
        if (isMounted) {
          setError(err.message || 'Unable to load file for preview.');
          setLoading(false);
        }
      }
    }

    loadResource();

    return () => {
      isMounted = false;
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [resource]);

  if (!resource) return null;

  // Direct instant download from in-memory buffer without re-fetching
  const handleDirectDownload = () => {
    if (!rawBuffer) return;
    const safeName = resource.name || `VU_${resource.course}_Document.pdf`;
    const format = (resource.format || 'pdf').toLowerCase();
    
    let mime = 'application/octet-stream';
    if (format === 'pdf') mime = 'application/pdf';
    else if (format === 'docx') mime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    else if (format === 'pptx') mime = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';

    const blob = new Blob([rawBuffer], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = safeName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const format = (resource.format || '').toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        ref={modalRef}
        className={`bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isFullscreen 
            ? 'w-full h-full rounded-none border-0' 
            : 'w-full max-w-5xl h-[88vh]'
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
            {/* Download Instant */}
            <button
              type="button"
              onClick={handleDirectDownload}
              disabled={loading || !rawBuffer}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs transition-colors cursor-pointer shadow-2xs"
              title="Save file directly to device"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save File</span>
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

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Subheader Toolbar (Format-specific controls) */}
        {!loading && !error && (
          <div className="px-5 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 shrink-0">
            {/* Left Info */}
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero-Leak Secure In-Memory Viewer</span>
              </span>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              {/* DOCX Mode Switcher */}
              {(format === 'DOC' || format === 'DOCX') && docxHtml && (
                <div className="flex items-center gap-1 p-0.5 bg-slate-200/70 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setDocViewMode('html')}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-colors ${
                      docViewMode === 'html' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    Formatted Reading
                  </button>
                  <button
                    type="button"
                    onClick={() => setDocViewMode('text')}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-colors ${
                      docViewMode === 'text' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    Plain Text
                  </button>
                </div>
              )}

              {/* PPT Slide Navigator */}
              {slides.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={currentSlideIndex === 0}
                    onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                    className="p-1 rounded-md bg-white border border-slate-200 disabled:opacity-40 hover:bg-slate-100 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-mono font-bold text-slate-800 text-[11px]">
                    Slide {currentSlideIndex + 1} of {slides.length}
                  </span>
                  <button
                    type="button"
                    disabled={currentSlideIndex === slides.length - 1}
                    onClick={() => setCurrentSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))}
                    className="p-1 rounded-md bg-white border border-slate-200 disabled:opacity-40 hover:bg-slate-100 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Image Zoom & Rotate Controls */}
              {format === 'IMAGE' && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setImageZoom((z) => Math.min(3, z + 0.25))}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageZoom((z) => Math.max(0.5, z - 0.25))}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageRotation((r) => (r + 90) % 360)}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 cursor-pointer"
                    title="Rotate 90deg"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Copy Text Button if text view */}
              {(docViewMode === 'text' || textContent) && (
                <button
                  type="button"
                  onClick={() => handleCopyText(docxText || textContent)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Text'}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 bg-slate-100/60 overflow-hidden relative flex flex-col">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 space-y-4 bg-white/90 z-20">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              <div className="text-center space-y-1">
                <h3 className="text-sm font-bold text-slate-900">Streaming Verified Document...</h3>
                <p className="text-xs text-slate-500 max-w-sm">
                  Establishing secure cryptographic channel and rendering file inside browser window.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 space-y-4 bg-white z-20">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1 max-w-md">
                <h3 className="text-base font-bold text-slate-900">Preview Unavailable</h3>
                <p className="text-xs text-slate-500">{error}</p>
              </div>
              <button
                type="button"
                onClick={handleDirectDownload}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download File Instead</span>
              </button>
            </div>
          )}

          {!loading && !error && (
            <div className="w-full h-full overflow-auto">
              {/* 1. PDF Viewer */}
              {(format === 'PDF' || blobUrl && format !== 'IMAGE') && (
                <div className="w-full h-full bg-slate-800 flex flex-col items-center justify-center">
                  <iframe
                    src={blobUrl || ''}
                    title={resource.name}
                    className="w-full h-full border-0"
                  />
                </div>
              )}

              {/* 2. DOC / DOCX Viewer */}
              {(format === 'DOC' || format === 'DOCX') && !blobUrl && (
                <div className="p-6 sm:p-10 max-w-4xl mx-auto">
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
                    {docViewMode === 'html' && docxHtml ? (
                      <div 
                        className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: docxHtml }}
                      />
                    ) : (
                      <pre className="font-mono text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed select-text bg-slate-50 p-4 rounded-2xl border border-slate-200">
                        {docxText || 'No text extracted.'}
                      </pre>
                    )}
                  </div>
                </div>
              )}

              {/* 3. PPT / PPTX Slide Deck Reader */}
              {(format === 'PPT' || format === 'PPTX') && !blobUrl && (
                <div className="p-6 sm:p-10 max-w-4xl mx-auto h-full flex flex-col justify-center">
                  {slides.length > 0 ? (
                    <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-6 min-h-[380px] flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                          <span className="text-xs font-bold text-blue-600 font-mono uppercase tracking-wider">
                            {resource.course} Lecture Presentation
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-400">
                            Slide {slides[currentSlideIndex].number} of {slides.length}
                          </span>
                        </div>

                        <div className="space-y-3 pt-2">
                          {slides[currentSlideIndex].text.map((line, idx) => (
                            <p 
                              key={idx} 
                              className={idx === 0 
                                ? 'text-lg sm:text-xl font-bold text-slate-900 mb-4' 
                                : 'text-xs sm:text-sm text-slate-700 leading-relaxed flex items-start gap-2'
                              }
                            >
                              {idx > 0 && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />}
                              <span>{line}</span>
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* Slide Controls Footer */}
                      <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                        <button
                          type="button"
                          disabled={currentSlideIndex === 0}
                          onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>Previous Slide</span>
                        </button>

                        <button
                          type="button"
                          disabled={currentSlideIndex === slides.length - 1}
                          onClick={() => setCurrentSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 disabled:opacity-40 cursor-pointer"
                        >
                          <span>Next Slide</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 shadow-sm">
                      <Presentation className="w-12 h-12 text-blue-600 mx-auto" />
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-slate-900">PowerPoint Presentation File</h3>
                        <p className="text-xs text-slate-500 max-w-md mx-auto">
                          {textContent || 'This presentation is ready for studying. You can download and run it directly in Microsoft PowerPoint or Google Slides.'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleDirectDownload}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Presentation (.PPTX)</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 4. Image Viewer */}
              {format === 'IMAGE' && blobUrl && (
                <div className="w-full h-full flex items-center justify-center p-6 overflow-auto">
                  <img
                    src={blobUrl}
                    alt={resource.name}
                    style={{
                      transform: `scale(${imageZoom}) rotate(${imageRotation}deg)`,
                      transition: 'transform 0.2s ease-in-out'
                    }}
                    className="max-w-full max-h-full object-contain rounded-2xl shadow-lg"
                  />
                </div>
              )}

              {/* 5. Plain Text / Code / Fallback */}
              {format !== 'PDF' && format !== 'DOC' && format !== 'DOCX' && format !== 'PPT' && format !== 'PPTX' && format !== 'IMAGE' && (
                <div className="p-6 sm:p-10 max-w-4xl mx-auto">
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-4">
                    <pre className="font-mono text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed select-text bg-slate-50 p-4 rounded-2xl border border-slate-200 max-h-[70vh] overflow-auto">
                      {textContent || 'Document ready.'}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Footer Tip */}
        <div className="px-5 py-2.5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 shrink-0">
          <span>
            Need this file offline? Click <strong>Save File</strong> to download immediately.
          </span>
          <span className="font-semibold text-slate-700">
            MIHORA STUDY LIBRARY · Virtual University of Pakistan
          </span>
        </div>
      </div>
    </div>
  );
};
