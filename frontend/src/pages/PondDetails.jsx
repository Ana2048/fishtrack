import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getJSON } from '../api/client'

export default function PondDetails() {
  const { id } = useParams()
  const { data, isLoading, error } = useQuery({
    queryKey: ['pond', id],
    queryFn: () => getJSON(`/api/ponds/${id}`)
  })

  if (isLoading) return <p style={{padding:16}}>Se încarcă…</p>
  if (error) return <p style={{padding:16,color:'crimson'}}>Eroare: {String(error.message)}</p>
  if (!data)  return <p style={{padding:16}}>Nu există această baltă.</p>

  return (
    <div style={{padding:16}}>
      <p><Link to="/">{'< Înapoi'}</Link></p>
      <h2>{data.name}</h2>
      <p>{data.location} • {data.price ?? '-'} lei • ★ {data.rating ?? '-'}</p>
      <p>Reguli: {data.rules ?? '—'}</p>
      <pre style={{background:'#f6f6f6', padding:12, borderRadius:8}}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}
