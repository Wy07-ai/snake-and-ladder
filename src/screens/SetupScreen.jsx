import BoardPresetPicker from '../components/customize/BoardPresetPicker.jsx'
import PlayerCompositionCustomizer from '../components/customize/PlayerCompositionCustomizer.jsx'
import ThemePicker from '../components/customize/ThemePicker.jsx'
import ScreenShell from '../components/screens/ScreenShell.jsx'
import SettingsSection from '../components/settings/SettingsSection.jsx'
import { useSettings } from '../settings/useSettings.js'

// Persiapan sebelum bermain: pemain memilih nama, bidak, tema, dan preset papan. Pilihan
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
          className="lobby-button lobby-button--primary rounded-xl border-2 px-6 py-2.5 text-base font-bold"
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

      <SettingsSection id="board-preset" icon="🐍" title="Layout papan" description="Pilih susunan ular dan tangga, dari yang santai sampai neraka. Pilih Random Generator untuk papan baru di setiap permainan.">
        <BoardPresetPicker
          value={settings.game.boardPreset}
          onChange={(boardPreset) => setGameSettings({ boardPreset })}
          theme={settings.visual.theme}
        />
      </SettingsSection>
    </ScreenShell>
  )
}

export default SetupScreen
