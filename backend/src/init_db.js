import { dbPromise } from "./db.js";
import bcrypt from "bcrypt";

const run = async () => {
  const db = await dbPromise;

  await db.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'fisher',
    created_at TEXT DEFAULT (datetime('now'))
  );

    CREATE TABLE IF NOT EXISTS ponds (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      price REAL,
      rules TEXT,
      rating REAL DEFAULT 0,
      lat REAL,
      lng REAL,
      owner_user_id INTEGER,
      FOREIGN KEY(owner_user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS pond_photos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pond_id INTEGER NOT NULL,
      url TEXT NOT NULL,
      caption TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY(pond_id) REFERENCES ponds(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS pond_updates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pond_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY(pond_id) REFERENCES ponds(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pond_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
      text TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY(pond_id) REFERENCES ponds(id) ON DELETE CASCADE,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pond_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      title TEXT,
      species TEXT,
      weight REAL,
      notes TEXT,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY(pond_id) REFERENCES ponds(id) ON DELETE CASCADE,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
        CREATE TABLE IF NOT EXISTS pond_admin_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      pond_name TEXT NOT NULL,
      pond_location TEXT NOT NULL,
      company_name TEXT,
      company_cui TEXT,
      company_address TEXT,
      phone TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);

  // seed users dacă nu există
  const u = await db.get(`SELECT COUNT(*) as c FROM users`);
  if (u.c === 0) {
    const adminPass = await bcrypt.hash("admin123", 10);
    const fisherPass = await bcrypt.hash("pescar123", 10);
    const pondAdminPass = await bcrypt.hash("pond123", 10);

    await db.run(
      `INSERT INTO users(name,email,password_hash,role) VALUES (?,?,?,?)`,
      ["Admin Demo", "admin@fishtrack.local", adminPass, "admin"]
    );
    await db.run(
      `INSERT INTO users(name,email,password_hash,role) VALUES (?,?,?,?)`,
      ["Pescar Demo", "pescar@fishtrack.local", fisherPass, "fisher"]
    );
    await db.run(
      `INSERT INTO users(name,email,password_hash,role) VALUES (?,?,?,?)`,
      ["Pond Admin Demo", "pond@fishtrack.local", pondAdminPass, "pond_admin"]
    );
  }

  // seed ponds dacă nu există
  const p = await db.get(`SELECT COUNT(*) as c FROM ponds`);
  if (p.c === 0) {
    await db.run(
      `INSERT INTO ponds (name, location, price, rules, rating, lat, lng) VALUES (?,?,?,?,?,?,?)`,
      ["Balta Verde", "Cluj", 70, "Catch & Release", 4.5, 46.77, 23.59]
    );
    await db.run(
      `INSERT INTO ponds (name, location, price, rules, rating, lat, lng) VALUES (?,?,?,?,?,?,?)`,
      ["Lacul Albastru", "Bihor", 50, "Max 3 undițe", 4.1, 47.05, 22.34]
    );
  }

  console.log("✅ DB inițializată (fără duplicate).");
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
