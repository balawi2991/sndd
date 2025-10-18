import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, getUserId } from '../middleware/auth.middleware';
import { conversationsRepository } from '../db/repositories/conversations.repository';

const router = Router();

/**
 * GET /api/conversations
 * List all conversations for user
 */
router.get(
  '/',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = getUserId(req);
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const search = req.query.search as string;

      const result = await conversationsRepository.list(userId, limit, offset, search);

      res.json({
        success: true,
        data: {
          ...result,
          limit,
          offset
        }
      });

    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/conversations/:id
 * Get specific conversation with messages
 */
router.get(
  '/:id',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = getUserId(req);

      const conversation = await conversationsRepository.findById(id, userId);

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
 * PATCH /api/conversations/:id
 * Update conversation (e.g., mark as read, rename)
 */
router.patch(
  '/:id',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = getUserId(req);
      const { title, isRead } = req.body;

      const updated = await conversationsRepository.update(id, userId, { title, isRead });

      res.json({
        success: true,
        data: updated
      });

    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /api/conversations/:id
 * Delete conversation
 */
router.delete(
  '/:id',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = getUserId(req);

      await conversationsRepository.delete(id, userId);

      res.json({
        success: true,
        message: 'Conversation deleted successfully'
      });

    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/conversations/:id/export
 * Export conversation
 */
router.post(
  '/:id/export',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = getUserId(req);
      const { format } = req.body; // 'json', 'markdown', 'pdf'

      // TODO: Implement export functionality
      const conversation = await conversationsRepository.findById(id, userId);

      res.json({
        success: true,
        data: {
          format,
          conversation,
          downloadUrl: '#'
        }
      });

    } catch (error) {
      next(error);
    }
  }
);

export default router;
