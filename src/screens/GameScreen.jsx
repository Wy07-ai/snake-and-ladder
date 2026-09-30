import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import RpgDialog from '../components/chat/RpgDialog.jsx'
import GameBoard from '../components/board/GameBoard.jsx'
import GameControls from '../components/controls/GameControls.jsx'
import PlayerList from '../components/controls/PlayerList.jsx'
import GameSettingsModal from '../components/game/GameSettingsModal.jsx'
import { BOARD_THEMES } from '../data/boardThemes.js'
import { playSfx } from '../audio/audioEngine.js'
import { resolveBoard } from '../engine/boardResolver.js'
import { createPlayers } from '../engine/gameEngine.js'
import { useAutoChat } from '../hooks/useAutoChat.js'
import { useGame } from '../hooks/useGame.js'
import { useSettings } from '../settings/useSettings.js'

// Dua callback ini sengaja berada di luar komponen agar referensinya stabil.
const playDialogBlip = () => playSfx('dialog')

const OUTLINE_BUTTON = 'ui-btn'

function Leaderboard({ entries }) {
  if (!entries.length) return null

  return (
    <section className="ui-panel grid gap-2 p-3" aria-label="Papan peringkat">
      <h2 className="ui-ink text-sm font-bold">Papan peringkat</h2>
      <ol className="grid gap-1">
        {entries.map((entry) => (
          <li key={entry.id} className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-2 border-t border-[var(--panel-border)]/40 py-1.5 text-sm">
            <span className="ui-accent font-bold">{entry.place}.</span>
            <span className="ui-ink truncate font-semibold">{entry.name}</span>
            <span className="ui-muted text-xs">Kotak {entry.position}</span>
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
  const [settingsOpen, setSettingsOpen] = useState(false)
  const themeTitle = BOARD_THEMES.find((theme) => theme.id === settings.visual.theme)?.title ?? 'Klasik'
  const openSettings = useCallback(() => setSettingsOpen(true), [])
  const closeSettings = useCallback(() => setSettingsOpen(false), [])

  // Setelah keluar ke lobby, animasi giliran yang masih berjalan tidak boleh memutar suara lagi.
  const aliveRef = useRef(true)
  useEffect(() => {
    aliveRef.current = true
    return () => {
      aliveRef.current = false
    }
  }, [])
  const guardedSfx = useCallback((...args) => {
    if (aliveRef.current) playSfx(...args)
  }, [])
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
  } = useGame({ players, board, difficulty: settings.game.difficulty, finishMode: settings.game.finishMode, onGameEvent: triggerEvent, onSfx: guardedSfx, paused: settingsOpen })

  const handleReset = () => {
    if (isMoving) return
    if (board.procedural) setBoard(resolveBoard(board.presetId))
    resetGame()
  }

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

  const settingsButton = (label) => (
    <button
      className={`${OUTLINE_BUTTON} px-4 py-2 text-sm`}
      type="button"
      onClick={openSettings}
      aria-haspopup="dialog"
      aria-label="Buka pengaturan dan jeda"
    >
      <span aria-hidden="true">⚙️</span>{label && <span className="ml-1.5">{label}</span>}
    </button>
  )

  const title = `Ular Tangga - ${themeTitle}`

  const modal = settingsOpen && (
    <GameSettingsModal onResume={closeSettings} onExit={onBackToLobby} />
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
          <h1 className="min-w-0 truncate text-xl font-bold leading-tight text-[var(--page-ink)]">{title}</h1>
          <div className="flex shrink-0 items-center gap-2">
            {muteButton}
            {settingsButton()}
          </div>
        </header>

        {boardSection}
        <RpgDialog compact line={line} players={players} />
        {playerList}
        <Leaderboard entries={leaderboard} />
        {controls}
        {modal}
      </main>
    )
  }

  return (
    <main
      className="mx-auto grid h-dvh min-h-[32rem] w-full min-w-[56rem] max-w-[100rem] grid-rows-[auto_minmax(0,1fr)] gap-3 overflow-hidden p-4"
      data-layout="desktop"
    >
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <h1 className="text-3xl font-bold leading-tight text-[var(--page-ink)]">{title}</h1>
        <div className="flex flex-wrap items-center gap-3">
          <p className="ui-chip px-4 py-2 text-sm font-semibold" aria-live="polite">
            {turnStatus}
          </p>
          {muteButton}
          {settingsButton('Pengaturan')}
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
      {modal}
    </main>
  )
}

export default GameScreen
