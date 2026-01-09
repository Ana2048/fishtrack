import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcryptjs";

const dbFile = "./database/fishtrack.db";

async function run() {
  const db = await open({ filename: dbFile, driver: sqlite3.Database });

  // --- ponds ---
  await db.exec(`
    CREATE TABLE IF NOT EXISTS ponds (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      price REAL,
      rules TEXT,
      rating REAL,
      lat REAL,
      lng REAL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS ux_ponds_name_loc ON ponds(name, location);
  `);

  // --- users ---
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin','fisher')) DEFAULT 'fisher'
    );
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  `);

  // --- seed admin + fisher (idempotent) ---
  const adminHash = await bcrypt.hash("admin123", 10);
  await db.run(
    `INSERT OR IGNORE INTO users(name,email,password,role) VALUES (?,?,?,?)`,
    ["Admin", "admin@fishtrack.local", adminHash, "admin"]
  );

  const fisherHash = await bcrypt.hash("pescar123", 10);
  await db.run(
    `INSERT OR IGNORE INTO users(name,email,password,role) VALUES (?,?,?,?)`,
    ["Pescar Demo", "pescar@fishtrack.local", fisherHash, "fisher"]
  );

  // --- seed ponds (idempotent) ---
  await db.exec(`
    INSERT OR IGNORE INTO ponds (name, location, price, rules, rating, lat, lng) VALUES
    ('Balta Verde', 'Cluj', 70, 'Catch & Release', 4.5, 46.77, 23.59),
    ('Lacul Albastru', 'Bihor', 50, 'Max 3 undițe', 4.1, 47.05, 22.34),
    ('Lacul Căprioarelor', 'Cluj', 60, 'Catch & Release', 4.3, 46.58, 23.78);
  `);

  console.log("✅ DB ready. Users: admin@fishtrack.local/admin123, pescar@fishtrack.local/pescar123");
  await db.close();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
