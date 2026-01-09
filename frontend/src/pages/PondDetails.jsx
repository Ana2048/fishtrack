import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./PondDetails.css";

function getAuth() {
  try {
    const raw = localStorage.getItem("ft_auth"); 
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    const user = parsed.user || parsed;

    return { token: parsed.token, user };
  } catch {
    return null;
  }
}


export default function PondDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pond, setPond] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

 const auth = getAuth();       // recitește la fiecare render
const isLoggedIn = !!auth?.token;
const role = auth?.user?.role;

const canAddReport =
  isLoggedIn &&
  ["fisher", "pescar", "user", "fisherman"].includes(
    String(role || "").toLowerCase()
  );


  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/api/ponds/${id}`);
        if (!res.ok) throw new Error("Failed to load pond");
        const data = await res.json();

        let rep = [];
        try {
          const r = await fetch(`http://localhost:3000/api/reports?pondId=${id}`);
          if (r.ok) rep = await r.json();
        } catch {
          rep = [];
        }

        if (alive) {
          setPond(data);
          setReports(rep);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="pdWrap">
        <div className="pdShell">
          <div className="pdTopRow">
            <button className="pdBack" onClick={() => navigate(-1)}>
              ← Înapoi
            </button>
          </div>

          <div className="pdSkeleton">
            <div className="skTitle" />
            <div className="skLine" />
            <div className="skLine short" />
            <div className="skCards">
              <div className="skCard" />
              <div className="skCard" />
              <div className="skCard" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!pond) {
    return (
      <div className="pdWrap">
        <div className="pdShell">
          <button className="pdBack" onClick={() => navigate(-1)}>
            ← Înapoi
          </button>
          <div className="pdEmpty">Nu am găsit balta.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="pdWrap">
      <div className="pdShell">
        <div className="pdTopRow">
          <button className="pdBack" onClick={() => navigate(-1)}>
            ← Înapoi
          </button>

          <div className="pdActions">
            <Link className="pdBtn ghost" to="/map">
              Harta
            </Link>

            {canAddReport ? (
              <Link className="pdBtn primary" to={`/pond/${pond.id}/report`}>
                + Adaugă raport
              </Link>
            ) : (
              <button
                className="pdBtn disabled"
                title={
                  !isLoggedIn
                    ? "Trebuie să fii logat ca pescar"
                    : `Rolul tău este "${role}". Doar pescarii pot adăuga rapoarte.`
                }
                onClick={() => {
                  if (!isLoggedIn) navigate("/login");
                }}
              >
                + Adaugă raport
              </button>
            )}
          </div>
        </div>

        {/* HERO CARD */}
        <div className="pdHero">
          <div className="pdHeroLeft">
            <div className="pdTitleRow">
              <h1 className="pdTitle">{pond.name}</h1>
              <span className="pdBadge">{pond.location}</span>
            </div>

            <div className="pdMeta">
              <div className="pdChip">💰 {pond.price} lei / zi</div>
              <div className="pdChip">⭐ {pond.rating ?? "—"}</div>
              <div className="pdChip">
                📍 {pond.lat}, {pond.lng}
              </div>
            </div>

            <div className="pdRules">
              <div className="pdSectionTitle">Reguli</div>
              <div className="pdRulesBox">{pond.rules || "—"}</div>
            </div>

            <div className="pdHint">
              Tip: apasă „Adaugă raport” ca să trimiți o captură (va fi moderată de admin).
            </div>
          </div>

          <div className="pdHeroRight">
            <div className="pdInfoCard">
              <div className="pdInfoTitle">Informații rapide</div>
              <ul>
                <li>✅ Status rapoarte: pending → approved</li>
                <li>✅ Filtrare pe hartă după județ/preț/rating</li>
                <li>✅ Admin poate modera rapoarte</li>
              </ul>
              <div className="pdInfoFooter">
                {isLoggedIn ? (
                  <span>
                    Conectat ca: <b>{role}</b>
                  </span>
                ) : (
                  <span>Nu ești logat.</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* REPORTS */}
        <div className="pdReports">
          <div className="pdSectionHead">
            <h2>Rapoarte ({reports.length})</h2>
            <p>Rapoartele apar după aprobare (depinde de endpointul tău backend).</p>
          </div>

          {reports.length === 0 ? (
            <div className="pdEmptyBox">
              <div className="pdEmptyTitle">Nu există rapoarte încă.</div>
              <div className="pdEmptyText">
                Fii primul care adaugă un raport pentru această baltă.
              </div>

              {canAddReport && (
                <Link className="pdBtn primary" to={`/pond/${pond.id}/report`}>
                  + Adaugă raport
                </Link>
              )}
            </div>
          ) : (
            <div className="pdGrid">
              {reports.map((r) => (
                <div key={r.id} className="pdReportCard">
                  <div className="pdReportTop">
                    <div className="pdReportTitle">{r.title || "Raport"}</div>
                    <span className={`pdStatus ${r.status || "pending"}`}>
                      {r.status || "pending"}
                    </span>
                  </div>

                  <div className="pdReportText">{r.description || r.notes || "—"}</div>

                  <div className="pdReportMeta">
                    <span>🎣 {r.species || "—"}</span>
                    <span>⚖️ {r.weight ? `${r.weight} kg` : "—"}</span>
                    <span>
                      📅 {r.created_at ? new Date(r.created_at).toLocaleDateString() : "—"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
