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
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjA1IDAiLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjYSkiLz48L3N2Zz4=')] pointer-events-none"></div>

      <div className="relative z-10 min-h-screen w-full">
        {/* Header - Left aligned, full width */}
        <motion.div
          className="border-b border-yellow-400 bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="px-6 py-4" style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>
            <div className="flex items-center justify-between" style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>
              <div className="flex items-center space-x-6" style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>
                <h1 className="text-5xl font-black text-white tracking-[0.02em]" style={{ fontFamily: 'Bebas Neue, sans-serif', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>GAS FINDER</h1>
                <div className="h-8 w-px bg-yellow-400" style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}></div>
                <p className="text-gray-400 text-sm font-mono" style={{ fontFamily: 'JetBrains Mono, monospace', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>REAL-TIME FUEL INTELLIGENCE</p>
              </div>
              
              {/* View Toggle - Minimalist */}
              <div className="flex space-x-1" style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 text-sm font-mono border transition-colors duration-200 ${
                    viewMode === 'list'
                      ? 'bg-yellow-400 text-black border-yellow-400'
                      : 'bg-transparent text-gray-400 border-gray-700 hover:text-white hover:border-gray-500'
                  }`}
                  style={{ fontFamily: 'JetBrains Mono, monospace', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}
                >
                  LIST
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-4 py-2 text-sm font-mono border transition-colors duration-200 ${
                    viewMode === 'map'
                      ? 'bg-yellow-400 text-black border-yellow-400'
                      : 'bg-transparent text-gray-400 border-gray-700 hover:text-white hover:border-gray-500'
                  }`}
                  style={{ fontFamily: 'JetBrains Mono, monospace', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}
                >
                  MAP
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content Area - Asymmetric Layout */}
        <div className="flex">
          {/* Left Sidebar - Stats & Controls */}
          <div className="w-80 border-r border-gray-800 p-6 space-y-6" style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>
            {/* Location Card */}
            <div className="border border-gray-800 p-4" style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>
              <div className="flex items-center justify-between mb-3" style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>
                <span className="text-xs font-mono text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'JetBrains Mono, monospace', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>Location</span>
                <div className="w-2 h-2 bg-green-400" style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}></div>
              </div>
              <div className="text-2xl font-black text-white mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>
                {currentCity || '---'}
              </div>
              <p className="text-xs font-mono text-gray-400 mb-4" style={{ fontFamily: 'JetBrains Mono, monospace', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>
                {currentCity ? 'CURRENT CITY' : 'NO SIGNAL'}
              </p>
              
              {/* Location Input */}
              <div className="space-y-2" style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>
                <input
                  type="text"
                  value={manualLocation}
                  onChange={(e) => setManualLocation(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleManualLocationSearch()}
                  placeholder="ENTER CITY..."
                  className="w-full px-3 py-2 bg-black border border-gray-700 text-white placeholder-gray-600 text-sm font-mono focus:outline-none focus:border-yellow-400 transition-colors duration-200"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                />
                <button
                  onClick={handleManualLocationSearch}
                  disabled={!manualLocation.trim() || loading}
                  className="w-full px-3 py-2 bg-yellow-400 text-black text-sm font-mono font-bold hover:bg-yellow-300 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
                  style={{ fontFamily: 'JetBrains Mono, monospace', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}
                >
                  {loading ? 'SCANNING...' : 'SEARCH'}
                </button>
                {userLocation && (
                  <button
                    onClick={loadStations}
                    className="w-full px-3 py-2 border border-gray-700 text-gray-400 text-xs font-mono hover:text-white hover:border-gray-500 transition-colors duration-200"
                    style={{ fontFamily: 'JetBrains Mono, monospace', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}
                  >
                    USE MY LOCATION
                  </button>
                )}
              </div>
            </div>
            
            {/* Stats Card */}
            <div className="border border-gray-800 p-4" style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>
              <div className="flex items-center justify-between mb-3" style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>
                <span className="text-xs font-mono text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'JetBrains Mono, monospace', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>Live Data</span>
                <div className="w-2 h-2 bg-yellow-400 animate-pulse" style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}></div>
              </div>
              <div className="text-4xl font-black text-white mb-1" style={{ fontFamily: 'Bebas Neue, sans-serif', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>
                {stations.length}
              </div>
              <p className="text-xs font-mono text-gray-400" style={{ fontFamily: 'JetBrains Mono, monospace', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>STATIONS FOUND</p>
            </div>
            
            {/* System Status */}
            <div className="border border-gray-800 p-4" style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>
              <div className="flex items-center justify-between mb-3" style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>
                <span className="text-xs font-mono text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'JetBrains Mono, monospace', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>Status</span>
                <div className={`w-2 h-2 ${loading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}></div>
              </div>
              <div className="text-2xl font-black text-white mb-1" style={{ fontFamily: 'Bebas Neue, sans-serif', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>
                {loading ? 'SCANNING' : 'READY'}
              </div>
              <p className="text-xs font-mono text-gray-400" style={{ fontFamily: 'JetBrains Mono, monospace', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>SYSTEM STATUS</p>
            </div>
            
            {/* Refresh Button */}
            <button
              onClick={loadStations}
              className="w-full py-3 bg-yellow-400 text-black font-mono font-bold hover:bg-yellow-300 transition-colors duration-200 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed"
              disabled={loading}
              style={{ fontFamily: 'JetBrains Mono, monospace', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}
            >
              {loading ? 'SCANNING STATIONS...' : 'REFRESH PRICES'}
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-h-screen">
            {/* Error State */}
            {error && (
              <div className="border-b border-red-900 bg-red-950/20 px-6 py-3" style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>
                <p className="text-red-400 text-sm font-mono" style={{ fontFamily: 'JetBrains Mono, monospace', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>ERROR: {error}</p>
              </div>
            )}
            
            {/* Content */}
            {viewMode === 'list' ? (
              <div className="p-6" style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>
                {loading ? (
                  <div className="space-y-4" style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <div key={i} className="border border-gray-800 p-6" style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>
                        <div className="animate-pulse space-y-3" style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>
                          <div className="h-4 bg-gray-800" style={{ width: '60%', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}></div>
                          <div className="h-3 bg-gray-800" style={{ width: '40%', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}></div>
                          <div className="h-3 bg-gray-800" style={{ width: '80%', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4" style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>
                    {stations.map((station, index) => (
                      <StationCard key={station.place_id || index} station={station} userLocation={userLocation} isCheapest={index === 0} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-screen" style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>
                {userLocation ? (
                  <Map stations={stations} userLocation={userLocation} />
                ) : (
                  <div className="flex items-center justify-center h-full" style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>
                    <div className="text-center" style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>
                      <div className="text-gray-500 mb-4" style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>WAITING FOR LOCATION SIGNAL...</div>
                      <p className="text-gray-600 text-sm font-mono" style={{ fontFamily: 'JetBrains Mono, monospace', userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>ENABLE LOCATION SERVICES</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
