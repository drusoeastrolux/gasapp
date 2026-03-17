import React, { useRef, useEffect, useLayoutEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
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
  userLocation: Location;
}

const Map: React.FC<MapProps> = ({ stations, userLocation }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('Map component rendering with:', {
    stationsCount: stations.length,
    hasUserLocation: !!userLocation,
    userLocationCoords: userLocation ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` : null
  });

  // Initialize map when DOM is ready and we have userLocation
  useLayoutEffect(() => {
    if (!userLocation) return;

    console.log('useLayoutEffect triggered, userLocation available');

    // Small delay to ensure DOM is fully committed
    const timer = setTimeout(() => {
      if (!mapRef.current) {
        console.error('Map container div not found after timeout');
        setError('Map container not available');
        setLoading(false);
        return;
      }

      console.log('DOM ready, mapRef.current exists, initializing map...');

      const initializeMap = async () => {
        try {
          setLoading(true);
          setError(null);

          const apiKey = (import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY;
          if (!apiKey) {
            throw new Error('Google Maps API key is missing');
          }

          const loader = new Loader({
            apiKey: apiKey,
            version: 'weekly',
            libraries: ['places'],
          });

          const { Map: GoogleMap } = await loader.importLibrary('maps');

          const mapOptions: google.maps.MapOptions = {
            center: { lat: userLocation.lat, lng: userLocation.lng },
            zoom: 12,
            styles: [
              {
                featureType: 'all',
                elementType: 'geometry',
                stylers: [{ color: '#242f3e' }]
              },
              {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{ color: '#3a4555' }]
              },
              {
                featureType: 'road',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#5a6b7d' }]
              },
              {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [{ color: '#4a5869' }]
              },
              {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#6b7d92' }]
              },
              {
                featureType: 'all',
                elementType: 'labels.text.stroke',
                stylers: [{ color: '#242f3e' }]
              },
              {
                featureType: 'all',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#c8d0d9' }]
              },
              {
                featureType: 'poi',
                elementType: 'geometry',
                stylers: [{ color: '#2d3748' }]
              },
              {
                featureType: 'poi.business',
                stylers: [{ visibility: 'on' }]
              },
              {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#17263c' }]
              },
              {
                featureType: 'landscape',
                elementType: 'geometry',
                stylers: [{ color: '#1a202c' }]
              }
            ],
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: true,
          };

          console.log('Creating map instance...');
          const newMap = new GoogleMap(mapRef.current!, mapOptions);
          setMap(newMap);

          // Add user location marker
          new google.maps.Marker({
            position: { lat: userLocation.lat, lng: userLocation.lng },
            map: newMap,
            title: 'Your Location',
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#4285F4',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            },
          });

          setLoading(false);
          console.log('Map initialization complete');
        } catch (err) {
          console.error('Error loading Google Maps:', err);
          setError(err instanceof Error ? err.message : 'Failed to load map');
          setLoading(false);
        }
      };

      initializeMap();
    }, 200); // Wait 200ms for DOM to be fully ready

    return () => clearTimeout(timer);
  }, [userLocation]);

  // Update markers when stations change
  useLayoutEffect(() => {
    if (!map || !stations.length) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);

    // Create bounds to fit all markers
    const bounds = new google.maps.LatLngBounds();
    bounds.extend({ lat: userLocation.lat, lng: userLocation.lng });

    // Add markers for each station
    const newMarkers = stations.map(station => {
      const marker = new google.maps.Marker({
        position: { lat: station.location.latitude, lng: station.location.longitude },
        map: map,
        title: station.displayName.text,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="#06b6d4" stroke="#ffffff" stroke-width="3"/>
              <text x="16" y="20" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="bold">⛽</text>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 32)
        }
      });

      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="color: #000; max-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold;">${station.displayName.text}</h3>
            <p style="margin: 0 0 4px 0;">${station.formattedAddress}</p>
            <p style="margin: 0; font-weight: bold; color: #06b6d4;">$${station.price}/gal</p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      bounds.extend(marker.getPosition()!);
      return marker;
    });

    setMarkers(newMarkers);

    // Fit map to show all markers
    map.fitBounds(bounds);

    // Don't zoom in too much
    const listener = google.maps.event.addListener(map, 'idle', () => {
      if (map.getZoom() && map.getZoom()! > 15) {
        map.setZoom(15);
      }
      google.maps.event.removeListener(listener);
    });
  }, [map, stations, userLocation]);

  return (
    <div className="w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative">
      <div ref={mapRef} className="w-full h-full"></div>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/5 backdrop-blur-xl">
          <div className="text-gray-300 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p>Loading interactive map...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/5 backdrop-blur-xl">
          <div className="text-gray-300 text-center">
            <MapIcon className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="mb-2">Map unavailable</p>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
