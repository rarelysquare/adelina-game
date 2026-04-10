/**
 * Import seed questions from data/seeds/ into the SQLite database.
 * Run with: npx tsx scripts/import-questions.ts
 */

import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_PATH = process.env.DATABASE_PATH
  ? path.resolve(process.env.DATABASE_PATH)
  : path.resolve("./data/adelina.db");

const db = new Database(DB_PATH);
db.pragma("foreign_keys = ON");

// Migration — safe to run on existing databases
try {
  db.exec("ALTER TABLE trivia_questions ADD COLUMN is_adelina_specific INTEGER NOT NULL DEFAULT 0");
} catch {
  // Column already exists
}

const insert = db.prepare(`
  INSERT INTO trivia_questions (id, category, question, answer, answer_type, options_json, follow_up_context, is_adelina_specific, active)
  VALUES (@id, @category, @question, @answer, @answer_type, @options_json, @follow_up_context, @is_adelina_specific, 1)
  ON CONFLICT(id) DO UPDATE SET
    category = excluded.category,
    question = excluded.question,
    answer = excluded.answer,
    answer_type = excluded.answer_type,
    options_json = excluded.options_json,
    follow_up_context = excluded.follow_up_context,
    is_adelina_specific = excluded.is_adelina_specific,
    updated_at = datetime('now')
`);

const seedDir = path.resolve("./data/seeds");
const files = fs.readdirSync(seedDir).filter((f) => f.endsWith(".json"));

let total = 0;

for (const file of files) {
  const raw = JSON.parse(fs.readFileSync(path.join(seedDir, file), "utf-8"));
  const category: string = raw.category;
  const isAdelinaSpecific: boolean = raw.is_adelina_specific ?? false;
  const questions: {
    id: number;
    question: string;
    answer: string;
    answer_type: string;
    options: string[];
    follow_up_context?: string;
  }[] = raw.questions;

  for (const q of questions) {
    insert.run({
      id: q.id,
      category,
      question: q.question,
      answer: q.answer,
      answer_type: q.answer_type,
      options_json: JSON.stringify(q.options ?? []),
      follow_up_context: q.follow_up_context ?? null,
      is_adelina_specific: isAdelinaSpecific ? 1 : 0,
    });
    total++;
  }

  const tag = isAdelinaSpecific ? " [Adelina-specific]" : "";
  console.log(`✓ ${file} — ${questions.length} questions (${category}${tag})`);
}

console.log(`\nDone. ${total} questions total in database.`);
db.close();
