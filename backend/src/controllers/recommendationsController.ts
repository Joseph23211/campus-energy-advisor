import { Request, Response } from 'express';
import db from '../db/knex';
import { ApiError } from '../middleware/errorHandler';

const VALID_STATUSES = ['Pending', 'Implemented', 'Dismissed', 'Completed'];

export async function getRecommendations(req: Request, res: Response) {
  const { priority, status, buildingId } = req.query;

  let query = db('recommendations as r')
    .leftJoin('buildings as b', 'r.building_id', 'b.id')
    .select(
      'r.*',
      'b.name as building_name',
      'b.slug as building_slug'
    );

  if (priority) query = query.where('r.priority', String(priority));
  if (status) query = query.where('r.status', String(status));
  if (buildingId) query = query.where('r.building_id', String(buildingId));

  const rows = await query.orderBy('r.priority', 'asc').orderBy('r.created_at', 'desc');

  const data = rows.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    buildingId: r.building_id,
    building: r.building_id ? { name: r.building_name, slug: r.building_slug } : null,
    impact: r.impact,
    priority: r.priority,
    difficulty: r.difficulty,
    estimatedSavings: r.estimated_savings,
    energyReductionPct: r.energy_reduction_pct,
    co2Reduction: r.co2_reduction,
    status: r.status,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }));

  res.status(200).json({ success: true, count: data.length, data });
}

export async function updateRecommendation(req: Request, res: Response) {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !VALID_STATUSES.includes(status)) {
    throw new ApiError(400, `status must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  const existing = await db('recommendations').where({ id }).first();
  if (!existing) {
    throw new ApiError(404, `Recommendation not found: ${id}`);
  }

  await db('recommendations').where({ id }).update({ status, updated_at: db.fn.now() });
  const updated = await db('recommendations').where({ id }).first();

  res.status(200).json({ success: true, data: updated });
}
