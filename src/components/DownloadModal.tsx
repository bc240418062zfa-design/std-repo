import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DownloadSession } from '../types';
import { CheckCircle2, Loader2, AlertCircle, ShieldCheck, Download, X, RefreshCw } from 'lucide-react';
import { EASE_OUT_EXPO } from './MotionPrimitives';

interface DownloadModalProps {
  session: DownloadSession | null;
  onClose: () => void;
  onTriggerDownload: () => void;
  /** Re-run the download resolution for the same resource (error state). */
  onRetry?: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  session,
  onClose,
  onTriggerDownload,
  onRetry
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
            initial={{ opacity: 0, scale: 0.95, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#DDD6C8] overflow-hidden text-slate-900 relative"
          >
            {/* Ink Navy Header */}
            <div className="relative bg-[#0D1B2A] text-white px-6 py-4 flex items-center justify-between gap-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#132238] border border-white/15 flex items-center justify-center text-amber-300 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="download-modal-title" className="font-bold text-base text-white leading-tight">
                    Secure Resource Relay
                  </h3>
                  <p className="text-xs text-slate-300 font-mono">
                    dl.study.mihora.tech
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <motion.button
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={onClose}
                className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            <div className="p-6 space-y-5 bg-[#FAF8F4]">
            {/* Resource Details */}
            <div className="bg-white rounded-xl p-3.5 border border-[#E5E0D5] space-y-1">
              <div className="text-xs font-bold text-blue-700 font-mono">
                {session.course}
              </div>
              <div className="text-sm font-semibold text-slate-900 line-clamp-2">
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
                  <div className="flex items-center gap-3 p-3 bg-blue-50/70 rounded-xl text-blue-900 text-xs border border-blue-200">
                    <Loader2 className="w-4 h-4 text-blue-700 animate-spin shrink-0" />
                    <span>Resolving Resource Locator Hash via encrypted relay shards...</span>
                  </div>
                )}

                {session.status === 'ready' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl text-emerald-900 text-xs font-medium border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Short-lived download token issued (valid 120s). Ready to stream.</span>
                    </div>
                    <motion.button
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={onTriggerDownload}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0D1B2A] hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Save to Device</span>
                    </motion.button>
                  </div>
                )}

                {session.status === 'downloading' && (
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl text-blue-900 text-xs font-medium border border-blue-200">
                    <Loader2 className="w-4 h-4 text-blue-700 animate-spin shrink-0" />
                    <span>Streaming resource directly from relay server...</span>
                  </div>
                )}

                {session.status === 'complete' && (
                  <div className="space-y-3 text-center">
                    <motion.div
                      initial={{ scale: 0.94 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className="p-3 bg-emerald-50 rounded-xl text-emerald-800 text-xs font-medium flex items-center justify-center gap-2 border border-emerald-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Download started successfully!</span>
                    </motion.div>
                    <motion.button
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={onClose}
                      className="w-full py-2.5 text-xs font-semibold rounded-xl bg-white border border-[#DDD6C8] hover:bg-[#F3EFE6] text-slate-800 transition-colors cursor-pointer"
                    >
                      Done
                    </motion.button>
                  </div>
                )}

                {session.status === 'error' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-red-50 rounded-xl text-red-800 text-xs flex items-center gap-2 border border-red-200">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{session.errorMessage || 'This resource is temporarily unavailable.'}</span>
                    </div>
                    {onRetry ? (
                      <div className="flex flex-col gap-2">
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          type="button"
                          onClick={onRetry}
                          className="w-full inline-flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl bg-[#0D1B2A] hover:bg-blue-700 text-white transition-colors cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Try again</span>
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          type="button"
                          onClick={onClose}
                          className="w-full py-2 text-xs font-semibold rounded-xl bg-white border border-[#DDD6C8] hover:bg-[#F3EFE6] text-slate-800 transition-colors cursor-pointer"
                        >
                          Dismiss
                        </motion.button>
                      </div>
                    ) : (
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        type="button"
                        onClick={onClose}
                        className="w-full py-2 text-xs font-semibold rounded-xl bg-white border border-[#DDD6C8] hover:bg-[#F3EFE6] text-slate-800 transition-colors cursor-pointer"
                      >
                        Dismiss
                      </motion.button>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Security Note */}
            <div className="pt-2.5 text-[11px] text-slate-500 text-center leading-normal border-t border-[#E5E0D5]">
              Downloads are streamed directly without public storage redirects.
            </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
