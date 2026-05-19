import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'

export function useFavorites(user) {
  const [favorites, setFavorites] = useState(new Set())
  const [favoriteStations, setFavoriteStations] = useState([])

  const fetchFavorites = async () => {
    const { data } = await supabase
      .from('favorites')
      .select('station_id, gas_stations(*)')

    if (data) {
      setFavorites(new Set(data.map((f) => f.station_id)))
      setFavoriteStations(data.map((f) => f.gas_stations).filter(Boolean))
    }
  }

  useEffect(() => {
    if (!user) {
      setFavorites(new Set())
      setFavoriteStations([])
      return
    }
    fetchFavorites()
  }, [user])

  const toggle = async (stationId) => {
    if (!user) return

    if (favorites.has(stationId)) {
      setFavorites((prev) => { const next = new Set(prev); next.delete(stationId); return next })
      setFavoriteStations((prev) => prev.filter((s) => s.station_id !== stationId))
      await supabase.from('favorites').delete().eq('station_id', stationId)
    } else {
      setFavorites((prev) => new Set(prev).add(stationId))
      await supabase.from('favorites').insert({ user_id: user.id, station_id: stationId })
      fetchFavorites()
    }
  }

  return { favorites, favoriteStations, toggle }
}
