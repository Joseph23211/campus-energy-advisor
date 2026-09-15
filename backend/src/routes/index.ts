import { Router } from 'express';
import metricsRoutes from './metrics.routes';
import energyRoutes from './energy.routes';
import buildingsRoutes from './buildings.routes';
import recommendationsRoutes from './recommendations.routes';
import alertsRoutes from './alerts.routes';
import sustainabilityRoutes from './sustainability.routes';
import systemRoutes from './system.routes';

const router = Router();

router.use('/system', systemRoutes);
router.use('/metrics', metricsRoutes);
router.use('/energy', energyRoutes);
router.use('/buildings', buildingsRoutes);
router.use('/recommendations', recommendationsRoutes);
router.use('/alerts', alertsRoutes);
router.use('/sustainability', sustainabilityRoutes);

export default router;
