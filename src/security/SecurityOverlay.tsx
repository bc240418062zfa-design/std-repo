import React from 'react';
import { ShieldAlert, RefreshCw, Lock, ArrowRight, Terminal, Cpu } from 'lucide-react';
import { MihoraLogo } from '../components/MihoraLogo';
import { antiDevTools, DevToolsDetectionDetail } from './antiDevTools';

interface SecurityOverlayProps {
  detail?: DevToolsDetectionDetail | null;
  onDismiss: () => void;
}

export const SecurityOverlay: React.FC<SecurityOverlayProps> = ({ detail, onDismiss }) => {
  const handleResume = () => {
    antiDevTools.resume();
    onDismiss();
  };

  const detectorLabel = detail?.detectorName || 'Developer Inspection Mode';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="security-alert-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/92 backdrop-blur-md p-4 sm:p-6 transition-all duration-200"
    >
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 text-center text-white shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="flex justify-center">
          <MihoraLogo variant="white" size="sm" />
        </div>

        {/* Shield Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
          <ShieldAlert className="w-8 h-8" />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            <span>disable-devtool Anti-Tamper Protection</span>
          </div>

          <h2 id="security-alert-title" className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Developer Inspection Deterrence
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
            Developer tools or inspection mode deterrence was active. For academic security and student resource protection, download sessions are paused while inspection windows are open.
          </p>

          <p className="text-xs text-blue-300 font-medium">
            Agar aap student hain to neeche &ldquo;Resume Study Session&rdquo; dabayein aur apna study material download karein.
          </p>
        </div>

        {/* Detector Specific Diagnostic Badge */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-left space-y-1.5 text-xs text-slate-300 font-mono">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span className="flex items-center gap-1.5 text-blue-400 font-semibold">
              <Terminal className="w-3.5 h-3.5" />
              <span>Inspection Signal</span>
            </span>
            <span className="text-[10px] text-slate-500">Defense Active</span>
          </div>
          <div className="text-xs text-amber-300 font-bold break-words">
            {detectorLabel}
          </div>
        </div>

        {/* Security Info Card */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 text-left space-y-2 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-blue-400 font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>Cryptographic Architecture Safeguard</span>
          </div>
          <p className="text-slate-400 leading-normal">
            MIHORA STUDY LIBRARY enforces server-side AES-256-GCM token resolution and multi-vector anti-debugging. Raw storage endpoints remain cryptographically protected.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={handleResume}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors cursor-pointer"
          >
            <span>Resume Study Session</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Page</span>
          </button>
        </div>
      </div>
    </div>
  );
};
