import { auth } from "@/auth";
import { getDb } from "@/lib/db/client";
import { NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";

function isAdmin(email?: string | null) {
  return email === process.env.ADMIN_EMAIL;
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || !isAdmin(session.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  const db = await getDb();
  if (body.name !== undefined) {
    await db.query("UPDATE illustrations SET name = $1 WHERE id = $2", [body.name, id]);
  }
  if (body.active !== undefined) {
    await db.query("UPDATE illustrations SET active = $1 WHERE id = $2", [body.active ? 1 : 0, id]);
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || !isAdmin(session.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const db = await getDb();
  const { rows } = await db.query("SELECT * FROM illustrations WHERE id = $1", [id]);
  if (!rows.length) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Delete from GCS if it's a custom (non-builtin) illustration
  if (!rows[0].is_builtin && rows[0].url.startsWith("http")) {
    try {
      const bucket = process.env.GCS_BUCKET;
      if (bucket) {
        const storage = new Storage();
        const urlPath = new URL(rows[0].url).pathname.replace(`/${bucket}/`, "");
        await storage.bucket(bucket).file(urlPath).delete();
      }
    } catch { /* ignore delete errors */ }
  }

  await db.query("DELETE FROM illustrations WHERE id = $1", [id]);
  return NextResponse.json({ ok: true });
}
