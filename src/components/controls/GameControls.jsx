import DiceButton from './DiceButton.jsx'

function GameControls({
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
    <section className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-wa-primary/10 bg-wa-paper p-4" aria-label="Kontrol permainan">
      <div className="flex items-center gap-4">
        <DiceButton value={lastRoll} rolling={isRolling} onRoll={onRoll} disabled={isMoving || isGameOver || !turnStatus?.startsWith('Giliran Kamu')} />
        <p className="text-sm text-wa-muted" aria-live="polite" role="status">{status}</p>
      </div>
      <button
        className="rounded-md border border-wa-primary px-4 py-2 text-sm font-semibold text-wa-primary transition hover:bg-wa-soft"
        type="button"
        onClick={onReset}
        disabled={isMoving}
      >
        Mulai ulang
      </button>
    </section>
  )
}

export default GameControls