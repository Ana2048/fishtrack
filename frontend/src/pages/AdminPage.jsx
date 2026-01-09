import { useEffect, useState } from "react";
import { getJSON, patchJSON } from "../api/client";
//import "./AdminPage.css";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await getJSON("/api/admin/requests"); // ✅ token included
      setRequests(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(String(e.message || e));
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function approve(id) {
    try {
      await patchJSON(`/api/admin/requests/${id}/approve`, {});
      await load();
    } catch (e) {
      alert("Eroare la approve: " + (e.message || e));
    }
  }

  async function reject(id) {
    try {
      await patchJSON(`/api/admin/requests/${id}/reject`, {});
      await load();
    } catch (e) {
      alert("Eroare la reject: " + (e.message || e));
    }
  }

  return (
    <div style={{ padding: 24, color: "#e5e7eb" }}>
      <h1 style={{ marginTop: 0 }}>Admin FishTrack — Cereri administratori bălți</h1>

      {loading && <div>Se încarcă...</div>}

      {!loading && error && (
        <div style={{ color: "#f87171", whiteSpace: "pre-wrap" }}>
          Eroare: {error}
        </div>
      )}

      {!loading && !error && requests.length === 0 && <div>Nu există cereri.</div>}

      {!loading && !error && requests.length > 0 && (
        <div style={{ display: "grid", gap: 12, maxWidth: 900 }}>
          {requests.map((r) => (
            <div
              key={r.id}
              style={{
                border: "1px solid #1f2937",
                borderRadius: 14,
                padding: 14,
                background: "linear-gradient(180deg,#0e1730,#0b1220)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 900, fontSize: 16 }}>
                    {r.pond_name} — {r.pond_location}
                  </div>
                  <div style={{ color: "#94a3b8", fontSize: 13 }}>
                    Firmă: {r.company_name || "—"} | CUI: {r.company_cui || "—"} | Telefon:{" "}
                    {r.phone || "—"}
                  </div>
                  <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 6 }}>
                    Status: <b>{r.status}</b> | Creat: {r.created_at}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <button
                    onClick={() => approve(r.id)}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 12,
                      border: "none",
                      fontWeight: 800,
                      cursor: "pointer",
                      background: "linear-gradient(135deg,#3b82f6,#22c55e)",
                      color: "#071225",
                    }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => reject(r.id)}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 12,
                      border: "1px solid #334155",
                      fontWeight: 800,
                      cursor: "pointer",
                      background: "#0c1528",
                      color: "#e5e7eb",
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
