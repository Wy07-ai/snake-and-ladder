import { useMemo, useState } from 'react'
import ChatPanel from '../components/chat/ChatPanel.jsx'
import GameBoard from '../components/board/GameBoard.jsx'
import GameControls from '../components/controls/GameControls.jsx'
import PlayerList from '../components/controls/PlayerList.jsx'
import { playSfx } from '../audio/audioEngine.js'
import { createPlayers } from '../engine/gameEngine.js'
import { useAutoChat } from '../hooks/useAutoChat.js'
import { useGame } from '../hooks/useGame.js'
import { useSettings } from '../settings/useSettings.js'

// Dua callback ini sengaja berada di luar komponen agar referensinya stabil.
const playNotification = () => playSfx('notification')

// Layar permainan. Hook game & chat dipasang di sini (bukan di App), sehingga
// setiap kali pemain menekan Start Game, permainan dimulai dari state bersih
// dan tidak ada timer bot yang berjalan saat pemain berada di lobby.
function GameScreen({ onBackToLobby = () => {} }) {
  const { settings, playerNames, toggleMute } = useSettings()
  // Nama, bidak, dan tema dibaca sekali saat permainan dimulai; mengubahnya dilakukan
  // di layar persiapan atau Settings, bukan di tengah giliran.
  const [players] = useState(() => createPlayers(settings.visual.pawn, playerNames))
  const names = useMemo(() => Object.fromEntries(players.map((player) => [player.id, player.name])), [players])
  const isMuted = settings.audio.muted
  const { messages, sendMessage, triggerEvent, typingPersona } = useAutoChat({
    names,
    onIncomingMessage: playNotification,
  })
  const {
    currentPlayer,
    extraRollAvailable,
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
    slidingPlayerId,
    turnStatus,
  } = useGame({ players, onGameEvent: triggerEvent, onSfx: playSfx })

  return (
    <main className="mx-auto grid w-full max-w-[100rem] gap-3 p-3 md:p-4 fit:h-dvh fit:grid-rows-[auto_minmax(0,1fr)] fit:overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-wa-primary">Permainan keluarga</p>
          <h1 className="text-2xl font-bold leading-tight text-wa-ink md:text-3xl">Ular Tangga</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <p className="rounded-full bg-wa-soft px-4 py-2 text-sm font-semibold text-wa-primary" aria-live="polite">
            {turnStatus}
          </p>
          <button
            className="rounded-md border border-wa-primary px-3 py-2 text-sm font-semibold text-wa-primary transition hover:bg-wa-soft active:scale-95"
            type="button"
            onClick={toggleMute}
            aria-pressed={isMuted}
            aria-label={isMuted ? 'Nyalakan suara' : 'Matikan suara'}
          >
            <span aria-hidden="true">{isMuted ? '🔇' : '🔊'}</span>
          </button>
          <button
            className="rounded-md border border-wa-primary px-4 py-2 text-sm font-semibold text-wa-primary transition hover:bg-wa-soft active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            type="button"
            onClick={onBackToLobby}
            disabled={isMoving}
          >
            ← Menu utama
          </button>
        </div>
      </header>

      {/* Layar lebar & tinggi (varian `fit:`): dua kolom setinggi layar. Kolom papan selebar
          sisi papan (tinggi layar dikurangi header ~5.5rem) dan sidebar 19-28rem, keduanya
          dipusatkan. Layar lain: menumpuk dan boleh di-scroll. */}
      <div className="grid gap-3 md:gap-4 fit:min-h-0 fit:grid-cols-[min(calc(100dvh-5.5rem),calc(100%-20rem))_minmax(19rem,28rem)] fit:justify-center">
        <section className="relative min-w-0 fit:min-h-0" aria-label="Area permainan">
          <GameBoard
            playerPosition={playerPosition}
            playerPositions={playerPositions}
            players={players}
            slidingPlayerId={slidingPlayerId}
            theme={settings.visual.theme}
          />
        </section>

        <div className="grid min-w-0 gap-3 fit:min-h-0 fit:grid-rows-[auto_auto_minmax(0,1fr)]">
          <PlayerList
            className="grid-cols-2 sm:grid-cols-4 fit:grid-cols-2"
            players={players}
            positions={playerPositions}
            currentPlayerId={currentPlayer.id}
            isGameOver={isGameOver}
          />
          <GameControls
            canRoll={currentPlayer.type === 'human' && !isMoving && !isGameOver}
            extraRollAvailable={extraRollAvailable}
            gameWinner={gameWinner}
            isGameOver={isGameOver}
            isMoving={isMoving}
            isRolling={isRolling}
            lastMove={lastMove}
            lastRoll={lastRoll}
            onRoll={roll}
            onReset={resetGame}
            turnStatus={turnStatus}
          />
          <ChatPanel
            className="fit:h-auto"
            memberNames={players.map((player) => player.name)}
            messages={messages}
            onSend={sendMessage}
            typingPersona={typingPersona}
          />
        </div>
      </div>
    </main>
  )
}

export default GameScreen
