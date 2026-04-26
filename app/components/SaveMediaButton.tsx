"use client";
import { useState, useEffect, useRef } from "react";

interface Props {
  mediaUrl: string;
  mediaType: "photo" | "video";
  className?: string;
}

export function SaveMediaButton({ mediaUrl, mediaType, className }: Props) {
  const [saving, setSaving] = useState(false);
  const blobRef = useRef<Blob | null>(null);

  const ext = mediaType === "photo" ? "jpg" : "mp4";
  const filename = `adelina-${new Date().toISOString().slice(0, 10)}.${ext}`;

  // Pre-fetch the blob so it's ready for the share call (iOS requires
  // navigator.share to be called synchronously within the tap handler)
  useEffect(() => {
    if (!mediaUrl) return;
    fetch(`/api/download?url=${encodeURIComponent(mediaUrl)}`)
      .then((r) => r.blob())
      .then((blob) => { blobRef.current = blob; })
      .catch(() => {});
  }, [mediaUrl]);

  function handleSave() {
    setSaving(true);

    const blob = blobRef.current;

    // Web Share API — opens native share sheet (iOS: "Save to Photos", Android: Google Photos etc.)
    if (blob && typeof navigator !== "undefined" && navigator.canShare) {
      const file = new File([blob], filename, { type: blob.type });
      if (navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], title: "Adelina" })
          .catch(() => {}) // user cancelled — that's fine
          .finally(() => setSaving(false));
        return;
      }
    }

    // Fallback: trigger browser download
    const a = document.createElement("a");
    a.href = `/api/download?url=${encodeURIComponent(mediaUrl)}`;
    a.download = filename;
    a.click();
    setSaving(false);
  }

  return (
    <button onClick={handleSave} disabled={saving} className={className}>
      {saving ? "Preparing…" : `⬇ ${mediaType === "photo" ? "Save photo" : "Save video"}`}
    </button>
  );
}
