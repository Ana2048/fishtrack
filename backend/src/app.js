import "dotenv/config";   // ✅ încarcă .env înainte de restul importurilor

import express from "express";
import cors from "cors";

import authRoutes from "./routes.auth.js";
import adminRoutes from "./routes/admin.js";
import pondAdminRoutes from "./routes/routes_pond_admin.js";
import reportsRoutes from "./routes/routes.reports.js";

import { dbPromise } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/pond-admin", pondAdminRoutes);
app.use("/api/reports", reportsRoutes);

// ponds
app.get("/api/ponds", async (req, res) => {
  const db = await dbPromise;
  const ponds = await db.all("SELECT * FROM ponds");
  res.json(ponds);
});

app.get("/api/ponds/:id", async (req, res) => {
  const db = await dbPromise;
  const pond = await db.get("SELECT * FROM ponds WHERE id = ?", [req.params.id]);
  if (!pond) return res.status(404).json({ error: "Pond not found" });
  res.json(pond);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

