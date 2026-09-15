# Energix Campus — Unified App (Frontend + Backend)

A single Express server serves both the JSON API **and** the built React
dashboard on one port. The `frontend/` folder is the original Vite/React app,
now wired to fetch live data from this backend instead of static mock files.
SQLite (via [Knex](https://knexjs.org) + `better-sqlite3`) provides zero-config
local persistence.

## Run the whole thing (fastest path)

A pre-built frontend is already included in `public/`, so you can skip the
frontend build entirely for a quick run:

```bash
npm install
npm run seed     # creates tables + seeds Christ University Campus data
npm run dev        # serves API + dashboard together on http://localhost:5000
```

Open **http://localhost:5000** — that's the full dashboard, backed by real
data from the SQLite database, all from one running process.

## Rebuilding the frontend (after editing frontend/src)

```bash
cd frontend
npm install
npm run build      # outputs directly into ../public (see frontend/vite.config.js)
cd ..
npm run dev
```

For live frontend iteration with hot-reload, run `npm run dev` in `frontend/`
separately (Vite on :5173) — its dev server proxies `/api` to :5000
(`frontend/vite.config.js`), so run the backend (`npm run dev` here) alongside it.

## Backend-only reference (original API docs below)

## Stack

- Node.js + Express (TypeScript)
- SQLite via Knex query builder (`better-sqlite3` driver)
- `node-cron` background job for live metric fluctuation
- CORS configured for the Vite dev server

## Quick start

```bash
npm install
cp .env.example .env      # defaults already work for local dev
npm run seed               # creates tables + seeds Christ University Campus data
npm run dev                 # starts on http://localhost:5000
```

`npm run dev` also runs migrations automatically on boot, so `npm run seed` is the
only manual step needed before first run (it seeds 9 buildings, energy logs,
recommendations, and alerts).

Other scripts:

```bash
npm run migrate   # create tables only, no seed data
npm run build      # compile TypeScript to dist/
npm start           # run compiled build (after npm run build)
```

## Configuration (`.env`)

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | API port |
| `DB_FILENAME` | `./data/energix.sqlite3` | SQLite file path |
| `CORS_ORIGIN` | `http://localhost:5173,http://localhost:3000` | Comma-separated allowed origins |
| `LIVE_UPDATE_INTERVAL_SECONDS` | `15` | How often the background job nudges live metrics |

## API Reference

Base URL: `http://localhost:5000/api/v1`

All responses are JSON with a `success` boolean. Errors return `{ success: false, error: string }`
with an appropriate status code (400/404/500).

| Method | Route | Description |
|---|---|---|
| GET | `/system/health` | Health check |
| POST | `/system/live-update` | Manually trigger one live-metrics fluctuation tick |
| GET | `/metrics/today` | Campus key metrics snapshot |
| GET | `/energy/trends?period=today\|week\|month\|year` | Energy chart data for a period |
| GET | `/buildings` | List all buildings |
| GET | `/buildings/:id` | Building detail (accepts DB id or slug, e.g. `/buildings/library`) — includes 24h analytics history, building-scoped recommendations & alerts |
| GET | `/recommendations?priority=&status=&buildingId=` | AI advisory items, filterable |
| PATCH | `/recommendations/:id` | Body: `{ "status": "Implemented" \| "Dismissed" \| "Pending" \| "Completed" }` |
| GET | `/alerts?resolved=&severity=&buildingId=` | System alerts, filterable |
| GET | `/sustainability` | Aggregated carbon/sustainability metrics |

A background cron job (interval set by `LIVE_UPDATE_INTERVAL_SECONDS`) subtly randomizes
campus metrics and building load/temperature/occupancy so the dashboard feels "live."

## How the integration works

`frontend/src/data/mockEnergyData.js`, `mockBuildings.js`, `mockRecommendations.js`,
and `mockAlerts.js` were rewritten to fetch from `/api/v1/...` (relative — no CORS
needed since it's same-origin) using top-level `await` at module load, **keeping the
exact same export names and shapes** the original mock files had. This means all 11
components/pages that import from these files needed **zero changes**.

A few fields the backend doesn't model yet (`waterEnergyIndex`, `wasteReduction`,
building-level 14-day trend, alert relative-time strings) are either kept as steady
indicative values or derived/computed client-side — see comments in each data file.

Reference snippet for building your own API calls directly (optional, not required
since the data files above already do this):

```js
// frontend/src/data/apiClient.js
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

async function request(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  const json = await res.json();
  return json.data;
}

export const getTodayMetrics = () => request('/metrics/today');
export const getEnergyTrends = (period = 'today') => request(`/energy/trends?period=${period}`);
export const getBuildings = () => request('/buildings');
export const getBuildingById = (id) => request(`/buildings/${id}`);
export const getRecommendations = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return request(`/recommendations${qs ? `?${qs}` : ''}`);
};
export const updateRecommendation = async (id, status) => {
  const res = await fetch(`${API_BASE}/recommendations/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return (await res.json()).data;
};
export const getAlerts = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return request(`/alerts${qs ? `?${qs}` : ''}`);
};
export const getSustainability = () => request('/sustainability');
```

Then add `VITE_API_BASE_URL=http://localhost:5000/api/v1` to the frontend's `.env`,
and swap `import { liveMetrics } from '../data/mockEnergyData'` style imports for
`import { getTodayMetrics } from '../data/apiClient'` + a `useEffect`/`useState` (or
your data-fetching library of choice) in each page/component.

## Project structure

```
energix-campus/                  (this folder — the backend root)
├── frontend/                    # React/Vite app, wired to live API (see above)
│   └── src/data/                #   mock*.js files now fetch real data
├── public/                      # Pre-built frontend output, served by Express
├── src/
│   ├── app.ts                 # Express app, CORS, middleware wiring
│   ├── index.ts                # Entry point: runs migrations, starts server + cron
│   ├── config/db.ts            # Re-exports the Knex instance
│   ├── db/
│   │   ├── knex.ts              # Knex connection config
│   │   ├── migrate.ts           # Creates tables if they don't exist
│   │   └── seed.ts              # Seeds Christ University Campus demo data
│   ├── controllers/            # Route handler logic per resource
│   ├── routes/                 # Express routers per resource
│   ├── middleware/errorHandler.ts
│   └── utils/
│       ├── liveUpdater.ts       # Cron job + manual trigger logic
│       └── id.ts                 # Lightweight id generator
├── data/                        # SQLite file lives here (gitignored)
├── .env.example
└── package.json
```

## Notes

- SQLite was chosen over Postgres for a true zero-setup `npm install && npm run seed && npm run dev`
  experience — no external DB server required.
- Knex was used instead of Prisma because Prisma's `postinstall` step downloads a native
  query-engine binary from `binaries.prisma.sh`, which fails in network-restricted/offline
  environments. Knex + `better-sqlite3` only needs the public npm registry.
- CORS is configured via `CORS_ORIGIN`; requests from origins not in that list receive a
  500 with a clear error message rather than being silently dropped.
