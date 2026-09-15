import { Request, Response } from 'express';
import db from '../db/knex';

export async function getAlerts(req: Request, res: Response) {
  const { resolved, severity, buildingId } = req.query;

  let query = db('alerts as a')
    .leftJoin('buildings as b', 'a.building_id', 'b.id')
    .select('a.*', 'b.name as building_name', 'b.slug as building_slug');

  if (resolved !== undefined) query = query.where('a.resolved', resolved === 'true' ? 1 : 0);
  if (severity) query = query.where('a.severity', String(severity));
  if (buildingId) query = query.where('a.building_id', String(buildingId));

  const rows = await query.orderBy('a.timestamp', 'desc');

  const data = rows.map((a) => ({
    id: a.id,
    title: a.title,
    description: a.description,
    severity: a.severity,
    resolved: Boolean(a.resolved),
    timestamp: a.timestamp,
    buildingId: a.building_id,
    building: a.building_id ? { name: a.building_name, slug: a.building_slug } : null,
  }));

  res.status(200).json({ success: true, count: data.length, data });
}
