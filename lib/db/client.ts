import { Pool } from "pg";
import { SCHEMA } from "./schema";

let _ready: Promise<Pool> | null = null;

async function init(): Promise<Pool> {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
  });
  await pool.query(SCHEMA);
  const migrations = [
    "ALTER TABLE trivia_questions ADD COLUMN IF NOT EXISTS is_adelina_specific INTEGER NOT NULL DEFAULT 0",
    "ALTER TABLE trivia_questions ADD COLUMN IF NOT EXISTS tags TEXT NOT NULL DEFAULT ''",
    "ALTER TABLE media_items ADD COLUMN IF NOT EXISTS tags TEXT NOT NULL DEFAULT ''",
    "ALTER TABLE media_items ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT ''",
    "ALTER TABLE players ADD COLUMN IF NOT EXISTS phone_number TEXT",
    "ALTER TABLE players ADD COLUMN IF NOT EXISTS sms_opted_in INTEGER NOT NULL DEFAULT 0",
    `CREATE TABLE IF NOT EXISTS illustrations (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      url TEXT NOT NULL,
      active INTEGER NOT NULL DEFAULT 1,
      is_builtin INTEGER NOT NULL DEFAULT 1
    )`,
  ];
  for (const sql of migrations) {
    await pool.query(sql);
  }

  // Seed all built-in illustrations (ON CONFLICT DO NOTHING = safe to re-run)
  const builtins = [
    "standing","crawling-bunny","holding-donut","crawling-grass",
    "sitting-crawl","playing-sand","sitting-happy","pointing",
    "laptop","happy-back","playing-mat","tummy-bunny",
    "sleeping-back","sleeping-side","sleeping-tummy",
    "snacking","rocking-llama","play-gym","sunglasses","sun-hat","walking",
  ];
  for (const name of builtins) {
    await pool.query(
      "INSERT INTO illustrations (name, url, is_builtin) VALUES ($1, $2, 1) ON CONFLICT (name) DO NOTHING",
      [name, `/illustrations/adelina-${name}.png`]
    );
  }

  return pool;
}

export function getDb(): Promise<Pool> {
  if (!_ready) _ready = init();
  return _ready;
}
