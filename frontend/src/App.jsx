import { Routes, Route, Link } from 'react-router-dom'
import MapPage from './pages/MapPage.jsx'
import PondDetails from './pages/PondDetails.jsx'

export default function App() {
  return (
    <div>
      <nav style={{padding:12,borderBottom:'1px solid #eee',display:'flex',gap:12}}>
        <Link to="/">Harta</Link>
      </nav>
      <Routes>
        <Route path="/" element={<MapPage />} />
        <Route path="/pond/:id" element={<PondDetails />} />
      </Routes>
    </div>
  )
}
