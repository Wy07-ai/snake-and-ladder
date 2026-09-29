import DiceButton from './DiceButton.jsx'

function GameControls({
  canRoll = false,
  extraRollAvailable = false,
  gameWinner = null,
  isGameOver = false,
  isMoving = false,
  isRolling = false,
  lastMove = null,
  lastRoll,
  onRoll = () => {},
  onReset = () => {},
  turnStatus,
}) {
  const status = turnStatus ?? (
    isMoving
      ? 'Pion sedang bergerak...'
      : isGameOver
        ? `${gameWinner?.name ?? 'Kamu'} menang!`
        : extraRollAvailable
          ? 'Kamu mendapat satu lemparan ekstra setelah angka 6.'
          : lastMove === 'ladder'
            ? 'Naik tangga!'
            : lastMove === 'snake'
              ? 'Turun melalui ular.'
              : 'Lempar dadu untuk bergerak.'
  )

  return (
    <section className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 rounded-lg border border-wa-primary/10 bg-wa-paper p-4" aria-label="Kontrol permainan">
      <DiceButton value={lastRoll} rolling={isRolling} onRoll={onRoll} disabled={!canRoll} />
      <div className="grid justify-items-start gap-2">
        <p className="text-sm text-wa-muted" aria-live="polite" role="status">{status}</p>
        <button
          className="rounded-md border border-wa-primary px-3 py-1.5 text-sm font-semibold text-wa-primary transition hover:bg-wa-soft disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          onClick={onReset}
          disabled={isMoving}
        >
          Mulai ulang
        </button>
      </div>
    </section>
  )
}

export default GameControls