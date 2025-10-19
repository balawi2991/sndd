import { prisma } from '../lib/prisma.js';
import { chatCompletion, ChatMessage } from '../lib/deepseek.js';
import { retrieveContext, formatContext, extractSources } from './rag.service.js';

interface ChatRequest {
  message: string;
  botId: string;
  userId: string;
  conversationId?: string;
}

interface ChatResponse {
  conversationId: string;
  message: {
    id: string;
    role: 'assistant';
    content: string;
    sources: Array<{ title: string; url?: string }>;
    createdAt: Date;
  };
}

/**
 * Process chat message with RAG
 */
export async function processChat(request: ChatRequest): Promise<ChatResponse> {
  const { message, botId, userId, conversationId } = request;

  // Get or create conversation
  let conversation;
  if (conversationId) {
    conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId,
        botId,
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 10, // Last 10 messages for context
        },
      },
    });

    if (!conversation) {
      throw new Error('Conversation not found');
    }
  } else {
    // Create new conversation
    conversation = await prisma.conversation.create({
      data: {
        userId,
        botId,
        title: message.slice(0, 50),
        preview: message.slice(0, 100),
        lastActivity: new Date(),
      },
      include: {
        messages: true,
      },
    });
  }

  // Save user message
  const userMessage = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      role: 'USER',
      content: message,
    },
  });

  try {
    // Retrieve relevant context using RAG
    const retrievalResults = await retrieveContext(message, botId, 5);
    const context = formatContext(retrievalResults);
    const sources = extractSources(retrievalResults);

    // Get bot configuration
    const bot = await prisma.bot.findUnique({
      where: { id: botId },
    });

    // Build conversation history
    const conversationHistory: ChatMessage[] = conversation.messages.map(m => ({
      role: m.role === 'USER' ? 'user' : 'assistant',
      content: m.content,
    }));

    // Build messages for DeepSeek
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are a helpful AI assistant for ${bot?.name || 'MintChat'}. 
Your role is to answer questions based on the provided context from the knowledge base.
If the context doesn't contain relevant information, politely say so and suggest adding more training materials.
Be concise, friendly, and professional.

${context ? context : 'No specific context available for this query.'}`,
      },
      ...conversationHistory.slice(-6), // Last 6 messages for context
      {
        role: 'user',
        content: message,
      },
    ];

    // Get response from DeepSeek
    const aiResponse = await chatCompletion(messages, {
      temperature: 0.7,
      maxTokens: 1000,
    });

    // Save assistant message
    const assistantMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'ASSISTANT',
        content: aiResponse,
        sources: sources.length > 0 ? JSON.parse(JSON.stringify(sources)) : [],
      },
    });

    // Update conversation
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        lastActivity: new Date(),
        preview: message.slice(0, 100),
      },
    });

    // Log usage
    await prisma.usageLog.create({
      data: {
        userId,
        botId,
        type: 'MESSAGE',
        count: 1,
        metadata: {
          conversationId: conversation.id,
          messageLength: aiResponse.length,
        },
      },
    });

    return {
      conversationId: conversation.id,
      message: {
        id: assistantMessage.id,
        role: 'assistant',
        content: assistantMessage.content,
        sources,
        createdAt: assistantMessage.createdAt,
      },
    };
  } catch (error) {
    console.error('Error processing chat:', error);
    throw new Error('Failed to process chat message');
  }
}
