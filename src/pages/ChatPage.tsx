import { useEffect, useState } from 'react'
import { API_BASE_URL } from '../services/api'
import { useChat } from '../hooks/useChat'
import Sidebar from '../components/layout/Sidebar'
import Header from '../components/layout/Header'
import ChatWindow from '../components/chat/ChatWindow'

export default function ChatPage() {
  const chat = useChat()
  const [sidebarOpen, setSidebarOpen] = useState(
    () => window.innerWidth > 760,
  )
  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 760) setSidebarOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const title = chat.conversationId
    ? `Conversa ${chat.conversationId.slice(0, 8)}`
    : 'Nova conversa'

  return (
    <div className="app-shell">
      <Sidebar
        conversations={chat.conversations}
        activeId={chat.conversationId}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((current) => !current)}
        onNew={chat.newConversation}
        onOpen={(id) => void chat.openConversation(id)}
        onDelete={(id) => void chat.deleteConversation(id)}
        onSettings={() => setSettingsOpen(true)}
      />
      <section className="chat-panel">
        <Header title={title} />
        <ChatWindow
          messages={chat.messages}
          isLoading={chat.isLoading}
          error={chat.error}
          onSend={(message) => void chat.sendMessage(message)}
        />
      </section>

      {settingsOpen && (
        <div className="settings-overlay" role="presentation">
          <button
            type="button"
            className="settings-backdrop"
            onClick={() => setSettingsOpen(false)}
            aria-label="Fechar configurações"
          />
          <section className="settings-dialog" role="dialog" aria-modal="true" aria-label="Configurações">
            <h2>Configurações</h2>
            <label>
              Endereco da API
              <input value={API_BASE_URL} readOnly />
            </label>
            <p>A URL do backend foi configurada com <code>VITE_API_URL</code>.</p>
            <button type="button" onClick={() => setSettingsOpen(false)}>Concluido</button>
          </section>
        </div>
      )}
    </div>
  )
}
