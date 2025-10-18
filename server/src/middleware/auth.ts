import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from './errorHandler';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      userId?: string;
    }
  }
}

/**
 * Generate JWT token for user
 */
export const generateToken = (user: AuthUser): string => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name
    },
    JWT_SECRET as string,
    { expiresIn: JWT_EXPIRES_IN as string }
  );
};

/**
 * Verify JWT token
 */
export const verifyToken = (token: string): AuthUser => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired token');
  }
};

/**
 * Authentication middleware - requires valid JWT
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.substring(7); // Remove 'Bearer '

    // Verify token
    const user = verifyToken(token);

    // Attach user to request
    req.user = user;
    req.userId = user.id;

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Optional authentication - doesn't fail if no token
 * Used for public endpoints that can work with or without auth
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const user = verifyToken(token);
      req.user = user;
      req.userId = user.id;
    }

    next();
  } catch (error) {
    // Ignore auth errors for optional auth
    next();
  }
};

/**
 * API Key authentication for embedded widgets
 * Format: X-API-Key: agent_xxxxx
 */
export const authenticateApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const apiKey = req.headers['x-api-key'] as string;

    if (!apiKey) {
      throw new UnauthorizedError('API key required');
    }

    // Validate API key format
    if (!apiKey.startsWith('agent_')) {
      throw new UnauthorizedError('Invalid API key format');
    }

    // Verify API key in database
    const { agentsRepository } = await import('../db/repositories/agents.repository');
    const agent = await agentsRepository.findByApiKey(apiKey);

    if (!agent) {
      throw new UnauthorizedError('Invalid API key');
    }

    if (!agent.isActive) {
      throw new UnauthorizedError('API key is inactive');
    }

    req.userId = agent.userId;

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Combine auth methods: JWT or API Key
 * Used for widget endpoints that can be called from dashboard or embedded widget
 */
export const authenticateFlexible = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Try JWT first
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const user = verifyToken(token);
        req.user = user;
        req.userId = user.id;
        return next();
      } catch (jwtError) {
        // JWT failed, try API key
      }
    }

    // Try API Key
    const apiKey = req.headers['x-api-key'] as string;
    if (apiKey && apiKey.startsWith('agent_')) {
      const { agentsRepository } = await import('../db/repositories/agents.repository');
      const agent = await agentsRepository.findByApiKey(apiKey);

      if (agent && agent.isActive) {
        req.userId = agent.userId;
        return next();
      }
    }

    // No valid auth method
    throw new UnauthorizedError('Authentication required');
  } catch (error) {
    next(error);
  }
};

/**
 * Check if user owns the resource
 * Used to prevent users from accessing other users' data
 */
export const checkOwnership = (resourceUserId: string, requestUserId: string): boolean => {
  return resourceUserId === requestUserId;
};
