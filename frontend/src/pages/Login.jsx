import { useState } from "react";
import { postJSON } from "../api/client";
import { setAuth } from "../auth/authStore";
import { useNavigate } from "react-router-dom";

const styles = {
  page: {
    width: "100%",
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 18,
    overflowX: "clip",
    background:
      "radial-gradient(1200px 500px at 10% 10%, #0ea5e933, transparent 60%), radial-gradient(900px 400px at 90% 20%, #22c55e2a, transparent 55%), #0b1220",
    color: "#e5e7eb",
  },
  card: {
    width: "min(820px, 92vw)",
    borderRadius: 18,
    border: "1px solid #1f2937",
    background: "linear-gradient(180deg, #0d1527, #0b1220)",
    boxShadow: "0 18px 60px rgba(0,0,0,.35)",
    overflow: "hidden",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
  },
  left: {
    padding: 18,
    borderRight: "1px solid #1f2937",
    background: "linear-gradient(180deg,#0e1730,#0c1528)",
  },
  right: {
    padding: 18,
  },
  title: { margin: 0, fontSize: 20, fontWeight: 800 },
  sub: { marginTop: 6, color: "#94a3b8", fontSize: 13 },
  label: { fontSize: 12, color: "#9fb2d8", margin: "10px 0 6px" },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #1f2937",
    background: "#0e1730",
    color: "#e5e7eb",
    outline: "none",
  },
  btnPrimary: {
    marginTop: 12,
    width: "100%",
    padding: "10px 14px",
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(135deg,#3b82f6,#22c55e)",
    color: "#0b1220",
    cursor: "pointer",
    fontWeight: 900,
  },
  error: { color: "#f87171", fontSize: 13, marginTop: 10 },
  hint: { color: "#94a3b8", fontSize: 12, lineHeight: 1.5 },
  pill: {
    display: "inline-flex",
    gap: 8,
    alignItems: "center",
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid #1f2937",
    background: "#0c1528",
    color: "#cfe1ff",
    fontWeight: 700,
    marginTop: 12,
  },
};

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await postJSON("/api/auth/login", { email, password });
      setAuth({ token: data.token, user: data.user });
      nav("/", { replace: true });
    } catch {
      setError("Email sau parolă greșite.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      {/* animație simplă */}
      <style>{`
        @keyframes popIn { 
          from { opacity: 0; transform: translateY(10px) scale(.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .loginCard { animation: popIn .35s ease-out; }
        @media (max-width: 860px){
          .loginCard { grid-template-columns: 1fr !important; }
          .loginLeft { border-right: none !important; border-bottom: 1px solid #1f2937 !important; }
        }
      `}</style>

      <div style={styles.card} className="loginCard">
        <div style={styles.left} className="loginLeft">
          <h2 style={styles.title}>Bine ai revenit 👋</h2>
          <div style={styles.sub}>Intră în cont ca să trimiți rapoarte și să salvezi bălți favorite.</div>

          <div style={styles.pill}>🎣 FishTrack • Your partner in getting that big catch</div>

          <div style={{ marginTop: 14 }}>
            <div style={styles.hint}>
              Conturi demo:
              <ul>
                <li><b>admin@fishtrack.local</b> / <b>admin123</b></li>
                <li><b>pescar@fishtrack.local</b> / <b>pescar123</b></li>
              </ul>
            </div>
          </div>
        </div>

        <div style={styles.right}>
          <h2 style={styles.title}>Login</h2>
          <div style={styles.sub}>Autentifică-te rapid</div>

          <form onSubmit={onSubmit}>
            <div style={styles.label}>Email</div>
            <input style={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ex: ana@email.com" />

            <div style={styles.label}>Parolă</div>
            <input style={styles.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />

            {error && <div style={styles.error}>{error}</div>}

            <button style={styles.btnPrimary} disabled={loading}>
              {loading ? "Se autentifică..." : "Login"}
            </button>

            <div style={{ marginTop: 10 }}>
              <span style={styles.hint}>Nu ai cont?</span>{" "}
              <button type="button" onClick={() => nav("/register")} style={{ ...styles.hint, background: "none", border: "none", color: "#93c5fd", cursor: "pointer" }}>
                Creează cont
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
