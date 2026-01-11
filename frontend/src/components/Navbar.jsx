// src/components/Navbar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearAuth, getUser } from "../auth/authStore";
import logo from "../assets/logo.png";

const css = {
  bar: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    backdropFilter: "blur(12px)",
    background: "rgba(11,18,32,0.72)",
    borderBottom: "1px solid rgba(31,41,55,.75)",
  },

  inner: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "14px 18px",
    display: "flex",
    alignItems: "center",
    gap: 14,
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    textDecoration: "none",
    minWidth: 260,
  },

  logoWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    border: "1px solid rgba(148,163,184,.22)",
    background: "linear-gradient(180deg, rgba(14,23,48,.75), rgba(12,21,40,.75))",
    boxShadow: "0 10px 30px rgba(0,0,0,.22)",
    overflow: "hidden",
    display: "grid",
    placeItems: "center",
  },

  logo: {
    width: 34,
    height: 34,
    objectFit: "contain",
    display: "block",
  },

  title: { color: "#e5e7eb", fontWeight: 900, letterSpacing: 0.2, lineHeight: 1.1 },
  tagline: { color: "#94a3b8", fontSize: 12, marginTop: 2, whiteSpace: "nowrap" },

  spacer: { flex: 1 },

  // container pentru pill-uri
  navRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },

  // PILL button style (Link)
  pill: (active, variant) => {
    const base = {
      padding: "10px 18px",
      borderRadius: 999,
      textDecoration: "none",
      fontWeight: 900,
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      letterSpacing: ".2px",
      border: "1px solid rgba(31,41,55,.75)",
      transition: "transform .15s ease, box-shadow .15s ease, filter .15s ease",
      userSelect: "none",
      willChange: "transform",
    };

    const variants = {
      gray: {
        background: "rgba(30,41,59,.55)",
        color: "#e5e7eb",
        border: "1px solid rgba(148,163,184,.25)",
        boxShadow: active ? "0 0 0 2px rgba(148,163,184,.20)" : "0 10px 26px rgba(0,0,0,.20)",
      },

      blue: {
        background: "linear-gradient(135deg,#3b82f6,#06b6d4)",
        color: "#071225",
        border: "none",
        boxShadow: "0 10px 30px rgba(59,130,246,.40)",
      },

      green: {
        background: "linear-gradient(135deg,#22c55e,#a3e635)",
        color: "#071225",
        border: "none",
        boxShadow: "0 10px 30px rgba(34,197,94,.38)",
      },

      purple: {
        background: "linear-gradient(135deg,#a78bfa,#60a5fa)",
        color: "#071225",
        border: "none",
        boxShadow: "0 10px 30px rgba(167,139,250,.35)",
      },

      // ⭐ Login premium
      login: {
        background: "linear-gradient(180deg, rgba(15,23,42,.92), rgba(2,6,23,.85))",
        color: "#e5e7eb",
        border: "1px solid rgba(148,163,184,.35)",
        boxShadow: active
          ? "0 0 0 2px rgba(59,130,246,.35), 0 10px 30px rgba(0,0,0,.35)"
          : "0 10px 30px rgba(0,0,0,.35)",
      },
    };

    return {
      ...base,
      ...(variants[variant] || variants.gray),
      ...(active ? { transform: "scale(1.05)", filter: "brightness(1.02)" } : {}),
    };
  },

  // pentru hover efect (aplicat via onMouseEnter/Leave)
  hoverOn: (variant) => {
    const glow = {
      blue: "0 16px 46px rgba(59,130,246,.45)",
      green: "0 16px 46px rgba(34,197,94,.42)",
      purple: "0 16px 46px rgba(167,139,250,.40)",
      login: "0 16px 46px rgba(59,130,246,.20)",
      gray: "0 16px 46px rgba(148,163,184,.12)",
    };
    return { transform: "translateY(-1px) scale(1.06)", boxShadow: glow[variant] || glow.gray };
  },

  // user chip
  userChip: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 14px",
    borderRadius: 999,
    border: "1px solid rgba(148,163,184,.22)",
    background: "rgba(14,23,48,.55)",
    color: "#cbd5e1",
    fontSize: 13,
    fontWeight: 800,
    boxShadow: "0 10px 28px rgba(0,0,0,.22)",
    whiteSpace: "nowrap",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    background: "#22c55e",
    boxShadow: "0 0 0 3px rgba(34,197,94,.15)",
  },

  // logout button (same pill feel)
  logoutBtn: {
    padding: "10px 18px",
    borderRadius: 999,
    border: "1px solid rgba(148,163,184,.25)",
    background: "rgba(30,41,59,.40)",
    color: "#e5e7eb",
    cursor: "pointer",
    fontWeight: 900,
    transition: "transform .15s ease, box-shadow .15s ease, filter .15s ease",
    boxShadow: "0 10px 28px rgba(0,0,0,.22)",
  },
};

function PillLink({ to, active, variant, children }) {
  return (
    <Link
      to={to}
      style={css.pill(active, variant)}
      onMouseEnter={(e) => Object.assign(e.currentTarget.style, css.hoverOn(variant))}
      onMouseLeave={(e) => Object.assign(e.currentTarget.style, css.pill(active, variant))}
    >
      {children}
    </Link>
  );
}

export default function Navbar() {
  const nav = useNavigate();
  const loc = useLocation();
  const user = getUser();
  const path = loc.pathname;

  const isAdmin = user?.role === "admin";
  const isPondAdmin = user?.role === "pond_admin";

  return (
    <div style={css.bar}>
      <div style={css.inner}>
        <Link to="/" style={css.brand}>
          <div style={css.logoWrap}>
            <img src={logo} alt="FishTrack" style={css.logo} />
          </div>
          <div>
            <div style={css.title}>FishTrack</div>
            <div style={css.tagline}>Your partner in getting that big catch</div>
          </div>
        </Link>

        <div style={css.spacer} />

        <div style={css.navRow}>
          <PillLink to="/" active={path === "/"} variant="purple">
            Acasă
          </PillLink>

          <PillLink to="/map" active={path === "/map"} variant="blue">
            Hartă
          </PillLink>

          {!user ? (
            <>
              <PillLink to="/login" active={path === "/login"} variant="login">
                🔐 Login
              </PillLink>

              <PillLink to="/register" active={path === "/register"} variant="green">
                Register
              </PillLink>
            </>
          ) : (
            <>
              {isPondAdmin && (
                <PillLink to="/pond-admin" active={path === "/pond-admin"} variant="blue">
                  Administrare baltă
                </PillLink>
              )}

              {isAdmin && (
                <PillLink to="/admin" active={path === "/admin"} variant="purple">
                  Admin
                </PillLink>
              )}

              <span style={css.userChip} title="Utilizator conectat">
                <span style={css.dot} />
                {user.name} ({user.role})
              </span>

              <button
                style={css.logoutBtn}
                onMouseEnter={(e) =>
                  Object.assign(e.currentTarget.style, {
                    transform: "translateY(-1px) scale(1.06)",
                    boxShadow: "0 16px 46px rgba(148,163,184,.12)",
                  })
                }
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, css.logoutBtn)}
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
    </div>
  );
}
