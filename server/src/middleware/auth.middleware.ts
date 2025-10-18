import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { UnauthorizedError } from './errorHandler';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const payload = authService.verifyToken(token);

    // Attach user to request
    req.user = {
      userId: payload.userId,
      email: payload.email
    };

    next();
  } catch (error: any) {
    if (error.message === 'Invalid or expired token') {
      next(new UnauthorizedError('Invalid or expired token'));
    } else {
      next(error);
    }
  }
};

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't fail if no token
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = authService.verifyToken(token);
      
      req.user = {
        userId: payload.userId,
        email: payload.email
      };
    }

    next();
  } catch (error) {
    // Ignore errors for optional auth
    next();
  }
};

/**
 * Get user ID from request (for authenticated routes)
 */
export const getUserId = (req: Request): string => {
  if (!req.user) {
    throw new UnauthorizedError('User not authenticated');
  }
  return req.user.userId;
};
