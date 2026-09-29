import { useId } from 'react'
import Pawn from '../pawn/Pawn.jsx'
import { BOT_PLAYERS } from '../../engine/gameEngine.js'
import { NAME_MAX_LENGTH, NAME_SLOTS } from '../../data/playerNames.js'
import { resolveNames } from '../../settings/settingsDefaults.js'

// Pemilih nama pemain utama dan tiga bot. Komponen ini hanya menampilkan
// `names` (nilai mentah dari settings; kosong = nama bawaan) dan melapor lewat
// onChange(id, value). Bidak di samping tiap kolom membantu mengenali siapa siapa.
function NameCustomizer({ names, pawn, onChange }) {
  const baseId = useId()
  const resolved = resolveNames(names)

  // Peringatan lunak: nama kembar membingungkan di chat dan daftar pemain.
  const counts = new Map()
  for (const slot of NAME_SLOTS) {
    const key = resolved[slot.id].toLocaleLowerCase('id-ID')
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  const hasDuplicate = [...counts.values()].some((count) => count > 1)

  return (
    <div className="grid gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        {NAME_SLOTS.map((slot) => {
          const bot = BOT_PLAYERS.find((player) => player.id === slot.id)
          const visual = bot ?? pawn
          const inputId = `${baseId}-${slot.id}`
          const isDuplicate = counts.get(resolved[slot.id].toLocaleLowerCase('id-ID')) > 1

          return (
            <div key={slot.id} className="flex items-center gap-3">
              <Pawn avatar={visual.avatar} shape={visual.shape} color={visual.color} className="size-11 shrink-0" />
              <div className="grid min-w-0 flex-1 gap-1">
                <label className="truncate text-xs font-bold text-wa-muted" htmlFor={inputId}>
                  {slot.label}
                </label>
                <input
                  id={inputId}
                  className={`w-full min-w-0 rounded-md border bg-wa-paper px-3 py-2 text-sm font-semibold text-wa-ink outline-none transition focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-wa-primary ${
                    isDuplicate ? 'border-amber-500' : 'border-wa-primary/20 focus:border-wa-primary'
                  }`}
                  type="text"
                  value={names[slot.id]}
                  placeholder={slot.defaultName}
                  maxLength={NAME_MAX_LENGTH}
                  autoComplete="off"
                  spellCheck={false}
                  aria-invalid={isDuplicate || undefined}
                  onChange={(event) => onChange(slot.id, event.target.value)}
                  onBlur={(event) => onChange(slot.id, event.target.value.trim())}
                />
              </div>
            </div>
          )
        })}
      </div>
      <p className="min-h-4 text-xs text-wa-muted" role="status">
        {hasDuplicate
          ? '⚠️ Ada nama yang kembar, jadi chat dan daftar pemain bisa membingungkan.'
          : `Maksimal ${NAME_MAX_LENGTH} karakter. Kosongkan kolom untuk memakai nama bawaan.`}
      </p>
    </div>
  )
}

export default NameCustomizer
