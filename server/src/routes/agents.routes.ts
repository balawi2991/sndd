import { Router, Request, Response, NextFunction } from 'express';
import { agentsRepository } from '../db/repositories/agents.repository';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * GET /api/agents
 * List user's agents
 */
router.get(
  '/',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const agents = await agentsRepository.list(userId);

      res.json({
        success: true,
        data: agents
      });

    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/agents
 * Create a new agent with API key
 */
router.post(
  '/',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { name } = req.body;

      if (!name || typeof name !== 'string') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Agent name is required'
          }
        });
      }

      const agent = await agentsRepository.create(userId, name);

      res.json({
        success: true,
        data: agent
      });

    } catch (error) {
      next(error);
    }
  }
);

/**
 * PATCH /api/agents/:id
 * Update agent (name or active status)
 */
router.patch(
  '/:id',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      const { name, isActive } = req.body;

      const agent = await agentsRepository.update(id, userId, {
        name,
        isActive
      });

      if (!agent) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Agent not found'
          }
        });
      }

      res.json({
        success: true,
        data: agent
      });

    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/agents/:id/regenerate
 * Regenerate API key for an agent
 */
router.post(
  '/:id/regenerate',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      const agent = await agentsRepository.regenerateApiKey(id, userId);

      if (!agent) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Agent not found'
          }
        });
      }

      res.json({
        success: true,
        data: agent,
        message: 'API key regenerated successfully'
      });

    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /api/agents/:id
 * Delete an agent
 */
router.delete(
  '/:id',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { id } = req.params;

      const deleted = await agentsRepository.delete(id, userId);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Agent not found'
          }
        });
      }

      res.json({
        success: true,
        message: 'Agent deleted successfully'
      });

    } catch (error) {
      next(error);
    }
  }
);

export default router;
