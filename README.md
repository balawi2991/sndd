# 🌿 MintChat - AI-Powered Customer Support Platform

A modern SaaS platform for creating intelligent chatbots powered by DeepSeek AI and RAG (Retrieval-Augmented Generation).

## ✨ Features

### Core Functionality
- 🤖 **AI-Powered Chatbot** - DeepSeek integration with RAG for accurate responses
- 📚 **Training Materials** - Upload files, add links, or paste text to train your bot
- 🎨 **Customizable Widget** - Fully customizable chat widget with live preview
- 💬 **Conversation History** - View and manage all customer conversations
- 🔐 **Secure Authentication** - JWT-based auth with bcrypt password hashing
- 📊 **Dashboard Analytics** - Track knowledge base and training status

### Technical Highlights
- **RAG System** - Vector embeddings with pgvector for semantic search
- **Multi-tenancy** - Complete isolation between users and bots
- **Rate Limiting** - Protection against abuse
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Container-Aware Widget** - Adapts to any container size

---

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- TailwindCSS + shadcn/ui
- React Query (data fetching)
- React Router (routing)

**Backend:**
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL + pgvector
- JWT Authentication

**AI & ML:**
- DeepSeek API (chat completions)
- OpenAI API (embeddings)
- Vector similarity search

**Deployment:**
- Railway (fullstack hosting)
- PostgreSQL on Railway
- Automatic deployments from GitHub

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 14+ (or Railway account)
- DeepSeek API key
- OpenAI API key

### Local Development

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd mintchat
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..
```

3. **Set up environment variables**

Create `server/.env`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/mintchat
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
DEEPSEEK_API_KEY=your-deepseek-api-key
OPENAI_API_KEY=your-openai-api-key
NODE_ENV=development
PORT=3000
```

4. **Set up database**
```bash
cd server

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Enable pgvector extension (in PostgreSQL)
# Run this SQL: CREATE EXTENSION IF NOT EXISTS vector;
```

5. **Run development servers**

Terminal 1 (Frontend):
```bash
npm run dev
```

Terminal 2 (Backend):
```bash
npm run dev:server
```

Visit http://localhost:5173

---

## 🚂 Railway Deployment

### Step 1: Prepare Repository

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Deploy on Railway

1. Go to https://railway.app/new
2. Click "Deploy from GitHub repo"
3. Select your repository
4. Add PostgreSQL database (Railway provides `DATABASE_URL` automatically)

### Step 3: Configure Environment Variables

In Railway Dashboard → Variables:

```env
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
DEEPSEEK_API_KEY=your-deepseek-api-key
OPENAI_API_KEY=your-openai-api-key
NODE_ENV=production
PORT=3000
```

### Step 4: Enable pgvector

After first deployment, in PostgreSQL service → Data → Query:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### Step 5: Verify

Check deployment logs for:
- ✅ Database connected
- ✅ pgvector extension enabled
- 🚀 Server running

Visit your Railway URL!

**Full deployment guide:** See [RAILWAY_SETUP.md](./RAILWAY_SETUP.md)

---

## 📁 Project Structure

```
mintchat/
├── src/                      # Frontend source
│   ├── components/
│   │   ├── widget/          # ChatWidget (unified component)
│   │   ├── appearance/      # Appearance controls
│   │   ├── conversations/   # Conversation views
│   │   ├── training/        # Training material management
│   │   ├── layout/          # App layout & sidebar
│   │   └── ui/              # shadcn/ui components
│   ├── pages/
│   │   ├── auth/            # Sign in/up pages
│   │   └── app/             # Main app pages
│   ├── contexts/            # React contexts
│   ├── services/            # API services
│   └── lib/                 # Utilities
│
├── server/                   # Backend source
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   │   ├── auth.service.ts
│   │   │   ├── chat.service.ts
│   │   │   └── rag.service.ts
│   │   ├── middleware/      # Express middleware
│   │   ├── lib/             # Libraries (Prisma, DeepSeek, OpenAI)
│   │   ├── config/          # Configuration
│   │   └── index.ts         # Server entry point
│   └── prisma/
│       ├── schema.prisma    # Database schema
│       └── migrations/      # Database migrations
│
├── railway.json             # Railway configuration
├── nixpacks.toml            # Nixpacks build config
└── package.json             # Root package.json
```

---

## 🎨 The ChatWidget

### Key Features

- **Unified Component** - Single implementation used everywhere
- **Container-Aware** - Adapts to any container size
- **Ask-bar** - Fixed center-bottom input (360px max-width)
- **Modal** - Opens above ask-bar (720px × 80vh)
- **RGB Glow** - Animated border on ask-bar
- **Responsive** - Desktop modal, mobile bottom sheet
- **Accessible** - Keyboard navigation, ARIA labels

### Usage

```tsx
import { ChatWidget } from '@/components/widget/ChatWidget';

<ChatWidget
  config={{
    primaryColor: '#17B26A',
    glowingBorder: true,
    title: 'Chat with us',
    placeholder: 'Ask me anything...',
    suggestedQuestions: ['Question 1', 'Question 2'],
  }}
  messages={messages}
  onSendMessage={handleSend}
  isTyping={isTyping}
  containerAware={true}
/>
```

---

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/signin` - Sign in

### Bot Management
- `GET /api/bot` - Get user's bot
- `PATCH /api/bot/:id` - Update bot config

### Training Materials
- `GET /api/training` - List materials
- `POST /api/training` - Add material
- `POST /api/training/:id/retrain` - Retrain material
- `DELETE /api/training/:id` - Delete material

### Chat
- `POST /api/chat` - Send message (with RAG)

### Conversations
- `GET /api/conversations` - List conversations
- `GET /api/conversations/:id` - Get conversation
- `DELETE /api/conversations/:id` - Delete conversation

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard stats

---

## 🧠 RAG System

### How It Works

1. **Indexing** (when material is added):
   - Split content into chunks (500 chars, 50 overlap)
   - Generate embeddings using OpenAI ada-002
   - Store in PostgreSQL with pgvector

2. **Retrieval** (when user asks question):
   - Generate embedding for question
   - Find top-K similar chunks (cosine similarity)
   - Extract sources for citation

3. **Generation** (DeepSeek):
   - Format context from retrieved chunks
   - Send to DeepSeek with system prompt
   - Return response with source chips

### Vector Search Query

```sql
SELECT content, title, source,
  1 - (embedding <=> $query_embedding) as similarity
FROM chunks
JOIN training_materials ON chunks.materialId = training_materials.id
WHERE training_materials.botId = $botId
ORDER BY embedding <=> $query_embedding
LIMIT 5
```

---

## 🔒 Security

- ✅ JWT authentication with secure secrets
- ✅ Password hashing with bcrypt
- ✅ Rate limiting on all endpoints
- ✅ CORS configuration
- ✅ SQL injection protection (Prisma)
- ✅ XSS protection (React)
- ✅ Environment variable validation (Zod)

---

## 📊 Database Schema

### Key Tables

- **users** - User accounts
- **bots** - Bot configurations (one per user)
- **training_materials** - Files, links, text
- **chunks** - Embedded text chunks (with vectors)
- **conversations** - Chat sessions
- **messages** - Individual messages
- **usage_logs** - Usage tracking (for future billing)

See [server/prisma/schema.prisma](./server/prisma/schema.prisma) for full schema.

---

## 🛠️ Development

### Useful Commands

```bash
# Frontend
npm run dev              # Start dev server
npm run build            # Build for production
npm run lint             # Lint code

# Backend
npm run dev:server       # Start dev server
npm run build:server     # Build for production

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:studio        # Open Prisma Studio

# Full Build (for Railway)
npm run build:all        # Build frontend + backend + migrations
```

### Adding New Features

1. **Frontend**: Add components in `src/components/`
2. **Backend**: Add routes in `server/src/routes/`
3. **Database**: Update `server/prisma/schema.prisma` and run `npm run db:push`

---

## 🐛 Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is set correctly
- Ensure PostgreSQL is running
- Check pgvector extension is enabled

### Build Failures
- Clear `node_modules` and reinstall
- Check all environment variables are set
- Verify Prisma schema is valid

### Widget Not Showing
- Check console for errors
- Verify container has `.live-preview__widget-slot`
- Ensure CSS is imported

---

## 📚 Resources

- [Railway Docs](https://docs.railway.app)
- [Prisma Docs](https://www.prisma.io/docs)
- [DeepSeek API](https://platform.deepseek.com/docs)
- [OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings)
- [pgvector](https://github.com/pgvector/pgvector)

---

## 📝 License

MIT License - See LICENSE file for details

---

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

---

## 💬 Support

For issues or questions, please open a GitHub issue.

---

**Built with ❤️ using React, Node.js, and DeepSeek AI**
