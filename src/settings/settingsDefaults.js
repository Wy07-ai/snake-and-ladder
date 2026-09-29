// Definisi & aturan pengaturan (logic murni, tanpa React).
// Fitur berikutnya (audio engine, theme, avatar) cukup membaca/menambah
// nilai di sini tanpa mengubah Lobby atau Settings UI secara struktural.

export const SETTINGS_STORAGE_KEY = 'ular-tangga:settings:v1'

export const AUDIO_CHANNELS = ['master', 'bgm', 'sfx']

export const DEFAULT_SETTINGS = {
  audio: {
    master: 80, // 0-100
    bgm: 70,
    sfx: 80,
    muted: false,
  },
  // Slot untuk tahap berikutnya (tema, avatar, dsb). Sengaja kosong.
  visual: {},
}

const clampVolume = (value, fallback) => {
  const number = Number(value)
  if (!Number.isFinite(number)) return fallback
  return Math.min(100, Math.max(0, Math.round(number)))
}

// Menerima data apa pun (mis. dari localStorage yang rusak/lama) dan
// selalu mengembalikan objek settings yang valid. Tidak pernah melempar error.
export function sanitizeSettings(raw) {
  const source = raw && typeof raw === 'object' ? raw : {}
  const audio = source.audio && typeof source.audio === 'object' ? source.audio : {}
  const visual = source.visual && typeof source.visual === 'object' ? source.visual : {}

  return {
    audio: {
      master: clampVolume(audio.master, DEFAULT_SETTINGS.audio.master),
      bgm: clampVolume(audio.bgm, DEFAULT_SETTINGS.audio.bgm),
      sfx: clampVolume(audio.sfx, DEFAULT_SETTINGS.audio.sfx),
      muted: typeof audio.muted === 'boolean' ? audio.muted : DEFAULT_SETTINGS.audio.muted,
    },
    visual: { ...DEFAULT_SETTINGS.visual, ...visual },
  }
}

export function loadSettings() {
  try {
    const stored = window.localStorage.getItem(SETTINGS_STORAGE_KEY)
    return sanitizeSettings(stored ? JSON.parse(stored) : null)
  } catch {
    // Storage diblokir / JSON rusak: pakai default, jangan crash.
    return sanitizeSettings(null)
  }
}

export function saveSettings(settings) {
  try {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // Mode privat / kuota penuh: pengaturan tetap berlaku selama sesi.
  }
}

// Volume akhir 0..1 untuk sebuah channel ('bgm' | 'sfx'), sudah memperhitungkan
// master & mute. Audio engine di masa depan cukup memanggil fungsi ini.
export function getEffectiveVolume(audio, channel) {
  if (audio.muted) return 0
  return (audio.master / 100) * (audio[channel] / 100)
}
