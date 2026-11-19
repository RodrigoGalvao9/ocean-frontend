import { useState, type KeyboardEvent } from 'react'
import { ArrowUp } from 'lucide-react'

interface ChatInputProps {
  isLoading: boolean
  onSend: (message: string) => void
}

export default function ChatInput({ isLoading, onSend }: ChatInputProps) {
  const [value, setValue] = useState('')

  const send = () => {
    const message = value.trim()
    if (!message || isLoading) return
    onSend(message)
    setValue('')
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      send()
    }
  }

  return (
    <div className="input-wrap">
      <div className="chat-input">
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about the maritime world..."
          rows={1}
          aria-label="Message Ocean"
          maxLength={4000}
        />
        <button
          type="button"
          onClick={send}
          disabled={!value.trim() || isLoading}
          aria-label="Send message"
        >
          <ArrowUp size={18} />
        </button>
      </div>
      <p className="input-note">Ocean can make mistakes. Verify important maritime guidance.</p>
    </div>
  )
}
