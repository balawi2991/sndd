import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from './errorHandler';

/**
 * Extended Request with user info
 */
export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}

/**
 * Simple authentication middleware
 * For now, uses X-User-Id header (development)
 * TODO: Replace with JWT/Session authentication in production
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get user ID from header (temporary - for development)
    const userId = req.headers['x-user-id'] as string;

    if (!userId) {
      throw new UnauthorizedError('User ID required');
    }

    // TODO: In production, validate JWT token:
    // const token = req.headers.authorization?.replace('Bearer ', '');
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.userId = decoded.userId;

    // For now, just set the user ID
    req.userId = userId;

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Optional authentication
 * Doesn't fail if no auth provided
 */
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    
    if (userId) {
      req.userId = userId;
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Check if user owns resource
 */
export const checkOwnership = (resourceUserId: string, requestUserId: string): boolean => {
  return resourceUserId === requestUserId;
};
