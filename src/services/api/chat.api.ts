import { apiClient, ApiResponse } from './client';

export interface ChatMessage {
  question: string;
  conversationId?: string;
  agentId?: string;
}

export interface ChatMessageResponse {
  answer: string;
  sources: Array<{
    title: string;
    url?: string;
    snippet: string;
  }>;
  conversationId: string;
  messageId: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  messages?: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    sources?: any[];
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
  isRead: boolean;
}

export interface ConversationsList {
  conversations: Conversation[];
  total: number;
  limit: number;
  offset: number;
}

class ChatAPI {
  /**
   * Send a message and get AI response
   */
  async sendMessage(
    question: string,
    conversationId?: string
  ): Promise<ApiResponse<ChatMessageResponse>> {
    return apiClient.post<ChatMessageResponse>('/chat', {
      question,
      conversationId
    });
  }

  /**
   * Get a specific conversation
   */
  async getConversation(id: string): Promise<ApiResponse<Conversation>> {
    return apiClient.get<Conversation>(`/chat/conversations/${id}`);
  }

  /**
   * List user conversations
   */
  async listConversations(
    limit: number = 50,
    offset: number = 0
  ): Promise<ApiResponse<ConversationsList>> {
    return apiClient.get<ConversationsList>(
      `/chat/conversations?limit=${limit}&offset=${offset}`
    );
  }

  /**
   * Delete a conversation
   */
  async deleteConversation(id: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<{ message: string }>(`/chat/conversations/${id}`);
  }

  /**
   * Retry a failed message
   */
  async retryMessage(
    question: string,
    conversationId?: string
  ): Promise<ApiResponse<ChatMessageResponse>> {
    // Same as sendMessage but with retry logic
    return this.sendMessage(question, conversationId);
  }
}

export const chatAPI = new ChatAPI();
