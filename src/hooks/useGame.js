import { useCallback, useEffect, useRef, useState } from 'react'
import { DEFAULT_BOARD } from '../data/boardPresets.js'
import { DEFAULT_FINISH_MODE } from '../data/finishModes.js'
import {
  DICE_ROLL_MS,
  GAME_PLAYERS,
  SPECIAL_MOVE_MS,
  createStartPositions,
  findPassedPlayers,
  getBotThinkDelay,
  getFinalStandings,
  getFinishedStandings,
  getMovementSteps,
  hasBonusRoll,
  getNextActivePlayerIndex,
  getQuickFinishStandings,
  resolveSpecialSquare,
  rollDice,
} from '../engine/gameEngine.js'

const STEP_DELAY = 180
const noop = () => {}

function wait(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds))
}

// Menunggu sampai browser benar-benar menggambar frame dengan class animasi terpasang
// (dua requestAnimationFrame). Timer roll dan SFX dimulai dari sini, bukan dari klik,
// sehingga bunyi, animasi, dan pergantian angka sejajar sampai hitungan frame.
// Cadangan timer menjaga permainan tetap jalan saat tab tersembunyi (rAF dijeda).
function nextPaint() {
  return new Promise((resolve) => {
    const fallback = window.setTimeout(resolve, 64)
    window.requestAnimationFrame(() =>
      window.requestAnimationFrame(() => {
        window.clearTimeout(fallback)
        resolve()
      }),
    )
  })
}

// `onGameEvent(nama, pemain, extra)` melaporkan kejadian untuk dialog bot (DICE_SIX,
// LADDER_CLIMB, SNAKE_BITE, CLUTCH_ZONE, OVERTAKE dengan `extra.target`, GAME_OVER).
// `onSfx` melaporkan momen untuk efek suara: 'diceRoll', 'step', 'ladder',
// 'snake', dan 'win'. Keduanya opsional; hook ini tidak tahu apa pun soal audio.
export function useGame({ players = GAME_PLAYERS, board = DEFAULT_BOARD, difficulty = 'medium', finishMode = DEFAULT_FINISH_MODE, onGameEvent = noop, onSfx = noop } = {}) {
  const [playerPositions, setPlayerPositions] = useState(() => createStartPositions(players))
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [lastRoll, setLastRoll] = useState(null)
  const [isRolling, setIsRolling] = useState(false)
  const [isMoving, setIsMoving] = useState(false)
  const [rollingValue, setRollingValue] = useState(null)
  const [extraRollAvailable, setExtraRollAvailable] = useState(false)
  const [lastMove, setLastMove] = useState(null)
  const [slidingPlayerId, setSlidingPlayerId] = useState(null)
  const [gameWinner, setGameWinner] = useState(null)
  const [finishedPlayerIds, setFinishedPlayerIds] = useState([])
  const [finalStandings, setFinalStandings] = useState([])
  const isMovingRef = useRef(false)
  const diceStreaksRef = useRef({})
  const currentPlayer = players[currentPlayerIndex]
  const playerPosition = playerPositions[currentPlayer.id]
  const isGameOver = gameWinner !== null

  const roll = useCallback(async () => {
    if (isMovingRef.current || isGameOver) return
    if (playerPosition >= 100 || finishedPlayerIds.includes(currentPlayer.id)) return

    isMovingRef.current = true
    setIsMoving(true)
    setIsRolling(true)
    const previousRoll = diceStreaksRef.current[currentPlayer.id]
    const isThirdConsecutiveSix = previousRoll?.dice === 6 && previousRoll.streak >= 2
    const dice = rollDice(Math.random, isThirdConsecutiveSix ? 5 : 6)
    const startPosition = playerPosition
    let position = playerPosition
    setExtraRollAvailable(false)
    setLastMove(null)
    // `rollingValue` = angka yang akan keluar; dadu menampilkannya begitu menyentuh meja.
    setRollingValue(dice)

    try {
      // Tunggu frame pertama animasi tampil, lalu mulai bunyi dan hitung mundur bersamaan.
      await nextPaint()
      onSfx('diceRoll')
      await wait(DICE_ROLL_MS)
      setIsRolling(false)
      setRollingValue(null)
      setLastRoll(dice)
      const streak = previousRoll?.dice === dice ? previousRoll.streak + 1 : 1
      diceStreaksRef.current[currentPlayer.id] = { dice, streak }
      if (streak > 1) {
        onGameEvent('DICE_STREAK', currentPlayer, { dice, streak })
      } else if (dice === 6) {
        onGameEvent('DICE_SIX', currentPlayer, { dice, streak })
      }

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
          onGameEvent('CLUTCH_ZONE', currentPlayer, { position })
        }
      }

      const specialMove = resolveSpecialSquare(position, board)
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

      // Menyalip: pemain melewati lawan yang sebelumnya ada di depannya.
      if (position < 100) {
        const passed = findPassedPlayers(players, playerPositions, currentPlayer.id, startPosition, position)
        if (passed.length) onGameEvent('OVERTAKE', currentPlayer, { target: passed[0] })
      }

      if (position === 100) {
        setExtraRollAvailable(false)
        onSfx('win')
        if (finishMode === 'quick') {
          setFinalStandings(getQuickFinishStandings(
            players,
            { ...playerPositions, [currentPlayer.id]: position },
            currentPlayer.id,
          ))
          setGameWinner(currentPlayer)
          onGameEvent('GAME_OVER', currentPlayer)
        } else {
          const nextPositions = { ...playerPositions, [currentPlayer.id]: 100 }
          const nextFinishedPlayerIds = finishedPlayerIds.includes(currentPlayer.id)
            ? finishedPlayerIds
            : [...finishedPlayerIds, currentPlayer.id]
          const remainingPlayers = players.filter((player) =>
            !nextFinishedPlayerIds.includes(player.id) && nextPositions[player.id] < 100,
          )
          setFinishedPlayerIds(nextFinishedPlayerIds)
          if (remainingPlayers.length <= 1) {
            const winner = players.find((player) => player.id === nextFinishedPlayerIds[0])
            setFinalStandings(getFinalStandings(nextFinishedPlayerIds, players, nextPositions))
            setGameWinner(winner)
            onGameEvent('GAME_OVER', winner)
          } else {
            setCurrentPlayerIndex(getNextActivePlayerIndex(
              currentPlayerIndex,
              players,
              nextPositions,
              nextFinishedPlayerIds,
            ))
          }
        }
      } else if (hasBonusRoll(dice)) {
        setExtraRollAvailable(true)
      } else {
        setExtraRollAvailable(false)
        setCurrentPlayerIndex(getNextActivePlayerIndex(
          currentPlayerIndex,
          players,
          playerPositions,
          finishedPlayerIds,
        ))
      }
    } finally {
      isMovingRef.current = false
      setIsMoving(false)
      setIsRolling(false)
      setRollingValue(null)
      setSlidingPlayerId(null)
    }
  }, [board, currentPlayer, currentPlayerIndex, finishMode, finishedPlayerIds, isGameOver, onGameEvent, onSfx, playerPosition, playerPositions, players])

  useEffect(() => {
    if (
      currentPlayer.type !== 'bot'
      || playerPosition >= 100
      || finishedPlayerIds.includes(currentPlayer.id)
      || isMoving
      || isGameOver
    ) return undefined

    const timer = window.setTimeout(() => {
      void roll()
    }, getBotThinkDelay(difficulty))

    return () => window.clearTimeout(timer)
  }, [currentPlayer, difficulty, finishedPlayerIds, isGameOver, isMoving, playerPosition, roll])

  function resetGame() {
    if (isMovingRef.current) return
    setPlayerPositions(createStartPositions(players))
    setCurrentPlayerIndex(0)
    setLastRoll(null)
    diceStreaksRef.current = {}
    setExtraRollAvailable(false)
    setFinishedPlayerIds([])
    setFinalStandings([])
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

  const leaderboard = finalStandings.length
    ? finalStandings
    : finishMode === 'play-to-end'
      ? getFinishedStandings(finishedPlayerIds, players)
      : []

  return {
    currentPlayer,
    extraRollAvailable,
    finishMode,
    leaderboard,
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
    rollingValue,
    slidingPlayerId,
    turnStatus,
  }
}
