import { getDb } from "@/lib/db/client";
import { todayDate } from "@/lib/game";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { slug } = await req.json();
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

  const db = getDb();
  const player = db.prepare("SELECT id FROM players WHERE slug = ?").get(slug) as
    | { id: number }
    | undefined;
  if (!player) return NextResponse.json({ error: "Player not found" }, { status: 404 });

  db.prepare("DELETE FROM player_sessions WHERE player_id = ? AND game_date = ?")
    .run(player.id, todayDate());

  return NextResponse.json({ ok: true });
}
