import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { getPredictedEnergy } from '../data/mockPredictions';

export default function PredictedUsageCard() {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const now = new Date();
    getPredictedEnergy(28, 0.6, now.getHours())
      .then(setPrediction)
      .catch(() => setError('Prediction service unavailable'));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl glass p-5 shadow-card"
    >
      <div className="flex items-center gap-2 text-current-teal">
        <Sparkles className="h-4 w-4" strokeWidth={2} />
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Predicted usage (next hour)
        </p>
      </div>

      <div className="mt-3">
        {error && <p className="text-sm text-current-coral">{error}</p>}
        {!error && !prediction && (
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading prediction...</p>
        )}
        {prediction && (
          <p className="font-display text-2xl font-semibold text-slate-900 dark:text-white">
            {prediction.predictedEnergyKwh} kWh
          </p>
        )}
      </div>

      <p className="mt-2 text-xs text-slate-400">
        From the campus ML model, based on temperature and occupancy.
      </p>
    </motion.div>
  );
}
