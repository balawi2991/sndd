import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authService } from '../services/auth.service';
import { usersRepository } from '../db/repositories/users.repository';
import { ValidationError, UnauthorizedError } from '../middleware/errorHandler';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required')
});

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post(
  '/register',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request
      const validated = registerSchema.parse(req.body);

      // Validate email format
      if (!authService.validateEmail(validated.email)) {
        throw new ValidationError('Invalid email format');
      }

      // Validate password strength
      const passwordValidation = authService.validatePassword(validated.password);
      if (!passwordValidation.valid) {
        throw new ValidationError(passwordValidation.message || 'Invalid password');
      }

      // Check if email already exists
      const emailExists = await usersRepository.emailExists(validated.email);
      if (emailExists) {
        throw new ValidationError('Email already registered');
      }

      // Hash password
      const passwordHash = await authService.hashPassword(validated.password);

      // Create user
      const user = await usersRepository.create({
        email: validated.email,
        name: validated.name,
        passwordHash
      });

      // Generate tokens
      const tokens = authService.generateTokens({
        userId: user.id,
        email: user.email
      });

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name
          },
          ...tokens
        }
      });

    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/auth/login
 * Login user
 */
router.post(
  '/login',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request
      const validated = loginSchema.parse(req.body);

      // Find user
      const user = await usersRepository.findByEmail(validated.email);
      if (!user || !user.passwordHash) {
        throw new UnauthorizedError('Invalid email or password');
      }

      // Compare password
      const isPasswordValid = await authService.comparePassword(
        validated.password,
        user.passwordHash
      );

      if (!isPasswordValid) {
        throw new UnauthorizedError('Invalid email or password');
      }

      // Generate tokens
      const tokens = authService.generateTokens({
        userId: user.id,
        email: user.email
      });

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name
          },
          ...tokens
        }
      });

    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/auth/refresh
 * Refresh access token
 */
router.post(
  '/refresh',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request
      const validated = refreshTokenSchema.parse(req.body);

      // Verify refresh token
      const payload = authService.verifyToken(validated.refreshToken);

      // Generate new access token
      const accessToken = authService.generateAccessToken({
        userId: payload.userId,
        email: payload.email
      });

      res.json({
        success: true,
        data: {
          accessToken
        }
      });

    } catch (error) {
      next(new UnauthorizedError('Invalid or expired refresh token'));
    }
  }
);

/**
 * GET /api/auth/me
 * Get current user
 */
router.get(
  '/me',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User not authenticated');
      }

      const user = await usersRepository.findById(req.user.userId);

      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name
          }
        }
      });

    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/auth/logout
 * Logout user (client-side token removal)
 */
router.post(
  '/logout',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // In a stateless JWT system, logout is handled client-side
      // by removing the token. This endpoint is just for consistency.
      
      // TODO: If using token blacklist, add token to blacklist here

      res.json({
        success: true,
        message: 'Logged out successfully'
      });

    } catch (error) {
      next(error);
    }
  }
);

export default router;
