// Tombol menu utama bergaya game: ikon + label, dengan state hover/active/focus.
const VARIANTS = {
  primary:
    'bg-wa-green text-wa-ink border-white/40 shadow-[0_6px_0_0_#128c4a] hover:brightness-105 active:translate-y-1 active:shadow-[0_2px_0_0_#128c4a]',
  secondary:
    'bg-wa-paper text-wa-primary border-wa-soft shadow-[0_6px_0_0_#b7d9a0] hover:bg-wa-soft active:translate-y-1 active:shadow-[0_2px_0_0_#b7d9a0]',
}

function LobbyButton({ icon, children, onClick, variant = 'secondary' }) {
  return (
    <button
      className={`flex w-full items-center justify-center gap-3 rounded-xl border-2 px-6 py-3.5 text-lg font-bold transition focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-white md:text-xl ${VARIANTS[variant]}`}
      type="button"
      onClick={onClick}
    >
      <span aria-hidden="true">{icon}</span>
      <span>{children}</span>
    </button>
  )
}

export default LobbyButton
