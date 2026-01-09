import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// backend/database/fishtrack.db
const dbDir = path.join(__dirname, "..", "database");
const dbPath = path.join(dbDir, "fishtrack.db");

// ✅ asigură-te că folderul există
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// ✅ debug (ca să vezi exact unde scrie)
console.log("✅ DB DIR :", dbDir);
console.log("✅ DB PATH:", dbPath);

export const dbPromise = open({
  filename: dbPath,
  driver: sqlite3.Database,
});
