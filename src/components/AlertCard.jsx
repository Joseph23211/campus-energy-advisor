import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';

const CONFIG = {
  warning: { icon: AlertTriangle, color: 'text-current-amber', bg: 'bg-current-amber/10' },
  success: { icon: CheckCircle2, color: 'text-current-teal', bg: 'bg-current-teal/10' },
  info: { icon: Info, color: 'text-current-cyan', bg: 'bg-current-cyan/10' },
};

export default function AlertCard({ alert, delay = 0 }) {
  const cfg = CONFIG[alert.type] || CONFIG.info;
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.35, delay }}
      className="flex items-start gap-3 rounded-2xl glass p-4"
    >
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${cfg.bg} ${cfg.color}`}>
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-slate-900 dark:text-white">{alert.title}</p>
          <span className="shrink-0 text-[11px] text-slate-500">{alert.time}</span>
        </div>
        <p className="mt-0.5 text-xs text-slate-400">{alert.message}</p>
      </div>
    </motion.div>
  );
}
