import { useMemo } from 'react'
import { DEFAULT_BOARD } from '../../data/boardPresets.js'
import { buildLadder, buildSnake } from '../../engine/boardGeometry.js'

// Bentuk (geometri) dihitung ulang hanya saat papan berganti dan TIDAK bergantung pada
// tema, jadi posisi kotak/bidak tidak pernah berubah saat tema diganti. Warna, tebal,
// dan pola garis diatur tema lewat CSS variable (board.css). Hiasan yang bentuknya
// memang berbeda per tema (kepala ular, ujung tangga) digambar di bawah ini dalam
// koordinat lokal: titik (0,0) = kepala/ujung rel, sumbu +x = arah hadap, +y = samping.

const RAD_TO_DEG = 180 / Math.PI

// ---- Hiasan kepala ular per tema (kepala berjari-jari ~1.9) ----------------------
const SNAKE_HEADS = {
  // Naga sutra: tanduk emas dan kumis panjang.
  china: () => (
    <>
      <path className="board-orn-line" d="M0.4 -1.2 L-1.6 -2.8 M0.4 1.2 L-1.6 2.8" />
      <path className="board-orn-line" d="M1.6 -0.7 Q3.6 -0.6 4.4 -2.6 M1.6 0.7 Q3.6 0.6 4.4 2.6" />
      <circle className="board-orn-b" cx="-0.9" cy="0" r="0.45" />
    </>
  ),
  // Es runcing: topi Santa di belakang kepala.
  christmas: () => (
    <>
      <path className="board-orn-a" d="M1.1 -2 L1.1 2 L-3.6 1 Z" />
      <rect className="board-orn-b" x="0.7" y="-2.1" width="1" height="4.2" rx="0.5" />
      <circle className="board-orn-b" cx="-3.7" cy="1" r="0.8" />
    </>
  ),
  // Tengkorak: rongga mata gelap dan deretan gigi.
  halloween: () => (
    <>
      <path className="board-orn-line" d="M1.7 -0.9 L2.7 -0.9 M1.7 0 L2.9 0 M1.7 0.9 L2.7 0.9" stroke="#1a0b2e" />
      <path className="board-orn-line" d="M-0.4 -1.9 L-1.8 -3 M-0.4 1.9 L-1.8 3" />
    </>
  ),
  // Ular gurun: tanduk kecil dan kepala segitiga.
  desert: () => (
    <>
      <path className="board-orn-a" d="M0 -1.1 L-1 -2.9 L0.9 -1.6 Z M0 1.1 L-1 2.9 L0.9 1.6 Z" />
      <path className="board-orn-a" d="M2.9 0 L0.9 -1.5 L0.9 1.5 Z" />
    </>
  ),
  // Pita kerajaan: simpul pita bermata emas.
  royal: () => (
    <>
      <path className="board-orn-a" d="M-0.2 0 L-3 -2.4 L-3 2.4 Z" style={{ fill: 'var(--snake-body)' }} />
      <path className="board-orn-line" d="M-0.2 0 L-3 -2.4 L-3 2.4 Z" />
      <circle className="board-orn-b" cx="-0.2" cy="0" r="0.55" />
    </>
  ),
  // Sungai lava: tanduk melengkung dan jambul api.
  hell: () => (
    <>
      <path className="board-orn-line" d="M0.2 -1.3 Q-1.6 -1.6 -1.8 -3.4 M0.2 1.3 Q-1.6 1.6 -1.8 3.4" />
      <path className="board-orn-a" d="M-0.6 -0.9 L-2.6 -0.5 L-1.4 0 L-2.6 0.5 L-0.6 0.9 Z" />
    </>
  ),
}

// ---- Hiasan ujung atas tangga per tema (digambar di ujung setiap rel) -------------
const LADDER_FINIALS = {
  china: () => (
    <>
      <path className="board-orn-line" d="M0 0 L0.9 0" />
      <ellipse className="board-orn-a" cx="2" cy="0" rx="1.1" ry="0.85" />
      <path className="board-orn-line" d="M3.1 0 L3.9 0" />
    </>
  ),
  christmas: () => (
    <>
      <circle className="board-orn-a" cx="1.1" cy="0" r="0.85" />
      <circle className="board-orn-b" cx="0.8" cy="-0.3" r="0.22" />
    </>
  ),
  halloween: () => <path className="board-orn-a" d="M0 -0.7 L2.4 0 L0 0.7 Z" />,
  desert: () => <path className="board-orn-a" d="M0 0 L1.1 -0.9 L2.2 0 L1.1 0.9 Z" />,
  royal: () => (
    <>
      <circle className="board-orn-a" cx="1.1" cy="0" r="0.9" />
      <circle className="board-orn-b" cx="1.1" cy="0" r="0.3" />
    </>
  ),
  hell: () => (
    <>
      <path className="board-orn-a" d="M0 -0.85 Q1.6 -0.6 2.7 0 Q1.6 0.6 0 0.85 Z" />
      <path className="board-orn-b" d="M0.2 -0.35 Q1.1 -0.25 1.6 0 Q1.1 0.25 0.2 0.35 Z" />
    </>
  ),
}

function LocalGroup({ x, y, angle, children }) {
  return <g transform={`translate(${x} ${y}) rotate(${angle})`}>{children}</g>
}

function Connections({ board = DEFAULT_BOARD, theme = 'classic' }) {
  const { LADDER_SHAPES, SNAKE_SHAPES } = useMemo(() => ({
    LADDER_SHAPES: board.ladders.map((ladder) => ({
      key: `ladder-${ladder.start}`,
      ...buildLadder(ladder.start, ladder.end),
    })),
    SNAKE_SHAPES: board.snakes.map((snake) => {
      const shape = buildSnake(snake.start, snake.end)
      // Arah hadap kepala = dari titik kepala ke tengah kedua mata.
      const midX = (shape.eyes[0].x + shape.eyes[1].x) / 2
      const midY = (shape.eyes[0].y + shape.eyes[1].y) / 2
      const angle = Math.round(Math.atan2(midY - shape.head.y, midX - shape.head.x) * RAD_TO_DEG * 100) / 100
      return { key: `snake-${snake.start}`, angle, ...shape }
    }),
  }), [board])

  const Head = SNAKE_HEADS[theme]
  const Finial = LADDER_FINIALS[theme]

  return (
    <svg className="board-conns pointer-events-none absolute inset-0 z-10 size-full" viewBox="0 0 100 100" aria-hidden="true">
      {LADDER_SHAPES.map((ladder) => (
        <g key={ladder.key} className="board-conn board-conn--ladder">
          {ladder.rails.map((rail, index) => (
            <line key={`rail-${index}`} className="board-ladder-rail" {...rail} />
          ))}
          {ladder.rungs.map((rung, index) => (
            <line key={`rung-${index}`} className="board-ladder-rung" {...rung} />
          ))}
          {ladder.rails.map((rail, index) => (
            <line key={`rail-detail-${index}`} className="board-ladder-rail-detail" {...rail} />
          ))}
          {ladder.rungs.map((rung, index) => (
            <line key={`rung-detail-${index}`} className="board-ladder-rung-detail" {...rung} />
          ))}
          {Finial && (
            <g key={theme} className="board-orn">
              {ladder.rails.map((rail, index) => (
                <LocalGroup
                  key={`finial-${index}`}
                  x={rail.x2}
                  y={rail.y2}
                  angle={Math.atan2(rail.y2 - rail.y1, rail.x2 - rail.x1) * RAD_TO_DEG}
                >
                  <Finial />
                </LocalGroup>
              ))}
            </g>
          )}
        </g>
      ))}
      {SNAKE_SHAPES.map((snake) => (
        <g key={snake.key} className="board-conn board-conn--snake">
          <path className="board-snake-edge" d={snake.path} fill="none" strokeLinejoin="round" />
          <path className="board-snake-body" d={snake.path} fill="none" strokeLinejoin="round" />
          <path className="board-snake-belly" d={snake.path} fill="none" strokeLinecap="butt" strokeLinejoin="round" />
          <path className="board-snake-tongue" d={snake.tongue} />
          {Head && (
            <g key={theme} className="board-orn">
              <LocalGroup x={snake.head.x} y={snake.head.y} angle={snake.angle}>
                <Head />
              </LocalGroup>
            </g>
          )}
          <circle className="board-snake-body-fill" cx={snake.head.x} cy={snake.head.y} r="1.9" />
          {snake.eyes.map((eye, index) => (
            <circle key={`eye-${index}`} className="board-snake-eye" cx={eye.x} cy={eye.y} r="0.5" />
          ))}
        </g>
      ))}
    </svg>
  )
}

export default Connections
