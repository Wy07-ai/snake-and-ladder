import { useEffect, useRef } from 'react'
import ChatInput from './ChatInput.jsx'
import ChatMessage from './ChatMessage.jsx'
import { DEFAULT_NAMES } from '../../data/playerNames.js'

const DEFAULT_MEMBER_NAMES = Object.values(DEFAULT_NAMES)

// `memberNames`: nama anggota grup yang ditampilkan di header. `className`: kelas tambahan
// untuk root (mis. mengganti tinggi bawaan `h-[32rem]` saat layout memberi tinggi sendiri).
function ChatPanel({ className = '', memberNames = DEFAULT_MEMBER_NAMES, messages = [], onSend = () => {}, typingPersona = null }) {
  const scrollAreaRef = useRef(null)

  useEffect(() => {
    const scrollArea = scrollAreaRef.current
    if (scrollArea) scrollArea.scrollTo({ top: scrollArea.scrollHeight, behavior: 'smooth' })
  }, [messages, typingPersona])

  return (
    <aside className={`themed-chat-panel grid h-[32rem] min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded-lg border shadow-sm ${className}`} aria-label="Chat grup permainan">
      <div className="themed-chat-panel__header px-4 py-3">
        <h2 className="text-base font-bold">Ular Tangga</h2>
        <p className="themed-chat-panel__members truncate text-xs">{memberNames.join(', ')}</p>
        <p className="themed-chat-panel__status mt-1 min-h-4 text-xs" aria-live="polite">
          {typingPersona ? `${typingPersona.name} is typing...` : ' '}
        </p>
      </div>

      <div ref={scrollAreaRef} className="themed-chat-panel__messages flex min-h-0 flex-col gap-3 overflow-y-auto p-3">
        {messages.map((message) => <ChatMessage key={message.id} message={message} />)}
        {typingPersona && (
          <div className="themed-chat-panel__typing flex items-center gap-2 self-start rounded-lg rounded-bl-sm px-3 py-2 text-xs shadow-sm" aria-label={`${typingPersona.name} sedang mengetik`}>
            <span>{typingPersona.avatar}</span>
            <span className="flex gap-1" aria-hidden="true">
              <i className="themed-chat-panel__dot size-1 animate-bounce rounded-full [animation-delay:-0.2s]" />
              <i className="themed-chat-panel__dot size-1 animate-bounce rounded-full [animation-delay:-0.1s]" />
              <i className="themed-chat-panel__dot size-1 animate-bounce rounded-full" />
            </span>
          </div>
        )}
      </div>

      <div className="themed-chat-panel__footer border-t p-3">
        <ChatInput onSend={onSend} />
      </div>
    </aside>
  )
}

export default ChatPanel