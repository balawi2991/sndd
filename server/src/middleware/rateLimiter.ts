import rateLimit from 'express-rate-limit';

// Per-minute rate limiter
export const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: parseInt(process.env.RATE_LIMIT_PER_MINUTE || '10'),
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please try again in a minute.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Per-hour rate limiter
export const hourlyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: parseInt(process.env.RATE_LIMIT_PER_HOUR || '100'),
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Hourly limit exceeded. Please try again later.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Per-day rate limiter
export const dailyLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: parseInt(process.env.RATE_LIMIT_PER_DAY || '500'),
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Daily limit exceeded. Please try again tomorrow.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});
