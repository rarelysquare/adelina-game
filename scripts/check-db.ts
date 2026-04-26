import { Pool } from "pg";
import { readFileSync } from "fs";
import { join } from "path";

const envPath = join(__dirname, "../.env.local");
readFileSync(envPath, "utf8").split("\n").forEach((line) => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim();
});

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  const { rows } = await pool.query(
    "SELECT id, answer_type, LEFT(question, 50) as q, options_json FROM trivia_questions ORDER BY id LIMIT 10"
  );

  console.log(`\nFirst 10 questions in DB:\n`);
  for (const r of rows) {
    const opts = JSON.parse(r.options_json || "[]");
    console.log(`#${r.id} [${r.answer_type}] "${r.q}..."`);
    console.log(`  options_json has ${opts.length} items: ${opts.length > 0 ? opts[0].slice(0, 60) : "(empty)"}`);
  }

  const { rows: counts } = await pool.query(
    "SELECT answer_type, COUNT(*) as n FROM trivia_questions GROUP BY answer_type"
  );
  console.log("\nQuestion counts by type:");
  for (const r of counts) console.log(`  ${r.answer_type}: ${r.n}`);

  await pool.end();
}

main().catch(console.error);
