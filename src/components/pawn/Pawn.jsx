import { useId } from 'react'
import {
  AlienArt,
  AstronautArt,
  BunnyArt,
  CatArt,
  FoxArt,
  FrogArt,
  GhostArt,
  PandaArt,
  RobotArt,
} from './avatarArt.jsx'

const AVATAR_ART = {
  cat: CatArt,
  bunny: BunnyArt,
  alien: AlienArt,
  ghost: GhostArt,
  astronaut: AstronautArt,
  frog: FrogArt,
  fox: FoxArt,
  panda: PandaArt,
  robot: RobotArt,
}

// Siluet dasar bidak pada kanvas 64x64.
const SHAPE_PATHS = {
  circle: 'M4 32A28 28 0 1 1 60 32A28 28 0 1 1 4 32Z',
  square: 'M20 5H44A15 15 0 0 1 59 20V44A15 15 0 0 1 44 59H20A15 15 0 0 1 5 44V20A15 15 0 0 1 20 5Z',
  hexagon: 'M32 3L57 17.5V46.5L32 61L7 46.5V17.5Z',
  shield: 'M32 4L56 11V32C56 46 46 56 32 61C18 56 8 46 8 32V11Z',
}

// Bidak: alas berbentuk (warna pilihan) + kilau untuk kesan 3D + karakter 2D.
// Dekoratif secara default; beri `label` bila dipakai sebagai gambar bermakna.
function Pawn({ avatar = 'cat', shape = 'circle', color = '#075e54', className = 'size-10', label }) {
  const shineId = `pawn-shine-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const Art = AVATAR_ART[avatar] ?? CatArt
  const outline = SHAPE_PATHS[shape] ?? SHAPE_PATHS.circle

  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      style={{ overflow: 'visible', filter: 'drop-shadow(0 2px 1.5px rgba(0,0,0,0.35))' }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <defs>
        <radialGradient id={shineId} cx="0.32" cy="0.22" r="0.95">
          <stop offset="0" stopColor="#fff" stopOpacity="0.6" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.3" />
        </radialGradient>
      </defs>
      <path d={outline} fill={color} stroke="#fff" strokeWidth="3.5" strokeLinejoin="round" />
      <path d={outline} fill={`url(#${shineId})`} />
      <g transform="translate(32 33) scale(0.86) translate(-32 -32)">
        <Art />
      </g>
    </svg>
  )
}

export default Pawn
