"use client";
import { useEffect } from "react";

function getCursorUrl() {
  const hour = new Date().getHours();
  const isDay = hour >= 7 && hour < 18;
  return isDay ? "/cursor/day_cursor.png" : "/cursor/night_cursor.png";
}

export function CursorManager() {
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.id = "adelina-cursor";
    document.head.appendChild(styleEl);

    function update() {
      styleEl.textContent = `* { cursor: url('${getCursorUrl()}') 16 16, auto !important; }`;
    }

    update();

    const interval = setInterval(update, 60_000);
    return () => {
      clearInterval(interval);
      styleEl.remove();
    };
  }, []);

  return null;
}
