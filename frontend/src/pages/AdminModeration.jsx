import { useQuery } from "@tanstack/react-query";
import { getJSON, patchJSON } from "../api/client";
import { useState } from "react";

const css = {
  page: { minHeight: "100vh", padding: 18, background: "#0b1220", color: "#e5e7eb" },
  wrap: { maxWidth: 1100, margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "flex-end" },
  h: { margin: 0, fontSize: 24, fontWeight: 900 },
  p: { margin: "6px 0 0", color: "#94a3b8", fontSize: 13 },
  card: { marginTop: 12, border: "1px solid #1f2937", borderRadius: 18, background: "linear-gradient(180deg,#0d1527,#0b1220)", overflow: "hidden" },
  row: { display: "grid", gridTemplateColumns: "1.3fr 1fr 0.6fr 0.6fr", gap: 10, padding: 12, borderBottom: "1px solid #1f2937", alignItems: "center" },
  head: { background: "rgba(14,23,48,.6)", fontWeight: 900 },
  badge: (s) => ({
    display: "inline-flex",
    padding: "6px 10px",
    borderRadius: 999,
    fontWeight: 900,
    fontSize: 12,
    border: "1px solid #1f2937",
    background:
      s === "pending" ? "rgba(245,158,11,.15)" :
      s === "approved" ? "rgba(34,197,94,.15)" :
      "rgba(248,113,113,.15)",
    color:
      s === "pending" ? "#fbbf24" :
      s === "approved" ? "#86efac" :
      "#fca5a5"
  }),
  btn: (type) => ({
    padding: "8px 12px",
    borderRadius: 12,
    border: "none",
    fontWeight: 900,
    cursor: "pointer",
    background: type === "ok" ? "linear-gradient(135deg,#22c55e,#a3e635)" : "linear-gradient(135deg,#ef4444,#fb7185)",
    color: "#071225"
  }),
  select: { padding: "8px 10px", borderRadius: 12, border: "1px solid #1f2937", background: "#0e1730", color: "#e5e7eb", fontWeight: 800 }
};

export default function AdminModeration() {
  const [status, setStatus] = useState("pending");

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["adminReports", status],
    queryFn: () => getJSON(`/api/reports/admin?status=${status}`)
  });

  const rows = data || [];

  async function setReport(id, newStatus) {
    await patchJSON(`/api/reports/admin/${id}`, { status: newStatus });
    await refetch();
  }

  return (
    <div style={css.page}>
      <div style={css.wrap}>
        <div style={css.header}>
          <div>
            <h2 style={css.h}>Admin FishTrack — Moderare rapoarte</h2>
            <p style={css.p}>Aprobă sau respinge rapoarte trimise de pescari.</p>
          </div>

          <div>
            <select style={css.select} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div style={css.card}>
          <div style={{ ...css.row, ...css.head }}>
            <div>Raport</div>
            <div>Baltă / Utilizator</div>
            <div>Status</div>
            <div>Acțiuni</div>
          </div>

          {isLoading && <div style={{ padding: 12, color: "#94a3b8" }}>Se încarcă…</div>}

          {rows.map((r) => (
            <div key={r.id} style={css.row}>
              <div>
                <div style={{ fontWeight: 900 }}>{r.title}</div>
                <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 4 }}>
                  {r.description.slice(0, 90)}{r.description.length > 90 ? "…" : ""}
                </div>
              </div>

              <div>
                <div style={{ fontWeight: 900 }}>{r.pond_name}</div>
                <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 4 }}>
                  de {r.user_name}
                </div>
              </div>

              <div>
                <span style={css.badge(r.status)}>{r.status}</span>
              </div>

              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                {status === "pending" ? (
                  <>
                    <button style={css.btn("ok")} onClick={() => setReport(r.id, "approved")}>Approve</button>
                    <button style={css.btn("no")} onClick={() => setReport(r.id, "rejected")}>Reject</button>
                  </>
                ) : (
                  <div style={{ color: "#94a3b8", fontSize: 12 }}>—</div>
                )}
              </div>
            </div>
          ))}

          {!isLoading && rows.length === 0 && (
            <div style={{ padding: 12, color: "#94a3b8" }}>Nu există rapoarte pentru acest status.</div>
          )}
        </div>
      </div>
    </div>
  );
}
