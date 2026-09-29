// Saklar on/off yang jelas: warna, posisi knob, dan teks status berubah.
function ToggleSwitch({ label, checked, onChange, onText = 'Aktif', offText = 'Nonaktif' }) {
  return (
    <button
      className={`flex w-full items-center justify-between gap-3 rounded-lg border-2 px-4 py-3 text-left transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-wa-primary ${
        checked ? 'border-wa-primary bg-wa-soft' : 'border-wa-soft bg-wa-paper hover:bg-wa-canvas'
      }`}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
    >
      <span className="grid">
        <span className="text-sm font-bold text-wa-ink md:text-base">{label}</span>
        <span className={`text-xs font-semibold ${checked ? 'text-wa-primary' : 'text-wa-muted'}`}>
          {checked ? onText : offText}
        </span>
      </span>
      <span
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${checked ? 'bg-wa-primary' : 'bg-wa-muted/50'}`}
        aria-hidden="true"
      >
        <span
          className={`absolute top-0.5 left-0.5 size-6 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </span>
    </button>
  )
}

export default ToggleSwitch
