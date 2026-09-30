import Pawn from '../pawn/Pawn.jsx'

// Daftar pemain: bidak, nama, posisi, dan penanda giliran aktif.
// `className` mengatur jumlah kolom (bawaan 2, lalu 4 di layar sm ke atas). `compact`
// (layout HP) menumpuk bidak, nama, dan kotak secara vertikal agar empat pemain muat sebaris.
function PlayerList({ className = 'grid-cols-2 sm:grid-cols-4', compact = false, players, positions, currentPlayerId, isGameOver = false }) {
  return (
    <ul className={`grid gap-2 ${className}`} aria-label="Daftar pemain">
      {players.map((player) => {
        const isActive = !isGameOver && player.id === currentPlayerId

        return (
          <li
            key={player.id}
            className={`ui-panel flex ${isActive ? 'ui-panel--active' : ''} ${
              compact ? 'flex-col items-center gap-0.5 px-1 py-1.5 text-center' : 'items-center gap-2 px-2 py-1.5'
            }`}
            aria-current={isActive ? 'true' : undefined}
          >
            <Pawn avatar={player.avatar} shape={player.shape} color={player.color} className={compact ? 'size-7 shrink-0' : 'size-8 shrink-0'} />
            <span className="grid w-full min-w-0 leading-tight">
              <span className={`truncate font-bold ui-ink ${compact ? 'text-[11px]' : 'text-sm'}`}>{player.name}</span>
              <span className={compact ? 'text-[10px] ui-muted' : 'text-xs ui-muted'}>Kotak {positions[player.id]}</span>
            </span>
          </li>
        )
      })}
    </ul>
  )
}

export default PlayerList
