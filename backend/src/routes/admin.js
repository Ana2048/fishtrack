import express from "express";
import { dbPromise } from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// tot ce e aici e doar pentru admin FishTrack
router.use(requireAuth, requireRole("admin"));

/**
 * GET /api/admin/requests
 * listează cererile de pond_admin (pending by default, poți trimite ?status=approved etc)
 */
router.get("/requests", async (req, res) => {
  try {
    const db = await dbPromise;
    const status = req.query.status || "pending";

    const rows = await db.all(
      `
      SELECT r.*,
             u.name as user_name,
             u.email as user_email
      FROM pond_admin_requests r
      JOIN users u ON u.id = r.user_id
      WHERE r.status = ?
      ORDER BY r.created_at DESC
      `,
      [status]
    );

    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * PATCH /api/admin/requests/:id/approve
 * aprobă cererea + creează automat baltă + leagă owner_user_id
 */
router.patch("/requests/:id/approve", async (req, res) => {
  const requestId = Number(req.params.id);

  try {
    const db = await dbPromise;

    const r = await db.get(`SELECT * FROM pond_admin_requests WHERE id = ?`, [
      requestId,
    ]);
    if (!r) return res.status(404).json({ error: "Request not found" });
    if (r.status !== "pending")
      return res.status(400).json({ error: "Request already processed" });

    // tranzacție simplă
    await db.exec("BEGIN");

    // 1) request approved
    await db.run(`UPDATE pond_admin_requests SET status='approved' WHERE id=?`, [
      requestId,
    ]);

    // 2) user devine pond_admin
    await db.run(`UPDATE users SET role='pond_admin' WHERE id=?`, [r.user_id]);

    // 3) creează baltă dacă nu există (după name+location)
    let pond = await db.get(
      `SELECT * FROM ponds WHERE name=? AND location=?`,
      [r.pond_name, r.pond_location]
    );

    if (!pond) {
      const ins = await db.run(
        `INSERT INTO ponds (name, location, price, rules, rating, lat, lng, owner_user_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          r.pond_name,
          r.pond_location,
          null, // price
          "",   // rules
          0,    // rating
          null, // lat
          null, // lng
          r.user_id,
        ]
      );
      pond = await db.get(`SELECT * FROM ponds WHERE id=?`, [ins.lastID]);
    } else {
      // 4) dacă există, o legăm de user (îi “preluăm” ownership-ul)
      await db.run(`UPDATE ponds SET owner_user_id=? WHERE id=?`, [
        r.user_id,
        pond.id,
      ]);
      pond = await db.get(`SELECT * FROM ponds WHERE id=?`, [pond.id]);
    }

    await db.exec("COMMIT");

    res.json({
      ok: true,
      message: "Cerere aprobată. Balta a fost creată/asignată.",
      pond,
    });
  } catch (e) {
    try {
      const db = await dbPromise;
      await db.exec("ROLLBACK");
    } catch {}
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * PATCH /api/admin/requests/:id/reject
 * respinge cererea (user rămâne fisher)
 */
router.patch("/requests/:id/reject", async (req, res) => {
  const requestId = Number(req.params.id);

  try {
    const db = await dbPromise;

    const r = await db.get(`SELECT * FROM pond_admin_requests WHERE id = ?`, [
      requestId,
    ]);
    if (!r) return res.status(404).json({ error: "Request not found" });
    if (r.status !== "pending")
      return res.status(400).json({ error: "Request already processed" });

    await db.run(`UPDATE pond_admin_requests SET status='rejected' WHERE id=?`, [
      requestId,
    ]);

    res.json({ ok: true, message: "Cerere respinsă." });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
