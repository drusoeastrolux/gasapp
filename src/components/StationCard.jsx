import React from 'react';

const StationCard = ({ station, userLocation, isCheapest }) => {
  // Calculate distance (simple approximation)
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in km
    return d.toFixed(1); // Round to 1 decimal
  };

  const distance = calculateDistance(
    userLocation.lat,
    userLocation.lng,
    station.location.latitude,
    station.location.longitude
  );

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 mb-4">
      {isCheapest && (
        <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
          Cheapest
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2">
        {station.displayName.text}
      </h3>
      <p className="text-gray-700 text-sm mb-1">{station.formattedAddress}</p>
      <p className="text-gray-500 text-xs mb-2">{distance} km away</p>
      <p className="font-mono text-2xl font-bold text-green-600">
        ${station.price}
      </p>
    </div>
  );
};

export default StationCard;
