import ScreenShell from '../components/screens/ScreenShell.jsx'
import SettingsSection from '../components/settings/SettingsSection.jsx'
import ToggleSwitch from '../components/settings/ToggleSwitch.jsx'
import VolumeSlider from '../components/settings/VolumeSlider.jsx'
import { useSettings } from '../settings/useSettings.js'

const VOLUME_CONTROLS = [
  { channel: 'master', label: '🔊 Master Volume' },
  { channel: 'bgm', label: '🎵 BGM Volume' },
  { channel: 'sfx', label: '🎲 SFX Volume' },
]

// Layar pengaturan. Saat ini hanya menyimpan nilai (lihat src/settings);
// belum ada audio engine yang memakainya. Kelompok baru = tambah <SettingsSection>.
function SettingsScreen({ onBack }) {
  const { settings, setVolume, toggleMute, resetSettings } = useSettings()
  const { audio } = settings

  return (
    <ScreenShell title="Settings" icon="⚙️" onBack={onBack}>
      <SettingsSection
        id="audio"
        icon="🔊"
        title="Audio"
        description="Atur volume suara permainan. Efek suara & musik akan menyusul di pembaruan berikutnya."
      >
        <ToggleSwitch
          label={audio.muted ? 'Suara dimatikan (Muted)' : 'Suara menyala (Unmuted)'}
          checked={!audio.muted}
          onChange={toggleMute}
          onText="Ketuk untuk mute"
          offText="Ketuk untuk unmute"
        />
        <div className="grid gap-4">
          {VOLUME_CONTROLS.map(({ channel, label }) => (
            <VolumeSlider
              key={channel}
              label={label}
              value={audio[channel]}
              onChange={(value) => setVolume(channel, value)}
              dimmed={audio.muted}
            />
          ))}
        </div>
      </SettingsSection>

      <SettingsSection
        id="visual"
        icon="🎨"
        title="Gameplay / Visual"
        description="Tema, avatar, dan tampilan permainan akan ditambahkan di tahap berikutnya."
      >
        <p className="rounded-lg border border-dashed border-wa-muted/50 px-4 py-3 text-sm text-wa-muted">
          Belum ada opsi visual. Bagian ini disiapkan untuk pengaturan selanjutnya.
        </p>
      </SettingsSection>

      <button
        className="justify-self-start rounded-md px-3 py-2 text-sm font-semibold text-wa-muted underline-offset-4 transition hover:text-wa-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wa-primary"
        type="button"
        onClick={resetSettings}
      >
        ↺ Reset ke default
      </button>
    </ScreenShell>
  )
}

export default SettingsScreen
