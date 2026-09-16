import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { statusColor } from '../utils/format';

export default function BuildingCard({ building, rank, delay = 0 }) {
  const colors = statusColor(building.level);
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, delay }}
    >
      <Link
        to={`/buildings/${building.id}`}
        className="group flex items-center gap-4 rounded-2xl glass p-4 transition-colors hover:border-white/20"
      >
        <span className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 font-mono text-xs text-slate-400">
          {String(rank).padStart(2, '0')}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate font-medium text-slate-900 dark:text-white">{building.name}</p>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${colors.text} bg-white/5`}>
              {building.status}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${building.efficiency}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: delay + 0.1, ease: 'easeOut' }}
                className={`h-full rounded-full ${colors.bg}`}
              />
            </div>
            <span className="shrink-0 font-mono text-xs text-slate-400">{building.efficiency}%</span>
          </div>
          <p className="mt-1.5 text-xs text-slate-500">{building.consumption} MWh today · {building.type}</p>
        </div>

        <ChevronRight className="h-4 w-4 shrink-0 text-slate-500 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </motion.div>
  );
}
