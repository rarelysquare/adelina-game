import { getDb } from "@/lib/db/client";
import { checkAnswer, pickVideoByTags, todayDate, MAX_DAILY_QUESTIONS } from "@/lib/game";
import { NextResponse } from "next/server";
import type Database from "better-sqlite3";

type MediaRow = { id: number; filename: string; tags: string };

function pickMediaForPlayer(
  db: Database.Database,
  playerId: number,
  questionTagSet: Set<string>
): { id: number; filename: string; type: string } | null {
  const seenIds = (
    db.prepare("SELECT media_id FROM player_media_history WHERE player_id = ?").all(playerId) as { media_id: number }[]
  ).map((r) => r.media_id);

  const notIn =
    seenIds.length > 0
      ? `AND id NOT IN (${seenIds.map(() => "?").join(",")})`
      : "";

  // 1. Try unseen videos
  const unseenVideos = (
    seenIds.length > 0
      ? db.prepare(`SELECT id, filename, tags FROM media_items WHERE type = 'video' ${notIn}`).all(...seenIds)
      : db.prepare(`SELECT id, filename, tags FROM media_items WHERE type = 'video'`).all()
  ) as MediaRow[];

  if (unseenVideos.length > 0) {
    const picked = pickVideoByTags(unseenVideos, questionTagSet)!;
    return { id: picked.id, filename: picked.filename, type: "video" };
  }

  // 2. Try unseen photos
  const unseenPhotos = (
    seenIds.length > 0
      ? db.prepare(`SELECT id, filename, tags FROM media_items WHERE type = 'photo' ${notIn}`).all(...seenIds)
      : db.prepare(`SELECT id, filename, tags FROM media_items WHERE type = 'photo'`).all()
  ) as MediaRow[];

  if (unseenPhotos.length > 0) {
    const picked = unseenPhotos[Math.floor(Math.random() * unseenPhotos.length)];
    return { id: picked.id, filename: picked.filename, type: "photo" };
  }

  // 3. All media exhausted — reset history and start fresh with videos
  db.prepare("DELETE FROM player_media_history WHERE player_id = ?").run(playerId);

  const allVideos = db
    .prepare("SELECT id, filename, tags FROM media_items WHERE type = 'video'")
    .all() as MediaRow[];
  if (allVideos.length > 0) {
    const picked = pickVideoByTags(allVideos, questionTagSet)!;
    return { id: picked.id, filename: picked.filename, type: "video" };
  }

  const allPhotos = db
    .prepare("SELECT id, filename, tags FROM media_items WHERE type = 'photo'")
    .all() as MediaRow[];
  if (allPhotos.length > 0) {
    const picked = allPhotos[Math.floor(Math.random() * allPhotos.length)];
    return { id: picked.id, filename: picked.filename, type: "photo" };
  }

  return null;
}

export async function POST(req: Request) {
  const { slug, question_id, selected_option } = await req.json();
  if (!slug || question_id == null || !selected_option) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const db = getDb();
  const player = db.prepare("SELECT * FROM players WHERE slug = ?").get(slug) as
    | { id: number; total_points: number; current_streak: number; longest_streak: number; last_played_date: string | null }
    | undefined;
  if (!player) return NextResponse.json({ error: "Player not found" }, { status: 404 });

  const question = db
    .prepare("SELECT * FROM trivia_questions WHERE id = ?")
    .get(question_id) as
    | { id: number; category: string; answer: string; answer_type: string; follow_up_context: string | null; tags: string }
    | undefined;
  if (!question) return NextResponse.json({ error: "Question not found" }, { status: 404 });

  const isCorrect = checkAnswer(question.answer_type, question.answer, selected_option);
  const today = todayDate();

  const session = db
    .prepare("SELECT * FROM player_sessions WHERE player_id = ? AND game_date = ?")
    .get(player.id, today) as { id: number; answers_json: string; score: number } | undefined;

  const answers: { question_id: number; category: string; selected: string; correct: boolean }[] =
    session ? JSON.parse(session.answers_json) : [];

  // Prevent re-answering
  if (answers.some((a) => a.question_id === question_id)) {
    return NextResponse.json({ error: "Already answered" }, { status: 409 });
  }

  answers.push({ question_id, category: question.category, selected: selected_option, correct: isCorrect });
  const totalCorrect = answers.filter((a) => a.correct).length;

  if (session) {
    db.prepare("UPDATE player_sessions SET answers_json = ?, score = ? WHERE id = ?")
      .run(JSON.stringify(answers), totalCorrect, session.id);
  } else {
    db.prepare("INSERT INTO player_sessions (player_id, game_date, answers_json, score) VALUES (?, ?, ?, ?)")
      .run(player.id, today, JSON.stringify(answers), totalCorrect);
  }

  if (answers.length >= MAX_DAILY_QUESTIONS) {
    db.prepare("UPDATE player_sessions SET completed = 1, completed_at = datetime('now') WHERE player_id = ? AND game_date = ?")
      .run(player.id, today);
  }

  // Update points and streak
  if (isCorrect) {
    db.prepare("UPDATE players SET total_points = total_points + 10 WHERE id = ?").run(player.id);
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  if (answers.length === 1) {
    if (player.last_played_date === yesterday) {
      const newStreak = player.current_streak + 1;
      db.prepare("UPDATE players SET current_streak = ?, longest_streak = MAX(longest_streak, ?), last_played_date = ? WHERE id = ?")
        .run(newStreak, newStreak, today, player.id);
    } else {
      db.prepare("UPDATE players SET current_streak = 1, last_played_date = ? WHERE id = ?")
        .run(today, player.id);
    }
  }

  // Always pick media after the daily question
  const questionTagSet = new Set(
    question.tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean)
  );
  const media = pickMediaForPlayer(db, player.id, questionTagSet);

  if (media) {
    db.prepare("INSERT OR IGNORE INTO player_media_history (player_id, media_id) VALUES (?, ?)")
      .run(player.id, media.id);
  }

  const mediaPath = media
    ? `/media/${media.type === "video" ? "videos" : "photos"}/${media.filename}`
    : null;

  return NextResponse.json({
    correct: isCorrect,
    correct_answer: question.answer,
    follow_up_context: question.follow_up_context,
    questions_remaining: Math.max(0, MAX_DAILY_QUESTIONS - answers.length),
    media_url: mediaPath,
    media_type: media?.type ?? null,
  });
}
