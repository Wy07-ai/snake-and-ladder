import DiceButton from './DiceButton.jsx'

function GameControls({ lastRoll, onRoll = () => {}, onReset = () => {} }) {
  return (
    <section className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-wa-primary/10 bg-wa-paper p-4" aria-label="Kontrol permainan">
      <div className="flex items-center gap-4">
        <DiceButton value={lastRoll} onRoll={onRoll} />
        <p className="text-sm text-wa-muted">Lempar dadu untuk bergerak</p>
      </div>
      <button
        className="rounded-md border border-wa-primary px-4 py-2 text-sm font-semibold text-wa-primary transition hover:bg-wa-soft"
        type="button"
        onClick={onReset}
      >
        Mulai ulang
      </button>
    </section>
  )
}

export default GameControls