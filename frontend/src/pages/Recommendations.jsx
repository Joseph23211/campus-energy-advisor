import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { mockRecommendations } from '../data/mockRecommendations';

const DIFFICULTY_STYLES = {
  Easy: 'text-current-teal bg-current-teal/10',
  Medium: 'text-current-amber bg-current-amber/10',
  Hard: 'text-current-coral bg-current-coral/10',
};

const GROUPS = [
  { key: 'High', label: 'High Priority' },
  { key: 'Medium', label: 'Medium Priority' },
  { key: 'Low', label: 'Low Priority' },
];

function DetailRow({ rec, delay, onToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, delay }}
      className="rounded-2xl glass p-5 shadow-card"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="font-display text-base font-medium text-white">{rec.title}</h4>
          <p className="text-xs text-slate-400">{rec.building}</p>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${DIFFICULTY_STYLES[rec.difficulty]}`}>
          {rec.difficulty} to implement
        </span>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <p className="text-xs text-slate-400"><span className="text-slate-500">Problem: </span>{rec.problem}</p>
        <p className="text-xs text-slate-400"><span className="text-slate-500">Action: </span>{rec.action}</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-xs">
        <span className="text-current-teal font-medium">₹{rec.savings.toLocaleString('en-IN')}/mo saved</span>
        <span className="text-current-cyan font-medium">{rec.energyReduction}% energy cut</span>
        <span className="text-current-violet font-medium">{rec.co2Reduction}t CO₂/mo</span>
      </div>

      <div className="mt-4 flex gap-2">
        {rec.status === 'Completed' ? (
          <span className="flex items-center gap-1.5 rounded-full bg-current-teal/10 px-4 py-2 text-xs font-medium text-current-teal">
            <CheckCircle2 className="h-3.5 w-3.5" /> Implemented
          </span>
        ) : (
          <>
            <button
              onClick={() => onToggle(rec.id)}
              className="rounded-full bg-current-teal px-4 py-2 text-xs font-semibold text-void-950 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Implement
            </button>
            <button className="rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-slate-300 hover:border-white/30 transition-colors">
              Review
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default function Recommendations() {
  const [completedIds, setCompletedIds] = useState(() => mockRecommendations.filter((r) => r.status === 'Completed').map((r) => r.id));
  const [tab, setTab] = useState('High');

  const items = useMemo(
    () => mockRecommendations.map((r) => (completedIds.includes(r.id) ? { ...r, status: 'Completed' } : { ...r, status: 'Pending' })),
    [completedIds]
  );

  const grouped = {
    High: items.filter((r) => r.priority === 'High' && r.status !== 'Completed'),
    Medium: items.filter((r) => r.priority === 'Medium' && r.status !== 'Completed'),
    Low: items.filter((r) => r.priority === 'Low' && r.status !== 'Completed'),
    Completed: items.filter((r) => r.status === 'Completed'),
  };

  function handleImplement(id) {
    setCompletedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }

  const tabs = [...GROUPS, { key: 'Completed', label: 'Completed' }];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        title="Recommendations"
        subtitle="Every open opportunity to cut energy, cost, and carbon — organized by priority."
      />

      <div className="mb-6 flex flex-wrap gap-1 rounded-full bg-white/5 p-1 w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition-colors ${
              tab === t.key ? 'bg-current-teal text-void-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.label}
            <span className="rounded-full bg-black/10 px-1.5 text-[10px]">{grouped[t.key].length}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {grouped[tab].map((rec, i) => (
          <DetailRow key={rec.id} rec={rec} delay={i * 0.06} onToggle={handleImplement} />
        ))}
        {grouped[tab].length === 0 && (
          <div className="col-span-full rounded-2xl glass p-10 text-center text-sm text-slate-400">
            Nothing here right now — check another tab.
          </div>
        )}
      </div>
    </div>
  );
}
