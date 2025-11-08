const base = import.meta.env.VITE_API_URL || 'http://localhost:3000'
export const apiUrl = base.replace(/\/$/,'') // fără slash final

export async function getJSON(path) {
  const r = await fetch(apiUrl + path)
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  return await r.json()
}
