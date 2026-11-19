import { Menu, Plus, Settings, Trash2, Waves, X } from 'lucide-react'
import type { ConversationSummary } from '../../types/chat'

interface SidebarProps {
  conversations: ConversationSummary[]
  activeId: string | null
  open: boolean
  onToggle: () => void
  onNew: () => void
  onOpen: (id: string) => void
  onDelete: (id: string) => void
  onSettings: () => void
}

export default function Sidebar({
  conversations,
  activeId,
  open,
  onToggle,
  onNew,
  onOpen,
  onDelete,
  onSettings,
}: SidebarProps) {
  return (
    <>
      {!open && (
        <button
          className="sidebar-menu"
          type="button"
          onClick={onToggle}
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>
      )}
      {open && (
        <button
          className="sidebar-backdrop"
          type="button"
          onClick={onToggle}
          aria-label="Close sidebar"
        />
      )}
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="brand-row">
          <div className="brand">
            <span className="brand-mark"><Waves size={20} /></span>
            <span>Ocean</span>
          </div>
          <button
            className="icon-button mobile-close"
            type="button"
            onClick={onToggle}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <button className="new-chat" type="button" onClick={onNew}>
          <Plus size={17} />
          New conversation
        </button>

        <nav className="conversation-list" aria-label="Conversation history">
          <p className="history-label">Recent</p>
          {conversations.length === 0 ? (
            <p className="history-empty">No saved conversations</p>
          ) : (
            conversations.map((conversation) => (
              <div
                className={`conversation-row ${
                  conversation.id === activeId ? 'conversation-active' : ''
                }`}
                key={conversation.id}
              >
                <button
                  type="button"
                  className="conversation-open"
                  onClick={() => onOpen(conversation.id)}
                >
                  <span>
                    {conversation.title ||
                      `Conversation ${conversation.id.slice(0, 6)}`}
                  </span>
                  <small>
                    {conversation.message_count}{' '}
                    {conversation.message_count === 1 ? 'message' : 'messages'}
                  </small>
                </button>
                <button
                  type="button"
                  className="conversation-delete"
                  onClick={() => onDelete(conversation.id)}
                  aria-label="Delete conversation"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </nav>

        <button className="settings-button" type="button" onClick={onSettings}>
          <Settings size={17} />
          Settings
        </button>
      </aside>
    </>
  )
}
