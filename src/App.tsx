import { useState, useEffect } from 'react'
import StationCard from './components/StationCard'
import SkeletonCard from './components/SkeletonCard'
import Map from './components/Map'
import { getCurrentLocation } from './utils/location'
import { fetchGasStations } from './utils/api'
import { assignMockPrices } from './utils/mockPrices'
import { RefreshCw, MapPin, Sparkles, List, MapIcon } from 'lucide-react'
import { motion } from 'framer-motion'

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
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300 } }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="relative z-10 min-h-screen p-4">
        <div className={viewMode === 'map' ? 'max-w-6xl mx-auto' : 'max-w-2xl mx-auto'}>
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg mr-4">
                <MapPin className="text-white" size={24} />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Gas Finder
              </h1>
            </div>
            <p className="text-gray-600 text-lg mb-6">Find the cheapest fuel near you</p>

            {/* View Toggle Buttons */}
            <div className="inline-flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center ${
                  viewMode === 'list'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="mr-2" size={16} />
                List
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center ${
                  viewMode === 'map'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <MapIcon className="mr-2" size={16} />
                Map
              </button>
            </div>
          </motion.div>

          {error && (
            <motion.p
              className="text-red-600 text-center mb-6 p-4 bg-red-50 rounded-xl border border-red-200 shadow-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {error}
            </motion.p>
          )}

          {/* Refresh Button */}
          <motion.button
            onClick={loadStations}
            className="w-full mb-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center relative overflow-hidden group"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-center">
              <RefreshCw className={`mr-3 transition-transform ${loading ? 'animate-spin' : ''}`} size={20} />
              <span className="text-lg">{loading ? 'Finding Stations...' : 'Refresh Prices'}</span>
            </div>
          </motion.button>

          {/* Content Area */}
          {viewMode === 'list' ? (
            <>
              {/* Stations List */}
              {loading ? (
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                >
                  {Array.from({ length: 5 }, (_, i) => (
                    <motion.div key={i} variants={item}>
                      <SkeletonCard />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                >
                  {stations.map((station, index) => (
                    <motion.div key={station.place_id || index} variants={item}>
                      <StationCard station={station} userLocation={userLocation} isCheapest={index === 0} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              {userLocation ? (
                <Map stations={stations} userLocation={userLocation} />
              ) : (
                <div className="w-full h-[500px] bg-gradient-to-br from-gray-50 to-white rounded-xl flex items-center justify-center border border-gray-200 shadow-sm">
                  <div className="text-gray-600 text-center">
                    <MapIcon className="mx-auto mb-4 text-gray-400" size={48} />
                    <p className="mb-2 text-lg font-medium">Waiting for location...</p>
                    <p className="text-sm text-gray-500">Enable location services to see map</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
