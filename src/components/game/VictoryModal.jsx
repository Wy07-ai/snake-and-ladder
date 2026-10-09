import { useEffect, useId, useRef } from 'react'
import Pawn from '../pawn/Pawn.jsx'

const PLACES = { 1: '1st', 2: '2nd', 3: '3rd' }

function VictoryModal({ entries, onPlayAgain, onExit }) {
  const dialogRef = useRef(null)
  const titleId = useId()
  const winner = entries[0]

  useEffect(() => {
    const previous = document.activeElement
    const dialog = dialogRef.current
    const firstButton = dialog?.querySelector('[data-autofocus]')
    firstButton?.focus()

    const onKeyDown = (event) => {
      if (event.key !== 'Tab') return
      const focusable = dialog?.querySelectorAll('button')
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      previous?.focus?.()
    }
  }, [])

  return (
    <div className="ui-modal-backdrop victory-modal-backdrop">
      <section
        ref={dialogRef}
        className="ui-modal victory-modal grid gap-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="grid justify-items-center gap-2 text-center">
          <span className="victory-modal__eyebrow">KEMENANGAN TERKUNCI</span>
          <div className="victory-modal__hero" aria-hidden="true">
            {winner && (
              <Pawn
                avatar={winner.avatar}
                shape={winner.shape}
                color={winner.color}
                className="victory-modal__winner-art"
              />
            )}
            <span className="victory-modal__trophy">🏆</span>
          </div>
          <h2 id={titleId} className="text-2xl font-extrabold">
            Selamat, {winner?.name ?? 'Pemenang'}!
          </h2>
          <p className="ui-muted text-sm">Berhasil menaklukkan papan ular tangga.</p>
        </header>

        <ol className="victory-modal__standings grid gap-2" aria-label="Peringkat akhir">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className={`victory-modal__entry flex items-center gap-3 rounded-lg border px-3 py-2 ${entry.place === 1 ? 'victory-modal__entry--winner' : ''}`}
            >
              <span className="victory-modal__place" aria-label={`Peringkat ${entry.place}`}>
                {entry.place === 1 ? '👑' : PLACES[entry.place] ?? `${entry.place}th`}
              </span>
              <Pawn
                avatar={entry.avatar}
                shape={entry.shape}
                color={entry.color}
                className="size-10 shrink-0"
                label={`Avatar ${entry.name}`}
              />
              <span className="grid min-w-0 flex-1">
                <span className="truncate text-sm font-bold">{entry.name}</span>
                <span className="ui-muted text-xs">{entry.type === 'bot' ? 'Bot' : 'Pemain'} · Kotak {entry.position}</span>
              </span>
              {entry.place === 1 && <span className="ui-accent text-xs font-bold uppercase">Juara</span>}
            </li>
          ))}
        </ol>

        <footer className="grid grid-cols-2 gap-2">
          <button className="ui-btn ui-btn--primary px-3 py-2.5 text-sm" type="button" onClick={onPlayAgain} data-autofocus>
            ▶ Main Lagi
          </button>
          <button className="ui-btn px-3 py-2.5 text-sm" type="button" onClick={onExit}>
            ⌂ Menu Utama
          </button>
        </footer>
      </section>
    </div>
  )
}

export default VictoryModal