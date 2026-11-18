import React from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'motion/react';
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
import { EASE_OUT_EXPO } from './MotionPrimitives';

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
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const spotlightBg = useMotionTemplate`radial-gradient(240px circle at ${mouseX}px ${mouseY}px, rgba(37, 99, 235, 0.08), transparent 75%)`;

  const getFormatVisual = (format: string) => {
    switch (format.toUpperCase()) {
      case 'PDF':
        return {
          icon: <FileText className="w-4 h-4 text-rose-600" />,
          box: 'bg-rose-50 border-rose-200/70'
        };
      case 'DOC':
      case 'DOCX':
        return {
          icon: <FileText className="w-4 h-4 text-blue-600" />,
          box: 'bg-blue-50 border-blue-200/70'
        };
      case 'PPT':
      case 'PPTX':
        return {
          icon: <Presentation className="w-4 h-4 text-amber-600" />,
          box: 'bg-amber-50 border-amber-200/70'
        };
      case 'IMAGE':
      case 'PNG':
      case 'JPG':
      case 'JPEG':
        return {
          icon: <ImageIcon className="w-4 h-4 text-indigo-600" />,
          box: 'bg-indigo-50 border-indigo-200/70'
        };
      case 'XLS':
      case 'XLSX':
        return {
          icon: <Table className="w-4 h-4 text-emerald-600" />,
          box: 'bg-emerald-50 border-emerald-200/70'
        };
      case 'ARCHIVE':
      case 'ZIP':
      case 'RAR':
        return {
          icon: <FileArchive className="w-4 h-4 text-teal-600" />,
          box: 'bg-teal-50 border-teal-200/70'
        };
      default:
        return {
          icon: <FileCode className="w-4 h-4 text-slate-600" />,
          box: 'bg-slate-100 border-slate-200/70'
        };
    }
  };

  const fmtVisual = getFormatVisual(resource.format);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 'some' }}
      transition={{
        duration: 0.34,
        delay: Math.min((index % 12) * 0.03, 0.24),
        ease: EASE_OUT_EXPO
      }}
      whileHover={{ y: -5 }}
      onPointerMove={handlePointerMove}
      className={`celestial-top-glint group relative overflow-hidden card-celestial border rounded-2xl p-5 flex flex-col justify-between gap-4 ${
        isSelected
          ? 'border-blue-600 ring-2 ring-blue-600/20 bg-blue-50/40'
          : 'border-slate-200/80 hover:border-sky-400/70'
      }`}
    >
      {/* Subtle corner starlight ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none -top-12 -right-12 w-28 h-28 rounded-full bg-sky-400/10 blur-xl absolute opacity-60 group-hover:opacity-100 transition-opacity"
      />
      {/* Subtle cursor spotlight */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: spotlightBg }}
        aria-hidden="true"
      />

      <div className="relative z-10 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-3 shadow-2xs ${fmtVisual.box}`}
            >
              {fmtVisual.icon}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono truncate">
              <span className="font-bold text-slate-900">{resource.course}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="uppercase text-[11px] font-semibold text-slate-500">{resource.format}</span>
            </div>
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-400 hover:text-slate-800 select-none shrink-0">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect(resource.rlh)}
              className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer transition-transform active:scale-90"
              aria-label={`Select ${resource.name}`}
            />
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
              <span className="truncate max-w-[160px]">{resource.tags.slice(0, 2).join(' · ')}</span>
            </>
          )}
        </div>
      </div>

      <div className="relative z-10 pt-3 border-t border-slate-200/70 flex items-center justify-between gap-2">
        {onPreview ? (
          <motion.button
            whileHover={{ y: -1.5, scale: 1.02 }}
            whileTap={{ scale: 0.94 }}
            type="button"
            onClick={() => onPreview(resource)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-white/90 hover:bg-blue-50/70 text-slate-700 hover:text-blue-700 transition-colors cursor-pointer border border-slate-200/90 hover:border-blue-300 whitespace-nowrap"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>Preview</span>
          </motion.button>
        ) : (
          <span className="text-[11px] text-slate-400 font-mono">Archive File</span>
        )}

        <motion.button
          whileHover={{ y: -1.5, scale: 1.03 }}
          whileTap={{ scale: 0.94 }}
          type="button"
          disabled={isDownloading}
          onClick={() => onDownload(resource)}
          className="btn-shimmer group/dl inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-[#070E1F] to-slate-900 hover:from-blue-700 hover:to-indigo-600 text-white transition-all cursor-pointer disabled:opacity-50 whitespace-nowrap shadow-[0_4px_12px_-4px_rgba(7,14,31,0.4)] hover:shadow-[0_6px_16px_-4px_rgba(37,99,235,0.45)]"
        >
          <Download className="w-3.5 h-3.5 transition-transform duration-200 group-hover/dl:translate-y-0.5" />
          <span>{isDownloading ? 'Resolving...' : 'Download'}</span>
        </motion.button>
      </div>
    </motion.div>
  );
};
