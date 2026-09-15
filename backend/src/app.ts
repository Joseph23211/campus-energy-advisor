import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import apiRouter from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const HAS_FRONTEND_BUILD = fs.existsSync(path.join(PUBLIC_DIR, 'index.html'));

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:3000')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1', apiRouter);
// Any unmatched /api/v1/* path is a genuine 404 (kept scoped so it never
// shadows the SPA fallback below).
app.use('/api/v1', notFoundHandler);

if (HAS_FRONTEND_BUILD) {
  app.use(express.static(PUBLIC_DIR));
  // SPA fallback: let React Router handle client-side routes like /dashboard.
  app.get('*', (req, res) => {
    res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Energix Campus API (frontend build not found — run `npm run build` in frontend/)',
      docs: '/api/v1/system/health',
    });
  });
}

app.use(errorHandler);

export default app;
