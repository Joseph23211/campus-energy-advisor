import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';

export default function LoadingScreen({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const start = performance.now();
    const duration = 1400;
    let frame;
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      setProgress(p);
      if (p < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setVisible(false);
          onDone?.();
        }, 250);
      }
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [onDone]);

  const circumference = 2 * Math.PI * 54;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-void-950"
        >
          <div className="relative flex h-32 w-32 items-center justify-center">
            <svg width="128" height="128" className="-rotate-90">
              <circle cx="64" cy="64" r="54" stroke="rgba(255,255,255,0.06)" strokeWidth="4" fill="none" />
              <circle
                cx="64"
                cy="64"
                r="54"
                stroke="#3ee6a8"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progress)}
              />
            </svg>
            <span className="absolute flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-current-teal to-current-cyan shadow-glow">
              <Zap className="h-6 w-6 text-void-950" strokeWidth={2.5} />
            </span>
          </div>
          <p className="mt-6 font-display text-sm tracking-wide text-slate-300">
            Initializing Campus Intelligence<span className="animate-pulse">...</span>
          </p>
          <p className="mt-1 font-mono text-xs text-slate-500">{Math.round(progress * 100)}%</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
