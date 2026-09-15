import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, Leaf, TrendingDown, ChevronDown } from 'lucide-react';

const PRIORITY_STYLES = {
  High: 'text-current-coral bg-current-coral/10',
  Medium: 'text-current-amber bg-current-amber/10',
  Low: 'text-current-cyan bg-current-cyan/10',
};

export default function RecommendationCard({ rec, delay = 0, onImplement }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay }}
      className="rounded-2xl glass p-5 shadow-card"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${PRIORITY_STYLES[rec.priority]}`}>
            {rec.priority} priority
          </span>
          <h4 className="mt-2 font-display text-base font-medium text-white">{rec.title}</h4>
          <p className="text-xs text-slate-400">{rec.building}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-white/[0.03] p-3 text-center">
        <div>
          <p className="flex items-center justify-center gap-0.5 text-sm font-semibold text-current-teal">
            <IndianRupee className="h-3 w-3" />
            {rec.savings.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] uppercase tracking-wide text-slate-500">per month</p>
        </div>
        <div>
          <p className="flex items-center justify-center gap-0.5 text-sm font-semibold text-current-cyan">
            <TrendingDown className="h-3 w-3" />
            {rec.energyReduction}%
          </p>
          <p className="text-[10px] uppercase tracking-wide text-slate-500">energy cut</p>
        </div>
        <div>
          <p className="flex items-center justify-center gap-0.5 text-sm font-semibold text-current-violet">
            <Leaf className="h-3 w-3" />
            {rec.co2Reduction}t
          </p>
          <p className="text-[10px] uppercase tracking-wide text-slate-500">CO₂/month</p>
        </div>
      </div>

      <button
        onClick={() => setExpanded((v) => !v)}
        className="mt-3 flex w-full items-center justify-between text-xs text-slate-400 hover:text-slate-200"
      >
        <span>{rec.action}</span>
        <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-2 text-xs leading-relaxed text-slate-400"
        >
          {rec.explanation}
        </motion.p>
      )}

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onImplement?.(rec)}
          className="flex-1 rounded-full bg-current-teal px-4 py-2 text-xs font-semibold text-void-950 transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {rec.status === 'Completed' ? 'Implemented' : 'View Recommendation'}
        </button>
      </div>
    </motion.div>
  );
}
