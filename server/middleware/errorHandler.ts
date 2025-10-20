import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error with context
  logger.error('Request error', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
    body: req.body,
    userId: (req as any).userId,
  });

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  // User-friendly error messages
  const userMessage = getUserFriendlyMessage(statusCode, message);

  res.status(statusCode).json({
    error: userMessage,
    code: err.code || 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV === 'development' && { 
      originalError: message,
      stack: err.stack 
    }),
  });
};

// Convert technical errors to user-friendly messages
function getUserFriendlyMessage(statusCode: number, message: string): string {
  // Rate limit errors
  if (statusCode === 429) {
    return 'You\'re sending requests too quickly. Please wait a moment and try again.';
  }

  // Auth errors
  if (statusCode === 401) {
    return 'Your session has expired. Please sign in again.';
  }

  if (statusCode === 403) {
    return 'You don\'t have permission to perform this action.';
  }

  // Not found
  if (statusCode === 404) {
    return 'The requested resource was not found.';
  }

  // Validation errors
  if (statusCode === 400) {
    return message; // Keep original validation messages
  }

  // Server errors
  if (statusCode >= 500) {
    return 'Something went wrong on our end. Please try again later.';
  }

  return message;
}
