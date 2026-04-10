import { getDb } from "@/lib/db/client";
import { CATEGORY_SLUGS, MAX_DAILY_QUESTIONS, todayDate } from "@/lib/game";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  const categorySlug = searchParams.get("category");

  if (!slug || !categorySlug) {
    return NextResponse.json({ error: "slug and category required" }, { status: 400 });
  }

  const category = CATEGORY_SLUGS[categorySlug];
  if (!category) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  const db = getDb();
  const player = db.prepare("SELECT * FROM players WHERE slug = ?").get(slug) as
    | { id: number }
    | undefined;
  if (!player) return NextResponse.json({ error: "Player not found" }, { status: 404 });

  const today = todayDate();
  const session = db
    .prepare("SELECT * FROM player_sessions WHERE player_id = ? AND game_date = ?")
    .get(player.id, today) as { answers_json: string } | undefined;

  const answers: { question_id: number }[] = session
    ? JSON.parse(session.answers_json)
    : [];

  const remaining = MAX_DAILY_QUESTIONS - answers.length;
  if (remaining <= 0) {
    return NextResponse.json({ questions: [], remaining: 0 });
  }

  const answeredIds = answers.map((a) => a.question_id);
  const exclusion =
    answeredIds.length > 0
      ? `AND id NOT IN (${answeredIds.map(() => "?").join(",")})`
      : "";

  // "daily" mode: pull from all categories mixed
  const categoryFilter = category === "daily" ? "" : "AND category = ?";
  const categoryArgs = category === "daily" ? [] : [category];

  const questions = db
    .prepare(
      `SELECT id, question, answer_type, options_json, answer, follow_up_context
       FROM trivia_questions
       WHERE active = 1 ${categoryFilter} ${exclusion}
       ORDER BY RANDOM()
       LIMIT ?`
    )
    .all(...categoryArgs, ...answeredIds, remaining) as {
    id: number;
    question: string;
    answer_type: string;
    options_json: string;
    answer: string;
    follow_up_context: string | null;
  }[];

  // Parse options_json for each question
  const parsed = questions.map((q) => ({
    ...q,
    options: JSON.parse(q.options_json),
    options_json: undefined,
  }));

  return NextResponse.json({ questions: parsed, remaining });
}
