import { Request, Response } from 'express';
import db from '../db/knex';
import { ApiError } from '../middleware/errorHandler';

export async function getSustainability(req: Request, res: Response) {
  const metric = await db('campus_metrics').orderBy('updated_at', 'desc').first();
  if (!metric) {
    throw new ApiError(404, 'No campus metrics found. Run `npm run seed` first.');
  }

  const buildings = await db('buildings');
  const avgEfficiency =
    buildings.reduce((sum, b) => sum + b.efficiency, 0) / (buildings.length || 1);

  res.status(200).json({
    success: true,
    data: {
      score: Math.round(metric.efficiency_score),
      carbonFootprint: { value: metric.carbon_emissions, unit: 'tCO₂e/day' },
      renewableContribution: { value: metric.renewable_percentage, unit: '%' },
      efficiency: { value: Math.round(avgEfficiency * 10) / 10, unit: '/100' },
      buildingCount: buildings.length,
      updatedAt: metric.updated_at,
    },
  });
}
