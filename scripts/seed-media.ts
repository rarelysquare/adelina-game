import { Pool } from "pg";
import { readFileSync } from "fs";
import { join } from "path";

// Load .env.local manually
const envPath = join(__dirname, "../.env.local");
readFileSync(envPath, "utf8").split("\n").forEach((line) => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim();
});

interface MediaRow {
  filename: string;
  original_name: string;
  type: string;
  mime_type: string;
  size: number;
  tags: string | null;
  description: string | null;
}

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const items: MediaRow[] = JSON.parse(
    readFileSync(join(__dirname, "media_items_data.json"), "utf8")
  );

  console.log("Clearing existing media_items...");
  await pool.query("DELETE FROM media_items");

  console.log(`Inserting ${items.length} media items...`);
  let ok = 0;

  for (const item of items) {
    try {
      await pool.query(
        `INSERT INTO media_items (filename, original_name, type, mime_type, size, tags, description)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          item.filename,
          item.original_name,
          item.type,
          item.mime_type,
          item.size,
          item.tags ?? "",
          item.description ?? "",
        ]
      );
      ok++;
    } catch (e: unknown) {
      console.error(`Failed ${item.filename}: ${(e as Error).message.slice(0, 100)}`);
    }
  }

  console.log(`Done: ${ok}/${items.length} inserted.`);
  await pool.end();
}

main().catch(console.error);
