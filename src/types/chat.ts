export type MessageRole = 'user' | 'assistant' | 'system'

export interface SourceRef {
  tool: string
  name: string
  url: string | null
  retrieved_at: string | null
  data_timestamp: string | null
  status: string | null
  freshness: string | null
  attribution: string | null
  license: string | null
  limitations: string[]
}

export interface ChatMessage {
  role: MessageRole
  content: string
  metadata?: Record<string, unknown> & { sources?: SourceRef[] }
  created_at?: string
}

export interface ConversationSummary {
  id: string
  title: string | null
  message_count: number
  created_at: string
  updated_at: string
}

export interface ConversationDetail {
  id: string
  title: string | null
  messages: ChatMessage[]
  created_at: string
  updated_at: string
}

export interface ChatRequest {
  message: string
  conversation_id?: string | null
}

export interface ChatResponse {
  conversation_id: string
  response: string
  request_id: string
  duration_ms: number
  sources?: SourceRef[]
}
