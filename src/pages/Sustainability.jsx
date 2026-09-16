import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Droplets, Recycle, Sun } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import SustainabilityScore from '../components/SustainabilityScore';
import AnimatedCounter from '../components/AnimatedCounter';
import { useInView } from '../hooks/useInView';
import { sustainability, savingsForecast } from '../data/mockEnergyData';

const BREAKDOWN = [
  { icon: Leaf, label: 'Carbon Footprint', ...sustainability.carbonFootprint, color: 'text-current-teal' },
  { icon: Sun, label: 'Renewable Contribution', ...sustainability.renewableContribution, color: 'text-current-amber' },
  { icon: Droplets, label: 'Water-Energy Index', ...sustainability.waterEnergyIndex, color: 'text-current-cyan' },
  { icon: Recycle, label: 'Waste Reduction', ...sustainability.wasteReduction, color: 'text-current-violet' },
];

export default function Sustainability() {
  const [forecastRef, forecastInView] = useInView({ threshold: 0.3 });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader title="Sustainability" subtitle="How the campus is tracking against its environmental goals." />

      <div className="grid gap-6 lg:grid-cols-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center rounded-2xl glass p-8 shadow-card lg:col-span-2"
        >
          <SustainabilityScore score={sustainability.score} />
          <p className="mt-4 text-center text-sm text-slate-400 max-w-xs">
            A blended measure of efficiency, renewable share, and emissions intensity across campus.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-3">
          {BREAKDOWN.map((b, i) => (
            <motion.div
              key={b.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="rounded-2xl glass p-5"
            >
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 ${b.color}`}>
                <b.icon className="h-4.5 w-4.5" />
              </span>
              <p className="mt-3 text-xs uppercase tracking-wide text-slate-500">{b.label}</p>
              <p className="mt-1 font-display text-xl font-semibold text-white">
                {b.value}
                <span className="ml-1 text-sm text-slate-400">{b.unit}</span>
              </p>
              <p className={`mt-1 text-xs ${b.change >= 0 ? 'text-current-teal' : 'text-current-coral'}`}>
                {b.change >= 0 ? '+' : ''}
                {b.change}% vs last period
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <div ref={forecastRef} className="mt-10 rounded-3xl glass p-8 sm:p-10 shadow-card">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-wide text-current-teal">Energy Savings Forecast</p>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl font-medium text-white">
              Your campus could save{' '}
              <span className="text-gradient">
                ₹<AnimatedCounter value={savingsForecast.annualSavings} decimals={1} start={forecastInView} />L
              </span>{' '}
              per year.
            </h2>
            <p className="mt-3 text-sm text-slate-400 max-w-md">
              Projected if every recommended action from the Energy Advisor is implemented across all
              eight buildings.
            </p>
            <a
              href="/recommendations"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-current-teal px-5 py-2.5 text-sm font-semibold text-void-950"
            >
              View recommendations <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Energy reduction', value: savingsForecast.energyReduction, unit: '%' },
              { label: 'CO₂ reduction', value: savingsForecast.co2Reduction, unit: '%' },
              { label: 'Peak demand cut', value: savingsForecast.peakDemandReduction, unit: '%' },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-white/[0.04] p-4 text-center">
                <p className="font-display text-2xl font-semibold text-current-teal">
                  <AnimatedCounter value={s.value} decimals={1} start={forecastInView} suffix={s.unit} />
                </p>
                <p className="mt-1 text-[11px] text-slate-400">{s.label}</p>
              </div>
            ))}
            <div className="col-span-3 mt-2 flex items-center justify-center gap-4 rounded-2xl bg-white/[0.04] p-4">
              <div className="text-center">
                <p className="font-mono text-sm text-slate-400">Current</p>
                <p className="font-display text-lg font-semibold text-white">{savingsForecast.currentLoad} MW</p>
              </div>
              <ArrowRight className="h-4 w-4 text-current-teal" />
              <div className="text-center">
                <p className="font-mono text-sm text-current-teal">Optimized</p>
                <p className="font-display text-lg font-semibold text-current-teal">{savingsForecast.optimizedLoad} MW</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
