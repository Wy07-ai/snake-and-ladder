import { useEffect, useState } from 'react'
import { TYPE_MS_PER_CHAR } from '../../data/dialogTiming.js'

const PAUSE_MS = { ',': 50, '.': 90, '!': 90, '?': 90 }

function prefersReducedMotion() {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}

// Teks yang diketik huruf demi huruf. Komponen ini dipasang ulang (lewat `key`) untuk
// tiap baris dialog, jadi state-nya selalu mulai dari awal. Teks yang belum diketik
// tetap dirender (transparan) agar pembungkus baris tidak bergeser saat mengetik.
// Pengguna reduced motion langsung melihat teks penuh. `onDone` dipanggil sekali
// saat seluruh teks tampil.
function TypewriterText({ text, onDone }) {
  const [reduced] = useState(prefersReducedMotion)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (reduced) {
      onDone?.()
      return undefined
    }

    let index = 0
    let timer
    const tick = () => {
      index += 1
      setCount(index)
      if (index >= text.length) {
        onDone?.()
        return
      }
      timer = window.setTimeout(tick, TYPE_MS_PER_CHAR + (PAUSE_MS[text[index - 1]] ?? 0))
    }
    timer = window.setTimeout(tick, TYPE_MS_PER_CHAR)

    return () => window.clearTimeout(timer)
  }, [text, reduced, onDone])

  const shown = reduced ? text.length : count
  const isDone = shown >= text.length

  return (
    <p className="rpg-text">
      <span>{text.slice(0, shown)}</span>
      <span className="rpg-text-rest">{text.slice(shown)}</span>
      {isDone && <span className="rpg-caret" aria-hidden="true">▼</span>}
    </p>
  )
}

export default TypewriterText
