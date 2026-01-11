import { Navigate } from "react-router-dom";
import { getUser } from "../auth/authStore";

export default function ProtectedRoute({ children, role }) {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;

  // role poate fi string sau array
  if (role) {
    const allowed = Array.isArray(role) ? role : [role];
    if (!allowed.includes(user.role)) return <Navigate to="/" replace />;
  }

  return children;
}
