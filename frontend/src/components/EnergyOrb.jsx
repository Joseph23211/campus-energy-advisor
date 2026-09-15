import React from 'react';
import { motion } from 'framer-motion';

export default function EnergyOrb() {
  const nodes = Array.from({ length: 10 }).map((_, i) => {
    const angle = (i / 10) * Math.PI * 2;
    return {
      x: 50 + Math.cos(angle) * 38,
      y: 50 + Math.sin(angle) * 38,
    };
  });

  return (
    <div className="relative mx-auto aspect-square w-full max-w-md" aria-hidden="true">
      <div className="absolute inset-0 animate-spinSlow">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <defs>
            <radialGradient id="orbGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3ee6a8" stopOpacity="0.55" />
              <stop offset="60%" stopColor="#4fd1ff" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#0a0e0f" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="40" fill="url(#orbGrad)" />
          <circle cx="50" cy="50" r="40" stroke="rgba(62,230,168,0.25)" strokeWidth="0.4" fill="none" />
          <circle cx="50" cy="50" r="30" stroke="rgba(79,209,255,0.2)" strokeWidth="0.3" fill="none" />
          {nodes.map((n, i) => (
            <line key={i} x1="50" y1="50" x2={n.x} y2={n.y} stroke="rgba(62,230,168,0.25)" strokeWidth="0.25" />
          ))}
          {nodes.map((n, i) => (
            <circle key={`n-${i}`} cx={n.x} cy={n.y} r="1.1" fill="#3ee6a8">
              <animate attributeName="opacity" values="0.3;1;0.3" dur={`${2 + (i % 4)}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </svg>
      </div>

      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-current-teal to-current-cyan blur-2xl opacity-60" />
      </motion.div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-void-900/60 backdrop-blur-sm">
          <span className="font-display text-xs font-medium text-current-teal">86%</span>
        </div>
      </div>

      {Array.from({ length: 8 }).map((_, i) => (
        <span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-current-cyan/70 animate-floaty"
          style={{
            left: `${10 + ((i * 47) % 80)}%`,
            top: `${10 + ((i * 29) % 80)}%`,
            animationDelay: `${i * 0.3}s`,
            animationDuration: `${5 + (i % 3)}s`,
          }}
        />
      ))}
    </div>
  );
}
