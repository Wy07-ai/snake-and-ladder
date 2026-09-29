import Pawn from '../pawn/Pawn.jsx'

// Daftar pemain: bidak, nama, posisi, dan penanda giliran aktif.
// `className` mengatur jumlah kolom (bawaan 2, lalu 4 di layar sm ke atas).
function PlayerList({ className = 'grid-cols-2 sm:grid-cols-4', players, positions, currentPlayerId, isGameOver = false }) {
  return (
    <ul className={`grid gap-2 ${className}`} aria-label="Daftar pemain">
      {players.map((player) => {
        const isActive = !isGameOver && player.id === currentPlayerId

        return (
          <li
            key={player.id}
            className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 transition ${
              isActive ? 'border-wa-primary bg-wa-soft' : 'border-wa-primary/10 bg-wa-paper'
            }`}
            aria-current={isActive ? 'true' : undefined}
          >
            <Pawn avatar={player.avatar} shape={player.shape} color={player.color} className="size-8 shrink-0" />
            <span className="grid min-w-0 leading-tight">
              <span className="truncate text-sm font-bold text-wa-ink">{player.name}</span>
              <span className="text-xs text-wa-muted">Kotak {positions[player.id]}</span>
            </span>
          </li>
        )
      })}
    </ul>
  )
}

export default PlayerList
