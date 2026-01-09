import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearAuth, getUser } from "../auth/authStore";
import logo from "../assets/logo.png";

const css = {
  bar: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    backdropFilter: "blur(10px)",
    background: "rgba(11,18,32,0.72)",
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
  brand: { display: "flex", alignItems: "center", gap: 12, textDecoration: "none" },
  logo: { width: 34, height: 34, borderRadius: 10, objectFit: "cover" },
  title: { color: "#e5e7eb", fontWeight: 900, letterSpacing: 0.2 },
  tagline: { color: "#94a3b8", fontSize: 12, marginLeft: 10, whiteSpace: "nowrap" },
  spacer: { flex: 1 },
  pill: (active, variant) => {
    const base = {
      padding: "9px 14px",
      borderRadius: 999,
      textDecoration: "none",
      fontWeight: 800,
      border: "1px solid #1f2937",
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      transition: "transform .12s ease, filter .12s ease",
    };
    const variants = {
      gray: { background: active ? "#12203a" : "#0e1730", color: "#e5e7eb" },
      blue: { background: "linear-gradient(135deg,#3b82f6,#06b6d4)", color: "#071225", border: "none" },
      green: { background: "linear-gradient(135deg,#22c55e,#a3e635)", color: "#071225", border: "none" },
      purple: { background: "linear-gradient(135deg,#a78bfa,#60a5fa)", color: "#071225", border: "none" },
    };
    return { ...base, ...(variants[variant] || variants.gray) };
  },
  btn: {
    padding: "9px 14px",
    borderRadius: 999,
    border: "1px solid #1f2937",
    background: "#0c1528",
    color: "#e5e7eb",
    cursor: "pointer",
    fontWeight: 900,
  },
  user: { color: "#cbd5e1", fontSize: 13, fontWeight: 700 },
};

export default function Navbar() {
  const nav = useNavigate();
  const loc = useLocation();
  const user = getUser();
  const path = loc.pathname;

  return (
    <div style={css.bar}>
      <div style={css.inner}>
        <Link to="/" style={css.brand}>
          <img src={logo} alt="FishTrack" style={css.logo} />
          <div>
            <div style={css.title}>FishTrack</div>
            <div style={css.tagline}>Your partner in getting that big catch</div>
          </div>
        </Link>

        <div style={css.spacer} />

        <Link to="/" style={css.pill(path === "/", "purple")}>Acasă</Link>
        <Link to="/map" style={css.pill(path === "/map", "blue")}>Hartă</Link>

        {!user ? (
          <>
            <Link to="/login" style={css.pill(path === "/login", "gray")}>Login</Link>
            <Link to="/register" style={css.pill(path === "/register", "green")}>Register</Link>
          </>
        ) : (
          <>
            <span style={css.user}>👤 {user.name} ({user.role})</span>
            {user.role === "admin" && <Link to="/admin" style={css.pill(path === "/admin", "purple")}>Admin</Link>}
            <button
              style={css.btn}
              onClick={() => { clearAuth(); nav("/"); }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
