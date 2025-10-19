import { Router } from 'express';
import { signUp, signIn } from '../services/auth.service.js';
import { authLimiter } from '../middleware/rateLimit.middleware.js';
import { z } from 'zod';

const router = Router();

const signUpSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/**
 * POST /api/auth/signup
 */
router.post('/signup', authLimiter, async (req, res) => {
  try {
    const { name, email, password } = signUpSchema.parse(req.body);
    const result = await signUp(name, email, password);
    res.json(result);
  } catch (error: any) {
    console.error('Signup error:', error);
    res.status(400).json({ error: error.message || 'Failed to sign up' });
  }
});

/**
 * POST /api/auth/signin
 */
router.post('/signin', authLimiter, async (req, res) => {
  try {
    const { email, password } = signInSchema.parse(req.body);
    const result = await signIn(email, password);
    res.json(result);
  } catch (error: any) {
    console.error('Signin error:', error);
    res.status(400).json({ error: error.message || 'Failed to sign in' });
  }
});

export default router;
