// Option B: Tummy time — head up, propped on arms, looking curious/engaged
export function AdelinaB({ className = "w-56 h-40" }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 180" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <filter id="sketch-b" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.065" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.3" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <radialGradient id="cheek-b" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E8907A" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#E8907A" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ── Body on tummy ── */}
      {/* Body mass */}
      <path d="M 80 138 Q 130 148 200 138 Q 210 120 200 105 Q 170 110 130 108 Q 95 108 80 112 Q 70 122 80 138 Z"
        fill="#F0D5B8" stroke="#3D2010" strokeWidth="1.4" strokeLinejoin="round" />

      {/* Diaper bottom visible */}
      <path d="M 180 108 Q 200 112 208 125 Q 200 138 180 140 Q 200 120 180 108 Z"
        fill="#EDE5D8" stroke="#3D2010" strokeWidth="1.3" strokeLinejoin="round" />

      {/* Little feet kicking up in back */}
      <path d="M 195 108 Q 215 90 225 78 Q 232 82 228 90 Q 218 100 210 116 Z"
        fill="#F0D5B8" stroke="#3D2010" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round" />
      <ellipse cx="228" cy="76" rx="10" ry="7" fill="#F0D5B8" stroke="#3D2010" strokeWidth="1.3"
        transform="rotate(-30 228 76)" />

      {/* Second foot */}
      <path d="M 188 105 Q 202 82 208 70 Q 216 73 214 82 Q 205 93 200 110 Z"
        fill="#F0D5B8" stroke="#3D2010" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round" />

      {/* ── Left arm propped ── */}
      <path d="M 82 118 Q 68 130 55 145 Q 50 155 58 158 Q 66 158 68 148 Q 72 136 84 126 Z"
        fill="#F0D5B8" stroke="#3D2010" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
      {/* Left fist on ground */}
      <ellipse cx="58" cy="158" rx="11" ry="9" fill="#F0D5B8" stroke="#3D2010" strokeWidth="1.3" />
      <path d="M 50 156 Q 56 150 64 154" stroke="#3D2010" strokeWidth="0.9" fill="none" strokeLinecap="round" />

      {/* ── Right arm ── reaching slightly forward */}
      <path d="M 112 110 Q 105 125 95 140 Q 98 148 106 146 Q 112 136 116 122 Z"
        fill="#F0D5B8" stroke="#3D2010" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round" />
      <ellipse cx="100" cy="147" rx="10" ry="8" fill="#F0D5B8" stroke="#3D2010" strokeWidth="1.3" />

      {/* ── Head — angled slightly up/forward ── */}
      <path d="
        M 82 72
        C 92 50, 108 44, 126 48
        C 148 54, 162 72, 160 92
        C 158 108, 155 118, 148 126
        C 162 134, 158 150, 146 156
        C 132 164, 110 164, 95 156
        C 80 148, 72 134, 72 118
        C 68 104, 68 90, 82 72 Z"
        fill="#F0D5B8" stroke="#3D2010" strokeWidth="1.6" strokeLinejoin="round"
        filter="url(#sketch-b)" />

      {/* ── Hair ── */}
      <path d="
        M 84 72
        C 86 52, 100 42, 120 46
        C 138 50, 152 64, 154 80
        C 145 72, 134 66, 120 64
        C 110 62, 100 64, 92 68
        C 88 70, 86 72, 84 72 Z"
        fill="#2C1810" stroke="#2C1810" strokeWidth="0.8" strokeLinejoin="round" />
      {/* Hair sweep across forehead */}
      <path d="M 84 72 Q 98 60 118 62 Q 104 68 96 76"
        fill="#2C1810" stroke="none" />
      {/* Wisp */}
      <path d="M 118 46 Q 124 36 128 40"
        stroke="#2C1810" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* ── Ear ── */}
      <path d="M 72 102 Q 64 110 66 118 Q 68 124 74 122"
        fill="#F0D5B8" stroke="#3D2010" strokeWidth="1.3" strokeLinecap="round" />

      {/* ── Cheek blush ── */}
      <ellipse cx="88" cy="130" rx="20" ry="14" fill="url(#cheek-b)" />
      <ellipse cx="152" cy="126" rx="18" ry="13" fill="url(#cheek-b)" />

      {/* ── Eyes — wide open, looking up/forward ── */}
      <ellipse cx="104" cy="98" rx="13" ry="13" fill="white" stroke="#3D2010" strokeWidth="1.4" />
      <ellipse cx="138" cy="96" rx="13" ry="13" fill="white" stroke="#3D2010" strokeWidth="1.4" />
      <ellipse cx="105" cy="99" rx="9.5" ry="10" fill="#1A0F0A" />
      <ellipse cx="139" cy="97" rx="9.5" ry="10" fill="#1A0F0A" />
      <circle cx="109" cy="95" r="3.2" fill="white" />
      <circle cx="143" cy="93" r="3.2" fill="white" />
      <circle cx="102" cy="102" r="1.2" fill="white" opacity="0.5" />
      <circle cx="136" cy="100" r="1.2" fill="white" opacity="0.5" />
      {/* Upper eyelid */}
      <path d="M 92 94 Q 104 87 116 93" stroke="#3D2010" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M 126 92 Q 138 85 150 91" stroke="#3D2010" strokeWidth="1.6" fill="none" strokeLinecap="round" />

      {/* ── Eyebrows — slightly raised, curious ── */}
      <path d="M 92 84 Q 104 79 116 82" stroke="#2C1810" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 126 81 Q 138 76 150 80" stroke="#2C1810" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* ── Nose ── */}
      <circle cx="112" cy="114" r="2.2" fill="#C49080" />
      <circle cx="122" cy="114" r="2.2" fill="#C49080" />

      {/* ── Mouth — small, lips slightly parted ── */}
      <path d="M 104 126 Q 117 131 130 126" stroke="#C49080" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M 110 127 Q 117 130 124 127" stroke="#D4907A" strokeWidth="1" fill="#E8B0A0" opacity="0.5" strokeLinecap="round" />

      {/* Neck roll */}
      <path d="M 90 152 Q 118 158 146 152" stroke="#D4A888" strokeWidth="1.1" fill="none" strokeLinecap="round" />
    </svg>
  );
}
