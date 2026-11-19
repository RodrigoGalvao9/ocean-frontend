import { useCallback, useEffect, useState } from 'react'
import { api } from '../services/api'
import { sendChatMessage } from '../services/chatService'
import type { ChatMessage, ConversationSummary } from '../types/chat'

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [conversations, setConversations] = useState<ConversationSummary[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refreshConversations = useCallback(async () => {
    try {
      setConversations(await api.listConversations())
    } catch {
      // Listing is supplementary; chat remains usable if it is unavailable.
    }
  }, [])

  useEffect(() => {
    void refreshConversations()
  }, [refreshConversations])

  const newConversation = useCallback(() => {
    setMessages([])
    setConversationId(null)
    setError(null)
  }, [])

  const openConversation = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const conversation = await api.getConversation(id)
      setConversationId(conversation.id)
      setMessages(conversation.messages)
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : 'Não foi possível abrir a conversa.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteConversation = useCallback(
    async (id: string) => {
      try {
        await api.deleteConversation(id)
        if (conversationId === id) newConversation()
        await refreshConversations()
      } catch (caught) {
        setError(
          caught instanceof Error
            ? caught.message
            : 'Não foi possível excluir a conversa.',
        )
      }
    },
    [conversationId, newConversation, refreshConversations],
  )

  const sendMessage = useCallback(
    async (content: string) => {
      const message = content.trim()
      if (!message || isLoading) return

      setError(null)
      setMessages((current) => [
        ...current,
        { role: 'user', content: message },
      ])
      setIsLoading(true)

      try {
        const response = await sendChatMessage(message, conversationId)
        setConversationId(response.conversation_id)
        setMessages((current) => [
          ...current,
          { role: 'assistant', content: response.response },
        ])
        await refreshConversations()
      } catch (caught) {
        setError(
          caught instanceof Error ? caught.message : 'Não foi possível enviar a mensagem.',
        )
      } finally {
        setIsLoading(false)
      }
    },
    [conversationId, isLoading, refreshConversations],
  )

  return {
    messages,
    conversationId,
    conversations,
    isLoading,
    error,
    sendMessage,
    newConversation,
    openConversation,
    deleteConversation,
  }
}
