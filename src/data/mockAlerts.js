// Live alerts module — fetches from the Energix Campus backend.
// Keeps the export name/shape (mockAlerts) so components are untouched.

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

function relativeTime(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.round(hrs / 24)} day ago`;
}

// backend severities: critical | warning | info  →  UI types: warning | success | info
function toUiType(severity, resolved) {
  if (resolved) return 'success';
  if (severity === 'critical') return 'warning';
  return severity; // 'warning' | 'info'
}

const raw = await safeJson('/alerts', []);

export const mockAlerts = raw.map((a) => ({
  id: a.id,
  type: toUiType(a.severity, a.resolved),
  title: a.title,
  message: a.description,
  time: relativeTime(a.timestamp),
}));
