import { useEffect, useState } from 'react'

// Posisi titik pada grid 3x3 (indeks 0-8) untuk tiap sisi dadu.
const PIPS = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
}

function DiceButton({ value, onRoll, disabled = false, rolling = false }) {
  const [rollingFace, setRollingFace] = useState(1)

  // Selama dikocok, sisi dadu berganti acak sampai hasil sebenarnya diumumkan.
  useEffect(() => {
    if (!rolling) return undefined
    const timer = window.setInterval(() => setRollingFace(1 + Math.floor(Math.random() * 6)), 80)
    return () => window.clearInterval(timer)
  }, [rolling])

  const face = rolling ? rollingFace : value

  return (
    <button
      className={`grid size-20 place-items-center rounded-lg border-2 border-wa-primary bg-wa-paper text-3xl font-bold text-wa-primary shadow-sm transition hover:bg-wa-soft disabled:cursor-not-allowed disabled:opacity-60 ${
        rolling ? 'dice-rolling' : ''
      }`}
      type="button"
      onClick={onRoll}
      disabled={disabled}
      aria-label="Lempar dadu"
    >
      {face ? (
        <span className="grid size-14 grid-cols-3 grid-rows-3 place-items-center" aria-label={`Angka ${face}`} role="img">
          {Array.from({ length: 9 }, (_, index) => (
            <span
              key={index}
              className={`size-3 rounded-full ${PIPS[face].includes(index) ? 'bg-wa-primary' : 'bg-transparent'}`}
            />
          ))}
        </span>
      ) : (
        '?'
      )}
    </button>
  )
}

export default DiceButton
