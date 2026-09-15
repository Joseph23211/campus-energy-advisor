import 'dotenv/config';
import app from './app';
import migrate from './db/migrate';
import { startLiveUpdateJob } from './utils/liveUpdater';

const PORT = Number(process.env.PORT) || 5000;
const LIVE_UPDATE_INTERVAL_SECONDS = Number(process.env.LIVE_UPDATE_INTERVAL_SECONDS) || 15;

async function start() {
  await migrate(); // ensures tables exist even if `npm run seed` wasn't run first

  app.listen(PORT, () => {
    console.log(`🚀 Energix Campus API running on http://localhost:${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/api/v1/system/health`);
    startLiveUpdateJob(LIVE_UPDATE_INTERVAL_SECONDS);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
