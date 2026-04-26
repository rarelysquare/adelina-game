import { auth } from "@/auth";
import { getDb } from "@/lib/db/client";
import { NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";

function isAdmin(email?: string | null) {
  return email === process.env.ADMIN_EMAIL;
}

export async function GET() {
  const session = await auth();
  if (!session || !isAdmin(session.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const db = await getDb();
  const { rows } = await db.query("SELECT * FROM illustrations ORDER BY is_builtin DESC, name ASC");
  return NextResponse.json({ illustrations: rows });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !isAdmin(session.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const name = (formData.get("name") as string | null)?.trim();

  if (!file || !name) return NextResponse.json({ error: "Missing file or name" }, { status: 400 });

  const bucket = process.env.GCS_BUCKET;
  if (!bucket) return NextResponse.json({ error: "GCS_BUCKET not configured" }, { status: 500 });

  const storage = new Storage();
  const filename = `illustrations/adelina-${name.toLowerCase().replace(/\s+/g, "-")}.png`;
  const bytes = Buffer.from(await file.arrayBuffer());

  await storage.bucket(bucket).file(filename).save(bytes, { contentType: "image/png", resumable: false });

  const url = `${process.env.MEDIA_BASE_URL}/${filename}`;
  const db = await getDb();
  const { rows } = await db.query(
    "INSERT INTO illustrations (name, url, is_builtin) VALUES ($1, $2, 0) ON CONFLICT (name) DO UPDATE SET url = $2, active = 1 RETURNING *",
    [name, url]
  );

  return NextResponse.json({ illustration: rows[0] });
}
