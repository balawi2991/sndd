import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import User from '../models/User.model.js';

const router = express.Router();

// Get current usage stats
router.get('/stats', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const user = await User.findById(userId).select('plan usage limits');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate percentages
    const messageUsagePercent = Math.round(
      (user.usage.messagesCount / user.limits.messagesPerMonth) * 100
    );
    const tokenUsagePercent = Math.round(
      (user.usage.tokensUsed / user.limits.tokensPerMonth) * 100
    );

    // Get next reset date
    const nextReset = new Date(user.usage.lastReset);
    nextReset.setMonth(nextReset.getMonth() + 1);
    nextReset.setDate(1);
    nextReset.setHours(0, 0, 0, 0);

    res.json({
      plan: user.plan,
      usage: {
        messages: {
          used: user.usage.messagesCount,
          limit: user.limits.messagesPerMonth,
          percent: messageUsagePercent,
        },
        tokens: {
          used: user.usage.tokensUsed,
          limit: user.limits.tokensPerMonth,
          percent: tokenUsagePercent,
        },
      },
      nextReset: nextReset.toISOString(),
    });
  } catch (error: any) {
    console.error('Usage stats error:', error);
    res.status(500).json({ error: 'Failed to get usage stats' });
  }
});

export default router;
