function ChatMessage({ message }) {
  const isHuman = message.type === 'human'
  const isSystem = message.type === 'system'

  return (
    <div className={`flex w-full ${isHuman ? 'justify-end' : isSystem ? 'justify-center' : 'justify-start'}`}>
      <article
        className={`max-w-[88%] rounded-lg px-3 py-2 shadow-sm ${
          isHuman
            ? 'rounded-br-sm bg-[#d9fdd3] text-[#173b2e]'
            : isSystem
              ? 'bg-[#d8e8df] text-[#53665d]'
              : 'rounded-bl-sm bg-white text-[#303b36]'
        }`}
      >
        {!isHuman && (
          <p className="mb-1 flex items-center gap-1 text-xs font-semibold" style={{ color: message.color ?? '#66736f' }}>
            {message.avatar && <span aria-hidden="true">{message.avatar}</span>}
            {message.author}
          </p>
        )}
        <p className="whitespace-pre-wrap break-words text-sm">{message.text}</p>
        <time className="mt-1 block text-right text-[10px] text-[#75827c]">
          {new Date(message.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
        </time>
      </article>
    </div>
  )
}

export default ChatMessage