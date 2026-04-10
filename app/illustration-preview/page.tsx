"use client";
import { useState, useEffect } from "react";

const ILLUSTRATION_SLUGS = [
  "standing", "crawling-bunny", "holding-donut", "crawling-grass",
  "sitting-crawl", "playing-sand", "sitting-happy", "pointing",
  "laptop", "happy-back", "playing-mat", "tummy-bunny",
  "sleeping-back", "sleeping-side", "sleeping-tummy",
];

export default function IllustrationPreview() {
  const [labels, setLabels] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/illustrations/labels.json")
      .then((r) => r.json())
      .then(setLabels);
  }, []);

  function startEdit(slug: string) {
    setEditing(slug);
    setDraft(labels[slug] ?? slug);
  }

  function cancelEdit() {
    setEditing(null);
    setDraft("");
  }

  function commitEdit(slug: string) {
    setLabels((prev) => ({ ...prev, [slug]: draft.trim() || slug }));
    setEditing(null);
  }

  async function saveAll() {
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/illustration-labels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(labels),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <main className="min-h-screen bg-cream-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-brand-700">Adelina Illustrations</h1>
          <button
            onClick={saveAll}
            disabled={saving}
            className="bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-semibold px-5 py-2 rounded-xl text-sm transition"
          >
            {saving ? "Saving…" : saved ? "Saved ✓" : "Save names"}
          </button>
        </div>
        <p className="text-sm text-brand-400">Click any name to edit it, then hit Save names.</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
          {ILLUSTRATION_SLUGS.map((slug) => (
            <div
              key={slug}
              className="bg-white rounded-2xl p-3 shadow-sm border border-brand-100 flex flex-col items-center gap-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/illustrations/adelina-${slug}.png`}
                alt={labels[slug] ?? slug}
                className="w-full h-32 object-contain"
              />
              {editing === slug ? (
                <div className="w-full flex gap-1">
                  <input
                    autoFocus
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitEdit(slug);
                      if (e.key === "Escape") cancelEdit();
                    }}
                    className="flex-1 text-xs border border-brand-300 rounded-lg px-2 py-1 text-brand-800 focus:outline-none focus:ring-1 focus:ring-brand-400 min-w-0"
                  />
                  <button onClick={() => commitEdit(slug)} className="text-brand-500 text-xs font-bold px-1">✓</button>
                  <button onClick={cancelEdit} className="text-brand-300 text-xs px-1">✕</button>
                </div>
              ) : (
                <button
                  onClick={() => startEdit(slug)}
                  className="text-xs text-brand-500 text-center hover:text-brand-700 hover:underline transition w-full"
                >
                  {labels[slug] ?? slug}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
