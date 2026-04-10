"use client";
import { useRouter } from "next/navigation";

export function DevReset() {
  const router = useRouter();

  async function reset() {
    const slug = localStorage.getItem("playerSlug");
    if (slug) {
      await fetch("/api/game/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
    }
    localStorage.removeItem("playerSlug");
    router.replace("/");
  }

  return (
    <button
      onClick={reset}
      className="text-[10px] text-brand-200 hover:text-brand-400 transition py-1"
    >
      dev reset
    </button>
  );
}
