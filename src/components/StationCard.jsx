import React from 'react';
import { motion } from 'framer-motion';
import { Fuel, MapPin, Star } from 'lucide-react';

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
      className="bg-white border border-gray-200 rounded-2xl p-6 mb-4 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {isCheapest && (
        <motion.div
          className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          <Star className="mr-1" size={14} />
          Best Price
        </motion.div>
      )}
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mr-4 shadow-md">
              <Fuel className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{station.displayName.text}</h3>
              <div className="flex items-center text-gray-600 text-sm">
                <MapPin size={16} className="mr-1" />
                {distance} km away
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-4">
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">{station.formattedAddress}</p>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Price per gallon</p>
              <p
                className={`font-mono text-4xl font-bold ${isCheapest ? 'text-green-600' : 'text-gray-900'} relative`}
              >
                ${station.price}
                {isCheapest && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </p>
            </div>
            
            <div className="text-right">
              <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Available
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StationCard;
