import { Router } from 'express';
import { getAlerts } from '../controllers/alertsController';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

router.get('/', asyncHandler(getAlerts));

export default router;
