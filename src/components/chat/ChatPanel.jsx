import ChatInput from './ChatInput.jsx'
import ChatMessage from './ChatMessage.jsx'

function ChatPanel() {
  return (
    <aside className="grid gap-4 rounded-lg border border-wa-primary/10 bg-wa-paper p-4" aria-label="Chat permainan">
      <div>
        <h2 className="text-lg font-bold text-wa-ink">Chat pemain</h2>
        <p className="text-sm text-wa-muted">Ruang obrolan permainan</p>
      </div>
      <div className="min-h-40 rounded-md bg-wa-canvas p-3">
        <ChatMessage />
      </div>
      <ChatInput />
    </aside>
  )
}

export default ChatPanel