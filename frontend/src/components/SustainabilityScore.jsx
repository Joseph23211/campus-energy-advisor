import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import AnimatedCounter from './AnimatedCounter';

export default function SustainabilityScore({ score = 86, size = 200 }) {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const radius = (size - 24) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div ref={ref} className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.06)" strokeWidth="12" fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#scoreGrad)"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: inView ? offset : circumference }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3ee6a8" />
            <stop offset="100%" stopColor="#4fd1ff" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display text-4xl font-semibold text-white">
          <AnimatedCounter value={score} decimals={0} start={inView} />
        </span>
        <span className="mt-1 text-[11px] uppercase tracking-wide text-slate-400">Sustainability Score</span>
      </div>
    </div>
  );
}
