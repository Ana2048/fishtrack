import { useQuery } from '@tanstack/react-query'
import { getJSON } from '../api/client'
import { useNavigate } from 'react-router-dom'
import MapView from '../components/MapView'

export default function MapPage() {
  const nav = useNavigate()
  const { data, isLoading, error } = useQuery({
    queryKey: ['ponds'],
    queryFn: () => getJSON('/api/ponds')
  })

  if (isLoading) return <p style={{padding:16}}>Se încarcă bălțile…</p>
  if (error) return <p style={{padding:16,color:'crimson'}}>Eroare: {String(error.message)}</p>

  const ponds = data || []
  const markers = ponds.map(p => ({
    id: p.id, name: p.name, location: p.location, lat: p.lat, lng: p.lng
  }))

  return (
    <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:16, padding:16}}>
      <div>
        <MapView markers={markers} onClickMarker={(m)=>nav(`/pond/${m.id}`)} />
      </div>
      <div>
        <h2>Lista bălților ({ponds.length})</h2>
        <ul style={{listStyle:'none', padding:0}}>
          {ponds.map(p => (
            <li key={p.id} style={{padding:'8px 0', borderBottom:'1px solid #eee', cursor:'pointer'}}
                onClick={()=>nav(`/pond/${p.id}`)}>
              <b>{p.name}</b> — {p.location} {p.price ? `• ${p.price} lei` : ''} {p.rating ? `• ★ ${p.rating}` : ''}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
