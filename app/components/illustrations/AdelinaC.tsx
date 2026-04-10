// Option C: Happy baby on back — arms and legs up, big open smile
export function AdelinaC({ className = "w-52 h-52" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 240" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <filter id="sketch-c" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.065" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.3" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <radialGradient id="cheek-c" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E8907A" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#E8907A" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ── Body on back ── */}
      {/* Torso / onesie - lying down, foreshortened */}
      <path d="M 65 148 Q 110 162 155 148 Q 162 132 158 118 Q 110 128 62 118 Q 58 132 65 148 Z"
        fill="#F5EDE0" stroke="#3D2010" strokeWidth="1.4" strokeLinejoin="round" />
      {/* Onesie pattern hint */}
      <path d="M 80 122 Q 110 130 140 122" stroke="#D8CCBA" strokeWidth="0.9" fill="none" strokeLinecap="round" />
      <path d="M 76 132 Q 110 140 144 132" stroke="#D8CCBA" strokeWidth="0.9" fill="none" strokeLinecap="round" />

      {/* ── Left arm up and out ── */}
      <path d="M 65 124 Q 45 108 32 90 Q 24 82 28 74 Q 36 70 42 78 Q 52 94 68 116 Z"
        fill="#F0D5B8" stroke="#3D2010" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
      {/* Left hand — open, grabbing */}
      <ellipse cx="28" cy="74" rx="10" ry="9" fill="#F0D5B8" stroke="#3D2010" strokeWidth="1.3" />
      {/* Finger lines */}
      <path d="M 22 70 Q 26 66 30 70" stroke="#3D2010" strokeWidth="0.9" fill="none" strokeLinecap="round" />
      <path d="M 20 75 Q 24 70 30 74" stroke="#3D2010" strokeWidth="0.9" fill="none" strokeLinecap="round" />

      {/* ── Right arm up ── */}
      <path d="M 155 124 Q 175 108 188 90 Q 196 82 192 74 Q 184 70 178 78 Q 168 94 152 116 Z"
        fill="#F0D5B8" stroke="#3D2010" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
      <ellipse cx="192" cy="74" rx="10" ry="9" fill="#F0D5B8" stroke="#3D2010" strokeWidth="1.3" />
      <path d="M 186 70 Q 190 66 196 70" stroke="#3D2010" strokeWidth="0.9" fill="none" strokeLinecap="round" />
      <path d="M 185 75 Q 190 70 196 74" stroke="#3D2010" strokeWidth="0.9" fill="none" strokeLinecap="round" />

      {/* ── Legs up in the air ── */}
      {/* Left leg */}
      <path d="M 72 145 Q 55 160 44 178 Q 38 190 46 196 Q 56 198 62 188 Q 70 172 80 154 Z"
        fill="#F0D5B8" stroke="#3D2010" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
      {/* Left foot */}
      <ellipse cx="44" cy="196" rx="13" ry="9" fill="#F0D5B8" stroke="#3D2010" strokeWidth="1.3"
        transform="rotate(20 44 196)" />
      <path d="M 36 194 Q 40 188 48 191" stroke="#3D2010" strokeWidth="0.9" fill="none" strokeLinecap="round" />

      {/* Right leg */}
      <path d="M 148 145 Q 165 160 176 178 Q 182 190 174 196 Q 164 198 158 188 Q 150 172 140 154 Z"
        fill="#F0D5B8" stroke="#3D2010" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
      <ellipse cx="176" cy="196" rx="13" ry="9" fill="#F0D5B8" stroke="#3D2010" strokeWidth="1.3"
        transform="rotate(-20 176 196)" />
      <path d="M 168 194 Q 174 188 180 192" stroke="#3D2010" strokeWidth="0.9" fill="none" strokeLinecap="round" />

      {/* Baby rolls on thighs */}
      <path d="M 62 148 Q 68 155 75 152" stroke="#D4A888" strokeWidth="1" fill="none" strokeLinecap="round" />
      <path d="M 145 152 Q 152 155 158 148" stroke="#D4A888" strokeWidth="1" fill="none" strokeLinecap="round" />

      {/* ── Head ── lying back, face looking straight up at viewer */}
      <path d="
        M 110 18
        C 148 18, 172 40, 174 65
        C 176 85, 172 102, 168 114
        C 165 128, 176 142, 165 152
        C 152 162, 130 166, 110 166
        C 90 166, 68 162, 55 152
        C 44 142, 55 128, 52 114
        C 48 102, 44 85, 46 65
        C 48 40, 72 18, 110 18 Z"
        fill="#F0D5B8" stroke="#3D2010" strokeWidth="1.6" strokeLinejoin="round"
        filter="url(#sketch-c)" />

      {/* ── Hair ── */}
      <path d="
        M 56 65
        C 58 38, 78 18, 110 14
        C 142 18, 162 38, 164 65
        C 154 56, 140 50, 124 48
        C 114 46, 106 48, 100 50
        C 86 52, 70 58, 56 65 Z"
        fill="#2C1810" stroke="#2C1810" strokeWidth="0.8" strokeLinejoin="round" />
      <path d="M 56 65 Q 74 50 100 48 Q 82 58 74 72"
        fill="#2C1810" stroke="none" />
      {/* Wisp */}
      <path d="M 110 14 Q 116 4 120 8 Q 117 2 112 1"
        stroke="#2C1810" strokeWidth="2.2" fill="none" strokeLinecap="round" />

      {/* Ear — just barely visible */}
      <path d="M 46 90 Q 38 98 40 108 Q 42 116 48 114"
        fill="#F0D5B8" stroke="#3D2010" strokeWidth="1.2" strokeLinecap="round" />

      {/* ── Cheek blush — very prominent on this happy face ── */}
      <ellipse cx="64" cy="128" rx="24" ry="17" fill="url(#cheek-c)" />
      <ellipse cx="156" cy="128" rx="24" ry="17" fill="url(#cheek-c)" />

      {/* ── Eyes — squinting slightly with joy ── */}
      {/* Closed-ish happy eyes - curved lines with lower eyelid */}
      <path d="M 76 94 Q 88 86 100 92 Q 88 100 76 94 Z" fill="#1A0F0A" stroke="#3D2010" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M 120 92 Q 132 86 144 94 Q 132 100 120 92 Z" fill="#1A0F0A" stroke="#3D2010" strokeWidth="1.3" strokeLinejoin="round" />
      {/* Eye shines */}
      <ellipse cx="85" cy="91" rx="3" ry="2.5" fill="white" opacity="0.9" transform="rotate(-15 85 91)" />
      <ellipse cx="129" cy="91" rx="3" ry="2.5" fill="white" opacity="0.9" transform="rotate(15 129 91)" />
      {/* Lower eyelid crease (squinting from smile) */}
      <path d="M 76 96 Q 88 102 100 96" stroke="#3D2010" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M 120 96 Q 132 102 144 96" stroke="#3D2010" strokeWidth="1.2" fill="none" strokeLinecap="round" />

      {/* ── Eyebrows — raised with delight ── */}
      <path d="M 75 82 Q 88 76 101 80" stroke="#2C1810" strokeWidth="2.1" fill="none" strokeLinecap="round" />
      <path d="M 119 80 Q 132 76 145 82" stroke="#2C1810" strokeWidth="2.1" fill="none" strokeLinecap="round" />

      {/* ── Nose ── */}
      <circle cx="105" cy="112" r="2.2" fill="#C49080" />
      <circle cx="115" cy="112" r="2.2" fill="#C49080" />

      {/* ── Mouth — big open happy smile ── */}
      <path d="M 84 124 Q 110 144 136 124" stroke="#C49080" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Open mouth / teeth hint */}
      <path d="M 88 126 Q 110 142 132 126 Q 110 134 88 126 Z" fill="#E8B0A0" opacity="0.6" />
      {/* Gum smile (babies don't have teeth yet) */}
      <path d="M 90 128 Q 110 136 130 128" fill="white" opacity="0.5" stroke="none" />

      {/* Neck rolls */}
      <path d="M 82 158 Q 110 165 138 158" stroke="#D4A888" strokeWidth="1.1" fill="none" strokeLinecap="round" />
    </svg>
  );
}
