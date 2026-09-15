import React from 'react';
import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-current-teal to-current-cyan">
            <Zap className="h-3 w-3 text-void-950" strokeWidth={2.5} />
          </span>
          <span className="font-display text-sm text-slate-400">Energix Campus</span>
        </div>
        <p className="text-xs text-slate-500">Mock data for demonstration purposes · Christ University · {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
