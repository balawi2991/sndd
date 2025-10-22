import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import Appearance from '../models/Appearance.model.js';

const router = express.Router();

// Get appearance settings
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    let appearance = await Appearance.findOne({ userId: req.userId });

    if (!appearance) {
      // Create default appearance
      appearance = new Appearance({ userId: req.userId });
      await appearance.save();
    }

    res.json(appearance);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update appearance settings
router.put('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const updates = req.body;

    // Validate personality fields if provided
    if (updates.language && !['ar', 'en', 'both'].includes(updates.language)) {
      return res.status(400).json({ error: 'Invalid language value' });
    }

    if (updates.tone && !['formal', 'friendly', 'professional'].includes(updates.tone)) {
      return res.status(400).json({ error: 'Invalid tone value' });
    }

    const appearance = await Appearance.findOneAndUpdate(
      { userId: req.userId },
      { ...updates, userId: req.userId },
      { new: true, upsert: true }
    );

    res.json(appearance);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
