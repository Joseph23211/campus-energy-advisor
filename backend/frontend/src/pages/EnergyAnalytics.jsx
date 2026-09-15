import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import SectionHeader from '../components/SectionHeader';
import EnergyChart from '../components/EnergyChart';
import { mockBuildings } from '../data/mockBuildings';
import { sustainability } from '../data/mockEnergyData';

const FILTERS = ['Today', '7 Days', '30 Days', '6 Months', '1 Year'];

const PIE_COLORS = ['#3ee6a8', '#4fd1ff', '#8b7cf6', '#f5b942', '#ff6b5e', '#6ee7d0', '#7db8ff', '#c4a6ff'];

export default function EnergyAnalytics() {
  const [filter, setFilter] = useState('7 Days');

  const buildingComparison = useMemo(
    () => mockBuildings.map((b) => ({ name: b.name.replace(' Block', '').replace(' Center', ' Ctr'), consumption: b.consumption, efficiency: b.efficiency })),
    []
  );

  const intensityPie = useMemo(
    () => mockBuildings.map((b) => ({ name: b.name, value: b.consumption })),
    []
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        title="Energy Analytics"
        subtitle="Consumption trends, peak demand, cost, and carbon across the whole campus."
        action={
          <div className="flex flex-wrap gap-1 rounded-full bg-white/5 p-1">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  filter === f ? 'bg-current-teal text-void-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        }
      />

      <p className="mb-6 -mt-2 text-xs text-slate-500">
        Showing analytics for <span className="text-slate-300">{filter}</span>. Chart below always reflects the
        selected time granularity via its own tabs.
      </p>

      <EnergyChart />

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl glass p-5 sm:p-6 shadow-card lg:col-span-3"
        >
          <h3 className="font-display text-lg font-medium text-white">Building Comparison</h3>
          <p className="text-xs text-slate-400">Consumption (MWh) vs efficiency (%) by building</p>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={buildingComparison} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 6" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} angle={-20} textAnchor="end" height={50} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'rgba(15,21,24,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
                />
                <Bar dataKey="consumption" name="MWh" fill="#3ee6a8" radius={[6, 6, 0, 0]} />
                <Bar dataKey="efficiency" name="Efficiency %" fill="#4fd1ff" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl glass p-5 sm:p-6 shadow-card lg:col-span-2"
        >
          <h3 className="font-display text-lg font-medium text-white">Energy Intensity Share</h3>
          <p className="text-xs text-slate-400">Share of daily consumption by building</p>
          <div className="mt-2 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={intensityPie} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                  {intensityPie.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'rgba(15,21,24,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Carbon Footprint', ...sustainability.carbonFootprint },
          { label: 'Renewable Contribution', ...sustainability.renewableContribution },
          { label: 'Water-Energy Index', ...sustainability.waterEnergyIndex },
          { label: 'Waste Reduction', ...sustainability.wasteReduction },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="rounded-2xl glass p-5"
          >
            <p className="text-xs uppercase tracking-wide text-slate-500">{s.label}</p>
            <p className="mt-1 font-display text-2xl font-semibold text-white">
              {s.value}
              <span className="ml-1 text-sm text-slate-400">{s.unit}</span>
            </p>
            <p className={`mt-1 text-xs ${s.change >= 0 ? 'text-current-teal' : 'text-current-coral'}`}>
              {s.change >= 0 ? '+' : ''}
              {s.change}% vs last period
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
