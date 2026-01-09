import express from "express";
import { dbPromise } from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// My ponds
router.get("/my/ponds", requireAuth, requireRole("pond_admin"), async (req, res) => {
  const db = await dbPromise;
  const rows = await db.all(`SELECT * FROM ponds WHERE owner_user_id=? ORDER BY id DESC`, [req.user.id]);
  res.json(rows);
});

// Create pond (owner creates)
router.post("/my/ponds", requireAuth, requireRole("pond_admin"), async (req, res) => {
  const { name, location, price, rules, lat, lng } = req.body;
  if (!name || !location) return res.status(400).json({ error: "Missing fields" });

  const db = await dbPromise;
  const result = await db.run(
    `INSERT INTO ponds(name,location,price,rules,lat,lng,owner_user_id) VALUES (?,?,?,?,?,?,?)`,
    [name, location, price ?? null, rules ?? "", lat ?? null, lng ?? null, req.user.id]
  );

  const pond = await db.get(`SELECT * FROM ponds WHERE id=?`, [result.lastID]);
  res.json(pond);
});

// Update pond (only own)
router.put("/my/ponds/:id", requireAuth, requireRole("pond_admin"), async (req, res) => {
  const pondId = Number(req.params.id);
  const db = await dbPromise;

  const pond = await db.get(`SELECT * FROM ponds WHERE id=?`, [pondId]);
  if (!pond) return res.status(404).json({ error: "Not found" });
  if (pond.owner_user_id !== req.user.id) return res.status(403).json({ error: "Not your pond" });

  const { name, location, price, rules, lat, lng } = req.body;

  await db.run(
    `UPDATE ponds SET name=?, location=?, price=?, rules=?, lat=?, lng=? WHERE id=?`,
    [
      name ?? pond.name,
      location ?? pond.location,
      price ?? pond.price,
      rules ?? pond.rules,
      lat ?? pond.lat,
      lng ?? pond.lng,
      pondId
    ]
  );

  const updated = await db.get(`SELECT * FROM ponds WHERE id=?`, [pondId]);
  res.json(updated);
});

// Photos: list
router.get("/my/ponds/:id/photos", requireAuth, requireRole("pond_admin"), async (req, res) => {
  const pondId = Number(req.params.id);
  const db = await dbPromise;
  const pond = await db.get(`SELECT * FROM ponds WHERE id=?`, [pondId]);
  if (!pond) return res.status(404).json({ error: "Not found" });
  if (pond.owner_user_id !== req.user.id) return res.status(403).json({ error: "Not your pond" });

  const photos = await db.all(`SELECT * FROM pond_photos WHERE pond_id=? ORDER BY id DESC`, [pondId]);
  res.json(photos);
});

// Photos: add (url)
router.post("/my/ponds/:id/photos", requireAuth, requireRole("pond_admin"), async (req, res) => {
  const pondId = Number(req.params.id);
  const { url, caption } = req.body;
  if (!url) return res.status(400).json({ error: "Missing url" });

  const db = await dbPromise;
  const pond = await db.get(`SELECT * FROM ponds WHERE id=?`, [pondId]);
  if (!pond) return res.status(404).json({ error: "Not found" });
  if (pond.owner_user_id !== req.user.id) return res.status(403).json({ error: "Not your pond" });

  const result = await db.run(
    `INSERT INTO pond_photos(pond_id,url,caption) VALUES (?,?,?)`,
    [pondId, url, caption ?? ""]
  );

  const photo = await db.get(`SELECT * FROM pond_photos WHERE id=?`, [result.lastID]);
  res.json(photo);
});

// Updates: list
router.get("/my/ponds/:id/updates", requireAuth, requireRole("pond_admin"), async (req, res) => {
  const pondId = Number(req.params.id);
  const db = await dbPromise;
  const pond = await db.get(`SELECT * FROM ponds WHERE id=?`, [pondId]);
  if (!pond) return res.status(404).json({ error: "Not found" });
  if (pond.owner_user_id !== req.user.id) return res.status(403).json({ error: "Not your pond" });

  const updates = await db.all(`SELECT * FROM pond_updates WHERE pond_id=? ORDER BY id DESC`, [pondId]);
  res.json(updates);
});

// Updates: add
router.post("/my/ponds/:id/updates", requireAuth, requireRole("pond_admin"), async (req, res) => {
  const pondId = Number(req.params.id);
  const { title, body } = req.body;
  if (!title || !body) return res.status(400).json({ error: "Missing fields" });

  const db = await dbPromise;
  const pond = await db.get(`SELECT * FROM ponds WHERE id=?`, [pondId]);
  if (!pond) return res.status(404).json({ error: "Not found" });
  if (pond.owner_user_id !== req.user.id) return res.status(403).json({ error: "Not your pond" });

  const result = await db.run(
    `INSERT INTO pond_updates(pond_id,title,body) VALUES (?,?,?)`,
    [pondId, title, body]
  );

  const update = await db.get(`SELECT * FROM pond_updates WHERE id=?`, [result.lastID]);
  res.json(update);
});

// Reviews for my pond
router.get("/my/ponds/:id/reviews", requireAuth, requireRole("pond_admin"), async (req, res) => {
  const pondId = Number(req.params.id);
  const db = await dbPromise;
  const pond = await db.get(`SELECT * FROM ponds WHERE id=?`, [pondId]);
  if (!pond) return res.status(404).json({ error: "Not found" });
  if (pond.owner_user_id !== req.user.id) return res.status(403).json({ error: "Not your pond" });

  const reviews = await db.all(
    `SELECT r.*, u.name as user_name
     FROM reviews r JOIN users u ON u.id=r.user_id
     WHERE r.pond_id=?
     ORDER BY r.id DESC`,
    [pondId]
  );
  res.json(reviews);
});

export default router;
