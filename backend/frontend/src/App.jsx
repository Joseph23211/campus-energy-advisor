import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './hooks/useTheme';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AmbientBackground from './components/AmbientBackground';
import LoadingScreen from './components/LoadingScreen';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import EnergyAnalytics from './pages/EnergyAnalytics';
import Buildings from './pages/Buildings';
import BuildingDetails from './pages/BuildingDetails';
import Recommendations from './pages/Recommendations';
import Sustainability from './pages/Sustainability';

function PageTransition({ children }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="min-h-[60vh]"
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <ThemeProvider>
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}
      <AmbientBackground />
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <PageTransition>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/energy" element={<EnergyAnalytics />} />
            <Route path="/buildings" element={<Buildings />} />
            <Route path="/buildings/:id" element={<BuildingDetails />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/sustainability" element={<Sustainability />} />
          </Routes>
        </PageTransition>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
