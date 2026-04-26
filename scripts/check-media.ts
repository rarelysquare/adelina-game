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
    "SELECT id, filename, type, tags FROM media_items ORDER BY type, id"
  );

  if (rows.length === 0) {
    console.log("❌ media_items table is EMPTY — need to run seed-media.ts");
  } else {
    console.log(`✓ ${rows.length} media items in DB`);
    const videos = rows.filter(r => r.type === "video");
    const photos = rows.filter(r => r.type === "photo");
    console.log(`  ${videos.length} videos, ${photos.length} photos`);
    console.log(`\nSample URLs that should work:`);
    const mediaBase = process.env.MEDIA_BASE_URL ?? "";
    rows.slice(0, 3).forEach(r => {
      console.log(`  ${mediaBase}/${r.type === "video" ? "videos" : "photos"}/${r.filename}`);
    });
  }

  await pool.end();
}

main().catch(console.error);
