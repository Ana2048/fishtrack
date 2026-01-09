import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { dbPromise } from "./db.js";

const router = express.Router();

router.post("/register/fisher", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" });

  const db = await dbPromise;
  const exists = await db.get(`SELECT id FROM users WHERE email=?`, [email]);
  if (exists) return res.status(409).json({ error: "Email already used" });

  const password_hash = await bcrypt.hash(password, 10);

  const result = await db.run(
    `INSERT INTO users(name,email,password_hash,role) VALUES (?,?,?,?)`,
    [name, email, password_hash, "fisher"]
  );

  const payload = { id: result.lastID, email, role: "fisher", name };
  const token = jwt.sign(payload, process.env.JWT_SECRET || "dev_secret", { expiresIn: "7d" });

  res.json({ token, user: payload });
});

router.post("/register/owner", async (req, res) => {
  const {
    name, email, password,
    pondName, pondLocation,
    companyName, companyCui, companyAddress,
    phone
  } = req.body;

  if (!name || !email || !password || !pondName || !pondLocation) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const db = await dbPromise;
  const exists = await db.get(`SELECT id FROM users WHERE email=?`, [email]);
  if (exists) return res.status(409).json({ error: "Email already used" });

  const password_hash = await bcrypt.hash(password, 10);

  // user pending
  const userInsert = await db.run(
    `INSERT INTO users(name,email,password_hash,role) VALUES (?,?,?,?)`,
    [name, email, password_hash, "pond_admin_pending"]
  );

  const userId = userInsert.lastID;

  // request row
  await db.run(
    `INSERT INTO pond_admin_requests
      (user_id, pond_name, pond_location, company_name, company_cui, company_address, phone, status)
     VALUES (?,?,?,?,?,?,?,?)`,
    [
      userId,
      pondName,
      pondLocation,
      companyName || null,
      companyCui || null,
      companyAddress || null,
      phone || null,
      "pending"
    ]
  );

  const payload = { id: userId, email, role: "pond_admin_pending", name };
  const token = jwt.sign(payload, process.env.JWT_SECRET || "dev_secret", { expiresIn: "7d" });

  res.json({
    token,
    user: payload,
    message: "Cerere trimisă. Așteaptă aprobarea Admin FishTrack."
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const db = await dbPromise;
  const user = await db.get(`SELECT * FROM users WHERE email=?`, [email]);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const payload = { id: user.id, email: user.email, role: user.role, name: user.name };
  const token = jwt.sign(payload, process.env.JWT_SECRET || "dev_secret", { expiresIn: "7d" });

  res.json({ token, user: payload });
});

export default router;
