import { useId } from 'react'

// Slider volume 0-100 dengan label & persentase. `dimmed` menandai channel
// yang sedang tidak terdengar (mis. saat mute) tanpa menguncinya.
// `onCommit` dipanggil saat slider dilepas, cocok untuk memutar suara contoh.
function VolumeSlider({ label, value, onChange, onCommit, dimmed = false }) {
  const id = useId()

  return (
    <div className={`grid gap-1.5 transition-opacity ${dimmed ? 'opacity-50' : 'opacity-100'}`}>
      <div className="flex items-center justify-between text-sm font-semibold text-wa-ink">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id} className="min-w-12 rounded-full bg-wa-soft px-2 py-0.5 text-center text-xs font-bold text-wa-primary">
          {value}%
        </output>
      </div>
      <input
        id={id}
        className="h-2 w-full cursor-pointer accent-wa-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-wa-primary"
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

export default VolumeSlider
