import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "../utils/auth";
import "./PondAdminPage.css";

const API = "http://localhost:3000/api";

export default function PondAdminPage() {
  const navigate = useNavigate();
  const auth = useMemo(() => getAuth(), []);
  const token = auth?.token;
  const role = auth?.user?.role;

  const [tab, setTab] = useState("ponds");
  const [ponds, setPonds] = useState([]);
  const [selected, setSelected] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [reviews, setReviews] = useState([]);

  // form create/edit pond
  const [form, setForm] = useState({
    name: "",
    location: "",
    price: "",
    rules: "",
    lat: "",
    lng: ""
  });

  const headers = token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json" };

  useEffect(() => {
    if (!token) return navigate("/login");
    if (role !== "pond_admin") return navigate("/"); // doar pond_admin
  }, [token, role, navigate]);

  async function loadMyPonds() {
    const res = await fetch(`${API}/pond-admin/my/ponds`, { headers });
    const data = await res.json();
    setPonds(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    if (token && role === "pond_admin") loadMyPonds();
    // eslint-disable-next-line
  }, [token, role]);

  async function createPond(e) {
    e.preventDefault();
    const payload = {
      name: form.name,
      location: form.location,
      price: form.price ? Number(form.price) : null,
      rules: form.rules,
      lat: form.lat ? Number(form.lat) : null,
      lng: form.lng ? Number(form.lng) : null
    };

    const res = await fetch(`${API}/pond-admin/my/ponds`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      alert("Nu s-a putut crea balta.");
      return;
    }

    setForm({ name: "", location: "", price: "", rules: "", lat: "", lng: "" });
    await loadMyPonds();
    setTab("ponds");
  }

  async function selectPond(p) {
    setSelected(p);
    setTab("manage");

    // load photos, updates, reviews
    const [ph, up, rv] = await Promise.all([
      fetch(`${API}/pond-admin/my/ponds/${p.id}/photos`, { headers }).then((r) => r.json()).catch(() => []),
      fetch(`${API}/pond-admin/my/ponds/${p.id}/updates`, { headers }).then((r) => r.json()).catch(() => []),
      fetch(`${API}/pond-admin/my/ponds/${p.id}/reviews`, { headers }).then((r) => r.json()).catch(() => [])
    ]);

    setPhotos(Array.isArray(ph) ? ph : []);
    setUpdates(Array.isArray(up) ? up : []);
    setReviews(Array.isArray(rv) ? rv : []);
  }

  async function addPhoto(e) {
    e.preventDefault();
    const url = e.target.url.value.trim();
    const caption = e.target.caption.value.trim();
    if (!url || !selected) return;

    const res = await fetch(`${API}/pond-admin/my/ponds/${selected.id}/photos`, {
      method: "POST",
      headers,
      body: JSON.stringify({ url, caption })
    });

    if (res.ok) {
      e.target.reset();
      const fresh = await fetch(`${API}/pond-admin/my/ponds/${selected.id}/photos`, { headers }).then((r) => r.json());
      setPhotos(Array.isArray(fresh) ? fresh : []);
    }
  }

  async function addUpdate(e) {
    e.preventDefault();
    const title = e.target.title.value.trim();
    const body = e.target.body.value.trim();
    if (!title || !body || !selected) return;

    const res = await fetch(`${API}/pond-admin/my/ponds/${selected.id}/updates`, {
      method: "POST",
      headers,
      body: JSON.stringify({ title, body })
    });

    if (res.ok) {
      e.target.reset();
      const fresh = await fetch(`${API}/pond-admin/my/ponds/${selected.id}/updates`, { headers }).then((r) => r.json());
      setUpdates(Array.isArray(fresh) ? fresh : []);
    }
  }

  return (
    <div className="paWrap">
      <div className="paShell">
        <div className="paHeader">
          <div>
            <div className="paKicker">🧑‍💼 Pond Admin</div>
            <h1>Dashboard administrator de baltă</h1>
            <p>Gestionează bălțile tale, adaugă poze, update-uri și vezi recenziile pescarilor.</p>
          </div>

          <div className="paTabs">
            <button className={`paTab ${tab === "ponds" ? "active" : ""}`} onClick={() => setTab("ponds")}>
              Bălțile mele
            </button>
            <button className={`paTab ${tab === "create" ? "active" : ""}`} onClick={() => setTab("create")}>
              + Creează baltă
            </button>
            <button className={`paTab ${tab === "manage" ? "active" : ""}`} disabled={!selected} onClick={() => setTab("manage")}>
              Administrare
            </button>
          </div>
        </div>

        {tab === "ponds" && (
          <div className="paGrid">
            {ponds.length === 0 ? (
              <div className="paEmpty">
                <h3>Nu ai bălți încă.</h3>
                <p>Apasă „Creează baltă” și adaugă prima ta locație.</p>
              </div>
            ) : (
              ponds.map((p) => (
                <div key={p.id} className="paCard" onClick={() => selectPond(p)}>
                  <div className="paCardTop">
                    <div className="paCardTitle">{p.name}</div>
                    <span className="paBadge">{p.location}</span>
                  </div>
                  <div className="paCardMeta">
                    <span>💰 {p.price ?? "—"} lei</span>
                    <span>⭐ {p.rating ?? "—"}</span>
                  </div>
                  <div className="paCardRules">{p.rules || "—"}</div>
                  <div className="paCardBtn">Deschide administrare →</div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "create" && (
          <div className="paPanel">
            <h2>Creează o baltă</h2>
            <form className="paForm" onSubmit={createPond}>
              <div className="row2">
                <label>
                  Nume baltă
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </label>
                <label>
                  Județ / locație
                  <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
                </label>
              </div>

              <div className="row2">
                <label>
                  Preț (lei/zi)
                  <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </label>
                <label>
                  Reguli
                  <input value={form.rules} onChange={(e) => setForm({ ...form, rules: e.target.value })} />
                </label>
              </div>

              <div className="row2">
                <label>
                  Latitudine
                  <input value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} />
                </label>
                <label>
                  Longitudine
                  <input value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} />
                </label>
              </div>

              <button className="paBtn primary">Creează</button>
            </form>
          </div>
        )}

        {tab === "manage" && selected && (
          <div className="paManage">
            <div className="paPanel">
              <h2>Administrare: {selected.name}</h2>
              <p className="muted">Aici poți adăuga poze, update-uri și vezi recenziile.</p>
            </div>

            <div className="paColumns">
              <div className="paPanel">
                <h3>📸 Poze</h3>
                <form className="paMiniForm" onSubmit={addPhoto}>
                  <input name="url" placeholder="URL poză (sau path local)..." />
                  <input name="caption" placeholder="Caption (opțional)..." />
                  <button className="paBtn">Adaugă</button>
                </form>

                <div className="paList">
                  {photos.length === 0 ? (
                    <div className="muted">Nu ai poze încă.</div>
                  ) : (
                    photos.map((ph) => (
                      <div key={ph.id} className="paItem">
                        <div className="paItemTitle">{ph.caption || "Poză"}</div>
                        <div className="paItemSub">{ph.url}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="paPanel">
                <h3>📰 Update-uri</h3>
                <form className="paMiniForm" onSubmit={addUpdate}>
                  <input name="title" placeholder="Titlu update..." />
                  <input name="body" placeholder="Descriere..." />
                  <button className="paBtn">Publică</button>
                </form>

                <div className="paList">
                  {updates.length === 0 ? (
                    <div className="muted">Nu ai update-uri încă.</div>
                  ) : (
                    updates.map((u) => (
                      <div key={u.id} className="paItem">
                        <div className="paItemTitle">{u.title}</div>
                        <div className="paItemSub">{u.body}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="paPanel">
                <h3>⭐ Recenzii</h3>
                <div className="paList">
                  {reviews.length === 0 ? (
                    <div className="muted">Nu există recenzii încă.</div>
                  ) : (
                    reviews.map((r) => (
                      <div key={r.id} className="paItem">
                        <div className="paItemTitle">
                          {r.user_name} — ⭐ {r.rating}/5
                        </div>
                        <div className="paItemSub">{r.text || "—"}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
