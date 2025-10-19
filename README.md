# 🚀 MintChat - AI Chat Widget SaaS Platform

A complete full-stack SaaS platform for creating and deploying AI-powered chat widgets with RAG (Retrieval-Augmented Generation) capabilities.

## ⚡ Quick Start

### 📖 New Here? Start Here!
**→ Read [`START_HERE.md`](START_HERE.md)** for a complete overview and quick start guide.

### 🏃 Quick Commands

```bash
# Install dependencies
npm install

# Run development (frontend + backend)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🎯 What is MintChat?

MintChat is a **full-stack SaaS platform** that allows users to:
- ✅ Create AI-powered chat widgets
- ✅ Train AI with custom knowledge (files, links, text)
- ✅ Customize widget appearance (colors, logo, branding)
- ✅ Embed widgets on any website
- ✅ View and manage conversations
- ✅ Get AI responses powered by DeepSeek with RAG

## 🏗️ Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (Build tool)
- TailwindCSS + Shadcn/ui
- React Query (Data fetching)
- React Router (Routing)

### Backend
- Express.js + TypeScript
- MongoDB + Mongoose
- JWT Authentication
- DeepSeek AI API
- RAG System

### Deployment
- Railway (Single deployment)
- MongoDB (Railway managed)
- Environment variables
- Auto-scaling

## 📚 Documentation

| File | Description |
|------|-------------|
| **[START_HERE.md](START_HERE.md)** | 👈 **Start here!** Complete overview |
| **[QUICK_START.md](QUICK_START.md)** | 5-minute quick start guide |
| **[RAILWAY_SETUP.md](RAILWAY_SETUP.md)** | Detailed Railway deployment guide |
| **[ENV_VARIABLES.md](ENV_VARIABLES.md)** | Environment variables reference |
| **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** | Pre-deployment checklist |
| **[README_DEPLOYMENT.md](README_DEPLOYMENT.md)** | Complete technical documentation |
| **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** | Technical project summary |
| **[DONE.md](DONE.md)** | What's been completed |

## 🚂 Deploy to Railway

### Prerequisites
- GitHub account
- Railway account (https://railway.app)
- DeepSeek API key (https://platform.deepseek.com)

### Steps
1. Push code to GitHub
2. Create new Railway project from GitHub repo
3. Add MongoDB database to project
4. Set environment variables:
   - `JWT_SECRET` (generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
   - `DEEPSEEK_API_KEY` (from DeepSeek platform)
   - `NODE_ENV=production`
5. Deploy!

**Detailed instructions:** [RAILWAY_SETUP.md](RAILWAY_SETUP.md)

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

2. **Create environment file**
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

4. **Start development servers**
   ```bash
   npm run dev
   ```
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

## 🎨 Features

### ✅ Complete Chat Widget
- **Ask-bar**: Fixed center-bottom input with RGB glow effect
- **Modal**: Smooth animations, message history, source citations
- **Responsive**: Works on desktop and mobile
- **Customizable**: Colors, logo, title, suggested questions

### ✅ RAG System
- Train AI with files, links, and text
- Automatic document indexing
- Context retrieval for accurate responses
- Source citations in answers

### ✅ Multi-tenant SaaS
- Complete user isolation
- JWT authentication
- Per-user training materials
- Per-user conversations
- Per-user appearance settings

### ✅ Admin Dashboard
- Overview statistics
- Training materials management
- Appearance customization
- Conversation history
- Embed code generation

## 📦 Project Structure

```
mintchat/
├── src/                    # Frontend (React)
│   ├── components/
│   │   ├── widget/        # Chat widget components
│   │   ├── appearance/    # Appearance controls
│   │   └── ui/            # Shadcn UI components
│   ├── pages/             # Page components
│   ├── lib/               # API client
│   └── contexts/          # React contexts
│
├── server/                # Backend (Express)
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── middleware/       # Express middleware
│   └── config/           # Configuration
│
├── dist/                 # Build output
│   ├── client/          # Frontend build
│   └── server/          # Backend build
│
└── [config files]        # Railway, TypeScript, etc.
```

## 🔐 Security

- JWT authentication with bcrypt password hashing
- Rate limiting (100 req/15min, 10 msg/min)
- CORS protection
- Helmet security headers
- User data isolation in MongoDB
- Environment variable protection

## 🧪 Testing

### Local
```bash
npm run dev
# Visit http://localhost:5173
# Sign up → Test features
```

### Production
```bash
npm run build
npm start
# Visit http://localhost:3000
```

## 📊 API Endpoints

- `POST /api/auth/signup` - Register
- `POST /api/auth/signin` - Login
- `POST /api/chat/message` - Send message
- `GET /api/training` - List training materials
- `GET /api/conversations` - List conversations
- `GET /api/appearance` - Get appearance settings

**Full API documentation:** [README_DEPLOYMENT.md](README_DEPLOYMENT.md)

## 🆘 Troubleshooting

### Build fails
- Check `package.json` dependencies
- Run `npm run typecheck`
- Review Railway build logs

### Database connection error
- Verify MongoDB is running
- Check `MONGODB_URI` environment variable
- Test connection string

### API errors
- Verify `DEEPSEEK_API_KEY` is valid
- Check `JWT_SECRET` is set
- Review browser console

**More help:** [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)

## 🎯 What's Next?

1. **Read Documentation**: Start with [START_HERE.md](START_HERE.md)
2. **Local Testing**: Follow [QUICK_START.md](QUICK_START.md)
3. **Deploy**: Use [RAILWAY_SETUP.md](RAILWAY_SETUP.md)
4. **Customize**: Add training materials, customize appearance
5. **Embed**: Get embed code and add to your website

## 📝 Environment Variables

Required variables:
- `MONGODB_URI` - MongoDB connection (auto-provided by Railway)
- `JWT_SECRET` - Secret for JWT tokens (you generate)
- `DEEPSEEK_API_KEY` - DeepSeek API key (from platform)
- `NODE_ENV` - Environment (development/production)

**Full reference:** [ENV_VARIABLES.md](ENV_VARIABLES.md)

## 🤝 Contributing

This is a private SaaS project. For issues or questions, contact the development team.

## 📄 License

Proprietary - All rights reserved

---

## 🎉 Ready to Start?

1. **Quick Local Test**: Read [QUICK_START.md](QUICK_START.md) → "Local Development"
2. **Deploy to Railway**: Read [QUICK_START.md](QUICK_START.md) → "Deploy to Railway"
3. **Deep Dive**: Read [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) + [README_DEPLOYMENT.md](README_DEPLOYMENT.md)

**Need help?** Check the documentation files above or Railway logs.

---

Built with ❤️ using React, Express, MongoDB, and DeepSeek AI
