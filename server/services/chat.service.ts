import Conversation from '../models/Conversation.model.js';
import { retrieveContext } from './rag.service.js';
import { callDeepSeek } from './deepseek.service.js';
import { updateUsage } from '../middleware/usageLimit.js';

export const sendMessage = async (
  userId: string,
  message: string,
  conversationId?: string
) => {
  try {
    // Find or create conversation
    let conversation;
    if (conversationId) {
      conversation = await Conversation.findOne({ _id: conversationId, userId });
      if (!conversation) {
        throw new Error('Conversation not found');
      }
    } else {
      // Create new conversation with title from first message
      const title = message.substring(0, 50) + (message.length > 50 ? '...' : '');
      conversation = new Conversation({
        userId,
        title,
        messages: [],
      });
    }

    // Add user message
    conversation.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date(),
    });

    // Retrieve context from training materials
    const { context, sources } = await retrieveContext(userId, message);

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

    // Update usage (estimate tokens: message + response)
    const estimatedTokens = Math.ceil(
      (message.length + assistantResponse.length) / 4
    );
    await updateUsage(userId, estimatedTokens);

    return {
      conversationId: conversation._id,
      message: {
        role: 'assistant',
        content: assistantResponse,
        sources: sources,
        timestamp: new Date(),
      },
    };
  } catch (error: any) {
    console.error('Chat service error:', error);
    throw error;
  }
};
