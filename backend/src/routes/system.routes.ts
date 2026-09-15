import { Router } from 'express';
import { runLiveUpdateTick } from '../utils/liveUpdater';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

router.get('/health', (req, res) => {
  res.status(200).json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
});

// Manually trigger one live-data fluctuation tick (useful for demos/tests)
router.post(
  '/live-update',
  asyncHandler(async (req, res) => {
    await runLiveUpdateTick();
    res.status(200).json({ success: true, message: 'Live metrics updated' });
  })
);

export default router;
