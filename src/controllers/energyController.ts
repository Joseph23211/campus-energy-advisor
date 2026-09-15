import { Request, Response } from 'express';
import db from '../db/knex';
import { ApiError } from '../middleware/errorHandler';

const VALID_PERIODS = ['today', 'week', 'month', 'year'] as const;
type Period = (typeof VALID_PERIODS)[number];

export async function getEnergyTrends(req: Request, res: Response) {
  const period = (req.query.period as string) || 'today';

  if (!VALID_PERIODS.includes(period as Period)) {
    throw new ApiError(400, `Invalid period. Must be one of: ${VALID_PERIODS.join(', ')}`);
  }

  const logs = await db('energy_logs').where({ period_type: period }).orderBy('timestamp', 'asc');

  res.status(200).json({
    success: true,
    period,
    data: logs.map((l) => ({
      label: l.label,
      value: l.value,
      cost: l.cost,
      peakDemand: l.peak_demand,
      timestamp: l.timestamp,
    })),
  });
}
