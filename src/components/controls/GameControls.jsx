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
  rollingValue = null,
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
    <section className="ui-panel grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 p-4" aria-label="Kontrol permainan">
      <DiceButton value={lastRoll} target={rollingValue} rolling={isRolling} onRoll={onRoll} disabled={!canRoll} />
      <div className="grid justify-items-start gap-2">
        <p className="text-sm ui-muted" aria-live="polite" role="status">{status}</p>
        {canRoll && <p className="text-xs font-semibold ui-accent">Ketuk dadu untuk melempar.</p>}
        <button
          className="ui-btn px-3 py-1.5 text-sm"
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