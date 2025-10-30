import sqlite3 from "sqlite3";
import { open } from "sqlite";

const dbFile = "./database/fishtrack.db";

const run = async () => {
  const db = await open({ filename: dbFile, driver: sqlite3.Database });

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
  `);

  // date demo
  await db.exec(`
    INSERT INTO ponds (name, location, price, rules, rating, lat, lng) VALUES
    ('Balta Verde', 'Cluj', 70, 'Catch & Release', 4.5, 46.77, 23.59),
    ('Lacul Albastru', 'Bihor', 50, 'Max 3 undițe', 4.1, 47.05, 22.34);
  `);

  console.log("✅ DB inițializată și populată.");
  await db.close();
};

run().catch(e => {
  console.error(e);
  process.exit(1);
});
