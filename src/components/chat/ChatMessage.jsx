function ChatMessage({ message }) {
  const isHuman = message.type === 'human'
  const isSystem = message.type === 'system'

  return (
    <div className={`flex w-full ${isHuman ? 'justify-end' : isSystem ? 'justify-center' : 'justify-start'}`}>
      <article
        className={`chat-message__bubble chat-message__bubble--${isHuman ? 'human' : isSystem ? 'system' : 'bot'} max-w-[88%] rounded-lg px-3 py-2 shadow-sm ${isHuman ? 'rounded-br-sm' : !isSystem ? 'rounded-bl-sm' : ''}`}
      >
        {!isHuman && (
          <p className="mb-1 flex items-center gap-1 text-xs font-semibold" style={{ color: message.color ?? 'var(--panel-muted)' }}>
            {message.avatar && <span aria-hidden="true">{message.avatar}</span>}
            {message.author}
          </p>
        )}
        <p className="whitespace-pre-wrap break-words text-sm">{message.text}</p>
        <time className="chat-message__time mt-1 block text-right text-[10px]">
          {new Date(message.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
        </time>
      </article>
    </div>
  )
}

export default ChatMessage