import { Router } from 'express';
import { getTodayMetrics } from '../controllers/metricsController';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

router.get('/today', asyncHandler(getTodayMetrics));

export default router;
