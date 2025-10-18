# 🚀 دليل الإعداد الكامل - Sanad

## نظرة عامة
هذا الدليل سيساعدك على إعداد مشروع Sanad بالكامل من الصفر.

---

## المتطلبات الأساسية

### 1. البرامج المطلوبة
- ✅ Node.js 18+ ([تحميل](https://nodejs.org))
- ✅ PostgreSQL 14+ ([تحميل](https://www.postgresql.org/download/))
- ✅ Git ([تحميل](https://git-scm.com/))

### 2. API Keys المطلوبة
- ✅ DeepSeek API Key ([احصل عليه](https://platform.deepseek.com))
- ✅ OpenAI API Key ([احصل عليه](https://platform.openai.com))

---

## الخطوة 1: تثبيت PostgreSQL

### Windows
```powershell
# تحميل من: https://www.postgresql.org/download/windows/
# أثناء التثبيت:
# - احفظ كلمة المرور (ستحتاجها لاحقاً)
# - Port: 5432 (افتراضي)
# - اختر تثبيت pgAdmin (اختياري)

# بعد التثبيت، تحقق:
psql --version
```

### Mac
```bash
# باستخدام Homebrew
brew install postgresql@16
brew services start postgresql@16

# تحقق من التثبيت
psql --version
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# تحقق من التثبيت
psql --version
```

---

## الخطوة 2: تثبيت pgvector Extension

### Windows
```powershell
# تحميل من: https://github.com/pgvector/pgvector/releases
# أو استخدم Supabase (يأتي مع pgvector مدمج)
```

### Mac
```bash
brew install pgvector
```

### Linux
```bash
# PostgreSQL 16
sudo apt install postgresql-16-pgvector

# أو compile من المصدر
git clone https://github.com/pgvector/pgvector.git
cd pgvector
make
sudo make install
```

---

## الخطوة 3: إعداد المشروع

### 1. Clone أو Navigate إلى المشروع
```bash
cd C:\Users\balaw_mce0m32\Downloads\sanad
```

### 2. تثبيت Dependencies

#### Frontend
```bash
# في المجلد الرئيسي
npm install
```

#### Backend
```bash
cd server
npm install
cd ..
```

---

## الخطوة 4: إعداد Environment Variables

### 1. Backend Environment
```bash
cd server
cp .env.example .env
```

**تعديل `server/.env`:**
```env
# Server
NODE_ENV=development
PORT=3001

# DeepSeek API
DEEPSEEK_API_KEY=sk-your-deepseek-key-here
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
DEEPSEEK_MODEL=deepseek-chat
DEEPSEEK_TEMPERATURE=0.7
DEEPSEEK_MAX_TOKENS=1000
DEEPSEEK_TIMEOUT=30000

# Database
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/sanad

# OpenAI (for embeddings)
OPENAI_API_KEY=sk-your-openai-key-here

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_PER_MINUTE=10
RATE_LIMIT_PER_HOUR=100
RATE_LIMIT_PER_DAY=500

# RAG Configuration
RAG_CHUNK_SIZE=750
RAG_CHUNK_OVERLAP=100
RAG_TOP_K=10
RAG_RERANK_TOP=3
RAG_SIMILARITY_THRESHOLD=0.7
```

### 2. Frontend Environment
```bash
cd ..
cp .env.example .env
```

**تعديل `.env`:**
```env
VITE_API_URL=http://localhost:3001/api
VITE_ENABLE_DEBUG=true
```

---

## الخطوة 5: إعداد قاعدة البيانات (تلقائي!)

### الطريقة السهلة - كل شيء بأمر واحد:
```bash
cd server
npm run setup
```

هذا الأمر سيقوم بـ:
1. ✅ إنشاء قاعدة البيانات
2. ✅ تثبيت pgvector extension
3. ✅ تشغيل schema
4. ✅ إضافة مستخدم تجريبي
5. ✅ إضافة مواد تدريبية تجريبية
6. ✅ فهرسة المواد

### أو خطوة بخطوة:
```bash
# 1. إعداد قاعدة البيانات
npm run db:setup

# 2. إضافة بيانات تجريبية
npm run db:seed

# 3. فهرسة المواد
npm run db:index
```

---

## الخطوة 6: تشغيل المشروع

### Terminal 1: Backend
```bash
cd server
npm run dev
```

يجب أن ترى:
```
✅ Database connection pool created
🚀 Server running on http://localhost:3001
```

### Terminal 2: Frontend
```bash
# في المجلد الرئيسي
npm run dev
```

يجب أن ترى:
```
Local: http://localhost:5173
```

---

## الخطوة 7: اختبار النظام

### 1. افتح المتصفح
```
http://localhost:5173
```

### 2. جرب الصفحات
- ✅ Dashboard
- ✅ Conversations
- ✅ Training Materials
- ✅ Appearance (Live Preview)
- ✅ Try My Agent
- ✅ Demo Page

### 3. اختبر Chat Widget
1. اكتب رسالة في Ask-bar
2. يجب أن تحصل على رد من الذكاء الاصطناعي
3. تحقق من Sources أسفل الرد

---

## 🎉 تهانينا! النظام يعمل

---

## 🔧 أوامر مفيدة

### Database Management
```bash
# إعادة تعيين قاعدة البيانات بالكامل
npm run db:reset

# إعداد قاعدة البيانات فقط
npm run db:setup

# إضافة بيانات تجريبية
npm run db:seed

# فهرسة المواد
npm run db:index
```

### Development
```bash
# Backend
cd server
npm run dev        # تشغيل مع hot reload
npm run build      # Build للإنتاج
npm start          # تشغيل production build

# Frontend
npm run dev        # تشغيل مع hot reload
npm run build      # Build للإنتاج
npm run preview    # معاينة production build
```

---

## 🐛 حل المشاكل الشائعة

### 1. "Cannot connect to database"
```bash
# تحقق من تشغيل PostgreSQL
# Windows
Get-Service postgresql*

# Mac/Linux
brew services list  # Mac
sudo systemctl status postgresql  # Linux

# إذا لم يكن يعمل، شغله:
# Windows: ابدأ من Services
# Mac: brew services start postgresql@16
# Linux: sudo systemctl start postgresql
```

### 2. "pgvector extension not found"
```bash
# تثبيت pgvector
# راجع الخطوة 2 أعلاه
```

### 3. "DEEPSEEK_API_KEY is required"
```bash
# تأكد من إضافة API key في server/.env
# DEEPSEEK_API_KEY=sk-xxxxx
```

### 4. "OPENAI_API_KEY is required"
```bash
# تأكد من إضافة API key في server/.env
# OPENAI_API_KEY=sk-xxxxx
```

### 5. "Port 3001 already in use"
```powershell
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3001 | xargs kill -9
```

### 6. "CORS error"
```bash
# تأكد أن CORS_ORIGIN في server/.env يطابق frontend URL
# CORS_ORIGIN=http://localhost:5173
```

### 7. "No training data" error
```bash
# هذا طبيعي إذا لم تضف مواد تدريبية
# شغل:
cd server
npm run db:seed
npm run db:index
```

---

## 📊 التحقق من النجاح

### Backend Health Check
```bash
curl http://localhost:3001/health
```

يجب أن ترى:
```json
{
  "status": "ok",
  "timestamp": "...",
  "uptime": ...
}
```

### Database Check
```bash
psql sanad
```

```sql
-- عرض الجداول
\dt

-- عدد المواد التدريبية
SELECT COUNT(*) FROM training_materials;

-- عدد الـ chunks المفهرسة
SELECT COUNT(*) FROM chunks;

-- الخروج
\q
```

---

## 🎯 الخطوات التالية

بعد الإعداد الناجح:

### 1. إضافة محتوى خاص بك
- اذهب إلى Training Materials
- أضف ملفات، روابط، أو نصوص
- سيتم الفهرسة تلقائياً

### 2. تخصيص المظهر
- اذهب إلى Appearance
- غير الألوان، الشعار، النصوص
- شاهد التغييرات مباشرة في Live Preview

### 3. اختبار الـ Widget
- اذهب إلى Try My Agent
- اطرح أسئلة مختلفة
- تحقق من دقة الإجابات

### 4. دمج في موقعك
- اذهب إلى Embed
- انسخ الكود
- ألصقه في موقعك

---

## 📝 ملاحظات مهمة

### User ID
حالياً النظام يستخدم `demo-user-id` للتطوير.  
في الإنتاج، ستحتاج لإضافة authentication حقيقي.

### API Keys
- احفظ API keys بأمان
- لا تشاركها أو ترفعها على Git
- استخدم .env files (مضافة في .gitignore)

### Database
- احفظ نسخة احتياطية من قاعدة البيانات بانتظام
- استخدم `pg_dump` للنسخ الاحتياطي

### Performance
- أول استدعاء قد يكون بطيئاً (cold start)
- الاستدعاءات التالية ستكون أسرع
- راقب logs للأداء

---

## 🚀 الانتقال للإنتاج (لاحقاً)

عندما تكون جاهزاً للـ deployment:

1. **Railway Deployment** - راجع `RAILWAY_DEPLOYMENT.md` (سيتم إنشاؤه لاحقاً)
2. **Authentication** - إضافة JWT/Session
3. **File Upload** - S3 أو Railway Volumes
4. **Monitoring** - Sentry, LogRocket
5. **Analytics** - Google Analytics, Mixpanel

---

## 📚 المستندات

- `FINAL_SUMMARY.md` - ملخص المشروع
- `BACKEND_ARCHITECTURE.md` - البنية المعمارية
- `IMPLEMENTATION_GUIDE.md` - دليل التنفيذ
- `INTEGRATION_COMPLETE.md` - تفاصيل الربط
- `QUICK_START.md` - دليل سريع

---

## 💬 الدعم

إذا واجهت مشاكل:
1. راجع قسم "حل المشاكل" أعلاه
2. تحقق من logs (Backend و Frontend)
3. راجع المستندات
4. تحقق من GitHub Issues

---

**وقت الإعداد المتوقع**: 30-45 دقيقة

**الحالة**: ✅ جاهز للتشغيل!

**آخر تحديث**: الجلسة الحالية
