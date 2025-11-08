import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcryptjs";
import { signToken } from "./auth.js";

const router = express.Router();
const dbPromise = open({ filename: "./database/fishtrack.db", driver: sqlite3.Database });

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" });
  const db = await dbPromise;
  const exists = await db.get(`SELECT id FROM users WHERE email=?`, [email]);
  if (exists) return res.status(409).json({ error: "Email in use" });
  const hash = await bcrypt.hash(password, 10);
  const { lastID } = await db.run(
    `INSERT INTO users(name,email,password) VALUES (?,?,?)`,
    [name, email, hash]
  );
  const token = signToken({ id: lastID, email, role: "user" });
  res.status(201).json({ token });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "Missing fields" });
  const db = await dbPromise;
  const user = await db.get(`SELECT * FROM users WHERE email=?`, [email]);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });
  const token = signToken({ id: user.id, email: user.email, role: user.role });
  res.json({ token });
});

export default router;
