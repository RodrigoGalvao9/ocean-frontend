import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { User, Waves } from 'lucide-react'
import type { ChatMessage as ChatMessageType } from '../../types/chat'

export default function ChatMessage({ message }: { message: ChatMessageType }) {
  const isUser = message.role === 'user'

  return (
    <article className={`message ${isUser ? 'message-user' : 'message-assistant'}`}>
      <div className="message-avatar" aria-hidden="true">
        {isUser ? <User size={16} /> : <Waves size={16} />}
      </div>
      <div className="message-body">
        <div className="message-role">{isUser ? 'You' : 'Ocean'}</div>
        {isUser ? (
          <p className="user-text">{message.content}</p>
        ) : (
          <div className="markdown">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </article>
  )
}
