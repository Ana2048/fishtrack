import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { postJSON } from "../api/client";

const s = {
  page: { minHeight: "100vh", padding: 18, background: "#0b1220", color: "#e5e7eb" },
  card: { maxWidth: 820, margin: "0 auto", border: "1px solid #1f2937", borderRadius: 18, background: "linear-gradient(180deg,#0d1527,#0b1220)", padding: 16 },
  h: { margin: 0, fontSize: 22, fontWeight: 900 },
  p: { margin: "6px 0 0", color: "#94a3b8", fontSize: 13 },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  field: { marginTop: 10 },
  label: { fontSize: 12, color: "#9fb2d8", marginBottom: 6 },
  input: { width: "100%", padding: "10px 12px", borderRadius: 12, border: "1px solid #1f2937", background: "#0e1730", color: "#e5e7eb" },
  textarea: { width: "100%", minHeight: 120, padding: "10px 12px", borderRadius: 12, border: "1px solid #1f2937", background: "#0e1730", color: "#e5e7eb", resize: "vertical" },
  btn: { marginTop: 12, padding: "10px 14px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#3b82f6,#22c55e)", color: "#071225", fontWeight: 900, cursor: "pointer" },
  ghost: { marginTop: 12, marginLeft: 10, padding: "10px 14px", borderRadius: 12, border: "1px solid #1f2937", background: "#0c1528", color: "#e5e7eb", fontWeight: 800, cursor: "pointer" },
  err: { marginTop: 10, color: "#f87171", fontSize: 13 }
};

export default function SubmitReport() {
  const nav = useNavigate();
  const { pondId } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [catchSpecies, setCatchSpecies] = useState("");
  const [catchWeight, setCatchWeight] = useState("");
  const [catchCount, setCatchCount] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await postJSON("/api/reports", {
        pondId: Number(pondId),
        title,
        description,
        catchSpecies,
        catchWeight: catchWeight ? Number(catchWeight) : null,
        catchCount: catchCount ? Number(catchCount) : null,
        photoUrl
      });
      alert("Raport trimis! (status: pending)");
      nav(`/pond/${pondId}`);
    } catch {
      setError("Nu s-a putut trimite raportul. Ești logat?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h2 style={s.h}>Adaugă raport de pescuit</h2>
        <p style={s.p}>Raportul va fi trimis spre aprobare (pending) către Admin FishTrack.</p>

        <form onSubmit={submit}>
          <div style={s.field}>
            <div style={s.label}>Titlu</div>
            <input style={s.input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="ex: Crap mare la apus" />
          </div>

          <div style={s.field}>
            <div style={s.label}>Descriere</div>
            <textarea style={s.textarea} value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="Ce ai prins, cum a fost vremea, ce momeală ai folosit..." />
          </div>

          <div style={s.row2}>
            <div style={s.field}>
              <div style={s.label}>Specie (opțional)</div>
              <input style={s.input} value={catchSpecies} onChange={(e) => setCatchSpecies(e.target.value)} placeholder="ex: Crap" />
            </div>

            <div style={s.field}>
              <div style={s.label}>Greutate (kg) (opțional)</div>
              <input style={s.input} value={catchWeight} onChange={(e) => setCatchWeight(e.target.value)} placeholder="ex: 5.2" />
            </div>
          </div>

          <div style={s.row2}>
            <div style={s.field}>
              <div style={s.label}>Număr pești (opțional)</div>
              <input style={s.input} value={catchCount} onChange={(e) => setCatchCount(e.target.value)} placeholder="ex: 3" />
            </div>

            <div style={s.field}>
              <div style={s.label}>Poză (URL) (opțional)</div>
              <input style={s.input} value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="https://..." />
            </div>
          </div>

          {error && <div style={s.err}>{error}</div>}

          <button style={s.btn} disabled={loading}>{loading ? "Se trimite..." : "Trimite raport"}</button>
          <button type="button" style={s.ghost} onClick={() => nav(-1)}>Înapoi</button>
        </form>
      </div>
    </div>
  );
}
