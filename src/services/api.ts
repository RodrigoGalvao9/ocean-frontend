import type {
  ChatRequest,
  ChatResponse,
  ConversationDetail,
  ConversationSummary,
} from '../types/chat'

export class ApiError extends Error {
  readonly status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const configuredUrl = import.meta.env.VITE_API_URL?.trim()

export const API_BASE_URL = (
  configuredUrl || 'http://localhost:8000'
).replace(/\/+$/, '')

const CLIENT_ID_KEY = 'ocean:client-id'
let memoryClientId: string | null = null

/**
 * Identificador anônimo e aleatório deste navegador. A API usa para que cada pessoa
 * enxergue só as próprias conversas (não é login). Se o localStorage estiver bloqueado,
 * vale só enquanto a aba estiver aberta.
 */
function getClientId(): string {
  try {
    const stored = localStorage.getItem(CLIENT_ID_KEY)
    if (stored) return stored
    const created = crypto.randomUUID().replace(/-/g, '')
    localStorage.setItem(CLIENT_ID_KEY, created)
    return created
  } catch {
    memoryClientId ??= crypto.randomUUID().replace(/-/g, '')
    return memoryClientId
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Id': getClientId(),
        ...options?.headers,
      },
    })
  } catch {
    throw new ApiError(
      'Não foi possível conectar à API do Ocean. Verifique sua conexão e a URL da API.',
    )
  }

  if (!response.ok) {
    let detail = `A requisição à API falhou (${response.status}).`
    try {
      const body = (await response.json()) as { detail?: string }
      if (body.detail) detail = body.detail
    } catch {
      // Keep the status-based fallback for non-JSON error responses.
    }
    throw new ApiError(detail, response.status)
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

export const api = {
  sendChat(payload: ChatRequest): Promise<ChatResponse> {
    return request<ChatResponse>('/api/v1/chat', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
  listConversations(): Promise<ConversationSummary[]> {
    return request<ConversationSummary[]>('/api/v1/conversations')
  },
  getConversation(id: string): Promise<ConversationDetail> {
    return request<ConversationDetail>(
      `/api/v1/conversations/${encodeURIComponent(id)}`,
    )
  },
  deleteConversation(id: string): Promise<void> {
    return request<void>(`/api/v1/conversations/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    })
  },
}
