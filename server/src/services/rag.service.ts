import { OpenAI } from 'openai';
import { Chunk, RAGContext, RetrievalResult } from '../types';
import { NoTrainingDataError } from '../middleware/errorHandler';

export class RAGService {
  private openai: OpenAI;
  private config = {
    chunkSize: parseInt(process.env.RAG_CHUNK_SIZE || '750'),
    chunkOverlap: parseInt(process.env.RAG_CHUNK_OVERLAP || '100'),
    topK: parseInt(process.env.RAG_TOP_K || '10'),
    rerankTop: parseInt(process.env.RAG_RERANK_TOP || '3'),
    similarityThreshold: parseFloat(process.env.RAG_SIMILARITY_THRESHOLD || '0.7')
  };

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is required for embeddings');
    }

    this.openai = new OpenAI({ apiKey });
  }

  /**
   * Generate embedding for text using OpenAI
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: this.normalizeText(text)
      });

      return response.data[0].embedding;
    } catch (error: any) {
      console.error('Embedding generation error:', error.message);
      throw new Error('Failed to generate embedding');
    }
  }

  /**
   * Normalize text for better retrieval
   */
  normalizeText(text: string): string {
    return text
      .trim()
      .replace(/\s+/g, ' ') // Multiple spaces to single
      .replace(/[^\w\s\u0600-\u06FF]/g, '') // Keep alphanumeric + Arabic
      .toLowerCase();
  }

  /**
   * Chunk text into smaller pieces with overlap
   */
  chunkText(text: string): Array<{ text: string; index: number }> {
    const chunks: Array<{ text: string; index: number }> = [];
    const { chunkSize, chunkOverlap } = this.config;

    let start = 0;
    let index = 0;

    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length);
      const chunkText = text.slice(start, end).trim();

      if (chunkText.length > 0) {
        chunks.push({
          text: chunkText,
          index: index++
        });
      }

      start += chunkSize - chunkOverlap;
    }

    return chunks;
  }

  /**
   * Retrieve relevant chunks for a question
   * NOTE: This is a placeholder - will be replaced with actual vector DB query
   */
  async retrieveChunks(
    question: string,
    userId: string
  ): Promise<RetrievalResult[]> {
    try {
      // 1. Generate query embedding
      const queryEmbedding = await this.generateEmbedding(question);

      // 2. Search in vector database
      // TODO: Replace with actual vector DB query (pgvector, Pinecone, etc.)
      const chunks = await this.vectorSearch(queryEmbedding, userId);

      if (chunks.length === 0) {
        throw new NoTrainingDataError();
      }

      // 3. Filter by similarity threshold
      const filtered = chunks.filter(
        result => result.score >= this.config.similarityThreshold
      );

      // 4. Take top K
      return filtered.slice(0, this.config.topK);

    } catch (error) {
      if (error instanceof NoTrainingDataError) {
        throw error;
      }
      console.error('Retrieval error:', error);
      return [];
    }
  }

  /**
   * Rerank results for better relevance
   */
  async rerank(
    question: string,
    results: RetrievalResult[]
  ): Promise<RetrievalResult[]> {
    // Simple reranking based on keyword matching
    // TODO: Implement more sophisticated reranking (cross-encoder, etc.)
    
    const questionWords = this.normalizeText(question).split(' ');
    
    const reranked = results.map(result => {
      const contentWords = this.normalizeText(result.chunk.content).split(' ');
      const matchCount = questionWords.filter(word => 
        contentWords.includes(word)
      ).length;
      
      // Boost score based on keyword matches
      const boostedScore = result.score + (matchCount * 0.01);
      
      return {
        ...result,
        score: boostedScore
      };
    });

    // Sort by boosted score
    reranked.sort((a, b) => b.score - a.score);

    // Return top N
    return reranked.slice(0, this.config.rerankTop);
  }

  /**
   * Build context from chunks
   */
  buildContext(chunks: Chunk[]): string {
    if (chunks.length === 0) {
      return '';
    }

    const contextParts = chunks.map((chunk, i) => {
      const source = chunk.metadata.source;
      const url = chunk.metadata.url ? ` (${chunk.metadata.url})` : '';
      
      return `[Source ${i + 1}: ${source}${url}]
${chunk.content}
---`;
    });

    return `Based on the following information from the knowledge base:

${contextParts.join('\n\n')}

Please answer the user's question accurately using the information above. If the information is not sufficient, say so politely and suggest adding more training materials.`;
  }

  /**
   * Get RAG context for a question
   */
  async getContext(question: string, userId: string): Promise<RAGContext> {
    try {
      // 1. Retrieve relevant chunks
      const results = await this.retrieveChunks(question, userId);

      if (results.length === 0) {
        return {
          chunks: [],
          formattedContext: ''
        };
      }

      // 2. Rerank for better relevance
      const reranked = await this.rerank(question, results);

      // 3. Extract chunks
      const chunks = reranked.map(r => r.chunk);

      // 4. Build formatted context
      const formattedContext = this.buildContext(chunks);

      return {
        chunks,
        formattedContext
      };

    } catch (error) {
      if (error instanceof NoTrainingDataError) {
        throw error;
      }
      console.error('RAG context error:', error);
      return {
        chunks: [],
        formattedContext: ''
      };
    }
  }

  /**
   * Vector search using pgvector
   */
  private async vectorSearch(
    embedding: number[],
    userId: string
  ): Promise<RetrievalResult[]> {
    try {
      // Import materials repository
      const { materialsRepository } = await import('../db/repositories/materials.repository');

      // Search similar chunks
      const results = await materialsRepository.searchSimilarChunks(
        userId,
        embedding,
        this.config.similarityThreshold,
        this.config.topK
      );

      console.log(`Vector search found ${results.length} chunks for user ${userId}`);

      return results;

    } catch (error) {
      console.error('Vector search error:', error);
      return [];
    }
  }

  /**
   * Index a training material
   */
  async indexMaterial(
    materialId: string,
    content: string,
    metadata: { source: string; url?: string }
  ): Promise<void> {
    try {
      const { materialsRepository } = await import('../db/repositories/materials.repository');

      // 1. Delete existing chunks
      await materialsRepository.deleteChunks(materialId);

      // 2. Chunk the content
      const chunks = this.chunkText(content);

      console.log(`Indexing material ${materialId}: ${chunks.length} chunks`);

      // 3. Generate embeddings and store
      for (const chunk of chunks) {
        const embedding = await this.generateEmbedding(chunk.text);

        await materialsRepository.addChunk({
          materialId,
          content: chunk.text,
          embedding,
          metadata: {
            ...metadata,
            position: chunk.index
          }
        });

        console.log(`Indexed chunk ${chunk.index + 1}/${chunks.length}`);
      }

      // 4. Mark material as indexed
      await materialsRepository.markIndexed(materialId);

      console.log(`Material ${materialId} indexed successfully`);

    } catch (error) {
      console.error('Indexing error:', error);
      throw new Error('Failed to index material');
    }
  }

  /**
   * Delete chunks for a material
   */
  async deleteMaterialChunks(materialId: string): Promise<void> {
    try {
      const { materialsRepository } = await import('../db/repositories/materials.repository');
      await materialsRepository.deleteChunks(materialId);
      console.log(`Deleted chunks for material ${materialId}`);
    } catch (error) {
      console.error('Delete chunks error:', error);
      throw new Error('Failed to delete chunks');
    }
  }
}

// Singleton instance
export const ragService = new RAGService();
