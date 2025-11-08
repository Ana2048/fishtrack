import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcryptjs";

const dbFile = "./database/fishtrack.db";

const run = async () => {
  const db = await open({ filename: dbFile, driver: sqlite3.Database });

  // === TABEL BĂLȚI ===
  await db.exec(`
    CREATE TABLE IF NOT EXISTS ponds (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      location TEXT,
      price REAL,
      rules TEXT,
      rating REAL,
      lat REAL,
      lng REAL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS ux_ponds_name_loc ON ponds(name, location);
  `);
  // === TABEL UTILIZATORI ===
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user'
    );
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  `);

  // === SEED UTILIZATOR ADMIN ===
  const u = await db.get(`SELECT COUNT(*) as c FROM users`);
  if (u.c === 0) {
    const hash = await bcrypt.hash("admin123", 10);
    await db.run(
      `INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)`,
      ["Admin", "admin@fishtrack.local", hash, "admin"]
    );
    console.log("🌱 Utilizator admin creat: admin@fishtrack.local / admin123");
  }

  // === SEED BĂLȚI DEMO ===
  const p = await db.get(`SELECT COUNT(*) as c FROM ponds`);
  if (p.c === 0) {
      await db.exec(`
    INSERT OR IGNORE INTO ponds (name, location, price, rules, rating, lat, lng) VALUES
    ('Balta Verde', 'Cluj', 70, 'Catch & Release', 4.5, 46.77, 23.59),
    ('Lacul Albastru', 'Bihor', 50, 'Max 3 undițe', 4.1, 47.05, 22.34),
    ('Lacul Căprioarelor', 'Cluj', 60, 'Catch & Release', 4.3, 46.58, 23.78);
  `);
    console.log("🌱 Bălți demo create.");
  }

  await db.close();
  console.log("✅ DB inițializată și populată.");
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
