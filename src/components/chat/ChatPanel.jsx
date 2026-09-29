import { useEffect, useRef } from 'react'
import ChatInput from './ChatInput.jsx'
import ChatMessage from './ChatMessage.jsx'

function ChatPanel({ messages = [], onSend = () => {}, typingPersona = null }) {
  const scrollAreaRef = useRef(null)

  useEffect(() => {
    const scrollArea = scrollAreaRef.current
    if (scrollArea) scrollArea.scrollTo({ top: scrollArea.scrollHeight, behavior: 'smooth' })
  }, [messages, typingPersona])

  return (
    <aside className="grid h-[32rem] min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded-lg border border-wa-primary/15 bg-wa-paper shadow-sm" aria-label="Chat grup permainan">
      <div className="bg-wa-primary px-4 py-3 text-white">
        <h2 className="text-base font-bold">Ular Tangga</h2>
        <p className="text-xs text-white/75">Kamu, Rizky, Bagas, Davin</p>
        <p className="mt-1 min-h-4 text-xs text-[#b9f4ce]" aria-live="polite">
          {typingPersona ? `${typingPersona.name} is typing...` : ' '}
        </p>
      </div>

      <div ref={scrollAreaRef} className="flex min-h-0 flex-col gap-3 overflow-y-auto bg-[#efeae2] p-3">
        {messages.map((message) => <ChatMessage key={message.id} message={message} />)}
        {typingPersona && (
          <div className="flex items-center gap-2 self-start rounded-lg rounded-bl-sm bg-white px-3 py-2 text-xs text-[#66736f] shadow-sm" aria-label={`${typingPersona.name} sedang mengetik`}>
            <span>{typingPersona.avatar}</span>
            <span className="flex gap-1" aria-hidden="true">
              <i className="size-1 animate-bounce rounded-full bg-[#86938b] [animation-delay:-0.2s]" />
              <i className="size-1 animate-bounce rounded-full bg-[#86938b] [animation-delay:-0.1s]" />
              <i className="size-1 animate-bounce rounded-full bg-[#86938b]" />
            </span>
          </div>
        )}
      </div>

      <div className="border-t border-wa-primary/10 bg-wa-paper p-3">
        <ChatInput onSend={onSend} />
      </div>
    </aside>
  )
}

export default ChatPanel