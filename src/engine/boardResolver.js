// Menjembatani data preset dan game: mengubah id preset menjadi papan konkret yang
// sudah divalidasi. Preset statis dicek sekali (di-cache); preset acak digenerate baru
// setiap dipanggil tanpa `seed`.

import { DEFAULT_BOARD, DEFAULT_PRESET_ID, getPreset } from '../data/boardPresets.js'
import { analyzeBoard, generateRandomBoard, randomSeed, validateBoard } from './boardGenerator.js'

const staticCache = new Map()

function resolveStatic(preset) {
  if (staticCache.has(preset.id)) return staticCache.get(preset.id)

  let board = { ladders: preset.ladders, snakes: preset.snakes }
  const result = validateBoard(board)
  if (!result.valid) {
    // Data preset salah (mis. salah ketik saat diedit): jangan sampai game macet.
    console.error(`Preset papan "${preset.id}" tidak valid, memakai papan bawaan.`, result.errors)
    board = DEFAULT_BOARD
  }
  staticCache.set(preset.id, board)
  return board
}

// Papan siap main untuk sebuah preset:
// `{ presetId, label, emoji, ladders, snakes, seed, procedural }`.
// `seed` hanya ada untuk preset acak; beri `seed` untuk mengulang papan yang sama.
export function resolveBoard(presetId = DEFAULT_PRESET_ID, { seed } = {}) {
  const preset = getPreset(presetId)

  if (preset.procedural) {
    const usedSeed = seed ?? randomSeed()
    // Generator hampir selalu berhasil; bila tidak, coba beberapa benih lain sebelum
    // menyerah ke papan bawaan.
    for (let offset = 0; offset < 5; offset += 1) {
      const generated = generateRandomBoard({ seed: (usedSeed + offset) >>> 0 })
      if (generated) {
        return { presetId: preset.id, label: preset.label, emoji: preset.emoji, procedural: true, ...generated }
      }
    }
    console.error('Generator papan acak gagal, memakai papan bawaan.')
    return { presetId: preset.id, label: preset.label, emoji: preset.emoji, procedural: true, seed: usedSeed, ...DEFAULT_BOARD }
  }

  const { ladders, snakes } = resolveStatic(preset)
  return { presetId: preset.id, label: preset.label, emoji: preset.emoji, procedural: false, ladders, snakes }
}

// Papan untuk gambar pratinjau di pemilih preset (preset acak memakai benih contoh tetap
// agar gambarnya tidak berubah-ubah saat layar dirender ulang).
export function resolvePreviewBoard(presetId) {
  const preset = getPreset(presetId)
  return resolveBoard(presetId, preset.procedural ? { seed: preset.previewSeed } : undefined)
}

const summaryCache = new Map()

// Ringkasan angka untuk kartu preset: jumlah tangga/ular dan rata-rata lemparan
// untuk mencapai kotak 100 (perkiraan tingkat panjang permainan).
export function getPresetSummary(presetId) {
  const preset = getPreset(presetId)
  if (summaryCache.has(preset.id)) return summaryCache.get(preset.id)

  const board = resolvePreviewBoard(preset.id)
  const { expectedRolls, minRolls } = analyzeBoard(board)
  const summary = {
    ladders: board.ladders.length,
    snakes: board.snakes.length,
    expectedRolls: Math.round(expectedRolls),
    minRolls,
    procedural: Boolean(preset.procedural),
  }
  summaryCache.set(preset.id, summary)
  return summary
}
