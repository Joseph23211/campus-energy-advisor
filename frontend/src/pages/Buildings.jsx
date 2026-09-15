import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Thermometer, Users, Zap } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import CampusMap from '../components/CampusMap';
import { mockBuildings } from '../data/mockBuildings';
import { statusColor } from '../utils/format';

const TYPES = ['All', 'Academic', 'Residential', 'Recreation', 'Admin'];

export default function Buildings() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('All');

  const filtered = useMemo(
    () =>
      mockBuildings.filter(
        (b) =>
          (type === 'All' || b.type === type) &&
          b.name.toLowerCase().includes(query.toLowerCase())
      ),
    [query, type]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader title="Buildings" subtitle="Every monitored building on campus, with live energy performance." />

      <CampusMap />

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search buildings…"
            className="w-full rounded-full glass py-2.5 pl-9 pr-4 text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:border-current-teal/50"
          />
        </div>
        <div className="flex flex-wrap gap-1 rounded-full bg-white/5 p-1">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                type === t ? 'bg-current-teal text-void-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((b, i) => {
          const colors = statusColor(b.level);
          return (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link to={`/buildings/${b.id}`} className="group block rounded-2xl glass p-5 shadow-card hover:border-white/20 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-slate-500">{b.type}</p>
                    <h3 className="mt-0.5 font-display text-lg font-medium text-white">{b.name}</h3>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${colors.text} bg-white/5`}>{b.status}</span>
                </div>

                <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                  <div className={`h-full rounded-full ${colors.bg}`} style={{ width: `${b.efficiency}%` }} />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Zap className="h-3.5 w-3.5 text-current-teal" /> {b.consumption} MWh</span>
                  <span className="flex items-center gap-1"><Thermometer className="h-3.5 w-3.5 text-current-cyan" /> {b.temperature}°C</span>
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-current-violet" /> {b.occupancy}%</span>
                </div>
              </Link>
            </motion.div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full rounded-2xl glass p-10 text-center text-sm text-slate-400">
            No buildings match "{query}". Try a different search or filter.
          </div>
        )}
      </div>
    </div>
  );
}
