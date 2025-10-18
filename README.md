# 🤖 Sanad (MintChat) - AI-Powered Customer Support Platform

[![Railway](https://img.shields.io/badge/Deploy%20on-Railway-blueviolet)](https://railway.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue)](https://www.postgresql.org/)

**Sanad** is a modern, AI-powered customer support platform built with RAG (Retrieval-Augmented Generation) technology. Train your AI assistant on your own content and provide instant, accurate responses to your customers.

---

## ✨ Features

### 🎨 **Beautiful Chat Widget**
- Fixed dimensions with internal scrolling
- RGB glow border animation
- Real-time configuration updates
- Mobile responsive
- Accessibility compliant (ARIA)

### 🧠 **RAG-Powered AI**
- Train on your own content (files, links, text)
- Vector similarity search with pgvector
- Context-aware responses
- Source attribution
- DeepSeek AI integration

### 🔒 **Multi-tenant Architecture**
- Complete user isolation
- Secure data separation
- Perfect for SaaS
- Scalable design

### 📊 **Full Dashboard**
- Conversation management
- Training materials
- Appearance customization
- Analytics & usage tracking
- Embed code generator

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Railway Platform                   │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │
│  │   Frontend   │  │   Backend    │  │ Database │ │
│  │ React + Vite │→ │ Express + TS │→ │PostgreSQL│ │
│  │              │  │   + RAG      │  │+ pgvector│ │
│  └──────────────┘  └──────────────┘  └──────────┘ │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+ (or Railway account)
- DeepSeek API Key
- OpenAI API Key

### Local Development

```bash
# 1. Clone the repository
git clone https://github.com/your-username/sanad.git
cd sanad

# 2. Install dependencies
npm install
cd server && npm install && cd ..

# 3. Setup environment variables
cp .env.example .env
cp server/.env.example server/.env

# Edit .env files with your API keys

# 4. Setup database
createdb sanad
psql sanad < server/src/db/schema.sql

# 5. Start backend
cd server
npm run dev

# 6. Start frontend (in new terminal)
cd ..
npm run dev
```

Visit: `http://localhost:5173`

---

## 🚂 Deploy to Railway

**Complete deployment guide**: See [`RAILWAY_DEPLOYMENT.md`](./RAILWAY_DEPLOYMENT.md)

### Quick Deploy

1. **Push to GitHub**
2. **Create Railway Project**
3. **Add PostgreSQL** (pgvector template)
4. **Deploy Backend** (root: `/server`)
5. **Deploy Frontend** (root: `/`)
6. **Add Environment Variables** (see [`RAILWAY_ENV_VARIABLES.md`](./RAILWAY_ENV_VARIABLES.md))

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

---

## 📁 Project Structure

```
sanad/
├── src/                      # Frontend source
│   ├── components/
│   │   ├── widget/          # Chat Widget
│   │   ├── appearance/      # Customization
│   │   └── ui/              # Shadcn components
│   ├── contexts/            # React contexts
│   ├── pages/               # Application pages
│   ├── services/
│   │   └── api/             # API clients
│   └── hooks/               # Custom hooks
│
├── server/                   # Backend source
│   └── src/
│       ├── db/
│       │   ├── schema.sql   # Database schema
│       │   ├── client.ts    # DB connection
│       │   ├── migrate.ts   # Auto-migration
│       │   └── repositories/
│       ├── services/
│       │   ├── deepseek.service.ts
│       │   ├── rag.service.ts
│       │   └── chat.service.ts
│       ├── routes/          # API routes
│       ├── middleware/      # Express middleware
│       └── types/           # TypeScript types
│
├── railway.json             # Railway config (Frontend)
├── nixpacks.toml           # Build config (Frontend)
├── RAILWAY_DEPLOYMENT.md   # Deployment guide
└── RAILWAY_ENV_VARIABLES.md # Environment variables
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Shadcn/ui** - Component library
- **React Router** - Routing
- **React Hook Form** - Forms
- **Zod** - Validation

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **pgvector** - Vector search
- **OpenAI** - Embeddings
- **DeepSeek** - AI responses

### Infrastructure
- **Railway** - Hosting
- **GitHub** - Version control

---

## 🔑 Environment Variables

### Backend (`server/.env`)

```env
# Required
DATABASE_URL=postgresql://...
DEEPSEEK_API_KEY=sk-...
OPENAI_API_KEY=sk-...

# Optional
NODE_ENV=production
PORT=3000
RAG_CHUNK_SIZE=750
RATE_LIMIT_PER_MINUTE=10
```

### Frontend (`.env`)

```env
# Required
VITE_API_URL=https://your-backend.railway.app/api

# Optional
VITE_APP_NAME=Sanad
VITE_ENABLE_DEBUG=false
```

**Full guide**: [`RAILWAY_ENV_VARIABLES.md`](./RAILWAY_ENV_VARIABLES.md)

---

## 📖 Documentation

- **[Railway Deployment Guide](./RAILWAY_DEPLOYMENT.md)** - Complete deployment instructions
- **[Environment Variables](./RAILWAY_ENV_VARIABLES.md)** - All environment variables
- **[Backend Architecture](./BACKEND_ARCHITECTURE.md)** - System architecture
- **[Implementation Guide](./IMPLEMENTATION_GUIDE.md)** - Development guide
- **[Final Summary](./FINAL_SUMMARY.md)** - Project overview
- **[Quick Start](./QUICK_START.md)** - Local setup guide

---

## 🔒 Multi-tenant Security

### Complete User Isolation

```sql
-- Every table has user_id
CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,  -- Isolation
  ...
);

-- Every query filters by user_id
SELECT * FROM conversations 
WHERE user_id = $1;  -- No cross-user access
```

### Security Features
- ✅ Row-level user isolation
- ✅ API key protection (server-side only)
- ✅ Rate limiting
- ✅ Input validation (Zod)
- ✅ SQL injection protection
- ✅ XSS prevention
- ✅ CORS configuration

**Result**: Perfect for SaaS - each user sees only their data

---

## 🧪 Testing

```bash
# Backend tests
cd server
npm test

# Frontend tests
npm test

# E2E tests
npm run test:e2e
```

---

## 📊 API Endpoints

### Chat
- `POST /api/chat` - Send message
- `GET /api/chat/conversations` - List conversations
- `GET /api/chat/conversations/:id` - Get conversation
- `DELETE /api/chat/conversations/:id` - Delete conversation

### Materials
- `GET /api/materials` - List training materials
- `POST /api/materials` - Add material
- `DELETE /api/materials/:id` - Delete material

### Health
- `GET /health` - Health check

**Full API docs**: See [`server/README.md`](./server/README.md)

---

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **DeepSeek** - AI model
- **OpenAI** - Embeddings
- **Railway** - Hosting platform
- **Shadcn/ui** - Component library
- **pgvector** - Vector search

---

## 📞 Support

- **Documentation**: See `/docs` folder
- **Issues**: [GitHub Issues](https://github.com/your-username/sanad/issues)
- **Email**: support@sanad.com

---

## 🗺️ Roadmap

- [x] Chat Widget
- [x] RAG Pipeline
- [x] Multi-tenant Architecture
- [x] Railway Deployment
- [ ] File Upload UI
- [ ] Conversation Export
- [ ] Analytics Dashboard
- [ ] Mobile App
- [ ] WhatsApp Integration
- [ ] Voice Support

---

**Built with ❤️ for better customer support**

---

## 🚀 What technologies are used?

This project is built with:
- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, Shadcn/ui
- **Backend**: Node.js, Express, TypeScript, PostgreSQL, pgvector
- **AI**: DeepSeek, OpenAI, RAG
- **Deployment**: Railway

For complete list see `package.json` files.

## 🌐 How can I deploy this project?
