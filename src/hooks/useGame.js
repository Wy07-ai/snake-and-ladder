import { useState } from 'react'
import { movePlayer, rollDice } from '../engine/gameEngine.js'

export function useGame() {
  const [playerPosition, setPlayerPosition] = useState(1)
  const [lastRoll, setLastRoll] = useState(null)

  function roll() {
    const dice = rollDice()
    setLastRoll(dice)
    setPlayerPosition((position) => movePlayer(position, dice))
  }

  function resetGame() {
    setPlayerPosition(1)
    setLastRoll(null)
  }

  return { lastRoll, playerPosition, resetGame, roll }
}