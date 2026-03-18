import React from 'react';
import { motion } from 'framer-motion';
import { Fuel, MapPin, Star, Navigation, Clock } from 'lucide-react';

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
    <div className="relative bg-black border border-dashed border-gray-600 p-0 group hover:shadow-[4px_4px_0px_0px_rgba(250,204,21,0.8)] hover:translate-x-1 hover:translate-y-1 transition-all duration-100 overflow-hidden">
      {/* Background pattern - diagonal lines at 5% opacity */}
      <div className="absolute inset-0 opacity-[0.05] bg-[repeating-linear-gradient(45deg,transparent,transparent_1px,yellow_1px,yellow_2px)] pointer-events-none"></div>
      
      {/* BEST PRICE tag breaks outside boundary */}
      {isCheapest && (
        <div className="absolute -top-1 -left-1 bg-yellow-400 text-black px-2 py-0.5 font-mono text-[10px] font-black tracking-widest z-20 border border-gray-800" style={{ fontFamily: 'JetBrains Mono, monospace', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>
          BEST PRICE
        </div>
      )}
      
      <div className="relative z-10 p-4">
        {/* Top section - tight spacing */}
        <div className="mb-1">
          <button
            onClick={() => window.open(`https://www.google.com/maps?q=${station.location.latitude},${station.location.longitude}`, '_blank')}
            className="text-sm font-black text-yellow-400 hover:text-yellow-300 transition-colors duration-100 text-left font-mono uppercase tracking-wider leading-none"
            style={{ fontFamily: 'JetBrains Mono, monospace', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}
          >
            {station.displayName.text}
          </button>
        </div>
        
        {/* Middle section - wide spacing */}
        <div className="my-6">
          <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2" style={{ fontFamily: 'JetBrains Mono, monospace', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>DISTANCE</div>
          <div className="text-xs font-mono text-gray-400 font-bold" style={{ fontFamily: 'JetBrains Mono, monospace', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>{distance} MILES</div>
        </div>
        
        {/* Address section */}
        <div className="mb-6 border-t border-dotted border-gray-700 pt-3">
          <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mb-1" style={{ fontFamily: 'JetBrains Mono, monospace', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>LOCATION</div>
          <p className="text-xs font-mono text-gray-500 leading-tight" style={{ fontFamily: 'JetBrains Mono, monospace', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>{station.formattedAddress}</p>
        </div>
        
        {/* Bottom section - status and map */}
        <div className="flex items-center justify-between border-t border-dotted border-gray-700 pt-3">
          <div className="flex items-center" style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>
            <span className="text-[10px] font-mono text-green-400 uppercase tracking-wider" style={{ fontFamily: 'JetBrains Mono, monospace', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>● AVAILABLE</span>
          </div>
          
          <button
            onClick={() => window.open(`https://www.google.com/maps?q=${station.location.latitude},${station.location.longitude}`, '_blank')}
            className="text-[10px] font-mono text-yellow-400 hover:text-yellow-300 transition-colors duration-100 border border-dotted border-yellow-400/30 px-2 py-1 hover:border-yellow-400"
            style={{ fontFamily: 'JetBrains Mono, monospace', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}
          >
            VIEW MAP
          </button>
        </div>
      </div>
      
      {/* Price breaks outside the card boundary - overflows */}
      <div className="absolute -bottom-2 -right-2 bg-black border border-dashed border-yellow-400 p-2 overflow-visible z-30">
        <div className="text-[64px] font-black tabular-nums leading-none text-yellow-400" style={{ fontFamily: 'JetBrains Mono, monospace', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>
          ${station.price}
        </div>
        <div className="text-[8px] font-mono text-yellow-400 uppercase tracking-widest mt-1" style={{ fontFamily: 'JetBrains Mono, monospace', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>PER GALLON</div>
      </div>
    </div>
  );
};

export default StationCard;
