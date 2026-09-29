import { ladders, snakes } from '../data/boardData.js'

export function rollDice(random = Math.random) {
  return Math.floor(random() * 6) + 1
}

export function hasBonusRoll(dice) {
  return dice === 6
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