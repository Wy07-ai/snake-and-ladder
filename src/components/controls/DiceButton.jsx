function DiceButton({ value, onRoll, disabled = false }) {
  return (
    <button
      className="grid size-20 place-items-center rounded-lg border-2 border-wa-primary bg-wa-paper text-3xl font-bold text-wa-primary shadow-sm transition hover:bg-wa-soft disabled:cursor-not-allowed disabled:opacity-60"
      type="button"
      onClick={onRoll}
      disabled={disabled}
      aria-label="Lempar dadu"
    >
      {value ?? '?'}
    </button>
  )
}

export default DiceButton