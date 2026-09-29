import { useCallback, useEffect, useMemo, useState } from 'react'
import { SettingsContext } from './SettingsContext.js'
import {
  AUDIO_CHANNELS,
  DEFAULT_SETTINGS,
  loadSettings,
  sanitizeSettings,
  saveSettings,
} from './settingsDefaults.js'

// State global pengaturan. Dipasang sekali di main.jsx; layar mana pun bisa
// membacanya lewat useSettings(). Provider ini hanya menyimpan nilai; suara
// dimainkan oleh src/audio (lihat useAudioSync).
function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(loadSettings)

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  const setAudioValue = useCallback((key, value) => {
    setSettings((current) => sanitizeSettings({ ...current, audio: { ...current.audio, [key]: value } }))
  }, [])

  const setVolume = useCallback(
    (channel, value) => {
      if (AUDIO_CHANNELS.includes(channel)) setAudioValue(channel, value)
    },
    [setAudioValue],
  )

  const toggleMute = useCallback(() => {
    setSettings((current) =>
      sanitizeSettings({ ...current, audio: { ...current.audio, muted: !current.audio.muted } }),
    )
  }, [])

  const setTheme = useCallback((theme) => {
    setSettings((current) => sanitizeSettings({ ...current, visual: { ...current.visual, theme } }))
  }, [])

  // Menerima sebagian data bidak, mis. setPawn({ color: '#7048e8' }).
  const setPawn = useCallback((patch) => {
    setSettings((current) =>
      sanitizeSettings({
        ...current,
        visual: { ...current.visual, pawn: { ...current.visual.pawn, ...patch } },
      }),
    )
  }, [])

  const resetSettings = useCallback(() => setSettings(sanitizeSettings(DEFAULT_SETTINGS)), [])

  const value = useMemo(
    () => ({ settings, setVolume, toggleMute, setTheme, setPawn, resetSettings }),
    [settings, setVolume, toggleMute, setTheme, setPawn, resetSettings],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export default SettingsProvider
