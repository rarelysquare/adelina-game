import { auth } from "@/auth";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const LABELS_PATH = path.join(process.cwd(), "public/illustrations/labels.json");

function isAdmin(email?: string | null) {
  return email === process.env.ADMIN_EMAIL;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !isAdmin(session.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const labels = await req.json();
  fs.writeFileSync(LABELS_PATH, JSON.stringify(labels, null, 2));
  return NextResponse.json({ ok: true });
}
