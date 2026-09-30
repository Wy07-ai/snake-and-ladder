import { memo, useEffect, useState } from 'react'
import { DICE_LAND_MS, DICE_PEAK_MS, DICE_ROLL_MS } from '../../engine/gameEngine.js'

// Posisi titik pada grid 3x3 (indeks 0-8) untuk tiap sisi dadu.
const PIPS = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
}

// Enam sisi kubus. Sisi yang saling berhadapan selalu berjumlah 7.
const FACES = ['front', 'back', 'right', 'left', 'top', 'bottom']

// Jeda antar pergantian angka acak: mulai cepat lalu makin lambat, sehingga
// angkanya terasa "melambat" sebelum berhenti di hasil sebenarnya.
const SCRAMBLE_FIRST_MS = 70
const SCRAMBLE_SLOWDOWN = 1.22
const SCRAMBLE_MAX_MS = 240

// Posisi diam: hanya sisi depan yang terlihat dan menunjukkan hasil lemparan.
function restFaces(value) {
  return { front: value, back: value ? 7 - value : 6, right: 2, left: 5, top: 3, bottom: 4 }
}

// Enam angka acak berbeda (seperti dadu asli); sisi depan tidak sama dengan sebelumnya.
function scrambleFaces(previous) {
  const numbers = [1, 2, 3, 4, 5, 6]
  for (let index = numbers.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1))
    ;[numbers[index], numbers[swap]] = [numbers[swap], numbers[index]]
  }
  if (numbers[0] === previous.front) [numbers[0], numbers[1]] = [numbers[1], numbers[0]]
  return Object.fromEntries(FACES.map((face, index) => [face, numbers[index]]))
}

// memo: saat angka diacak, hanya sisi yang nilainya berubah yang digambar ulang.
const DiceFace = memo(function DiceFace({ face, value }) {
  return (
    <span className={`dice-face dice-face--${face}`} aria-hidden="true">
      {value ? (
        Array.from({ length: 9 }, (_, index) => (
          <span key={index} className={PIPS[value].includes(index) ? 'dice-pip' : undefined} />
        ))
      ) : (
        <span className="dice-face-mark">?</span>
      )}
    </span>
  )
})

// Dadu 3D. Saat `rolling`, kubus dikocok, dilempar, berputar, dan memantul
// (keyframes `dice-*` di styles/board.css, durasi DICE_ROLL_MS). Angka pada sisi
// berganti acak dan melambat; begitu dadu menyentuh meja (DICE_LAND_MS) sisi depan
// menampilkan `target` (hasil sebenarnya) sehingga angkanya terbaca selagi dadu
// memantul dan berhenti. Tanpa `target`, angka baru muncul saat `value` diberikan.
function DiceButton({ value, target = null, onRoll, disabled = false, rolling = false }) {
  const [scrambled, setScrambled] = useState(() => restFaces(value))

  useEffect(() => {
    if (!rolling) return undefined

    let timer
    let delay = SCRAMBLE_FIRST_MS
    const tick = () => {
      setScrambled(scrambleFaces)
      delay = Math.min(delay * SCRAMBLE_SLOWDOWN, SCRAMBLE_MAX_MS)
      timer = window.setTimeout(tick, delay)
    }
    // Ganti angka seketika (bukan setelah jeda pertama) supaya tidak ada frame usang.
    timer = window.setTimeout(tick, 0)

    // Dadu menyentuh meja: hentikan pengacakan dan tampilkan hasilnya.
    const land = target
      ? window.setTimeout(() => {
          window.clearTimeout(timer)
          setScrambled(restFaces(target))
        }, DICE_LAND_MS)
      : null

    return () => {
      window.clearTimeout(timer)
      window.clearTimeout(land)
    }
  }, [rolling, target])

  const faces = rolling ? scrambled : restFaces(value)
  const label = rolling ? 'Dadu sedang dikocok' : value ? `Angka ${value}` : 'Dadu belum dilempar'

  return (
    <button
      className={`dice-btn relative grid size-20 shrink-0 place-items-center rounded-2xl focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--panel-accent)] disabled:cursor-not-allowed ${
        rolling ? 'dice-rolling z-10' : 'disabled:opacity-60'
      }${rolling && target === 6 ? ' dice-six' : ''}`}
      style={{ '--dice-ms': `${DICE_ROLL_MS}ms`, '--dice-peak-ms': `${DICE_PEAK_MS}ms` }}
      type="button"
      onClick={onRoll}
      disabled={disabled}
      aria-label="Lempar dadu"
    >
      <span className="dice-shadow" aria-hidden="true" />
      <span className="dice-ring" aria-hidden="true" />
      <span className="dice-glow" aria-hidden="true" />
      <span className="dice-shake">
        <span className="dice-hop">
          <span className="dice-cube" role="img" aria-label={label}>
            {FACES.map((face) => (
              <DiceFace key={face} face={face} value={faces[face]} />
            ))}
          </span>
        </span>
      </span>
    </button>
  )
}

export default DiceButton
