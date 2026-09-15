import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ArrowLeft, Thermometer, Users, Zap, Leaf, Gauge } from 'lucide-react';
import { getBuildingById } from '../data/mockBuildings';
import { mockRecommendations } from '../data/mockRecommendations';
import RecommendationCard from '../components/RecommendationCard';
import SectionHeader from '../components/SectionHeader';
import { statusColor } from '../utils/format';

export default function BuildingDetails() {
  const { id } = useParams();
  const building = getBuildingById(id);

  if (!building) return <Navigate to="/buildings" replace />;

  const colors = statusColor(building.level);
  const relatedRecs = mockRecommendations.filter((r) => r.building === building.name);

  const loadData = [
    { name: 'HVAC', value: building.loadSplit.hvac },
    { name: 'Lighting', value: building.loadSplit.lighting },
    { name: 'Equipment', value: building.loadSplit.equipment },
    { name: 'Solar offset', value: building.loadSplit.solar },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link to="/buildings" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to buildings
      </Link>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs text-slate-500">{building.type}</p>
          <h1 className="mt-1 font-display text-3xl font-medium text-slate-900 dark:text-white">{building.name}</h1>
        </div>
        <span className={`rounded-full px-3 py-1.5 text-sm font-medium ${colors.text} bg-white/5`}>{building.status}</span>
      </motion.div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { icon: Zap, label: 'Consumption', value: `${building.consumption} MWh`, color: 'text-current-teal' },
          { icon: Gauge, label: 'Efficiency', value: `${building.efficiency}%`, color: 'text-current-cyan' },
          { icon: Leaf, label: 'Carbon', value: `${building.carbon} tCO₂e`, color: 'text-current-violet' },
          { icon: Thermometer, label: 'Temperature', value: `${building.temperature}°C`, color: 'text-current-amber' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="rounded-2xl glass p-4"
          >
            <s.icon className={`h-4 w-4 ${s.color}`} />
            <p className="mt-2 font-display text-lg font-semibold text-white">{s.value}</p>
            <p className="text-xs text-slate-500">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <div className="rounded-2xl glass p-5 sm:p-6 shadow-card lg:col-span-3">
          <h3 className="font-display text-lg font-medium text-white">Hourly Consumption</h3>
          <p className="text-xs text-slate-400">kWh across the last 24 hours</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={building.hourly.map((v, i) => ({ hour: `${i}:00`, value: v }))} margin={{ left: -20 }}>
                <defs>
                  <linearGradient id="bldgGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3ee6a8" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#3ee6a8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 6" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} interval={3} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'rgba(15,21,24,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="value" stroke="#3ee6a8" strokeWidth={2} fill="url(#bldgGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl glass p-5 sm:p-6 shadow-card lg:col-span-2">
          <h3 className="font-display text-lg font-medium text-white">Load Breakdown</h3>
          <p className="text-xs text-slate-400">Share of total consumption</p>
          <div className="mt-5 space-y-4">
            {loadData.map((l) => (
              <div key={l.name}>
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>{l.name}</span>
                  <span className="font-mono">{l.value}%</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${l.value}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="h-full rounded-full bg-gradient-to-r from-current-teal to-current-cyan"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-current-violet" /> Occupancy: {building.occupancy}%</span>
          </div>
        </div>
      </div>

      {relatedRecs.length > 0 && (
        <div className="mt-10">
          <SectionHeader title="Recommendations for this building" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedRecs.map((rec, i) => (
              <RecommendationCard key={rec.id} rec={rec} delay={i * 0.08} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
