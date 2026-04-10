"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MAX_DAILY_QUESTIONS } from "@/lib/game";
import { FlameIcon, PartyIcon } from "../components/SoftIcons";
import { DevReset } from "../components/DevReset";

const DAY_ILLUSTRATIONS = [
  "standing", "crawling-bunny", "holding-donut", "crawling-grass",
  "sitting-crawl", "playing-sand", "sitting-happy", "pointing",
  "laptop", "happy-back", "playing-mat", "tummy-bunny",
];
const NIGHT_ILLUSTRATIONS = ["sleeping-back", "sleeping-side", "sleeping-tummy"];

function getDailyIllustration() {
  const now = new Date();
  const isNight = now.getHours() >= 19;
  const pool = isNight ? NIGHT_ILLUSTRATIONS : DAY_ILLUSTRATIONS;
  const day = Math.floor(Date.now() / 86400000);
  return pool[day % pool.length];
}

interface Status {
  player: { name: string; current_streak: number; total_points: number };
  questions_answered: number;
  questions_remaining: number;
  score_today: number;
  video_unlocked: boolean;
}


export default function PlayPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const slug = localStorage.getItem("playerSlug");
    if (!slug) { router.replace("/"); return; }

    fetch(`/api/game/status?slug=${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { router.replace("/"); return; }
        setStatus(data);
        if (data.video_unlocked && data.questions_remaining === 0) {
          fetch("/api/game/video")
            .then((r) => r.json())
            .then((d) => { if (d.url) setVideoUrl(d.url); });
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return (
    <main className="min-h-screen bg-gradient-to-b from-cream-100 to-brand-50 flex items-center justify-center">
      <p className="text-brand-400">Loading…</p>
    </main>
  );

  if (!status) return null;

  const doneForDay = status.questions_remaining === 0;

  return (
    <main className="min-h-screen bg-gradient-to-b from-cream-100 to-brand-50">
      <div className="max-w-sm mx-auto px-4 pt-10 pb-8 space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/illustrations/adelina-${getDailyIllustration()}.png`}
            alt="Adelina"
            className="w-28 h-28 mx-auto object-contain"
          />
          <p className="text-sm text-brand-400">
            {status.player.total_points === 0 && status.questions_answered === 0 ? "Welcome" : "Welcome back"}
          </p>
          <h1 className="text-2xl font-bold text-brand-700">
            {status.player.name}
          </h1>
          {status.player.current_streak > 1 && (
            <p className="text-sm text-blush-400 font-medium flex items-center justify-center gap-1">
              <FlameIcon className="w-4 h-4" />
              {status.player.current_streak} day streak
            </p>
          )}
        </div>

        {/* Progress bar */}
        <div className="bg-cream-50 rounded-2xl p-4 shadow-sm space-y-2 border border-brand-100">
          <div className="flex justify-between text-sm text-brand-600">
            <span>Today&apos;s questions</span>
            <span className="font-medium">
              {status.questions_answered}/{MAX_DAILY_QUESTIONS}
            </span>
          </div>
          <div className="h-2 bg-brand-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-400 rounded-full transition-all"
              style={{ width: `${(status.questions_answered / MAX_DAILY_QUESTIONS) * 100}%` }}
            />
          </div>
          {status.video_unlocked && (
            <p className="text-sm text-blush-400 font-medium text-center pt-1">
              🎉 You unlocked a video reward!
            </p>
          )}
        </div>

        {doneForDay ? (
          <div className="text-center space-y-1 py-2">
            <p className="font-semibold text-brand-700">All done for today!</p>
            <p className="text-sm text-brand-400">
              You got {status.score_today} out of {MAX_DAILY_QUESTIONS} correct. Come back tomorrow for more!
            </p>
          </div>
        ) : (
          <button
            onClick={() => router.push("/play/daily")}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-5 rounded-2xl text-lg transition active:scale-95 shadow-sm"
          >
            Play today&apos;s questions
          </button>
        )}

        {doneForDay && videoUrl && (
          showVideo ? (
            <div className="space-y-3">
              <video src={videoUrl} controls autoPlay playsInline className="w-full rounded-2xl shadow" />
              <a
                href={videoUrl}
                download
                className="block w-full bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold text-center py-3 rounded-xl transition"
              >
                ⬇ Download video
              </a>
            </div>
          ) : (
            <button
              onClick={() => setShowVideo(true)}
              className="w-full bg-blush-400 hover:bg-blush-400/80 text-white font-semibold py-4 rounded-2xl text-base transition shadow-sm"
            >
              <PartyIcon className="w-5 h-5 inline-block mr-1 align-middle" />Watch your reward video!
            </button>
          )
        )}

        <p className="text-center text-xs text-brand-300">
          {status.player.total_points} total points
        </p>
        <div className="text-center">
          <DevReset />
        </div>
      </div>
    </main>
  );
}
