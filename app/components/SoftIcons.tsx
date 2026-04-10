// Soft, muted SVG icons to replace harsh system emojis

export function StarIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M12 2.5l2.4 5 5.6.8-4 3.9.9 5.5-5-2.6-5 2.6.9-5.5-4-3.9 5.6-.8z"
        fill="#E8D09A" stroke="#C9A96E" strokeWidth="0.8" strokeLinejoin="round"
      />
    </svg>
  );
}

export function MoonIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        fill="#B5C9E8" stroke="#8AAAC8" strokeWidth="0.8" strokeLinejoin="round"
      />
    </svg>
  );
}

export function FlameIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M12 2c0 0-6 5-6 10a6 6 0 0 0 12 0c0-2-1.5-4-2.5-5 0 2-1 3.5-3.5 4.5C13 9.5 12 2 12 2z"
        fill="#F0C4A0" stroke="#D9927A" strokeWidth="0.8" strokeLinejoin="round"
      />
    </svg>
  );
}

export function PartyIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* cone */}
      <path d="M4 20 L13 4 L20 14 Z" fill="#B5C9B0" stroke="#8EB89A" strokeWidth="0.8" strokeLinejoin="round" />
      {/* dots */}
      <circle cx="18" cy="6" r="1.5" fill="#F0C4A0" />
      <circle cx="20" cy="10" r="1" fill="#E8D09A" />
      <circle cx="6" cy="8" r="1.2" fill="#D9927A" opacity="0.7" />
      <circle cx="16" cy="18" r="1" fill="#B5C9B0" />
      <circle cx="8" cy="16" r="1.5" fill="#E8D09A" />
    </svg>
  );
}

export function WaveIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M7 11V7a2 2 0 0 1 4 0v4M11 9V6a2 2 0 0 1 4 0v5M15 10V8a2 2 0 0 1 4 0v6a6 6 0 0 1-12 0v-3a2 2 0 0 1 4 0v2"
        fill="#F5E0CF" stroke="#C49080" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

export function ClapIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* sparkles around hands */}
      <circle cx="19" cy="5" r="1" fill="#E8D09A" />
      <circle cx="17" cy="3" r="0.8" fill="#B5C9B0" />
      <circle cx="21" cy="7" r="0.8" fill="#F0C4A0" />
      {/* hands */}
      <path
        d="M9 12l-3-3a1.5 1.5 0 0 1 2-2l4 4M9 12l2 2M11 14l2 2M13 16l1.5 1.5a3 3 0 0 0 4-4L14 9a1.5 1.5 0 0 0-2 2l1 1"
        fill="#F5E0CF" stroke="#C49080" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

export function MuscleIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M6 9a3 3 0 0 1 6 0v1h1a2 2 0 0 1 2 2v1a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4v-1a2 2 0 0 1 2-2h1V9z"
        fill="#F5E0CF" stroke="#C49080" strokeWidth="1" strokeLinejoin="round"
      />
      <path d="M12 10h2a2 2 0 0 1 2 2" stroke="#C49080" strokeWidth="1" fill="none" strokeLinecap="round" />
    </svg>
  );
}
