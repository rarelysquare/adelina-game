"use client";
import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
}

export function TapAnimation() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    function handleTouch(e: TouchEvent) {
      const touch = e.touches[0];
      if (!touch) return;
      spawn(touch.clientX, touch.clientY);
    }

    function handleClick(e: MouseEvent) {
      // Only on mobile (no cursor)
      if (window.matchMedia("(pointer: fine)").matches) return;
      spawn(e.clientX, e.clientY);
    }

    function spawn(x: number, y: number) {
      const id = Date.now() + Math.random();
      setParticles((prev) => [...prev, { id, x, y }]);
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== id));
      }, 700);
    }

    window.addEventListener("touchstart", handleTouch, { passive: true });
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("touchstart", handleTouch);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <>
      {particles.map((p) => (
        <img
          key={p.id}
          src="/cursor/day_cursor.png"
          alt=""
          className="pointer-events-none fixed z-[9999] w-10 h-10 animate-tap-pop"
          style={{ left: p.x - 20, top: p.y - 20 }}
        />
      ))}
    </>
  );
}
