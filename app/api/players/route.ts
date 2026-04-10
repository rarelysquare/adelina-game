import { getDb } from "@/lib/db/client";
import { nameToSlug } from "@/lib/game";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name } = await req.json();
  if (!name || typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const trimmed = name.trim();
  const db = getDb();

  // Case-insensitive uniqueness check
  const existing = db
    .prepare("SELECT slug FROM players WHERE LOWER(name) = LOWER(?)")
    .get(trimmed) as { slug: string } | undefined;

  if (existing) {
    return NextResponse.json(
      { error: "That name is already taken — try adding your last initial!" },
      { status: 409 }
    );
  }

  let slug = nameToSlug(trimmed);

  // Ensure slug is unique
  let counter = 1;
  while (db.prepare("SELECT id FROM players WHERE slug = ?").get(slug)) {
    slug = `${nameToSlug(trimmed)}-${counter++}`;
  }

  db.prepare("INSERT INTO players (name, slug) VALUES (?, ?)").run(trimmed, slug);
  return NextResponse.json({ slug, name: trimmed });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

  const db = getDb();
  const player = db.prepare("SELECT * FROM players WHERE slug = ?").get(slug);
  if (!player) return NextResponse.json({ error: "Player not found" }, { status: 404 });

  return NextResponse.json({ player });
}
