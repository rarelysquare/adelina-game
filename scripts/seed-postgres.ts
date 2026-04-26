import { Pool } from "pg";
import { readFileSync } from "fs";
import { join } from "path";

// Load .env.local manually
const envPath = join(__dirname, "../.env.local");
readFileSync(envPath, "utf8").split("\n").forEach((line) => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim();
});

interface QuestionRow {
  category: string;
  question: string;
  options_json: string;
  answer: string;
  answer_type: string;
  follow_up_context: string | null;
  tags: string | null;
  active: number;
  is_adelina_specific: number;
}

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const questions: QuestionRow[] = JSON.parse(
    readFileSync(join(__dirname, "questions_data.json"), "utf8")
  );

  console.log("Clearing existing questions...");
  await pool.query("DELETE FROM trivia_questions");

  console.log(`Inserting ${questions.length} questions...`);
  let ok = 0;

  for (const q of questions) {
    try {
      await pool.query(
        `INSERT INTO trivia_questions
          (category, question, options_json, answer, answer_type, follow_up_context, tags, active, is_adelina_specific)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          q.category,
          q.question,
          q.options_json,
          q.answer,
          q.answer_type,
          q.follow_up_context ?? null,
          q.tags ?? null,
          q.active,
          q.is_adelina_specific,
        ]
      );
      ok++;
    } catch (e: unknown) {
      console.error(`Failed q${ok + 1}: ${(e as Error).message.slice(0, 100)}`);
    }
  }

  console.log(`Done: ${ok}/${questions.length} inserted.`);
  await pool.end();
}

main().catch(console.error);
