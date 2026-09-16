import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingDown } from 'lucide-react';
import { consumptionByRange, peakInsight } from '../data/mockEnergyData';

const RANGES = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
  { key: 'year', label: 'Year' },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl glass px-3 py-2 text-xs shadow-card">
      <p className="mb-1 font-medium text-slate-300">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="flex items-center gap-1.5" style={{ color: p.color }}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: p.color }} />
          {p.name}: {p.value.toLocaleString()} kWh
        </p>
      ))}
    </div>
  );
}

export default function EnergyChart() {
  const [range, setRange] = useState('today');
  const data = consumptionByRange[range];

  return (
    <div className="rounded-2xl glass p-5 sm:p-6 shadow-card">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-display text-lg font-medium text-white">Energy Consumption</h3>
          <p className="text-xs text-slate-400">vs previous period</p>
        </div>
        <div className="flex gap-1 rounded-full bg-white/5 p-1">
          {RANGES.map((r) => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                range === r.key ? 'bg-current-teal text-void-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="currentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3ee6a8" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#3ee6a8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="prevGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4fd1ff" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#4fd1ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 6" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="previous" name="Previous period" stroke="#4fd1ff" strokeWidth={1.5} strokeDasharray="4 4" fill="url(#prevGrad)" />
            <Area type="monotone" dataKey="current" name="Current period" stroke="#3ee6a8" strokeWidth={2} fill="url(#currentGrad)" activeDot={{ r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-xl bg-white/[0.03] px-4 py-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-current-cyan/10 text-current-cyan">
          <TrendingDown className="h-3.5 w-3.5" />
        </span>
        <p className="text-xs text-slate-300">{peakInsight[range]}</p>
      </div>

      <div className="mt-4 flex items-center gap-5 text-xs text-slate-400">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-current-teal" /> Current</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-current-cyan" /> Previous</span>
      </div>
    </div>
  );
}
