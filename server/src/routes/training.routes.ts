import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.middleware.js';
import { prisma } from '../lib/prisma.js';
import { indexMaterial } from '../services/rag.service.js';
import { z } from 'zod';

const router = Router();

const addMaterialSchema = z.object({
  botId: z.string(),
  type: z.enum(['FILE', 'LINK', 'TEXT']),
  title: z.string().min(1),
  source: z.string().optional(),
  content: z.string().min(1),
});

/**
 * GET /api/training
 */
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { botId, type } = req.query;

    const materials = await prisma.trainingMaterial.findMany({
      where: {
        bot: {
          ownerId: req.user.userId,
        },
        ...(botId && { botId: botId as string }),
        ...(type && { type: type as any }),
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(materials);
  } catch (error: any) {
    console.error('Get training materials error:', error);
    res.status(500).json({ error: 'Failed to fetch training materials' });
  }
});

/**
 * POST /api/training
 */
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { botId, type, title, source, content } = addMaterialSchema.parse(req.body);

    // Verify bot ownership
    const bot = await prisma.bot.findFirst({
      where: {
        id: botId,
        ownerId: req.user.userId,
      },
    });

    if (!bot) {
      return res.status(404).json({ error: 'Bot not found' });
    }

    // Create material
    const material = await prisma.trainingMaterial.create({
      data: {
        botId,
        type,
        title,
        source,
        content,
        characters: content.length,
        status: 'UNTRAINED',
      },
    });

    // Index material asynchronously
    indexMaterial(material.id).catch(err => {
      console.error('Failed to index material:', err);
    });

    res.json(material);
  } catch (error: any) {
    console.error('Add training material error:', error);
    res.status(500).json({ error: error.message || 'Failed to add training material' });
  }
});

/**
 * POST /api/training/:id/retrain
 */
router.post('/:id/retrain', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    // Verify ownership
    const material = await prisma.trainingMaterial.findFirst({
      where: {
        id,
        bot: {
          ownerId: req.user.userId,
        },
      },
    });

    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    // Retrain asynchronously
    indexMaterial(id).catch(err => {
      console.error('Failed to retrain material:', err);
    });

    res.json({ message: 'Retraining started' });
  } catch (error: any) {
    console.error('Retrain error:', error);
    res.status(500).json({ error: 'Failed to retrain material' });
  }
});

/**
 * DELETE /api/training/:id
 */
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    // Verify ownership
    const material = await prisma.trainingMaterial.findFirst({
      where: {
        id,
        bot: {
          ownerId: req.user.userId,
        },
      },
    });

    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }

    await prisma.trainingMaterial.delete({
      where: { id },
    });

    res.json({ message: 'Material deleted' });
  } catch (error: any) {
    console.error('Delete material error:', error);
    res.status(500).json({ error: 'Failed to delete material' });
  }
});

export default router;
