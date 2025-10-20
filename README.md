# MintChat - AI-Powered Customer Support Platform

A modern SaaS platform for creating AI-powered chatbots trained on your own data.

## 🚀 Features

- **AI Chat Widget** - Embeddable chat widget with customizable appearance
- **RAG System** - Semantic search with OpenAI embeddings
- **Training Materials** - Upload files, links, or text to train your bot
- **Usage Tracking** - Monitor messages and token usage with monthly limits
- **Conversations** - View and manage all chat history
- **Multi-tenant** - Perfect user isolation for SaaS

## 🛠️ Tech Stack

**Frontend:**
- React + TypeScript
- TailwindCSS
- Vite
- React Query

**Backend:**
- Node.js + Express
- MongoDB
- DeepSeek AI
- OpenAI Embeddings (optional)

**Deployment:**
- Railway (Backend + Database)
- Single deployment for full-stack

## 📦 Installation

### Prerequisites
- Node.js 18+
- MongoDB (or Railway MongoDB)
- DeepSeek API key

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/balawi2991/sndd.git
cd sndd
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment variables**
Create `.env` file:
```env
# Required
MONGODB_URI=mongodb://...
JWT_SECRET=your-secret-key
DEEPSEEK_API_KEY=sk-...

# Optional (for better RAG)
OPENAI_API_KEY=sk-...

# Server
PORT=8080
NODE_ENV=production
```

4. **Build**
```bash
npm run build
```

5. **Start**
```bash
npm start
```

## 🚂 Railway Deployment

### Quick Deploy

1. **Connect GitHub repo to Railway**
2. **Add environment variables** (see `.env.example`)
3. **Deploy** - Railway will auto-detect and build

### Railway Configuration

The project includes:
- `railway.json` - Build and start commands
- `nixpacks.toml` - Build configuration
- `Procfile` - Process definition

### MongoDB on Railway

1. Add MongoDB plugin in Railway
2. Copy `MONGODB_URI` to environment variables
3. Restart service

## 📚 Usage

### 1. Sign Up
Create an account at `/auth/signin`

### 2. Add Training Materials
Go to **Training Materials** and add:
- Files (PDF, TXT, etc.)
- Links (websites, docs)
- Text (direct input)

### 3. Customize Widget
Go to **Appearance** and customize:
- Colors
- Logo
- Avatar
- Placeholder text
- Suggested questions

### 4. Try Your Agent
Test in **Try My Agent** page

### 5. Embed Widget
Get embed code from **Embed Code** page

## 🎨 Widget Customization

```javascript
// The widget auto-detects its container
// In Appearance: scaled to fit preview
// In Try My Agent: scaled for browser frame
// On real website: full size

// Widget specs:
// - Ask-bar: 360px max-width, center-bottom
// - Modal: 720px × 80vh
// - Animations: 200ms smooth transitions
```

## 📊 Usage Limits

| Plan | Messages/Month | Tokens/Month |
|------|----------------|--------------|
| Free | 100 | 50,000 |
| Pro | 1,000 | 500,000 |
| Enterprise | Unlimited | Unlimited |

## 🔧 Development

```bash
# Frontend dev server
npm run dev

# Backend dev server
npm run server:dev

# Build
npm run build

# Type check
npm run type-check
```

## 📁 Project Structure

```
├── src/                    # Frontend
│   ├── components/         # React components
│   │   ├── widget/        # Chat widget
│   │   ├── appearance/    # Customization
│   │   └── training/      # Training materials
│   ├── pages/             # App pages
│   ├── lib/               # API client
│   └── contexts/          # React contexts
│
├── server/                # Backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   │   ├── chat.service.ts
│   │   ├── rag.service.ts
│   │   └── deepseek.service.ts
│   ├── middleware/       # Auth, rate limiting
│   └── config/           # Database config
│
└── public/               # Static assets
```

## 🔐 Security

- JWT authentication
- Rate limiting (100 req/15min)
- User isolation (perfect for SaaS)
- Trust proxy for Railway
- Input validation

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check MONGODB_URI format
mongodb://username:password@host:port/database

# Railway MongoDB format
mongodb://mongo:password@containers-us-west-xxx.railway.app:port
```

### Build Errors
```bash
# Clear cache
rm -rf dist node_modules
npm install
npm run build
```

### Widget Not Showing
- Check container has `.live-preview-canvas` class
- Verify widget is inside `.live-preview__widget-slot`
- Check z-index conflicts

## 📝 API Documentation

### Authentication
```bash
POST /api/auth/signup
POST /api/auth/signin
```

### Chat
```bash
POST /api/chat/message
```

### Training
```bash
GET    /api/training
POST   /api/training
DELETE /api/training/:id
```

### Usage
```bash
GET /api/usage/stats
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file

## 🙏 Acknowledgments

- DeepSeek AI for chat completions
- OpenAI for embeddings
- Railway for hosting

## 📞 Support

- GitHub Issues: [Report a bug](https://github.com/balawi2991/sndd/issues)
- Email: support@mintchat.com

---

**Built with ❤️ for better customer support**
