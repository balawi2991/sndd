import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.middleware.js';
import { prisma } from '../lib/prisma.js';

const router = Router();

/**
 * GET /api/dashboard/stats
 */
router.get('/stats', authenticate, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get user's bot
    const bot = await prisma.bot.findFirst({
      where: {
        ownerId: req.user.userId,
      },
    });

    if (!bot) {
      return res.status(404).json({ error: 'Bot not found' });
    }

    // Get training materials stats
    const materials = await prisma.trainingMaterial.findMany({
      where: {
        botId: bot.id,
      },
    });

    const totalKnowledge = materials.length;
    const files = materials.filter(m => m.type === 'FILE').length;
    const links = materials.filter(m => m.type === 'LINK').length;
    const texts = materials.filter(m => m.type === 'TEXT').length;
    const trained = materials.filter(m => m.status === 'TRAINED').length;
    const untrained = materials.filter(m => m.status === 'UNTRAINED').length;

    // Get suggested questions count
    const suggestedQuestions = Array.isArray(bot.suggestedQuestions) 
      ? bot.suggestedQuestions.length 
      : 0;

    res.json({
      totalKnowledge,
      files,
      links,
      texts,
      trained,
      untrained,
      primaryColor: bot.primaryColor,
      suggestedQuestions,
    });
  } catch (error: any) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

export default router;
