function ChatMessage({ author = 'Pemain', message = 'Selamat bermain!' }) {
  return (
    <p className="max-w-[90%] rounded-lg bg-wa-soft px-3 py-2 text-sm text-wa-ink">
      <span className="mb-1 block text-xs font-semibold text-wa-primary">{author}</span>
      {message}
    </p>
  )
}

export default ChatMessage