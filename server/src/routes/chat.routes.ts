import { Router, Request, Response, NextFunction } from 'express';
import { chatService } from '../services/chat.service';
import { chatRequestSchema } from '../schemas/chat.schema';
import { chatLimiter } from '../middleware/rateLimiter';
import { authenticateFlexible } from '../middleware/auth';
import { ValidationError } from '../middleware/errorHandler';

const router = Router();

/**
 * POST /api/chat
 * Send a message and get AI response
 * Supports both JWT (dashboard) and API Key (embedded widget)
 */
router.post(
  '/',
  chatLimiter,
  authenticateFlexible, // JWT or API Key
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request
      const validated = chatRequestSchema.parse(req.body);

      // Get userId from auth middleware
      const userId = req.userId!;

      // Process message
      const response = await chatService.processMessage(validated, userId);

      res.json(response);

    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/chat/conversations/:id
 * Get a specific conversation
 */
router.get(
  '/conversations/:id',
  authenticateFlexible,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.userId!;

      const conversation = await chatService.getConversation(id, userId);

      res.json({
        success: true,
        data: conversation
      });

    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/chat/conversations
 * List user conversations
 */
router.get(
  '/conversations',
  authenticateFlexible,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      const result = await chatService.listConversations(userId, limit, offset);

      res.json({
        success: true,
        data: result
      });

    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /api/chat/conversations/:id
 * Delete a conversation
 */
router.delete(
  '/conversations/:id',
  authenticateFlexible,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.userId!;

      await chatService.deleteConversation(id, userId);

      res.json({
        success: true,
        message: 'Conversation deleted successfully'
      });

    } catch (error) {
      next(error);
    }
  }
);

export default router;
