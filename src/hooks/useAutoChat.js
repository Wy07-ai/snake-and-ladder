import { useCallback, useEffect, useRef, useState } from 'react'
import { BOT_PERSONAS } from '../data/botPersonas.js'
import { CHAT_TRIGGERS } from '../data/chatTriggers.js'

function createMessage({ author, avatar = null, color = null, text, type }) {
  return {
    id: `${Date.now()}-${Math.random()}`,
    author,
    avatar,
    color,
    text,
    timestamp: Date.now(),
    type,
  }
}

// `onIncomingMessage` dipanggil tiap pesan bot muncul (dipakai untuk bunyi "Ting!").
export function useAutoChat({ onIncomingMessage } = {}) {
  const [messages, setMessages] = useState([
    createMessage({
      author: 'Ular Tangga',
      text: 'Permainan dimulai. Semoga beruntung semuanya!',
      type: 'system',
    }),
  ])
  const [typingPersona, setTypingPersona] = useState(null)
  const queueRef = useRef([])
  const isTypingRef = useRef(false)
  const timerRef = useRef(null)
  const processNextRef = useRef(null)
  const onIncomingRef = useRef(onIncomingMessage)

  const processNext = useCallback(() => {
    if (isTypingRef.current) return

    const nextMessage = queueRef.current.shift()
    if (!nextMessage) return

    isTypingRef.current = true
    setTypingPersona(nextMessage.persona)
    const delay = 1000 + Math.random() * 500

    timerRef.current = window.setTimeout(() => {
      setMessages((currentMessages) => [...currentMessages, nextMessage.message])
      onIncomingRef.current?.(nextMessage.message)
      isTypingRef.current = false
      setTypingPersona(null)
      processNextRef.current?.()
    }, delay)
  }, [])

  useEffect(() => {
    processNextRef.current = processNext
  }, [processNext])

  useEffect(() => {
    onIncomingRef.current = onIncomingMessage
  }, [onIncomingMessage])

  const triggerEvent = useCallback((eventName, player) => {
    const reactions = CHAT_TRIGGERS[eventName]
    if (!reactions?.length) return

    const reaction = reactions[Math.floor(Math.random() * reactions.length)]
    const persona = BOT_PERSONAS[reaction.personaId]
    if (!persona) return

    const playerName = player?.name ?? 'Pemain'
    const text = reaction.text.replaceAll('{player}', playerName)
    queueRef.current.push({
      persona,
      message: createMessage({
        author: persona.name,
        avatar: persona.avatar,
        color: persona.color,
        text,
        type: 'bot',
      }),
    })
    processNext()
  }, [processNext])

  const sendMessage = useCallback((text) => {
    const trimmedText = text.trim()
    if (!trimmedText) return

    setMessages((currentMessages) => [
      ...currentMessages,
      createMessage({ author: 'Kamu', text: trimmedText, type: 'human' }),
    ])
  }, [])

  useEffect(() => () => {
    if (timerRef.current) window.clearTimeout(timerRef.current)
    queueRef.current = []
    isTypingRef.current = false
  }, [])

  return { messages, sendMessage, triggerEvent, typingPersona }
}