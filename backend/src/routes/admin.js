import express from "express";
import { dbPromise } from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.use(requireAuth, requireRole("admin"));

// LIST pending
router.get("/requests", async (req, res) => {
  const db = await dbPromise;
  const rows = await db.all(`
    SELECT r.*, u.name as user_name, u.email as user_email
    FROM pond_admin_requests r
    JOIN users u ON u.id = r.user_id
    WHERE r.status = 'pending'
    ORDER BY r.created_at DESC
  `);
  res.json(rows);
});

// APPROVE (exact: /api/admin/requests/:id/approve)
router.patch("/requests/:id/approve", async (req, res) => {
  const db = await dbPromise;

  const reqRow = await db.get(
    `SELECT * FROM pond_admin_requests WHERE id = ?`,
    [req.params.id]
  );
  if (!reqRow) return res.status(404).json({ error: "Request not found" });

  await db.run(`UPDATE pond_admin_requests SET status='approved' WHERE id=?`, [
    req.params.id,
  ]);
  await db.run(`UPDATE users SET role='pond_admin' WHERE id=?`, [
    reqRow.user_id,
  ]);

  res.json({ ok: true });
});

// REJECT (exact: /api/admin/requests/:id/reject)
router.patch("/requests/:id/reject", async (req, res) => {
  const db = await dbPromise;

  const reqRow = await db.get(
    `SELECT * FROM pond_admin_requests WHERE id = ?`,
    [req.params.id]
  );
  if (!reqRow) return res.status(404).json({ error: "Request not found" });

  await db.run(`UPDATE pond_admin_requests SET status='rejected' WHERE id=?`, [
    req.params.id,
  ]);

  res.json({ ok: true });
});

export default router;
