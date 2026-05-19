import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { rateLimit } from 'express-rate-limit'
import { Redis } from '@upstash/redis'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

const app = express()
app.use(express.json())
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:4173'] }))

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

const searchLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: 'Too many requests. Slow down.' },
})

// ~1km grid cell cache key
function cacheKey(lat, lng) {
  return `stations:${(Math.round(lat * 100) / 100)}:${(Math.round(lng * 100) / 100)}`
}

// Deterministic price from place_id so the same station always shows the same price
function seedPrice(placeId) {
  let hash = 0
  for (let i = 0; i < placeId.length; i++) {
    hash = (hash * 31 + placeId.charCodeAt(i)) & 0xffffffff
  }
  const t = (hash >>> 0) / 0xffffffff
  return (3.20 + t * 1.60).toFixed(2)
}

app.post('/api/stations', searchLimiter, async (req, res) => {
  const { lat, lng, radius = 5000 } = req.body

  if (lat == null || lng == null) {
    return res.status(400).json({ error: 'lat and lng are required' })
  }

  const key = cacheKey(lat, lng)

  try {
    const cached = await redis.get(key)
    if (cached) {
      return res.json({ stations: cached, cached: true })
    }
  } catch (err) {
    console.warn('Redis read failed, falling through to Google:', err.message)
  }

  const url = `https://places.googleapis.com/v1/places:searchNearby?key=${process.env.GOOGLE_MAPS_API_KEY}`
  const body = {
    includedTypes: ['gas_station'],
    locationRestriction: {
      circle: {
        center: { latitude: lat, longitude: lng },
        radius,
      },
    },
    maxResultCount: 10,
  }

  let googleData
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.location,places.id',
      },
      body: JSON.stringify(body),
    })
    googleData = await response.json()
  } catch (err) {
    return res.status(502).json({ error: 'Failed to reach Google Places API' })
  }

  if (googleData.error) {
    return res.status(500).json({ error: googleData.error.message })
  }

  const places = googleData.places || []

  const stations = places.map((p) => ({
    place_id: p.id,
    displayName: p.displayName,
    formattedAddress: p.formattedAddress,
    location: p.location,
    price: seedPrice(p.id || p.formattedAddress),
  }))

  try {
    await redis.set(key, stations, { ex: 1200 }) // 20 min TTL
  } catch (err) {
    console.warn('Redis write failed:', err.message)
  }

  const rows = stations.map((s) => ({
    station_id: s.place_id,
    station_name: s.displayName?.text,
    station_address: s.formattedAddress,
    station_lat: s.location?.latitude,
    station_lng: s.location?.longitude,
  }))

  supabase
    .from('gas_stations')
    .upsert(rows, { onConflict: 'station_id' })
    .then(({ error }) => { if (error) console.warn('Supabase upsert failed:', error.message) })

  res.json({ stations, cached: false })
})

app.get('/health', (_req, res) => res.json({ ok: true }))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`GasFinder backend running on http://localhost:${PORT}`))
