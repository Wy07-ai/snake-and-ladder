import { useEffect, useId, useRef, useState } from 'react'
import { playSfx } from '../../audio/audioEngine.js'
import { useSettings } from '../../settings/useSettings.js'

// Contoh suara saat slider dilepas; BGM tidak perlu karena musiknya sendiri langsung berubah.
const VOLUME_CONTROLS = [
  { channel: 'master', label: '🔊 Master Volume', sample: 'notification' },
  { channel: 'bgm', label: '🎵 BGM Volume', sample: null },
  { channel: 'sfx', label: '🎲 SFX Volume', sample: 'diceRoll' },
]

function ThemedSlider({ label, value, onChange, onCommit, dimmed }) {
  const id = useId()
  return (
    <div className={`grid gap-1.5 transition-opacity ${dimmed ? 'opacity-50' : 'opacity-100'}`}>
      <div className="flex items-center justify-between text-sm font-semibold">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id} className="ui-chip min-w-12 px-2 py-0.5 text-center text-xs font-bold">{value}%</output>
      </div>
      <input
        id={id}
        className="ui-slider h-2 w-full cursor-pointer"
        type="range"
        min="0"
        max="100"
        step="1"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        onPointerUp={onCommit}
        onKeyUp={onCommit}
        aria-valuetext={`${value} persen`}
      />
    </div>
  )
}

// Modal Pengaturan & Jeda untuk layar permainan. Dua tampilan dalam satu overlay:
// 'settings' (audio + navigasi) dan 'confirm' (konfirmasi keluar ke lobby).
// Escape menutup modal (atau kembali dari konfirmasi); fokus dipindahkan ke dalam
// modal saat dibuka dan dikembalikan ke tombol pemicu saat ditutup.
function GameSettingsModal({ onResume, onExit }) {
  const { settings, setVolume, toggleMute } = useSettings()
  const { audio } = settings
  const [view, setView] = useState('settings')
  const dialogRef = useRef(null)
  const titleId = useId()
  const confirmId = useId()

  useEffect(() => {
    const previous = document.activeElement
    return () => previous?.focus?.()
  }, [])

  // Fokus ke tombol utama tiap tampilan berganti.
  useEffect(() => {
    dialogRef.current?.querySelector('[data-autofocus]')?.focus()
  }, [view])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (view === 'confirm') setView('settings')
        else onResume()
        return
      }
      if (event.key !== 'Tab') return
      // Fokus dikurung di dalam modal.
      const focusable = dialogRef.current?.querySelectorAll('button, input, [href]')
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
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [view, onResume])

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget && view === 'settings') onResume()
  }

  return (
    <div className="ui-modal-backdrop" onMouseDown={handleBackdropClick}>
      {view === 'settings' ? (
        <div ref={dialogRef} className="ui-modal grid gap-4" role="dialog" aria-modal="true" aria-labelledby={titleId}>
          <header className="flex items-center gap-2">
            <span className="text-2xl" aria-hidden="true">⚙️</span>
            <h2 id={titleId} className="text-xl font-bold">Pengaturan &amp; Jeda</h2>
          </header>

          <section className="grid gap-3" aria-label="Audio">
            <button
              className={`ui-panel flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left ${audio.muted ? '' : 'ui-panel--active'}`}
              type="button"
              role="switch"
              aria-checked={!audio.muted}
              onClick={toggleMute}
            >
              <span className="grid">
                <span className="text-sm font-bold">{audio.muted ? 'Suara dimatikan' : 'Suara menyala'}</span>
                <span className="ui-muted text-xs font-semibold">{audio.muted ? 'Ketuk untuk unmute' : 'Ketuk untuk mute'}</span>
              </span>
              <span className="relative h-7 w-12 shrink-0 rounded-full transition-colors" style={{ background: audio.muted ? 'rgba(255,255,255,0.25)' : 'var(--panel-accent)' }} aria-hidden="true">
                <span className={`absolute top-0.5 left-0.5 size-6 rounded-full bg-white shadow transition-transform ${audio.muted ? '' : 'translate-x-5'}`} />
              </span>
            </button>
            {VOLUME_CONTROLS.map(({ channel, label, sample }) => (
              <ThemedSlider
                key={channel}
                label={label}
                value={audio[channel]}
                onChange={(value) => setVolume(channel, value)}
                onCommit={sample ? () => playSfx(sample) : undefined}
                dimmed={audio.muted}
              />
            ))}
          </section>

          <div className="grid gap-2 pt-1">
            <button className="ui-btn ui-btn--primary px-4 py-2.5 text-sm" type="button" onClick={onResume} data-autofocus>
              ▶ Lanjutkan Game
            </button>
            <button className="ui-btn ui-btn--danger px-4 py-2.5 text-sm" type="button" onClick={() => setView('confirm')}>
              Ke Lobby / Exit Game
            </button>
          </div>
        </div>
      ) : (
        <div ref={dialogRef} className="ui-modal grid gap-4" role="alertdialog" aria-modal="true" aria-labelledby={confirmId} aria-describedby={`${confirmId}-desc`}>
          <h2 id={confirmId} className="text-xl font-bold">Keluar ke lobby?</h2>
          <p id={`${confirmId}-desc`} className="ui-muted text-sm leading-relaxed">
            Apakah kamu yakin ingin keluar ke lobby? Progress game saat ini akan hilang.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button className="ui-btn px-4 py-2.5 text-sm" type="button" onClick={() => setView('settings')} data-autofocus>
              Batal
            </button>
            <button className="ui-btn ui-btn--danger-solid px-4 py-2.5 text-sm" type="button" onClick={onExit}>
              Ya, keluar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default GameSettingsModal
