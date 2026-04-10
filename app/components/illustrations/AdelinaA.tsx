// Adelina — chibi style, sitting. Adelina's dark sparse hair + lashes.
export function AdelinaA({ className = "w-48 h-52" }: { className?: string }) {
  return (
    <svg viewBox="0 0 280 310" xmlns="http://www.w3.org/2000/svg" className={className}>

      {/* ── Body ── */}
      {/* Torso */}
      <ellipse cx="140" cy="228" rx="52" ry="46"
        fill="#F5E5D0" stroke="#2D1B0E" strokeWidth="2" />

      {/* Left arm */}
      <ellipse cx="82" cy="232" rx="16" ry="22"
        fill="#F5E5D0" stroke="#2D1B0E" strokeWidth="1.8"
        transform="rotate(15 82 232)" />
      {/* Right arm */}
      <ellipse cx="198" cy="232" rx="16" ry="22"
        fill="#F5E5D0" stroke="#2D1B0E" strokeWidth="1.8"
        transform="rotate(-15 198 232)" />

      {/* Diaper */}
      <ellipse cx="140" cy="262" rx="50" ry="28"
        fill="#F0EDE8" stroke="#2D1B0E" strokeWidth="1.8" />
      {/* Diaper waist line */}
      <path d="M 95 248 Q 140 256 185 248"
        stroke="#DDD8D0" strokeWidth="1.4" fill="none" strokeLinecap="round" />

      {/* Left leg */}
      <ellipse cx="108" cy="288" rx="20" ry="14"
        fill="#F5E5D0" stroke="#2D1B0E" strokeWidth="1.8" />
      {/* Right leg */}
      <ellipse cx="172" cy="288" rx="20" ry="14"
        fill="#F5E5D0" stroke="#2D1B0E" strokeWidth="1.8" />

      {/* ── Head ── */}
      <circle cx="140" cy="118" r="90"
        fill="#F5E5D0" stroke="#2D1B0E" strokeWidth="2.2" />

      {/* Ear */}
      <ellipse cx="224" cy="124" rx="12" ry="16"
        fill="#F5E5D0" stroke="#2D1B0E" strokeWidth="1.8" />
      {/* Ear inner */}
      <path d="M 228 118 Q 232 124 228 130"
        stroke="#D4A888" strokeWidth="1.2" fill="none" strokeLinecap="round" />

      {/* ── Adelina hair — dark, sparse wisps ── */}
      {/* Just a few thin dark strands — not a full hair cap */}
      {/* Center wisp curling up */}
      <path d="M 140 30 Q 144 18 140 12 Q 136 18 140 30"
        stroke="#1A0F08" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      {/* Small tuft at top center */}
      <path d="M 126 34 Q 130 24 138 28"
        stroke="#1A0F08" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 154 34 Q 150 24 142 28"
        stroke="#1A0F08" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* A few sparse strands across the top */}
      <path d="M 95 58 Q 108 42 124 44"
        stroke="#1A0F08" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M 185 58 Q 172 42 156 44"
        stroke="#1A0F08" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      {/* Very thin side strands */}
      <path d="M 80 90 Q 86 72 100 68"
        stroke="#1A0F08" strokeWidth="1.6" fill="none" strokeLinecap="round" />

      {/* ── Cheeks — soft, low on face ── */}
      <circle cx="92" cy="148" r="26" fill="#F0907A" opacity="0.28" />
      <circle cx="188" cy="148" r="26" fill="#F0907A" opacity="0.28" />
      {/* Cheek sheen dots like chibi reference */}
      <circle cx="84" cy="142" r="3.5" fill="white" opacity="0.6" />
      <circle cx="94" cy="150" r="2" fill="white" opacity="0.5" />
      <circle cx="180" cy="142" r="3.5" fill="white" opacity="0.6" />
      <circle cx="190" cy="150" r="2" fill="white" opacity="0.5" />

      {/* ── Eyes — two filled rounded ovals like chibi ── */}
      <ellipse cx="114" cy="118" rx="11" ry="12" fill="#1A0F08" />
      <ellipse cx="166" cy="118" rx="11" ry="12" fill="#1A0F08" />
      {/* Eye shine */}
      <circle cx="118" cy="113" r="4" fill="white" />
      <circle cx="170" cy="113" r="4" fill="white" />
      <circle cx="111" cy="121" r="1.8" fill="white" opacity="0.5" />
      <circle cx="163" cy="121" r="1.8" fill="white" opacity="0.5" />

      {/* ── Eyelashes — simple strokes above eyes, like chibi girl ref ── */}
      {/* Left eye lashes */}
      <line x1="105" y1="108" x2="101" y2="100" stroke="#1A0F08" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="113" y1="106" x2="111" y2="97" stroke="#1A0F08" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="121" y1="107" x2="121" y2="98" stroke="#1A0F08" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="128" y1="109" x2="130" y2="101" stroke="#1A0F08" strokeWidth="1.8" strokeLinecap="round" />
      {/* Right eye lashes */}
      <line x1="157" y1="109" x2="155" y2="101" stroke="#1A0F08" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="165" y1="106" x2="163" y2="97" stroke="#1A0F08" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="173" y1="106" x2="173" y2="97" stroke="#1A0F08" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="180" y1="108" x2="183" y2="100" stroke="#1A0F08" strokeWidth="1.8" strokeLinecap="round" />

      {/* ── Nose — two tiny dots ── */}
      <circle cx="132" cy="140" r="2.8" fill="#C49080" />
      <circle cx="148" cy="140" r="2.8" fill="#C49080" />

      {/* ── Mouth — gentle closed curve ── */}
      <path d="M 126 158 Q 140 166 154 158"
        stroke="#C49080" strokeWidth="2.2" fill="none" strokeLinecap="round" />

    </svg>
  );
}
