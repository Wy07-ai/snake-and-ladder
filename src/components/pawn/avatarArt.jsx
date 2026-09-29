// Gambar karakter 2D untuk bidak. Semua digambar pada kanvas 64x64 dan
// berpusat di (32, 32). Kontur gelap tipis membuat karakter tetap terbaca di
// atas warna bidak apa pun. Warna bidak sendiri diatur oleh Pawn.jsx.
const INK = '#263238'
const outline = { stroke: INK, strokeWidth: 1.6, strokeLinejoin: 'round' }
const line = { stroke: INK, strokeLinecap: 'round', fill: 'none' }

// Mata dengan kilau kecil. cx/cy bisa berupa string dari JSX, jadi diubah ke angka dulu.
function Eye({ cx, cy, rx = 2.4, ry = 3 }) {
  const x = Number(cx)
  const y = Number(cy)
  return (
    <>
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={INK} />
      <circle cx={x + 0.8} cy={y - 1.2} r="0.9" fill="#fff" />
    </>
  )
}

export function CatArt() {
  return (
    <>
      <path d="M16 26 L18 10 L29 18 Z" fill="#ff9f43" {...outline} />
      <path d="M48 26 L46 10 L35 18 Z" fill="#ff9f43" {...outline} />
      <path d="M20 22 L20.6 15 L25.5 18.6 Z" fill="#ffc4d6" />
      <path d="M44 22 L43.4 15 L38.5 18.6 Z" fill="#ffc4d6" />
      <ellipse cx="32" cy="35" rx="17" ry="14.5" fill="#ffb75e" {...outline} />
      <path d="M32 21.5 v4 M27.5 22.6 l1 3.2 M36.5 22.6 l-1 3.2" {...line} strokeWidth="1.5" stroke="#e8590c" />
      <Eye cx="25.5" cy="33" />
      <Eye cx="38.5" cy="33" />
      <path d="M29.8 38 h4.4 l-2.2 2.6 z" fill="#ff6b9d" />
      <path d="M32 40.6 v1.4 M32 42 q-2.6 2.4 -5 .6 M32 42 q2.6 2.4 5 .6" {...line} strokeWidth="1.3" />
      <path d="M14 36 h7 M14.5 40 l6.5 -1.6 M50 36 h-7 M49.5 40 l-6.5 -1.6" {...line} strokeWidth="1.1" />
    </>
  )
}

export function BunnyArt() {
  return (
    <>
      <ellipse cx="24.5" cy="16" rx="5" ry="11" fill="#fff" {...outline} />
      <ellipse cx="39.5" cy="16" rx="5" ry="11" fill="#fff" {...outline} />
      <ellipse cx="24.5" cy="17" rx="2.3" ry="7.5" fill="#ffc4d6" />
      <ellipse cx="39.5" cy="17" rx="2.3" ry="7.5" fill="#ffc4d6" />
      <ellipse cx="32" cy="38" rx="16" ry="13.5" fill="#fff" {...outline} />
      <circle cx="22" cy="42" r="2.6" fill="#ffc4d6" opacity="0.85" />
      <circle cx="42" cy="42" r="2.6" fill="#ffc4d6" opacity="0.85" />
      <Eye cx="26" cy="37" rx="2.2" ry="2.8" />
      <Eye cx="38" cy="37" rx="2.2" ry="2.8" />
      <ellipse cx="32" cy="41.5" rx="2.2" ry="1.6" fill="#ff6b9d" />
      <path d="M32 43 q-2.4 2.6 -4.6 .4 M32 43 q2.4 2.6 4.6 .4" {...line} strokeWidth="1.3" />
    </>
  )
}

export function AlienArt() {
  return (
    <>
      <path d="M32 12 v-5" {...line} strokeWidth="1.6" />
      <circle cx="32" cy="6.5" r="2.5" fill="#ff6b9d" {...outline} />
      <path
        d="M32 12 C46 12 52 26 46 38 C42 46 37 50 32 50 C27 50 22 46 18 38 C12 26 18 12 32 12 Z"
        fill="#a9e34b"
        {...outline}
      />
      <ellipse cx="24" cy="31" rx="5" ry="7.5" transform="rotate(-20 24 31)" fill="#1b1f24" />
      <ellipse cx="40" cy="31" rx="5" ry="7.5" transform="rotate(20 40 31)" fill="#1b1f24" />
      <circle cx="22.5" cy="28" r="1.5" fill="#fff" />
      <circle cx="38.5" cy="28" r="1.5" fill="#fff" />
      <path d="M28 43 q4 2.6 8 0" {...line} strokeWidth="1.4" />
    </>
  )
}

export function GhostArt() {
  return (
    <>
      <path
        d="M17 50 V31 C17 20 24 13 32 13 C40 13 47 20 47 31 V50 L42 46 L37 50 L32 46 L27 50 L22 46 Z"
        fill="#f8f9fa"
        {...outline}
      />
      <circle cx="22" cy="37" r="2.4" fill="#ffc9c9" />
      <circle cx="42" cy="37" r="2.4" fill="#ffc9c9" />
      <Eye cx="26" cy="30" rx="2.4" ry="3.4" />
      <Eye cx="38" cy="30" rx="2.4" ry="3.4" />
      <ellipse cx="32" cy="38" rx="2.6" ry="3.2" fill={INK} />
    </>
  )
}

export function AstronautArt() {
  return (
    <>
      <rect x="11.5" y="29" width="6" height="10" rx="2.4" fill="#adb5bd" {...outline} />
      <rect x="46.5" y="29" width="6" height="10" rx="2.4" fill="#adb5bd" {...outline} />
      <circle cx="32" cy="32" r="18" fill="#f1f3f5" {...outline} />
      <rect x="19" y="23.5" width="26" height="18" rx="9" fill="#1e3a5f" {...outline} />
      <path d="M23.5 30 q4.5 -3.4 9 -1.6" {...line} stroke="#fff" strokeWidth="2" opacity="0.85" />
      <circle cx="39.5" cy="36" r="1.1" fill="#fff" opacity="0.8" />
      <circle cx="32" cy="48" r="1.6" fill="#fa5252" />
    </>
  )
}

export function FrogArt() {
  return (
    <>
      <circle cx="22" cy="20" r="7.5" fill="#69db7c" {...outline} />
      <circle cx="42" cy="20" r="7.5" fill="#69db7c" {...outline} />
      <ellipse cx="32" cy="36" rx="19" ry="14" fill="#69db7c" {...outline} />
      <circle cx="22" cy="20" r="4.6" fill="#fff" />
      <circle cx="42" cy="20" r="4.6" fill="#fff" />
      <circle cx="22.7" cy="20.7" r="2.4" fill={INK} />
      <circle cx="41.3" cy="20.7" r="2.4" fill={INK} />
      <circle cx="29" cy="33.5" r="0.9" fill={INK} />
      <circle cx="35" cy="33.5" r="0.9" fill={INK} />
      <circle cx="20" cy="40" r="2.8" fill="#ff8787" opacity="0.75" />
      <circle cx="44" cy="40" r="2.8" fill="#ff8787" opacity="0.75" />
      <path d="M18 39 Q32 50 46 39" {...line} strokeWidth="1.8" />
    </>
  )
}

// Karakter khusus bot.
export function FoxArt() {
  return (
    <>
      <path d="M15 28 L17 9 L29 19 Z" fill="#ff922b" {...outline} />
      <path d="M49 28 L47 9 L35 19 Z" fill="#ff922b" {...outline} />
      <path d="M19.5 23 L19.6 14.5 L25.5 19 Z" fill="#5c3b1e" />
      <path d="M44.5 23 L44.4 14.5 L38.5 19 Z" fill="#5c3b1e" />
      <path
        d="M14 27 Q32 15 50 27 Q52 38 42 46 Q37 51 32 51 Q27 51 22 46 Q12 38 14 27 Z"
        fill="#ff922b"
        {...outline}
      />
      <path d="M20 40 Q26 38 32 43 Q38 38 44 40 Q40 48 32 51 Q24 48 20 40 Z" fill="#fff" />
      <path d="M20.5 28.5 L28 31.5 M43.5 28.5 L36 31.5" {...line} strokeWidth="2" />
      <Eye cx="25" cy="34" rx="2.1" ry="2.5" />
      <Eye cx="39" cy="34" rx="2.1" ry="2.5" />
      <ellipse cx="32" cy="46.5" rx="2.6" ry="2" fill={INK} />
    </>
  )
}

export function PandaArt() {
  return (
    <>
      <circle cx="19" cy="17" r="6.5" fill={INK} />
      <circle cx="45" cy="17" r="6.5" fill={INK} />
      <ellipse cx="32" cy="34" rx="18" ry="16" fill="#fff" {...outline} />
      <ellipse cx="24.5" cy="33" rx="4.6" ry="5.8" transform="rotate(20 24.5 33)" fill={INK} />
      <ellipse cx="39.5" cy="33" rx="4.6" ry="5.8" transform="rotate(-20 39.5 33)" fill={INK} />
      <path d="M22 33.5 q2.5 -3 5 0 M37 33.5 q2.5 -3 5 0" {...line} stroke="#fff" strokeWidth="1.7" />
      <ellipse cx="32" cy="40" rx="3" ry="2.2" fill={INK} />
      <path d="M27 44 Q32 52 37 44 Z" fill="#ff6b6b" {...outline} />
    </>
  )
}

export function RobotArt() {
  return (
    <>
      <path d="M32 15 v-6" {...line} strokeWidth="1.6" />
      <circle cx="32" cy="7.5" r="2.7" fill="#ff6b6b" {...outline} />
      <rect x="10.5" y="27" width="5" height="11" rx="1.8" fill="#868e96" {...outline} />
      <rect x="48.5" y="27" width="5" height="11" rx="1.8" fill="#868e96" {...outline} />
      <rect x="15" y="15" width="34" height="33" rx="8" fill="#ced4da" {...outline} />
      <rect x="19" y="23" width="26" height="14" rx="5" fill="#212529" {...outline} />
      <rect x="23" y="27" width="6" height="6" rx="2" fill="#22d3ee" />
      <rect x="35" y="27" width="6" height="6" rx="2" fill="#22d3ee" />
      <path d="M23 43 h18 M26.5 41.2 v3.6 M32 41.2 v3.6 M37.5 41.2 v3.6" {...line} strokeWidth="1.4" />
    </>
  )
}
