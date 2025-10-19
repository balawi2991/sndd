import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.middleware.js';
import { chatLimiter } from '../middleware/rateLimit.middleware.js';
import { processChat } from '../services/chat.service.js';
import { z } from 'zod';

const router = Router();

const chatSchema = z.object({
  message: z.string().min(1).max(2000),
  botId: z.string(),
  conversationId: z.string().optional(),
});

/**
 * POST /api/chat
 */
router.post('/', authenticate, chatLimiter, async (req: AuthRequest, res) => {
  try {
    const { message, botId, conversationId } = chatSchema.parse(req.body);

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const result = await processChat({
      message,
      botId,
      userId: req.user.userId,
      conversationId,
    });

    res.json(result);
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message || 'Failed to process message' });
  }
});

export default router;
