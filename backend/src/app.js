import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import authRoutes from "./routes.auth.js";
import { authRequired } from "./auth.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

const dbPromise = open({ filename: "./database/fishtrack.db", driver: sqlite3.Database });

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "FishTrack backend is running!" });
});

app.get("/api/profile", authRequired, async (req, res) => {
  res.json({ user: req.user });
});

// listă bălți + filtru simplu ?county=Cluj
app.get("/api/ponds", async (req, res) => {
  const db = await dbPromise;
  const { county } = req.query;
  const sql = county ? "SELECT * FROM ponds WHERE location = ?" : "SELECT * FROM ponds";
  const rows = county ? await db.all(sql, [county]) : await db.all(sql);
  res.json(rows);
});

// detalii baltă
app.get("/api/ponds/:id", async (req, res) => {
  const db = await dbPromise;
  const row = await db.get("SELECT * FROM ponds WHERE id = ?", [req.params.id]);
  if (!row) return res.status(404).json({ error: "Not found" });
  res.json(row);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
