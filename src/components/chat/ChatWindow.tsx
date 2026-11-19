import { useEffect, useRef } from 'react'
import type { ChatMessage as ChatMessageType } from '../../types/chat'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import EmptyState from './EmptyState'

interface ChatWindowProps {
  messages: ChatMessageType[]
  isLoading: boolean
  error: string | null
  onSend: (message: string) => void
}

export default function ChatWindow({
  messages,
  isLoading,
  error,
  onSend,
}: ChatWindowProps) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <main className="chat-main">
      {messages.length === 0 ? (
        <div className="empty-scroll">
          <EmptyState onSuggestion={onSend} />
        </div>
      ) : (
        <div className="message-scroll" role="log" aria-live="polite">
          <div className="message-list">
            {messages.map((message, index) => (
              <ChatMessage
                key={`${message.created_at || message.role}-${index}`}
                message={message}
              />
            ))}
            {isLoading && (
              <div className="loading-message" aria-label="Ocean está respondendo">
                <div className="message-avatar"><span className="ocean-dots">•••</span></div>
                <div className="typing-dots"><i /><i /><i /></div>
              </div>
            )}
            {error && (
              <div className="error-message" role="alert">
                {error}
              </div>
            )}
            <div ref={endRef} />
          </div>
        </div>
      )}
      {error && messages.length === 0 && (
        <div className="error-message empty-error" role="alert">{error}</div>
      )}
      <ChatInput isLoading={isLoading} onSend={onSend} />
    </main>
  )
}
