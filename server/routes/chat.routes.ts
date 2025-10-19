import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { chatRateLimiter } from '../middleware/rateLimiter.js';
import { sendMessage } from '../services/chat.service.js';

const router = express.Router();

// Send message and get AI response
router.post('/message', authenticate, chatRateLimiter, async (req: AuthRequest, res) => {
  try {
    const { message, conversationId } = req.body;
    const userId = req.userId!;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const result = await sendMessage(userId, message, conversationId);

    res.json(result);
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message || 'Failed to process message' });
  }
});

export default router;
