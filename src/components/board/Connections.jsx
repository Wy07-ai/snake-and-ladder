import { ladders, snakes } from '../../data/boardData.js'
import { buildLadder, buildSnake } from '../../engine/boardGeometry.js'

// Bentuk dihitung sekali saat modul dimuat; warna diatur tema lewat CSS (board.css).
const LADDER_SHAPES = ladders.map((ladder) => ({
  key: `ladder-${ladder.start}`,
  ...buildLadder(ladder.start, ladder.end),
}))

const SNAKE_SHAPES = snakes.map((snake) => ({
  key: `snake-${snake.start}`,
  ...buildSnake(snake.start, snake.end),
}))

function Connections() {
  return (
    <svg className="pointer-events-none absolute inset-0 z-10 size-full" viewBox="0 0 100 100" aria-hidden="true">
      {LADDER_SHAPES.map((ladder) => (
        <g key={ladder.key} className="board-conn board-conn--ladder">
          {ladder.rails.map((rail, index) => (
            <line key={`rail-${index}`} className="board-ladder-rail" {...rail} />
          ))}
          {ladder.rungs.map((rung, index) => (
            <line key={`rung-${index}`} className="board-ladder-rung" {...rung} />
          ))}
        </g>
      ))}
      {SNAKE_SHAPES.map((snake) => (
        <g key={snake.key} className="board-conn board-conn--snake">
          <path className="board-snake-body" d={snake.path} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path className="board-snake-belly" d={snake.path} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path className="board-snake-tongue" d={snake.tongue} />
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
