import { useEffect, useState } from "react";
import { getJSON, postJSON, patchJSON } from "../api/client";

export default function PondAdminPage() {
  const [ponds, setPonds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [form, setForm] = useState({
    name: "",
    location: "",
    price: 0,
    rules: "",
    lat: "",
    lng: "",
  });

  async function load() {
    setErr("");
    setLoading(true);
    try {
      const data = await getJSON("/api/pond-admin/ponds");
      setPonds(data);
    } catch (e) {
      setErr(String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function createPond() {
    setErr("");
    try {
      const body = {
        ...form,
        price: Number(form.price || 0),
        lat: form.lat === "" ? null : Number(form.lat),
        lng: form.lng === "" ? null : Number(form.lng),
      };
      const r = await postJSON("/api/pond-admin/ponds", body);
      alert("Balta a fost creată!");
      setForm({ name: "", location: "", price: 0, rules: "", lat: "", lng: "" });
      await load();
      return r;
    } catch (e) {
      alert("Eroare la creare: " + String(e));
    }
  }

  async function updatePond(id, patch) {
    try {
      await patchJSON(`/api/pond-admin/ponds/${id}`, patch);
      await load();
    } catch (e) {
      alert("Eroare update: " + String(e));
    }
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 18 }}>
      <h1>Administrare baltă</h1>

      {err && <div style={{ color: "#f87171", marginBottom: 10 }}>Eroare: {err}</div>}

      <div style={{
        border: "1px solid rgba(31,41,55,.75)",
        borderRadius: 16,
        padding: 14,
        background: "rgba(14,23,48,.45)",
        marginBottom: 16
      }}>
        <h3 style={{ marginTop: 0 }}>+ Adaugă baltă</h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <input
            placeholder="Nume baltă"
            value={form.name}
            onChange={(e) => setForm(s => ({ ...s, name: e.target.value }))}
          />
          <input
            placeholder="Localitate/Județ"
            value={form.location}
            onChange={(e) => setForm(s => ({ ...s, location: e.target.value }))}
          />
          <input
            placeholder="Preț (lei/zi)"
            value={form.price}
            onChange={(e) => setForm(s => ({ ...s, price: e.target.value }))}
          />
          <input
            placeholder="Reguli (ex: Catch & Release)"
            value={form.rules}
            onChange={(e) => setForm(s => ({ ...s, rules: e.target.value }))}
          />
          <input
            placeholder="Lat (opțional)"
            value={form.lat}
            onChange={(e) => setForm(s => ({ ...s, lat: e.target.value }))}
          />
          <input
            placeholder="Lng (opțional)"
            value={form.lng}
            onChange={(e) => setForm(s => ({ ...s, lng: e.target.value }))}
          />
        </div>

        <button style={{ marginTop: 10 }} onClick={createPond}>
          Creează baltă
        </button>
      </div>

      {loading ? (
        <div>Se încarcă...</div>
      ) : ponds.length === 0 ? (
        <div>Nu ai nicio baltă încă. Creează una de mai sus.</div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {ponds.map(p => (
            <div key={p.id} style={{
              border: "1px solid rgba(31,41,55,.75)",
              borderRadius: 16,
              padding: 14,
              background: "rgba(13,21,39,.55)"
            }}>
              <div style={{ fontWeight: 900 }}>{p.name}</div>
              <div style={{ color: "#94a3b8", fontSize: 13 }}>{p.location}</div>

              <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
                <button onClick={() => updatePond(p.id, { price: (p.price || 0) + 10 })}>
                  +10 lei
                </button>
                <button onClick={() => updatePond(p.id, { rules: "Catch & Release" })}>
                  Setează reguli C&R
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
