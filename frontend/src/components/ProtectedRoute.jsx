import { Navigate } from "react-router-dom";
import { getUser } from "../auth/authStore";

export default function ProtectedRoute({ children, role }) {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}
