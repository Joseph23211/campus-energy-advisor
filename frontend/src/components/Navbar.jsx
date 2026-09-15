import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ChevronDown, Menu, X, Moon, Sun, Zap } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { campusInfo } from '../data/mockEnergyData';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Overview' },
  { to: '/energy', label: 'Energy' },
  { to: '/buildings', label: 'Buildings' },
  { to: '/recommendations', label: 'Recommendations' },
  { to: '/sustainability', label: 'Sustainability' },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [campusOpen, setCampusOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 dark:border-white/5 bg-white/70 dark:bg-void-950/70 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-current-teal to-current-cyan shadow-glow">
              <Zap className="h-4 w-4 text-void-950" strokeWidth={2.5} />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
              ENERGIX <span className="text-current-teal">CAMPUS</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-white/10 text-white dark:text-white'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <button
                onClick={() => setCampusOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-white/20 transition-colors"
              >
                {campusInfo.name.split(' ')[0]} Campus
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              <AnimatePresence>
                {campusOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 rounded-xl glass p-1.5 shadow-card"
                  >
                    {['Christ University Campus', 'Kengeri Campus', 'Bannerghatta Campus'].map((c) => (
                      <button
                        key={c}
                        onClick={() => setCampusOpen(false)}
                        className="block w-full rounded-lg px-3 py-2 text-left text-xs text-slate-300 hover:bg-white/5"
                      >
                        {c}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              aria-label="Toggle theme"
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-300 hover:border-white/20 transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              aria-label="Notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-300 hover:border-white/20 transition-colors"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-current-coral" />
            </button>

            <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-current-violet to-current-cyan text-xs font-semibold text-white">
              CU
            </div>

            <button
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-300 lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-void-950/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex items-center justify-between px-4 h-16 border-b border-white/5">
              <span className="font-display text-lg font-semibold text-white">Menu</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
            <nav className="flex flex-col gap-1 p-4">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-3 text-base font-medium ${
                      isActive ? 'bg-white/10 text-white' : 'text-slate-400'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
