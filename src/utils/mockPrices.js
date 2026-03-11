// Mock data service for fuel prices

const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c; // Distance in km
  return d;
};

export const assignMockPrices = (stations, userLocation) => {
  return stations.map(station => ({
    ...station,
    price: (Math.random() * 1 + 3.5).toFixed(2),
    distance: calculateDistance(
      userLocation.lat,
      userLocation.lng,
      station.location.latitude,
      station.location.longitude
    ),
  }));
};
