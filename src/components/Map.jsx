import { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

const Map = ({ stations, userLocation, selectedStation }) => {
  const mapRef = useRef(null)
  const [map, setMap] = useState(null)
  const [markers, setMarkers] = useState([])
  const [infoWindow, setInfoWindow] = useState(null)

  useEffect(() => {
    console.log('Loading Google Maps with API key:', API_KEY ? 'present' : 'missing')
    const loader = new Loader({
      apiKey: API_KEY,
      version: 'weekly',
    })
    loader.load().then(() => {
      console.log('Google Maps API loaded successfully')
      const googleMap = new google.maps.Map(mapRef.current, {
        center: userLocation,
        zoom: 13,
      })
      console.log('Map created')
      setMap(googleMap)
      const iw = new google.maps.InfoWindow()
      setInfoWindow(iw)
    }).catch((error) => {
      console.error('Error loading Google Maps:', error)
    })
  }, [userLocation])

  useEffect(() => {
    if (!map || !stations.length) return
    // Clear old markers
    markers.forEach(m => m.setMap(null))
    const newMarkers = stations.map((station, index) => {
      const isCheapest = index === 0
      const marker = new google.maps.Marker({
        position: station.geometry.location,
        map,
        label: {
          text: `$${station.price}`,
          color: 'white',
          fontWeight: 'bold',
        },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 20,
          fillColor: isCheapest ? '#22c55e' : '#f59e0b',
          fillOpacity: 1,
          strokeColor: 'white',
          strokeWeight: 2,
        },
      })
      marker.addListener('click', () => {
        map.panTo(station.geometry.location)
        infoWindow.setContent(`<div><h3>${station.name}</h3><p>${station.vicinity}</p><button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${station.geometry.location.lat},${station.geometry.location.lng}')">Get Directions</button></div>`)
        infoWindow.open(map, marker)
      })
      return marker
    })
    setMarkers(newMarkers)
  }, [map, stations])

  useEffect(() => {
    if (selectedStation && map) {
      map.panTo(selectedStation.geometry.location)
      // Optionally open info window
      const marker = markers.find(m => m.position.lat() === selectedStation.geometry.location.lat && m.position.lng() === selectedStation.geometry.location.lng)
      if (marker && infoWindow) {
        infoWindow.setContent(`<div><h3>${selectedStation.name}</h3><p>${selectedStation.vicinity}</p><button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${selectedStation.geometry.location.lat},${selectedStation.geometry.location.lng}')">Get Directions</button></div>`)
        infoWindow.open(map, marker)
      }
    }
  }, [selectedStation, map, markers, infoWindow])

  return <div ref={mapRef} className="w-full h-screen" />
}

export default Map
