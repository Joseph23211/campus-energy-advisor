import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Building2, Leaf, Sparkles } from 'lucide-react';
import EnergyOrb from '../components/EnergyOrb';
import AnimatedCounter from '../components/AnimatedCounter';
import { liveMetrics } from '../data/mockEnergyData';

const FEATURES = [
  {
    icon: BarChart3,
    title: 'Real-time intelligence',
    text: 'Track consumption, cost, and carbon across every meter on campus, updated continuously.',
  },
  {
    icon: Building2,
    title: 'Building-level clarity',
    text: 'See exactly where energy goes — HVAC, lighting, equipment, solar — building by building.',
  },
  {
    icon: Sparkles,
    title: 'AI-driven recommendations',
    text: 'Get ranked, quantified actions with expected savings before you commit budget or effort.',
  },
  {
    icon: Leaf,
    title: 'Sustainability tracking',
    text: 'Watch your renewable share, carbon footprint, and efficiency score move in one place.',
  },
];

export default function Landing() {
  return (
    <div>
      <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-current-teal">
              <span className="h-1.5 w-1.5 rounded-full bg-current-teal animate-pulseGlow" />
              Live across 8 campus buildings
            </span>
            <h1 className="mt-5 font-display text-4xl font-medium leading-[1.08] tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
              Powering <span className="text-gradient">smarter</span> campuses.
            </h1>
            <p className="mt-5 max-w-lg text-base text-slate-600 dark:text-slate-400 sm:text-lg">
              Turn campus energy data into intelligent decisions, measurable savings, and a more
              sustainable future.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/dashboard"
                className="group flex items-center gap-2 rounded-full bg-current-teal px-6 py-3 text-sm font-semibold text-void-950 transition-transform hover:scale-[1.03] active:scale-[0.98]"
              >
                Explore Campus
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/energy"
                className="rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:border-white/30 transition-colors"
              >
                View Energy Insights
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-6 max-w-md">
              <div>
                <p className="font-display text-2xl font-semibold text-slate-900 dark:text-white">
                  <AnimatedCounter value={liveMetrics.totalEnergyToday.value} decimals={1} suffix=" MWh" />
                </p>
                <p className="text-xs text-slate-500">Today's usage</p>
              </div>
              <div>
                <p className="font-display text-2xl font-semibold text-slate-900 dark:text-white">
                  <AnimatedCounter value={liveMetrics.renewableShare.value} decimals={0} suffix="%" />
                </p>
                <p className="text-xs text-slate-500">Renewable share</p>
              </div>
              <div>
                <p className="font-display text-2xl font-semibold text-slate-900 dark:text-white">
                  <AnimatedCounter value={liveMetrics.efficiencyScore.value} decimals={0} suffix="/100" />
                </p>
                <p className="text-xs text-slate-500">Efficiency score</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
          >
            <EnergyOrb />
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="rounded-2xl glass p-5"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-current-teal/10 text-current-teal">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-base font-medium text-slate-900 dark:text-white">{f.title}</h3>
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{f.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-5xl rounded-3xl glass p-10 text-center shadow-card"
        >
          <h2 className="font-display text-2xl font-medium text-slate-900 dark:text-white sm:text-3xl">
            Your campus could save <span className="text-gradient">₹8.4L</span> a year.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500 dark:text-slate-400">
            That's what the Energy Advisor projects if every open recommendation is implemented —
            see exactly where the savings come from.
          </p>
          <Link
            to="/recommendations"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-medium text-white hover:bg-white/15 transition-colors"
          >
            See the recommendations
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
