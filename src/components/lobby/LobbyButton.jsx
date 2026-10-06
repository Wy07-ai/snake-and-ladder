// Tombol menu utama bergaya game: ikon + label, dengan state hover/active/focus.
function LobbyButton({ icon, children, onClick, variant = 'secondary' }) {
  return (
    <button
      className={`lobby-button lobby-button--${variant} flex w-full items-center justify-center gap-3 rounded-xl border-2 px-6 py-3.5 text-lg font-bold md:text-xl`}
      type="button"
      onClick={onClick}
    >
      <span aria-hidden="true">{icon}</span>
      <span>{children}</span>
    </button>
  )
}

export default LobbyButton
