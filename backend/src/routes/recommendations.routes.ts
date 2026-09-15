import { Router } from 'express';
import { getRecommendations, updateRecommendation } from '../controllers/recommendationsController';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

router.get('/', asyncHandler(getRecommendations));
router.patch('/:id', asyncHandler(updateRecommendation));

export default router;
