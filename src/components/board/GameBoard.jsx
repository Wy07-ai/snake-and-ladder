import BoardView from './BoardView.jsx'
import Pawn from '../pawn/Pawn.jsx'
import { getSquareCenter } from '../../engine/boardGeometry.js'

const DEFAULT_PLAYER = { id: 'human', name: 'Kamu', avatar: 'cat', shape: 'circle', color: '#075e54' }
const pawnOffsets = [
  { x: -2.3, y: -2.3 },
  { x: 2.3, y: -2.3 },
  { x: -2.3, y: 2.3 },
  { x: 2.3, y: 2.3 },
]

function GameBoard({
  playerPosition = 1,
  playerPositions = {},
  players = [DEFAULT_PLAYER],
  slidingPlayerId = null,
  theme = 'classic',
  layout = 'desktop',
}) {
  const pawns = players.map((player, index) => ({
    ...player,
    position: playerPositions[player.id] ?? playerPosition,
    offset: pawnOffsets[index % pawnOffsets.length],
  }))

  return (
    <BoardView theme={theme} fit={layout === 'mobile' ? 'width' : 'fill'}>
      {pawns.map((pawn) => {
        const center = getSquareCenter(pawn.position)
        // Pawn yang meluncur di tangga/ular bergerak lebih lambat agar terlihat.
        const isSliding = pawn.id === slidingPlayerId

        return (
          <span
            key={pawn.id}
            className={`pointer-events-none absolute size-[5.6%] -translate-x-1/2 -translate-y-1/2 transition-[left,top] ease-in-out motion-reduce:transition-none ${
              isSliding ? 'z-30 duration-700' : 'z-20 duration-150'
            }`}
            style={{ left: `${center.x + pawn.offset.x}%`, top: `${center.y + pawn.offset.y}%` }}
            aria-label={`${pawn.name} berada di kotak ${pawn.position}`}
            role="img"
          >
            <Pawn avatar={pawn.avatar} shape={pawn.shape} color={pawn.color} className="size-full" />
          </span>
        )
      })}
    </BoardView>
  )
}

export default GameBoard
