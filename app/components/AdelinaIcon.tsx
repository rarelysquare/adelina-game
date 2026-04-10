export function AdelinaIcon({ className = "w-24 h-24" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Body / onesie */}
      <ellipse cx="50" cy="88" rx="20" ry="15" fill="#D8CCBA" />
      <ellipse cx="50" cy="82" rx="22" ry="18" fill="#EDE5D8" />

      {/* Neck */}
      <rect x="44" y="68" width="12" height="8" rx="4" fill="#F5E0CF" />

      {/* Head */}
      <circle cx="50" cy="46" r="30" fill="#F5E0CF" />

      {/* Hair */}
      <ellipse cx="50" cy="18" rx="14" ry="10" fill="#3D2B1F" />
      <path d="M36 24 Q30 16 36 10 Q44 5 50 8 Q56 5 64 10 Q70 16 64 24" fill="#3D2B1F" />
      {/* little hair wisp */}
      <path d="M50 8 Q53 2 56 4" stroke="#3D2B1F" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Rosy cheeks */}
      <circle cx="32" cy="52" r="8" fill="#F0B8A8" opacity="0.45" />
      <circle cx="68" cy="52" r="8" fill="#F0B8A8" opacity="0.45" />

      {/* Eyes — soft, slightly droopy */}
      <ellipse cx="42" cy="46" rx="4" ry="4.5" fill="#3D2B1F" />
      <ellipse cx="58" cy="46" rx="4" ry="4.5" fill="#3D2B1F" />
      {/* eye shine */}
      <circle cx="43.5" cy="44" r="1.5" fill="white" />
      <circle cx="59.5" cy="44" r="1.5" fill="white" />

      {/* Smile */}
      <path d="M43 57 Q50 63 57 57" stroke="#C49080" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Tiny arms */}
      <ellipse cx="24" cy="78" rx="8" ry="5" fill="#F5E0CF" transform="rotate(-20 24 78)" />
      <ellipse cx="76" cy="78" rx="8" ry="5" fill="#F5E0CF" transform="rotate(20 76 78)" />

      {/* Little hands */}
      <circle cx="18" cy="82" r="5" fill="#F5E0CF" />
      <circle cx="82" cy="82" r="5" fill="#F5E0CF" />
    </svg>
  );
}
