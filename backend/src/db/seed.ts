import 'dotenv/config';
import db from './knex';
import migrate from './migrate';
import { generateId } from '../utils/id';

function statusFromEfficiency(eff: number): string {
  if (eff >= 85) return 'Excellent';
  if (eff >= 75) return 'Good';
  return 'Needs Attention';
}

const rawBuildings = [
  { slug: 'engineering-block', name: 'Engineering Block', type: 'Academic', consumption: 2.8, efficiency: 92, carbon: 1.1, temperature: 23.4, occupancy: 78, x: 28, y: 32 },
  { slug: 'library', name: 'Library', type: 'Academic', consumption: 2.1, efficiency: 84, carbon: 0.8, temperature: 22.8, occupancy: 64, x: 52, y: 22 },
  { slug: 'student-center', name: 'Student Center', type: 'Recreation', consumption: 3.4, efficiency: 68, carbon: 1.6, temperature: 24.9, occupancy: 91, x: 66, y: 44 },
  { slug: 'administration', name: 'Administration', type: 'Admin', consumption: 1.4, efficiency: 90, carbon: 0.5, temperature: 22.1, occupancy: 45, x: 40, y: 58 },
  { slug: 'hostel-a', name: 'Hostel A', type: 'Residential', consumption: 2.7, efficiency: 77, carbon: 1.2, temperature: 23.9, occupancy: 96, x: 16, y: 66 },
  { slug: 'hostel-b', name: 'Hostel B', type: 'Residential', consumption: 2.4, efficiency: 81, carbon: 1.0, temperature: 23.6, occupancy: 93, x: 22, y: 82 },
  { slug: 'research-center', name: 'Research Center', type: 'Academic', consumption: 3.1, efficiency: 88, carbon: 1.3, temperature: 22.5, occupancy: 58, x: 78, y: 26 },
  { slug: 'sports-complex', name: 'Sports Complex', type: 'Recreation', consumption: 1.8, efficiency: 73, carbon: 0.9, temperature: 25.3, occupancy: 39, x: 82, y: 68 },
  { slug: 'cafeteria', name: 'Cafeteria', type: 'Recreation', consumption: 1.6, efficiency: 79, carbon: 0.7, temperature: 24.2, occupancy: 55, x: 58, y: 74 },
];

async function seedCampusMetrics() {
  await db('campus_metrics').del();
  await db('campus_metrics').insert({
    campus_name: 'Christ University Campus',
    total_energy_today: 18.7,
    energy_cost: 1.42,
    carbon_emissions: 7.8,
    renewable_percentage: 34,
    peak_demand: 2.8,
    efficiency_score: 86,
  });
}

async function seedBuildings() {
  await db('building_analytics').del();
  await db('recommendations').del();
  await db('alerts').del();
  await db('buildings').del();

  const buildings: { id: string; slug: string }[] = [];

  for (const b of rawBuildings) {
    const id = generateId('bld');
    await db('buildings').insert({
      id,
      slug: b.slug,
      name: b.name,
      type: b.type,
      current_consumption: b.consumption,
      baseline_consumption: Math.round(b.consumption * 1.12 * 100) / 100,
      efficiency: b.efficiency,
      carbon_output: b.carbon,
      temperature: b.temperature,
      occupancy: b.occupancy,
      status: statusFromEfficiency(b.efficiency),
      map_x: b.x,
      map_y: b.y,
    });
    buildings.push({ id, slug: b.slug });

    const analyticsRows = Array.from({ length: 24 }, (_, h) => {
      const base = b.consumption * 1000 * (0.02 + 0.05 * Math.sin(((h - 6) / 24) * Math.PI * 2) ** 2);
      const timestamp = new Date();
      timestamp.setHours(h, 0, 0, 0);
      return {
        building_id: id,
        timestamp: timestamp.toISOString(),
        hourly_consumption: Math.max(10, Math.round(base)),
        hvac_load: Math.round(30 + (100 - b.efficiency) * 0.4),
        lighting_load: Math.round(18 + Math.sin(b.consumption) * 4),
        equipment_load: Math.round(28 + Math.cos(b.consumption) * 5),
        solar_contribution: Math.round(10 + b.efficiency * 0.08),
        temperature: b.temperature,
        occupancy: b.occupancy,
      };
    });
    await db('building_analytics').insert(analyticsRows);
  }

  return buildings;
}

async function seedEnergyLogs() {
  await db('energy_logs').del();

  const entries: any[] = [];

  for (let h = 0; h < 24; h++) {
    const base = 40 + 55 * Math.sin(((h - 6) / 24) * Math.PI * 2) ** 2;
    const peak = h >= 13 && h <= 15 ? 35 : 0;
    const noise = Math.sin(h * 3.1) * 6;
    const value = Math.max(18, Math.round(base + peak + noise));
    const ts = new Date();
    ts.setHours(h, 0, 0, 0);
    entries.push({
      timestamp: ts.toISOString(),
      value,
      cost: Math.round(value * 7.6 * 100) / 100,
      peak_demand: Math.round(value * 0.045 * 100) / 100,
      period_type: 'today',
      label: `${h.toString().padStart(2, '0')}:00`,
    });
  }

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  days.forEach((d, i) => {
    const value = Math.round(420 + Math.sin(i * 1.3) * 60 + (i >= 5 ? -80 : 0));
    entries.push({
      timestamp: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString(),
      value,
      cost: Math.round(value * 7.6 * 100) / 100,
      peak_demand: Math.round(value * 0.012 * 100) / 100,
      period_type: 'week',
      label: d,
    });
  });

  ['Week 1', 'Week 2', 'Week 3', 'Week 4'].forEach((w, i) => {
    const value = Math.round(2600 + i * 140 - (i === 3 ? 90 : 0));
    entries.push({
      timestamp: new Date(Date.now() - (3 - i) * 7 * 24 * 60 * 60 * 1000).toISOString(),
      value,
      cost: Math.round(value * 7.6 * 100) / 100,
      peak_demand: Math.round(value * 0.0022 * 100) / 100,
      period_type: 'month',
      label: w,
    });
  });

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  months.forEach((m, i) => {
    const seasonal = 9000 + Math.sin((i / 12) * Math.PI * 2) * 1400;
    const value = Math.round(seasonal);
    entries.push({
      timestamp: new Date(new Date().getFullYear(), i, 1).toISOString(),
      value,
      cost: Math.round(value * 7.6 * 100) / 100,
      peak_demand: Math.round(value * 0.00065 * 100) / 100,
      period_type: 'year',
      label: m,
    });
  });

  await db('energy_logs').insert(entries);
}

async function seedRecommendations(buildings: { id: string; slug: string }[]) {
  const bySlug = (slug: string) => buildings.find((b) => b.slug === slug)?.id ?? null;

  const recs = [
    {
      title: 'Reduce HVAC load in Engineering Block',
      description: 'Shift to occupancy-based HVAC scheduling with a 2°C setback after 7 PM. Sensor data shows occupancy drops below 15% after 7 PM on weekdays, while HVAC output stays near 90%.',
      building_id: bySlug('engineering-block'),
      impact: 'High',
      priority: 'High',
      difficulty: 'Medium',
      estimated_savings: 18400,
      energy_reduction_pct: 12.6,
      co2_reduction: 1.2,
      status: 'Pending',
    },
    {
      title: 'Shift high-load equipment away from peak hours',
      description: 'Stagger non-time-sensitive lab equipment cycles to 10-11 AM and 4-5 PM to ease strain on campus transformers and reduce demand charges.',
      building_id: bySlug('research-center'),
      impact: 'High',
      priority: 'High',
      difficulty: 'Medium',
      estimated_savings: 14200,
      energy_reduction_pct: 9.8,
      co2_reduction: 0.9,
      status: 'Pending',
    },
    {
      title: 'Increase solar utilization during afternoon demand',
      description: 'Re-time flexible loads (laundry, water heating) to align with solar generation peaks. On-site solar self-consumption is currently 61%; similar campuses reach 80%+.',
      building_id: null,
      impact: 'Medium',
      priority: 'Medium',
      difficulty: 'Hard',
      estimated_savings: 9800,
      energy_reduction_pct: 6.4,
      co2_reduction: 1.5,
      status: 'Pending',
    },
    {
      title: 'Library lighting schedule can reduce consumption',
      description: 'Install daylight-linked dimming for west-facing reading rooms. Illuminance sensors show natural light already exceeds comfort thresholds for 4+ hours daily.',
      building_id: bySlug('library'),
      impact: 'Low',
      priority: 'Low',
      difficulty: 'Easy',
      estimated_savings: 3600,
      energy_reduction_pct: 2.1,
      co2_reduction: 0.2,
      status: 'Pending',
    },
    {
      title: 'Fix HVAC anomaly in Student Center',
      description: 'Dispatch facilities team to inspect and recalibrate the AHU-3 damper actuator. Consumption has been 21% above baseline for six consecutive days.',
      building_id: bySlug('student-center'),
      impact: 'High',
      priority: 'High',
      difficulty: 'Easy',
      estimated_savings: 21500,
      energy_reduction_pct: 15.2,
      co2_reduction: 1.6,
      status: 'Pending',
    },
    {
      title: 'Optimize Hostel A water heating cycle',
      description: 'Switched to demand-based heating with a pre-heat window before peak shower hours. Consumption in the affected block has already dropped 4.6%.',
      building_id: bySlug('hostel-a'),
      impact: 'Medium',
      priority: 'Medium',
      difficulty: 'Easy',
      estimated_savings: 6200,
      energy_reduction_pct: 4.8,
      co2_reduction: 0.4,
      status: 'Completed',
    },
  ];

  for (const r of recs) {
    await db('recommendations').insert({ id: generateId('rec'), ...r });
  }
}

async function seedAlerts(buildings: { id: string; slug: string }[]) {
  const bySlug = (slug: string) => buildings.find((b) => b.slug === slug)?.id ?? null;

  const alerts = [
    { building_id: bySlug('engineering-block'), title: 'High energy consumption', description: 'Engineering Block is consuming 21% more energy than usual.', severity: 'warning', resolved: false, minutesAgo: 12 },
    { building_id: null, title: 'Solar generation above target', description: 'Renewable generation is currently 14% above forecast.', severity: 'info', resolved: false, minutesAgo: 38 },
    { building_id: bySlug('student-center'), title: 'HVAC anomaly detected', description: 'Student Center HVAC consumption is unusually high.', severity: 'warning', resolved: false, minutesAgo: 60 },
    { building_id: bySlug('hostel-b'), title: 'Scheduled maintenance', description: 'Hostel B sub-meter recalibration scheduled for tonight, 11 PM.', severity: 'info', resolved: false, minutesAgo: 120 },
    { building_id: bySlug('administration'), title: 'Efficiency milestone reached', description: 'Administration block sustained 90%+ efficiency for 7 consecutive days.', severity: 'info', resolved: true, minutesAgo: 240 },
  ];

  for (const a of alerts) {
    await db('alerts').insert({
      id: generateId('alt'),
      building_id: a.building_id,
      title: a.title,
      description: a.description,
      severity: a.severity,
      resolved: a.resolved,
      timestamp: new Date(Date.now() - a.minutesAgo * 60 * 1000).toISOString(),
    });
  }
}

async function main() {
  console.log('Running migrations...');
  await migrate();

  console.log('Seeding Energix Campus database...');
  await seedCampusMetrics();
  const buildings = await seedBuildings();
  await seedEnergyLogs();
  await seedRecommendations(buildings);
  await seedAlerts(buildings);
  console.log(`Seeded 1 campus, ${buildings.length} buildings, energy logs, recommendations, and alerts.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.destroy();
  });
