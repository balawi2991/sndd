import express from 'express';
import User from '../models/User.model.js';
import Appearance from '../models/Appearance.model.js';
import Conversation from '../models/Conversation.model.js';
import { retrieveContext } from '../services/rag.service.js';
import { callDeepSeek } from '../services/deepseek.service.js';
import { chatRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Get widget configuration (public endpoint)
router.get('/:botId/config', async (req, res) => {
  try {
    const { botId } = req.params;

    // Find user by botId
    const user = await User.findOne({ botId }).select('_id name');
    if (!user) {
      return res.status(404).json({ error: 'Bot not found' });
    }

    // Get appearance settings
    const appearance = await Appearance.findOne({ userId: user._id }).lean();

    // Return public config
    res.json({
      botId,
      config: {
        logo: appearance?.logo || '',
        primaryColor: appearance?.primaryColor || '#17B26A',
        glowingBorder: appearance?.glowingBorder ?? true,
        avatar: appearance?.avatar || '',
        showFloatingAvatar: appearance?.showFloatingAvatar ?? true,
        title: appearance?.title || 'Chat with us',
        placeholder: appearance?.placeholder || 'Ask me anything...',
        suggestedQuestions: appearance?.suggestedQuestions || [],
      },
    });
  } catch (error: any) {
    console.error('Widget config error:', error);
    res.status(500).json({ error: 'Failed to load widget configuration' });
  }
});

// Send message (public endpoint with rate limiting)
router.post('/:botId/message', chatRateLimiter, async (req, res) => {
  try {
    const { botId } = req.params;
    const { message, conversationId, sessionId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    // Find user by botId
    const user = await User.findOne({ botId }).select('_id');
    if (!user) {
      return res.status(404).json({ error: 'Bot not found' });
    }

    // Find or create conversation
    let conversation;
    if (conversationId) {
      conversation = await Conversation.findOne({
        _id: conversationId,
        userId: user._id,
      });
    }

    if (!conversation) {
      // Create new conversation with session tracking
      const title = message.substring(0, 50) + (message.length > 50 ? '...' : '');
      conversation = new Conversation({
        userId: user._id,
        title,
        messages: [],
        metadata: {
          sessionId, // Track widget sessions
          source: 'widget',
        },
      });
    }

    // Add user message
    conversation.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date(),
    });

    // Retrieve context from training materials
    const { context, sources } = await retrieveContext(String(user._id), message);

    // Call DeepSeek API
    const assistantResponse = await callDeepSeek(message, context);

    // Add assistant message with sources
    conversation.messages.push({
      role: 'assistant',
      content: assistantResponse,
      sources: sources.map((s) => ({
        title: s.title,
        url: s.url,
        materialId: s.materialId,
      })),
      timestamp: new Date(),
    });

    // Update conversation
    conversation.lastActivity = new Date();
    conversation.unread = true;
    await conversation.save();

    // Return response
    res.json({
      conversationId: conversation._id,
      message: {
        role: 'assistant',
        content: assistantResponse,
        sources: sources,
        timestamp: new Date(),
      },
    });
  } catch (error: any) {
    console.error('Widget message error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

export default router;
