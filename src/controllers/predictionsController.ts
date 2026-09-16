import { Request, Response } from 'express';
import { ApiError } from '../middleware/errorHandler';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

export async function getPredictedEnergy(req: Request, res: Response) {
  const temperature = Number(req.query.temperature ?? 28);
  const occupancy = Number(req.query.occupancy ?? 0.6);
  const hourOfDay = Number(req.query.hourOfDay ?? new Date().getHours());

  let response: Response;
  try {
    response = await fetch(`${ML_SERVICE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ temperature, occupancy, hour_of_day: hourOfDay }),
    });
  } catch (err) {
    throw new ApiError(502, 'Could not reach the ML prediction service. Is it running on port 8000?');
  }

  if (!response.ok) {
    throw new ApiError(502, 'ML prediction service returned an error.');
  }

  const result = await response.json();

  res.status(200).json({
    success: true,
    data: {
      predictedEnergyKwh: result.predicted_energy_kwh,
      inputs: { temperature, occupancy, hourOfDay },
    },
  });
}
