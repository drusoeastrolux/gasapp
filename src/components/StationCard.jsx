import React from 'react';
import { motion } from 'framer-motion';
import { Fuel, MapPin, Star, Navigation, Clock } from 'lucide-react';

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
    <motion.div
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 relative overflow-hidden group"
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {isCheapest && (
        <motion.div
          className="absolute top-6 right-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-xl flex items-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          <Star className="mr-1" size={12} />
          Best Price
        </motion.div>
      )}
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mr-4 shadow-xl">
              <Fuel className="text-white" size={24} />
            </div>
            <div>
              <button
                onClick={() => window.open(`https://www.google.com/maps?q=${station.location.latitude},${station.location.longitude}`, '_blank')}
                className="text-2xl font-bold text-white mb-2 hover:text-cyan-400 transition-colors duration-300 text-left cursor-pointer select-none focus:outline-none"
                style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
              >
                {station.displayName.text}
              </button>
              <div className="flex items-center text-gray-400 text-sm select-none" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
                <MapPin size={16} className="mr-2" />
                {distance} km away
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-6">
          <p className="text-gray-300 text-sm mb-6 leading-relaxed select-none" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>{station.formattedAddress}</p>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex items-center mb-3 select-none" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
                <Clock className="text-cyan-400 mr-2" size={16} />
                <span className="text-xs text-gray-500 uppercase tracking-wide">Price</span>
              </div>
              <div
                className={`font-mono text-4xl font-bold ${isCheapest ? 'text-cyan-400' : 'text-white'} relative select-none`}
                style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
              >
                ${station.price}
              </div>
              <p className="text-xs text-gray-500 mt-1 select-none" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>per gallon</p>
            </div>
            
            <div className="text-right">
              <div className="flex items-center justify-end mb-3 select-none" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
                <Navigation className="text-blue-400 mr-2" size={16} />
                <span className="text-xs text-gray-500 uppercase tracking-wide">Status</span>
              </div>
              <div className="inline-flex items-center px-3 py-2 bg-white/10 backdrop-blur-md rounded-full text-xs text-gray-300 border border-white/20 select-none" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Available Now
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StationCard;
