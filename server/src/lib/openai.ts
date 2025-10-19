import OpenAI from 'openai';
import { config } from '../config/env.js';

export const openai = new OpenAI({
  apiKey: config.openai.apiKey,
});

/**
 * Generate embeddings for text using OpenAI ada-002
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text.slice(0, 8000), // Limit to 8k chars
    });
    
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error('Failed to generate embedding');
  }
}

/**
 * Generate embeddings for multiple texts in batch
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: texts.map(t => t.slice(0, 8000)),
    });
    
    return response.data.map(d => d.embedding);
  } catch (error) {
    console.error('Error generating embeddings:', error);
    throw new Error('Failed to generate embeddings');
  }
}
