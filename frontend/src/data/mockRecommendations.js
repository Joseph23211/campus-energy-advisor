// Live recommendations module — fetches from the Energix Campus backend.
// Keeps the export name/shape (mockRecommendations) so components are untouched.

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

const raw = await safeJson('/recommendations', []);

export const mockRecommendations = raw.map((r) => ({
  id: r.id,
  title: r.title,
  building: r.building?.name || 'Campus-wide',
  priority: r.priority,
  difficulty: r.difficulty,
  status: r.status,
  // The backend stores a single combined narrative; reused across the three
  // descriptive fields the UI expects.
  problem: r.description,
  action: r.description,
  explanation: r.description,
  savings: r.estimatedSavings,
  energyReduction: r.energyReductionPct,
  co2Reduction: r.co2Reduction,
}));

export async function patchRecommendationStatus(id, status) {
  const res = await fetch(`${API}/recommendations/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error(`Failed to update recommendation ${id}`);
  return (await res.json()).data;
}
