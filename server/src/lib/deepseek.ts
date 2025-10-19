import OpenAI from 'openai';
import { config } from '../config/env.js';

export const deepseek = new OpenAI({
  apiKey: config.deepseek.apiKey,
  baseURL: config.deepseek.baseURL,
});

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * Send chat completion request to DeepSeek
 */
export async function chatCompletion(
  messages: ChatMessage[],
  options: ChatOptions = {}
): Promise<string> {
  try {
    const response = await deepseek.chat.completions.create({
      model: options.model || 'deepseek-chat',
      messages,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 2000,
      stream: false,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('DeepSeek API error:', error);
    throw new Error('Failed to get response from AI');
  }
}

/**
 * Stream chat completion from DeepSeek
 */
export async function* chatCompletionStream(
  messages: ChatMessage[],
  options: ChatOptions = {}
): AsyncGenerator<string> {
  try {
    const stream = await deepseek.chat.completions.create({
      model: options.model || 'deepseek-chat',
      messages,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 2000,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
  } catch (error) {
    console.error('DeepSeek streaming error:', error);
    throw new Error('Failed to stream response from AI');
  }
}
