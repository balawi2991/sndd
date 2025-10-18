# 🚂 Railway Deployment Guide

> **ملاحظة**: هذا الدليل للمستقبل. تأكد من أن كل شيء يعمل محلياً أولاً!

---

## نظرة عامة

Railway هو منصة deployment سهلة تدعم:
- ✅ PostgreSQL مع pgvector
- ✅ Automatic deployments من GitHub
- ✅ Environment variables
- ✅ Custom domains
- ✅ Auto-scaling

---

## المتطلبات الأساسية

1. ✅ حساب على [Railway](https://railway.app)
2. ✅ حساب GitHub
3. ✅ المشروع يعمل محلياً بنجاح
4. ✅ API Keys جاهزة

---

## الخطوة 1: إعداد المشروع لـ Railway

### 1. إضافة Procfile
```bash
# في المجلد الرئيسي
echo "web: cd server && npm start" > Procfile
```

### 2. إضافة railway.json
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd server && npm install && npm run build"
  },
  "deploy": {
    "startCommand": "cd server && npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 3. تحديث package.json
تأكد من وجود:
```json
{
  "engines": {
    "node": ">=18.0.0"
  },
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

---

## الخطوة 2: إنشاء Project على Railway

### 1. إنشاء Project جديد
```
1. اذهب إلى railway.app
2. اضغط "New Project"
3. اختر "Deploy from GitHub repo"
4. اختر repository الخاص بك
```

### 2. إضافة PostgreSQL Service
```
1. في Project، اضغط "+ New"
2. اختر "Database"
3. اختر "PostgreSQL"
4. انتظر حتى يتم التثبيت
```

### 3. تثبيت pgvector Extension
```bash
# في Railway PostgreSQL Console:
CREATE EXTENSION vector;
```

---

## الخطوة 3: إعداد Environment Variables

في Railway Project Settings → Variables:

### Backend Variables
```env
# Node
NODE_ENV=production
PORT=3001

# DeepSeek
DEEPSEEK_API_KEY=sk-xxxxx
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
DEEPSEEK_MODEL=deepseek-chat
DEEPSEEK_TEMPERATURE=0.7
DEEPSEEK_MAX_TOKENS=1000
DEEPSEEK_TIMEOUT=30000

# Database (Railway يوفرها تلقائياً)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# OpenAI
OPENAI_API_KEY=sk-xxxxx

# CORS (استخدم domain الخاص بك)
CORS_ORIGIN=https://your-frontend-domain.com

# Rate Limiting
RATE_LIMIT_PER_MINUTE=10
RATE_LIMIT_PER_HOUR=100
RATE_LIMIT_PER_DAY=500

# RAG
RAG_CHUNK_SIZE=750
RAG_CHUNK_OVERLAP=100
RAG_TOP_K=10
RAG_RERANK_TOP=3
RAG_SIMILARITY_THRESHOLD=0.7
```

---

## الخطوة 4: Deploy Backend

### 1. Automatic Deployment
```
Railway سيقوم بـ deploy تلقائياً عند push إلى GitHub
```

### 2. Manual Deployment
```
1. في Railway Dashboard
2. اضغط "Deploy"
3. انتظر حتى ينتهي Build
```

### 3. تشغيل Database Setup
```bash
# في Railway Console:
npm run db:setup
npm run db:seed
npm run db:index
```

---

## الخطوة 5: Deploy Frontend

### Option 1: Vercel (موصى به)
```bash
# تثبيت Vercel CLI
npm i -g vercel

# Deploy
vercel

# إضافة Environment Variable
vercel env add VITE_API_URL
# القيمة: https://your-railway-backend.railway.app/api
```

### Option 2: Netlify
```bash
# تثبيت Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# إضافة Environment Variable في Netlify Dashboard
```

### Option 3: Railway (Frontend أيضاً)
```
1. أنشئ Service جديد في نفس Project
2. اربطه بـ GitHub repo
3. أضف Environment Variables
4. Deploy
```

---

## الخطوة 6: إعداد Custom Domain (اختياري)

### Backend Domain
```
1. في Railway Service Settings
2. اذهب إلى "Domains"
3. أضف custom domain
4. أضف DNS records في domain provider
```

### Frontend Domain
```
# في Vercel/Netlify
1. اذهب إلى Domains
2. أضف custom domain
3. أضف DNS records
```

---

## الخطوة 7: Database Migrations

### إنشاء Migration Script
```javascript
// server/scripts/migrate.js
const { Client } = require('pg');
const fs = require('fs');

async function migrate() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  
  // Run migrations
  const schema = fs.readFileSync('./src/db/schema.sql', 'utf8');
  await client.query(schema);
  
  await client.end();
  console.log('Migration completed');
}

migrate();
```

### تشغيل Migrations
```bash
# في Railway Console
npm run migrate
```

---

## الخطوة 8: Monitoring & Logs

### Railway Logs
```
1. في Railway Dashboard
2. اذهب إلى Service
3. اضغط "Logs"
4. راقب errors و performance
```

### إضافة Monitoring (اختياري)
```bash
# Sentry for error tracking
npm install @sentry/node

# في server/src/index.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});
```

---

## الخطوة 9: Performance Optimization

### 1. Database Connection Pooling
```typescript
// في db/client.ts
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Railway limit
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false
});
```

### 2. Caching (Redis)
```
1. في Railway، أضف Redis service
2. أضف REDIS_URL environment variable
3. استخدم Redis للـ caching
```

### 3. CDN للـ Static Files
```
استخدم Vercel/Netlify CDN للـ frontend assets
```

---

## الخطوة 10: Security

### 1. Environment Variables
```
✅ لا تضع API keys في الكود
✅ استخدم Railway Environment Variables
✅ استخدم secrets management
```

### 2. CORS
```typescript
// تحديد domains المسموحة فقط
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
```

### 3. Rate Limiting
```typescript
// موجود بالفعل في middleware/rateLimiter.ts
```

### 4. SSL/HTTPS
```
✅ Railway يوفر SSL تلقائياً
✅ Vercel/Netlify يوفرون SSL تلقائياً
```

---

## الخطوة 11: Backup Strategy

### Database Backups
```bash
# Railway يوفر automatic backups
# أو استخدم pg_dump:
pg_dump $DATABASE_URL > backup.sql
```

### File Storage Backups
```bash
# إذا كنت تستخدم Railway Volumes
# أو استخدم S3 للـ file storage
```

---

## الخطوة 12: CI/CD Pipeline

### GitHub Actions (اختياري)
```yaml
# .github/workflows/deploy.yml
name: Deploy to Railway

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install Railway CLI
        run: npm i -g @railway/cli
      
      - name: Deploy
        run: railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

---

## 🎯 Checklist قبل Production

- [ ] كل شيء يعمل محلياً
- [ ] Tests تمر بنجاح
- [ ] Environment variables محددة
- [ ] Database migrations جاهزة
- [ ] Monitoring مفعل
- [ ] Backups مجدولة
- [ ] SSL/HTTPS مفعل
- [ ] Custom domains مضبوطة
- [ ] Error handling شامل
- [ ] Rate limiting مفعل
- [ ] Security headers مضبوطة

---

## 💰 التكلفة المتوقعة

### Railway
- **Hobby Plan**: $5/month
  - 500 hours execution time
  - 512MB RAM
  - 1GB storage

- **Developer Plan**: $20/month
  - Unlimited execution time
  - 8GB RAM
  - 100GB storage

### Vercel (Frontend)
- **Free**: مناسب للبداية
- **Pro**: $20/month للمشاريع الكبيرة

### API Costs
- **DeepSeek**: ~$0.14 per 1M tokens
- **OpenAI Embeddings**: ~$0.10 per 1M tokens

---

## 🐛 Troubleshooting

### "Build failed"
```bash
# تحقق من:
1. package.json scripts صحيحة
2. Dependencies مثبتة
3. TypeScript يعمل
4. Build command صحيح
```

### "Database connection failed"
```bash
# تحقق من:
1. DATABASE_URL صحيح
2. pgvector extension مثبت
3. SSL settings صحيحة
```

### "CORS error"
```bash
# تحقق من:
1. CORS_ORIGIN يطابق frontend URL
2. credentials: true إذا كنت تستخدم cookies
```

---

## 📚 Resources

- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)
- [PostgreSQL on Railway](https://docs.railway.app/databases/postgresql)
- [pgvector](https://github.com/pgvector/pgvector)

---

## 🎉 بعد Deployment الناجح

1. ✅ اختبر كل الـ endpoints
2. ✅ اختبر الـ Widget في موقع حقيقي
3. ✅ راقب Logs لأول 24 ساعة
4. ✅ اختبر Performance
5. ✅ شارك مع المستخدمين!

---

**ملاحظة**: هذا دليل للمستقبل. ركز على التشغيل المحلي أولاً!

**الحالة**: 📝 جاهز للاستخدام عند الحاجة

**آخر تحديث**: الجلسة الحالية
