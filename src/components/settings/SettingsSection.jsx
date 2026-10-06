// Kartu kelompok pengaturan (Audio, Visual, dst). Tambah kelompok baru
// cukup dengan membungkus isinya dengan komponen ini.
function SettingsSection({ id, icon, title, description, children }) {
  return (
    <section className="settings-section grid gap-4 rounded-xl border border-wa-soft bg-wa-canvas/60 p-4 md:p-5" aria-labelledby={`${id}-title`}>
      <header className="grid gap-1">
        <h2 id={`${id}-title`} className="flex items-center gap-2 text-lg font-bold text-wa-primary md:text-xl">
          <span aria-hidden="true">{icon}</span>
          {title}
        </h2>
        {description && <p className="text-sm text-wa-muted">{description}</p>}
      </header>
      <div className="grid gap-4">{children}</div>
    </section>
  )
}

export default SettingsSection
