// Live buildings module — fetches from the Energix Campus backend.
// Keeps the same export names/shape (mockBuildings, getBuildingById) so
// consuming components are untouched.

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

function statusFromEfficiency(eff) {
  if (eff >= 85) return 'Excellent';
  if (eff >= 75) return 'Good';
  return 'Needs Attention';
}
function levelFromEfficiency(eff) {
  if (eff >= 85) return 'low';
  if (eff >= 75) return 'moderate';
  return 'high';
}

const list = await safeJson('/buildings', []);

// Fetch per-building detail (24h analytics) in parallel to build hourly/loadSplit/history
const details = await Promise.all(
  list.map((b) => safeJson(`/buildings/${b.slug}`, null))
);

export const mockBuildings = list.map((b, i) => {
  const detail = details[i];
  const hist = detail?.history ?? [];

  const hourly = hist.length
    ? hist.map((h) => Math.round(h.hourlyConsumption))
    : Array.from({ length: 24 }, () => Math.round(b.currentConsumption * 40));

  const loadSplit = hist.length
    ? {
        hvac: Math.round(hist.reduce((s, h) => s + h.hvacLoad, 0) / hist.length),
        lighting: Math.round(hist.reduce((s, h) => s + h.lightingLoad, 0) / hist.length),
        equipment: Math.round(hist.reduce((s, h) => s + h.equipmentLoad, 0) / hist.length),
        solar: Math.round(hist.reduce((s, h) => s + h.solarContribution, 0) / hist.length),
      }
    : { hvac: 40, lighting: 20, equipment: 30, solar: 15 };

  // Backend doesn't track a 14-day building trend yet — synthesize a stable,
  // deterministic-looking series from the current consumption baseline.
  const history = Array.from({ length: 14 }, (_, d) => ({
    label: `D${d + 1}`,
    value: Math.round(b.currentConsumption * 1000 * (0.85 + Math.sin(d * 1.1 + b.currentConsumption) * 0.15)),
  }));

  return {
    id: b.slug,
    dbId: b.id,
    name: b.name,
    type: b.type,
    consumption: b.currentConsumption,
    efficiency: b.efficiency,
    carbon: b.carbonOutput,
    temperature: b.temperature,
    occupancy: b.occupancy,
    x: b.map?.x ?? 50,
    y: b.map?.y ?? 50,
    status: b.status || statusFromEfficiency(b.efficiency),
    level: levelFromEfficiency(b.efficiency),
    hourly,
    loadSplit,
    history,
  };
});

export function getBuildingById(id) {
  return mockBuildings.find((b) => b.id === id);
}
