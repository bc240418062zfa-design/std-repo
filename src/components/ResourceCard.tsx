import React from 'react';
import { motion } from 'motion/react';
import { Resource } from '../types';
import {
  FileText,
  Download,
  FileArchive,
  Presentation,
  FileCode,
  Image as ImageIcon,
  Table,
  Eye
} from 'lucide-react';

interface ResourceCardProps {
  resource: Resource;
  isSelected: boolean;
  onToggleSelect: (rlh: string) => void;
  onDownload: (resource: Resource) => void;
  onPreview?: (resource: Resource) => void;
  isDownloading?: boolean;
  index?: number;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  isSelected,
  onToggleSelect,
  onDownload,
  onPreview,
  isDownloading = false,
  index = 0
}) => {
  const getFormatIcon = (format: string) => {
    switch (format.toUpperCase()) {
      case 'PDF':
        return <FileText className="w-4 h-4 text-rose-700" />;
      case 'DOC':
      case 'DOCX':
        return <FileText className="w-4 h-4 text-blue-700" />;
      case 'PPT':
      case 'PPTX':
        return <Presentation className="w-4 h-4 text-amber-700" />;
      case 'IMAGE':
      case 'PNG':
      case 'JPG':
      case 'JPEG':
        return <ImageIcon className="w-4 h-4 text-slate-700" />;
      case 'XLS':
      case 'XLSX':
        return <Table className="w-4 h-4 text-emerald-700" />;
      case 'ARCHIVE':
      case 'ZIP':
      case 'RAR':
        return <FileArchive className="w-4 h-4 text-teal-700" />;
      default:
        return <FileCode className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 'some' }}
      transition={{
        duration: 0.32,
        delay: Math.min((index % 12) * 0.03, 0.24),
        ease: [0.16, 1, 0.3, 1]
      }}
      whileHover={{ y: -4 }}
      className={`group bg-white border rounded-xl p-4 sm:p-5 transition-colors flex flex-col justify-between gap-4 card-elevated ${
        isSelected
          ? 'border-blue-600 ring-1 ring-blue-600 bg-blue-50/20'
          : 'border-slate-200 hover:border-blue-300'
      }`}
    >
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-600">
            {getFormatIcon(resource.format)}
            <span className="text-slate-900 font-bold">{resource.course}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="uppercase text-[11px]">{resource.format}</span>
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-500 hover:text-slate-800 select-none">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect(resource.rlh)}
              className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
              aria-label={`Select ${resource.name}`}
            />
            <span className="hidden sm:inline">Select</span>
          </label>
        </div>

        <h3
          onClick={() => onPreview && onPreview(resource)}
          className="font-semibold text-slate-900 text-sm sm:text-[15px] leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors cursor-pointer"
          title="Click to preview online"
        >
          {resource.name}
        </h3>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
          <span className="font-medium text-slate-700">{resource.type}</span>
          {resource.tags && resource.tags.length > 0 && (
            <>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="truncate max-w-[170px]">{resource.tags.slice(0, 2).join(' · ')}</span>
            </>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        {onPreview ? (
          <button
            type="button"
            onClick={() => onPreview(resource)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer border border-slate-200 whitespace-nowrap"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>Preview</span>
          </button>
        ) : (
          <span className="text-[11px] text-slate-400 font-mono">Archive File</span>
        )}

        <motion.button
          whileTap={{ scale: 0.96 }}
          type="button"
          disabled={isDownloading}
          onClick={() => onDownload(resource)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#0B1526] hover:bg-blue-700 text-white transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isDownloading ? 'Resolving...' : 'Download'}</span>
        </motion.button>
      </div>
    </motion.div>
  );
};
