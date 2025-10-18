# 🚂 Railway Environment Variables

## 📋 نسخ والصق هذه المتغيرات في Railway

---

## 🔧 Backend Service (sanad-backend)

### المتغيرات الجاهزة (انسخها كما هي):

```
NODE_ENV=production
PORT=3000
```

### المتغيرات التي تحتاج إلى Railway (تلقائية):

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

**ملاحظة**: هذا المتغير سيتم ملؤه تلقائياً من خدمة PostgreSQL

### المتغيرات التي تحتاج منك (أضف قيمك):

```
DEEPSEEK_API_KEY=sk-your-deepseek-key-here
OPENAI_API_KEY=sk-your-openai-key-here
```

**كيف تحصل عليها:**
- **DeepSeek**: https://platform.deepseek.com/api_keys
- **OpenAI**: https://platform.openai.com/api-keys

### المتغيرات الاختيارية (مع قيم افتراضية جيدة):

```
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
DEEPSEEK_MODEL=deepseek-chat
DEEPSEEK_TEMPERATURE=0.7
DEEPSEEK_MAX_TOKENS=1000
DEEPSEEK_TIMEOUT=30000

RAG_CHUNK_SIZE=750
RAG_CHUNK_OVERLAP=100
RAG_TOP_K=10
RAG_RERANK_TOP=3
RAG_SIMILARITY_THRESHOLD=0.7

RATE_LIMIT_PER_MINUTE=10
RATE_LIMIT_PER_HOUR=100
RATE_LIMIT_PER_DAY=500
```

---

## 🎨 Frontend Service (sanad-frontend)

### المتغيرات الجاهزة:

```
VITE_API_URL=${{sanad-backend.RAILWAY_PUBLIC_DOMAIN}}
```

**ملاحظة**: استبدل `sanad-backend` باسم خدمة Backend الفعلي في Railway

أو إذا كنت تريد استخدام الـ Domain المخصص:

```
VITE_API_URL=https://your-backend-domain.railway.app/api
```

### المتغيرات الاختيارية:

```
VITE_APP_NAME=Sanad
VITE_APP_VERSION=1.0.0
VITE_ENABLE_DEBUG=false
VITE_ENABLE_ANALYTICS=false
```

---

## 🗄️ PostgreSQL Service

### استخدم Template الجاهز:

Railway يوفر template جاهز لـ PostgreSQL مع pgvector:

**Template**: `pgvector`

أو يمكنك استخدام PostgreSQL العادي وتثبيت pgvector يدوياً.

### المتغيرات التلقائية (لا تحتاج لإضافتها):

Railway سيوفر تلقائياً:
- `DATABASE_URL`
- `PGHOST`
- `PGPORT`
- `PGUSER`
- `PGPASSWORD`
- `PGDATABASE`

---

## 📝 ملخص سريع

### Backend (3 متغيرات مطلوبة):
1. ✅ `DATABASE_URL=${{Postgres.DATABASE_URL}}` (تلقائي)
2. 🔑 `DEEPSEEK_API_KEY=sk-...` (منك)
3. 🔑 `OPENAI_API_KEY=sk-...` (منك)

### Frontend (1 متغير مطلوب):
1. ✅ `VITE_API_URL=https://your-backend.railway.app/api` (من Backend domain)

### Database:
1. ✅ استخدم pgvector template (تلقائي)

---

## 🚀 خطوات الإعداد السريعة

### 1. إنشاء PostgreSQL Service
```bash
# في Railway Dashboard:
1. New Project
2. Add Service → Database → PostgreSQL (pgvector template)
3. انتظر حتى يتم Deploy
```

### 2. إنشاء Backend Service
```bash
# في نفس Project:
1. Add Service → GitHub Repo → اختر repo
2. Root Directory: /server
3. Add Variables:
   - DATABASE_URL=${{Postgres.DATABASE_URL}}
   - DEEPSEEK_API_KEY=sk-your-key
   - OPENAI_API_KEY=sk-your-key
   - NODE_ENV=production
4. Deploy
```

### 3. إنشاء Frontend Service
```bash
# في نفس Project:
1. Add Service → GitHub Repo → نفس repo
2. Root Directory: / (root)
3. Add Variables:
   - VITE_API_URL=https://your-backend-url.railway.app/api
4. Deploy
```

---

## ✅ Checklist

- [ ] PostgreSQL service تم إنشاؤه (pgvector template)
- [ ] Backend service تم إنشاؤه
- [ ] DATABASE_URL متصل بـ Postgres
- [ ] DEEPSEEK_API_KEY تم إضافته
- [ ] OPENAI_API_KEY تم إضافته
- [ ] Backend deployed successfully
- [ ] Frontend service تم إنشاؤه
- [ ] VITE_API_URL يشير إلى Backend
- [ ] Frontend deployed successfully
- [ ] Database migrations تم تشغيلها تلقائياً
- [ ] Health check يعمل: `/health`

---

## 🔍 التحقق من النجاح

### Backend Health Check:
```bash
curl https://your-backend.railway.app/health
# يجب أن ترى: {"status":"ok",...}
```

### Frontend:
```
افتح: https://your-frontend.railway.app
يجب أن يعمل بدون أخطاء
```

### Database:
```bash
# في Railway Dashboard → Postgres → Data
# يجب أن ترى الجداول:
- users
- conversations
- messages
- training_materials
- chunks
```

---

## 🐛 حل المشاكل

### "DATABASE_URL is not defined"
- تأكد أن Backend service متصل بـ Postgres service
- استخدم: `${{Postgres.DATABASE_URL}}`

### "pgvector extension not found"
- استخدم pgvector template من Railway
- أو قم بتثبيته يدوياً: `CREATE EXTENSION vector;`

### "CORS error"
- تأكد أن VITE_API_URL صحيح
- Backend سيسمح تلقائياً بـ CORS من أي مصدر في production

### "Migration failed"
- تحقق من Logs في Railway
- قد تحتاج لتشغيل migration يدوياً أول مرة

---

## 📚 مصادر إضافية

- Railway Docs: https://docs.railway.com
- pgvector Template: https://railway.com/template/3jJFCA
- Express Guide: https://docs.railway.com/guides/express
- PostgreSQL Guide: https://docs.railway.com/guides/postgresql

---

**آخر تحديث**: Current session  
**الحالة**: ✅ جاهز للـ Deployment
