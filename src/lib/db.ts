import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;

  const dataDir = path.join(process.cwd(), "data");
  fs.mkdirSync(dataDir, { recursive: true });

  db = new Database(path.join(dataDir, "leaderboard.db"));

  db.pragma("journal_mode = WAL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS leaderboard (
      id TEXT PRIMARY KEY,
      code_snippet TEXT NOT NULL,
      language TEXT NOT NULL,
      persona_name TEXT NOT NULL,
      persona_icon TEXT NOT NULL,
      roast_highlight TEXT NOT NULL,
      score INTEGER NOT NULL,
      timestamp INTEGER NOT NULL
    )
  `);

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_leaderboard_timestamp
    ON leaderboard (timestamp DESC)
  `);

  return db;
}
