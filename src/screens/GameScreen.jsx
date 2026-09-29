import { useState } from 'react'
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
  const { settings, toggleMute } = useSettings()
  // Bidak dan tema dibaca sekali saat permainan dimulai; mengubahnya dilakukan
  // di layar persiapan atau Settings, bukan di tengah giliran.
  const [players] = useState(() => createPlayers(settings.visual.pawn))
  const isMuted = settings.audio.muted
  const { messages, sendMessage, triggerEvent, typingPersona } = useAutoChat({
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
    <main className="mx-auto grid min-h-screen w-full max-w-7xl gap-6 px-4 py-6 md:px-8 md:py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-wa-primary">Permainan keluarga</p>
          <h1 className="mt-2 text-3xl font-bold text-wa-ink md:text-4xl">Ular Tangga</h1>
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

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="grid gap-4" aria-label="Area permainan">
          <GameBoard
            playerPosition={playerPosition}
            playerPositions={playerPositions}
            players={players}
            slidingPlayerId={slidingPlayerId}
            theme={settings.visual.theme}
          />
          <PlayerList
            players={players}
            positions={playerPositions}
            currentPlayerId={currentPlayer.id}
            isGameOver={isGameOver}
          />
          <GameControls
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
        </section>
        <ChatPanel messages={messages} onSend={sendMessage} typingPersona={typingPersona} />
      </div>
    </main>
  )
}

export default GameScreen
