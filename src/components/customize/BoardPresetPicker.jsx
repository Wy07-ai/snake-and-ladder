import { useMemo } from 'react'
import BoardView from '../board/BoardView.jsx'
import { BOARD_PRESETS } from '../../data/boardPresets.js'
import { getPresetSummary, resolvePreviewBoard } from '../../engine/boardResolver.js'

// Label singkat tingkat panjang permainan dari rata-rata lemparan (lihat analyzeBoard).
function describePace(expectedRolls) {
  if (expectedRolls <= 20) return 'Cepat'
  if (expectedRolls <= 40) return 'Sedang'
  if (expectedRolls <= 100) return 'Panjang'
  return 'Sangat berat'
}

function Chip({ children }) {
  return <span className="rounded-full bg-wa-soft px-2 py-0.5 text-[0.7rem] font-semibold text-wa-primary">{children}</span>
}

// Pemilih preset papan. Pratinjau memakai papan asli (BoardView compact) dengan tema yang
// sedang dipilih, sehingga sama dengan tampilan saat bermain. Preset acak menampilkan
// papan contoh; papan sebenarnya diacak ulang setiap permainan baru.
function BoardPresetPicker({ value, onChange, theme = 'classic' }) {
  const cards = useMemo(
    () =>
      BOARD_PRESETS.map((preset) => ({
        preset,
        board: resolvePreviewBoard(preset.id),
        summary: getPresetSummary(preset.id),
      })),
    [],
  )

  return (
    <div className="grid gap-3 sm:grid-cols-2" role="group" aria-label="Preset papan">
      {cards.map(({ preset, board, summary }) => {
        const selected = preset.id === value

        return (
          <button
            key={preset.id}
            className={`grid content-start gap-2 rounded-xl border-2 p-2 text-left transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-wa-primary ${
              selected ? 'border-wa-primary bg-wa-soft' : 'border-wa-soft bg-wa-paper hover:bg-wa-canvas'
            }`}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(preset.id)}
          >
            <span className="relative mx-auto block w-full max-w-40">
              <BoardView theme={theme} board={board} compact />
              {summary.procedural && (
                <span className="absolute right-1 top-1 z-20 rounded bg-black/70 px-1.5 py-0.5 text-[0.65rem] font-bold text-white">
                  Contoh
                </span>
              )}
            </span>
            <span className="grid gap-1">
              <span className="text-sm font-bold text-wa-ink">
                {preset.emoji} {preset.label}
              </span>
              <span className="text-xs text-wa-muted">{preset.description}</span>
              <span className="mt-0.5 flex flex-wrap gap-1">
                {summary.procedural ? (
                  <>
                    <Chip>🎲 Baru tiap game</Chip>
                    <Chip>Seimbang &amp; bisa dimenangkan</Chip>
                  </>
                ) : (
                  <>
                    <Chip>🪜 {summary.ladders} tangga</Chip>
                    <Chip>🐍 {summary.snakes} ular</Chip>
                    <Chip>⏱ {describePace(summary.expectedRolls)} (~{summary.expectedRolls} lemparan)</Chip>
                  </>
                )}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default BoardPresetPicker
