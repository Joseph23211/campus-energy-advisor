# Energix Campus

**Campus Energy Advising Tool** — a frontend-only, intelligent energy command center for university campuses.

> Built for a university project demo. All data is realistic **mock data**; there is no backend, database, or authentication.

## Features

- **Landing / hero experience** with an animated energy visualization and live headline stats
- **Dashboard** — animated metric cards (energy, cost, carbon, renewables, peak demand, efficiency), an interactive consumption chart, and a live campus energy map
- **Campus Energy Map** — an interactive, lightweight SVG-based visualization of 8 campus buildings with glowing status nodes, animated energy connections, and hover/tap detail cards (deliberately built in SVG/CSS rather than a heavy 3D engine, to stay fast on every device)
- **Building Performance** — ranked list with efficiency bars and status badges
- **Energy Advisor** — AI-style recommendation cards with savings, energy/CO₂ impact, and expandable explanations
- **Smart Alerts** — warning / success / info alert feed
- **Sustainability page** — animated circular sustainability score, carbon/renewable/water/waste breakdown, and a savings forecast (current → optimized)
- **Energy Analytics page** — range filters, building comparison bar chart, and energy-intensity pie chart
- **Building details page** — hourly consumption chart, load breakdown, and building-specific recommendations
- **Recommendations page** — grouped by High / Medium / Low priority and Completed, with an "Implement" action backed by local state
- Dark futuristic theme by default, with a polished light mode toggle
- Fully responsive (desktop, tablet, mobile) with a mobile navigation drawer
- Reduced-motion support, keyboard-focus states, and semantic markup throughout

## Tech Stack

- **React 19** + **Vite**
- **Tailwind CSS** (custom design tokens — colors, glass, glow, grid, animations)
- **React Router** for client-side routing
- **Framer Motion** for scroll reveals, page transitions, and micro-interactions
- **Recharts** for area / bar / pie charts
- **Lucide React** for icons

## Project Structure

```
src/
  components/     Reusable UI: Navbar, MetricCard, EnergyChart, CampusMap,
                   BuildingCard, RecommendationCard, AlertCard,
                   SustainabilityScore, EnergyAdvisor, LoadingScreen,
                   AnimatedCounter, SectionHeader, EnergyOrb, Footer,
                   AmbientBackground
  pages/          Landing, Dashboard, EnergyAnalytics, Buildings,
                   BuildingDetails, Recommendations, Sustainability
  data/           mockEnergyData, mockBuildings, mockRecommendations,
                   mockAlerts — the data abstraction layer (see below)
  hooks/          useTheme, useCountUp, useInView
  utils/          format.js (status colors, number formatting)
```

## Installation

```bash
npm install
```

## Running Locally

```bash
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

To produce a production build:

```bash
npm run build
npm run preview
```

## Available Routes

| Route                 | Page                          |
|------------------------|-------------------------------|
| `/`                    | Landing / hero                |
| `/dashboard`           | Main dashboard                |
| `/energy`              | Energy analytics              |
| `/buildings`           | Buildings list + campus map   |
| `/buildings/:id`       | Individual building detail    |
| `/recommendations`     | Recommendations, by priority  |
| `/sustainability`      | Sustainability & savings forecast |

## Future Backend Integration

Every file in `src/data/` is a thin mock service — each exported value or function is written so it can become an `async` call to a real endpoint without touching any component:

- `mockEnergyData.js` → `GET /api/energy/summary`, `/api/energy/consumption?range=`
- `mockBuildings.js` → `GET /api/buildings`, `GET /api/buildings/:id`
- `mockRecommendations.js` → `GET /api/recommendations`, `POST /api/recommendations/:id/implement`
- `mockAlerts.js` → `GET /api/alerts` (or a websocket/live feed)

No component imports data directly from a hardcoded object inline — everything flows through this layer, so swapping mock data for live API calls is a localized change.

## Limitations

- All figures (consumption, cost, emissions, occupancy, etc.) are **synthetic mock data** for demonstration only and do not reflect real campus readings.
- There is no persistence: "Implement" actions on the Recommendations page update local React state only and reset on refresh.
- The 3D-style campus visualization is a lightweight SVG/CSS implementation rather than a full WebGL/Three.js scene, chosen deliberately to keep the app fast on lower-powered and mobile devices.
