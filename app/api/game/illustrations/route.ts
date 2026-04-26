import { getDb } from "@/lib/db/client";
import { NextResponse } from "next/server";

export async function GET() {
  const db = await getDb();
  const { rows } = await db.query(
    "SELECT name, url FROM illustrations WHERE active = 1 ORDER BY is_builtin DESC, name ASC"
  );
  return NextResponse.json({ illustrations: rows });
}
