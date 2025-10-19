# 🚀 MintChat - AI Chat Widget SaaS Platform

A full-stack SaaS platform for creating and deploying AI-powered chat widgets with RAG (Retrieval-Augmented Generation) capabilities.

## 🎯 Features

- ✅ **Full-Stack Monorepo**: Frontend + Backend in one deployment
- ✅ **MongoDB Database**: Scalable NoSQL database
- ✅ **RAG System**: Train your AI with custom knowledge
- ✅ **DeepSeek Integration**: Powerful AI responses
- ✅ **Real-time Chat Widget**: Beautiful, responsive chat interface
- ✅ **Multi-tenant**: Perfect isolation between users
- ✅ **Customizable Appearance**: Brand your chat widget
- ✅ **Railway Ready**: One-click deployment

## 📦 Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (Build tool)
- TailwindCSS + Shadcn/ui
- React Query (Data fetching)
- React Router (Routing)

### Backend
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Rate Limiting
- DeepSeek AI API

## 🚂 Railway Deployment

### Quick Start

1. **Fork/Clone this repository**

2. **Create new Railway project**
   - Go to https://railway.app/new
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add MongoDB Database**
   - Click "+ New" in your project
   - Select "Database" → "MongoDB"
   - Railway will auto-inject `MONGODB_URI`

4. **Set Environment Variables**
   ```
   JWT_SECRET=<generate-random-32-char-string>
   DEEPSEEK_API_KEY=<your-deepseek-api-key>
   NODE_ENV=production
   ```

5. **Deploy**
   - Railway will automatically build and deploy
   - Get your domain from Settings → Networking

### Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Get DeepSeek API Key
1. Visit https://platform.deepseek.com
2. Sign up / Sign in
3. Create API key
4. Copy to Railway environment variables

## 💻 Local Development

### Prerequisites
- Node.js 18+
- MongoDB (local or cloud)
- DeepSeek API key

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create .env file**
   ```bash
   cp .env.example .env
   ```

3. **Edit .env with your credentials**
   ```env
   MONGODB_URI=mongodb://localhost:27017/mintchat
   JWT_SECRET=your-secret-key
   DEEPSEEK_API_KEY=your-api-key
   NODE_ENV=development
   ```

4. **Run development servers**
   ```bash
   npm run dev
   ```
   This starts both frontend (Vite) and backend (Express) concurrently.

5. **Access the app**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000/api

## 📁 Project Structure

```
mintchat/
├── src/                    # Frontend React app
│   ├── components/         # React components
│   │   ├── widget/        # Chat widget components
│   │   ├── appearance/    # Appearance customization
│   │   └── ui/            # Shadcn UI components
│   ├── pages/             # Page components
│   ├── contexts/          # React contexts
│   ├── lib/               # Utilities & API client
│   └── services/          # Frontend services
│
├── server/                # Backend Express app
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   │   ├── chat.service.ts      # Chat handling
│   │   ├── rag.service.ts       # RAG system
│   │   └── deepseek.service.ts  # AI integration
│   ├── middleware/        # Express middleware
│   └── config/            # Configuration
│
├── dist/                  # Build output
│   ├── client/           # Frontend build
│   └── server/           # Backend build
│
├── railway.json          # Railway configuration
├── nixpacks.toml         # Nixpacks build config
└── package.json          # Dependencies & scripts
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Run both frontend & backend
npm run dev:client       # Run frontend only
npm run dev:server       # Run backend only

# Build
npm run build            # Build both frontend & backend
npm run build:client     # Build frontend only
npm run build:server     # Build backend only

# Production
npm start                # Start production server

# Linting
npm run lint             # Lint code
npm run typecheck        # TypeScript type checking
```

## 🗄️ Database Schema

### Users
- Authentication & user management
- JWT-based sessions

### TrainingMaterials
- Files, Links, Text content
- RAG embeddings storage
- Per-user isolation

### Conversations
- Chat history
- Messages with sources
- User-specific conversations

### Appearance
- Widget customization
- Branding settings
- Per-user configuration

## 🔐 Security Features

- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Rate limiting
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Input validation
- ✅ User data isolation

## 🎨 Widget Features

### Ask Bar
- Fixed center-bottom position
- Auto-expanding textarea
- Optional RGB glow effect
- Responsive design

### Chat Modal
- Smooth animations
- Message history
- Source citations
- Typing indicator
- Suggested questions
- Mobile-responsive

### Customization
- Primary color
- Logo & avatar
- Title & placeholder
- Suggested questions
- Glow border toggle

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login
- `POST /api/auth/reset-password` - Password reset

### Chat
- `POST /api/chat/message` - Send message & get AI response

### Training Materials
- `GET /api/training` - List materials
- `POST /api/training/file` - Add file
- `POST /api/training/link` - Add link
- `POST /api/training/text` - Add text
- `POST /api/training/:id/retrain` - Retrain material
- `DELETE /api/training/:id` - Delete material

### Conversations
- `GET /api/conversations` - List conversations
- `GET /api/conversations/:id` - Get conversation
- `DELETE /api/conversations/:id` - Delete conversation
- `PATCH /api/conversations/:id` - Rename conversation

### Appearance
- `GET /api/appearance` - Get settings
- `PUT /api/appearance` - Update settings

## 🚀 Production Checklist

- [ ] MongoDB database created on Railway
- [ ] Environment variables configured
- [ ] JWT_SECRET generated (32+ characters)
- [ ] DeepSeek API key added
- [ ] Domain configured in Railway
- [ ] Test authentication flow
- [ ] Test chat functionality
- [ ] Test training materials upload
- [ ] Test widget customization
- [ ] Monitor logs for errors

## 🐛 Troubleshooting

### Build Fails
- Check `package.json` dependencies
- Verify `tsconfig.server.json` exists
- Check Railway build logs

### Database Connection Issues
- Verify MongoDB service is running
- Check `MONGODB_URI` environment variable
- Test connection string locally

### API Errors
- Verify `DEEPSEEK_API_KEY` is valid
- Check `JWT_SECRET` is set
- Review application logs in Railway

### Widget Not Showing
- Check browser console for errors
- Verify API endpoints are accessible
- Test in Try My Agent page first

## 📝 Environment Variables Reference

| Variable | Description | Required | Auto-provided |
|----------|-------------|----------|---------------|
| `MONGODB_URI` | MongoDB connection string | ✅ | ✅ (Railway) |
| `MONGO_URL` | Alternative MongoDB variable | ✅ | ✅ (Railway) |
| `JWT_SECRET` | Secret for JWT tokens | ✅ | ❌ |
| `DEEPSEEK_API_KEY` | DeepSeek API key | ✅ | ❌ |
| `NODE_ENV` | Environment (production) | ✅ | ❌ |
| `PORT` | Server port | ❌ | ✅ (Railway) |

## 🤝 Contributing

This is a private SaaS project. For issues or questions, contact the development team.

## 📄 License

Proprietary - All rights reserved

## 🔗 Links

- [Railway Documentation](https://docs.railway.app)
- [DeepSeek API Docs](https://platform.deepseek.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

Built with ❤️ using React, Express, MongoDB, and DeepSeek AI
