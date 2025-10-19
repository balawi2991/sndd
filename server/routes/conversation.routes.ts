import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import Conversation from '../models/Conversation.model.js';

const router = express.Router();

// Get all conversations
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const conversations = await Conversation.find({ userId: req.userId })
      .sort({ lastActivity: -1 })
      .select('title messages unread lastActivity createdAt')
      .lean();

    const formatted = conversations.map((conv) => ({
      id: conv._id,
      title: conv.title,
      preview: conv.messages[conv.messages.length - 1]?.content.substring(0, 100) || '',
      lastActivity: conv.lastActivity,
      unread: conv.unread,
      messageCount: conv.messages.length,
    }));

    res.json(formatted);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get single conversation
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.userId,
    }).lean();

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Mark as read
    await Conversation.updateOne(
      { _id: req.params.id },
      { unread: false }
    );

    res.json({
      id: conversation._id,
      title: conversation.title,
      messages: conversation.messages,
      lastActivity: conversation.lastActivity,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete conversation
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const result = await Conversation.deleteOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json({ message: 'Conversation deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Rename conversation
router.patch('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { title } = req.body;

    const conversation = await Conversation.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { title },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json({ message: 'Conversation updated', title: conversation.title });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
