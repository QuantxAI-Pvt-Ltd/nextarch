import { Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 select-none">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center backdrop-blur-md">
        <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Compass className="w-8 h-8 text-cyan-400" />
        </div>

        <div className="inline-block px-3 py-1 bg-cyan-950/60 border border-cyan-800/40 rounded-full text-xs font-mono text-cyan-400 mb-3">
          404 ERROR
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
          Page Not Found
        </h1>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          The calculation module or resource you are looking for does not exist or has been relocated.
        </p>

        <a
          href="/calculator"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition-colors shadow-lg shadow-cyan-600/20 cursor-pointer"
        >
          <Home className="w-4 h-4" />
          Back to Calculator
        </a>
      </div>
    </div>
  );
}
