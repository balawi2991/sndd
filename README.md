# 🤖 Sanad - AI-Powered Chat Platform

<div align="center">

![Sanad](https://img.shields.io/badge/Sanad-AI%20Chat-17B26A?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**سند - منصة محادثة ذكية مدعومة بالذكاء الاصطناعي**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Deployment](#-deployment) • [Documentation](#-documentation)

</div>

---

## 📖 About

**Sanad** is a production-ready SaaS platform for creating AI-powered chatbots with RAG (Retrieval-Augmented Generation). Built with modern technologies and designed for multi-tenancy, it allows users to:

- 🤖 Create custom AI agents trained on their own data
- 📚 Upload documents (PDF, TXT, MD, CSV) for knowledge base
- 💬 Embed chat widgets on any website
- 🔐 Secure multi-tenant architecture with user isolation
- 📊 Track usage and conversations
- 🎨 Customize appearance and behavior

---

## ✨ Features

### **Core Features**
- ✅ **RAG Pipeline**: Advanced retrieval-augmented generation with vector search
- ✅ **DeepSeek Integration**: Powered by DeepSeek AI for intelligent responses
- ✅ **Multi-tenancy**: Complete user isolation with Row-Level Security
- ✅ **File Upload**: Support for PDF, TXT, MD, CSV with auto-indexing
- ✅ **API Keys**: Generate keys for embedding widgets on external sites
- ✅ **Real-time Chat**: WebSocket-ready architecture
- ✅ **Conversation History**: Persistent chat storage and retrieval

### **Security**
- 🔒 JWT Authentication
- 🔑 API Key Management
- 🛡️ Row-Level Security (RLS)
- 📝 Audit Logging
- 🚦 Rate Limiting
- ✅ Input Validation

### **SaaS Features**
- 👥 Multi-user support
- 📊 Usage tracking
- 🎯 Subscription tiers (Free, Starter, Pro, Enterprise)
- 📈 Analytics ready
- 🔔 Audit trail

---

## 🛠️ Tech Stack

### **Frontend**
- ⚛️ React 18 + TypeScript
- ⚡ Vite
- 🎨 TailwindCSS
- 🧩 Shadcn/ui
- 🔄 React Router
- 📡 Axios

### **Backend**
- 🟢 Node.js + Express
- 📘 TypeScript
- 🗄️ PostgreSQL + pgvector
- 🤖 DeepSeek API
- 🧠 OpenAI Embeddings
- 📄 PDF parsing
- 🔐 JWT + bcrypt

### **Infrastructure**
- 🚂 Railway (Deployment)
- 🐘 PostgreSQL (Database)
- 📦 Multer (File uploads)
- 🔄 Redis (Rate limiting - optional)

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### **1. Clone Repository**
```bash
git clone https://github.com/balawi2991/sanadbot.git
cd sanadbot
```

### **2. Install Dependencies**
```bash
# Frontend
npm install

# Backend
cd server
npm install
cd ..
```

### **3. Setup Database**
```bash
# Create database
createdb sanad

# Install pgvector
psql sanad -c "CREATE EXTENSION vector;"

# Run migrations
psql sanad < server/src/db/schema.sql
psql sanad < server/src/db/schema-updates.sql
```

### **4. Environment Variables**

**Frontend** (`.env`):
```env
VITE_API_URL=http://localhost:3001/api
```

**Backend** (`server/.env`):
```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/sanad

# AI APIs
DEEPSEEK_API_KEY=your_deepseek_key
OPENAI_API_KEY=your_openai_key

# Security
JWT_SECRET=your-super-secret-key-min-32-chars

# Server
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### **5. Run Development Servers**

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
npm run dev
```

Visit: `http://localhost:5173`

---

## 🚂 Railway Deployment

### **Step 1: Prepare Repository**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### **Step 2: Create Railway Project**
1. Go to [Railway](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose `balawi2991/sanadbot`

### **Step 3: Add PostgreSQL**
1. Click "New" → "Database" → "PostgreSQL"
2. Railway will auto-generate `DATABASE_URL`

### **Step 4: Configure Backend Service**
1. Click on your service
2. Go to "Settings"
3. Set **Root Directory**: `server`
4. Set **Build Command**: `npm install && npm run build`
5. Set **Start Command**: `npm start`

### **Step 5: Add Environment Variables**
```env
DEEPSEEK_API_KEY=sk-xxxxx
OPENAI_API_KEY=sk-xxxxx
JWT_SECRET=your-super-secret-key-change-this
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

### **Step 6: Setup Database**
```bash
# Connect to Railway database
railway connect postgresql

# In psql:
CREATE EXTENSION vector;
\q

# Run migrations
railway run psql $DATABASE_URL < server/src/db/schema.sql
railway run psql $DATABASE_URL < server/src/db/schema-updates.sql
```

### **Step 7: Deploy Frontend**
Deploy to Vercel/Netlify with:
```env
VITE_API_URL=https://your-railway-app.railway.app/api
```

---

## 📚 Documentation

- 📖 [Quick Start Guide](QUICK_START.md)
- 🏗️ [Backend Architecture](BACKEND_ARCHITECTURE.md)
- 🔒 [Security Guide](SAAS_SECURITY_GUIDE.md)
- 🚀 [Deployment Guide](DEPLOYMENT_COMPLETE.md)
- 📋 [Implementation Guide](IMPLEMENTATION_GUIDE.md)
- 📊 [Final Summary](FINAL_SUMMARY.md)

---

## 🔑 API Keys

### **DeepSeek API**
1. Visit: https://platform.deepseek.com
2. Sign up and create API key
3. Add to `server/.env`

### **OpenAI API**
1. Visit: https://platform.openai.com
2. Sign up and create API key
3. Add to `server/.env`

---

## 📁 Project Structure

```
sanadbot/
├── src/                    # Frontend source
│   ├── components/         # React components
│   ├── contexts/           # React contexts
│   ├── services/           # API services
│   └── pages/              # Page components
├── server/                 # Backend source
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Express middleware
│   │   ├── db/             # Database layer
│   │   └── index.ts        # Entry point
│   ├── railway.json        # Railway config
│   └── package.json
├── QUICK_START.md          # Quick start guide
├── DEPLOYMENT_COMPLETE.md  # Deployment guide
└── README.md               # This file
```

---

## 🧪 Testing

### **Create Test User**
```sql
INSERT INTO users (id, email, name)
VALUES ('test-user', 'test@example.com', 'Test User');
```

### **Create Agent & API Key**
```bash
curl -X POST http://localhost:3001/api/agents \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Agent"}'
```

### **Upload Material**
```bash
curl -X POST http://localhost:3001/api/materials/text \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "text",
    "title": "Test",
    "content": "Test content"
  }'
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- DeepSeek for AI capabilities
- OpenAI for embeddings
- Railway for hosting
- Shadcn/ui for components

---

## 📞 Support

For issues and questions:
- 📧 Email: support@sanad.com
- 🐛 Issues: [GitHub Issues](https://github.com/balawi2991/sanadbot/issues)

---

<div align="center">

**Made with ❤️ for the AI community**

⭐ Star this repo if you find it helpful!

</div>
