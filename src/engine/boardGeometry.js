// Geometri papan 10x10 dalam koordinat 0-100 (sama dengan viewBox SVG papan).
// Semua fungsi murni sehingga mudah diuji dan tidak bergantung pada React.

// Urutan kotak dari kiri-atas ke kanan-bawah dengan pola zig-zag (boustrophedon).
export const SQUARES = Array.from({ length: 10 }, (_, rowIndex) => {
  const rowFromBottom = 9 - rowIndex
  const firstSquare = rowFromBottom * 10 + 1
  const row = Array.from({ length: 10 }, (_, columnIndex) => firstSquare + columnIndex)
  return rowFromBottom % 2 === 0 ? row : row.reverse()
}).flat()

export function getSquareCenter(square) {
  const rowFromBottom = Math.floor((square - 1) / 10)
  const squareInRow = (square - 1) % 10
  const column = rowFromBottom % 2 === 0 ? squareInRow : 9 - squareInRow
  const rowFromTop = 9 - rowFromBottom

  return { x: column * 10 + 5, y: rowFromTop * 10 + 5 }
}

const round = (value) => Math.round(value * 100) / 100

function describeLine(from, to) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const length = Math.hypot(dx, dy)
  const ux = dx / length
  const uy = dy / length
  return { dx, dy, length, ux, uy, nx: -uy, ny: ux }
}

// Tangga: dua sisi sejajar + anak tangga di antaranya.
export function buildLadder(fromSquare, toSquare) {
  const from = getSquareCenter(fromSquare)
  const to = getSquareCenter(toSquare)
  const { dx, dy, length, nx, ny } = describeLine(from, to)
  const half = 1.1

  const rails = [-1, 1].map((side) => ({
    x1: round(from.x + nx * half * side),
    y1: round(from.y + ny * half * side),
    x2: round(to.x + nx * half * side),
    y2: round(to.y + ny * half * side),
  }))

  const rungCount = Math.max(3, Math.floor(length / 4.5))
  const rungs = Array.from({ length: rungCount }, (_, index) => {
    const t = (index + 0.5) / rungCount
    const px = from.x + dx * t
    const py = from.y + dy * t
    return {
      x1: round(px - nx * half),
      y1: round(py - ny * half),
      x2: round(px + nx * half),
      y2: round(py + ny * half),
    }
  })

  return { rails, rungs }
}

// Ular: badan bergelombang dari kepala (kotak awal) ke ekor (kotak tujuan).
export function buildSnake(headSquare, tailSquare) {
  const head = getSquareCenter(headSquare)
  const tail = getSquareCenter(tailSquare)
  const { dx, dy, length, nx, ny } = describeLine(head, tail)

  const halfWaves = Math.max(2, Math.round(length / 7))
  const amplitude = 2.2
  const sampleCount = Math.max(24, Math.round(length * 2))

  const points = Array.from({ length: sampleCount + 1 }, (_, index) => {
    const t = index / sampleCount
    // Gelombang mengecil ke arah ekor agar ular tampak meruncing.
    const wobble = Math.sin(Math.PI * halfWaves * t) * amplitude * (1 - 0.45 * t)
    return { x: head.x + dx * t + nx * wobble, y: head.y + dy * t + ny * wobble }
  })

  const path = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'}${round(point.x)} ${round(point.y)}`)
    .join(' ')

  // Arah hadap kepala: berlawanan dengan arah badan yang keluar dari kepala.
  const facing = describeLine(points[1], head)
  const sideX = -facing.uy
  const sideY = facing.ux
  const at = (forward, side) => ({
    x: round(head.x + facing.ux * forward + sideX * side),
    y: round(head.y + facing.uy * forward + sideY * side),
  })

  const tongueBase = at(1.8, 0)
  const tongueTip = at(3.3, 0)
  const forkLeft = at(4.1, -0.7)
  const forkRight = at(4.1, 0.7)
  const tongue = `M${tongueBase.x} ${tongueBase.y} L${tongueTip.x} ${tongueTip.y} M${tongueTip.x} ${tongueTip.y} L${forkLeft.x} ${forkLeft.y} M${tongueTip.x} ${tongueTip.y} L${forkRight.x} ${forkRight.y}`

  return {
    path,
    head: { x: round(head.x), y: round(head.y) },
    eyes: [at(0.7, -0.95), at(0.7, 0.95)],
    tongue,
  }
}
