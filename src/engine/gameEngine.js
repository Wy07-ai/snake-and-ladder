import { ladders, snakes } from '../data/boardData.js'

export const GAME_PLAYERS = [
  { id: 'human', name: 'Kamu', type: 'human', marker: 'K', color: '#075e54' },
  { id: 'rizky', name: 'Rizky', type: 'bot', marker: 'R', color: '#1971c2' },
  { id: 'siti', name: 'Siti', type: 'bot', marker: 'S', color: '#e67700' },
  { id: 'budi', name: 'Budi', type: 'bot', marker: 'B', color: '#7048e8' },
]

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