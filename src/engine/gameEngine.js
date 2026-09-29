export function rollDice() {
  return Math.floor(Math.random() * 6) + 1
}

export function movePlayer(position, steps) {
  return Math.min(position + steps, 100)
}