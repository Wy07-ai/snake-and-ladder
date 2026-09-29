import BoardCell from './BoardCell.jsx'
import Connections from './Connections.jsx'
import { ladders, snakes } from '../../data/boardData.js'
import { SQUARES } from '../../engine/boardGeometry.js'

const features = new Map()
for (const ladder of ladders) {
  features.set(ladder.start, { type: 'ladder-start', label: 'awal tangga, naik ke ' + ladder.end })
  features.set(ladder.end, { type: 'ladder-end', label: 'ujung tangga dari ' + ladder.start })
}
for (const snake of snakes) {
  features.set(snake.start, { type: 'snake-start', label: 'kepala ular, turun ke ' + snake.end })
  features.set(snake.end, { type: 'snake-end', label: 'ujung ular dari ' + snake.start })
}

// Papan tanpa bidak: kotak + ular/tangga dengan tema tertentu. `children`
// (mis. bidak) dirender di atas papan. `compact` dipakai untuk pratinjau tema.
//
// `fit` membuat papan selalu persegi (10x10 simetris) dan seluas mungkin di dalam
// induknya, dihitung dari lebar DAN tinggi yang tersedia lewat container query:
//  - varian `fit:` (layar lebar & tinggi): papan mengisi induk, yang harus
//    `relative` dan punya tinggi dari layout (mis. baris grid `minmax(0,1fr)`).
//    Sisi papan = min(lebar induk, tinggi induk), jadi tidak pernah menimbulkan scroll.
//  - layar lain: lebar penuh induk, tetapi tidak lebih tinggi dari layar
//    (dikurangi ~8rem untuk header) agar papan tidak lebih besar dari viewport.
function BoardView({ theme = 'classic', compact = false, fit = false, children }) {
  const board = (
    <div className={`board${compact ? ' board--compact' : ''}`} data-board-theme={theme} aria-hidden={compact || undefined}>
      <div className="relative">
        <div className="grid grid-cols-10" aria-label="Papan ular tangga 100 kotak">
          {SQUARES.map((square) => (
            <BoardCell key={square} square={square} feature={features.get(square)} />
          ))}
        </div>
        <Connections />
        {children}
      </div>
    </div>
  )

  if (!fit) return board

  return (
    <div className="grid w-full justify-items-center [container-type:inline-size] fit:absolute fit:inset-0 fit:items-center fit:[container-type:size]">
      <div className="w-[min(100cqw,calc(100dvh-8rem))] fit:w-[min(100cqw,100cqh)]">{board}</div>
    </div>
  )
}

export default BoardView
