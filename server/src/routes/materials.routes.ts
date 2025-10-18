import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, getUserId } from '../middleware/auth.middleware';
import { materialsRepository } from '../db/repositories/materials.repository';
import { ragService } from '../services/rag.service';

const router = Router();

/**
 * GET /api/materials
 * List training materials
 */
router.get(
  '/',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = getUserId(req);

      const materials = await materialsRepository.list(userId);

      res.json({
        success: true,
        data: {
          materials,
          total: materials.length
        }
      });

    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/materials
 * Add new training material
 */
router.post(
  '/',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = getUserId(req);
      const { type, title, content, url } = req.body;

      // 1. Save to database
      const material = await materialsRepository.create({
        userId,
        type,
        title,
        content,
        url
      });

      // 2. Index with RAG service (if has content)
      if (content) {
        await ragService.indexMaterial(
          material.id,
          content,
          { source: title, url }
        );
      }

      res.json({
        success: true,
        data: material
      });

    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /api/materials/:id
 * Delete training material
 */
router.delete(
  '/:id',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = getUserId(req);

      // 1. Delete chunks from vector DB
      await ragService.deleteMaterialChunks(id);

      // 2. Delete from database
      await materialsRepository.delete(id, userId);

      res.json({
        success: true,
        message: 'Material deleted successfully'
      });

    } catch (error) {
      next(error);
    }
  }
);

export default router;
