import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

// ── 3D-style male character: dark quiff hair, full beard, blue glasses,
//    navy blazer, namaste pose, cursor-tracking eyes ─────────────────────────
function MaleNamasteCharacter({ primary, secondary }: { primary: string; secondary: string }) {
  const [pupil, setPupil] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      // Eyes sit at ~24% down the rendered height
      const eyeSX = rect.left + rect.width  * 0.5;
      const eyeSY = rect.top  + rect.height * 0.24;
      const dx = e.clientX - eyeSX;
      const dy = e.clientY - eyeSY;
      const dist = Math.hypot(dx, dy) || 1;
      const travel = Math.min(dist / 75, 1) * 2.6;
      setPupil({ x: (dx / dist) * travel, y: (dy / dist) * travel });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // ── Palette ──────────────────────────────────────────────────────────────
  const skinMid   = '#C07040';
  const skinDark  = '#8A4818';
  const hair      = '#161008';
  const beard     = '#1C1410';
  const blazer    = '#1A2845';
  const blazerHi  = '#243562';
  const shirt     = '#EDEBE4';
  const gf        = '#2B4BA0';   // glasses frame
  const gl        = 'rgba(120,160,255,0.07)'; // glasses lens tint

  // Eye centres in the 240-wide viewBox
  const L = { x: 104, y: 74 };
  const R = { x: 136, y: 74 };

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 240 308"
      fill="none"
      style={{
        width: 290,
        height: 362,
        flexShrink: 0,
        filter: 'drop-shadow(0 16px 40px rgba(0,0,0,0.22))',
      }}
    >
      <defs>
        {/* Face radial – light centre, darker edges for 3-D roundness */}
        <radialGradient id="ty_face" cx="42%" cy="36%" r="64%">
          <stop offset="0%"   stopColor="#D08848" />
          <stop offset="100%" stopColor="#9A5020" />
        </radialGradient>
        {/* Blazer linear – darker on both sides */}
        <linearGradient id="ty_blaz" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#101E38" />
          <stop offset="48%"  stopColor={blazer}  />
          <stop offset="100%" stopColor="#101E38" />
        </linearGradient>
        {/* Hair radial – slight sheen highlight */}
        <radialGradient id="ty_hair" cx="50%" cy="22%" r="75%">
          <stop offset="0%"   stopColor="#262016" />
          <stop offset="100%" stopColor="#060402" />
        </radialGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="120" cy="303" rx="62" ry="8" fill="rgba(0,0,0,0.09)" />

      {/* ══ BODY ══════════════════════════════════════════════════════════ */}

      {/* Blazer body */}
      <path
        d="M 42 132 L 198 132 Q 216 172 210 288 L 30 288 Q 24 172 42 132 Z"
        fill="url(#ty_blaz)"
      />

      {/* Left lapel */}
      <path d="M 42 132 Q 68 156 96 162 L 108 132 Z" fill={blazerHi} />
      {/* Right lapel */}
      <path d="M 198 132 Q 172 156 144 162 L 132 132 Z" fill={blazerHi} />

      {/* Shirt / collar visible */}
      <path d="M 107 132 L 120 168 L 133 132 Z" fill={shirt} />
      <path
        d="M 109 132 L 120 160 L 131 132 L 127 132 L 120 153 L 113 132 Z"
        fill={shirt}
      />

      {/* ── Left arm – wide stroke sweeping out then inward to prayer ── */}
      <path
        d="M 45 152 Q 16 196 90 220"
        stroke={blazer} strokeWidth="40" strokeLinecap="round" fill="none"
      />
      {/* arm edge highlight */}
      <path
        d="M 45 152 Q 16 196 90 220"
        stroke={blazerHi} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.45"
      />

      {/* ── Right arm mirror ── */}
      <path
        d="M 195 152 Q 224 196 150 220"
        stroke={blazer} strokeWidth="40" strokeLinecap="round" fill="none"
      />
      <path
        d="M 195 152 Q 224 196 150 220"
        stroke={blazerHi} strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.45"
      />

      {/* ══ PRAYER HANDS ══════════════════════════════════════════════════ */}
      {/* Teardrop pointing upward, centred on chest */}
      <path
        d="M 120 170
           C 108 172  97 190  97 210
           C  97 224 105 231 120 231
           C 135 231 143 224 143 210
           C 143 190 132 172 120 170 Z"
        fill="url(#ty_face)"
      />
      {/* Palm crease */}
      <line x1="120" y1="173" x2="120" y2="230"
        stroke={skinDark} strokeWidth="0.9" opacity="0.18" />
      {/* Finger hints – left */}
      <path d="M 110 193 C 109 184 109.5 178 111 174"
        stroke={skinDark} strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.14" />
      <path d="M 114 187 C 113 179 113.5 173 115 170"
        stroke={skinDark} strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.14" />
      {/* Finger hints – right */}
      <path d="M 130 193 C 131 184 130.5 178 129 174"
        stroke={skinDark} strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.14" />
      <path d="M 126 187 C 127 179 126.5 173 125 170"
        stroke={skinDark} strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.14" />
      {/* Wrist cuff / bracelet accent */}
      <path d="M 99 224 Q 120 219 141 224"
        stroke={secondary} strokeWidth="3.8" strokeLinecap="round" fill="none" opacity="0.65" />

      {/* ══ NECK ══════════════════════════════════════════════════════════ */}
      <rect x="105" y="114" width="30" height="22" rx="7" fill="url(#ty_face)" />
      {/* Neck side shadows */}
      <rect x="105" y="114" width="6"  height="22" rx="4" fill={skinDark} opacity="0.16" />
      <rect x="129" y="114" width="6"  height="22" rx="4" fill={skinDark} opacity="0.16" />

      {/* ══ EARS ═════════════════════════════════════════════════════════ */}
      <ellipse cx="79"  cy="80" rx="9"   ry="12" fill="url(#ty_face)" />
      <ellipse cx="79"  cy="80" rx="5.5" ry="7.5" fill={skinDark} opacity="0.2" />
      <ellipse cx="161" cy="80" rx="9"   ry="12" fill="url(#ty_face)" />
      <ellipse cx="161" cy="80" rx="5.5" ry="7.5" fill={skinDark} opacity="0.2" />

      {/* ══ HEAD SPHERE ══════════════════════════════════════════════════ */}
      <circle cx="120" cy="76" r="43" fill="url(#ty_face)" />
      {/* Cheek blush / depth */}
      <ellipse cx="82"  cy="84" rx="11" ry="20" fill={skinDark} opacity="0.1" />
      <ellipse cx="158" cy="84" rx="11" ry="20" fill={skinDark} opacity="0.1" />

      {/* ══ HAIR ══════════════════════════════════════════════════════════ */}
      {/* Back/sides base */}
      <path
        d="M 79 65 Q 78 38 120 33 Q 162 38 161 65
           Q 152 44 120 42 Q 88 44 79 65 Z"
        fill="url(#ty_hair)"
      />
      {/* Side sideburns */}
      <path d="M 79 63 Q 78 76 79 90"
        stroke={hair} strokeWidth="11" strokeLinecap="round" fill="none" />
      <path d="M 161 63 Q 162 76 161 90"
        stroke={hair} strokeWidth="11" strokeLinecap="round" fill="none" />
      {/* Quiff main volume – sweeps up and slightly forward */}
      <path
        d="M 88 52 Q 85 20 120 15 Q 155 20 152 48
           Q 142 26 120 24 Q 98 26 88 52 Z"
        fill="url(#ty_hair)"
      />
      {/* Quiff front-sweep edge detail */}
      <path d="M 93 44 Q 108 28 120 26 Q 132 28 147 42"
        stroke="#252016" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.55" />
      {/* Sheen highlight on quiff top */}
      <path d="M 107 32 Q 116 25 126 29"
        stroke="#30281A" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.38" />

      {/* ══ EYEBROWS (thick – male) ═══════════════════════════════════════ */}
      <path d="M 92 62 Q 103 58 114 60"
        stroke={hair} strokeWidth="3.8" strokeLinecap="round" fill="none" />
      <path d="M 126 60 Q 137 58 148 62"
        stroke={hair} strokeWidth="3.8" strokeLinecap="round" fill="none" />

      {/* ══ EYE WHITES ════════════════════════════════════════════════════ */}
      <ellipse cx={L.x} cy={L.y} rx="9.5" ry="9"   fill="white" />
      <ellipse cx={R.x} cy={R.y} rx="9.5" ry="9"   fill="white" />

      {/* Irises */}
      <circle cx={L.x + pupil.x} cy={L.y + pupil.y} r="6"   fill="#3A2010" />
      <circle cx={R.x + pupil.x} cy={R.y + pupil.y} r="6"   fill="#3A2010" />
      {/* Pupils */}
      <circle cx={L.x + pupil.x} cy={L.y + pupil.y} r="3.1" fill="#080604" />
      <circle cx={R.x + pupil.x} cy={R.y + pupil.y} r="3.1" fill="#080604" />
      {/* Catchlights */}
      <circle cx={L.x + pupil.x + 2.2} cy={L.y + pupil.y - 2.2} r="1.3" fill="white" />
      <circle cx={R.x + pupil.x + 2.2} cy={R.y + pupil.y - 2.2} r="1.3" fill="white" />
      {/* Eye outlines */}
      <ellipse cx={L.x} cy={L.y} rx="9.5" ry="9"   stroke={hair} strokeWidth="0.7" fill="none" />
      <ellipse cx={R.x} cy={R.y} rx="9.5" ry="9"   stroke={hair} strokeWidth="0.7" fill="none" />

      {/* ══ GLASSES ═══════════════════════════════════════════════════════ */}
      {/* Left lens */}
      <rect x="91"  y="63" width="26" height="21" rx="3.5"
        fill={gl} stroke={gf} strokeWidth="2.3" />
      {/* Right lens */}
      <rect x="123" y="63" width="26" height="21" rx="3.5"
        fill={gl} stroke={gf} strokeWidth="2.3" />
      {/* Bridge */}
      <path d="M 117 73 L 123 73" stroke={gf} strokeWidth="2.1" strokeLinecap="round" />
      {/* Left temple arm */}
      <path d="M 91 71 Q 83 71 79 74"
        stroke={gf} strokeWidth="1.9" strokeLinecap="round" fill="none" />
      {/* Right temple arm */}
      <path d="M 149 71 Q 157 71 161 74"
        stroke={gf} strokeWidth="1.9" strokeLinecap="round" fill="none" />
      {/* Lens glare (top-left corner of each lens) */}
      <path d="M 95 66 L 103 66" stroke="rgba(255,255,255,0.55)" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M 127 66 L 135 66" stroke="rgba(255,255,255,0.55)" strokeWidth="1.6" strokeLinecap="round" />

      {/* ══ NOSE ═══════════════════════════════════════════════════════════ */}
      {/* Bridge shadow lines */}
      <path d="M 117 83 Q 115 91 116 97"
        stroke={skinDark} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.28" />
      <path d="M 123 83 Q 125 91 124 97"
        stroke={skinDark} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.28" />
      {/* Nostrils */}
      <ellipse cx="116" cy="97" rx="4.2" ry="3"   fill={skinDark} opacity="0.22" />
      <ellipse cx="124" cy="97" rx="4.2" ry="3"   fill={skinDark} opacity="0.22" />
      <path d="M 113 96 Q 120 99 127 96"
        stroke={skinDark} strokeWidth="1" fill="none" opacity="0.22" />

      {/* ══ BEARD (full beard — covers jaw, chin, cheeks) ══════════════════ */}
      {/* Main beard mass */}
      <path
        d="M 85 90
           Q 79 104  81 120
           Q 89 140 120 143
           Q 151 140 159 120
           Q 161 104 155 90
           Q 148 79  141 77
           Q 137 96  120 98
           Q 103 96   99 77
           Q  92 79   85 90 Z"
        fill={beard}
      />
      {/* Beard texture – subtle highlight lines */}
      <path d="M 97 110 Q 106 120 120 122"
        stroke="#2C2418" strokeWidth="1.1" fill="none" opacity="0.28" />
      <path d="M 143 110 Q 134 120 120 122"
        stroke="#2C2418" strokeWidth="1.1" fill="none" opacity="0.28" />
      {/* Cheek beard blend */}
      <path d="M 85 90 Q 82 100 83 114"
        stroke={beard} strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.55" />
      <path d="M 155 90 Q 158 100 157 114"
        stroke={beard} strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.55" />
      {/* Mustache (sits just below nose, connects to beard) */}
      <path d="M 106 98 Q 113 101 120 100 Q 127 101 134 98"
        stroke={beard} strokeWidth="4.2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export function ThankYouPage() {
  const { settings } = useTheme();
  const pri = settings.primaryColor;
  const sec = settings.secondaryColor;
  const ff  = `var(--md-font-family, ${settings.fontFamily})`;
  const dark = settings.darkMode;
  const bg        = dark ? '#141414' : '#f0f4ff';
  const textColor = dark ? '#e0e0e0' : '#1a1a2e';

  return (
    <div
      className="w-full h-full overflow-y-auto"
      style={{ background: bg, fontFamily: ff }}
    >
      <div className="max-w-2xl mx-auto px-6 py-10 flex flex-col items-center gap-8">

        {/* ── 3D male character below the card ── */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.55, duration: 0.6, type: 'spring' }}
          className="flex flex-col items-center"
        >
          <MaleNamasteCharacter primary={pri} secondary={sec} />
        </motion.div>

      </div>
    </div>
  );
}