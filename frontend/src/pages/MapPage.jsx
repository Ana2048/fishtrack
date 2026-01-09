import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getJSON } from "../api/client";
import { useNavigate } from "react-router-dom";
import MapView from "../components/MapView";
import "./MapPage.css";

export default function MapPage() {
  const nav = useNavigate();
  const { data, isLoading, error } = useQuery({
    queryKey: ["ponds"],
    queryFn: () => getJSON("/api/ponds"),
  });

  const ponds = useMemo(() => {
    return data && Array.isArray(data) ? data : [];
  }, [data]);

  // UI state
  const [q, setQ] = useState("");
  const [county, setCounty] = useState("all");
  const [maxPrice, setMaxPrice] = useState(200);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("rating"); // rating | price | name

  const counties = useMemo(() => {
    const set = new Set(ponds.map((p) => p.location).filter(Boolean));
    return ["all", ...Array.from(set).sort()];
  }, [ponds]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    let arr = ponds.filter((p) => {
      const matchQ =
        !query ||
        (p.name || "").toLowerCase().includes(query) ||
        (p.location || "").toLowerCase().includes(query) ||
        (p.rules || "").toLowerCase().includes(query);

      const matchCounty = county === "all" || p.location === county;
      const matchPrice = (p.price ?? 0) <= parseInt(maxPrice, 10);
      const matchRating = (p.rating ?? 0) >= parseFloat(minRating);

      return matchQ && matchCounty && matchPrice && matchRating;
    });

    arr.sort((a, b) => {
      if (sort === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
      if (sort === "price") return (a.price ?? 0) - (b.price ?? 0);
      return (a.name || "").localeCompare(b.name || "");
    });

    return arr;
  }, [ponds, q, county, maxPrice, minRating, sort]);

  const stats = useMemo(() => {
    const avg = filtered.length
      ? filtered.reduce((s, p) => s + (p.rating ?? 0), 0) / filtered.length
      : 0;
    const minP = filtered.length ? Math.min(...filtered.map((p) => p.price ?? 0)) : 0;
    const maxP = filtered.length ? Math.max(...filtered.map((p) => p.price ?? 0)) : 0;
    return { avg: avg.toFixed(2), minP, maxP };
  }, [filtered]);

  const markers = filtered.map((p) => ({
    id: p.id,
    name: p.name,
    location: p.location,
    lat: p.lat,
    lng: p.lng,
    rating: p.rating,
    price: p.price,
  }));

  return (
    <div className="dashPage">
      <div className="dashHeader">
        <div>
          <h1>Explorează bălțile</h1>
          <p>Filtrează, sortează și vezi detalii direct pe hartă.</p>
        </div>

        <div className="dashStats">
          <div className="stat">
            <div className="statLabel">Rezultate</div>
            <div className="statValue">{filtered.length}</div>
          </div>
          <div className="stat">
            <div className="statLabel">Rating mediu</div>
            <div className="statValue">★ {stats.avg}</div>
          </div>
          <div className="stat">
            <div className="statLabel">Preț</div>
            <div className="statValue">{stats.minP}–{stats.maxP} lei</div>
          </div>
        </div>
      </div>

      <div className="dashGrid">
        {/* MAP */}
        <div className="mapCard">
          <div className="mapTopBar">
            <div className="pill">🗺️ Hartă</div>
            <div className="muted">Click pe marker sau pe card pentru detalii</div>
          </div>

          <div className="mapWrap">
            <MapView
              markers={markers}
              onClickMarker={(m) => nav(`/pond/${m.id}`)}
            />
          </div>

          {isLoading && <div className="overlay">Se încarcă bălțile…</div>}
          {error && <div className="overlay err">Eroare: {String(error.message)}</div>}
        </div>

        {/* SIDE PANEL */}
        <aside className="sideCard">
          <div className="sideTitle">
            <div className="pill">🎣 Filtre</div>
            <button className="ghost" onClick={() => { setQ(""); setCounty("all"); setMaxPrice(200); setMinRating(0); setSort("rating"); }}>
              Reset
            </button>
          </div>

          <div className="field">
            <label>Căutare</label>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="nume, județ, reguli..." />
          </div>

          <div className="row2">
            <div className="field">
              <label>Județ</label>
              <select value={county} onChange={(e) => setCounty(e.target.value)}>
                {counties.map((c) => (
                  <option key={c} value={c}>{c === "all" ? "Toate" : c}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Sortare</label>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="rating">Rating (desc)</option>
                <option value="price">Preț (asc)</option>
                <option value="name">Nume (A-Z)</option>
              </select>
            </div>
          </div>

          <div className="row2">
            <div className="field">
              <label>Preț max: {maxPrice} lei</label>
              <input
                type="range"
                min="0"
                max="200"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
              />
            </div>

            <div className="field">
              <label>Rating min: {minRating}</label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
              />
            </div>
          </div>

          <div className="listTitle">
            <div className="pill">Lista bălților</div>
            <div className="muted">{filtered.length} rezultate</div>
          </div>

          <div className="pondList">
            {filtered.map((p) => (
              <button
                key={p.id}
                className="pondItem"
                onClick={() => nav(`/pond/${p.id}`)}
              >
                <div className="pondMain">
                  <div className="pondName">{p.name}</div>
                  <div className="pondMeta">
                    {p.location} • {p.price ?? "-"} lei • ★ {p.rating ?? "-"}
                  </div>
                </div>
                <div className="pondArrow">›</div>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
