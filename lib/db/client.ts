import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { SCHEMA } from "./schema";

const DB_PATH = process.env.DATABASE_PATH
  ? path.resolve(process.env.DATABASE_PATH)
  : path.resolve("./data/adelina.db");

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;

  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  _db = new Database(DB_PATH);
  _db.pragma("journal_mode = WAL");
  _db.pragma("foreign_keys = ON");

  _db.exec(SCHEMA);

  // Migrations — safe to run on existing databases
  const migrations = [
    "ALTER TABLE trivia_questions ADD COLUMN is_adelina_specific INTEGER NOT NULL DEFAULT 0",
    "ALTER TABLE trivia_questions ADD COLUMN tags TEXT NOT NULL DEFAULT ''",
    "ALTER TABLE media_items ADD COLUMN tags TEXT NOT NULL DEFAULT ''",
    "ALTER TABLE media_items ADD COLUMN description TEXT NOT NULL DEFAULT ''",
  ];
  for (const sql of migrations) {
    try { _db.exec(sql); } catch { /* column already exists */ }
  }

  return _db;
}
