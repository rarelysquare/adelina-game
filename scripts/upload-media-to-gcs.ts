import { Storage } from "@google-cloud/storage";
import { readFileSync, readdirSync } from "fs";
import { join, extname } from "path";
import { readFileSync as readEnv } from "fs";

// Load .env.local manually
const envPath = join(__dirname, "../.env.local");
readEnv(envPath, "utf8").split("\n").forEach((line) => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim();
});

const BUCKET = process.env.GCS_BUCKET!;
const MEDIA_DIR = join(__dirname, "../public/media");

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".heic": "image/heic",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
  ".webm": "video/webm",
};

async function main() {
  const storage = new Storage();
  const bucket = storage.bucket(BUCKET);

  for (const folder of ["photos", "videos"]) {
    const dir = join(MEDIA_DIR, folder);
    let files: string[];
    try {
      files = readdirSync(dir);
    } catch {
      console.log(`No ${folder} folder found, skipping.`);
      continue;
    }

    console.log(`\nUploading ${files.length} ${folder}...`);
    for (const filename of files) {
      const localPath = join(dir, filename);
      const gcsPath = `${folder}/${filename}`;
      const contentType = MIME[extname(filename).toLowerCase()] ?? "application/octet-stream";

      try {
        await bucket.file(gcsPath).save(readFileSync(localPath), {
          contentType,
          resumable: false,
        });
        console.log(`  ✓ ${gcsPath}`);
      } catch (e: unknown) {
        console.error(`  ✗ ${gcsPath}: ${(e as Error).message}`);
      }
    }
  }

  console.log("\nDone.");
}

main().catch(console.error);
