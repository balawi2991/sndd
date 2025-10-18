# 🚀 START HERE - Sanad Setup

> **مرحباً! ابدأ من هنا لتشغيل مشروع Sanad**

---

## ⚡ Quick Start (5 دقائق)

### 1. المتطلبات
```bash
# تحقق من التثبيت
node --version   # يجب >= 18
psql --version   # يجب >= 14
```

**ليس مثبت؟** راجع [التثبيت](#-installation)

### 2. API Keys
احصل على:
- 🔑 [DeepSeek API Key](https://platform.deepseek.com)
- 🔑 [OpenAI API Key](https://platform.openai.com)

### 3. Setup
```bash
# 1. Dependencies
npm install
cd server && npm install && cd ..

# 2. Environment
cd server
cp .env.example .env
# أضف API keys في .env

# 3. Database (تلقائي!)
npm run setup

# 4. Run
npm run dev  # Terminal 1
cd .. && npm run dev  # Terminal 2
```

### 4. Test
افتح: http://localhost:5173

🎉 **يعمل؟ رائع! اقرأ [Next Steps](#-next-steps)**

❌ **مشكلة؟** راجع [Troubleshooting](#-troubleshooting)

---

## 📚 Documentation

| ابدأ هنا | للتفاصيل |
|---------|----------|
| 👉 **هذا الملف** | نظرة سريعة |
| [`COMPLETE_SETUP_GUIDE.md`](./COMPLETE_SETUP_GUIDE.md) | دليل شامل خطوة بخطوة |
| [`SETUP_CHECKLIST.md`](./SETUP_CHECKLIST.md) | قائمة تحقق |
| [`PROJECT_STATUS.md`](./PROJECT_STATUS.md) | حالة المشروع |
| [`README.md`](./README.md) | نظرة عامة |

### للمطورين
- [`BACKEND_ARCHITECTURE.md`](./BACKEND_ARCHITECTURE.md) - البنية التقنية
- [`IMPLEMENTATION_GUIDE.md`](./IMPLEMENTATION_GUIDE.md) - دليل التنفيذ
- [`SESSION_SUMMARY.md`](./SESSION_SUMMARY.md) - ملخص الجلسة

### للمستقبل
- [`RAILWAY_DEPLOYMENT.md`](./RAILWAY_DEPLOYMENT.md) - Deployment guide

---

## 🔧 Installation

### Windows

#### Node.js
```powershell
# تحميل من: https://nodejs.org
# اختر LTS version
```

#### PostgreSQL
```powershell
# تحميل من: https://www.postgresql.org/download/windows/
# أثناء التثبيت:
# - احفظ password
# - Port: 5432
# - اختر pgAdmin (اختياري)
```

#### pgvector
```powershell
# تحميل من: https://github.com/pgvector/pgvector/releases
# أو استخدم Supabase (يأتي مع pgvector)
```

### Mac

```bash
# Node.js
brew install node

# PostgreSQL
brew install postgresql@16
brew services start postgresql@16

# pgvector
brew install pgvector
```

### Linux (Ubuntu/Debian)

```bash
# Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# pgvector
sudo apt install postgresql-16-pgvector
```

---

## 🎯 Next Steps

بعد التشغيل الناجح:

### 1. اختبر الـ Widget
- اكتب رسالة في Ask-bar
- تحقق من الرد
- شاهد Sources

### 2. استكشف الصفحات
- **Dashboard** - نظرة عامة
- **Training Materials** - المواد التدريبية
- **Appearance** - تخصيص المظهر
- **Try My Agent** - اختبار
- **Embed** - كود التضمين

### 3. أضف محتوى خاص بك
- اذهب إلى Training Materials
- أضف نصوص، روابط، أو ملفات (قريباً)
- سيتم الفهرسة تلقائياً

### 4. خصص المظهر
- اذهب إلى Appearance
- غير الألوان والنصوص
- شاهد التغييرات مباشرة

---

## 🐛 Troubleshooting

### "Cannot connect to database"
```bash
# تحقق من PostgreSQL
# Windows
Get-Service postgresql*

# Mac
brew services list

# Linux
sudo systemctl status postgresql

# إذا لم يعمل، شغله
```

### "pgvector not found"
```sql
-- في psql
CREATE EXTENSION vector;
```

### "API key required"
```bash
# تحقق من server/.env
# يجب أن يحتوي على:
DEEPSEEK_API_KEY=sk-xxxxx
OPENAI_API_KEY=sk-xxxxx
```

### "Port already in use"
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3001 | xargs kill -9
```

### المزيد من الحلول
راجع [`COMPLETE_SETUP_GUIDE.md`](./COMPLETE_SETUP_GUIDE.md#-حل-المشاكل-الشائعة)

---

## 📊 What's Working

✅ **Frontend** - React + TypeScript  
✅ **Backend** - Node.js + Express  
✅ **Database** - PostgreSQL + pgvector  
✅ **AI** - DeepSeek + RAG  
✅ **Chat Widget** - كامل  
✅ **Setup** - تلقائي  
✅ **Documentation** - شاملة  

---

## 🎯 What's Next

🟡 **Materials Upload UI** - قريباً  
🟡 **JWT Authentication** - قريباً  
🟡 **Conversations Integration** - قريباً  
⚪ **Railway Deployment** - جاهز  

---

## 💡 Tips

### للتطوير
```bash
# Backend logs
cd server && npm run dev

# Frontend logs
npm run dev

# Database reset
cd server && npm run db:reset
```

### للاختبار
```bash
# Health check
curl http://localhost:3001/health

# Test chat
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -H "X-User-Id: demo-user-id" \
  -d '{"question": "مرحبا"}'
```

### للإنتاج
```bash
# Build
cd server && npm run build
npm run build

# Start
cd server && npm start
```

---

## 🎨 Features

### Chat Widget
- ✅ RGB glow animation
- ✅ Fixed dimensions
- ✅ Real-time config
- ✅ Error handling
- ✅ Source chips

### Backend
- ✅ RAG pipeline
- ✅ Vector search
- ✅ Rate limiting
- ✅ Multi-tenancy

### Database
- ✅ PostgreSQL
- ✅ pgvector
- ✅ Optimized indexes
- ✅ Auto-setup

---

## 📞 Need Help?

1. 📖 راجع [Documentation](#-documentation)
2. ✅ استخدم [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)
3. 🐛 راجع [Troubleshooting](#-troubleshooting)
4. 📧 افتح GitHub Issue

---

## 🎉 Success!

إذا وصلت هنا والمشروع يعمل:

1. ✅ **أحسنت!** النظام يعمل
2. 🎨 **خصص** المظهر في Appearance
3. 📚 **أضف** محتوى في Training Materials
4. 🚀 **اختبر** في Try My Agent
5. 🌐 **انشر** على Railway (لاحقاً)

---

## 📈 Progress

**Current**: 70% Complete  
**After Setup**: 75% Complete  
**After Upload UI**: 85% Complete  
**Production Ready**: 95% Complete  

---

## 🔗 Quick Links

- [Complete Setup Guide](./COMPLETE_SETUP_GUIDE.md)
- [Project Status](./PROJECT_STATUS.md)
- [Backend Architecture](./BACKEND_ARCHITECTURE.md)
- [Railway Deployment](./RAILWAY_DEPLOYMENT.md)

---

<div align="center">

**🚀 Ready to start? Run `npm run setup`!**

**Built with ❤️ using React, TypeScript, and DeepSeek AI**

[⬆ Back to Top](#-start-here---sanad-setup)

</div>
