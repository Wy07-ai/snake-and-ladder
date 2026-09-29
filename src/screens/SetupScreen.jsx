import PlayerCompositionCustomizer from '../components/customize/PlayerCompositionCustomizer.jsx'
import ThemePicker from '../components/customize/ThemePicker.jsx'
import ScreenShell from '../components/screens/ScreenShell.jsx'
import SettingsSection from '../components/settings/SettingsSection.jsx'
import { useSettings } from '../settings/useSettings.js'

// Persiapan sebelum bermain: pemain memilih nama, bidak, dan tema papan. Pilihan
// disimpan di settings (persisten), lalu GameScreen membacanya saat dimulai.
function SetupScreen({ onBack, onStart }) {
  const { settings, setName, setSlotPawn, setGameSettings, setTheme } = useSettings()

  return (
    <ScreenShell
      title="Siapkan Permainan"
      icon="🎨"
      onBack={onBack}
      actions={
        <button
          className="rounded-xl border-2 border-white/40 bg-wa-green px-6 py-2.5 text-base font-bold text-wa-ink shadow-[0_4px_0_0_#128c4a] transition hover:brightness-105 active:translate-y-0.5 active:shadow-[0_2px_0_0_#128c4a] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-wa-primary"
          type="button"
          onClick={onStart}
        >
          ▶️ Mulai Bermain
        </button>
      }
    >
      <SettingsSection id="players" icon="🎮" title="Mode dan pemain" description="Pilih 2 hingga 4 pemain, atur Human atau COM di setiap slot, lalu sesuaikan nama dan avatar pemain lokal.">
        <PlayerCompositionCustomizer
          game={settings.game}
          names={settings.names}
          pawnsBySlot={settings.visual.pawnsBySlot}
          onGameChange={setGameSettings}
          onNameChange={setName}
          onPawnChange={setSlotPawn}
        />
      </SettingsSection>

      <SettingsSection id="theme" icon="🗺️" title="Tema papan" description="Ganti suasana papan agar permainan tidak monoton.">
        <ThemePicker value={settings.visual.theme} onChange={setTheme} />
      </SettingsSection>
    </ScreenShell>
  )
}

export default SetupScreen
