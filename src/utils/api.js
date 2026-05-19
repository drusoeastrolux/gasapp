export const fetchGasStations = async (lat, lng, radius = 5000) => {
  const response = await fetch('/api/stations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lat, lng, radius }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch stations')
  }

  return data.stations
}
