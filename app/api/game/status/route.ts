import { getDb } from "@/lib/db/client";
import { todayDate, MAX_DAILY_QUESTIONS } from "@/lib/game";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

  const db = getDb();
  const player = db.prepare("SELECT * FROM players WHERE slug = ?").get(slug) as
    | Record<string, unknown>
    | undefined;
  if (!player) return NextResponse.json({ error: "Player not found" }, { status: 404 });

  const today = todayDate();
  const session = db
    .prepare("SELECT * FROM player_sessions WHERE player_id = ? AND game_date = ?")
    .get(player.id, today) as { answers_json: string; score: number } | undefined;

  const answers: { category: string; correct: boolean }[] = session
    ? JSON.parse(session.answers_json)
    : [];

  return NextResponse.json({
    player,
    questions_answered: answers.length,
    questions_remaining: Math.max(0, MAX_DAILY_QUESTIONS - answers.length),
    score_today: answers.filter((a) => a.correct).length,
    video_unlocked: answers.length >= MAX_DAILY_QUESTIONS,
  });
}
