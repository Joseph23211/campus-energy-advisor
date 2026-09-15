import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Thermometer, Users, Zap, Leaf } from 'lucide-react';
import { mockBuildings } from '../data/mockBuildings';
import { statusColor } from '../utils/format';

const CONNECTIONS = [
  ['engineering-block', 'library'],
  ['library', 'research-center'],
  ['engineering-block', 'administration'],
  ['administration', 'hostel-a'],
  ['hostel-a', 'hostel-b'],
  ['administration', 'student-center'],
  ['student-center', 'sports-complex'],
  ['research-center', 'sports-complex'],
];

function posOf(id) {
  const b = mockBuildings.find((x) => x.id === id);
  return b ? { x: b.x, y: b.y } : { x: 0, y: 0 };
}

export default function CampusMap() {
  const [active, setActive] = useState(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  const activeBuilding = useMemo(() => mockBuildings.find((b) => b.id === active), [active]);

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -6, y: px * 8 });
  }

  return (
    <div className="relative rounded-2xl glass p-4 sm:p-6 shadow-card overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display text-lg font-medium text-white">Campus Energy Map</h3>
          <p className="text-xs text-slate-400">Live building performance, updated every 5 minutes</p>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-current-teal" /> Efficient</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-current-amber" /> Moderate</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-current-coral" /> High usage</span>
        </div>
      </div>

      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        className="relative aspect-[16/10] w-full rounded-xl bg-void-900/60 [perspective:1200px]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      >
        {/* drifting ambient particles */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
          {Array.from({ length: 14 }).map((_, i) => (
            <span
              key={i}
              className="absolute h-1 w-1 rounded-full bg-current-teal/40 animate-floaty"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 53) % 100}%`,
                animationDelay: `${i * 0.4}s`,
                animationDuration: `${5 + (i % 4)}s`,
              }}
            />
          ))}
        </div>

        <motion.svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateX: tilt.x, rotateY: tilt.y }}
          transition={{ type: 'spring', stiffness: 60, damping: 12 }}
        >
          {CONNECTIONS.map(([a, b], i) => {
            const p1 = posOf(a);
            const p2 = posOf(b);
            return (
              <line
                key={i}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke="url(#lineGrad)"
                strokeWidth="0.35"
                strokeDasharray="1.4 1.2"
                opacity="0.6"
              >
                <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="3s" repeatCount="indefinite" />
              </line>
            );
          })}
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3ee6a8" />
              <stop offset="100%" stopColor="#4fd1ff" />
            </linearGradient>
          </defs>

          {mockBuildings.map((b) => {
            const colors = statusColor(b.level);
            const isActive = active === b.id;
            return (
              <g
                key={b.id}
                transform={`translate(${b.x} ${b.y})`}
                onMouseEnter={() => setActive(b.id)}
                onMouseLeave={() => setActive((cur) => (cur === b.id ? null : cur))}
                onClick={() => navigate(`/buildings/${b.id}`)}
                className="cursor-pointer"
              >
                <circle r={isActive ? 3.6 : 2.6} className={colors.text} fill="currentColor" opacity="0.18">
                  <animate attributeName="r" values={`${isActive ? 3.2 : 2.2};${isActive ? 4.2 : 3};${isActive ? 3.2 : 2.2}`} dur="2.4s" repeatCount="indefinite" />
                </circle>
                <circle r="1.15" className={colors.text} fill="currentColor" />
              </g>
            );
          })}
        </motion.svg>

        <AnimatePresence>
          {activeBuilding && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.18 }}
              style={{
                left: `${activeBuilding.x}%`,
                top: `${activeBuilding.y}%`,
              }}
              className="pointer-events-none absolute z-10 w-56 -translate-x-1/2 -translate-y-[calc(100%+14px)] rounded-xl glass p-3.5 shadow-card"
            >
              <div className="flex items-center justify-between">
                <p className="font-display text-sm font-medium text-white">{activeBuilding.name}</p>
                <span className={`h-2 w-2 rounded-full ${statusColor(activeBuilding.level).bg}`} />
              </div>
              <div className="mt-2 grid grid-cols-2 gap-y-1.5 text-[11px] text-slate-300">
                <span className="flex items-center gap-1"><Zap className="h-3 w-3 text-current-teal" /> {activeBuilding.consumption} MWh</span>
                <span className="flex items-center gap-1"><Leaf className="h-3 w-3 text-current-teal" /> {activeBuilding.carbon} tCO₂e</span>
                <span className="flex items-center gap-1"><Thermometer className="h-3 w-3 text-current-cyan" /> {activeBuilding.temperature}°C</span>
                <span className="flex items-center gap-1"><Users className="h-3 w-3 text-current-cyan" /> {activeBuilding.occupancy}% occ.</span>
              </div>
              <p className="mt-2 text-[11px] text-slate-400">{activeBuilding.efficiency}% efficiency · {activeBuilding.status}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <p className="mt-3 text-center text-[11px] text-slate-500 sm:hidden">Tap a node to view building details</p>
    </div>
  );
}
