import { useCallback, useEffect, useRef, useState } from 'react'
import { BOT_PERSONAS } from '../data/botPersonas.js'
import { CHAT_TRIGGERS, EVENT_CHANCE, INTERRUPT_EVENTS } from '../data/chatTriggers.js'
import { FIRST_LINE_DELAY_MS, MAX_QUEUED_LINES, getLineDuration } from '../data/dialogTiming.js'
import { DEFAULT_NAMES } from '../data/playerNames.js'

let lineCounter = 0

// Dialog bot bergaya RPG: hanya satu baris tampil pada satu waktu. Pemain utama
// tidak pernah mengirim pesan; obrolan murni dipicu kejadian permainan.
//
// `onLine(line)` dipanggil tiap baris mulai tampil (dipakai untuk bunyi "blip").
// `names` (id -> nama final) menggantikan nama bawaan persona dan pemain.
//
// Mengembalikan `line` (baris yang sedang tampil, atau null) dan `triggerEvent`.
// Baris berikutnya menunggu baris sekarang selesai; antrean dibatasi supaya dialog
// tidak tertinggal jauh dari jalannya permainan.
export function useAutoChat({ onLine, names = DEFAULT_NAMES } = {}) {
  const [line, setLine] = useState(null)
  const queueRef = useRef([])
  const timerRef = useRef(null)
  const advanceRef = useRef(null)
  const onLineRef = useRef(onLine)
  const namesRef = useRef(names)
  const recentReactionsRef = useRef({})

  const advance = useCallback(() => {
    window.clearTimeout(timerRef.current)
    const next = queueRef.current.shift()
    if (!next) {
      timerRef.current = null
      setLine(null)
      return
    }

    setLine(next)
    onLineRef.current?.(next)
    timerRef.current = window.setTimeout(() => advanceRef.current?.(), getLineDuration(next.text))
  }, [])

  useEffect(() => {
    advanceRef.current = advance
  }, [advance])

  useEffect(() => {
    onLineRef.current = onLine
  }, [onLine])

  useEffect(() => {
    namesRef.current = names
  }, [names])

  // `extra.target` = pemain lain yang terlibat (mis. yang disalip).
  const triggerEvent = useCallback((eventName, player, extra = {}) => {
    const reactions = CHAT_TRIGGERS[eventName]
    if (!reactions?.length) return
    if (Math.random() > (EVENT_CHANCE[eventName] ?? 1)) return

    // Bot tidak mengomentari dirinya sendiri atau lawan yang terlibat, kecuali tak ada pilihan lain.
    const involved = [player?.id, extra.target?.id]
    const others = reactions.filter((reaction) => !involved.includes(reaction.personaId))
    const eligible = others.length ? others : reactions
    const preferredEmotions = eventName === 'SNAKE_BITE'
      ? ['frustrated', 'angry', 'resigned']
      : eventName === 'LADDER_CLIMB'
        ? ['excited', 'proud', 'sarcastic']
        : eventName === 'DICE_STREAK'
          ? extra.dice === 1
            ? ['frustrated', 'suspicious', 'resigned']
            : ['excited', 'suspicious', 'confused']
          : eventName === 'OVERTAKE'
            ? ['sarcastic', 'competitive', 'proud']
            : eventName === 'CLUTCH_ZONE'
              ? ['tense', 'nervous', 'dramatic']
              : eventName === 'DICE_SIX'
                ? ['excited', 'playful', 'suspicious']
                : eventName === 'GAME_OVER'
                  ? ['celebratory', 'resigned', 'sarcastic']
                  : ['playful', 'confident']
    const emotionalPool = eligible.filter((reaction) => preferredEmotions.includes(reaction.emotion))
    const pool = emotionalPool.length ? emotionalPool : eligible
    const recent = recentReactionsRef.current[eventName] ?? []
    const freshPool = pool.filter((reaction) => !recent.includes(reaction.text))
    const selectionPool = freshPool.length ? freshPool : pool
    const reaction = selectionPool[Math.floor(Math.random() * selectionPool.length)]
    const basePersona = BOT_PERSONAS[reaction.personaId]
    if (!basePersona) return

    // Gaya dan warna persona tetap; hanya nama tampilannya yang bisa diubah pemain.
    const persona = { ...basePersona, name: namesRef.current[basePersona.id] || basePersona.name }
    recentReactionsRef.current[eventName] = [...recent, reaction.text].slice(-6)
    const text = reaction.text
      .replaceAll('{player}', player?.name ?? 'Pemain')
      .replaceAll('{target}', extra.target?.name ?? 'lawan')
      .replaceAll('{dice}', String(extra.dice ?? '-'))
      .replaceAll('{streak}', String(extra.streak ?? '-'))
      .replaceAll('{position}', String(extra.position ?? '-'))
    lineCounter += 1
    const nextLine = { id: `line-${lineCounter}`, persona, text }

    if (INTERRUPT_EVENTS.includes(eventName)) {
      queueRef.current = [nextLine]
      advance()
      return
    }

    queueRef.current.push(nextLine)
    if (queueRef.current.length > MAX_QUEUED_LINES) queueRef.current.shift()
    if (!timerRef.current) advance()
  }, [advance])

  // Sapaan pembuka setelah layar permainan tampil.
  useEffect(() => {
    const timer = window.setTimeout(() => triggerEvent('GAME_START'), FIRST_LINE_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [triggerEvent])

  useEffect(() => () => {
    window.clearTimeout(timerRef.current)
    timerRef.current = null
    queueRef.current = []
  }, [])

  return { line, triggerEvent }
}
