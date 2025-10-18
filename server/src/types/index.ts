// Chat Types
export interface ChatRequest {
  question: string;
  conversationId?: string;
  agentId?: string;
}

export interface ChatResponse {
  success: boolean;
  data?: {
    answer: string;
    sources: Source[];
    conversationId: string;
    messageId: string;
    timestamp: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface Source {
  title: string;
  url?: string;
  snippet: string;
}

// Message Types
export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  createdAt: Date;
}

// Conversation Types
export interface Conversation {
  id: string;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  isRead: boolean;
  messages?: Message[];
}

// Training Material Types
export type MaterialType = 'file' | 'link' | 'text';

export interface TrainingMaterial {
  id: string;
  userId: string;
  type: MaterialType;
  title: string;
  content?: string;
  url?: string;
  filePath?: string;
  indexedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Chunk Types
export interface Chunk {
  id: string;
  materialId: string;
  content: string;
  embedding: number[];
  metadata: {
    source: string;
    url?: string;
    position: number;
  };
  createdAt: Date;
}

// RAG Types
export interface RAGContext {
  chunks: Chunk[];
  formattedContext: string;
}

export interface RetrievalResult {
  chunk: Chunk;
  score: number;
}

// DeepSeek Types
export interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface DeepSeekRequest {
  model: string;
  messages: DeepSeekMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface DeepSeekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: DeepSeekMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Usage Tracking (for later)
export interface UsageStats {
  id: string;
  userId: string;
  periodStart: Date;
  periodEnd: Date;
  messagesCount: number;
  wordsCount: number;
  createdAt: Date;
}

// Config Types
export interface RAGConfig {
  chunkSize: number;
  chunkOverlap: number;
  topK: number;
  rerankTop: number;
  similarityThreshold: number;
}

export interface DeepSeekConfig {
  apiKey: string;
  baseURL: string;
  model: string;
  temperature: number;
  maxTokens: number;
  timeout: number;
}
