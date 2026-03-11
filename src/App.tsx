import { useState, useEffect } from 'react'
import StationCard from './components/StationCard'
import SkeletonCard from './components/SkeletonCard'
import { getCurrentLocation } from './utils/location'
import { fetchGasStations } from './utils/api'
import { assignMockPrices } from './utils/mockPrices'
import { RefreshCw, MapPin } from 'lucide-react'

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

function App() {
  const [stations, setStations] = useState<Station[]>([])
  const [userLocation, setUserLocation] = useState<Location | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadStations = async () => {
    try {
      setLoading(true)
      setError(null)
      const location = await getCurrentLocation()
      setUserLocation(location)
      const rawStations = await fetchGasStations(location.lat, location.lng)
      const stationsWithPrices = assignMockPrices(rawStations, location)
      const sortedStations = stationsWithPrices.sort((a: Station, b: Station) => parseFloat(a.price) - parseFloat(b.price))
      setStations(sortedStations)
    } catch (err: unknown) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStations()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 text-black p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-center mb-4">
          <MapPin className="mr-2 text-blue-500" size={24} />
          <h1 className="text-2xl font-bold">
            Gas Station Finder
          </h1>
        </div>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <button
          onClick={loadStations}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded mb-4 flex items-center justify-center hover:bg-blue-600"
          disabled={loading}
        >
          <RefreshCw className="mr-2" size={20} />
          Refresh
        </button>
        {loading ? (
          <div>
            {Array.from({ length: 5 }, (_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div>
            {stations.map((station, index) => (
              <StationCard key={station.place_id || index} station={station} userLocation={userLocation} isCheapest={index === 0} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
