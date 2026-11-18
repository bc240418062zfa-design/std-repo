import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DownloadSession } from '../types';
import { CheckCircle2, Loader2, AlertCircle, ShieldCheck, Download, X } from 'lucide-react';
import { EASE_OUT_EXPO } from './MotionPrimitives';

interface DownloadModalProps {
  session: DownloadSession | null;
  onClose: () => void;
  onTriggerDownload: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  session,
  onClose,
  onTriggerDownload
}) => {
  return (
    <AnimatePresence>
      {session && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="download-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-5 text-slate-900 relative"
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </motion.button>

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 id="download-modal-title" className="font-bold text-base text-slate-900 leading-tight">
                  Secure Resource Relay
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  dl.study.mihora.tech
                </p>
              </div>
            </div>

            {/* Resource Details */}
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 space-y-1">
              <div className="text-xs font-semibold text-blue-700 font-mono">
                {session.course}
              </div>
              <div className="text-sm font-semibold text-slate-800 line-clamp-2">
                {session.name}
              </div>
            </div>

            {/* Resolution Stages */}
            <AnimatePresence mode="wait">
              <motion.div
                key={session.status}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: EASE_OUT_EXPO }}
                className="space-y-3"
              >
                {session.status === 'resolving' && (
                  <div className="flex items-center gap-3 p-3 bg-blue-50/60 rounded-lg text-blue-900 text-xs">
                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                    <span>Resolving Resource Locator Hash via encrypted relay shards...</span>
                  </div>
                )}

                {session.status === 'ready' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg text-emerald-900 text-xs font-medium border border-emerald-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Short-lived download token issued (valid 120s). Ready to stream.</span>
                    </div>
                    <motion.button
                      whileHover={{ y: -1.5, scale: 1.01 }}
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={onTriggerDownload}
                      className="btn-shimmer w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Save to Device</span>
                    </motion.button>
                  </div>
                )}

                {session.status === 'downloading' && (
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg text-blue-900 text-xs font-medium">
                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                    <span>Streaming resource directly from relay server...</span>
                  </div>
                )}

                {session.status === 'complete' && (
                  <div className="space-y-3 text-center">
                    <motion.div
                      initial={{ scale: 0.92 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                      className="p-3 bg-emerald-50 rounded-lg text-emerald-800 text-xs font-medium flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Download started successfully!</span>
                    </motion.div>
                    <motion.button
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={onClose}
                      className="w-full py-2.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                    >
                      Done
                    </motion.button>
                  </div>
                )}

                {session.status === 'error' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-red-50 rounded-lg text-red-800 text-xs flex items-center gap-2 border border-red-100">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{session.errorMessage || 'This resource is temporarily unavailable.'}</span>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={onClose}
                      className="w-full py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                    >
                      Dismiss
                    </motion.button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Security Note */}
            <div className="pt-2 text-[11px] text-slate-400 text-center leading-normal border-t border-slate-100">
              Downloads are streamed directly without public storage redirects.
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
