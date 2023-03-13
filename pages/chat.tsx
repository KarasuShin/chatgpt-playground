import { useMemo, useState } from 'react'
import { Input, MainLayout, MessageList } from '~/components'
import type { ChatMessage } from '~/types/chat'
import type { NextPageWithLayout } from './_app'
import { chatAction, chatState } from '~/states/chat'
import { useSnapshot } from 'valtio'

const Chat: NextPageWithLayout = () => {
  const [sending, setSending] = useState(false)
  const [currentMessage, setCurrentMessage] = useState('')
  const chatSnap = useSnapshot(chatState)

  const onSubmit = async (message: string) => {
    setCurrentMessage('')
    const payload: {
      messages: ChatMessage[]
    } = {
      messages: [...chatState.messages, {
        role: 'user',
        content: message,
      }],
    }
    chatAction.sendMessage({
      role: 'user',
      content: message,
    })

    try {
      setSending(true)
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        throw new Error('Something went wrong')
      }
      const stream = res.body
      if (!stream) {
        throw new Error('Something went wrong')
      }
      const reader = stream.getReader()
      const decoder = new TextDecoder('utf-8')
      let newMessages = ''
      while (true) {
        // eslint-disable-next-line no-await-in-loop
        const { done, value } = await reader.read()
        if (done) {
          break
        }
        newMessages += decoder.decode(value)
        setCurrentMessage(newMessages)
      }

      chatAction.sendMessage({
        role: 'assistant',
        content: newMessages,
      })
    } finally {
      setSending(false)
    }
  }

  const messageList = useMemo<readonly ChatMessage[]>(() => {
    if (sending) {
      return [...chatSnap.messages, {
        role: 'assistant',
        content: currentMessage,
      }]
    }
    return chatSnap.messages
  }, [currentMessage, sending, chatSnap.messages])

  return <div className="relative h-full">
    <MessageList messages={messageList} />
    <Input onSubmit={onSubmit} loading={sending}/>
  </div>
}

Chat.getLayout = MainLayout

export default Chat
