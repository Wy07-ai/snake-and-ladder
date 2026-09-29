import OptionButton from './OptionButton.jsx'
import Pawn from '../pawn/Pawn.jsx'
import { HUMAN_AVATARS, PAWN_COLORS, PAWN_SHAPES } from '../../data/pawnOptions.js'

function OptionGroup({ label, children }) {
  return (
    <div className="grid gap-2" role="group" aria-label={label}>
      <p className="text-sm font-bold text-wa-ink">{label}</p>
      {children}
    </div>
  )
}

// Pemilih bidak: karakter, warna, dan bentuk, dengan pratinjau besar.
// Komponen ini hanya menampilkan `pawn` dan melapor lewat onChange(patch).
function PawnCustomizer({ pawn, onChange }) {
  const avatarLabel = HUMAN_AVATARS.find((avatar) => avatar.id === pawn.avatar)?.label

  return (
    <div className="grid items-start gap-5 sm:grid-cols-[auto_1fr]">
      <div className="grid justify-items-center gap-2">
        <div className="grid size-32 place-items-center rounded-2xl bg-wa-paper shadow-inner ring-1 ring-wa-primary/10">
          <Pawn {...pawn} className="size-24" label={`Pratinjau bidak: ${avatarLabel}`} />
        </div>
        <p className="text-sm font-bold text-wa-ink">{avatarLabel}</p>
      </div>

      <div className="grid gap-4">
        <OptionGroup label="Karakter">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {HUMAN_AVATARS.map((avatar) => (
              <OptionButton
                key={avatar.id}
                selected={pawn.avatar === avatar.id}
                onClick={() => onChange({ avatar: avatar.id })}
                label={avatar.label}
              >
                <Pawn avatar={avatar.id} shape={pawn.shape} color={pawn.color} className="size-11" />
                <span aria-hidden="true">{avatar.label}</span>
              </OptionButton>
            ))}
          </div>
        </OptionGroup>

        <OptionGroup label="Warna">
          <div className="flex flex-wrap gap-2.5">
            {PAWN_COLORS.map((color) => {
              const selected = pawn.color === color.value
              return (
                <button
                  key={color.id}
                  className={`size-9 rounded-full border-2 border-white shadow transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-wa-primary ${
                    selected ? 'ring-2 ring-wa-primary ring-offset-2' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color.value }}
                  type="button"
                  aria-pressed={selected}
                  aria-label={color.label}
                  title={color.label}
                  onClick={() => onChange({ color: color.value })}
                />
              )
            })}
          </div>
        </OptionGroup>

        <OptionGroup label="Bentuk bidak">
          <div className="grid grid-cols-4 gap-2">
            {PAWN_SHAPES.map((shape) => (
              <OptionButton
                key={shape.id}
                selected={pawn.shape === shape.id}
                onClick={() => onChange({ shape: shape.id })}
                label={shape.label}
              >
                <Pawn avatar={pawn.avatar} shape={shape.id} color={pawn.color} className="size-11" />
                <span aria-hidden="true">{shape.label}</span>
              </OptionButton>
            ))}
          </div>
        </OptionGroup>
      </div>
    </div>
  )
}

export default PawnCustomizer
