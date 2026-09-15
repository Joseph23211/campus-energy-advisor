import { Request, Response } from 'express';
import db from '../db/knex';
import { ApiError } from '../middleware/errorHandler';

function serializeBuilding(b: any) {
  return {
    id: b.id,
    slug: b.slug,
    name: b.name,
    type: b.type,
    currentConsumption: b.current_consumption,
    baselineConsumption: b.baseline_consumption,
    efficiency: b.efficiency,
    carbonOutput: b.carbon_output,
    temperature: b.temperature,
    occupancy: b.occupancy,
    status: b.status,
    map: { x: b.map_x, y: b.map_y },
    updatedAt: b.updated_at,
  };
}

export async function getBuildings(req: Request, res: Response) {
  const buildings = await db('buildings').orderBy('name', 'asc');

  res.status(200).json({
    success: true,
    count: buildings.length,
    data: buildings.map(serializeBuilding),
  });
}

export async function getBuildingById(req: Request, res: Response) {
  const { id } = req.params;

  const building = await db('buildings').where({ id }).orWhere({ slug: id }).first();

  if (!building) {
    throw new ApiError(404, `Building not found: ${id}`);
  }

  const [analytics, recommendations, alerts] = await Promise.all([
    db('building_analytics').where({ building_id: building.id }).orderBy('timestamp', 'asc'),
    db('recommendations').where({ building_id: building.id }).orderBy('created_at', 'desc'),
    db('alerts').where({ building_id: building.id }).orderBy('timestamp', 'desc'),
  ]);

  res.status(200).json({
    success: true,
    data: {
      ...serializeBuilding(building),
      history: analytics.map((a) => ({
        timestamp: a.timestamp,
        hourlyConsumption: a.hourly_consumption,
        hvacLoad: a.hvac_load,
        lightingLoad: a.lighting_load,
        equipmentLoad: a.equipment_load,
        solarContribution: a.solar_contribution,
        temperature: a.temperature,
        occupancy: a.occupancy,
      })),
      recommendations,
      alerts,
    },
  });
}
