# 🤖 Sanad (MintChat) - AI-Powered Chat Platform

<div align="center">

![Status](https://img.shields.io/badge/Status-Ready%20for%20Local%20Testing-green)
![Progress](https://img.shields.io/badge/Progress-70%25-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

**منصة ذكاء اصطناعي متقدمة مع RAG + DeepSeek**

[التوثيق](#-documentation) • [البدء السريع](#-quick-start) • [المميزات](#-features) • [التقنيات](#-tech-stack)

</div>

---

## 📋 نظرة عامة

Sanad هو نظام chatbot ذكي يستخدم تقنية RAG (Retrieval-Augmented Generation) مع DeepSeek AI لتقديم إجابات دقيقة بناءً على مواد تدريبية مخصصة.

### ✨ المميزات الرئيسية

- 🤖 **AI-Powered Responses** - ردود ذكية باستخدام DeepSeek
- 📚 **RAG Pipeline** - استرجاع معلومات دقيقة من المواد التدريبية
- 🎨 **Customizable Widget** - قابل للتخصيص بالكامل
- 🔒 **Multi-tenancy Ready** - عزل كامل بين المستخدمين
- ⚡ **Real-time Updates** - تحديثات فورية للمظهر والإعدادات
- 📊 **Conversation History** - حفظ وإدارة المحادثات
- 🌐 **Arabic & English** - دعم كامل للغة العربية

---

## 🚀 Quick Start

### المتطلبات
- Node.js 18+
- PostgreSQL 14+ مع pgvector
- DeepSeek API Key
- OpenAI API Key

### التثبيت السريع

```bash
# 1. Clone المشروع
git clone <repo-url>
cd sanad

# 2. تثبيت Dependencies
npm install
cd server && npm install && cd ..

# 3. إعداد Environment Variables
cp .env.example .env
cd server && cp .env.example .env && cd ..
# أضف API keys في server/.env

# 4. إعداد قاعدة البيانات (تلقائي!)
cd server
npm run setup

# 5. تشغيل المشروع
npm run dev  # Backend (Terminal 1)
cd .. && npm run dev  # Frontend (Terminal 2)
```

**🎉 افتح المتصفح**: http://localhost:5173

📖 **للتفاصيل الكاملة**: راجع [`COMPLETE_SETUP_GUIDE.md`](./COMPLETE_SETUP_GUIDE.md)

---

## 🎯 Features

### Chat Widget
- ✅ Fixed dimensions مع internal scrolling
- ✅ RGB glow animation
- ✅ Real-time config updates
- ✅ Error handling مع retry
- ✅ Source chips للمراجع
- ✅ Typing indicator
- ✅ Suggested questions

### Backend
- ✅ Single unified API endpoint
- ✅ RAG pipeline كامل (chunking, embeddings, retrieval, reranking)
- ✅ Vector search مع pgvector
- ✅ Rate limiting (10/min, 100/hr, 500/day)
- ✅ Authentication middleware
- ✅ Error handling شامل

### Database
- ✅ PostgreSQL مع pgvector extension
- ✅ Optimized indexes
- ✅ Vector similarity search
- ✅ Auto-update triggers
- ✅ Helper functions

### Automation
- ✅ One-command setup (`npm run setup`)
- ✅ Auto database creation
- ✅ Auto demo data seeding
- ✅ Auto material indexing

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript** + **Vite**
- **TailwindCSS** للتصميم
- **Shadcn/ui** للمكونات
- **React Router** للتنقل
- **React Hook Form** + **Zod** للنماذج
- **date-fns** للتواريخ

### Backend
- **Node.js** + **Express** + **TypeScript**
- **PostgreSQL** مع **pgvector** للـ vector search
- **OpenAI** للـ embeddings
- **DeepSeek** للـ AI responses
- **Zod** للـ validation
- **JWT** للـ authentication (قريباً)

### DevOps
- **Railway** للـ deployment (جاهز)
- **Vercel/Netlify** للـ frontend
- **GitHub Actions** للـ CI/CD (قريباً)

---

## 📁 Project Structure

```
sanad/
├── src/                      # Frontend (React)
│   ├── components/
│   │   ├── widget/          # Chat Widget
│   │   ├── appearance/      # Config controls
│   │   └── ui/              # Shadcn components
│   ├── contexts/            # React Context
│   ├── pages/               # All pages
│   ├── services/api/        # API clients
│   └── hooks/               # Custom hooks
│
├── server/                   # Backend (Node.js)
│   ├── src/
│   │   ├── db/              # Database (schema, client, repositories)
│   │   ├── services/        # Business logic (DeepSeek, RAG, Chat)
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth, errors, rate limit
│   │   └── index.ts         # Main server
│   └── scripts/             # Setup & seeding scripts
│
└── docs/                     # Documentation
    ├── COMPLETE_SETUP_GUIDE.md
    ├── RAILWAY_DEPLOYMENT.md
    ├── PROJECT_STATUS.md
    └── ...
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [`COMPLETE_SETUP_GUIDE.md`](./COMPLETE_SETUP_GUIDE.md) | دليل إعداد شامل خطوة بخطوة |
| [`PROJECT_STATUS.md`](./PROJECT_STATUS.md) | حالة المشروع والتقدم |
| [`RAILWAY_DEPLOYMENT.md`](./RAILWAY_DEPLOYMENT.md) | دليل deployment على Railway |
| [`BACKEND_ARCHITECTURE.md`](./BACKEND_ARCHITECTURE.md) | البنية المعمارية التفصيلية |
| [`FINAL_SUMMARY.md`](./FINAL_SUMMARY.md) | ملخص شامل للمشروع |
| [`QUICK_START.md`](./QUICK_START.md) | دليل بدء سريع |

---

## 🔧 Available Scripts

### Backend
```bash
cd server

# Development
npm run dev              # Start with hot reload

# Database
npm run db:setup         # Setup database
npm run db:seed          # Add demo data
npm run db:index         # Index materials
npm run setup            # All-in-one setup

# Production
npm run build            # Build TypeScript
npm start                # Start production server
```

### Frontend
```bash
# Development
npm run dev              # Start with hot reload

# Production
npm run build            # Build for production
npm run preview          # Preview production build
```

---

## 🎨 Pages

- **Dashboard** - إحصائيات ونظرة عامة
- **Conversations** - إدارة المحادثات
- **Training Materials** - إضافة وإدارة المواد التدريبية
- **Appearance** - تخصيص مظهر الـ Widget
- **Try My Agent** - اختبار الـ Widget
- **Embed** - الحصول على كود التضمين
- **Settings** - إعدادات الحساب
- **Demo** - صفحة عرض عامة

---

## 🔐 Security & Multi-tenancy

- ✅ User isolation في Database
- ✅ Row-level security
- ✅ Rate limiting per user
- ✅ Authentication middleware
- ⚠️ يحتاج JWT للإنتاج

---

## 📊 Progress

| Component | Status |
|-----------|--------|
| Frontend UI | ✅ 100% |
| Chat Widget | ✅ 100% |
| Backend Server | ✅ 100% |
| Database Schema | ✅ 100% |
| RAG Pipeline | ✅ 100% |
| API Integration | ✅ 100% |
| Setup Scripts | ✅ 100% |
| Documentation | ✅ 100% |
| Local Testing | 🔴 Pending |
| Materials Upload UI | 🟡 30% |
| JWT Auth | 🟡 20% |
| Railway Deployment | ⚪ Ready |

**Overall**: ~70% Complete

---

## 🚧 Roadmap

### Phase 1: Setup & Testing ✅ (Current)
- [x] Complete infrastructure
- [x] Database setup scripts
- [x] Documentation
- [ ] Local testing

### Phase 2: Core Features (Next)
- [ ] Materials upload UI
- [ ] Conversations integration
- [ ] File storage
- [ ] Advanced error handling

### Phase 3: Authentication (Soon)
- [ ] JWT implementation
- [ ] User management
- [ ] Protected routes

### Phase 4: Production (Future)
- [ ] Railway deployment
- [ ] Monitoring & analytics
- [ ] Performance optimization

---

## 🐛 Troubleshooting

راجع [`COMPLETE_SETUP_GUIDE.md`](./COMPLETE_SETUP_GUIDE.md#-حل-المشاكل-الشائعة) لحلول المشاكل الشائعة.

---

## 📝 License

MIT License - راجع [LICENSE](./LICENSE) للتفاصيل

---

## 🤝 Contributing

Contributions welcome! راجع [CONTRIBUTING.md](./CONTRIBUTING.md) للتفاصيل.

---

## 📧 Support

- 📖 Documentation: راجع المستندات أعلاه
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-repo/discussions)

---

<div align="center">

**Built with ❤️ using React, TypeScript, and DeepSeek AI**

[⬆ Back to Top](#-sanad-mintchat---ai-powered-chat-platform)

</div>

We don't support custom domains yet.
