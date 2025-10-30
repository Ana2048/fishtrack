import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dbPromise = open({
  filename: './database/fishtrack.db',
  driver: sqlite3.Database
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "FishTrack backend is running!" });
});

app.get("/api/ponds", async (req, res) => {
  const db = await dbPromise;
  const ponds = await db.all("SELECT * FROM ponds");
  res.json(ponds);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

