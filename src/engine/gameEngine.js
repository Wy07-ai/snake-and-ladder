import { ladders, snakes } from '../data/boardData.js'
import { DEFAULT_PAWN } from '../data/pawnOptions.js'

// Jeda animasi (ms). Dipakai useGame; lama SFX kocokan dadu dan luncuran
// tangga/ular di src/audio dibuat mengikuti angka ini.
export const DICE_ROLL_MS = 700
export const SPECIAL_MOVE_MS = 800

// Bot punya karakter, bentuk, dan warna tetap.
export const BOT_PLAYERS = [
  { id: 'rizky', name: 'Rizky', type: 'bot', avatar: 'fox', shape: 'shield', color: '#c92a2a' },
  { id: 'bagas', name: 'Bagas', type: 'bot', avatar: 'panda', shape: 'hexagon', color: '#e67700' },
  { id: 'davin', name: 'Davin', type: 'bot', avatar: 'robot', shape: 'square', color: '#1971c2' },
]

// Susun daftar pemain: bidak pemain manusia mengikuti pilihan (avatar, bentuk, warna).
export function createPlayers(pawn = DEFAULT_PAWN) {
  return [
    { id: 'human', name: 'Kamu', type: 'human', ...DEFAULT_PAWN, ...pawn },
    ...BOT_PLAYERS,
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