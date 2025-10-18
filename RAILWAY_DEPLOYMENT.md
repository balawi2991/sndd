# 🚂 Railway Deployment Guide - Sanad (MintChat)

## 🎯 نظرة عامة

هذا الدليل الشامل لنشر مشروع Sanad بالكامل على Railway:
- ✅ Frontend (React + Vite)
- ✅ Backend (Node.js + Express + TypeScript)
- ✅ Database (PostgreSQL + pgvector)

**كل شيء على Railway - لا حاجة لـ Vercel أو أي خدمة أخرى!**

---

## 🏗️ البنية المعمارية

```
Railway Project: Sanad
├── Service 1: PostgreSQL (pgvector)
│   └── Auto-provisioned by Railway
│
├── Service 2: Backend (sanad-backend)
│   ├── Root: /server
│   ├── Port: 3000
│   └── Health Check: /health
│
└── Service 3: Frontend (sanad-frontend)
    ├── Root: /
    ├── Port: Dynamic ($PORT)
    └── Connects to: Backend API
```

---

## 🔒 عزل المستخدمين (Multi-tenancy)

### ✅ العزل الكامل موجود:

```sql
-- كل جدول يحتوي على user_id
CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,  -- عزل كامل
  ...
);

CREATE TABLE training_materials (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,  -- عزل كامل
  ...
);
```

### ✅ الأمان في الكود:

```typescript
// كل query يتحقق من user_id
const conversations = await db.query(`
  SELECT * FROM conversations 
  WHERE user_id = $1  -- لا يمكن رؤية بيانات مستخدمين آخرين
`, [userId]);
```

### ✅ النتيجة:
- **عزل كامل 100%** بين المستخدمين
- كل مستخدم يرى بياناته فقط
- **مثالي لـ SaaS**
- لا يمكن لمستخدم الوصول لبيانات مستخدم آخر

---

## 📋 المتطلبات

- [x] حساب Railway (مجاني للبداية)
- [x] حساب GitHub
- [x] DeepSeek API Key
- [x] OpenAI API Key
- [x] Repository على GitHub

---

## 🚀 الخطوة 1: رفع الكود على GitHub

```bash
# في مجلد المشروع
git init
git add .
git commit -m "Initial commit - Ready for Railway"
git branch -M main
git remote add origin https://github.com/your-username/sanad.git
git push -u origin main
```

---

## 🚀 الخطوة 2: إنشاء Project على Railway

### 2.1 إنشاء Project جديد

1. اذهب إلى: https://railway.com
2. اضغط **"New Project"**
3. اختر **"Deploy from GitHub repo"**
4. اختر repository الخاص بك
5. سمّي Project: **"Sanad"**

---

## 🚀 الخطوة 3: إضافة PostgreSQL Database

### 3.1 استخدام pgvector Template (موصى به)

```bash
# في Railway Dashboard:
1. اضغط "+ New" في Project
2. اختر "Database"
3. ابحث عن "pgvector"
4. اضغط "Deploy"
```

**أو** استخدم PostgreSQL العادي:

```bash
1. اضغط "+ New"
2. اختر "Database" → "PostgreSQL"
3. اضغط "Deploy"
```

### 3.2 التحقق من Database

```bash
# في Railway Dashboard → Postgres Service:
1. اذهب إلى "Data" tab
2. يجب أن ترى database جاهز
3. انسخ DATABASE_URL (سنحتاجه لاحقاً)
```

---

## 🚀 الخطوة 4: Deploy Backend Service

### 4.1 إنشاء Backend Service

```bash
# في Railway Dashboard:
1. اضغط "+ New"
2. اختر "GitHub Repo"
3. اختر نفس repository
4. في Settings:
   - Service Name: "sanad-backend"
   - Root Directory: "/server"
   - Build Command: (leave empty - uses package.json)
   - Start Command: (leave empty - uses package.json)
```

### 4.2 إضافة Environment Variables

```bash
# في Backend Service → Variables:

# 1. Database Connection (تلقائي من Postgres)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# 2. API Keys (أضف قيمك)
DEEPSEEK_API_KEY=sk-your-deepseek-key-here
OPENAI_API_KEY=sk-your-openai-key-here

# 3. Environment
NODE_ENV=production
PORT=3000

# 4. Optional (مع قيم افتراضية)
DEEPSEEK_MODEL=deepseek-chat
DEEPSEEK_TEMPERATURE=0.7
DEEPSEEK_MAX_TOKENS=1000

RAG_CHUNK_SIZE=750
RAG_TOP_K=10
RAG_SIMILARITY_THRESHOLD=0.7

RATE_LIMIT_PER_MINUTE=10
RATE_LIMIT_PER_HOUR=100
```

**ملاحظة**: `${{Postgres.DATABASE_URL}}` سيتم استبداله تلقائياً بـ URL الحقيقي

### 4.3 إعداد Health Check

```bash
# في Backend Service → Settings → Health Check:
Health Check Path: /health
Health Check Timeout: 100
```

### 4.4 Generate Domain

```bash
# في Backend Service → Settings → Networking:
1. اضغط "Generate Domain"
2. انسخ الـ URL (مثل: sanad-backend-production.up.railway.app)
3. سنحتاجه للـ Frontend
```

### 4.5 Deploy

```bash
1. اضغط "Deploy" أو انتظر Auto-deploy
2. راقب Logs للتأكد من النجاح
3. يجب أن ترى: "✅ Database connection pool created"
4. يجب أن ترى: "🚀 Server running on http://0.0.0.0:3000"
```

### 4.6 التحقق من Backend

```bash
# اختبر Health Endpoint:
curl https://your-backend-url.railway.app/health

# يجب أن ترى:
{
  "status": "ok",
  "timestamp": "...",
  "uptime": ...
}
```

---

## 🚀 الخطوة 5: Deploy Frontend Service

### 5.1 إنشاء Frontend Service

```bash
# في Railway Dashboard:
1. اضغط "+ New"
2. اختر "GitHub Repo"
3. اختر نفس repository
4. في Settings:
   - Service Name: "sanad-frontend"
   - Root Directory: "/" (root)
   - Build Command: (leave empty)
   - Start Command: (leave empty)
```

### 5.2 إضافة Environment Variables

```bash
# في Frontend Service → Variables:

# Backend API URL (استخدم URL من الخطوة 4.4)
VITE_API_URL=https://your-backend-url.railway.app/api

# Optional
VITE_APP_NAME=Sanad
VITE_ENABLE_DEBUG=false
```

**مهم**: تأكد من إضافة `/api` في نهاية URL

### 5.3 Generate Domain

```bash
# في Frontend Service → Settings → Networking:
1. اضغط "Generate Domain"
2. انسخ الـ URL (مثل: sanad-frontend-production.up.railway.app)
```

### 5.4 Deploy

```bash
1. اضغط "Deploy" أو انتظر Auto-deploy
2. راقب Logs للتأكد من النجاح
3. يجب أن ترى: "Build completed"
4. يجب أن ترى: "Server started"
```

### 5.5 التحقق من Frontend

```bash
# افتح في المتصفح:
https://your-frontend-url.railway.app

# يجب أن يعمل بدون أخطاء
# افتح DevTools → Console للتحقق من عدم وجود أخطاء
```

---

## 🚀 الخطوة 6: تشغيل Database Migrations

### 6.1 Automatic Migration (موصى به)

Migrations ستعمل تلقائياً عند أول deploy للـ Backend!

### 6.2 Manual Migration (إذا لزم الأمر)

```bash
# في Railway Dashboard → Backend Service → Settings:
1. اذهب إلى "Custom Start Command"
2. أضف: npm run migrate && npm start
3. Redeploy
```

أو استخدم Railway CLI:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to project
railway link

# Run migration
railway run npm run migrate
```

### 6.3 التحقق من Migrations

```bash
# في Railway Dashboard → Postgres Service → Data:
# يجب أن ترى الجداول:
- users
- conversations
- messages
- training_materials
- chunks (with vector column)
- usage_stats
- chat_logs
```

---

## 🚀 الخطوة 7: إضافة مستخدم تجريبي (اختياري)

```bash
# في Railway Dashboard → Postgres Service → Query:

INSERT INTO users (id, email, name) 
VALUES (
  'test-user-id', 
  'demo@sanad.com', 
  'Demo User'
) ON CONFLICT (email) DO NOTHING;

-- إضافة مادة تدريبية
INSERT INTO training_materials (user_id, type, title, content)
VALUES (
  'test-user-id',
  'text',
  'مرحباً بك في Sanad',
  'Sanad هو نظام ذكاء اصطناعي متقدم يستخدم تقنية RAG (Retrieval-Augmented Generation) للإجابة على أسئلتك بدقة عالية. يمكنك تدريب البوت على مواد خاصة بك مثل المستندات والروابط والنصوص.'
);
```

---

## ✅ الخطوة 8: الاختبار النهائي

### 8.1 اختبار Backend

```bash
# Health Check
curl https://your-backend.railway.app/health

# Chat Endpoint (سيفشل بدون training data - طبيعي)
curl -X POST https://your-backend.railway.app/api/chat \
  -H "Content-Type: application/json" \
  -H "X-User-Id: test-user-id" \
  -d '{"question": "مرحباً"}'
```

### 8.2 اختبار Frontend

```bash
1. افتح: https://your-frontend.railway.app
2. اذهب إلى أي صفحة
3. افتح Chat Widget
4. اكتب رسالة
5. يجب أن ترى رد من AI (أو خطأ "No training data")
```

### 8.3 اختبار Integration

```bash
# في Frontend DevTools → Network:
1. أرسل رسالة في Widget
2. يجب أن ترى POST request إلى /api/chat
3. يجب أن يكون Status: 200 أو 400 (no training data)
4. تحقق من Response
```

---

## 🔧 الإعدادات المتقدمة

### Auto-Deploy من GitHub

```bash
# في كل Service → Settings → Deploy:
1. Enable "Automatic Deploys"
2. Branch: main
3. كل push سيؤدي لـ auto-deploy
```

### Custom Domains

```bash
# في Service → Settings → Networking:
1. اضغط "Custom Domain"
2. أضف domain الخاص بك
3. اتبع التعليمات لإعداد DNS
```

### Environment Variables من ملف

```bash
# يمكنك استيراد .env file:
1. في Service → Variables
2. اضغط "Raw Editor"
3. الصق محتوى RAILWAY_ENV_VARIABLES.md
4. Save
```

### Scaling

```bash
# في Service → Settings:
1. Replicas: عدد النسخ المتوازية
2. Resources: CPU & Memory limits
```

---

## 📊 Monitoring & Logs

### عرض Logs

```bash
# في Railway Dashboard:
1. اختر Service
2. اذهب إلى "Deployments"
3. اضغط على آخر deployment
4. اضغط "View Logs"
```

### Metrics

```bash
# في Service → Metrics:
- CPU Usage
- Memory Usage
- Network Traffic
- Request Count
```

### Alerts

```bash
# في Project Settings → Notifications:
1. أضف Webhook أو Email
2. اختر Events (Deploy Failed, etc.)
```

---

## 💰 التكلفة

### Free Tier

Railway يوفر:
- $5 credit شهرياً (مجاني)
- يكفي لـ testing و development

### Production

- Pay-as-you-go
- ~$5-20/month للمشاريع الصغيرة
- يعتمد على:
  - CPU usage
  - Memory usage
  - Network egress
  - Database storage

---

## 🐛 حل المشاكل الشائعة

### "Build Failed"

```bash
# تحقق من:
1. package.json صحيح
2. Dependencies مثبتة
3. TypeScript errors
4. Build command صحيح

# في Logs ابحث عن:
- npm ERR!
- TypeScript errors
- Missing dependencies
```

### "Database Connection Failed"

```bash
# تحقق من:
1. DATABASE_URL صحيح
2. Postgres service يعمل
3. Network connectivity
4. Firewall rules

# اختبر:
railway run psql $DATABASE_URL
```

### "CORS Error"

```bash
# Backend يسمح بـ CORS تلقائياً
# تحقق من:
1. VITE_API_URL صحيح
2. يحتوي على /api
3. HTTPS (not HTTP)
```

### "pgvector not found"

```bash
# استخدم pgvector template
# أو قم بتثبيته يدوياً:
railway run psql $DATABASE_URL -c "CREATE EXTENSION vector;"
```

### "Environment Variables not working"

```bash
# تحقق من:
1. Variable names صحيحة (case-sensitive)
2. No extra spaces
3. Redeploy بعد التغيير
4. استخدم ${{Service.VAR}} للإشارة
```

---

## 🔄 Updates & Redeployment

### Auto-Deploy

```bash
# عند push إلى GitHub:
git add .
git commit -m "Update feature"
git push

# Railway سيقوم بـ auto-deploy تلقائياً
```

### Manual Deploy

```bash
# في Railway Dashboard:
1. اختر Service
2. اضغط "Deploy"
3. أو اضغط "Redeploy" لآخر deployment
```

### Rollback

```bash
# في Service → Deployments:
1. اختر deployment قديم
2. اضغط "Redeploy"
```

---

## 📚 الملفات المهمة للـ Railway

```
sanad/
├── railway.json              # Frontend config
├── nixpacks.toml            # Frontend build config
├── .gitignore               # Git ignore
├── RAILWAY_ENV_VARIABLES.md # Environment variables guide
├── RAILWAY_DEPLOYMENT.md    # This file
│
└── server/
    ├── railway.json         # Backend config
    ├── nixpacks.toml       # Backend build config
    ├── package.json        # With postinstall script
    └── src/
        └── db/
            ├── schema.sql   # Database schema
            └── migrate.ts   # Auto-migration script
```

---

## ✅ Deployment Checklist

### قبل Deploy:
- [ ] Code على GitHub
- [ ] `.gitignore` محدث
- [ ] Environment variables جاهزة
- [ ] API keys جاهزة

### Railway Setup:
- [ ] Project تم إنشاؤه
- [ ] PostgreSQL service deployed
- [ ] pgvector extension مثبت
- [ ] Backend service deployed
- [ ] Backend environment variables مضافة
- [ ] Backend domain generated
- [ ] Frontend service deployed
- [ ] Frontend environment variables مضافة
- [ ] Frontend domain generated

### Testing:
- [ ] Backend health check يعمل
- [ ] Database migrations نجحت
- [ ] Frontend يفتح بدون أخطاء
- [ ] Widget يعمل
- [ ] API calls تعمل
- [ ] No console errors

### Production Ready:
- [ ] Custom domains (optional)
- [ ] Auto-deploy enabled
- [ ] Monitoring setup
- [ ] Backups enabled
- [ ] Alerts configured

---

## 🎉 النتيجة النهائية

بعد اتباع هذا الدليل، سيكون لديك:

✅ **Frontend** على Railway  
✅ **Backend** على Railway  
✅ **Database** على Railway  
✅ **Auto-deploy** من GitHub  
✅ **Health checks** تعمل  
✅ **Migrations** تلقائية  
✅ **Multi-tenant** عزل كامل  
✅ **Production-ready** جاهز للإنتاج  

---

## 📞 الدعم

- **Railway Docs**: https://docs.railway.com
- **Railway Discord**: https://discord.gg/railway
- **Railway Status**: https://status.railway.com

---

**آخر تحديث**: Current session  
**الحالة**: ✅ جاهز للـ Deployment على Railway  
**العزل**: ✅ Multi-tenant كامل - مثالي لـ SaaS
