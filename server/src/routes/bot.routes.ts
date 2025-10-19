import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.middleware.js';
import { prisma } from '../lib/prisma.js';
import { z } from 'zod';

const router = Router();

const updateBotSchema = z.object({
  name: z.string().optional(),
  primaryColor: z.string().optional(),
  glowingBorder: z.boolean().optional(),
  companyLogo: z.string().optional(),
  agentAvatar: z.string().optional(),
  showFloatingAvatar: z.boolean().optional(),
  title: z.string().optional(),
  placeholder: z.string().optional(),
  suggestedQuestions: z.array(z.string()).optional(),
});

/**
 * GET /api/bot
 */
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const bot = await prisma.bot.findFirst({
      where: {
        ownerId: req.user.userId,
      },
    });

    if (!bot) {
      return res.status(404).json({ error: 'Bot not found' });
    }

    res.json(bot);
  } catch (error: any) {
    console.error('Get bot error:', error);
    res.status(500).json({ error: 'Failed to fetch bot' });
  }
});

/**
 * PATCH /api/bot/:id
 */
router.patch('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const updates = updateBotSchema.parse(req.body);

    // Verify ownership
    const bot = await prisma.bot.findFirst({
      where: {
        id,
        ownerId: req.user.userId,
      },
    });

    if (!bot) {
      return res.status(404).json({ error: 'Bot not found' });
    }

    // Update bot
    const updated = await prisma.bot.update({
      where: { id },
      data: updates,
    });

    res.json(updated);
  } catch (error: any) {
    console.error('Update bot error:', error);
    res.status(500).json({ error: error.message || 'Failed to update bot' });
  }
});

export default router;
