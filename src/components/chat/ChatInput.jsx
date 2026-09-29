import { useState } from 'react'

function ChatInput({ onSend = () => {} }) {
  const [message, setMessage] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const trimmedMessage = message.trim()
    if (!trimmedMessage) return
    onSend(trimmedMessage)
    setMessage('')
  }

  return (
    <form className="flex gap-2" onSubmit={handleSubmit}>
      <input
        className="min-w-0 flex-1 rounded-md border border-wa-primary/20 bg-wa-paper px-3 py-2 text-sm outline-none focus:border-wa-primary"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Tulis pesan"
        aria-label="Pesan chat"
      />
      <button className="rounded-md bg-wa-primary px-3 py-2 text-sm font-semibold text-white" type="submit">
        Kirim
      </button>
    </form>
  )
}

export default ChatInput