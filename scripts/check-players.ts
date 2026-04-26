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
    "SELECT id, name, slug, current_streak, total_points, created_at FROM players ORDER BY id"
  );
  console.log(`\n${rows.length} players:\n`);
  for (const p of rows) {
    console.log(`#${p.id} ${p.name} (${p.slug}) — streak: ${p.current_streak}, points: ${p.total_points}, joined: ${p.created_at}`);
  }
  await pool.end();
}

main().catch(console.error);
