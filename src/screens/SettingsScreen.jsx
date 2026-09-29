import NameCustomizer from '../components/customize/NameCustomizer.jsx'
import PawnCustomizer from '../components/customize/PawnCustomizer.jsx'
import ThemePicker from '../components/customize/ThemePicker.jsx'
import ScreenShell from '../components/screens/ScreenShell.jsx'
import LayoutModePicker from '../components/settings/LayoutModePicker.jsx'
import SettingsSection from '../components/settings/SettingsSection.jsx'
import ToggleSwitch from '../components/settings/ToggleSwitch.jsx'
import VolumeSlider from '../components/settings/VolumeSlider.jsx'
import { playSfx } from '../audio/audioEngine.js'
import { useSettings } from '../settings/useSettings.js'

// `sample`: suara contoh yang diputar saat slider dilepas. BGM tidak butuh
// contoh karena musiknya sendiri sudah terdengar berubah.
const VOLUME_CONTROLS = [
  { channel: 'master', label: '🔊 Master Volume', sample: 'notification' },
  { channel: 'bgm', label: '🎵 BGM Volume', sample: null },
  { channel: 'sfx', label: '🎲 SFX Volume', sample: 'diceRoll' },
]

// Layar pengaturan. Nilai disimpan di src/settings dan dibaca audio engine
// (useAudioSync) serta layar permainan. Kelompok baru = tambah <SettingsSection>.
function SettingsScreen({ onBack }) {
  const { settings, setVolume, toggleMute, setName, setPawn, setTheme, setLayoutMode, resetSettings } = useSettings()
  const { audio, layout, visual } = settings

  return (
    <ScreenShell title="Settings" icon="⚙️" onBack={onBack}>
      <SettingsSection
        id="audio"
        icon="🔊"
        title="Audio"
        description="Atur volume musik latar dan efek suara (kocokan dadu, langkah pion, tangga, ular, dan dialog bot)."
      >
        <ToggleSwitch
          label={audio.muted ? 'Suara dimatikan (Muted)' : 'Suara menyala (Unmuted)'}
          checked={!audio.muted}
          onChange={toggleMute}
          onText="Ketuk untuk mute"
          offText="Ketuk untuk unmute"
        />
        <div className="grid gap-4">
          {VOLUME_CONTROLS.map(({ channel, label, sample }) => (
            <VolumeSlider
              key={channel}
              label={label}
              value={audio[channel]}
              onChange={(value) => setVolume(channel, value)}
              onCommit={sample ? () => playSfx(sample) : undefined}
              dimmed={audio.muted}
            />
          ))}
        </div>
      </SettingsSection>

      <SettingsSection
        id="layout"
        icon="📐"
        title="Tampilan layar"
        description="Pilih susunan layar permainan. Pilihanmu disimpan di perangkat ini dan langsung dipakai di permainan berikutnya."
      >
        <LayoutModePicker value={layout.mode} onChange={setLayoutMode} />
        <p className="text-xs text-wa-muted">
          Mode Desktop butuh layar lebar; di layar sempit halaman bisa digeser ke samping. Mode HP tetap ringkas satu kolom
          meski dibuka di layar lebar.
        </p>
      </SettingsSection>

      <SettingsSection
        id="names"
        icon="🏷️"
        title="Nama pemain"
        description="Nama kamu dan ketiga bot. Kolom yang dikosongkan memakai nama bawaan; bisa juga diubah sebelum permainan dimulai."
      >
        <NameCustomizer names={settings.names} pawn={visual.pawn} onChange={setName} />
      </SettingsSection>

      <SettingsSection
        id="pawn"
        icon="♟️"
        title="Bidak"
        description="Karakter, warna, dan bentuk bidakmu. Bisa juga diubah sebelum permainan dimulai."
      >
        <PawnCustomizer pawn={visual.pawn} onChange={setPawn} />
      </SettingsSection>

      <SettingsSection id="visual" icon="🎨" title="Tema papan" description="Pilih tampilan papan untuk permainan berikutnya.">
        <ThemePicker value={visual.theme} onChange={setTheme} />
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
