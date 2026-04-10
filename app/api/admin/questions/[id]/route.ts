import { auth } from "@/auth";
import { getDb } from "@/lib/db/client";
import { NextResponse } from "next/server";

function isAdmin(email?: string | null) {
  return email === process.env.ADMIN_EMAIL;
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || !isAdmin(session.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { category, question, answer, answer_type, options, follow_up_context, active, tags } = body;

  const db = getDb();
  db.prepare(`
    UPDATE trivia_questions SET
      category = COALESCE(?, category),
      question = COALESCE(?, question),
      answer = COALESCE(?, answer),
      answer_type = COALESCE(?, answer_type),
      options_json = COALESCE(?, options_json),
      follow_up_context = ?,
      active = COALESCE(?, active),
      tags = COALESCE(?, tags),
      updated_at = datetime('now')
    WHERE id = ?
  `).run(
    category ?? null,
    question ?? null,
    answer ?? null,
    answer_type ?? null,
    options !== undefined ? JSON.stringify(options) : null,
    follow_up_context ?? null,
    active !== undefined ? (active ? 1 : 0) : null,
    tags !== undefined ? tags : null,
    id
  );

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || !isAdmin(session.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const db = getDb();
  db.prepare("DELETE FROM trivia_questions WHERE id = ?").run(id);
  return NextResponse.json({ ok: true });
}
