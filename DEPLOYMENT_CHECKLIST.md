# ✅ Railway Deployment Checklist

استخدم هذا الـ Checklist قبل وأثناء deployment على Railway.

---

## 📋 Pre-Deployment

### Code Quality
- [ ] لا توجد console.errors
- [ ] لا توجد TypeScript errors
- [ ] Code formatted ونظيف
- [ ] .env files لا تُرفع على Git
- [ ] .gitignore محدث

### Environment Variables
- [ ] `server/.env.example` محدث
- [ ] `server/.env.production.example` موجود
- [ ] جميع المتغيرات موثقة
- [ ] لا توجد secrets في الكود

### Database
- [ ] Schema tested محلياً
- [ ] Migrations تعمل
- [ ] Indexes optimized
- [ ] pgvector extension tested

### API Keys
- [ ] DeepSeek API Key جاهز
- [ ] OpenAI API Key جاهز
- [ ] Keys tested محلياً

---

## 🚂 Railway Setup

### 1. Create Project
- [ ] سجل دخول على [Railway](https://railway.app)
- [ ] أنشئ Project جديد
- [ ] اربطه بـ GitHub repo

### 2. Add PostgreSQL
- [ ] أضف PostgreSQL service
- [ ] انتظر حتى يكتمل التثبيت
- [ ] احفظ DATABASE_URL

### 3. Install pgvector
```sql
-- في Railway PostgreSQL Console
CREATE EXTENSION vector;
```
- [ ] pgvector extension مثبت

### 4. Configure Environment Variables

في Railway Project → Settings → Variables:

#### Required
- [ ] `NODE_ENV=production`
- [ ] `PORT=3001`
- [ ] `DEEPSEEK_API_KEY=sk-xxxxx`
- [ ] `OPENAI_API_KEY=sk-xxxxx`
- [ ] `DATABASE_URL=${{Postgres.DATABASE_URL}}`
- [ ] `CORS_ORIGIN=https://your-frontend.vercel.app`

#### Optional
- [ ] `RATE_LIMIT_PER_MINUTE=10`
- [ ] `RATE_LIMIT_PER_HOUR=100`
- [ ] `RATE_LIMIT_PER_DAY=500`
- [ ] `RAG_CHUNK_SIZE=750`
- [ ] `RAG_CHUNK_OVERLAP=100`
- [ ] `RAG_TOP_K=10`
- [ ] `RAG_RERANK_TOP=3`
- [ ] `RAG_SIMILARITY_THRESHOLD=0.7`

---

## 🏗️ Build & Deploy

### Initial Deployment
- [ ] Push code إلى GitHub
- [ ] Railway يبدأ build تلقائياً
- [ ] انتظر حتى ينتهي build (3-5 دقائق)
- [ ] تحقق من logs

### Run Migrations
في Railway Console:
```bash
npm run db:migrate
```
- [ ] Migrations نجحت
- [ ] Tables created
- [ ] Extensions installed

### Add Demo Data (Optional)
```bash
npm run db:seed
npm run db:index
```
- [ ] Demo data added
- [ ] Materials indexed

---

## 🧪 Testing

### Health Check
```bash
curl https://your-app.railway.app/health
```
- [ ] يرجع `{"status":"ok"}`

### API Endpoints
```bash
# Test chat endpoint
curl -X POST https://your-app.railway.app/api/chat \
  -H "Content-Type: application/json" \
  -H "X-User-Id: demo-user-id" \
  -d '{"question": "مرحبا"}'
```
- [ ] Chat endpoint يعمل
- [ ] يرجع response صحيح

### Database Connection
- [ ] Backend يتصل بـ Database
- [ ] لا توجد connection errors في logs

---

## 🌐 Frontend Deployment

### Vercel (موصى به)

#### 1. Deploy
```bash
npm i -g vercel
vercel
```

#### 2. Environment Variables
في Vercel Dashboard:
- [ ] `VITE_API_URL=https://your-backend.railway.app/api`

#### 3. Deploy
```bash
vercel --prod
```

### Test Integration
- [ ] Frontend يتصل بـ Backend
- [ ] Chat widget يعمل
- [ ] لا توجد CORS errors

---

## 🔒 Security

### SSL/HTTPS
- [ ] Railway يوفر SSL تلقائياً
- [ ] Vercel يوفر SSL تلقائياً
- [ ] جميع الـ URLs تستخدم HTTPS

### Environment Variables
- [ ] API keys محفوظة في Railway
- [ ] لا توجد secrets في Git
- [ ] .env في .gitignore

### CORS
- [ ] CORS_ORIGIN مضبوط صحيح
- [ ] Frontend domain مسموح
- [ ] لا توجد CORS errors

### Rate Limiting
- [ ] Rate limiting مفعل
- [ ] Limits معقولة

---

## 📊 Monitoring

### Railway Dashboard
- [ ] راقب CPU usage
- [ ] راقب Memory usage
- [ ] راقب Network traffic
- [ ] راقب Logs

### Error Tracking (Optional)
```bash
# Add Sentry
npm install @sentry/node
```
- [ ] Sentry configured
- [ ] Errors tracked

---

## 🔄 Post-Deployment

### Immediate
- [ ] اختبر جميع الـ endpoints
- [ ] اختبر Chat widget
- [ ] تحقق من Logs
- [ ] راقب Performance

### Within 24 Hours
- [ ] راقب Error rates
- [ ] تحقق من Response times
- [ ] راقب Database performance
- [ ] اختبر مع مستخدمين حقيقيين

### Within Week
- [ ] راجع Usage metrics
- [ ] راجع Costs
- [ ] Optimize إذا لزم الأمر
- [ ] Add monitoring alerts

---

## 💰 Cost Monitoring

### Railway
- [ ] راقب Monthly usage
- [ ] تحقق من Billing
- [ ] Upgrade plan إذا لزم

### API Costs
- [ ] راقب DeepSeek usage
- [ ] راقب OpenAI usage
- [ ] تحقق من Billing

---

## 🐛 Troubleshooting

### Build Fails
```bash
# تحقق من:
- package.json scripts صحيحة
- Dependencies مثبتة
- TypeScript config صحيح
- Build command صحيح في railway.json
```

### Database Connection Fails
```bash
# تحقق من:
- DATABASE_URL صحيح
- pgvector extension مثبت
- SSL config صحيح
- Migrations ran successfully
```

### CORS Errors
```bash
# تحقق من:
- CORS_ORIGIN يطابق frontend URL
- HTTPS used في production
- credentials: true إذا لزم
```

### High Costs
```bash
# راجع:
- Rate limiting settings
- API usage patterns
- Database queries optimization
- Caching strategy
```

---

## 📝 Rollback Plan

### If Deployment Fails
1. [ ] راجع Logs
2. [ ] حدد المشكلة
3. [ ] Fix في local
4. [ ] Test محلياً
5. [ ] Push fix
6. [ ] Redeploy

### If Critical Bug
1. [ ] Rollback إلى previous deployment
2. [ ] Fix bug محلياً
3. [ ] Test thoroughly
4. [ ] Redeploy

---

## ✅ Success Criteria

- [ ] Backend deployed ويعمل
- [ ] Frontend deployed ويعمل
- [ ] Database connected
- [ ] Chat widget functional
- [ ] No errors في logs
- [ ] Response times < 3s
- [ ] SSL/HTTPS working
- [ ] Monitoring active

---

## 🎉 Post-Launch

### Immediate
- [ ] أعلن عن Launch
- [ ] شارك مع Users
- [ ] اجمع Feedback

### Ongoing
- [ ] راقب Performance
- [ ] راقب Errors
- [ ] راقب Costs
- [ ] Update documentation

---

## 📞 Support

إذا واجهت مشاكل:
1. راجع [`RAILWAY_DEPLOYMENT.md`](./RAILWAY_DEPLOYMENT.md)
2. تحقق من Railway Logs
3. راجع Railway Docs
4. افتح GitHub Issue

---

**آخر تحديث**: الجلسة الحالية

**الحالة**: ✅ جاهز للـ Deployment!
