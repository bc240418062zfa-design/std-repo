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
          <div className="bg-[#0A192F]/95 border border-blue-800/70 rounded-2xl shadow-2xl p-3.5 sm:p-4 text-white flex flex-col sm:flex-row items-center justify-between gap-3 backdrop-blur-lg">
            {/* Selection Count Info */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex items-center gap-2">
                <motion.span
                  key={selectedCount}
                  initial={{ scale: 0.7 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                  className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center tabular-nums"
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
                className="sm:hidden text-xs text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
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
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
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
                whileHover={{ y: -1.5, scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                disabled={isDownloadingZip}
                onClick={onDownloadZip}
                className="btn-shimmer flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer shadow-md shadow-blue-500/30 disabled:opacity-50"
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
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
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
