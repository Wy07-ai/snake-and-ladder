import { useMemo, useState } from 'react'
import RpgDialog from '../components/chat/RpgDialog.jsx'
import GameBoard from '../components/board/GameBoard.jsx'
import GameControls from '../components/controls/GameControls.jsx'
import PlayerList from '../components/controls/PlayerList.jsx'
import { playSfx } from '../audio/audioEngine.js'
import { resolveBoard } from '../engine/boardResolver.js'
import { createPlayers } from '../engine/gameEngine.js'
import { useAutoChat } from '../hooks/useAutoChat.js'
import { useGame } from '../hooks/useGame.js'
import { useSettings } from '../settings/useSettings.js'

// Dua callback ini sengaja berada di luar komponen agar referensinya stabil.
const playDialogBlip = () => playSfx('dialog')

const OUTLINE_BUTTON =
  'rounded-md border border-wa-primary bg-wa-paper/95 font-semibold text-wa-primary transition hover:bg-wa-soft active:scale-95 disabled:cursor-not-allowed disabled:opacity-60'

function Leaderboard({ entries }) {
  if (!entries.length) return null

  return (
    <section className="grid gap-2 rounded-lg border border-wa-primary/15 bg-wa-paper p-3" aria-label="Papan peringkat">
      <h2 className="text-sm font-bold text-wa-ink">Papan peringkat</h2>
      <ol className="grid gap-1">
        {entries.map((entry) => (
          <li key={entry.id} className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-2 border-t border-wa-soft py-1.5 text-sm">
            <span className="font-bold text-wa-primary">{entry.place}.</span>
            <span className="truncate font-semibold text-wa-ink">{entry.name}</span>
            <span className="text-xs text-wa-muted">Kotak {entry.position}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}

// Layar permainan. Hook game & dialog dipasang di sini (bukan di App), sehingga
// setiap kali pemain menekan Start Game, permainan dimulai dari state bersih
// dan tidak ada timer bot yang berjalan saat pemain berada di lobby.
//
// Dua layout, dipilih di Settings (`settings.layout.mode`) dan dihormati apa adanya,
// bukan ditebak dari ukuran layar:
//  - desktop: papan di kiri, sidebar (pemain, dadu, dialog bot) di kanan, tinggi
//    tepat satu layar tanpa scroll. Di layar sempit halaman menggulir ke samping,
//    seperti "situs desktop" di browser HP.
//  - mobile: satu kolom ringkas. Papan di atas, dialog bot di bawahnya, lalu pemain
//    dan dadu di dasar (terjangkau jempol). Halaman boleh menggulir vertikal.
// Isi game (hook, papan, kontrol) sama di keduanya; hanya susunannya yang berbeda.
function GameScreen({ onBackToLobby = () => {} }) {
  const { settings, playerNames, toggleMute } = useSettings()
  const isMobile = settings.layout.mode === 'mobile'
  // Nama, bidak, dan tema dibaca sekali saat permainan dimulai; mengubahnya dilakukan
  // di layar persiapan atau Settings, bukan di tengah giliran.
  const [players] = useState(() => createPlayers(settings.visual.pawn, playerNames, {
    ...settings.game,
    pawnsBySlot: settings.visual.pawnsBySlot,
  }))
  // Papan dipilih sekali saat permainan dimulai. Preset acak digenerate baru di sini, dan
  // lagi setiap "Mulai ulang" (lihat handleReset), sehingga tiap permainan baru berbeda.
  const [board, setBoard] = useState(() => resolveBoard(settings.game.boardPreset))
  const names = useMemo(
    () => Object.fromEntries(players.filter((player) => player.type === 'bot').map((player) => [player.id, player.name])),
    [players],
  )
  const isMuted = settings.audio.muted
  const { line, triggerEvent } = useAutoChat({
    names,
    difficulty: settings.game.difficulty,
    onLine: playDialogBlip,
    players,
  })
  const {
    currentPlayer,
    extraRollAvailable,
    leaderboard,
    gameWinner,
    isGameOver,
    isMoving,
    isRolling,
    lastMove,
    lastRoll,
    playerPositions,
    playerPosition,
    resetGame,
    roll,
    rollingValue,
    slidingPlayerId,
    turnStatus,
  } = useGame({ players, board, difficulty: settings.game.difficulty, finishMode: settings.game.finishMode, onGameEvent: triggerEvent, onSfx: playSfx })

  const handleReset = () => {
    if (isMoving) return
    if (board.procedural) setBoard(resolveBoard(board.presetId))
    resetGame()
  }

  // Nama papan yang dimainkan; papan acak juga menampilkan seed-nya agar bisa diulang.
  const boardCaption = (
    <>
      Papan: {board.emoji} {board.label}
      {board.procedural && <span className="ml-2 font-mono normal-case tracking-normal opacity-75">seed #{board.seed}</span>}
    </>
  )

  const muteButton = (
    <button
      className={`${OUTLINE_BUTTON} px-3 py-2 text-sm`}
      type="button"
      onClick={toggleMute}
      aria-pressed={isMuted}
      aria-label={isMuted ? 'Nyalakan suara' : 'Matikan suara'}
    >
      <span aria-hidden="true">{isMuted ? '🔇' : '🔊'}</span>
    </button>
  )

  const boardSection = (
    <section className="relative min-h-0 min-w-0" aria-label="Area permainan">
      <GameBoard
        layout={isMobile ? 'mobile' : 'desktop'}
        playerPosition={playerPosition}
        playerPositions={playerPositions}
        players={players}
        board={board}
        slidingPlayerId={slidingPlayerId}
        theme={settings.visual.theme}
      />
    </section>
  )

  const playerList = (
    <PlayerList
      className={isMobile ? 'grid-cols-4' : 'grid-cols-2'}
      compact={isMobile}
      players={players}
      positions={playerPositions}
      currentPlayerId={currentPlayer.id}
      isGameOver={isGameOver}
    />
  )

  const controls = (
    <GameControls
      canRoll={currentPlayer.type === 'human' && !isMoving && !isGameOver}
      extraRollAvailable={extraRollAvailable}
      gameWinner={gameWinner}
      isGameOver={isGameOver}
      isMoving={isMoving}
      isRolling={isRolling}
      lastMove={lastMove}
      lastRoll={lastRoll}
      rollingValue={rollingValue}
      onRoll={roll}
      onReset={handleReset}
      turnStatus={turnStatus}
    />
  )

  if (isMobile) {
    return (
      <main className="mx-auto grid min-h-dvh w-full max-w-[30rem] content-start gap-2.5 p-2.5" data-layout="mobile">
        <header className="flex items-center justify-between gap-2">
          <button className={`${OUTLINE_BUTTON} px-3 py-2 text-sm`} type="button" onClick={onBackToLobby} disabled={isMoving}>
            ← Menu
          </button>
          <h1 className="text-xl font-bold leading-tight text-[var(--page-ink)]">Ular Tangga</h1>
          {muteButton}
        </header>

        <p className="text-center text-xs font-semibold text-[var(--page-ink-soft)]">{boardCaption}</p>
        {boardSection}
        <RpgDialog compact line={line} players={players} />
        {playerList}
        <Leaderboard entries={leaderboard} />
        {controls}
      </main>
    )
  }

  return (
    <main
      className="mx-auto grid h-dvh min-h-[32rem] w-full min-w-[56rem] max-w-[100rem] grid-rows-[auto_minmax(0,1fr)] gap-3 overflow-hidden p-4"
      data-layout="desktop"
    >
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--page-ink-soft)]">{boardCaption}</p>
          <h1 className="text-3xl font-bold leading-tight text-[var(--page-ink)]">Ular Tangga</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <p className="rounded-full bg-wa-soft px-4 py-2 text-sm font-semibold text-wa-primary" aria-live="polite">
            {turnStatus}
          </p>
          {muteButton}
          <button className={`${OUTLINE_BUTTON} px-4 py-2 text-sm`} type="button" onClick={onBackToLobby} disabled={isMoving}>
            ← Menu utama
          </button>
        </div>
      </header>

      {/* Dua kolom setinggi layar. Kolom papan selebar sisi papan (tinggi layar dikurangi
          header ~5.5rem) dan sidebar 19-28rem, keduanya dipusatkan. Dialog bot tepat di bawah dadu. */}
      <div className="grid min-h-0 grid-cols-[min(calc(max(100dvh,32rem)-5.5rem),calc(100%-20rem))_minmax(19rem,28rem)] justify-center gap-4">
        {boardSection}
        <div className="grid min-h-0 min-w-0 grid-rows-[auto_auto_auto_minmax(0,1fr)] gap-3">
          {playerList}
          {controls}
          <Leaderboard entries={leaderboard} />
          <RpgDialog className="self-start" line={line} players={players} />
        </div>
      </div>
    </main>
  )
}

export default GameScreen
