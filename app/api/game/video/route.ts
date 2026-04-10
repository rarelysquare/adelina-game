import { getDb } from "@/lib/db/client";
import { pickVideoByTags } from "@/lib/game";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const questionIds = searchParams.get("question_ids");

  const db = getDb();
  const videos = db
    .prepare("SELECT id, filename, tags FROM media_items WHERE type = 'video'")
    .all() as { id: number; filename: string; tags: string }[];

  if (!videos.length) return NextResponse.json({ url: null });

  let questionTagSet = new Set<string>();
  if (questionIds) {
    const ids = questionIds.split(",").map(Number).filter(Boolean);
    if (ids.length) {
      const placeholders = ids.map(() => "?").join(",");
      const questions = db
        .prepare(`SELECT tags FROM trivia_questions WHERE id IN (${placeholders})`)
        .all(...ids) as { tags: string }[];
      questionTagSet = new Set(
        questions.flatMap((q) =>
          q.tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean)
        )
      );
    }
  }

  const chosen = pickVideoByTags(videos, questionTagSet);
  return NextResponse.json({ url: chosen ? `/media/videos/${chosen.filename}` : null });
}
