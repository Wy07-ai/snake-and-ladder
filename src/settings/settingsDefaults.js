// Definisi & aturan pengaturan (logic murni, tanpa React).
// Audio engine, tema papan, dan bidak membaca nilai dari sini; nilai yang
// tidak valid selalu dikembalikan ke default oleh sanitizeSettings.

import { BOARD_THEMES, DEFAULT_BOARD_THEME } from '../data/boardThemes.js'
import { DEFAULT_PAWN, HUMAN_AVATARS, PAWN_COLORS, PAWN_SHAPES } from '../data/pawnOptions.js'

export const SETTINGS_STORAGE_KEY = 'ular-tangga:settings:v1'

export const AUDIO_CHANNELS = ['master', 'bgm', 'sfx']

export const DEFAULT_SETTINGS = {
  audio: {
    master: 80, // 0-100
    bgm: 70,
    sfx: 80,
    muted: false,
  },
  visual: {
    theme: DEFAULT_BOARD_THEME,
    pawn: { ...DEFAULT_PAWN },
  },
}

const clampVolume = (value, fallback) => {
  const number = Number(value)
  if (!Number.isFinite(number)) return fallback
  return Math.min(100, Math.max(0, Math.round(number)))
}

const pickId = (value, options, fallback) =>
  options.some((option) => option.id === value) ? value : fallback

// Bidak pemain: hanya nilai dari daftar resmi yang lolos, sisanya kembali ke default.
function sanitizePawn(raw) {
  const pawn = raw && typeof raw === 'object' ? raw : {}
  return {
    avatar: pickId(pawn.avatar, HUMAN_AVATARS, DEFAULT_PAWN.avatar),
    shape: pickId(pawn.shape, PAWN_SHAPES, DEFAULT_PAWN.shape),
    color: PAWN_COLORS.find((color) => color.value === pawn.color)?.value ?? DEFAULT_PAWN.color,
  }
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
    visual: {
      theme: pickId(visual.theme, BOARD_THEMES, DEFAULT_SETTINGS.visual.theme),
      pawn: sanitizePawn(visual.pawn),
    },
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
