import BoardCell from './BoardCell.jsx'
import { ladders, snakes } from '../../data/boardData.js'

const squares = Array.from({ length: 10 }, (_, rowIndex) => {
  const rowFromBottom = 9 - rowIndex
  const firstSquare = rowFromBottom * 10 + 1
  const row = Array.from({ length: 10 }, (_, columnIndex) => firstSquare + columnIndex)
  return rowFromBottom % 2 === 0 ? row : row.reverse()
}).flat()

const features = new Map()
for (const ladder of ladders) {
  features.set(ladder.start, { type: 'ladder-start', label: 'awal tangga, naik ke ' + ladder.end })
  features.set(ladder.end, { type: 'ladder-end', label: 'ujung tangga dari ' + ladder.start })
}
for (const snake of snakes) {
  features.set(snake.start, { type: 'snake-start', label: 'kepala ular, turun ke ' + snake.end })
  features.set(snake.end, { type: 'snake-end', label: 'ujung ular dari ' + snake.start })
}

function getSquareCenter(square) {
  const rowFromBottom = Math.floor((square - 1) / 10)
  const squareInRow = (square - 1) % 10
  const column = rowFromBottom % 2 === 0 ? squareInRow : 9 - squareInRow
  const rowFromTop = 9 - rowFromBottom

  return { x: column * 10 + 5, y: rowFromTop * 10 + 5 }
}

const connections = [
  ...ladders.map((connection) => ({ ...connection, type: 'ladder' })),
  ...snakes.map((connection) => ({ ...connection, type: 'snake' })),
]

function GameBoard({ playerPosition = 1 }) {
  const pawn = getSquareCenter(playerPosition)

  return (
    <div className="overflow-hidden rounded-lg border-4 border-wa-primary bg-wa-paper shadow-sm">
      <div className="relative">
        <div className="grid grid-cols-10" aria-label="Papan ular tangga 100 kotak">
        {squares.map((square) => (
            <BoardCell key={square} square={square} feature={features.get(square)} />
        ))}
        </div>
        <svg className="pointer-events-none absolute inset-0 z-10 size-full" viewBox="0 0 100 100" aria-hidden="true">
          {connections.map((connection) => {
            const start = getSquareCenter(connection.start)
            const end = getSquareCenter(connection.end)
            const color = connection.type === 'ladder' ? '#087f5b' : '#be3455'

            return (
              <g key={`${connection.type}-${connection.start}`} opacity="0.8">
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke={color}
                  strokeWidth="1.1"
                  strokeDasharray={connection.type === 'snake' ? '1.5 1' : undefined}
                  strokeLinecap="round"
                />
                <circle cx={start.x} cy={start.y} r="1.5" fill={color} />
                <circle cx={end.x} cy={end.y} r="1.5" fill={color} />
              </g>
            )
          })}
        </svg>
        <span
          className="pointer-events-none absolute z-20 grid size-[6%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-wa-primary text-[0.5rem] font-bold text-white shadow-md transition-[left,top] duration-150 ease-in-out sm:size-[5%] sm:text-xs"
          style={{ left: `${pawn.x}%`, top: `${pawn.y}%` }}
          aria-label={`Pion berada di kotak ${playerPosition}`}
          role="img"
        >
          P
        </span>
      </div>
    </div>
  )
}

export default GameBoard