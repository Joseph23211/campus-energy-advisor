const API = '/api/v1';

export async function getPredictedEnergy(temperature, occupancy, hourOfDay) {
  const params = new URLSearchParams({
    temperature: String(temperature),
    occupancy: String(occupancy),
    hourOfDay: String(hourOfDay),
  });
  const res = await fetch(`${API}/predictions/energy?${params}`);
  if (!res.ok) throw new Error('Failed to fetch prediction');
  const json = await res.json();
  return json.data;
}
