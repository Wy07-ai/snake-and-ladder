import ChatPanel from './components/chat/ChatPanel.jsx'
import GameBoard from './components/board/GameBoard.jsx'
import GameControls from './components/controls/GameControls.jsx'
import { useAutoChat } from './hooks/useAutoChat.js'
import { useGame } from './hooks/useGame.js'

function App() {
  const { messages, sendMessage, triggerEvent, typingPersona } = useAutoChat()
  const {
    extraRollAvailable,
    gameWinner,
    isGameOver,
    isMoving,
    lastMove,
    lastRoll,
    playerPositions,
    playerPosition,
    players,
    resetGame,
    roll,
    turnStatus,
  } = useGame({ onGameEvent: triggerEvent })

  return (
    <main className="mx-auto grid min-h-screen w-full max-w-7xl gap-6 px-4 py-6 md:px-8 md:py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-wa-primary">Permainan keluarga</p>
          <h1 className="mt-2 text-3xl font-bold text-wa-ink md:text-4xl">Ular Tangga</h1>
        </div>
        <p className="rounded-full bg-wa-soft px-4 py-2 text-sm font-semibold text-wa-primary" aria-live="polite">
          {turnStatus}
        </p>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="grid gap-4" aria-label="Area permainan">
          <GameBoard playerPosition={playerPosition} playerPositions={playerPositions} players={players} />
          <GameControls
            extraRollAvailable={extraRollAvailable}
            gameWinner={gameWinner}
            isGameOver={isGameOver}
            isMoving={isMoving}
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

export default App
