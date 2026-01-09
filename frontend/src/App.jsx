import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import MapPage from "./pages/MapPage.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import PondDetails from "./pages/PondDetails.jsx";
import SubmitReport from "./pages/SubmitReport.jsx";
import AdminModeration from "./pages/AdminModeration.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/pond/:id" element={<PondDetails />} />
        <Route path="/pond/:pondId/report" element={
          <ProtectedRoute>
            <SubmitReport />
          </ProtectedRoute>
        } />
        <Route path="/admin/reports" element={
          <ProtectedRoute role="admin">
            <AdminModeration />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}
