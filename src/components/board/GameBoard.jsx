import BoardCell from './BoardCell.jsx'

const squares = Array.from({ length: 10 }, (_, rowIndex) => {
  const rowFromBottom = 9 - rowIndex
  const firstSquare = rowFromBottom * 10 + 1
  const row = Array.from({ length: 10 }, (_, columnIndex) => firstSquare + columnIndex)
  return rowFromBottom % 2 === 0 ? row : row.reverse()
}).flat()

function GameBoard({ playerPosition = 1 }) {
  return (
    <div className="overflow-hidden rounded-lg border-4 border-wa-primary bg-wa-paper shadow-sm">
      <div className="grid grid-cols-10" aria-label="Papan ular tangga 100 kotak">
        {squares.map((square) => (
          <BoardCell key={square} square={square} isPlayerHere={square === playerPosition} />
        ))}
      </div>
    </div>
  )
}

export default GameBoard