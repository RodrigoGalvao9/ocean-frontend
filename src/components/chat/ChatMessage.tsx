import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ExternalLink, User, Waves } from 'lucide-react'
import type { ChatMessage as ChatMessageType } from '../../types/chat'
import type { SourceRef } from '../../types/chat'

function formatDate(value: string | null): string | null {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date)
}

function getSafeSourceUrl(value: string | null): string | null {
  if (!value) return null
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : null
  } catch {
    return null
  }
}

function getSources(message: ChatMessageType): SourceRef[] {
  const sources = message.metadata?.sources
  if (!Array.isArray(sources)) return []

  return sources.filter(
    (source): source is SourceRef =>
      typeof source === 'object'
      && source !== null
      && typeof (source as SourceRef).name === 'string',
  )
}

export default function ChatMessage({ message }: { message: ChatMessageType }) {
  const isUser = message.role === 'user'
  const sources = isUser ? [] : getSources(message)

  return (
    <article className={`message ${isUser ? 'message-user' : 'message-assistant'}`}>
      <div className="message-avatar" aria-hidden="true">
        {isUser ? <User size={16} /> : <Waves size={16} />}
      </div>
      <div className="message-body">
        <div className="message-role">{isUser ? 'Você' : 'Ocean'}</div>
        {isUser ? (
          <p className="user-text">{message.content}</p>
        ) : (
          <div className="markdown">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
        )}
        {sources.length > 0 && (
          <section className="source-list" aria-label="Fontes consultadas">
            <p className="source-heading">Fontes consultadas</p>
            {sources.map((source, index) => (
              <article className="source-card" key={`${source.name}-${source.url || index}`}>
                <div className="source-card-header">
                  <span className="source-name">{source.name}</span>
                  {getSafeSourceUrl(source.url) ? (
                    <a
                      href={getSafeSourceUrl(source.url) || undefined}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Abrir fonte ${source.name}`}
                    >
                      <ExternalLink size={14} />
                    </a>
                  ) : null}
                </div>
                <div className="source-meta">
                  {source.status && <span>{source.status}</span>}
                  {source.freshness && <span>{source.freshness}</span>}
                  {source.tool && <span>{source.tool}</span>}
                </div>
                {(source.retrieved_at || source.data_timestamp) && (
                  <dl className="source-dates">
                    {source.retrieved_at && (
                      <>
                        <dt>Consultado em</dt>
                        <dd>{formatDate(source.retrieved_at)}</dd>
                      </>
                    )}
                    {source.data_timestamp && (
                      <>
                        <dt>Dados referentes a</dt>
                        <dd>{formatDate(source.data_timestamp)}</dd>
                      </>
                    )}
                  </dl>
                )}
                {source.attribution && (
                  <p className="source-detail">
                    <strong>Atribuição:</strong> {source.attribution}
                  </p>
                )}
                {source.license && (
                  <p className="source-detail">
                    <strong>Licença:</strong> {source.license}
                  </p>
                )}
                {source.limitations?.length > 0 && (
                  <p className="source-detail">
                    <strong>Limitações:</strong> {source.limitations.join('; ')}
                  </p>
                )}
              </article>
            ))}
          </section>
        )}
      </div>
    </article>
  )
}
