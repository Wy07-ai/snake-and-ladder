// Definisi & aturan pengaturan (logic murni, tanpa React).
// Audio engine, tema papan, dan bidak membaca nilai dari sini; nilai yang
// tidak valid selalu dikembalikan ke default oleh sanitizeSettings.

import { BOARD_PRESET_IDS, DEFAULT_PRESET_ID } from '../data/boardPresets.js'
import { BOARD_THEMES, DEFAULT_BOARD_THEME } from '../data/boardThemes.js'
import { DEFAULT_LAYOUT_MODE, LAYOUT_MODES, MOBILE_MAX_WIDTH_QUERY } from '../data/layoutModes.js'
import { DEFAULT_PAWN, HUMAN_AVATARS, PAWN_COLORS, PAWN_SHAPES } from '../data/pawnOptions.js'
import { DEFAULT_NAMES, NAME_IDS, NAME_MAX_LENGTH } from '../data/playerNames.js'

export const SETTINGS_STORAGE_KEY = 'ular-tangga:settings:v1'

export const AUDIO_CHANNELS = ['master', 'bgm', 'sfx']
const GAME_MODES = ['single', 'local', 'spectator', 'custom']
const BOT_DIFFICULTIES = ['easy', 'medium', 'hard']
const DEFAULT_PLAYER_TYPES = ['human', 'bot', 'bot', 'bot']
const DEFAULT_SLOT_PAWNS = {
  human: { ...DEFAULT_PAWN },
  rizky: { ...DEFAULT_PAWN, color: '#2f9e44' },
  bagas: { ...DEFAULT_PAWN, color: '#0c8599' },
  davin: { ...DEFAULT_PAWN, color: '#7048e8' },
}

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
    pawnsBySlot: DEFAULT_SLOT_PAWNS,
  },
  game: {
    mode: 'single',
    playerCount: 4,
    playerTypes: DEFAULT_PLAYER_TYPES,
    difficulty: 'medium',
    // Preset papan (id dari data/boardPresets.js); 'random' = papan acak tiap game baru.
    boardPreset: DEFAULT_PRESET_ID,
  },
  // Mode tampilan layar permainan ('desktop' | 'mobile'). Disimpan bersama pengaturan
  // lain di localStorage, sehingga layout otomatis mengikuti pilihan pemain.
  layout: {
    mode: DEFAULT_LAYOUT_MODE,
  },
  // Nama pilihan pemain. String kosong = "pakai nama bawaan" (lihat resolveNames),
  // jadi kolom input boleh dikosongkan tanpa menyimpan nilai palsu.
  names: Object.fromEntries(NAME_IDS.map((id) => [id, ''])),
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

// Membersihkan teks nama saat diketik: buang karakter kontrol dan spasi di depan,
// batasi panjangnya. Spasi di tengah/belakang sengaja dibiarkan supaya nama dua
// kata ("Budi Santoso") tetap bisa diketik; pemangkasan akhir dilakukan resolveName.
export function cleanNameInput(raw) {
  if (typeof raw !== 'string') return ''
  // eslint-disable-next-line no-control-regex
  return raw.replace(/[\u0000-\u001f\u007f]/g, '').replace(/^\s+/, '').slice(0, NAME_MAX_LENGTH)
}

// Nama final yang dipakai permainan: dirapikan, dan kosong berarti nama bawaan.
export function resolveName(raw, fallback) {
  const name = cleanNameInput(raw).replace(/\s+/g, ' ').trim()
  return name || fallback
}

export function resolveNames(names) {
  const source = names && typeof names === 'object' ? names : {}
  return Object.fromEntries(NAME_IDS.map((id) => [id, resolveName(source[id], DEFAULT_NAMES[id])]))
}

function sanitizeNames(raw) {
  const source = raw && typeof raw === 'object' ? raw : {}
  return Object.fromEntries(NAME_IDS.map((id) => [id, cleanNameInput(source[id])]))
}

// Tebakan awal untuk pemain yang belum pernah memilih: layar sempit -> mode HP.
// Setelah dipilih di Settings, pilihan pemain selalu menang atas tebakan ini.
export function detectLayoutMode() {
  try {
    return window.matchMedia(MOBILE_MAX_WIDTH_QUERY).matches ? 'mobile' : DEFAULT_LAYOUT_MODE
  } catch {
    return DEFAULT_LAYOUT_MODE
  }
}

// Menerima data apa pun (mis. dari localStorage yang rusak/lama) dan
// selalu mengembalikan objek settings yang valid. Tidak pernah melempar error.
// `fallbackLayoutMode` dipakai bila mode layout belum ada / tidak valid.
export function sanitizeSettings(raw, fallbackLayoutMode = DEFAULT_LAYOUT_MODE) {
  const source = raw && typeof raw === 'object' ? raw : {}
  const layout = source.layout && typeof source.layout === 'object' ? source.layout : {}
  const game = source.game && typeof source.game === 'object' ? source.game : {}
  const audio = source.audio && typeof source.audio === 'object' ? source.audio : {}
  const visual = source.visual && typeof source.visual === 'object' ? source.visual : {}
  const pawnsBySlot = visual.pawnsBySlot && typeof visual.pawnsBySlot === 'object' ? visual.pawnsBySlot : {}
  const playerTypes = Array.isArray(game.playerTypes) ? game.playerTypes : DEFAULT_PLAYER_TYPES

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
      pawnsBySlot: Object.fromEntries(NAME_IDS.map((id) => [
        id,
        sanitizePawn({ ...DEFAULT_SLOT_PAWNS[id], ...pawnsBySlot[id] }),
      ])),
    },
    game: {
      mode: GAME_MODES.includes(game.mode) ? game.mode : DEFAULT_SETTINGS.game.mode,
      playerCount: Number.isInteger(game.playerCount)
        ? Math.min(4, Math.max(2, game.playerCount))
        : DEFAULT_SETTINGS.game.playerCount,
      playerTypes: NAME_IDS.map((_, index) =>
        playerTypes[index] === 'bot' || playerTypes[index] === 'human'
          ? playerTypes[index]
          : DEFAULT_PLAYER_TYPES[index],
      ),
      difficulty: BOT_DIFFICULTIES.includes(game.difficulty) ? game.difficulty : DEFAULT_SETTINGS.game.difficulty,
      // Data lama (tanpa boardPreset) atau id yang sudah dihapus kembali ke preset default.
      boardPreset: BOARD_PRESET_IDS.includes(game.boardPreset) ? game.boardPreset : DEFAULT_SETTINGS.game.boardPreset,
    },
    layout: {
      mode: pickId(layout.mode, LAYOUT_MODES, fallbackLayoutMode),
    },
    names: sanitizeNames(source.names),
  }
}

export function loadSettings() {
  try {
    const stored = window.localStorage.getItem(SETTINGS_STORAGE_KEY)
    return sanitizeSettings(stored ? JSON.parse(stored) : null, detectLayoutMode())
  } catch {
    // Storage diblokir / JSON rusak: pakai default, jangan crash.
    return sanitizeSettings(null, detectLayoutMode())
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
