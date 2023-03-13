import { proxy } from 'valtio'
import type { ChatMessage } from '~/types/chat'

interface ChatState {
  messages: ChatMessage[]
}

export const chatState = proxy<ChatState>({
  messages: [],
})

export const chatAction = {
  sendMessage: (message: ChatMessage) => {
    chatState.messages.push(message)
    localStorage.setItem('chat-messages', JSON.stringify(chatState.messages))
  },
  loadStorage: () => {
    const storage = localStorage.getItem('chat-messages')
    if (storage) {
      try {
        chatState.messages = JSON.parse(storage)
      } catch {

      }
    }
  },
}
