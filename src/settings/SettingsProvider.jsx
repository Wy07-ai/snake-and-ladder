import { useCallback, useEffect, useMemo, useState } from 'react'
import { SettingsContext } from './SettingsContext.js'
import {
  AUDIO_CHANNELS,
  DEFAULT_SETTINGS,
  loadSettings,
  resolveNames,
  sanitizeSettings,
  saveSettings,
} from './settingsDefaults.js'
import { NAME_IDS } from '../data/playerNames.js'

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

  // Mengubah satu nama ('human' | 'rizky' | 'bagas' | 'davin'). Nilai kosong
  // berarti memakai nama bawaan; pembersihan teks dilakukan sanitizeSettings.
  const setName = useCallback((id, value) => {
    if (!NAME_IDS.includes(id)) return
    setSettings((current) => sanitizeSettings({ ...current, names: { ...current.names, [id]: value } }))
  }, [])

  const resetSettings = useCallback(() => setSettings(sanitizeSettings(DEFAULT_SETTINGS)), [])

  // Nama final (kosong sudah diganti nama bawaan) yang siap dipakai permainan.
  const playerNames = useMemo(() => resolveNames(settings.names), [settings.names])

  const value = useMemo(
    () => ({ settings, playerNames, setVolume, toggleMute, setTheme, setPawn, setName, resetSettings }),
    [settings, playerNames, setVolume, toggleMute, setTheme, setPawn, setName, resetSettings],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export default SettingsProvider
