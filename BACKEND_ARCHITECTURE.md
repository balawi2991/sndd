# Backend Architecture - Sanad (MintChat)

## 🎯 Overview

Single unified API endpoint serving all users with RAG-powered responses using DeepSeek.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  (React + TypeScript + Vite)                                │
│                                                              │
│  • Dashboard                                                │
│  • Conversations                                            │
│  • Training Materials                                       │
│  • Appearance (Live Preview)                                │
│  • Try My Agent                                             │
│  • Chat Widget (Ask-bar + Modal)                            │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ HTTP/HTTPS
                   │ POST /api/chat
                   ↓
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND SERVER                            │
│  (Node.js + Express + TypeScript)                           │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │         Single API Endpoint: /api/chat             │    │
│  │                                                     │    │
│  │  1. Receive question from frontend                 │    │
│  │  2. Authenticate user (existing auth)              │    │
│  │  3. Rate limiting check                            │    │
│  │  4. Run RAG Pipeline ──────────────────┐           │    │
│  │  5. Call DeepSeek API                  │           │    │
│  │  6. Save to Conversations DB           │           │    │
│  │  7. Return response + sources          │           │    │
│  └────────────────────────────────────────┼───────────┘    │
│                                            │                 │
│  ┌────────────────────────────────────────▼───────────┐    │
│  │              RAG PIPELINE                           │    │
│  │                                                     │    │
│  │  ┌─────────────────────────────────────────────┐  │    │
│  │  │  1. NORMALIZE QUESTION                      │  │    │
│  │  │     • Clean text                            │  │    │
│  │  │     • Remove special chars                  │  │    │
│  │  │     • Lowercase                             │  │    │
│  │  └─────────────────────────────────────────────┘  │    │
│  │                      ↓                             │    │
│  │  ┌─────────────────────────────────────────────┐  │    │
│  │  │  2. RETRIEVE (Vector Search)                │  │    │
│  │  │     • Query embedding                       │  │    │
│  │  │     • Similarity search                     │  │    │
│  │  │     • Get Top-K chunks (k=5-10)            │  │    │
│  │  └─────────────────────────────────────────────┘  │    │
│  │                      ↓                             │    │
│  │  ┌─────────────────────────────────────────────┐  │    │
│  │  │  3. RERANK (Optional but recommended)       │  │    │
│  │  │     • Score by relevance                    │  │    │
│  │  │     • Sort by score                         │  │    │
│  │  │     • Take Top-3                            │  │    │
│  │  └─────────────────────────────────────────────┘  │    │
│  │                      ↓                             │    │
│  │  ┌─────────────────────────────────────────────┐  │    │
│  │  │  4. BUILD CONTEXT                           │  │    │
│  │  │     • Format chunks                         │  │    │
│  │  │     • Add metadata (source, title)          │  │    │
│  │  │     • Limit context length                  │  │    │
│  │  └─────────────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────┘    │
│                                                           │
└───────────────────┬───────────────────────────────────────┘
                    │
                    │ HTTPS
                    │ DeepSeek API Key (server-side only)
                    ↓
┌─────────────────────────────────────────────────────────────┐
│                    DEEPSEEK API                              │
│                                                              │
│  • Model: deepseek-chat                                     │
│  • Input: Question + RAG Context                            │
│  • Output: AI Response                                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      DATABASE                                │
│  (PostgreSQL / MongoDB)                                     │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │  Conversations   │  │ Training Materials│                │
│  │  • id            │  │ • id              │                │
│  │  • user_id       │  │ • user_id         │                │
│  │  • messages[]    │  │ • type (file/link)│                │
│  │  • created_at    │  │ • content         │                │
│  │  • updated_at    │  │ • indexed_at      │                │
│  └──────────────────┘  └──────────────────┘                │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │  Chunks          │  │  Usage (later)   │                │
│  │  • id            │  │ • user_id        │                │
│  │  • material_id   │  │ • messages_count │                │
│  │  • content       │  │ • words_count    │                │
│  │  • embedding     │  │ • period         │                │
│  │  • metadata      │  │                  │                │
│  └──────────────────┘  └──────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

---

## 📡 API Endpoint Specification

### **POST /api/chat**

**Purpose**: Single unified endpoint for all chat interactions

**Request**:
```typescript
{
  question: string;          // User's question
  conversationId?: string;   // Optional: continue existing conversation
  agentId?: string;          // Optional: specific agent config
}
```

**Response**:
```typescript
{
  success: boolean;
  data: {
    answer: string;          // AI response
    sources: Array<{         // RAG sources used
      title: string;
      url?: string;
      snippet: string;
    }>;
    conversationId: string;  // For follow-up messages
    messageId: string;       // Unique message ID
    timestamp: string;
  };
  error?: {
    code: string;
    message: string;
  };
}
```

**Error Codes**:
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `NO_TRAINING_DATA`: No materials indexed
- `DEEPSEEK_ERROR`: API error
- `INVALID_REQUEST`: Bad request format
- `UNAUTHORIZED`: Auth failed

---

## 🔄 RAG Pipeline Details

### **1. Indexing (Auto-triggered)**

**When**:
- New material added (File/Link/Text)
- Material updated
- Material deleted

**Process**:
```typescript
async function indexMaterial(material: TrainingMaterial) {
  // 1. Extract text content
  const text = await extractText(material);
  
  // 2. Chunk content (500-1000 chars with overlap)
  const chunks = chunkText(text, {
    size: 750,
    overlap: 100
  });
  
  // 3. Generate embeddings for each chunk
  for (const chunk of chunks) {
    const embedding = await generateEmbedding(chunk.text);
    
    // 4. Store in vector DB
    await db.chunks.create({
      materialId: material.id,
      content: chunk.text,
      embedding: embedding,
      metadata: {
        source: material.title,
        url: material.url,
        position: chunk.index
      }
    });
  }
}
```

**Chunking Strategy**:
- **Size**: 750 characters (balance between context and precision)
- **Overlap**: 100 characters (preserve context across boundaries)
- **Metadata**: Source title, URL, position

---

### **2. Retrieval (Per Question)**

**Process**:
```typescript
async function retrieveContext(question: string, topK: number = 10) {
  // 1. Normalize question
  const normalized = normalizeText(question);
  
  // 2. Generate query embedding
  const queryEmbedding = await generateEmbedding(normalized);
  
  // 3. Vector similarity search
  const results = await db.chunks.similaritySearch({
    embedding: queryEmbedding,
    limit: topK,
    threshold: 0.7  // Minimum similarity score
  });
  
  // 4. Rerank (optional but recommended)
  const reranked = await rerank(question, results);
  
  // 5. Take top 3-5
  return reranked.slice(0, 3);
}
```

**Similarity Metrics**:
- **Cosine Similarity**: Primary metric
- **Threshold**: 0.7 (adjust based on testing)
- **Top-K**: 10 initial, 3-5 after reranking

---

### **3. Context Building**

**Format**:
```typescript
function buildContext(chunks: Chunk[]): string {
  const context = chunks.map((chunk, i) => `
[Source ${i + 1}: ${chunk.metadata.source}]
${chunk.content}
---
  `).join('\n');
  
  return `
Based on the following information from the knowledge base:

${context}

Please answer the user's question accurately. If the information is not in the context, say so politely.
  `;
}
```

**Context Limits**:
- **Max Length**: 2000 tokens (~8000 chars)
- **Max Sources**: 3-5 chunks
- **Format**: Clear source attribution

---

## 🤖 DeepSeek Integration

### **API Configuration**

```typescript
const DEEPSEEK_CONFIG = {
  apiKey: process.env.DEEPSEEK_API_KEY,  // Server-side only!
  baseURL: 'https://api.deepseek.com/v1',
  model: 'deepseek-chat',
  temperature: 0.7,
  maxTokens: 1000,
  timeout: 30000  // 30 seconds
};
```

### **Request Format**

```typescript
async function callDeepSeek(question: string, context: string) {
  const response = await fetch(`${DEEPSEEK_CONFIG.baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DEEPSEEK_CONFIG.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: DEEPSEEK_CONFIG.model,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant. Answer based on the provided context.'
        },
        {
          role: 'user',
          content: `${context}\n\nQuestion: ${question}`
        }
      ],
      temperature: DEEPSEEK_CONFIG.temperature,
      max_tokens: DEEPSEEK_CONFIG.maxTokens
    })
  });
  
  return response.json();
}
```

### **Fallback Strategy**

```typescript
// If no relevant context found
if (chunks.length === 0) {
  return {
    answer: "I don't have enough information to answer that question accurately. Please add relevant training materials to help me provide better answers.",
    sources: [],
    needsTraining: true
  };
}
```

---

## 💾 Database Schema

### **Conversations Table**

```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  title VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_read BOOLEAN DEFAULT FALSE
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL,  -- 'user' or 'assistant'
  content TEXT NOT NULL,
  sources JSONB,  -- Array of source objects
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_conversations_user ON conversations(user_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
```

### **Training Materials Table**

```sql
CREATE TABLE training_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  type VARCHAR(20) NOT NULL,  -- 'file', 'link', 'text'
  title VARCHAR(255) NOT NULL,
  content TEXT,
  url VARCHAR(500),
  file_path VARCHAR(500),
  indexed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID NOT NULL REFERENCES training_materials(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding VECTOR(1536),  -- Assuming OpenAI embeddings
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_chunks_material ON chunks(material_id);
CREATE INDEX idx_chunks_embedding ON chunks USING ivfflat (embedding vector_cosine_ops);
```

### **Usage Tracking (Later)**

```sql
CREATE TABLE usage_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  messages_count INT DEFAULT 0,
  words_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_usage_user_period ON usage_stats(user_id, period_start);
```

---

## 🔒 Security & Rate Limiting

### **Rate Limiting**

```typescript
const RATE_LIMITS = {
  perMinute: 10,    // 10 requests per minute
  perHour: 100,     // 100 requests per hour
  perDay: 500       // 500 requests per day
};

// Using express-rate-limit
import rateLimit from 'express-rate-limit';

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max: RATE_LIMITS.perMinute,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please try again later.'
    }
  }
});

app.post('/api/chat', chatLimiter, handleChat);
```

### **API Key Security**

```typescript
// ✅ CORRECT: Server-side only
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

// ❌ WRONG: Never expose to frontend
// Never send API key to browser
// Never include in client-side code
```

### **Input Validation**

```typescript
import { z } from 'zod';

const chatRequestSchema = z.object({
  question: z.string().min(1).max(1000),
  conversationId: z.string().uuid().optional(),
  agentId: z.string().uuid().optional()
});

// Validate before processing
const validated = chatRequestSchema.parse(req.body);
```

---

## 🎨 Frontend Integration

### **API Service Layer**

```typescript
// src/services/api.ts
class ChatAPI {
  private baseURL = '/api';
  
  async sendMessage(question: string, conversationId?: string) {
    const response = await fetch(`${this.baseURL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({ question, conversationId })
    });
    
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
    
    return response.json();
  }
  
  async retryMessage(messageId: string) {
    // Retry failed message
  }
}

export const chatAPI = new ChatAPI();
```

### **Error Handling with Retry**

```typescript
// In ChatWidgetContext
const sendMessage = async (content: string) => {
  setIsSending(true);
  
  try {
    const response = await chatAPI.sendMessage(content, conversationId);
    
    // Add user message
    addMessage({
      role: 'user',
      content
    });
    
    // Add AI response
    addMessage({
      role: 'assistant',
      content: response.data.answer,
      sources: response.data.sources
    });
    
  } catch (error) {
    // Show error with retry button
    setError({
      message: 'Failed to send message',
      retry: () => sendMessage(content)
    });
  } finally {
    setIsSending(false);
  }
};
```

---

## 📊 Monitoring & Logging

### **Basic Logging**

```typescript
interface ChatLog {
  timestamp: Date;
  userId: string;
  question: string;
  responseTime: number;  // ms
  chunksRetrieved: number;
  success: boolean;
  error?: string;
}

async function logChatRequest(log: ChatLog) {
  await db.logs.create(log);
}
```

### **Performance Metrics**

- **Response Time**: Track average, p50, p95, p99
- **RAG Retrieval Time**: Embedding + search time
- **DeepSeek API Time**: External API latency
- **Success Rate**: % of successful responses

---

## 🚀 Deployment Checklist

### **Environment Variables**

```env
# DeepSeek
DEEPSEEK_API_KEY=sk-xxxxx

# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Redis (for rate limiting)
REDIS_URL=redis://localhost:6379

# App
NODE_ENV=production
PORT=3000
```

### **Required Services**

- ✅ Node.js server (Express)
- ✅ PostgreSQL database
- ✅ Vector database (pgvector extension)
- ✅ Redis (rate limiting)
- ✅ File storage (S3/local)

---

## 📝 Next Steps

1. **Setup Backend Structure** (Express + TypeScript)
2. **Implement RAG Pipeline** (Indexing + Retrieval)
3. **Integrate DeepSeek API**
4. **Create Database Schema**
5. **Build Frontend API Layer**
6. **Add Error Handling + Retry**
7. **Implement Rate Limiting**
8. **Connect Conversations Page**
9. **Auto-index Training Materials**
10. **Test Widget Integration**

---

**Status**: 📋 Ready to implement  
**Priority**: 🔴 Critical  
**Estimated Time**: 15-20 hours
