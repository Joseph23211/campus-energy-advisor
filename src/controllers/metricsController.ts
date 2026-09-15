import { Request, Response } from 'express';
import db from '../db/knex';
import { ApiError } from '../middleware/errorHandler';

export async function getTodayMetrics(req: Request, res: Response) {
  const metric = await db('campus_metrics').orderBy('updated_at', 'desc').first();

  if (!metric) {
    throw new ApiError(404, 'No campus metrics found. Run `npm run seed` first.');
  }

  res.status(200).json({
    success: true,
    data: {
      campusName: metric.campus_name,
      totalEnergyToday: { value: metric.total_energy_today, unit: 'MWh' },
      energyCost: { value: metric.energy_cost, unit: '₹L' },
      carbonEmissions: { value: metric.carbon_emissions, unit: 'tCO₂e' },
      renewableShare: { value: metric.renewable_percentage, unit: '%' },
      peakDemand: { value: metric.peak_demand, unit: 'MW' },
      efficiencyScore: { value: metric.efficiency_score, unit: '/100' },
      updatedAt: metric.updated_at,
    },
  });
}
