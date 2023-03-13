import clsx from 'clsx'
import type { ChatMessage } from '~/types/chat'
import MarkdownIt from 'markdown-it'
import { type Highlighter, getHighlighter } from 'shiki'
import { useMount } from 'react-use'
import { useCallback, useState } from 'react'
import { useTheme } from 'next-themes'

interface MessageListProps {
  messages: readonly ChatMessage[]
}

export default function MessageList(props: MessageListProps) {
  const [highlighter, setHighlighter] = useState<Highlighter | null>(null)
  const { theme } = useTheme()

  useMount(async () => {
    const highlighter = await getHighlighter({
      paths: {
        wasm: 'https://cdn.jsdelivr.net/npm/shiki/dist/',
        themes: 'https://cdn.jsdelivr.net/npm/shiki/themes',
        languages: 'https://cdn.jsdelivr.net/npm/shiki/languages',
      },
    })
    await highlighter.loadTheme('material-theme-darker')
    await highlighter.loadTheme('material-theme-lighter')
    setHighlighter(highlighter)
  })

  const transform = useCallback((text: string) => new MarkdownIt({
    linkify: true,
    highlight: highlighter ? (code, lang) => highlighter.codeToHtml(code, { lang, theme: theme === 'light' ? 'material-theme-lighter' : 'material-theme-darker' }) : null,
  }).render(text), [highlighter, theme])

  return (
    <div className="pb-16 h-full overflow-y-auto">
      <div className="px-3">{ props.messages.map((item, index) => (
        <div key={index} className={clsx('flex items-end py-2', {
          'justify-end': item.role === 'user',
        })}>
          <div className="text-xs max-w-xs">
            <div className={
              clsx('px-4 py-2 rounded-lg inline-block', {
                'bg-blue-600 text-white rounded-br-none': item.role === 'user',
                'bg-gray-300 text-slate-800 rounded-bl-none': item.role === 'assistant',
              })
            } dangerouslySetInnerHTML={{
              __html: transform(item.content) || '...',
            }} />
          </div>
        </div>
      )) }</div>
    </div>
  )
}
