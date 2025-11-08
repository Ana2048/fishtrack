import sqlite3 from "sqlite3";
import { open } from "sqlite";

const run = async () => {
  const db = await open({ filename: "./database/fishtrack.db", driver: sqlite3.Database });
  await db.exec(`
    DELETE FROM ponds
    WHERE id NOT IN (
      SELECT MIN(id) FROM ponds GROUP BY name, location
    );
  `);
  const row = await db.get(`SELECT COUNT(*) as c FROM ponds`);
  console.log("Ponds left:", row.c);
  await db.close();
};
run().catch(console.error);
    