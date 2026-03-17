// Location utility using Browser Geolocation API

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000, // 1 minute
      }
    );
  });
};

// Geocode location text to coordinates
export const geocodeLocation = async (locationText) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    throw new Error('Google Maps API key not found');
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(locationText)}&key=${apiKey}`
    );

    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      const result = data.results[0];
      const location = result.geometry.location;

      return {
        lat: location.lat,
        lng: location.lng,
      };
    }

    throw new Error('Location not found. Please try a different address or city name.');
  } catch (error) {
    console.error('Geocoding failed:', error);
    throw error;
  }
};

// Reverse geocode coordinates to get city name
export const getCityFromCoordinates = async (lat, lng) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.warn('Google Maps API key not found, using coordinates');
    return `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`;
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      // Find the city/locality in the address components
      const result = data.results[0];
      const addressComponents = result.address_components;

      // Look for locality (city), administrative_area_level_1 (state), or country
      const cityComponent = addressComponents.find(component =>
        component.types.includes('locality') ||
        component.types.includes('administrative_area_level_1') ||
        component.types.includes('country')
      );

      if (cityComponent) {
        return cityComponent.long_name;
      }

      // Fallback to formatted address if no specific city found
      return result.formatted_address.split(',')[0];
    }

    // Fallback to coordinates if geocoding fails
    console.warn('Geocoding failed with status:', data.status);
    return `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`;
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
    return `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`;
  }
};
