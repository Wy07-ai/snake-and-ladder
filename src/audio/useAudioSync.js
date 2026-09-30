import { useEffect, useState } from 'react'
import { BOARD_THEMES } from '../data/boardThemes.js'
import { getEffectiveVolume } from '../settings/settingsDefaults.js'
import { useSettings } from '../settings/useSettings.js'
import { resumeAudio, setBgmTheme, setVolumes, startBgm, stopBgm, suspendAudio, unlockAudio } from './audioEngine.js'

const UNLOCK_EVENTS = ['pointerdown', 'touchend', 'click', 'keydown']

// Menghubungkan pengaturan (volume/mute) dengan audio engine. Dipasang sekali
// di App: membuka kunci audio pada interaksi pertama, menyalakan/mematikan BGM
// sesuai volume efektif, mengganti musik (crossfade) mengikuti tema papan aktif,
// dan menjeda suara saat tab disembunyikan.
export function useAudioSync() {
  const { settings } = useSettings()
  const [unlocked, setUnlocked] = useState(false)
  const bgmVolume = getEffectiveVolume(settings.audio, 'bgm')
  const sfxVolume = getEffectiveVolume(settings.audio, 'sfx')
  const bgmAudible = bgmVolume > 0
  const bgmPreset = BOARD_THEMES.find((theme) => theme.id === settings.visual.theme)?.bgm

  useEffect(() => {
    if (unlocked) return undefined

    const removeListeners = () => UNLOCK_EVENTS.forEach((name) => window.removeEventListener(name, handleUnlock))
    async function handleUnlock() {
      if (await unlockAudio()) {
        removeListeners()
        setUnlocked(true)
      }
    }

    UNLOCK_EVENTS.forEach((name) => window.addEventListener(name, handleUnlock, { passive: true }))
    return removeListeners
  }, [unlocked])

  useEffect(() => {
    setVolumes({ bgm: bgmVolume, sfx: sfxVolume })
  }, [bgmVolume, sfxVolume])

  // Tema berganti -> crossfade ke musik tema baru. Saat mute/belum unlock, pilihan
  // hanya diingat engine dan dipakai ketika musik dinyalakan kembali.
  useEffect(() => {
    setBgmTheme(bgmPreset)
  }, [bgmPreset])

  useEffect(() => {
    if (!unlocked) return
    if (bgmAudible) startBgm(bgmPreset)
    else stopBgm()
    // Sengaja tanpa bgmPreset: pergantian tema ditangani setBgmTheme di atas.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlocked, bgmAudible])

  useEffect(() => {
    if (!unlocked) return undefined
    const handleVisibility = () => (document.hidden ? suspendAudio() : resumeAudio())
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [unlocked])

  useEffect(() => stopBgm, [])
}
