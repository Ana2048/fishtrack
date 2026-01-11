import express from "express";
import { dbPromise } from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// toate rutele de aici cer pond_admin
router.use(requireAuth, requireRole("pond_admin"));

// 1) Listează bălțile mele
router.get("/ponds", async (req, res) => {
  const db = await dbPromise;
  const rows = await db.all(
    `SELECT * FROM ponds WHERE owner_user_id = ? ORDER BY id DESC`,
    [req.user.id]
  );
  res.json(rows);
});

// 2) Creează o baltă (pond_admin)
router.post("/ponds", async (req, res) => {
  const { name, location, price, rules, lat, lng } = req.body || {};
  if (!name || !location) {
    return res.status(400).json({ error: "name și location sunt obligatorii" });
  }

  const db = await dbPromise;

  const result = await db.run(
    `INSERT INTO ponds (name, location, price, rules, rating, lat, lng, owner_user_id)
     VALUES (?,?,?,?,?,?,?,?)`,
    [
      name,
      location,
      price ?? 0,
      rules ?? "—",
      0,
      lat ?? null,
      lng ?? null,
      req.user.id,
    ]
  );

  const pond = await db.get(`SELECT * FROM ponds WHERE id=?`, [result.lastID]);
  res.json({ ok: true, pond });
});

// 3) Update la o baltă (doar dacă e a ta)
router.patch("/ponds/:id", async (req, res) => {
  const db = await dbPromise;
  const id = Number(req.params.id);

  const existing = await db.get(
    `SELECT * FROM ponds WHERE id=? AND owner_user_id=?`,
    [id, req.user.id]
  );
  if (!existing) return res.status(404).json({ error: "Pond not found / not yours" });

  const allowed = ["name", "location", "price", "rules", "lat", "lng"];
  const updates = [];
  const values = [];

  for (const k of allowed) {
    if (req.body?.[k] !== undefined) {
      updates.push(`${k}=?`);
      values.push(req.body[k]);
    }
  }

  if (updates.length === 0) return res.json({ ok: true, pond: existing });

  values.push(id, req.user.id);

  await db.run(
    `UPDATE ponds SET ${updates.join(", ")} WHERE id=? AND owner_user_id=?`,
    values
  );

  const pond = await db.get(`SELECT * FROM ponds WHERE id=?`, [id]);
  res.json({ ok: true, pond });
});

export default router;
