import { useState, useEffect } from 'react'
import StationCard from './components/StationCard'
import SkeletonCard from './components/SkeletonCard'
import Map from './components/Map'
import { getCurrentLocation, getCityFromCoordinates, geocodeLocation } from './utils/location'
import { fetchGasStations } from './utils/api'
import { assignMockPrices } from './utils/mockPrices'
import { RefreshCw, MapPin, Sparkles, List, MapIcon, Fuel, TrendingUp, Navigation } from 'lucide-react'
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
  const [currentCity, setCurrentCity] = useState<string>('')
  const [manualLocation, setManualLocation] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')

  const loadStations = async () => {
    try {
      setLoading(true)
      setError(null)
      const location = await getCurrentLocation()
      setUserLocation(location)

      // Get city name from coordinates
      const city = await getCityFromCoordinates(location.lat, location.lng)
      console.log('Setting current city to:', city)
      setCurrentCity(city)

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

  const loadStationsForLocation = async (location: Location, cityName?: string) => {
    try {
      setLoading(true)
      setError(null)
      setUserLocation(location)

      // Set city name
      if (cityName) {
        setCurrentCity(cityName)
      } else {
        const city = await getCityFromCoordinates(location.lat, location.lng)
        setCurrentCity(city)
      }

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

  const handleManualLocationSearch = async () => {
    if (!manualLocation.trim()) return

    try {
      const location = await geocodeLocation(manualLocation.trim())
      await loadStationsForLocation(location, manualLocation.trim())
      setManualLocation('') // Clear input after successful search
    } catch (err: unknown) {
      setError((err as Error).message)
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Bento */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-xl mr-6">
                    <Fuel className="text-white" size={32} />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      Gas Finder
                    </h1>
                    <p className="text-gray-400 text-lg">Real-time fuel price intelligence</p>
                  </div>
                </div>
                
                {/* View Toggle */}
                <div className="flex bg-white/5 backdrop-blur-md rounded-2xl p-1 border border-white/10">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center ${
                      viewMode === 'list'
                        ? 'bg-white/20 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <List className="mr-2" size={18} />
                    List
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center ${
                      viewMode === 'map'
                        ? 'bg-white/20 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <MapIcon className="mr-2" size={18} />
                    Map
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Bento Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="text-cyan-400" size={24} />
                <span className="text-xs text-gray-400 uppercase tracking-wide">Live Data</span>
              </div>
              <p className="text-3xl font-bold text-white">{stations.length}</p>
              <p className="text-gray-400 text-sm">Stations Found</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <Navigation className="text-blue-400" size={24} />
                <span className="text-xs text-gray-400 uppercase tracking-wide">Location</span>
              </div>
              <p className="text-3xl font-bold text-white mb-2">
                {currentCity || (userLocation ? `${userLocation.lat.toFixed(2)}°, ${userLocation.lng.toFixed(2)}°` : '---')}
              </p>
              <p className="text-gray-400 text-sm mb-3">{currentCity ? 'Current City' : 'Current Position'}</p>

              {/* Manual Location Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualLocation}
                  onChange={(e) => setManualLocation(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleManualLocationSearch()}
                  placeholder="Enter city or address..."
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                />
                <button
                  onClick={handleManualLocationSearch}
                  disabled={!manualLocation.trim() || loading}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors duration-200"
                >
                  {loading ? '...' : 'Go'}
                </button>
              </div>

              {userLocation && (
                <button
                  onClick={loadStations}
                  className="mt-3 px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs rounded-lg border border-blue-500/30 transition-colors duration-200"
                >
                  Use My Location
                </button>
              )}
            </div>
            
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <Sparkles className="text-purple-400" size={24} />
                <span className="text-xs text-gray-400 uppercase tracking-wide">Status</span>
              </div>
              <p className="text-3xl font-bold text-white">{loading ? 'Scanning' : 'Ready'}</p>
              <p className="text-gray-400 text-sm">System Status</p>
            </div>
          </motion.div>

          {/* Action Button */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          >
            <motion.button
              onClick={loadStations}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 px-8 rounded-3xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center relative overflow-hidden group"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center">
                <RefreshCw className={`mr-3 transition-transform ${loading ? 'animate-spin' : ''}`} size={24} />
                <span className="text-xl">{loading ? 'Scanning Stations...' : 'Refresh Prices'}</span>
              </div>
            </motion.button>
          </motion.div>

          {/* Error State */}
          {error && (
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-3xl p-6 shadow-2xl">
                <p className="text-red-400 text-center">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Main Content Bento */}
          {viewMode === 'list' ? (
            <motion.div
              className="space-y-6"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {loading ? (
                Array.from({ length: 5 }, (_, i) => (
                  <motion.div key={i} variants={item}>
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                      <div className="animate-pulse">
                        <div className="h-4 bg-white/10 rounded mb-4"></div>
                        <div className="h-3 bg-white/5 rounded mb-2"></div>
                        <div className="h-3 bg-white/5 rounded w-3/4"></div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                stations.map((station, index) => (
                  <motion.div key={station.place_id || index} variants={item}>
                    <StationCard station={station} userLocation={userLocation} isCheapest={index === 0} />
                  </motion.div>
                ))
              )}
            </motion.div>
          ) : (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-2 shadow-2xl">
              {userLocation ? (
                <Map stations={stations} userLocation={userLocation} />
              ) : (
                <div className="p-12 text-center">
                  <MapIcon className="mx-auto mb-4 text-gray-400" size={64} />
                  <p className="text-xl text-gray-300 mb-2">Waiting for location...</p>
                  <p className="text-gray-500">Enable location services to see map</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
