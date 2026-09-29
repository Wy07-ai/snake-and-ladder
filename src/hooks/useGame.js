import { useState } from 'react'
import { useRef } from 'react'
import {
  getMovementSteps,
  hasBonusRoll,
  resolveSpecialSquare,
  rollDice,
} from '../engine/gameEngine.js'

const STEP_DELAY = 180

function wait(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds))
}

export function useGame() {
  const [playerPosition, setPlayerPosition] = useState(1)
  const [lastRoll, setLastRoll] = useState(null)
  const [isMoving, setIsMoving] = useState(false)
  const [extraRollAvailable, setExtraRollAvailable] = useState(false)
  const [lastMove, setLastMove] = useState(null)
  const isMovingRef = useRef(false)

  async function roll() {
    if (isMovingRef.current || playerPosition === 100) return

    isMovingRef.current = true
    setIsMoving(true)
    const dice = rollDice()
    setLastRoll(dice)
    setExtraRollAvailable(false)
    setLastMove(null)

    try {
      let position = playerPosition
      for (const nextPosition of getMovementSteps(position, dice)) {
        await wait(STEP_DELAY)
        position = nextPosition
        setPlayerPosition(position)
      }

      const specialMove = resolveSpecialSquare(position)
      if (specialMove.position !== position) {
        await wait(STEP_DELAY)
        position = specialMove.position
        setPlayerPosition(position)
        setLastMove(specialMove.type)
      }

      setExtraRollAvailable(hasBonusRoll(dice) && position < 100)
    } finally {
      isMovingRef.current = false
      setIsMoving(false)
    }
  }

  function resetGame() {
    if (isMovingRef.current) return
    setPlayerPosition(1)
    setLastRoll(null)
    setExtraRollAvailable(false)
    setLastMove(null)
  }

  return {
    extraRollAvailable,
    isMoving,
    isGameOver: playerPosition === 100,
    lastMove,
    lastRoll,
    playerPosition,
    resetGame,
    roll,
  }
}