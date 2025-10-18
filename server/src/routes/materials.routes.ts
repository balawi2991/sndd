import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middleware/auth';
import { upload, extractTextFromFile, deleteFile } from '../middleware/upload';
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
      const userId = req.userId!;
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
 * POST /api/materials/text
 * Add text or link material
 */
router.post(
  '/text',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const { type, title, content, url } = req.body;

      // Validate
      if (!type || !title) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Type and title are required'
          }
        });
      }

      if (type === 'text' && !content) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Content is required for text type'
          }
        });
      }

      if (type === 'link' && !url) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'URL is required for link type'
          }
        });
      }

      // Create material
      const material = await materialsRepository.create({
        userId,
        type,
        title,
        content,
        url
      });

      // Index material
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
 * POST /api/materials/upload
 * Upload file material
 */
router.post(
  '/upload',
  authenticate,
  upload.single('file'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'File is required'
          }
        });
      }

      const { title } = req.body;
      const materialTitle = title || file.originalname;

      // Extract text from file
      const content = await extractTextFromFile(file.path, file.mimetype);

      // Create material
      const material = await materialsRepository.create({
        userId,
        type: 'file',
        title: materialTitle,
        content,
        filePath: file.path,
        fileSize: file.size,
        mimeType: file.mimetype
      });

      // Index material
      await ragService.indexMaterial(
        material.id,
        content,
        { source: materialTitle }
      );

      res.json({
        success: true,
        data: material
      });

    } catch (error) {
      // Clean up file on error
      if (req.file) {
        await deleteFile(req.file.path);
      }
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
      const userId = req.userId!;

      // Get material to delete file
      const material = await materialsRepository.findById(id, userId);

      if (!material) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Material not found'
          }
        });
      }

      // Delete chunks
      await ragService.deleteMaterialChunks(id);

      // Delete file if exists
      if (material.filePath) {
        await deleteFile(material.filePath);
      }

      // Delete from database
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
