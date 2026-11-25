import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Branded "something went wrong" page. Shown when React itself crashes
 * (bad render, failed chunk, unexpected exception). Styled like the rest of
 * MIHORA VU — light canvas, institutional navy, no raw stack dump on screen.
 * The error message is kept behind a <details> toggle for debugging only.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in application:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-celestial-canvas bg-star-dust text-slate-900 flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 text-center space-y-5 shadow-[0_20px_50px_-15px_rgba(4,8,20,0.25)]">
            <p className="text-[11px] font-mono font-semibold text-amber-600 uppercase tracking-widest">
              MIHORA VU &middot; Study Library
            </p>

            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
                Something went wrong
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed">
                The study library hit an unexpected error and couldn&rsquo;t show
                this page. Your saved work and downloads are safe &mdash; try
                loading the page again, or head back to the homepage.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-2">
              <button
                type="button"
                onClick={this.handleRetry}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0B1526] hover:bg-blue-700 text-white text-sm font-bold transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Try again</span>
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-800 text-sm font-bold transition-colors cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Go to Homepage</span>
              </button>
            </div>

            {this.state.error && (
              <details className="text-left">
                <summary className="text-xs font-semibold text-slate-500 cursor-pointer hover:text-slate-700 text-center">
                  Technical details
                </summary>
                <pre className="mt-3 text-[11px] font-mono bg-slate-50 p-3 rounded-lg text-slate-600 text-left overflow-x-auto max-h-32 border border-slate-200 break-words whitespace-pre-wrap">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
