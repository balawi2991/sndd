import axios, { AxiosInstance } from 'axios';
import { DeepSeekRequest, DeepSeekResponse, DeepSeekMessage } from '../types';
import { DeepSeekError } from '../middleware/errorHandler';

export class DeepSeekService {
  private client: AxiosInstance;
  private config = {
    apiKey: process.env.DEEPSEEK_API_KEY || '',
    baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1',
    model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
    temperature: parseFloat(process.env.DEEPSEEK_TEMPERATURE || '0.7'),
    maxTokens: parseInt(process.env.DEEPSEEK_MAX_TOKENS || '1000'),
    timeout: parseInt(process.env.DEEPSEEK_TIMEOUT || '30000')
  };

  constructor() {
    if (!this.config.apiKey) {
      throw new Error('DEEPSEEK_API_KEY is required');
    }

    this.client = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Generate AI response using DeepSeek API
   */
  async generateResponse(
    question: string,
    context?: string
  ): Promise<string> {
    try {
      const messages: DeepSeekMessage[] = [
        {
          role: 'system',
          content: this.getSystemPrompt()
        }
      ];

      // Add context if available
      if (context) {
        messages.push({
          role: 'user',
          content: `${context}\n\nQuestion: ${question}`
        });
      } else {
        messages.push({
          role: 'user',
          content: question
        });
      }

      const request: DeepSeekRequest = {
        model: this.config.model,
        messages,
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens,
        stream: false
      };

      const startTime = Date.now();
      const response = await this.client.post<DeepSeekResponse>(
        '/chat/completions',
        request
      );
      const responseTime = Date.now() - startTime;

      console.log(`DeepSeek API response time: ${responseTime}ms`);

      if (!response.data.choices || response.data.choices.length === 0) {
        throw new DeepSeekError('No response from AI');
      }

      const answer = response.data.choices[0].message.content;

      // Log usage
      console.log('DeepSeek usage:', {
        promptTokens: response.data.usage.prompt_tokens,
        completionTokens: response.data.usage.completion_tokens,
        totalTokens: response.data.usage.total_tokens
      });

      return answer;

    } catch (error: any) {
      console.error('DeepSeek API error:', error.response?.data || error.message);

      if (error.response?.status === 429) {
        throw new DeepSeekError('AI service rate limit exceeded. Please try again later.');
      }

      if (error.response?.status === 401) {
        throw new DeepSeekError('AI service authentication failed.');
      }

      if (error.code === 'ECONNABORTED') {
        throw new DeepSeekError('AI service timeout. Please try again.');
      }

      throw new DeepSeekError('Failed to get AI response. Please try again.');
    }
  }

  /**
   * Get system prompt for the AI
   */
  private getSystemPrompt(): string {
    return `You are a helpful AI assistant for Sanad (MintChat platform).

Your role:
- Answer questions accurately based on the provided context
- Be concise and clear in your responses
- If information is not in the context, politely say so
- Maintain a professional and friendly tone
- Use Arabic or English based on the user's question language

Guidelines:
- Always cite sources when using information from the context
- If you're unsure, admit it rather than making up information
- Keep responses focused and relevant to the question
- Use bullet points or numbered lists for clarity when appropriate`;
  }

  /**
   * Generate response without context (fallback)
   */
  async generateFallbackResponse(question: string): Promise<string> {
    const fallbackMessage = `I don't have enough information in my knowledge base to answer that question accurately. 

To help me provide better answers, please:
1. Add relevant training materials (documents, links, or text)
2. Make sure the materials cover topics related to your questions
3. Try asking again after adding the materials

Is there anything else I can help you with?`;

    return fallbackMessage;
  }

  /**
   * Health check for DeepSeek API
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.generateResponse('Hello');
      return !!response;
    } catch (error) {
      console.error('DeepSeek health check failed:', error);
      return false;
    }
  }
}

// Singleton instance
export const deepSeekService = new DeepSeekService();
