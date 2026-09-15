import { Router } from 'express';
import { getBuildingById, getBuildings } from '../controllers/buildingsController';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

router.get('/', asyncHandler(getBuildings));
router.get('/:id', asyncHandler(getBuildingById));

export default router;
