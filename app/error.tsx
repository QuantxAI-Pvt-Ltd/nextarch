"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production, we don't log full traces to console to prevent data leakage
    if (process.env.NODE_ENV !== "production") {
      console.error("Application Error:", error);
    }
  }, [error]);

  const handleReset = () => {
    try {
      reset();
    } catch {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 select-none">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center backdrop-blur-md">
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
          Something went wrong
        </h1>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          An unexpected error occurred while processing your request. Our system has safely contained the issue.
        </p>

        {error.digest && (
          <div className="mb-6 p-2.5 bg-slate-950 border border-slate-800/80 rounded-lg text-xs font-mono text-slate-400 select-all">
            Error Reference: {error.digest}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition-colors shadow-lg shadow-cyan-600/20 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <a
            href="/calculator"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors border border-slate-700 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Return to Calculator
          </a>
        </div>
      </div>
    </div>
  );
}
