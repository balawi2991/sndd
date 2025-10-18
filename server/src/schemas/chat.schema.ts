import { z } from 'zod';

export const chatRequestSchema = z.object({
  question: z.string()
    .min(1, 'Question cannot be empty')
    .max(1000, 'Question is too long (max 1000 characters)'),
  conversationId: z.string().uuid().optional(),
  agentId: z.string().uuid().optional()
});

export const retryMessageSchema = z.object({
  messageId: z.string().uuid()
});

export type ChatRequestInput = z.infer<typeof chatRequestSchema>;
export type RetryMessageInput = z.infer<typeof retryMessageSchema>;
