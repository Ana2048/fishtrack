import express from "express";
import { dbPromise } from "../db.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET /api/reports?pondId=1
 * Public (doar approved)
 */
router.get("/", async (req, res) => {
  try {
    const { pondId } = req.query;
    const db = await dbPromise;

    if (!pondId) {
      return res.json([]); // IMPORTANT: răspuns mereu
    }

    const rows = await db.all(
      `
      SELECT r.*, u.name as user_name
      FROM reports r
      JOIN users u ON u.id = r.user_id
      WHERE r.pond_id = ?
        AND r.status = 'approved'
      ORDER BY r.created_at DESC
      `,
      [pondId]
    );

    res.json(rows); // 🔴 FĂRĂ ASTA rămâne pending
  } catch (e) {
    console.error("GET /reports error:", e);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * POST /api/reports
 * Doar pescari
 */
router.post("/", authRequired, async (req, res) => {
  try {
    const { pond_id, title, species, weight, notes } = req.body;
    const userId = req.user.id;

    const db = await dbPromise;

    await db.run(
      `
      INSERT INTO reports
        (pond_id, user_id, title, species, weight, notes)
      VALUES (?,?,?,?,?,?)
      `,
      [pond_id, userId, title, species, weight, notes]
    );

    res.json({ ok: true });
  } catch (e) {
    console.error("POST /reports error:", e);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
