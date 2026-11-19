import { api } from './api'
import type { ChatResponse } from '../types/chat'

export async function sendChatMessage(
  message: string,
  conversationId: string | null,
): Promise<ChatResponse> {
  return api.sendChat({
    message,
    conversation_id: conversationId,
  })
}
