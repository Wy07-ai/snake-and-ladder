// Kerangka layar sekunder (How to Play, Settings, Exit) dengan tombol kembali.
// Menambah fitur baru cukup membuat isi layar dan membungkusnya dengan ini.
// `actions` (opsional) adalah tombol tambahan di samping tombol kembali, mis. "Mulai".
function ScreenShell({ title, icon, onBack = () => {}, backLabel = '← Kembali ke lobby', actions = null, children }) {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <section className="grid w-full max-w-2xl gap-6 rounded-2xl bg-wa-paper p-6 shadow-xl md:p-8" aria-labelledby="screen-title">
        <header className="flex items-center gap-3">
          <span className="text-3xl" aria-hidden="true">{icon}</span>
          <h1 id="screen-title" className="text-2xl font-bold text-wa-ink md:text-3xl">{title}</h1>
        </header>
        <div className="grid gap-3 text-wa-ink">{children}</div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            className="rounded-md border border-wa-primary px-4 py-2 text-sm font-semibold text-wa-primary transition hover:bg-wa-soft active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wa-primary"
            type="button"
            onClick={onBack}
          >
            {backLabel}
          </button>
          {actions}
        </div>
      </section>
    </main>
  )
}

export default ScreenShell
