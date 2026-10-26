import React from 'react';
import { Resource } from '../types';
import { 
  FileText, 
  Download, 
  FileArchive, 
  Presentation, 
  FileCode, 
  Image as ImageIcon, 
  Table,
  Eye,
  BookOpen
} from 'lucide-react';

interface ResourceCardProps {
  resource: Resource;
  isSelected: boolean;
  onToggleSelect: (rlh: string) => void;
  onDownload: (resource: Resource) => void;
  onPreview?: (resource: Resource) => void;
  isDownloading?: boolean;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  isSelected,
  onToggleSelect,
  onDownload,
  onPreview,
  isDownloading = false
}) => {
  // Format icon helper with soft tinted background container
  const getFormatBadge = (format: string) => {
    switch (format.toUpperCase()) {
      case 'PDF':
        return (
          <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
            <FileText className="w-4 h-4" />
          </div>
        );
      case 'DOC':
      case 'DOCX':
        return (
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
            <FileText className="w-4 h-4" />
          </div>
        );
      case 'PPT':
      case 'PPTX':
        return (
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
            <Presentation className="w-4 h-4" />
          </div>
        );
      case 'IMAGE':
      case 'PNG':
      case 'JPG':
      case 'JPEG':
        return (
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
            <ImageIcon className="w-4 h-4" />
          </div>
        );
      case 'XLS':
      case 'XLSX':
        return (
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <Table className="w-4 h-4" />
          </div>
        );
      case 'ARCHIVE':
      case 'ZIP':
      case 'RAR':
        return (
          <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-100">
            <FileArchive className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 border border-slate-200">
            <FileCode className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div
      className={`group relative bg-white border rounded-2xl p-4 sm:p-5 transition-all duration-200 flex flex-col justify-between gap-4 ${
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md bg-blue-50/20'
          : 'border-slate-200/90 hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      <div className="space-y-3">
        {/* Top bar: Format Icon, Course Badge & Selection Checkbox */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            {getFormatBadge(resource.format)}
            <span className="font-mono font-bold text-xs text-blue-700 bg-blue-50/80 px-2 py-0.5 rounded-lg border border-blue-200/70 shrink-0">
              {resource.course}
            </span>
          </div>

          {/* Select Checkbox */}
          <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-400 hover:text-slate-700 select-none transition-colors">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect(resource.rlh)}
              className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
              aria-label={`Select ${resource.name}`}
            />
            <span className="hidden sm:inline font-medium">Select</span>
          </label>
        </div>

        {/* Resource Name */}
        <h3 
          onClick={() => onPreview && onPreview(resource)}
          className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors cursor-pointer"
          title="Click to preview online"
        >
          {resource.name}
        </h3>

        {/* Clean Unboxed Metadata with Typographic Separator (Zero-Pill Rule) */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 font-medium">
          <span className="text-slate-700 font-semibold">{resource.type}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="uppercase font-mono text-[11px]">{resource.format}</span>
          {resource.tags && resource.tags.length > 0 && (
            <>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="truncate max-w-[160px]">{resource.tags.slice(0, 2).join(' · ')}</span>
            </>
          )}
        </div>
      </div>

      {/* Card Footer: Dual Actions (Read Online & Download) */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        {onPreview ? (
          <button
            type="button"
            onClick={() => onPreview(resource)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 transition-colors cursor-pointer border border-slate-200/80 hover:border-blue-200"
          >
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>Read Online</span>
          </button>
        ) : (
          <span className="text-[11px] text-slate-400 font-mono">Verified Archive</span>
        )}

        <button
          type="button"
          disabled={isDownloading}
          onClick={() => onDownload(resource)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all cursor-pointer shadow-xs hover:shadow-sm active:scale-95 disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isDownloading ? 'Resolving...' : 'Download'}</span>
        </button>
      </div>
    </div>
  );
};
