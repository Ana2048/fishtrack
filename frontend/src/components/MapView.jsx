import { useEffect, useRef } from 'react'
import L from 'leaflet'

export default function MapView({ markers = [], onClickMarker }) {
  const mapEl = useRef(null)
  const mapRef = useRef(null)
  const layerRef = useRef(null)

  // init map
  useEffect(() => {
    if (!mapEl.current || mapRef.current) return
    const map = L.map(mapEl.current).setView([45.9432, 24.9668], 7) // România
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map)
    mapRef.current = map
  }, [])

  // render markers
  useEffect(() => {
    if (!mapRef.current) return
    if (layerRef.current) {
      layerRef.current.remove()
      layerRef.current = null
    }
    const g = L.layerGroup().addTo(mapRef.current)
    markers.forEach(m => {
      const mk = L.marker([m.lat ?? 45.94, m.lng ?? 24.96]).addTo(g)
      mk.bindPopup(`<b>${m.name}</b><br>${m.location ?? ''}`)
      mk.on('click', () => onClickMarker?.(m))
    })
    layerRef.current = g
    return () => g.remove()
  }, [markers, onClickMarker])

  return <div ref={mapEl} style={{height:'60vh', width: '100%', border:'1px solid #eee', borderRadius:8}} />
}
