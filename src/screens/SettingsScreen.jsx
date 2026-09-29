import ScreenShell from '../components/screens/ScreenShell.jsx'

// Placeholder: pengaturan (suara, tema, avatar) dijadwalkan di ROADMAP.
function SettingsScreen({ onBack }) {
  return (
    <ScreenShell title="Settings" icon="⚙️" onBack={onBack}>
      <p className="rounded-lg bg-wa-soft p-4 text-base text-wa-primary">
        Pengaturan belum tersedia. Opsi seperti suara, tema, dan avatar akan hadir di pembaruan berikutnya.
      </p>
    </ScreenShell>
  )
}

export default SettingsScreen
