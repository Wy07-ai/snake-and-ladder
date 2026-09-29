import { useContext } from 'react'
import { SettingsContext } from './SettingsContext.js'
import { sanitizeSettings } from './settingsDefaults.js'

const noop = () => {}

// Fallback aman: jika komponen dirender tanpa Provider (mis. di test/isolasi),
// hook mengembalikan default no-op alih-alih crash.
const FALLBACK = {
  settings: sanitizeSettings(null),
  setVolume: noop,
  toggleMute: noop,
  resetSettings: noop,
}

export function useSettings() {
  return useContext(SettingsContext) ?? FALLBACK
}
