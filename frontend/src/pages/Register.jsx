import { useMemo, useState } from "react";
import { postJSON } from "../api/client";
import { setAuth } from "../auth/authStore";
import { useNavigate } from "react-router-dom";

const styles = {
  // ✅ FIX: full width + full height (fără "jumătate de pagină")
  page: {
    width: "100vw",
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 18,
    overflowX: "hidden",
    background:
      "radial-gradient(1200px 500px at 10% 10%, #0ea5e933, transparent 60%), radial-gradient(900px 400px at 90% 20%, #22c55e2a, transparent 55%), #0b1220",
    color: "#e5e7eb",
  },

  // card responsive
  card: {
    width: "min(860px, 92vw)",
    borderRadius: 18,
    border: "1px solid #1f2937",
    background: "linear-gradient(180deg, #0d1527, #0b1220)",
    boxShadow: "0 18px 60px rgba(0,0,0,.35)",
    overflow: "hidden",
  },

  header: {
    padding: 18,
    borderBottom: "1px solid #1f2937",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },

  title: { margin: 0, fontSize: 20, letterSpacing: 0.2 },
  subtitle: { margin: "6px 0 0", color: "#94a3b8", fontSize: 13 },

  body: {
    display: "grid",
    gridTemplateColumns: "1.1fr 1fr",
    gap: 16,
    padding: 18,
  },

  // ✅ Responsive: pe ecrane mici devine 1 coloană
  bodyMobile: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 16,
    padding: 18,
  },

  side: {
    borderRadius: 16,
    border: "1px solid #1f2937",
    background: "linear-gradient(180deg,#0e1730,#0c1528)",
    padding: 16,
  },

  tabs: { display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" },

  tab: (active) => ({
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid " + (active ? "#2b3a55" : "#1f2937"),
    background: active ? "#12203a" : "#0e1730",
    color: active ? "#eaf2ff" : "#94a3b8",
    cursor: "pointer",
    fontWeight: 600,
  }),

  form: { display: "grid", gap: 10 },

  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },

  // ✅ pe mobil rândul 2 devine 1 coloană
  row1: { display: "grid", gridTemplateColumns: "1fr", gap: 10 },

  label: { fontSize: 12, color: "#9fb2d8", marginBottom: 6 },

  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #1f2937",
    background: "#0e1730",
    color: "#e5e7eb",
    outline: "none",
  },

  button: (primary) => ({
    padding: "10px 14px",
    borderRadius: 12,
    border: primary ? "none" : "1px solid #1f2937",
    background: primary
      ? "linear-gradient(135deg,#3b82f6,#22c55e)"
      : "#0c1528",
    color: "#e5e7eb",
    cursor: "pointer",
    fontWeight: 700,
  }),

  error: { color: "#f87171", fontSize: 13 },

  note: { color: "#94a3b8", fontSize: 12, lineHeight: 1.5 },

  sectionTitle: { marginTop: 6, color: "#cfe1ff", fontWeight: 700 },

  footerHint: {
    marginTop: 12,
    color: "#94a3b8",
    fontSize: 12,
    textAlign: "center",
  },
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 860);

  useState(() => {
    const onResize = () => setIsMobile(window.innerWidth < 860);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return isMobile;
}

export default function Register() {
  const nav = useNavigate();
  const isMobile = useIsMobile();

  const [mode, setMode] = useState("fisher"); // fisher | owner
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [fisher, setFisher] = useState({ name: "", email: "", password: "" });

  const [owner, setOwner] = useState({
    name: "",
    email: "",
    password: "",
    pondName: "",
    pondLocation: "",
    companyName: "",
    companyCui: "",
    companyAddress: "",
    phone: "",
  });

  const isOwner = mode === "owner";
  const payload = useMemo(() => (isOwner ? owner : fisher), [isOwner, owner, fisher]);

  function setField(key, value) {
    if (isOwner) setOwner((p) => ({ ...p, [key]: value }));
    else setFisher((p) => ({ ...p, [key]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const url = isOwner
        ? "/api/auth/register/owner"
        : "/api/auth/register/fisher";

      const data = await postJSON(url, payload);

      setAuth({ token: data.token, user: data.user });

      if (isOwner) {
        alert(data.message || "Cerere trimisă. Cont în așteptare aprobare.");
      }
      nav("/", { replace: true });
    } catch {
      setError("Înregistrare eșuată. Verifică datele (email existent?)");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Creează cont FishTrack</h2>
            <div style={styles.subtitle}>
              Alege tipul de cont și completează datele necesare
            </div>
          </div>
          <button style={styles.button(false)} onClick={() => nav("/login")}>
            Ai deja cont? Login
          </button>
        </div>

        <div style={isMobile ? styles.bodyMobile : styles.body}>
          <div>
            <div style={styles.tabs}>
              <button
                type="button"
                style={styles.tab(!isOwner)}
                onClick={() => setMode("fisher")}
              >
                Pescar
              </button>
              <button
                type="button"
                style={styles.tab(isOwner)}
                onClick={() => setMode("owner")}
              >
                Administrator baltă
              </button>
            </div>

            <form style={styles.form} onSubmit={onSubmit}>
              <div style={isMobile ? styles.row1 : styles.row2}>
                <div>
                  <div style={styles.label}>Nume</div>
                  <input
                    style={styles.input}
                    value={payload.name}
                    onChange={(e) => setField("name", e.target.value)}
                    placeholder="ex: Ana Pop"
                  />
                </div>
                <div>
                  <div style={styles.label}>Email</div>
                  <input
                    style={styles.input}
                    value={payload.email}
                    onChange={(e) => setField("email", e.target.value)}
                    placeholder="ex: ana@email.com"
                  />
                </div>
              </div>

              <div>
                <div style={styles.label}>Parolă</div>
                <input
                  style={styles.input}
                  type="password"
                  value={payload.password}
                  onChange={(e) => setField("password", e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              {isOwner && (
                <>
                  <div style={styles.sectionTitle}>Date baltă</div>
                  <div style={isMobile ? styles.row1 : styles.row2}>
                    <div>
                      <div style={styles.label}>Nume baltă</div>
                      <input
                        style={styles.input}
                        value={owner.pondName}
                        onChange={(e) => setOwner({ ...owner, pondName: e.target.value })}
                        placeholder="ex: Balta Verde"
                      />
                    </div>
                    <div>
                      <div style={styles.label}>Localitate/Județ</div>
                      <input
                        style={styles.input}
                        value={owner.pondLocation}
                        onChange={(e) => setOwner({ ...owner, pondLocation: e.target.value })}
                        placeholder="ex: Cluj / Apahida"
                      />
                    </div>
                  </div>

                  <div style={styles.sectionTitle}>Date firmă</div>
                  <div>
                    <div style={styles.label}>Denumire firmă</div>
                    <input
                      style={styles.input}
                      value={owner.companyName}
                      onChange={(e) => setOwner({ ...owner, companyName: e.target.value })}
                      placeholder="ex: SC Pescuit SRL"
                    />
                  </div>

                  <div style={isMobile ? styles.row1 : styles.row2}>
                    <div>
                      <div style={styles.label}>CUI</div>
                      <input
                        style={styles.input}
                        value={owner.companyCui}
                        onChange={(e) => setOwner({ ...owner, companyCui: e.target.value })}
                        placeholder="ex: RO1234567"
                      />
                    </div>
                    <div>
                      <div style={styles.label}>Telefon (opțional)</div>
                      <input
                        style={styles.input}
                        value={owner.phone}
                        onChange={(e) => setOwner({ ...owner, phone: e.target.value })}
                        placeholder="ex: 07xx xxx xxx"
                      />
                    </div>
                  </div>

                  <div>
                    <div style={styles.label}>Adresă firmă</div>
                    <input
                      style={styles.input}
                      value={owner.companyAddress}
                      onChange={(e) => setOwner({ ...owner, companyAddress: e.target.value })}
                      placeholder="ex: Str. Exemplu 10, Cluj-Napoca"
                    />
                  </div>
                </>
              )}

              {error && <div style={styles.error}>{error}</div>}

              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button style={styles.button(true)} disabled={loading}>
                  {loading
                    ? "Se trimite..."
                    : isOwner
                    ? "Trimite cererea"
                    : "Creează cont"}
                </button>
                <button type="button" style={styles.button(false)} onClick={() => nav("/")}>
                  Înapoi
                </button>
              </div>
            </form>

            
          </div>

          <div style={styles.side}>
            <h3 style={{ marginTop: 0 }}>Ce primești</h3>
            {!isOwner ? (
              <>
                <div style={styles.note}>
                  Ca <b>Pescar</b> poți:
                  <ul>
                    <li>vedea bălțile pe hartă</li>
                    <li>salva bălți favorite</li>
                    <li>trimite rapoarte (în curând)</li>
                  </ul>
                </div>
                <div style={styles.note}>
                  Recomandare: folosește o parolă de min. 8 caractere.
                </div>
              </>
            ) : (
              <>
                <div style={styles.note}>
                  Ca <b>Administrator de baltă</b> poți:
                  <ul>
                    <li>gestiona pagina bălții tale</li>
                    <li>actualiza prețuri/reguli</li>
                    <li>aproba rapoarte (în curând)</li>
                  </ul>
                  <p>
                    Cererea ta va fi marcată <b>pending</b> până este aprobată de un admin FishTrack.
                  </p>
                </div>
                <div style={styles.note}>
                  Tip: completează datele firmei corect (CUI + adresă).
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
