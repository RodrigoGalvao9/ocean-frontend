import { Waves } from 'lucide-react'

interface HeaderProps {
  title: string
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="chat-header">
      <div className="header-brand">
        <span className="header-mark"><Waves size={17} /></span>
        <span>Ocean</span>
      </div>
      <div className="header-context">{title}</div>
    </header>
  )
}
