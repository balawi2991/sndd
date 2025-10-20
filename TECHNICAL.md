# Technical Documentation

## Architecture Overview

### System Design
```
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │
       ↓
┌─────────────────────────────────┐
│     Express Server (Railway)     │
│  ┌──────────┬─────────────────┐ │
│  │   API    │   Static Files  │ │
│  │  Routes  │   (Frontend)    │ │
│  └────┬─────┴─────────────────┘ │
│       │                          │
│  ┌────┴──────────────────────┐  │
│  │  Services                 │  │
│  │  - Chat (DeepSeek)        │  │
│  │  - RAG (Embeddings)       │  │
│  │  - Training (Indexing)    │  │
│  └───────────────────────────┘  │
└────────────┬────────────────────┘
             │
             ↓
      ┌─────────────┐
      │  MongoDB    │
      │  (Railway)  │
      └─────────────┘
```

## Database Schema

### User
```typescript
{
  _id: ObjectId
  name: string
  email: string (unique)
  password: string (hashed)
  plan: 'free' | 'pro' | 'enterprise'
  usage: {
    messagesCount: number
    tokensUsed: number
    lastReset: Date
  }
  limits: {
    messagesPerMonth: number
    tokensPerMonth: number
  }
  createdAt: Date
  updatedAt: Date
}
```

### TrainingMaterial
```typescript
{
  _id: ObjectId
  userId: ObjectId (ref: User)
  type: 'file' | 'link' | 'text'
  title: string
  content: string
  source: string
  status: 'untrained' | 'training' | 'trained'
  embeddings: [{
    chunk: string
    embedding: number[]
    metadata: {
      materialId: string
      title: string
    }
  }]
  lastTrained: Date
  createdAt: Date
}
```

### Conversation
```typescript
{
  _id: ObjectId
  userId: ObjectId (ref: User)
  title: string
  messages: [{
    role: 'user' | 'assistant'
    content: string
    sources: [{
      title: string
      url: string
      materialId: string
    }]
    timestamp: Date
  }]
  lastActivity: Date
  unread: boolean
  createdAt: Date
}
```

### Appearance
```typescript
{
  _id: ObjectId
  userId: ObjectId (ref: User)
  logo: string
  primaryColor: string
  glowingBorder: boolean
  avatar: string
  showFloatingAvatar: boolean
  title: string
  placeholder: string
  suggestedQuestions: string[]
  updatedAt: Date
}
```

## API Endpoints

### Authentication
```
POST /api/auth/signup
Body: { name, email, password }
Response: { token, user }

POST /api/auth/signin
Body: { email, password }
Response: { token, user }
```

### Chat
```
POST /api/chat/message
Headers: { Authorization: Bearer <token> }
Body: { message, conversationId? }
Response: { conversationId, message }
```

### Training Materials
```
GET /api/training?type=all|files|links|text
Headers: { Authorization: Bearer <token> }
Response: { materials: [...] }

POST /api/training
Headers: { Authorization: Bearer <token> }
Body: { type, title, content, source }
Response: { material }

DELETE /api/training/:id
Headers: { Authorization: Bearer <token> }
Response: { success: true }
```

### Conversations
```
GET /api/conversations
Headers: { Authorization: Bearer <token> }
Response: { conversations: [...] }

GET /api/conversations/:id
Headers: { Authorization: Bearer <token> }
Response: { conversation }
```

### Appearance
```
GET /api/appearance
Headers: { Authorization: Bearer <token> }
Response: { appearance }

PUT /api/appearance
Headers: { Authorization: Bearer <token> }
Body: { logo, primaryColor, ... }
Response: { appearance }
```

### Usage
```
GET /api/usage/stats
Headers: { Authorization: Bearer <token> }
Response: {
  plan,
  usage: { messages, tokens },
  nextReset
}
```

## RAG System

### Indexing Flow
```
1. User uploads material
2. Content extracted/fetched
3. Text chunked (800 chars, 200 overlap)
4. Embeddings generated (OpenAI or fallback)
5. Stored in MongoDB
6. Status: trained
```

### Retrieval Flow
```
1. User sends message
2. Message → embedding
3. Cosine similarity with all chunks
4. Top 3 chunks selected (threshold: 0.3)
5. Context built from chunks
6. Sent to DeepSeek with context
7. Response returned with sources
```

### Embedding Strategy

**Primary: OpenAI**
```typescript
Model: text-embedding-3-small
Dimensions: 1536
Cost: $0.00002 per 1K tokens
```

**Fallback: Simple TF-IDF**
```typescript
Dimensions: 100
Method: Word frequency + normalization
Cost: Free
```

## Usage Tracking

### Flow
```
1. Request → checkUsageLimit middleware
2. Check if reset needed (monthly)
3. Check messages < limit
4. Check tokens < limit
5. If OK → proceed
6. After response → updateUsage
7. Increment counters
```

### Reset Logic
```typescript
// Reset on first day of each month
if (now.month !== lastReset.month || 
    now.year !== lastReset.year) {
  reset()
}
```

## Widget Architecture

### Components
```
Widget (container)
├── AskBar (input)
│   ├── Icon
│   ├── Textarea (auto-expand)
│   └── Send button
└── ChatModal (conversation)
    ├── Header (title + close)
    ├── Messages (scrollable)
    │   ├── Date dividers
    │   ├── User messages
    │   ├── Assistant messages
    │   ├── Source chips
    │   └── Typing indicator
    └── Suggested questions
```

### Container Awareness
```typescript
// Detects container type
const previewCanvas = element.closest('.live-preview-canvas')

if (previewCanvas) {
  // Appearance: scale(0.65)
  // Try My Agent: scale(0.85)
} else {
  // Real website: scale(1)
}
```

### Positioning
```css
/* Ask-bar */
position: fixed (or absolute in preview)
bottom: 16px
left: 50%
transform: translateX(-50%)
max-width: 360px

/* Modal */
position: fixed (or absolute in preview)
bottom: 88px (56px bar + 32px gap)
left: 50%
transform: translateX(-50%)
width: 720px
height: 80vh (max 600px)
```

## Security

### Authentication
- JWT tokens (7 days expiry)
- bcrypt password hashing (10 rounds)
- Tokens stored in localStorage

### Rate Limiting
```typescript
// Global: 100 requests per 15 minutes
// Chat: 20 messages per 15 minutes
```

### User Isolation
```typescript
// All queries filtered by userId
TrainingMaterial.find({ userId })
Conversation.find({ userId })
```

### Input Validation
- Email format validation
- Password min length: 6
- Message max length: 2000
- File size limits

## Performance

### Optimizations
- MongoDB indexes on userId
- Embeddings cached in DB
- Static files served by Express
- React Query for caching
- Lazy loading for pages

### Metrics
- API response: < 500ms
- Embedding generation: ~200ms
- Chat response: 2-5s (DeepSeek)
- Widget load: < 100ms

## Deployment

### Railway Setup
```yaml
# railway.json
build:
  command: npm run build
start:
  command: npm start
```

### Environment Variables
```env
# Required
MONGODB_URI=mongodb://...
JWT_SECRET=random-secret
DEEPSEEK_API_KEY=sk-...

# Optional
OPENAI_API_KEY=sk-...
PORT=8080
NODE_ENV=production
```

### Build Process
```bash
1. npm install
2. npm run build
   - Frontend: vite build → dist/client
   - Backend: tsc → dist/server
3. npm start
   - Serves static files from dist/client
   - Runs server from dist/server
```

## Monitoring

### Logs
```typescript
// Server logs
console.log('✅ Server running')
console.log('🔄 Indexing material')
console.log('📄 Created N chunks')

// Error logs
console.error('❌ Error:', error)
```

### Health Check
```
GET /api/health
Response: { status: 'ok', timestamp }
```

## Troubleshooting

### Common Issues

**1. MongoDB Connection**
```
Error: MongooseServerSelectionError
Fix: Check MONGODB_URI format and network
```

**2. Rate Limit Errors**
```
Error: ValidationError X-Forwarded-For
Fix: app.set('trust proxy', 1)
```

**3. Widget Not Showing**
```
Issue: Widget outside container
Fix: Ensure .live-preview-canvas class
```

**4. Embeddings Failing**
```
Issue: OpenAI API error
Fix: Falls back to simple embedding automatically
```

## Testing

### Manual Testing
```bash
# 1. Sign up/in
# 2. Add training material
# 3. Wait for indexing
# 4. Send message
# 5. Check response + sources
# 6. Verify usage tracking
```

### API Testing
```bash
# Health check
curl http://localhost:8080/api/health

# Sign in
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# Send message
curl -X POST http://localhost:8080/api/chat/message \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello"}'
```

## Future Improvements

### Short-term
- [ ] Usage dashboard in frontend
- [ ] Plan upgrade UI
- [ ] Conversation search
- [ ] Export conversations

### Long-term
- [ ] Vector database (Pinecone)
- [ ] Re-ranking for better results
- [ ] Multi-language support
- [ ] Team features
- [ ] Public API

---

**Last Updated:** 2025-10-20
