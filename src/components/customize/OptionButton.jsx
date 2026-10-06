// Tombol pilihan dengan status terpilih (aria-pressed). Dipakai oleh semua pemilih.
function OptionButton({ selected, onClick, label, children, className = '' }) {
  return (
    <button
      className={`settings-choice grid justify-items-center gap-1 rounded-xl border-2 p-1.5 text-xs font-semibold transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-wa-primary ${
        selected
          ? 'border-wa-primary bg-wa-soft text-wa-primary'
          : 'border-transparent bg-wa-canvas text-wa-muted hover:bg-wa-soft'
      } ${className}`}
      type="button"
      aria-pressed={selected}
      aria-label={label}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default OptionButton
