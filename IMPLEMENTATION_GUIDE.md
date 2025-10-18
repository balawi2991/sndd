# Backend Implementation Guide

## ✅ ما تم إنجازه

### 1. **Backend Structure** ✅
تم إنشاء البنية الأساسية للـ Backend:

```
server/
├── src/
│   ├── index.ts                    # Main server file
│   ├── types/
│   │   └── index.ts               # TypeScript types
│   ├── schemas/
│   │   └── chat.schema.ts         # Zod validation schemas
│   ├── middleware/
│   │   ├── errorHandler.ts        # Error handling
│   │   ├── notFoundHandler.ts     # 404 handler
│   │   └── rateLimiter.ts         # Rate limiting
│   ├── services/
│   │   ├── deepseek.service.ts    # DeepSeek API integration
│   │   ├── rag.service.ts         # RAG pipeline
│   │   └── chat.service.ts        # Chat logic
│   └── routes/
│       ├── chat.routes.ts         # Chat endpoints
│       ├── materials.routes.ts    # Training materials
│       └── conversations.routes.ts # Conversations
├── package.json
├── tsconfig.json
└── .env.example
```

### 2. **Services Implemented** ✅

#### **DeepSeek Service**
- ✅ API client configuration
- ✅ Generate response with context
- ✅ Fallback response (no training data)
- ✅ Error handling (rate limit, timeout, auth)
- ✅ System prompt configuration
- ✅ Health check

#### **RAG Service**
- ✅ Text normalization
- ✅ Text chunking (750 chars, 100 overlap)
- ✅ Embedding generation (OpenAI)
- ✅ Vector search (placeholder for DB)
- ✅ Reranking algorithm
- ✅ Context building
- ✅ Material indexing
- ✅ Chunk deletion

#### **Chat Service**
- ✅ Process message with RAG + DeepSeek
- ✅ Save conversation (placeholder)
- ✅ Get conversation
- ✅ List conversations
- ✅ Delete conversation
- ✅ Performance logging

### 3. **API Endpoints** ✅

#### **Chat Endpoints**
- `POST /api/chat` - Send message
- `GET /api/chat/conversations/:id` - Get conversation
- `GET /api/chat/conversations` - List conversations
- `DELETE /api/chat/conversations/:id` - Delete conversation

#### **Materials Endpoints**
- `GET /api/materials` - List materials
- `POST /api/materials` - Add material
- `DELETE /api/materials/:id` - Delete material

#### **Conversations Endpoints**
- `GET /api/conversations` - List all
- `GET /api/conversations/:id` - Get specific
- `PATCH /api/conversations/:id` - Update
- `DELETE /api/conversations/:id` - Delete
- `POST /api/conversations/:id/export` - Export

### 4. **Frontend API Layer** ✅

#### **API Client**
- ✅ Base HTTP client
- ✅ Auth token handling
- ✅ Error handling
- ✅ GET/POST/PATCH/DELETE methods

#### **Chat API**
- ✅ Send message
- ✅ Get conversation
- ✅ List conversations
- ✅ Delete conversation
- ✅ Retry message

---

## 🚧 ما يحتاج إكمال

### 1. **Database Integration** (حرج)

#### **PostgreSQL Setup**
```sql
-- Install pgvector extension
CREATE EXTENSION vector;

-- Create tables (see BACKEND_ARCHITECTURE.md)
```

#### **Database Client**
```typescript
// src/db/client.ts
import { Pool } from 'pg';

export const db = new Pool({
  connectionString: process.env.DATABASE_URL
});
```

#### **Implement Database Operations**
- [ ] Conversations CRUD
- [ ] Messages CRUD
- [ ] Training Materials CRUD
- [ ] Chunks with vector search
- [ ] Usage tracking (later)

### 2. **Vector Database** (حرج)

**Options:**
1. **PostgreSQL + pgvector** (Recommended)
   - Already using PostgreSQL
   - Native vector support
   - Simple setup

2. **Pinecone**
   - Managed service
   - Easy to use
   - Additional cost

3. **Weaviate/Qdrant**
   - Self-hosted
   - More complex

**Implementation:**
```typescript
// In rag.service.ts - vectorSearch method
const query = `
  SELECT id, material_id, content, metadata,
         1 - (embedding <=> $1) as score
  FROM chunks
  WHERE material_id IN (
    SELECT id FROM training_materials WHERE user_id = $2
  )
  ORDER BY embedding <=> $1
  LIMIT $3
`;
```

### 3. **Update ChatWidgetContext** (مهم)

```typescript
// src/contexts/ChatWidgetContext.tsx
import { chatAPI } from '@/services/api/chat.api';

const sendMessage = useCallback(async (content: string) => {
  if (!content.trim() || isSending) return;

  setIsSending(true);

  // Add user message
  const userMessage: Message = {
    id: `user-${Date.now()}`,
    role: 'user',
    content: content.trim(),
    timestamp: new Date(),
  };

  setMessages(prev => [...prev, userMessage]);
  setInputValue('');

  try {
    // Call real API
    const response = await chatAPI.sendMessage(content, conversationId);

    if (response.success && response.data) {
      // Add AI response
      const assistantMessage: Message = {
        id: response.data.messageId,
        role: 'assistant',
        content: response.data.answer,
        timestamp: new Date(response.data.timestamp),
        sources: response.data.sources
      };

      setMessages(prev => [...prev, assistantMessage]);
      setConversationId(response.data.conversationId);
    } else {
      // Handle error
      setError(response.error);
    }

  } catch (error) {
    console.error('Send message error:', error);
    setError({
      code: 'NETWORK_ERROR',
      message: 'Failed to send message'
    });
  } finally {
    setIsSending(false);
  }
}, [isSending, conversationId]);
```

### 4. **Error Handling UI** (مهم)

```typescript
// Add error state to ChatWidgetContext
const [error, setError] = useState<{
  code: string;
  message: string;
  retry?: () => void;
} | null>(null);

// In ChatModal, show error with retry button
{error && (
  <div className="error-message">
    <p>{error.message}</p>
    {error.retry && (
      <button onClick={error.retry}>Retry</button>
    )}
  </div>
)}
```

### 5. **Training Materials Integration** (مهم)

```typescript
// src/services/api/materials.api.ts
class MaterialsAPI {
  async addMaterial(data: {
    type: 'file' | 'link' | 'text';
    title: string;
    content?: string;
    url?: string;
  }) {
    return apiClient.post('/materials', data);
  }

  async listMaterials() {
    return apiClient.get('/materials');
  }

  async deleteMaterial(id: string) {
    return apiClient.delete(`/materials/${id}`);
  }
}
```

### 6. **Environment Variables** (حرج)

```env
# Frontend (.env)
VITE_API_URL=http://localhost:3001/api

# Backend (.env)
DEEPSEEK_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
DATABASE_URL=postgresql://...
```

---

## 📝 خطوات التنفيذ التالية

### **المرحلة 1: Database Setup** (2-3 ساعات)
1. Install PostgreSQL + pgvector
2. Create database schema
3. Implement database client
4. Test CRUD operations

### **المرحلة 2: Vector DB Integration** (2-3 ساعات)
1. Choose vector DB (pgvector recommended)
2. Implement vector search
3. Test indexing and retrieval
4. Optimize performance

### **المرحلة 3: Frontend Integration** (2-3 ساعات)
1. Update ChatWidgetContext to use API
2. Add error handling UI
3. Implement retry mechanism
4. Test end-to-end flow

### **المرحلة 4: Training Materials** (2-3 ساعات)
1. Implement file upload
2. Add auto-indexing
3. Update UI to show indexed materials
4. Test with real documents

### **المرحلة 5: Testing & Polish** (2-3 ساعات)
1. Test all endpoints
2. Add loading states
3. Improve error messages
4. Performance optimization

---

## 🔧 كيفية التشغيل

### **Backend**
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your API keys
npm run dev
```

### **Frontend**
```bash
# In root directory
npm run dev
```

### **Full Stack**
```bash
# Terminal 1: Backend
cd server && npm run dev

# Terminal 2: Frontend
npm run dev
```

---

## 🧪 Testing

### **Test DeepSeek API**
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -H "X-User-Id: test-user" \
  -d '{"question": "Hello, how are you?"}'
```

### **Test Health Check**
```bash
curl http://localhost:3001/health
```

---

## 📊 Current Status

| Component | Status | Priority |
|-----------|--------|----------|
| Backend Structure | ✅ Done | - |
| DeepSeek Service | ✅ Done | - |
| RAG Service | ✅ Done | - |
| Chat Service | ✅ Done | - |
| API Routes | ✅ Done | - |
| Frontend API Client | ✅ Done | - |
| Database Integration | 🚧 TODO | 🔴 Critical |
| Vector DB | 🚧 TODO | 🔴 Critical |
| Widget Integration | 🚧 TODO | 🔴 Critical |
| Error Handling UI | 🚧 TODO | 🟡 High |
| Materials Integration | 🚧 TODO | 🟡 High |

---

## 🎯 Next Immediate Steps

1. **Install Dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Setup Environment**
   - Get DeepSeek API key
   - Get OpenAI API key
   - Setup PostgreSQL

3. **Test Backend**
   - Start server
   - Test health endpoint
   - Test chat endpoint (will fail without DB)

4. **Implement Database**
   - Create schema
   - Implement CRUD
   - Test operations

5. **Connect Frontend**
   - Update ChatWidgetContext
   - Test end-to-end
   - Add error handling

---

**Ready to proceed with database implementation?**
