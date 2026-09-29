// Preset papan Ular Tangga. Tiap preset punya identitas + teks pilihan; papan statis
// menyertakan `ladders` dan `snakes` ({ start, end }), sedangkan preset `procedural`
// dibuat oleh generator acak (engine/boardGenerator.js) setiap permainan baru.
//
// Aturan yang HARUS dipenuhi setiap papan (dicek oleh validateBoard dan
// `npm run verify:boards`):
//  - tangga naik, ular turun, panjang minimal 3 kotak;
//  - tiap kotak paling banyak menjadi pangkal satu ular/tangga (kotak 1 dan 100 tidak);
//  - ekor ular / ujung tangga tidak boleh jatuh di pangkal ular/tangga lain, jadi tidak
//    ada kepala ular yang langsung terhubung ke pangkal tangga (mencegah loop abadi);
//  - dari kotak 1 selalu ada jalur dadu ke kotak 100, tanpa kotak jebakan permanen.
//
// Untuk menambah preset: tambahkan objek baru di `BOARD_PRESETS`. Tidak perlu mengubah
// komponen; pemilih di layar persiapan membaca daftar ini.

import { ladders as originalLadders, snakes as originalSnakes } from './boardData.js'

export const RANDOM_PRESET_ID = 'random'
export const DEFAULT_PRESET_ID = 'classic'

export const BOARD_PRESETS = [
  {
    id: 'classic',
    label: 'Classic Standard',
    emoji: '🎲',
    description: 'Keseimbangan ular dan tangga yang normal: 9 pasang tersebar merata di seluruh papan.',
    ladders: [
      { start: 3, end: 22 },
      { start: 8, end: 30 },
      { start: 20, end: 38 },
      { start: 28, end: 84 },
      { start: 40, end: 59 },
      { start: 51, end: 67 },
      { start: 58, end: 77 },
      { start: 63, end: 81 },
      { start: 71, end: 91 },
    ],
    snakes: [
      { start: 17, end: 7 },
      { start: 27, end: 5 },
      { start: 35, end: 13 },
      { start: 47, end: 26 },
      { start: 52, end: 29 },
      { start: 62, end: 44 },
      { start: 74, end: 53 },
      { start: 88, end: 67 },
      { start: 97, end: 78 },
    ],
  },
  {
    id: 'snake-pit',
    label: 'Snake Pit (Hell Mode)',
    emoji: '🐍',
    description: 'Sarang ular! Belasan ular mengintai, tangganya cuma sedikit dan pendek. Untuk yang bernyali besar.',
    ladders: [
      { start: 6, end: 17 },
      { start: 26, end: 39 },
      { start: 53, end: 66 },
      { start: 74, end: 88 },
    ],
    snakes: [
      { start: 13, end: 4 },
      { start: 19, end: 7 },
      { start: 24, end: 11 },
      { start: 29, end: 14 },
      { start: 35, end: 20 },
      { start: 40, end: 22 },
      { start: 46, end: 30 },
      { start: 51, end: 33 },
      { start: 57, end: 38 },
      { start: 63, end: 44 },
      { start: 69, end: 49 },
      { start: 73, end: 52 },
      { start: 79, end: 60 },
      { start: 85, end: 64 },
      { start: 91, end: 70 },
      { start: 96, end: 72 },
      { start: 99, end: 67 },
    ],
  },
  {
    id: 'heavenly',
    label: 'Heavenly Ladders',
    emoji: '☁️',
    description: 'Tangga panjang di mana-mana, ular nyaris tidak ada. Cocok untuk permainan yang cepat dan santai.',
    ladders: [
      { start: 2, end: 24 },
      { start: 5, end: 46 },
      { start: 9, end: 33 },
      { start: 14, end: 52 },
      { start: 18, end: 60 },
      { start: 22, end: 43 },
      { start: 29, end: 67 },
      { start: 35, end: 74 },
      { start: 41, end: 82 },
      { start: 48, end: 79 },
      { start: 56, end: 91 },
      { start: 63, end: 88 },
      { start: 69, end: 95 },
    ],
    snakes: [
      { start: 84, end: 58 },
      { start: 97, end: 71 },
    ],
  },
  {
    id: 'chaos',
    label: 'Chaos / Teleport Madness',
    emoji: '🌀',
    description: 'Puluhan ular dan tangga pendek saling silang di hampir setiap baris. Posisi berubah terus, tak ada yang aman.',
    ladders: [
      { start: 2, end: 11 },
      { start: 6, end: 15 },
      { start: 13, end: 24 },
      { start: 17, end: 26 },
      { start: 23, end: 34 },
      { start: 29, end: 38 },
      { start: 36, end: 47 },
      { start: 41, end: 52 },
      { start: 46, end: 57 },
      { start: 54, end: 63 },
      { start: 61, end: 72 },
      { start: 68, end: 77 },
      { start: 75, end: 86 },
      { start: 82, end: 93 },
    ],
    snakes: [
      { start: 10, end: 4 },
      { start: 19, end: 8 },
      { start: 21, end: 12 },
      { start: 27, end: 18 },
      { start: 33, end: 22 },
      { start: 39, end: 30 },
      { start: 44, end: 35 },
      { start: 49, end: 40 },
      { start: 58, end: 48 },
      { start: 64, end: 55 },
      { start: 71, end: 62 },
      { start: 79, end: 69 },
      { start: 88, end: 80 },
      { start: 94, end: 85 },
      { start: 98, end: 90 },
    ],
  },
  {
    id: 'final-wall',
    label: 'The Final Wall',
    emoji: '🧱',
    description: 'Petak 1-80 gampang dinaiki lewat tangga, tetapi petak 81-99 dipenuhi ular mematikan yang melempar balik ke petak 10.',
    ladders: [
      { start: 2, end: 23 },
      { start: 4, end: 31 },
      { start: 6, end: 44 },
      { start: 11, end: 79 },
      { start: 14, end: 80 },
      { start: 17, end: 52 },
      { start: 20, end: 60 },
      { start: 25, end: 72 },
      { start: 30, end: 68 },
      { start: 36, end: 76 },
      { start: 43, end: 78 },
      { start: 49, end: 70 },
      { start: 55, end: 74 },
    ],
    snakes: [
      { start: 81, end: 10 },
      { start: 83, end: 10 },
      { start: 85, end: 10 },
      { start: 87, end: 10 },
      { start: 89, end: 10 },
      { start: 91, end: 10 },
      { start: 93, end: 10 },
      { start: 95, end: 10 },
      { start: 98, end: 10 },
    ],
  },
  {
    id: 'long-range',
    label: 'Monotone / Long Range',
    emoji: '🚀',
    description: 'Hanya segelintir ular dan tangga, tetapi sangat panjang: dari petak 5 bisa langsung melesat ke petak 70.',
    ladders: [
      { start: 5, end: 70 },
      { start: 34, end: 91 },
    ],
    snakes: [
      { start: 78, end: 25 },
      { start: 95, end: 12 },
      { start: 99, end: 41 },
    ],
  },
  {
    id: 'zigzag-trap',
    label: 'Zig-Zag Trap',
    emoji: '⚡',
    description: 'Tangga-tangga umpan menggiring pemain ke zona jebakan di petak 40-60, tempat ular dan tangga bersilang zig-zag.',
    ladders: [
      { start: 8, end: 27 },
      { start: 14, end: 30 },
      { start: 18, end: 42 },
      { start: 25, end: 48 },
      { start: 33, end: 53 },
      { start: 44, end: 52 },
      { start: 47, end: 58 },
      { start: 55, end: 72 },
      { start: 65, end: 84 },
      { start: 70, end: 88 },
    ],
    snakes: [
      { start: 41, end: 23 },
      { start: 43, end: 28 },
      { start: 46, end: 31 },
      { start: 49, end: 35 },
      { start: 51, end: 36 },
      { start: 54, end: 38 },
      { start: 57, end: 45 },
      { start: 59, end: 40 },
      { start: 90, end: 71 },
      { start: 97, end: 80 },
    ],
  },
  {
    id: 'short-sweet',
    label: 'Short & Sweet',
    emoji: '⏱️',
    description: 'Dirancang untuk permainan kilat: tangga besar di awal dan tengah, ular hanya menggigit ringan. Selesai dalam 5-10 menit.',
    ladders: [
      { start: 2, end: 38 },
      { start: 4, end: 42 },
      { start: 7, end: 53 },
      { start: 11, end: 60 },
      { start: 16, end: 69 },
      { start: 22, end: 76 },
      { start: 27, end: 84 },
      { start: 34, end: 90 },
      { start: 43, end: 95 },
      { start: 51, end: 97 },
    ],
    snakes: [
      { start: 47, end: 39 },
      { start: 80, end: 72 },
      { start: 93, end: 86 },
    ],
  },
  {
    id: 'rollercoaster',
    label: 'The Rollercoaster',
    emoji: '🎢',
    description: 'Naik-turun ekstrem terus-menerus: tangga panjang disusul ular panjang, lalu tangga lagi.',
    ladders: [
      { start: 3, end: 41 },
      { start: 11, end: 46 },
      { start: 28, end: 63 },
      { start: 37, end: 74 },
      { start: 52, end: 86 },
      { start: 66, end: 92 },
    ],
    snakes: [
      { start: 44, end: 8 },
      { start: 59, end: 18 },
      { start: 69, end: 25 },
      { start: 78, end: 33 },
      { start: 90, end: 48 },
      { start: 98, end: 61 },
    ],
  },
  {
    id: 'original',
    label: 'Original Mini',
    emoji: '🌱',
    description: 'Papan awal game ini: hanya 4 tangga dan 4 ular. Ringan dan mudah diikuti pemula.',
    ladders: originalLadders,
    snakes: originalSnakes,
  },
  {
    id: RANDOM_PRESET_ID,
    label: 'Custom / Random Generator',
    emoji: '🎰',
    description: 'Papan diacak otomatis setiap permainan baru (termasuk saat "Mulai ulang"), dijamin adil dan selalu bisa dimenangkan.',
    procedural: true,
    // Benih tetap hanya untuk gambar contoh di pemilih preset.
    previewSeed: 20240607,
  },
]

// Papan bawaan (preset default) untuk komponen/engine yang dipanggil tanpa papan.
const defaultPreset = BOARD_PRESETS.find((preset) => preset.id === DEFAULT_PRESET_ID)
export const DEFAULT_BOARD = { ladders: defaultPreset.ladders, snakes: defaultPreset.snakes }

export const BOARD_PRESET_IDS = BOARD_PRESETS.map((preset) => preset.id)

export function getPreset(id) {
  return BOARD_PRESETS.find((preset) => preset.id === id) ?? defaultPreset
}
