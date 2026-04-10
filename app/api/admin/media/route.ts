import { auth } from "@/auth";
import { getDb } from "@/lib/db/client";
import { NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";

function isAdmin(email?: string | null) {
  return email === process.env.ADMIN_EMAIL;
}

export async function GET() {
  const session = await auth();
  if (!session || !isAdmin(session.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const items = db.prepare(
    "SELECT * FROM media_items ORDER BY uploaded_at DESC"
  ).all();

  return NextResponse.json({ items });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session || !isAdmin(session.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, tags, description } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const db = getDb();
  db.prepare("UPDATE media_items SET tags = ?, description = ? WHERE id = ?")
    .run(tags ?? "", description ?? "", id);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session || !isAdmin(session.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { filename } = await req.json();
  if (!filename || typeof filename !== "string") {
    return NextResponse.json({ error: "filename required" }, { status: 400 });
  }

  const db = getDb();
  const item = db.prepare("SELECT * FROM media_items WHERE filename = ?").get(filename) as
    | { type: string; filename: string }
    | undefined;

  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const subdir = item.type === "photo" ? "photos" : "videos";
  const filePath = path.join(process.cwd(), "public", "media", subdir, filename);

  try {
    await unlink(filePath);
  } catch {
    // file might already be gone, that's ok
  }

  db.prepare("DELETE FROM media_items WHERE filename = ?").run(filename);
  return NextResponse.json({ ok: true });
}
