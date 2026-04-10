import { auth } from "@/auth";
import { getDb } from "@/lib/db/client";
import { NextResponse } from "next/server";

function isAdmin(email?: string | null) {
  return email === process.env.ADMIN_EMAIL;
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session || !isAdmin(session.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  const db = getDb();
  const rows = category
    ? db.prepare("SELECT * FROM trivia_questions WHERE category = ? ORDER BY id").all(category)
    : db.prepare("SELECT * FROM trivia_questions ORDER BY category, id").all();

  return NextResponse.json({ questions: rows });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !isAdmin(session.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { category, question, answer, answer_type, options, follow_up_context, tags } = body;

  if (!category || !question || !answer || !answer_type) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const db = getDb();
  const result = db.prepare(`
    INSERT INTO trivia_questions (category, question, answer, answer_type, options_json, follow_up_context, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    category,
    question,
    answer,
    answer_type,
    JSON.stringify(options ?? []),
    follow_up_context ?? null,
    tags ?? ""
  );

  return NextResponse.json({ id: result.lastInsertRowid });
}
