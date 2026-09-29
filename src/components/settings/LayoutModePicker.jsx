import { LAYOUT_MODES } from '../../data/layoutModes.js'

// Denah mini tiap mode (dibuat dari kotak CSS, bukan gambar) agar perbedaannya
// langsung terlihat: desktop = papan + sidebar sebaris, HP = satu kolom vertikal.
function LayoutSketch({ mode }) {
  const block = 'rounded-[3px] bg-wa-primary/25'
  const board = 'rounded-[3px] bg-wa-primary/60'

  if (mode === 'mobile') {
    return (
      <span className="mx-auto grid h-24 w-14 grid-rows-[auto_1fr_auto_auto] gap-1 rounded-lg border-2 border-wa-primary/50 bg-white p-1" aria-hidden="true">
        <span className="h-1.5 rounded-[2px] bg-wa-primary/30" />
        <span className={`aspect-square w-full ${board}`} />
        <span className={`h-3 ${block}`} />
        <span className={`h-3 ${block}`} />
      </span>
    )
  }

  return (
    <span className="mx-auto grid h-24 w-40 grid-cols-[1.4fr_1fr] gap-1.5 rounded-lg border-2 border-wa-primary/50 bg-white p-1.5" aria-hidden="true">
      <span className={`h-full ${board}`} />
      <span className="grid grid-rows-[auto_auto_1fr] gap-1">
        <span className={`h-3 ${block}`} />
        <span className={`h-5 ${block}`} />
        <span className={`${block}`} />
      </span>
    </span>
  )
}

// Pemilih mode tampilan layar permainan (Desktop / HP). Pilihan berlaku segera dan
// disimpan oleh SettingsProvider ke localStorage.
function LayoutModePicker({ value, onChange }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Mode tampilan">
      {LAYOUT_MODES.map((mode) => {
        const selected = mode.id === value

        return (
          <button
            key={mode.id}
            className={`grid content-start gap-3 rounded-xl border-2 p-3 text-left transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-wa-primary ${
              selected ? 'border-wa-primary bg-wa-soft' : 'border-wa-soft bg-wa-paper hover:bg-wa-canvas'
            }`}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(mode.id)}
          >
            <LayoutSketch mode={mode.id} />
            <span className="grid gap-0.5">
              <span className="flex items-center justify-between gap-2 text-sm font-bold text-wa-ink">
                <span>
                  {mode.emoji} {mode.label}
                </span>
                {selected && <span className="text-xs font-bold text-wa-primary">✓ Aktif</span>}
              </span>
              <span className="text-xs text-wa-muted">{mode.description}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default LayoutModePicker
