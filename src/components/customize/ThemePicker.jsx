import BoardView from '../board/BoardView.jsx'
import { BOARD_THEMES } from '../../data/boardThemes.js'

// Pemilih tema papan. Pratinjau memakai papan asli (BoardView compact), jadi
// selalu sama dengan tampilan saat bermain.
function ThemePicker({ value, onChange }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3" role="group" aria-label="Tema papan">
      {BOARD_THEMES.map((theme) => {
        const selected = theme.id === value

        return (
          <button
            key={theme.id}
            className={`settings-choice grid content-start gap-2 rounded-xl border-2 p-2 text-left transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-wa-primary ${
              selected ? 'border-wa-primary bg-wa-soft' : 'border-wa-soft bg-wa-paper hover:bg-wa-canvas'
            }`}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(theme.id)}
          >
            <span className="mx-auto block w-full max-w-36">
              <BoardView theme={theme.id} compact />
            </span>
            <span className="grid gap-0.5">
              <span className="text-sm font-bold text-wa-ink">
                {theme.emoji} {theme.label}
              </span>
              <span className="text-xs text-wa-muted">{theme.description}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default ThemePicker
