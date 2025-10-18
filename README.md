# 🤖 Sanad - AI-Powered Customer Support Platform

> **MintChat** - Build intelligent chatbots trained on your data with RAG + DeepSeek AI

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)

---

## ✨ Features

### **🎨 Frontend**
- ✅ Beautiful chat widget with RGB glow animation
- ✅ Real-time AI responses
- ✅ Markdown support with syntax highlighting
- ✅ Source citations
- ✅ Responsive design
- ✅ Dark/Light mode support

### **🚀 Backend**
- ✅ RAG (Retrieval-Augmented Generation) pipeline
- ✅ DeepSeek AI integration
- ✅ Vector search with pgvector
- ✅ Multi-tenancy & user isolation
- ✅ JWT & API Key authentication
- ✅ File upload (PDF, TXT, MD, CSV)
- ✅ Rate limiting & usage tracking

### **🔒 Security**
- ✅ Row-level security (RLS)
- ✅ API key management
- ✅ Audit logging
- ✅ CORS protection
- ✅ Input validation

### **💼 SaaS Ready**
- ✅ Subscription tiers
- ✅ Usage limits
- ✅ Billing-ready structure
- ✅ Multi-agent support

---

## 🏗️ Tech Stack

### **Frontend**
- React 18 + TypeScript
- Vite
- TailwindCSS
- Shadcn/ui
- React Router
- Zustand (state management)

### **Backend**
- Node.js + Express
- TypeScript
- PostgreSQL + pgvector
- OpenAI (embeddings)
- DeepSeek (chat)
- Redis (rate limiting)

---

## 📦 Installation

### **Prerequisites**
- Node.js 18+
- PostgreSQL 14+
- Redis (optional)
- DeepSeek API key
- OpenAI API key

### **1. Clone Repository**
```bash
git clone https://github.com/balawi2991/sanaad.git
cd sanaad
```

### **2. Install Dependencies**

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd server
npm install
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

### **4. Configure Environment**

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:3001/api
```

**Backend (server/.env):**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/sanad
DEEPSEEK_API_KEY=your_deepseek_key
OPENAI_API_KEY=your_openai_key
JWT_SECRET=your_secret_key_min_32_chars
CORS_ORIGIN=http://localhost:5173
```

### **5. Run Development Servers**

**Frontend:**
```bash
npm run dev
# Open http://localhost:5173
```

**Backend:**
```bash
cd server
npm run dev
# Server runs on http://localhost:3001
```

---

## 🚀 Deployment

### **Railway (Recommended)**

See detailed guide: [`RAILWAY_DEPLOYMENT.md`](./RAILWAY_DEPLOYMENT.md)

**Quick Deploy:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
cd server
railway up
```

### **Other Platforms**
- Vercel (Frontend)
- Heroku (Backend)
- AWS/GCP/Azure

---

## 📚 Documentation

- **[Quick Start Guide](./QUICK_START.md)** - Get started in 15 minutes
- **[Railway Deployment](./RAILWAY_DEPLOYMENT.md)** - Deploy to Railway
- **[SaaS Security Guide](./SAAS_SECURITY_GUIDE.md)** - Security & Multi-tenancy
- **[Backend Architecture](./BACKEND_ARCHITECTURE.md)** - Technical details
- **[Implementation Guide](./IMPLEMENTATION_GUIDE.md)** - Development guide

---

## 🎯 Project Structure

```
sanad/
├── src/                    # Frontend source
│   ├── components/         # React components
│   ├── contexts/          # React contexts
│   ├── pages/             # Page components
│   ├── services/          # API services
│   └── lib/               # Utilities
├── server/                # Backend source
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── middleware/    # Express middleware
│   │   ├── db/            # Database
│   │   └── schemas/       # Validation schemas
│   └── scripts/           # Deployment scripts
├── public/                # Static assets
└── docs/                  # Documentation
```

---

## 🔑 API Endpoints

### **Chat**
- `POST /api/chat` - Send message
- `GET /api/chat/conversations` - List conversations
- `GET /api/chat/conversations/:id` - Get conversation
- `DELETE /api/chat/conversations/:id` - Delete conversation

### **Materials**
- `GET /api/materials` - List materials
- `POST /api/materials/text` - Add text/link
- `POST /api/materials/upload` - Upload file
- `DELETE /api/materials/:id` - Delete material

### **Agents**
- `GET /api/agents` - List agents
- `POST /api/agents` - Create agent
- `POST /api/agents/:id/regenerate` - Regenerate API key
- `DELETE /api/agents/:id` - Delete agent

---

## 🧪 Testing

```bash
# Frontend tests
npm test

# Backend tests
cd server
npm test

# E2E tests
npm run test:e2e
```

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- [DeepSeek](https://www.deepseek.com/) - AI model
- [OpenAI](https://openai.com/) - Embeddings
- [Shadcn/ui](https://ui.shadcn.com/) - UI components
- [Railway](https://railway.app/) - Hosting platform

---

## 📞 Support

- 📧 Email: support@sanad.com
- 💬 Discord: [Join our community](https://discord.gg/sanad)
- 📖 Docs: [docs.sanad.com](https://docs.sanad.com)

---

## 🗺️ Roadmap

- [ ] User authentication & registration
- [ ] Frontend upload UI
- [ ] Stripe billing integration
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Voice input/output
- [ ] Mobile app (React Native)
- [ ] Slack/Discord integrations

---

**Made with ❤️ by the Sanad Team**
