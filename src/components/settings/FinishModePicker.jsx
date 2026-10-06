import { FINISH_MODES } from '../../data/finishModes.js'

function FinishModePicker({ value, onChange }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Finish Mode">
      {FINISH_MODES.map((mode) => {
        const selected = mode.id === value

        return (
          <button
            key={mode.id}
            className={`settings-choice grid content-start gap-2 rounded-lg border-2 p-4 text-left transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-wa-primary ${
              selected ? 'border-wa-primary bg-wa-soft' : 'border-wa-soft bg-wa-paper hover:bg-wa-canvas'
            }`}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(mode.id)}
          >
            <span className="flex items-center justify-between gap-2 text-sm font-bold text-wa-ink">
              {mode.label}
              {selected && <span className="text-xs font-semibold text-wa-primary">Aktif</span>}
            </span>
            <span className="text-xs text-wa-muted">{mode.description}</span>
          </button>
        )
      })}
    </div>
  )
}

export default FinishModePicker