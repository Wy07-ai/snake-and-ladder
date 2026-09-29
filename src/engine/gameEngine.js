import { ladders, snakes } from '../data/boardData.js'
import { DEFAULT_PAWN } from '../data/pawnOptions.js'
import { DEFAULT_NAMES } from '../data/playerNames.js'

// Jeda animasi (ms). Dipakai useGame; lama SFX kocokan dadu dan luncuran
// tangga/ular di src/audio dibuat mengikuti angka ini.
//
// Timeline dadu (persentase dari DICE_ROLL_MS). Satu sumber kebenaran untuk tiga
// hal yang harus sinkron: keyframes `dice-*` di styles/board.css, jadwal SFX
// diceRoll di audio/audioEngine.js, dan saat angka hasil diperlihatkan.
export const DICE_ROLL_MS = 900
// Puncak guncangan: dadu mencapai titik tertinggi lemparan pada 35% durasi.
export const DICE_PEAK_RATIO = 0.35
export const DICE_PEAK_MS = Math.round(DICE_ROLL_MS * DICE_PEAK_RATIO)
// Dadu pertama kali menyentuh meja pada 68%; di titik ini angka hasil mulai terbaca.
export const DICE_LAND_RATIO = 0.68
export const DICE_LAND_MS = Math.round(DICE_ROLL_MS * DICE_LAND_RATIO)
// Pantulan berikutnya (90% dan 98,5%).
export const DICE_BOUNCE_RATIOS = [0.9, 0.985]
// Benturan dadu ke dinding "tangan" selama guncangan, sebagai pecahan dari
// DICE_PEAK_MS. Keyframes `dice-shake` memakai persentase yang sama.
export const DICE_SHAKE_HITS = [0.08, 0.22, 0.36, 0.5, 0.64, 0.78, 0.92]
export const SPECIAL_MOVE_MS = 800

// Bot punya karakter, bentuk, dan warna tetap.
export const BOT_PLAYERS = [
  { id: 'rizky', name: 'Rizky', type: 'bot', avatar: 'fox', shape: 'shield', color: '#c92a2a' },
  { id: 'bagas', name: 'Bagas', type: 'bot', avatar: 'panda', shape: 'hexagon', color: '#e67700' },
  { id: 'davin', name: 'Davin', type: 'bot', avatar: 'robot', shape: 'square', color: '#1971c2' },
]

// Susun daftar pemain: bidak pemain manusia mengikuti pilihan (avatar, bentuk, warna),
// dan `names` (id -> nama final) mengganti nama bawaan pemain maupun bot.
export function createPlayers(pawn = DEFAULT_PAWN, names = DEFAULT_NAMES) {
  const nameOf = (id) => names[id] || DEFAULT_NAMES[id]

  return [
    { id: 'human', name: nameOf('human'), type: 'human', ...DEFAULT_PAWN, ...pawn },
    ...BOT_PLAYERS.map((bot) => ({ ...bot, name: nameOf(bot.id) })),
  ]
}

export const GAME_PLAYERS = createPlayers()

export function createStartPositions(players = GAME_PLAYERS) {
  return Object.fromEntries(players.map((player) => [player.id, 1]))
}

export function rollDice(random = Math.random) {
  return Math.floor(random() * 6) + 1
}

export function hasBonusRoll(dice, alreadyUsed = false) {
  return dice === 6 && !alreadyUsed
}

export function getNextPlayerIndex(currentIndex, playerCount = GAME_PLAYERS.length) {
  return (currentIndex + 1) % playerCount
}

export function getBotThinkDelay(random = Math.random) {
  return 1500 + random() * 500
}

export function movePlayer(position, steps) {
  return Math.min(position + steps, 100)
}

export function getMovementSteps(position, steps) {
  const destination = movePlayer(position, steps)
  return Array.from(
    { length: destination - position },
    (_, index) => position + index + 1,
  )
}

export function resolveSpecialSquare(position) {
  const ladder = ladders.find((connection) => connection.start === position)
  if (ladder) return { position: ladder.end, type: 'ladder' }

  const snake = snakes.find((connection) => connection.start === position)
  if (snake) return { position: snake.end, type: 'snake' }

  return { position, type: null }
}

// Lawan yang disalip sebuah gerakan: yang tadinya ada di depan `from` dan kini berada
// di belakang `to`. Diurutkan dari yang paling depan (paling "berharga" disalip).
export function findPassedPlayers(players, positions, moverId, from, to) {
  return players
    .filter((other) => other.id !== moverId)
    .filter((other) => from < positions[other.id] && to > positions[other.id])
    .sort((a, b) => positions[b.id] - positions[a.id])
}
