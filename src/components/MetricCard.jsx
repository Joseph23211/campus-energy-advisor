import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import AnimatedCounter from './AnimatedCounter';
import { useInView } from '../hooks/useInView';

export default function MetricCard({ icon: Icon, label, value, unit, change, trend, decimals = 1, sparkline, accent = 'teal', delay = 0 }) {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const positive = trend === 'up';

  const accentMap = {
    teal: 'from-current-teal/20 to-transparent text-current-teal',
    cyan: 'from-current-cyan/20 to-transparent text-current-cyan',
    amber: 'from-current-amber/20 to-transparent text-current-amber',
    coral: 'from-current-coral/20 to-transparent text-current-coral',
    violet: 'from-current-violet/20 to-transparent text-current-violet',
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl glass p-5 shadow-card transition-shadow hover:shadow-glow"
    >
      <div className={`pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-gradient-to-br ${accentMap[accent]} opacity-60 blur-2xl`} />

      <div className="relative flex items-start justify-between">
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 ${accentMap[accent].split(' ').pop()}`}>
          <Icon className="h-4.5 w-4.5" strokeWidth={2} />
        </div>
        <span
          className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium ${
            positive ? 'bg-current-teal/10 text-current-teal' : 'bg-current-coral/10 text-current-coral'
          }`}
        >
          {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {Math.abs(change).toFixed(1)}%
        </span>
      </div>

      <div className="relative mt-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
        <p className="mt-1 font-display text-2xl font-semibold text-slate-900 dark:text-white">
          <AnimatedCounter value={value} decimals={decimals} start={inView} suffix={` ${unit}`} />
        </p>
      </div>

      {sparkline && (
        <div className="relative mt-3 h-8 w-full opacity-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkline}>
              <defs>
                <linearGradient id={`spark-${label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity={0.5} className={accentMap[accent].split(' ').pop()} />
                  <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke="currentColor"
                strokeWidth={1.5}
                fill={`url(#spark-${label})`}
                className={accentMap[accent].split(' ').pop()}
                isAnimationActive={inView}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
}
