import { Router } from 'express';
import { getEnergyTrends } from '../controllers/energyController';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

router.get('/trends', asyncHandler(getEnergyTrends));

export default router;
