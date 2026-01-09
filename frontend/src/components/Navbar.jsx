import { Link, useNavigate } from "react-router-dom";
import { clearAuth, getUser } from "../auth/authStore";

const css = {
  bar: {
    position: "sticky",
    top: 0,
    zIndex: 20,
    backdropFilter: "blur(10px)",
    background: "rgba(11,18,32,0.78)",
    borderBottom: "1px solid #1f2937",
  },
  inner: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "14px 18px",
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    textDecoration: "none",
    color: "#e5e7eb",
    fontWeight: 800,
    letterSpacing: 0.3,
  },
  badge: {
    width: 30,
    height: 30,
    borderRadius: 10,
    background: "linear-gradient(135deg,#22c55e,#3b82f6)",
    boxShadow: "0 0 0 4px rgba(96,165,250,.12)",
  },
  tagline: {
    color: "#94a3b8",
    fontSize: 12,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: 420,
  },
  spacer: { flex: 1 },
  pill: {
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid #1f2937",
    background: "#0e1730",
    color: "#cfe1ff",
    textDecoration: "none",
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  },
  pillPrimary: {
    padding: "8px 12px",
    borderRadius: 999,
    border: "none",
    background: "linear-gradient(135deg,#3b82f6,#22c55e)",
    color: "#0b1220",
    textDecoration: "none",
    fontWeight: 800,
  },
  user: { color: "#cbd5e1", fontSize: 13 },
  btn: {
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid #1f2937",
    background: "#0c1528",
    color: "#e5e7eb",
    cursor: "pointer",
    fontWeight: 700,
  },
};

export default function Navbar() {
  const nav = useNavigate();
  const user = getUser();

  return (
    <div style={css.bar}>
      <div style={css.inner}>
        <Link to="/" style={css.logo}>
          <span style={css.badge} />
          FishTrack
        </Link>

        <div style={css.tagline}>Your partner in getting that big catch</div>

        <div style={css.spacer} />

        <Link to="/" style={css.pill}>Harta</Link>

        {!user ? (
          <>
            <Link to="/login" style={css.pill}>Login</Link>
            <Link to="/register" style={css.pillPrimary}>Register</Link>
          </>
        ) : (
          <>
            <span style={css.user}>👤 {user.name} ({user.role})</span>
            {user.role === "admin" && <Link to="/admin" style={css.pill}>Admin</Link>}
            <button
              style={css.btn}
              onClick={() => {
                clearAuth();
                nav("/");
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
