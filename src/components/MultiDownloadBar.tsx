import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Archive, CheckSquare, Square } from 'lucide-react';
import { EASE_OUT_EXPO } from './MotionPrimitives';

interface MultiDownloadBarProps {
  selectedCount: number;
  totalVisible: number;
  onClear: () => void;
  onSelectAllVisible: () => void;
  onDownloadZip: () => void;
  isDownloadingZip?: boolean;
}

export const MultiDownloadBar: React.FC<MultiDownloadBarProps> = ({
  selectedCount,
  totalVisible,
  onClear,
  onSelectAllVisible,
  onDownloadZip,
  isDownloadingZip = false
}) => {
  const isAllSelected = selectedCount >= totalVisible && totalVisible > 0;

  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 36, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 360, damping: 28 }}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl"
        >
          <div className="bg-[#0D1B2A] border border-white/15 rounded-2xl shadow-[0_24px_54px_-12px_rgba(13,27,42,0.55)] p-3.5 sm:p-4 text-white flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Selection Count Info */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex items-center gap-2.5">
                <motion.span
                  key={selectedCount}
                  initial={{ scale: 0.7 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                  className="w-6 h-6 rounded-full bg-amber-300 text-[#0D1B2A] font-mono font-bold text-xs flex items-center justify-center tabular-nums"
                >
                  {selectedCount}
                </motion.span>
                <span className="text-sm font-semibold">
                  {selectedCount === 1 ? '1 Resource Selected' : `${selectedCount} Resources Selected`}
                </span>
              </div>

              <button
                type="button"
                onClick={onSelectAllVisible}
                className="sm:hidden text-xs text-amber-300 hover:text-amber-200 font-medium cursor-pointer"
              >
                {isAllSelected ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            {/* Action Controls */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.16, ease: EASE_OUT_EXPO }}
                type="button"
                onClick={onSelectAllVisible}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-[#132238] border border-white/15 hover:bg-white/10 text-slate-200 transition-colors cursor-pointer"
              >
                {isAllSelected ? (
                  <>
                    <Square className="w-3.5 h-3.5" />
                    <span>Deselect All</span>
                  </>
                ) : (
                  <>
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>Select All Visible</span>
                  </>
                )}
              </motion.button>

              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                disabled={isDownloadingZip}
                onClick={onDownloadZip}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-lg bg-blue-700 hover:bg-blue-600 text-white transition-colors cursor-pointer shadow-sm disabled:opacity-50"
              >
                <Archive className="w-4 h-4" />
                <span>
                  {isDownloadingZip ? 'Building ZIP Archive...' : `Download Selected (${selectedCount})`}
                </span>
              </motion.button>

              <motion.button
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={onClear}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Clear selection"
                title="Clear selection"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
