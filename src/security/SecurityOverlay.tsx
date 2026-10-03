import React, { useState } from 'react';
import { ShieldAlert, RefreshCw, Lock, ArrowRight, AlertTriangle } from 'lucide-react';
import { MihoraLogo } from '../components/MihoraLogo';
import { antiDevTools } from './antiDevTools';

interface SecurityOverlayProps {
  onDismiss: () => void;
}

export const SecurityOverlay: React.FC<SecurityOverlayProps> = ({ onDismiss }) => {
  const [warning, setWarning] = useState<string | null>(null);

  const handleResume = () => {
    // Check if DevTools is still open
    if (antiDevTools.checkIsOpen()) {
      setWarning(
        'Developer Tools are still active! Please close the inspect window (press F12 or click ✕ on DevTools) before resuming.'
      );
      setTimeout(() => {
        setWarning(null);
      }, 4000);
      return;
    }
    // DevTools confirmed closed
    setWarning(null);
    onDismiss();
  };

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
        <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 animate-pulse">
          <ShieldAlert className="w-8 h-8" />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h2 id="security-alert-title" className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Developer Session Detected
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
            Browser Developer Tools or Inspect mode is currently active. For academic security and resource protection, download sessions are temporarily paused.
          </p>
          <p className="text-xs text-slate-400 italic">
            Barah-e-karam pehle DevTools / Inspect window ko close karein phir Resume dabayein.
          </p>
        </div>

        {/* Warning if still open */}
        {warning && (
          <div className="bg-red-950/80 border border-red-700/80 rounded-xl p-3 text-xs text-red-200 flex items-center gap-2 text-left animate-shake">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <div>
              <p className="font-semibold">{warning}</p>
              <p className="text-[11px] text-red-300 mt-0.5">
                DevTools abhi band nahi hue. Pehle browser ki inspect window ko close karein.
              </p>
            </div>
          </div>
        )}

        {/* Security Info Card */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 text-left space-y-2 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-blue-400 font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>Cryptographic Architecture Safeguard</span>
          </div>
          <p className="text-slate-400 leading-normal">
            MIHORA STUDY LIBRARY enforces server-side AES-256-GCM token resolution. Raw storage endpoints and credentials remain cryptographically isolated.
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

