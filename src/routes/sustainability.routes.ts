import { Router } from 'express';
import { getSustainability } from '../controllers/sustainabilityController';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

router.get('/', asyncHandler(getSustainability));

export default router;
