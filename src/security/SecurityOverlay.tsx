import React from 'react';
import { ShieldCheck, RefreshCw, ArrowRight } from 'lucide-react';
import { MihoraLogo } from '../components/MihoraLogo';
import { antiDevTools, DevToolsDetectionDetail } from './antiDevTools';

interface SecurityOverlayProps {
  detail?: DevToolsDetectionDetail | null;
  onDismiss: () => void;
}

export const SecurityOverlay: React.FC<SecurityOverlayProps> = ({ onDismiss }) => {
  const handleResume = () => {
    antiDevTools.resume();
    onDismiss();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="security-alert-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 sm:p-6 transition-all duration-200"
    >
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center text-white shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="flex justify-center">
          <MihoraLogo variant="white" size="sm" />
        </div>

        {/* Shield Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-inner">
          <ShieldCheck className="w-8 h-8" />
        </div>

        {/* User-Friendly Message */}
        <div className="space-y-3">
          <h2 id="security-alert-title" className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Study Session Paused
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
            Inspection window or developer shortcut was detected. For resource safety, the portal view is paused.
          </p>

          <p className="text-xs text-blue-300 font-medium">
            Apna study session continue karne ke liye neeche &ldquo;Resume Study Session&rdquo; dabayein.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={handleResume}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all cursor-pointer shadow-md shadow-blue-600/30 active:scale-95"
          >
            <span>Resume Study Session</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload</span>
          </button>
        </div>
      </div>
    </div>
  );
};
