import React from 'react';
import { motion } from 'framer-motion';
import { Zap, IndianRupee, Cloud, Leaf, Gauge, Award } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import EnergyChart from '../components/EnergyChart';
import CampusMap from '../components/CampusMap';
import BuildingCard from '../components/BuildingCard';
import AlertCard from '../components/AlertCard';
import SectionHeader from '../components/SectionHeader';
import EnergyAdvisor from '../components/EnergyAdvisor';
import { liveMetrics, consumptionToday } from '../data/mockEnergyData';
import { mockBuildings } from '../data/mockBuildings';
import { mockAlerts } from '../data/mockAlerts';

const sparkline = consumptionToday.map((d) => ({ v: d.current }));

const METRICS = [
  { key: 'totalEnergyToday', label: 'Total Energy Today', icon: Zap, accent: 'teal' },
  { key: 'energyCost', label: 'Energy Cost', icon: IndianRupee, accent: 'cyan' },
  { key: 'carbonEmissions', label: 'Carbon Emissions', icon: Cloud, accent: 'violet' },
  { key: 'renewableShare', label: 'Renewable Energy', icon: Leaf, accent: 'teal' },
  { key: 'peakDemand', label: 'Peak Demand', icon: Gauge, accent: 'amber' },
  { key: 'efficiencyScore', label: 'Efficiency Score', icon: Award, accent: 'cyan' },
];

export default function Dashboard() {
  const rankedBuildings = [...mockBuildings].sort((a, b) => b.efficiency - a.efficiency);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="text-sm text-slate-500 dark:text-slate-400">Good morning, Campus.</p>
        <h1 className="mt-1 font-display text-3xl font-medium tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Here's your energy intelligence for today.
        </h1>
      </motion.div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {METRICS.map((m, i) => {
          const d = liveMetrics[m.key];
          return (
            <MetricCard
              key={m.key}
              icon={m.icon}
              label={m.label}
              value={d.value}
              unit={d.unit}
              change={d.change}
              trend={d.trend}
              decimals={Number.isInteger(d.value) ? 0 : 1}
              accent={m.accent}
              sparkline={sparkline}
              delay={i * 0.05}
            />
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <EnergyChart />
        </div>
        <div className="lg:col-span-2">
          <CampusMap />
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <SectionHeader title="Building Performance" subtitle="Ranked by efficiency across all monitored buildings." />
          <div className="grid gap-3">
            {rankedBuildings.slice(0, 5).map((b, i) => (
              <BuildingCard key={b.id} building={b} rank={i + 1} delay={i * 0.06} />
            ))}
          </div>
        </div>
        <div className="lg:col-span-2">
          <SectionHeader title="Smart Alerts" subtitle="Anomalies and highlights from the last few hours." />
          <div className="grid gap-3">
            {mockAlerts.slice(0, 4).map((a, i) => (
              <AlertCard key={a.id} alert={a} delay={i * 0.06} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10">
        <EnergyAdvisor limit={3} />
      </div>
    </div>
  );
}
