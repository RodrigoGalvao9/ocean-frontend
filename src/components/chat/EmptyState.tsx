import { Compass, Ship, ShieldCheck, Waves } from 'lucide-react'

const suggestions = [
  {
    title: 'Explique a navegação marítima.',
    icon: Compass,
  },
  {
    title: 'Quais são os principais tipos de embarcações?',
    icon: Ship,
  },
  {
    title: 'Explique a segurança marítima.',
    icon: ShieldCheck,
  },
  {
    title: 'O que você sabe sobre rotas oceânicas?',
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
      <p className="empty-eyebrow">INTELIGÊNCIA MARÍTIMA</p>
      <h1>Como posso ajudar na navegação?</h1>
      <p className="empty-description">
        Pergunte sobre embarcacoes, rotas, navegacao, operacoes
        marítimas ou conhecimento oceânico.
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
