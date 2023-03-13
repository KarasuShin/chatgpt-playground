import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { ChatMessageZod } from '~/types/chat'

const key = process.env.OPENAI_API_KEY

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.body.messages) {
    const { messages } = req.body
    try {
      z.array(ChatMessageZod).parse(messages)
      const answer = await fetch('https://api.openai.com/v1/chat/completions', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
        },
        method: 'POST',
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages,
          temperature: 0.6,
          stream: true,
        }),
      })
      const decoder = new TextDecoder()
      const encoder = new TextEncoder()

      res.setHeader('Content-Type', 'application/octet-stream')
      res.status(200)

      const stream = new ReadableStream({
        async start(controller) {
          const reader = answer.body?.getReader()
          if (!reader) { return }
          while (true) {
            // eslint-disable-next-line no-await-in-loop
            const { done, value } = await reader.read()
            if (done) {
              break
            }
            try {
              const json = JSON.parse(decoder.decode(value.slice(5)))
              const text = json.choices[0].delta?.content
              const code = encoder.encode(text)
              controller.enqueue(code)
              res.write(code)
            } catch {}
          }
          controller.close()
          res.end()
        },
      })
      return new Response(stream)
    } catch {
      res.status(400)
    }
  }
}
