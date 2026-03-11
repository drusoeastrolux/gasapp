// API utility for fetching gas stations using Google Places API (New)

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export const fetchGasStations = async (lat, lng, radius = 5000) => {
  console.log('API Key present:', !!API_KEY);
  if (!API_KEY) {
    throw new Error('Google Maps API key not set. Please add VITE_GOOGLE_MAPS_API_KEY to .env');
  }
  const url = `/api/v1/places:searchNearby?key=${API_KEY}`;
  console.log('Fetching URL:', url);

  const body = {
    includedTypes: ["gas_station"],
    locationRestriction: {
      circle: {
        center: {
          latitude: lat,
          longitude: lng
        },
        radius: radius
      }
    },
    maxResultCount: 10
  };
  console.log('Request body:', body);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.location',
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    console.log('API Response:', data);
    if (data.error) {
      throw new Error(`Places API error: ${data.error.message}`);
    }
    return data.places || [];
  } catch (error) {
    console.error('Error fetching gas stations:', error);
    throw error;
  }
};
