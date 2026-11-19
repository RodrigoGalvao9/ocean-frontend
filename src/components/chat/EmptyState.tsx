import { Compass, Ship, ShieldCheck, Waves } from 'lucide-react'

const suggestions = [
  {
    title: 'Explain maritime navigation.',
    icon: Compass,
  },
  {
    title: 'What are the main types of vessels?',
    icon: Ship,
  },
  {
    title: 'Explain maritime safety.',
    icon: ShieldCheck,
  },
  {
    title: 'What do you know about ocean routes?',
    icon: Waves,
  },
]

interface EmptyStateProps {
  onSuggestion: (prompt: string) => void
}

export default function EmptyState({ onSuggestion }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-emblem"><Waves size={30} /></div>
      <p className="empty-eyebrow">MARITIME INTELLIGENCE</p>
      <h1>How can I help you navigate?</h1>
      <p className="empty-description">
        Ask about vessels, routes, navigation, maritime operations,
        or ocean knowledge.
      </p>
      <div className="suggestion-grid">
        {suggestions.map(({ title, icon: Icon }) => (
          <button
            type="button"
            className="suggestion-card"
            key={title}
            onClick={() => onSuggestion(title)}
          >
            <Icon size={17} />
            <span>{title}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
