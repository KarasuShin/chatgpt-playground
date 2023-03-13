import { z } from 'zod'

export const ChatMessageZod = z.object({
  role: z.union([z.literal('user'), z.literal('assistant')]),
  content: z.string(),
})

export type ChatMessage = z.infer<typeof ChatMessageZod>
