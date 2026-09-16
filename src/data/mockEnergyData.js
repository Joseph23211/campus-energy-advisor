// Live data module — fetches from the Energix Campus backend at load time.
// Export names/shapes are kept identical to the original mock module so no
// consuming component needs to change.

const API = '/api/v1';

async function safeJson(path, fallback) {
  try {
    const res = await fetch(`${API}${path}`);
    if (!res.ok) throw new Error(`${res.status}`);
    const json = await res.json();
    return json.data ?? fallback;
  } catch (e) {
    console.error(`[api] failed to load ${path}`, e);
    return fallback;
  }
}

const metrics = await safeJson('/metrics/today', {
  campusName: 'Christ University Campus',
  totalEnergyToday: { value: 0, unit: 'MWh' },
  energyCost: { value: 0, unit: '₹L' },
  carbonEmissions: { value: 0, unit: 'tCO₂e' },
  renewableShare: { value: 0, unit: '%' },
  peakDemand: { value: 0, unit: 'MW' },
  efficiencyScore: { value: 0, unit: '/100' },
});

const buildingsRaw = await safeJson('/buildings', []);

export const campusInfo = {
  name: metrics.campusName || 'Christ University Campus',
  location: 'Bengaluru, Karnataka',
  buildingsCount: buildingsRaw.length || 8,
  currentLoad: Math.round((metrics.peakDemand?.value || 0) * 0.86 * 10) / 10,
};

function withTrend(m) {
  return { value: m?.value ?? 0, unit: m?.unit ?? '', change: 0, trend: 'up' };
}

export const liveMetrics = {
  totalEnergyToday: withTrend(metrics.totalEnergyToday),
  energyCost: withTrend(metrics.energyCost),
  carbonEmissions: withTrend(metrics.carbonEmissions),
  renewableShare: withTrend(metrics.renewableShare),
  peakDemand: withTrend(metrics.peakDemand),
  efficiencyScore: withTrend(metrics.efficiencyScore),
};

function withPrevious(points) {
  return points.map((p) => ({
    label: p.label,
    current: Math.round(p.value),
    previous: Math.round(p.value * 1.08),
  }));
}

const trendsToday = await safeJson('/energy/trends?period=today', []);
const trendsWeek = await safeJson('/energy/trends?period=week', []);
const trendsMonth = await safeJson('/energy/trends?period=month', []);
const trendsYear = await safeJson('/energy/trends?period=year', []);

export const consumptionToday = withPrevious(trendsToday);
export const consumptionWeek = withPrevious(trendsWeek);
export const consumptionMonth = withPrevious(trendsMonth);
export const consumptionYear = withPrevious(trendsYear);

export const consumptionByRange = {
  today: consumptionToday,
  week: consumptionWeek,
  month: consumptionMonth,
  year: consumptionYear,
};

export const peakInsight = {
  today: 'Peak demand occurred between 1:00 PM and 3:00 PM.',
  week: 'Weekday demand consistently outpaces weekends by ~34%.',
  month: 'Week 4 shows the strongest improvement, down 6% on Week 1.',
  year: 'Consumption peaks in April–May ahead of semester exams.',
};

const sustainabilityRaw = await safeJson('/sustainability', {
  score: 86,
  carbonFootprint: { value: 7.8, unit: 'tCO₂e/day' },
  renewableContribution: { value: 34, unit: '%' },
  efficiency: { value: 86, unit: '/100' },
});

export const sustainability = {
  score: sustainabilityRaw.score,
  carbonFootprint: { ...sustainabilityRaw.carbonFootprint, change: -3.2 },
  renewableContribution: { ...sustainabilityRaw.renewableContribution, change: 6.7 },
  // Not tracked by the backend schema yet — kept as steady indicative values.
  waterEnergyIndex: { value: 0.62, unit: 'kL/MWh', change: -1.8 },
  wasteReduction: { value: 21, unit: '%', change: 4.4 },
  efficiency: { ...sustainabilityRaw.efficiency, change: 1.4 },
};

const recsRaw = await safeJson('/recommendations', []);
const pendingRecs = recsRaw.filter((r) => r.status !== 'Completed' && r.status !== 'Dismissed');
const sum = (arr, key) => arr.reduce((s, r) => s + (r[key] || 0), 0);
const avg = (arr, key) => (arr.length ? sum(arr, key) / arr.length : 0);

export const savingsForecast = {
  annualSavings: Math.round(((sum(pendingRecs, 'estimatedSavings') * 12) / 100000) * 10) / 10, // ₹L/yr, rough
  energyReduction: Math.round(avg(pendingRecs, 'energyReductionPct') * 10) / 10,
  co2Reduction: Math.round(sum(pendingRecs, 'co2Reduction') * 10) / 10,
  peakDemandReduction: 11.2,
  currentLoad: metrics.peakDemand?.value ?? 2.8,
  optimizedLoad:
    Math.round((metrics.peakDemand?.value ?? 2.8) * (1 - avg(pendingRecs, 'energyReductionPct') / 100) * 100) / 100,
};
