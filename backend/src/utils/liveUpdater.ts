import cron from 'node-cron';
import db from '../db/knex';

function jitter(value: number, pct: number, min: number, max: number): number {
  const delta = value * pct * (Math.random() * 2 - 1);
  return Math.min(max, Math.max(min, Math.round((value + delta) * 100) / 100));
}

async function tickCampusMetrics() {
  const metric = await db('campus_metrics').orderBy('updated_at', 'desc').first();
  if (!metric) return;

  await db('campus_metrics')
    .where({ id: metric.id })
    .update({
      total_energy_today: jitter(metric.total_energy_today, 0.015, 5, 60),
      energy_cost: jitter(metric.energy_cost, 0.015, 0.5, 5),
      carbon_emissions: jitter(metric.carbon_emissions, 0.02, 2, 20),
      renewable_percentage: jitter(metric.renewable_percentage, 0.03, 10, 70),
      peak_demand: jitter(metric.peak_demand, 0.02, 1, 6),
      efficiency_score: jitter(metric.efficiency_score, 0.01, 50, 99),
      updated_at: db.fn.now(),
    });
}

async function tickBuildings() {
  const buildings = await db('buildings');

  for (const b of buildings) {
    const currentConsumption = jitter(b.current_consumption, 0.03, 0.3, 6);
    const temperature = jitter(b.temperature, 0.01, 18, 30);
    const occupancy = Math.round(jitter(b.occupancy, 0.05, 5, 100));
    const efficiency = jitter(b.efficiency, 0.01, 40, 99);
    const status = efficiency >= 85 ? 'Excellent' : efficiency >= 75 ? 'Good' : 'Needs Attention';

    await db('buildings')
      .where({ id: b.id })
      .update({
        current_consumption: currentConsumption,
        temperature,
        occupancy,
        efficiency,
        status,
        updated_at: db.fn.now(),
      });

    await db('building_analytics').insert({
      building_id: b.id,
      hourly_consumption: Math.round(currentConsumption * 1000 * 0.04),
      hvac_load: Math.round(30 + (100 - efficiency) * 0.4),
      lighting_load: Math.round(18 + Math.random() * 8),
      equipment_load: Math.round(25 + Math.random() * 10),
      solar_contribution: Math.round(10 + efficiency * 0.08),
      temperature,
      occupancy,
    });
  }
}

export async function runLiveUpdateTick() {
  await tickCampusMetrics();
  await tickBuildings();
}

// Schedules a recurring background job that subtly fluctuates live metrics,
// so the frontend dashboard reflects "real-time" campus activity.
export function startLiveUpdateJob(intervalSeconds: number) {
  const seconds = Math.max(5, intervalSeconds);
  const expression = seconds < 60 ? `*/${seconds} * * * * *` : `*/${Math.round(seconds / 60)} * * * *`;

  cron.schedule(expression, () => {
    runLiveUpdateTick().catch((err) => console.error('[live-update] tick failed:', err));
  });

  console.log(`[live-update] background job scheduled every ${seconds}s`);
}
