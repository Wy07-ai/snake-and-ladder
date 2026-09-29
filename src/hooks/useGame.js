import { useCallback, useEffect, useRef, useState } from 'react'
import {
  GAME_PLAYERS,
  getBotThinkDelay,
  getMovementSteps,
  hasBonusRoll,
  getNextPlayerIndex,
  resolveSpecialSquare,
  rollDice,
} from '../engine/gameEngine.js'

const STEP_DELAY = 180

function wait(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds))
}

export function useGame() {
  const [playerPositions, setPlayerPositions] = useState(() =>
    Object.fromEntries(GAME_PLAYERS.map((player) => [player.id, 1])),
  )
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [lastRoll, setLastRoll] = useState(null)
  const [isMoving, setIsMoving] = useState(false)
  const [extraRollAvailable, setExtraRollAvailable] = useState(false)
  const [lastMove, setLastMove] = useState(null)
  const [gameWinner, setGameWinner] = useState(null)
  const isMovingRef = useRef(false)
  const currentPlayer = GAME_PLAYERS[currentPlayerIndex]
  const playerPosition = playerPositions[currentPlayer.id]
  const isGameOver = gameWinner !== null

  const roll = useCallback(async () => {
    if (isMovingRef.current || isGameOver) return

    isMovingRef.current = true
    setIsMoving(true)
    const dice = rollDice()
    const isBonusRoll = extraRollAvailable
    let position = playerPosition
    setLastRoll(dice)
    setExtraRollAvailable(false)
    setLastMove(null)

    try {
      for (const nextPosition of getMovementSteps(position, dice)) {
        await wait(STEP_DELAY)
        position = nextPosition
        setPlayerPositions((positions) => ({
          ...positions,
          [currentPlayer.id]: position,
        }))
      }

      const specialMove = resolveSpecialSquare(position)
      if (specialMove.position !== position) {
        await wait(STEP_DELAY)
        position = specialMove.position
        setPlayerPositions((positions) => ({
          ...positions,
          [currentPlayer.id]: position,
        }))
        setLastMove(specialMove.type)
      }

      if (position === 100) {
        setGameWinner(currentPlayer)
        setExtraRollAvailable(false)
      } else if (hasBonusRoll(dice, isBonusRoll)) {
        setExtraRollAvailable(true)
      } else {
        setExtraRollAvailable(false)
        setCurrentPlayerIndex((index) => getNextPlayerIndex(index))
      }
    } finally {
      isMovingRef.current = false
      setIsMoving(false)
    }
  }, [currentPlayer, extraRollAvailable, isGameOver, playerPosition])

  useEffect(() => {
    if (currentPlayer.type !== 'bot' || isMoving || isGameOver) return undefined

    const timer = window.setTimeout(() => {
      void roll()
    }, getBotThinkDelay())

    return () => window.clearTimeout(timer)
  }, [currentPlayer, isGameOver, isMoving, roll])

  function resetGame() {
    if (isMovingRef.current) return
    setPlayerPositions(Object.fromEntries(GAME_PLAYERS.map((player) => [player.id, 1])))
    setCurrentPlayerIndex(0)
    setLastRoll(null)
    setExtraRollAvailable(false)
    setLastMove(null)
    setGameWinner(null)
  }

  const turnStatus = isGameOver
    ? `${gameWinner.name} menang!`
    : isMoving
      ? `${currentPlayer.name} sedang melempar dadu...`
      : currentPlayer.type === 'human'
        ? extraRollAvailable
          ? 'Giliran Kamu: lemparan ekstra setelah mendapat 6.'
          : 'Giliran Kamu.'
        : extraRollAvailable
          ? `${currentPlayer.name} mendapat lemparan ekstra, sedang berpikir...`
          : `${currentPlayer.name} sedang berpikir...`

  return {
    extraRollAvailable,
    gameWinner,
    isGameOver,
    isMoving,
    lastMove,
    lastRoll,
    playerPositions,
    playerPosition,
    players: GAME_PLAYERS,
    resetGame,
    roll,
    turnStatus,
  }
}