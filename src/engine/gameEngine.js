import { DEFAULT_BOARD } from '../data/boardPresets.js'
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
export function createPlayers(pawn = DEFAULT_PAWN, names = DEFAULT_NAMES, options = {}) {
  const playerCount = Math.min(4, Math.max(2, options.playerCount ?? 4))
  const playerTypes = options.playerTypes ?? ['human', 'bot', 'bot', 'bot']
  const slotPawns = options.pawnsBySlot ?? {}
  const slots = [
    { id: 'human', bot: { avatar: 'fox', shape: 'circle', color: '#495057' } },
    ...BOT_PLAYERS.map((bot) => ({ id: bot.id, bot })),
  ]

  return slots.slice(0, playerCount).map(({ id, bot }, index) => {
    const type = playerTypes[index] === 'bot' ? 'bot' : 'human'
    const botName = id === 'human' ? 'Bot 1' : bot.name
    const visual = type === 'bot' ? bot : { ...DEFAULT_PAWN, ...pawn, ...slotPawns[id] }

    const fallbackName = type === 'bot' && id === 'human' ? botName : DEFAULT_NAMES[id]
    return { ...visual, id, name: names[id] || fallbackName, type }
  })
}

export const GAME_PLAYERS = createPlayers()

export function createStartPositions(players = GAME_PLAYERS) {
  return Object.fromEntries(players.map((player) => [player.id, 1]))
}

export function rollDice(random = Math.random, sides = 6) {
  return Math.floor(random() * sides) + 1
}

export function hasBonusRoll(dice) {
  return dice === 6
}

export function getNextPlayerIndex(currentIndex, playerCount = GAME_PLAYERS.length) {
  return (currentIndex + 1) % playerCount
}

export function getNextActivePlayerIndex(currentIndex, players, positions, finishedPlayerIds = []) {
  const finished = new Set(finishedPlayerIds)
  for (let offset = 1; offset < players.length; offset += 1) {
    const index = (currentIndex + offset) % players.length
    const player = players[index]
    if (!finished.has(player.id) && positions[player.id] < 100) return index
  }
  return -1
}

export function getQuickFinishStandings(players, positions, winnerId) {
  const winner = players.find((player) => player.id === winnerId)
  const remainingPlayers = players
    .filter((player) => player.id !== winnerId)
    .sort((a, b) => positions[b.id] - positions[a.id])

  return [winner, ...remainingPlayers].map((player, index) => ({
    ...player,
    place: index + 1,
    position: positions[player.id],
  }))
}

export function getFinishedStandings(finishedPlayerIds, players) {
  const playerById = new Map(players.map((player) => [player.id, player]))
  const uniqueIds = [...new Set(finishedPlayerIds)]
  return uniqueIds.flatMap((id, index) => {
    const player = playerById.get(id)
    return player ? [{ ...player, place: index + 1, position: 100 }] : []
  })
}

export function getFinalStandings(finishedPlayerIds, players, positions) {
  const finishedStandings = getFinishedStandings(finishedPlayerIds, players)
  const finished = new Set(finishedStandings.map((entry) => entry.id))
  const remainingPlayers = players
    .filter((player) => !finished.has(player.id))
    .sort((a, b) => positions[b.id] - positions[a.id])

  return [...finishedStandings, ...remainingPlayers.map((player) => ({
    ...player,
    place: finishedStandings.length + remainingPlayers.indexOf(player) + 1,
    position: positions[player.id],
  }))]
}

export function getBotThinkDelay(difficulty = 'medium', random = Math.random) {
  if (typeof difficulty === 'function') {
    random = difficulty
    difficulty = 'medium'
  }

  const ranges = {
    easy: [2300, 3000],
    medium: [1500, 2000],
    hard: [850, 1250],
  }
  const [minimum, maximum] = ranges[difficulty] ?? ranges.medium
  return minimum + random() * (maximum - minimum)
}

export function movePlayer(position, steps) {
  const destination = position + steps
  return destination <= 100 ? destination : position
}

export function getMovementSteps(position, steps) {
  const destination = movePlayer(position, steps)
  return Array.from(
    { length: destination - position },
    (_, index) => position + index + 1,
  )
}

// `board` = { ladders, snakes } dari preset yang dipilih (lihat engine/boardResolver.js).
export function resolveSpecialSquare(position, board = DEFAULT_BOARD) {
  const ladder = board.ladders.find((connection) => connection.start === position)
  if (ladder) return { position: ladder.end, type: 'ladder' }

  const snake = board.snakes.find((connection) => connection.start === position)
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
