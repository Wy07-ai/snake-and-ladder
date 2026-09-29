import { useCallback, useEffect, useRef, useState } from 'react'
import {
  DICE_ROLL_MS,
  GAME_PLAYERS,
  SPECIAL_MOVE_MS,
  createStartPositions,
  getBotThinkDelay,
  getMovementSteps,
  hasBonusRoll,
  getNextPlayerIndex,
  resolveSpecialSquare,
  rollDice,
} from '../engine/gameEngine.js'

const STEP_DELAY = 180
const noop = () => {}

function wait(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds))
}

// `onGameEvent` melaporkan kejadian untuk chat (DICE_SIX, LADDER_CLIMB, ...).
// `onSfx` melaporkan momen untuk efek suara: 'diceRoll', 'step', 'ladder',
// 'snake', dan 'win'. Keduanya opsional; hook ini tidak tahu apa pun soal audio.
export function useGame({ players = GAME_PLAYERS, onGameEvent = noop, onSfx = noop } = {}) {
  const [playerPositions, setPlayerPositions] = useState(() => createStartPositions(players))
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [lastRoll, setLastRoll] = useState(null)
  const [isRolling, setIsRolling] = useState(false)
  const [isMoving, setIsMoving] = useState(false)
  const [extraRollAvailable, setExtraRollAvailable] = useState(false)
  const [lastMove, setLastMove] = useState(null)
  const [slidingPlayerId, setSlidingPlayerId] = useState(null)
  const [gameWinner, setGameWinner] = useState(null)
  const isMovingRef = useRef(false)
  const currentPlayer = players[currentPlayerIndex]
  const playerPosition = playerPositions[currentPlayer.id]
  const isGameOver = gameWinner !== null
  const playerCount = players.length

  const roll = useCallback(async () => {
    if (isMovingRef.current || isGameOver) return

    isMovingRef.current = true
    setIsMoving(true)
    setIsRolling(true)
    const dice = rollDice()
    const isBonusRoll = extraRollAvailable
    let position = playerPosition
    setExtraRollAvailable(false)
    setLastMove(null)
    onSfx('diceRoll')

    try {
      // Dadu dikocok dulu; angkanya baru terlihat setelah animasi selesai.
      await wait(DICE_ROLL_MS)
      setIsRolling(false)
      setLastRoll(dice)
      if (dice === 6) onGameEvent('DICE_SIX', currentPlayer)

      const steps = getMovementSteps(position, dice)
      for (const [index, nextPosition] of steps.entries()) {
        await wait(STEP_DELAY)
        const previousPosition = position
        position = nextPosition
        setPlayerPositions((positions) => ({
          ...positions,
          [currentPlayer.id]: position,
        }))
        onSfx('step', { index })
        if (previousPosition < 90 && position >= 90) {
          onGameEvent('CLUTCH_ZONE', currentPlayer)
        }
      }

      const specialMove = resolveSpecialSquare(position)
      if (specialMove.position !== position) {
        await wait(STEP_DELAY)
        onGameEvent(specialMove.type === 'ladder' ? 'LADDER_CLIMB' : 'SNAKE_BITE', currentPlayer)
        onSfx(specialMove.type)
        position = specialMove.position
        setSlidingPlayerId(currentPlayer.id)
        setPlayerPositions((positions) => ({
          ...positions,
          [currentPlayer.id]: position,
        }))
        setLastMove(specialMove.type)
        // Beri waktu pion meluncur dan suaranya selesai sebelum giliran berganti.
        await wait(SPECIAL_MOVE_MS)
        setSlidingPlayerId(null)
      }

      if (position === 100) {
        setGameWinner(currentPlayer)
        setExtraRollAvailable(false)
        onSfx('win')
        onGameEvent('GAME_OVER', currentPlayer)
      } else if (hasBonusRoll(dice, isBonusRoll)) {
        setExtraRollAvailable(true)
      } else {
        setExtraRollAvailable(false)
        setCurrentPlayerIndex((index) => getNextPlayerIndex(index, playerCount))
      }
    } finally {
      isMovingRef.current = false
      setIsMoving(false)
      setIsRolling(false)
      setSlidingPlayerId(null)
    }
  }, [currentPlayer, extraRollAvailable, isGameOver, onGameEvent, onSfx, playerCount, playerPosition])

  useEffect(() => {
    if (currentPlayer.type !== 'bot' || isMoving || isGameOver) return undefined

    const timer = window.setTimeout(() => {
      void roll()
    }, getBotThinkDelay())

    return () => window.clearTimeout(timer)
  }, [currentPlayer, isGameOver, isMoving, roll])

  function resetGame() {
    if (isMovingRef.current) return
    setPlayerPositions(createStartPositions(players))
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
          ? `Giliran ${currentPlayer.name}: lemparan ekstra setelah mendapat 6.`
          : `Giliran ${currentPlayer.name}.`
        : extraRollAvailable
          ? `${currentPlayer.name} mendapat lemparan ekstra, sedang berpikir...`
          : `${currentPlayer.name} sedang berpikir...`

  return {
    currentPlayer,
    extraRollAvailable,
    gameWinner,
    isGameOver,
    isMoving,
    isRolling,
    lastMove,
    lastRoll,
    playerPositions,
    playerPosition,
    players,
    resetGame,
    roll,
    slidingPlayerId,
    turnStatus,
  }
}
