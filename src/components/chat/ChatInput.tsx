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
          placeholder="Pergunte sobre o mundo marítimo..."
          rows={1}
          aria-label="Mensagem para Ocean"
          maxLength={4000}
        />
        <button
          type="button"
          onClick={send}
          disabled={!value.trim() || isLoading}
          aria-label="Enviar mensagem"
        >
          <ArrowUp size={18} />
        </button>
      </div>
      <p className="input-note">O Ocean pode cometer erros. Verifique orientações marítimas importantes.</p>
    </div>
  )
}
