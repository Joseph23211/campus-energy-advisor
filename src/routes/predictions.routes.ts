import { Router } from 'express';
import { getPredictedEnergy } from '../controllers/predictionsController';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

router.get('/energy', asyncHandler(getPredictedEnergy));

export default router;
