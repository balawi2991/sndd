# Sanad Backend Server

Backend API server for Sanad (MintChat) platform with RAG-powered AI responses using DeepSeek.

## 🎯 Features

- **Single Unified API Endpoint**: One endpoint for all chat interactions
- **RAG Pipeline**: Retrieval-Augmented Generation for accurate responses
- **DeepSeek Integration**: AI-powered responses with context
- **Rate Limiting**: Protect against abuse
- **Error Handling**: Graceful error handling with retry support
- **TypeScript**: Full type safety
- **Scalable Architecture**: Ready for production

## 🏗️ Architecture

```
Frontend → API Endpoint → RAG Pipeline → DeepSeek API → Response
                ↓
         Save to Database
```

### RAG Pipeline Flow

1. **Normalize Question**: Clean and prepare text
2. **Retrieve**: Vector search for relevant chunks (Top-K)
3. **Rerank**: Sort by relevance (Top-3)
4. **Build Context**: Format for DeepSeek
5. **Generate**: Get AI response with context
6. **Save**: Store conversation in database

## 📦 Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your API keys
```

## ⚙️ Environment Variables

```env
# Server
NODE_ENV=development
PORT=3001

# DeepSeek API
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/sanad

# OpenAI (for embeddings)
OPENAI_API_KEY=your_openai_api_key_here

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_PER_MINUTE=10
RATE_LIMIT_PER_HOUR=100
RATE_LIMIT_PER_DAY=500

# RAG Configuration
RAG_CHUNK_SIZE=750
RAG_CHUNK_OVERLAP=100
RAG_TOP_K=10
RAG_RERANK_TOP=3
RAG_SIMILARITY_THRESHOLD=0.7

# DeepSeek Configuration
DEEPSEEK_MODEL=deepseek-chat
DEEPSEEK_TEMPERATURE=0.7
DEEPSEEK_MAX_TOKENS=1000
DEEPSEEK_TIMEOUT=30000
```

## 🚀 Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## 📡 API Endpoints

### Chat

#### Send Message
```http
POST /api/chat
Content-Type: application/json
X-User-Id: user-id

{
  "question": "How can I get started?",
  "conversationId": "optional-conversation-id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "answer": "AI response here...",
    "sources": [
      {
        "title": "Getting Started Guide",
        "url": "https://example.com/guide",
        "snippet": "To get started..."
      }
    ],
    "conversationId": "uuid",
    "messageId": "uuid",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Get Conversation
```http
GET /api/chat/conversations/:id
X-User-Id: user-id
```

#### List Conversations
```http
GET /api/chat/conversations?limit=50&offset=0
X-User-Id: user-id
```

#### Delete Conversation
```http
DELETE /api/chat/conversations/:id
X-User-Id: user-id
```

### Training Materials

#### List Materials
```http
GET /api/materials
X-User-Id: user-id
```

#### Add Material
```http
POST /api/materials
Content-Type: application/json
X-User-Id: user-id

{
  "type": "text",
  "title": "Product Documentation",
  "content": "Your content here..."
}
```

#### Delete Material
```http
DELETE /api/materials/:id
X-User-Id: user-id
```

### Conversations

#### List All
```http
GET /api/conversations?limit=50&offset=0&search=query
X-User-Id: user-id
```

#### Get Specific
```http
GET /api/conversations/:id
X-User-Id: user-id
```

#### Update
```http
PATCH /api/conversations/:id
Content-Type: application/json
X-User-Id: user-id

{
  "title": "New Title",
  "isRead": true
}
```

#### Delete
```http
DELETE /api/conversations/:id
X-User-Id: user-id
```

#### Export
```http
POST /api/conversations/:id/export
Content-Type: application/json
X-User-Id: user-id

{
  "format": "markdown"
}
```

## 🔒 Security

### Rate Limiting
- **Per Minute**: 10 requests
- **Per Hour**: 100 requests
- **Per Day**: 500 requests

### API Key Protection
- DeepSeek API key stored server-side only
- Never exposed to frontend
- Environment variables for sensitive data

### Input Validation
- Zod schemas for request validation
- SQL injection protection
- XSS prevention

## 🧪 Testing

### Health Check
```bash
curl http://localhost:3001/health
```

### Test Chat Endpoint
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -H "X-User-Id: test-user" \
  -d '{"question": "Hello, how are you?"}'
```

## 📊 Error Codes

| Code | Description |
|------|-------------|
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `UNAUTHORIZED` | Authentication failed |
| `NOT_FOUND` | Resource not found |
| `VALIDATION_ERROR` | Invalid request data |
| `DEEPSEEK_ERROR` | AI service error |
| `NO_TRAINING_DATA` | No materials indexed |
| `NETWORK_ERROR` | Network error |
| `INTERNAL_ERROR` | Server error |

## 🗄️ Database Schema

### Conversations
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  title VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  is_read BOOLEAN
);
```

### Messages
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id),
  role VARCHAR(20),
  content TEXT,
  sources JSONB,
  created_at TIMESTAMP
);
```

### Training Materials
```sql
CREATE TABLE training_materials (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  type VARCHAR(20),
  title VARCHAR(255),
  content TEXT,
  url VARCHAR(500),
  indexed_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Chunks (Vector DB)
```sql
CREATE TABLE chunks (
  id UUID PRIMARY KEY,
  material_id UUID REFERENCES training_materials(id),
  content TEXT,
  embedding VECTOR(1536),
  metadata JSONB,
  created_at TIMESTAMP
);
```

## 📁 Project Structure

```
server/
├── src/
│   ├── index.ts              # Main server
│   ├── types/
│   │   └── index.ts         # TypeScript types
│   ├── schemas/
│   │   └── chat.schema.ts   # Validation schemas
│   ├── middleware/
│   │   ├── errorHandler.ts  # Error handling
│   │   ├── notFoundHandler.ts
│   │   └── rateLimiter.ts   # Rate limiting
│   ├── services/
│   │   ├── deepseek.service.ts  # DeepSeek API
│   │   ├── rag.service.ts       # RAG pipeline
│   │   └── chat.service.ts      # Chat logic
│   └── routes/
│       ├── chat.routes.ts
│       ├── materials.routes.ts
│       └── conversations.routes.ts
├── package.json
├── tsconfig.json
└── .env.example
```

## 🔧 Configuration

### RAG Settings
- **Chunk Size**: 750 characters
- **Chunk Overlap**: 100 characters
- **Top-K Retrieval**: 10 chunks
- **Rerank Top**: 3 chunks
- **Similarity Threshold**: 0.7

### DeepSeek Settings
- **Model**: deepseek-chat
- **Temperature**: 0.7
- **Max Tokens**: 1000
- **Timeout**: 30 seconds

## 🚧 TODO

- [ ] Implement database integration
- [ ] Add vector database (pgvector)
- [ ] Implement file upload for materials
- [ ] Add authentication middleware
- [ ] Implement usage tracking
- [ ] Add caching layer (Redis)
- [ ] Implement conversation export
- [ ] Add comprehensive tests
- [ ] Setup CI/CD pipeline
- [ ] Add monitoring and logging

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please read the contributing guidelines first.

## 📧 Support

For support, email support@sanad.com or open an issue.
