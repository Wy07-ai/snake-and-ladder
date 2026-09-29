import { useEffect, useState } from 'react'
import { getEffectiveVolume } from '../settings/settingsDefaults.js'
import { useSettings } from '../settings/useSettings.js'
import { resumeAudio, setVolumes, startBgm, stopBgm, suspendAudio, unlockAudio } from './audioEngine.js'

const UNLOCK_EVENTS = ['pointerdown', 'touchend', 'click', 'keydown']

// Menghubungkan pengaturan (volume/mute) dengan audio engine. Dipasang sekali
// di App: membuka kunci audio pada interaksi pertama, menyalakan/mematikan BGM
// sesuai volume efektif, dan menjeda suara saat tab disembunyikan.
export function useAudioSync() {
  const { settings } = useSettings()
  const [unlocked, setUnlocked] = useState(false)
  const bgmVolume = getEffectiveVolume(settings.audio, 'bgm')
  const sfxVolume = getEffectiveVolume(settings.audio, 'sfx')
  const bgmAudible = bgmVolume > 0

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

  useEffect(() => {
    if (!unlocked) return
    if (bgmAudible) startBgm()
    else stopBgm()
  }, [unlocked, bgmAudible])

  useEffect(() => {
    if (!unlocked) return undefined
    const handleVisibility = () => (document.hidden ? suspendAudio() : resumeAudio())
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [unlocked])

  useEffect(() => stopBgm, [])
}
