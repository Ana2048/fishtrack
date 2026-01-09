import express from "express";
import { requireAuth, requireRole } from "./middleware/auth.js";

export default function reportsRoutes(dbPromise) {
  const router = express.Router();

  // ====== PESAR: create report (pending) ======
  router.post("/", requireAuth, async (req, res) => {
    const {
      pondId,
      title,
      description,
      catchSpecies,
      catchWeight,
      catchCount,
      photoUrl
    } = req.body || {};

    if (!pondId || !title || !description) {
      return res.status(400).json({ error: "pondId, title, description required" });
    }

    const db = await dbPromise;
    const result = await db.run(
      `INSERT INTO reports(pond_id, user_id, title, description, catch_species, catch_weight, catch_count, photo_url, status)
       VALUES (?,?,?,?,?,?,?,?, 'pending')`,
      [
        pondId,
        req.user.id,
        title,
        description,
        catchSpecies || null,
        catchWeight ?? null,
        catchCount ?? null,
        photoUrl || null
      ]
    );

    res.status(201).json({ id: result.lastID, status: "pending" });
  });

  // ====== PUBLIC: list approved reports for pond ======
  router.get("/pond/:pondId", async (req, res) => {
    const pondId = Number(req.params.pondId);
    const db = await dbPromise;

    const rows = await db.all(
      `SELECT r.*, u.name as user_name
       FROM reports r
       JOIN users u ON u.id = r.user_id
       WHERE r.pond_id = ? AND r.status = 'approved'
       ORDER BY datetime(r.created_at) DESC`,
      [pondId]
    );

    res.json(rows);
  });

  // ====== ADMIN: list pending/rejected/approved ======
  router.get("/admin", requireAuth, requireRole("admin"), async (req, res) => {
    const status = req.query.status || "pending";
    const db = await dbPromise;

    const rows = await db.all(
      `SELECT r.*, u.name as user_name, p.name as pond_name
       FROM reports r
       JOIN users u ON u.id = r.user_id
       JOIN ponds p ON p.id = r.pond_id
       WHERE r.status = ?
       ORDER BY datetime(r.created_at) DESC`,
      [status]
    );

    res.json(rows);
  });

  // ====== ADMIN: approve/reject ======
  router.patch("/admin/:id", requireAuth, requireRole("admin"), async (req, res) => {
    const id = Number(req.params.id);
    const { status } = req.body || {};
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "status must be approved or rejected" });
    }

    const db = await dbPromise;
    await db.run(`UPDATE reports SET status = ? WHERE id = ?`, [status, id]);
    res.json({ ok: true });
  });

  return router;
}
