import { auth } from "@/auth";
import { getDb } from "@/lib/db/client";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { randomUUID } from "crypto";

function isAdmin(email?: string | null) {
  return email === process.env.ADMIN_EMAIL;
}

const PHOTO_EXTS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".heic", ".heif"]);
const VIDEO_EXTS = new Set([".mp4", ".mov", ".avi", ".mkv", ".m4v", ".3gp"]);

const PHOTO_TYPES = new Set([
  "image/jpeg", "image/png", "image/gif",
  "image/webp", "image/heic", "image/heif",
]);
const VIDEO_TYPES = new Set([
  "video/mp4", "video/quicktime", "video/avi",
  "video/x-matroska", "video/x-msvideo", "video/mov",
  "video/m4v", "video/3gpp",
]);

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !isAdmin(session.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const files = formData.getAll("files") as File[];

  if (!files.length) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }

  const db = getDb();
  const uploaded: { filename: string; original: string; type: string; url: string }[] = [];
  const errors: string[] = [];

  for (const file of files) {
    const ext = path.extname(file.name).toLowerCase();
    const isPhoto = PHOTO_TYPES.has(file.type) || PHOTO_EXTS.has(ext);
    const isVideo = VIDEO_TYPES.has(file.type) || VIDEO_EXTS.has(ext);

    console.log(`[upload] file="${file.name}" ext="${ext}" mime="${file.type}" isPhoto=${isPhoto} isVideo=${isVideo}`);

    if (!isPhoto && !isVideo) {
      errors.push(`${file.name}: unsupported type (${file.type}, ext: ${ext})`);
      continue;
    }

    const type = isPhoto ? "photo" : "video";
    const fileExt = ext || (isPhoto ? ".jpg" : ".mp4");
    const filename = `${randomUUID()}${fileExt}`;
    const subdir = isPhoto ? "photos" : "videos";
    const dir = path.join(process.cwd(), "public", "media", subdir);

    if (!existsSync(dir)) await mkdir(dir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(dir, filename), buffer);

    db.prepare(`
      INSERT INTO media_items (filename, original_name, type, mime_type, size)
      VALUES (?, ?, ?, ?, ?)
    `).run(filename, file.name, type, file.type, file.size);

    uploaded.push({ filename, original: file.name, type, url: `/media/${subdir}/${filename}` });
  }

  return NextResponse.json({ uploaded, errors });
}
