import React, { useEffect, useState } from 'react';
import { MapIcon } from 'lucide-react';

interface Station {
  place_id?: string;
  displayName: { text: string };
  formattedAddress: string;
  location: { latitude: number; longitude: number };
  price: string;
}

interface Location {
  lat: number;
  lng: number;
}

interface MapProps {
  stations: Station[];
  userLocation: Location | null;
}

const Map: React.FC<MapProps> = ({ stations, userLocation }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userLocation) {
      setLoading(false);
      setError('Location not available');
      return;
    }

    // Simple timeout to simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [userLocation]);

  if (loading) {
    return (
      <div className="w-full h-[500px] bg-gray-50 rounded-xl flex items-center justify-center border border-gray-200">
        <div className="text-gray-600 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading map...</p>
        </div>
      </div>
    );
  }

  if (error || !userLocation) {
    return (
      <div className="w-full h-[500px] bg-gray-50 rounded-xl flex items-center justify-center border border-gray-200">
        <div className="text-gray-600 text-center">
          <MapIcon className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="mb-2">Map unavailable</p>
          <p className="text-sm text-gray-500">{error || 'Location services required'}</p>
        </div>
      </div>
    );
  }

  // Create Google Maps embed URL with center on user location
  const mapUrl = `https://www.google.com/maps/embed/v1/view?key=${(import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY}&center=${userLocation.lat},${userLocation.lng}&zoom=12&maptype=roadmap`;

  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-sm border border-gray-200">
      <iframe
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Gas Stations Map"
        className="w-full h-full"
      />
    </div>
  );
};

export default Map;
