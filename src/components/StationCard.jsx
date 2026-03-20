import React from 'react';

const StationCard = ({ station, userLocation, isCheapest }) => {
  // Calculate distance (simple approximation)
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 3959; // Radius of the earth in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in miles
    return d.toFixed(1); // Round to 1 decimal
  };

  const distance = calculateDistance(
    userLocation.lat,
    userLocation.lng,
    station.location.latitude,
    station.location.longitude
  );

  return (
    <div className="relative bg-black border border-gray-800 p-0 hover:bg-yellow-400 transition-all duration-0 group visible w-full min-h-[200px]" style={{ overflow: 'visible' }}>
      {/* Newspaper-style horizontal rule at top */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-yellow-400 z-20"></div>

      {/* BEST PRICE tag breaks outside boundary */}
      {isCheapest && (
        <div className="absolute -top-4 -right-2 bg-yellow-400 text-black px-6 py-3 text-lg font-black uppercase tracking-widest z-30 border border-gray-800 shadow-lg" style={{ transform: 'rotate(-8deg)', transformOrigin: 'center' }}>
          BEST
        </div>
      )}

      <div className="relative z-10 h-full flex flex-col lg:flex-row">
        {/* Left zone: labels and context */}
        <div className="flex-1 flex flex-col justify-between p-4 lg:p-5 lg:pr-3">
          <div className="space-y-3">
            {/* Station name */}
            <button
              onClick={() => window.open(`https://www.google.com/maps?q=${station.location.latitude},${station.location.longitude}`, '_blank')}
              className="text-sm font-black text-yellow-400 hover:text-yellow-300 transition-colors duration-150 text-left uppercase tracking-wider leading-tight group-hover:text-black"
            >
              {station.displayName.text}
            </button>

            {/* Distance */}
            <div>
              <div className="text-xs font-black text-gray-600 uppercase tracking-widest mb-1 group-hover:text-gray-900">DISTANCE</div>
              <div className="text-base font-black text-gray-300 uppercase tracking-wide group-hover:text-black">{distance} MI</div>
            </div>
          </div>

          {/* Status - bottom left */}
          <div className="text-xs font-black text-gray-600 uppercase tracking-widest group-hover:text-gray-900">
            ● AVAILABLE
          </div>
        </div>

        {/* Hard vertical divider */}
        <div className="w-0.5 bg-yellow-400/60"></div>

        {/* Right zone: massive value */}
        <div className="flex-1 flex flex-col justify-center items-center p-4 lg:p-5 lg:pl-3">
          <div className="text-center">
            {/* Price in massive serif font */}
            <div className="text-7xl font-black tabular-nums leading-none text-yellow-400 mb-3 group-hover:text-black" style={{ fontFamily: 'Impact, sans-serif', textShadow: '3px 3px 0px rgba(0,0,0,0.4)' }}>
              ${station.price}
            </div>

            {/* Per gallon label */}
            <div className="text-xs font-black text-gray-600 uppercase tracking-widest mb-4 group-hover:text-gray-900">
              PER GALLON
            </div>

            {/* Map button */}
            <button
              onClick={() => window.open(`https://www.google.com/maps?q=${station.location.latitude},${station.location.longitude}`, '_blank')}
              className="text-xs font-black text-yellow-400 uppercase tracking-widest border border-yellow-400/60 px-4 py-2 hover:bg-yellow-400 hover:text-black transition-all duration-150 group-hover:border-gray-800 group-hover:text-black"
            >
              NAVIGATE →
            </button>
          </div>
        </div>
      </div>

      {/* Address bleeds to bottom edge - desktop only */}
      <div className="absolute bottom-2 left-4 lg:left-5 right-4 lg:right-5 text-xs font-bold text-gray-500 uppercase tracking-wide leading-tight group-hover:text-gray-900 hidden lg:block">
        {station.formattedAddress}
      </div>
    </div>
  );
};

export default StationCard;
