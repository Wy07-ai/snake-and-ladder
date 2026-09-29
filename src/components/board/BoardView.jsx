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
function BoardView({ theme = 'classic', compact = false, children }) {
  return (
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
}

export default BoardView
