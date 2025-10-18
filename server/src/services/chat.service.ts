import { v4 as uuidv4 } from 'uuid';
import { ChatRequest, ChatResponse, Source } from '../types';
import { deepSeekService } from './deepseek.service';
import { ragService } from './rag.service';
import { NoTrainingDataError } from '../middleware/errorHandler';

export class ChatService {
  /**
   * Process a chat message with RAG + DeepSeek
   */
  async processMessage(
    request: ChatRequest,
    userId: string
  ): Promise<ChatResponse> {
    const startTime = Date.now();

    try {
      const { question, conversationId } = request;

      console.log(`Processing message for user ${userId}:`, question);

      // 1. Get RAG context
      let context = '';
      let sources: Source[] = [];

      try {
        const ragContext = await ragService.getContext(question, userId);
        context = ragContext.formattedContext;
        
        // Extract sources from chunks
        sources = ragContext.chunks.map(chunk => ({
          title: chunk.metadata.source,
          url: chunk.metadata.url,
          snippet: this.extractSnippet(chunk.content)
        }));

        console.log(`Retrieved ${ragContext.chunks.length} relevant chunks`);

      } catch (error) {
        if (error instanceof NoTrainingDataError) {
          // No training data - use fallback
          console.log('No training data available, using fallback');
          const answer = await deepSeekService.generateFallbackResponse(question);
          
          return this.buildResponse(
            answer,
            [],
            conversationId || uuidv4(),
            uuidv4()
          );
        }
        throw error;
      }

      // 2. Generate AI response
      const answer = await deepSeekService.generateResponse(question, context);

      // 3. Save conversation (TODO: implement database)
      const finalConversationId = conversationId || uuidv4();
      const messageId = uuidv4();

      await this.saveConversation(
        userId,
        finalConversationId,
        question,
        answer,
        sources
      );

      // 4. Log performance
      const responseTime = Date.now() - startTime;
      console.log(`Total response time: ${responseTime}ms`);

      return this.buildResponse(answer, sources, finalConversationId, messageId);

    } catch (error: any) {
      console.error('Chat processing error:', error);
      throw error;
    }
  }

  /**
   * Build successful response
   */
  private buildResponse(
    answer: string,
    sources: Source[],
    conversationId: string,
    messageId: string
  ): ChatResponse {
    return {
      success: true,
      data: {
        answer,
        sources,
        conversationId,
        messageId,
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Extract snippet from chunk content
   */
  private extractSnippet(content: string, maxLength: number = 150): string {
    if (content.length <= maxLength) {
      return content;
    }
    return content.slice(0, maxLength).trim() + '...';
  }

  /**
   * Save conversation to database
   */
  private async saveConversation(
    userId: string,
    conversationId: string,
    question: string,
    answer: string,
    sources: Source[]
  ): Promise<void> {
    try {
      const { conversationsRepository } = await import('../db/repositories/conversations.repository');

      // 1. Get or create conversation
      const conversation = await conversationsRepository.getOrCreate(
        userId,
        conversationId,
        this.generateTitle(question)
      );

      // 2. Add user message
      await conversationsRepository.addMessage(
        conversation.id,
        'user',
        question
      );

      // 3. Add assistant message with sources
      await conversationsRepository.addMessage(
        conversation.id,
        'assistant',
        answer,
        sources
      );

      // 4. Update conversation timestamp
      await conversationsRepository.touch(conversation.id);

      console.log('Conversation saved:', {
        conversationId: conversation.id,
        questionLength: question.length,
        answerLength: answer.length,
        sourcesCount: sources.length
      });

    } catch (error) {
      console.error('Save conversation error:', error);
      // Don't throw - conversation saving failure shouldn't break the response
    }
  }

  /**
   * Generate conversation title from first question
   */
  private generateTitle(question: string): string {
    const maxLength = 50;
    if (question.length <= maxLength) {
      return question;
    }
    return question.slice(0, maxLength).trim() + '...';
  }

  /**
   * Get conversation history
   */
  async getConversation(conversationId: string, userId: string) {
    const { conversationsRepository } = await import('../db/repositories/conversations.repository');
    return conversationsRepository.findById(conversationId, userId);
  }

  /**
   * List user conversations
   */
  async listConversations(userId: string, limit: number = 50, offset: number = 0) {
    const { conversationsRepository } = await import('../db/repositories/conversations.repository');
    const result = await conversationsRepository.list(userId, limit, offset);
    
    return {
      ...result,
      limit,
      offset
    };
  }

  /**
   * Delete conversation
   */
  async deleteConversation(conversationId: string, userId: string): Promise<void> {
    const { conversationsRepository } = await import('../db/repositories/conversations.repository');
    const deleted = await conversationsRepository.delete(conversationId, userId);
    
    if (!deleted) {
      throw new Error('Conversation not found or already deleted');
    }
  }
}

// Singleton instance
export const chatService = new ChatService();
