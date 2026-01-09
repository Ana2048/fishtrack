import { Routes, Route, Link, useNavigate } from "react-router-dom";
import MapPage from "./pages/MapPage.jsx";
import PondDetails from "./pages/PondDetails.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { clearAuth, getUser } from "./auth/authStore.js";
import Navbar from "./components/Navbar.jsx";

function Nav(){
  const nav = useNavigate();
  const user = getUser();
  return (
    <nav style={{padding:12,borderBottom:"1px solid #eee",display:"flex",gap:12}}>
      <Link to="/">Harta</Link>
      <div style={{marginLeft:"auto"}} />
      {user ? (
        <>
          <span>👤 {user.name} ({user.role})</span>
          {user.role === "admin" && <Link to="/admin">Admin</Link>}
          <button onClick={()=>{ clearAuth(); nav("/"); }}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}

function AdminStub(){
  return <div style={{padding:16}}><h2>Admin page (urmează)</h2><p>Aici vei aproba rapoarte + CRUD bălți.</p></div>;
}

export default function App(){
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<MapPage />} />
        <Route path="/pond/:id" element={<PondDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* doar admin */}
        <Route path="/admin" element={
          <ProtectedRoute role="admin">
            <AdminStub />
          </ProtectedRoute>
        }/>
      </Routes>
    </div>
  );
}
