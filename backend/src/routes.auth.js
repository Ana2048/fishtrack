import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcryptjs";
import { signToken, authRequired } from "./auth.js";

const router = express.Router();
const dbPromise = open({ filename: "./database/fishtrack.db", driver: sqlite3.Database });

// register (implicit fisher)
router.post("/register/fisher", async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" });

  const db = await dbPromise;
  const exists = await db.get(`SELECT id FROM users WHERE email=?`, [email]);
  if (exists) return res.status(409).json({ error: "Email in use" });

  const hash = await bcrypt.hash(password, 10);
  const result = await db.run(
    `INSERT INTO users(name,email,password,role) VALUES (?,?,?,?)`,
    [name, email, hash, "fisher"]
  );

  const user = { id: result.lastID, name, email, role: "fisher" };
  res.status(201).json({ token: signToken(user), user });
});

router.post("/register/owner", async (req, res) => {
  const {
    name, email, password,
    pondName, pondLocation,
    companyName, companyCui, companyAddress,
    phone
  } = req.body || {};

  if (!name || !email || !password) return res.status(400).json({ error: "Missing user fields" });
  if (!pondName || !pondLocation) return res.status(400).json({ error: "Missing pond fields" });
  if (!companyName || !companyCui || !companyAddress) return res.status(400).json({ error: "Missing company fields" });

  const db = await dbPromise;
  const exists = await db.get(`SELECT id FROM users WHERE email=?`, [email]);
  if (exists) return res.status(409).json({ error: "Email in use" });

  const hash = await bcrypt.hash(password, 10);

  // 1) creează user pond_owner
  const result = await db.run(
    `INSERT INTO users(name,email,password,role) VALUES (?,?,?,?)`,
    [name, email, hash, "pond_owner"]
  );

  // 2) creează request pending cu datele firmei + baltei
  await db.run(
    `INSERT INTO owner_requests(user_id, pond_name, pond_location, company_name, company_cui, company_address, phone, status)
     VALUES (?,?,?,?,?,?,?, 'pending')`,
    [result.lastID, pondName, pondLocation, companyName, companyCui, companyAddress, phone || null]
  );

  const user = { id: result.lastID, name, email, role: "pond_owner" };
  // token îl poți da, dar în UI îl tratăm ca "în așteptare"
  res.status(201).json({ token: signToken(user), user, message: "Cerere trimisă. Cont în așteptare aprobare." });
});



// login
router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "Missing fields" });

  const db = await dbPromise;
  const user = await db.get(`SELECT id,name,email,password,role FROM users WHERE email=?`, [email]);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  res.json({ token: signToken(user), user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

// whoami
router.get("/me", authRequired, (req, res) => {
  res.json({ user: req.user });
});

export default router;
