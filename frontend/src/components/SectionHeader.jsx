import React from 'react';
import { motion } from 'framer-motion';

export default function SectionHeader({ title, subtitle, action, align = 'left' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-6 ${
        align === 'center' ? 'text-center sm:text-left' : ''
      }`}
    >
      <div>
        <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-slate-900 dark:text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-xl">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </motion.div>
  );
}
