import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.js';
import User from '../models/User.model.js';

// Check if usage needs reset (monthly)
const shouldResetUsage = (lastReset: Date): boolean => {
  const now = new Date();
  const lastResetDate = new Date(lastReset);
  
  // Reset if it's a new month
  return (
    now.getMonth() !== lastResetDate.getMonth() ||
    now.getFullYear() !== lastResetDate.getFullYear()
  );
};

// Reset usage if needed
const resetUsageIfNeeded = async (userId: string): Promise<void> => {
  const user = await User.findById(userId);
  if (!user) return;

  if (shouldResetUsage(user.usage.lastReset)) {
    user.usage.messagesCount = 0;
    user.usage.tokensUsed = 0;
    user.usage.lastReset = new Date();
    await user.save();
  }
};

// Middleware to check usage limits
export const checkUsageLimit = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Reset usage if needed
    await resetUsageIfNeeded(userId);

    // Get user with current usage
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check message limit
    if (user.usage.messagesCount >= user.limits.messagesPerMonth) {
      return res.status(429).json({
        error: 'Monthly message limit reached',
        limit: user.limits.messagesPerMonth,
        used: user.usage.messagesCount,
        resetDate: getNextResetDate(user.usage.lastReset),
      });
    }

    // Check token limit (rough estimate: 1 message ≈ 500 tokens)
    if (user.usage.tokensUsed >= user.limits.tokensPerMonth) {
      return res.status(429).json({
        error: 'Monthly token limit reached',
        limit: user.limits.tokensPerMonth,
        used: user.usage.tokensUsed,
        resetDate: getNextResetDate(user.usage.lastReset),
      });
    }

    next();
  } catch (error) {
    console.error('Usage limit check error:', error);
    next(error);
  }
};

// Get next reset date (first day of next month)
const getNextResetDate = (lastReset: Date): Date => {
  const next = new Date(lastReset);
  next.setMonth(next.getMonth() + 1);
  next.setDate(1);
  next.setHours(0, 0, 0, 0);
  return next;
};

// Update usage after successful message
export const updateUsage = async (
  userId: string,
  tokensUsed: number
): Promise<void> => {
  try {
    await User.findByIdAndUpdate(userId, {
      $inc: {
        'usage.messagesCount': 1,
        'usage.tokensUsed': tokensUsed,
      },
    });
  } catch (error) {
    console.error('Usage update error:', error);
  }
};
