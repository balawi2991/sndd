# ✅ Railway Deployment Checklist

## 📋 قبل البدء

### المتطلبات الأساسية
- [ ] حساب Railway (https://railway.app)
- [ ] حساب GitHub
- [ ] DeepSeek API Key (https://platform.deepseek.com/api_keys)
- [ ] OpenAI API Key (https://platform.openai.com/api-keys)
- [ ] الكود على GitHub repository

---

## 🚀 خطوات الـ Deployment

### 1. إعداد Repository
- [ ] الكود تم رفعه على GitHub
- [ ] `.gitignore` محدث (لا يحتوي على `.env`)
- [ ] `railway.json` موجود في root
- [ ] `server/railway.json` موجود
- [ ] `nixpacks.toml` موجود في كلا المكانين

### 2. إنشاء Railway Project
- [ ] Project جديد تم إنشاؤه
- [ ] Project name: "Sanad" (أو أي اسم تريده)
- [ ] Repository متصل بـ Railway

### 3. PostgreSQL Database
- [ ] PostgreSQL service تم إضافته
- [ ] استخدام pgvector template (موصى به)
- [ ] Database deployed successfully
- [ ] DATABASE_URL متاح

### 4. Backend Service
- [ ] Service تم إنشاؤه من GitHub repo
- [ ] Root Directory: `/server`
- [ ] Service Name: `sanad-backend`

#### Environment Variables (Backend):
- [ ] `DATABASE_URL=${{Postgres.DATABASE_URL}}`
- [ ] `DEEPSEEK_API_KEY=sk-...` (قيمتك)
- [ ] `OPENAI_API_KEY=sk-...` (قيمتك)
- [ ] `NODE_ENV=production`
- [ ] `PORT=3000`

#### Backend Settings:
- [ ] Health Check Path: `/health`
- [ ] Health Check Timeout: `100`
- [ ] Domain generated
- [ ] Deployment successful

### 5. Frontend Service
- [ ] Service تم إنشاؤه من نفس GitHub repo
- [ ] Root Directory: `/` (root)
- [ ] Service Name: `sanad-frontend`

#### Environment Variables (Frontend):
- [ ] `VITE_API_URL=https://your-backend-url.railway.app/api`

#### Frontend Settings:
- [ ] Domain generated
- [ ] Deployment successful

### 6. Database Migrations
- [ ] Migrations تمت تلقائياً (تحقق من Backend logs)
- [ ] أو تم تشغيلها يدوياً
- [ ] Tables موجودة في Database

### 7. Testing
- [ ] Backend health check يعمل: `curl https://backend-url/health`
- [ ] Frontend يفتح بدون أخطاء
- [ ] Widget يظهر
- [ ] يمكن كتابة رسائل
- [ ] API calls تعمل (تحقق من Network tab)

---

## 🔍 التحقق من النجاح

### Backend Health Check
```bash
curl https://your-backend.railway.app/health

# Expected response:
{
  "status": "ok",
  "timestamp": "...",
  "uptime": ...
}
```

### Database Tables
في Railway Dashboard → Postgres → Data:
- [ ] `users` table موجود
- [ ] `conversations` table موجود
- [ ] `messages` table موجود
- [ ] `training_materials` table موجود
- [ ] `chunks` table موجود (مع vector column)
- [ ] `usage_stats` table موجود
- [ ] `chat_logs` table موجود

### Frontend
- [ ] الصفحة الرئيسية تفتح
- [ ] Dashboard يعمل
- [ ] Widget يظهر ويعمل
- [ ] لا توجد أخطاء في Console

### Integration
- [ ] Frontend يتصل بـ Backend
- [ ] API calls ناجحة
- [ ] Error handling يعمل
- [ ] Loading states تعمل

---

## 🐛 حل المشاكل

### إذا فشل Backend Deployment:
1. تحقق من Logs في Railway
2. تأكد من Environment Variables صحيحة
3. تأكد من DATABASE_URL متصل
4. تأكد من package.json صحيح

### إذا فشل Frontend Deployment:
1. تحقق من Logs
2. تأكد من VITE_API_URL صحيح
3. تأكد من Build command يعمل
4. تحقق من TypeScript errors

### إذا فشلت Migrations:
1. تحقق من DATABASE_URL
2. تحقق من pgvector extension مثبت
3. شغل migrations يدوياً: `railway run npm run migrate`

### إذا كان Widget لا يعمل:
1. تحقق من VITE_API_URL صحيح
2. تحقق من CORS settings
3. تحقق من Network tab للأخطاء
4. تأكد من Backend يعمل

---

## 📊 Post-Deployment

### إعدادات إضافية (اختيارية):
- [ ] Custom domain للـ Frontend
- [ ] Custom domain للـ Backend
- [ ] Auto-deploy enabled
- [ ] Monitoring setup
- [ ] Backups enabled
- [ ] Alerts configured

### إضافة بيانات تجريبية:
- [ ] مستخدم تجريبي تم إضافته
- [ ] مادة تدريبية تم إضافتها
- [ ] Material تم فهرسته

---

## 🎯 النتيجة النهائية

عند اكتمال جميع الخطوات:

✅ **3 Services على Railway**:
1. PostgreSQL (pgvector)
2. Backend (Express + TypeScript)
3. Frontend (React + Vite)

✅ **URLs**:
- Frontend: `https://sanad-frontend-xxx.railway.app`
- Backend: `https://sanad-backend-xxx.railway.app`
- Backend API: `https://sanad-backend-xxx.railway.app/api`

✅ **Features Working**:
- Chat Widget
- AI Responses (DeepSeek)
- RAG Pipeline
- Vector Search
- Conversation Persistence
- Multi-tenant Isolation

---

## 📝 ملاحظات مهمة

### Environment Variables
- استخدم `${{Service.VARIABLE}}` للإشارة بين Services
- مثال: `DATABASE_URL=${{Postgres.DATABASE_URL}}`
- Variables case-sensitive

### Root Directory
- Backend: `/server`
- Frontend: `/` (root)
- مهم جداً تحديدها بشكل صحيح!

### Build Commands
- Railway يستخدم `package.json` scripts تلقائياً
- لا حاجة لتحديد build command يدوياً
- `postinstall` script سيعمل تلقائياً

### Migrations
- تعمل تلقائياً عند أول deploy
- إذا فشلت، شغلها يدوياً
- تحقق من Logs للتأكد

---

## 🔄 Updates & Maintenance

### لتحديث الكود:
```bash
git add .
git commit -m "Update feature"
git push
# Railway سيقوم بـ auto-deploy تلقائياً
```

### لإعادة Deploy:
- في Railway Dashboard → Service → Deploy
- أو Redeploy من Deployments list

### للـ Rollback:
- في Deployments → اختر deployment قديم → Redeploy

---

## 💰 التكلفة المتوقعة

### Free Tier
- $5 credit شهرياً (مجاني)
- يكفي لـ testing

### Production
- ~$5-20/month للمشاريع الصغيرة
- يعتمد على:
  - CPU usage
  - Memory usage
  - Network egress
  - Database storage

---

## 📞 الدعم

إذا واجهت مشاكل:
1. راجع `RAILWAY_DEPLOYMENT.md`
2. تحقق من Logs في Railway
3. راجع `RAILWAY_ENV_VARIABLES.md`
4. Railway Discord: https://discord.gg/railway

---

## ✅ Final Check

قبل اعتبار Deployment ناجح:

- [ ] Backend health check: ✅
- [ ] Frontend loads: ✅
- [ ] Database connected: ✅
- [ ] Migrations ran: ✅
- [ ] Widget works: ✅
- [ ] API calls work: ✅
- [ ] No console errors: ✅
- [ ] Multi-tenant isolation: ✅

**إذا كل شيء ✅ - مبروك! 🎉**

**المشروع جاهز للإنتاج! 🚀**

---

**آخر تحديث**: Current session  
**الحالة**: ✅ Checklist جاهز
