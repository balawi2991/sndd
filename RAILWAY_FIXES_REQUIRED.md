# 🚨 Railway Deployment - Critical Issues & Fixes

## ❌ المشاكل المكتشفة

### **1. مشكلة حرجة: package-lock.json مفقود** 🔴
**المشكلة:**
- لا يوجد `package-lock.json` في مجلد `server/`
- Railway يستخدم `npm ci` في nixpacks.toml
- `npm ci` يتطلب وجود `package-lock.json`

**التأثير:**
- ❌ Build سيفشل على Railway
- ❌ Error: "npm ci can only install with an existing package-lock.json"

**الحل المطلوب:**
```bash
cd server
npm install
# هذا سيُنشئ package-lock.json
```

---

### **2. مشكلة: مسارات الملفات في migrate.sh** 🟡
**المشكلة:**
- السكريبت يستخدم مسارات نسبية: `../src/db/schema.sql`
- قد لا تعمل على Railway

**الحل المطلوب:**
تحديث `server/scripts/migrate.sh`

---

### **3. مشكلة: Redis غير ضروري** 🟡
**المشكلة:**
- `.env.example` يحتوي على `REDIS_URL`
- لكن لا يوجد Redis في Railway بشكل افتراضي
- Rate limiting قد يفشل

**الحل:**
- إما إضافة Redis plugin في Railway
- أو تعطيل Redis في الكود

---

### **4. مشكلة: PORT Configuration** 🟢
**الحالة:** ✅ جيد
- الكود يستخدم `process.env.PORT || 3001`
- Railway سيوفر PORT تلقائياً

---

### **5. مشكلة: CORS Origin** 🟡
**المشكلة:**
- Default CORS: `http://localhost:5173`
- يجب تغييره للـ production domain

**الحل:**
```bash
# في Railway variables
CORS_ORIGIN=https://your-frontend-domain.com
```

---

## ✅ الحلول المطلوبة

### **Fix 1: إنشاء package-lock.json** 🔴 **حرج**

```bash
cd C:\Users\balaw_mce0m32\Downloads\sanad\server
npm install
git add package-lock.json
git commit -m "Add package-lock.json for Railway deployment"
git push origin main
```

---

### **Fix 2: تحديث migrate.sh**

سأقوم بإصلاحه الآن...

---

### **Fix 3: جعل Redis اختياري**

سأقوم بتحديث الكود...

---

### **Fix 4: تحديث nixpacks.toml**

قد نحتاج لتغيير من `npm ci` إلى `npm install` إذا كان هناك مشاكل.

---

## 📋 Checklist قبل Railway Deploy

### **Critical (يجب إصلاحها)**
- [ ] 🔴 إنشاء `server/package-lock.json`
- [ ] 🔴 تحديث `migrate.sh` paths
- [ ] 🔴 جعل Redis optional في الكود

### **Important (يجب ضبطها)**
- [ ] 🟡 إضافة PostgreSQL في Railway
- [ ] 🟡 Install pgvector extension
- [ ] 🟡 Set environment variables
- [ ] 🟡 Run migrations
- [ ] 🟡 Configure CORS_ORIGIN

### **Optional (اختياري)**
- [ ] 🟢 إضافة Redis plugin (للـ rate limiting)
- [ ] 🟢 Configure custom domain
- [ ] 🟢 Setup monitoring

---

## 🔧 الخطوات المطلوبة يدوياً

### **1. قبل Deploy (على جهازك)**

```bash
# Step 1: إنشاء package-lock.json
cd C:\Users\balaw_mce0m32\Downloads\sanad\server
npm install

# Step 2: Commit & Push
cd ..
git add server/package-lock.json
git commit -m "Add package-lock.json"
git push origin main
```

### **2. في Railway Dashboard**

#### **A. Create Project**
1. اذهب إلى https://railway.app/dashboard
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose: `balawi2991/sanaad`
5. Select branch: `main`
6. **Root Directory**: `server` ⚠️ **مهم جداً**

#### **B. Add PostgreSQL**
1. في Project dashboard
2. Click "New" → "Database" → "PostgreSQL"
3. Wait for provisioning

#### **C. Install pgvector**
```bash
# في Railway dashboard
# Click on PostgreSQL service
# Go to "Connect" tab
# Click "psql" or use Railway CLI:

railway run psql $DATABASE_URL

# في psql prompt:
CREATE EXTENSION IF NOT EXISTS vector;
\dx vector
\q
```

#### **D. Set Environment Variables**
في Project Settings → Variables:

```env
# Required
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxx
OPENAI_API_KEY=sk-xxxxxxxxxxxxx
JWT_SECRET=your-super-secret-key-minimum-32-characters-long
NODE_ENV=production

# Optional but recommended
CORS_ORIGIN=https://your-frontend-domain.com
RATE_LIMIT_PER_MINUTE=10
RATE_LIMIT_PER_HOUR=100
RATE_LIMIT_PER_DAY=500
```

**ملاحظة:** `DATABASE_URL` سيتم إضافته تلقائياً من PostgreSQL service.

#### **E. Run Migrations**
```bash
# Option 1: Railway CLI
railway run bash
cd scripts
chmod +x migrate.sh
./migrate.sh

# Option 2: Direct psql
railway run psql $DATABASE_URL < src/db/schema.sql
railway run psql $DATABASE_URL < src/db/schema-updates.sql
```

#### **F. Deploy**
- Railway سيبدأ deployment تلقائياً
- Monitor logs في "Deployments" tab

---

## 🔍 Verification Steps

### **بعد Deploy:**

1. **Check Build Logs**
```
✅ npm install completed
✅ npm run build completed
✅ TypeScript compiled
✅ dist/ folder created
```

2. **Check Runtime Logs**
```
✅ Server running on http://0.0.0.0:PORT
✅ Environment: production
✅ CORS enabled for: ...
✅ No database errors
```

3. **Test Health Endpoint**
```bash
curl https://your-app.railway.app/health
```

Expected:
```json
{
  "status": "ok",
  "timestamp": "...",
  "uptime": 123
}
```

4. **Test Database Connection**
```bash
railway run psql $DATABASE_URL -c "SELECT COUNT(*) FROM users;"
```

---

## 🐛 مشاكل محتملة وحلولها

### **Problem: Build fails with "npm ci requires package-lock.json"**
**Solution:** 
```bash
cd server
npm install
git add package-lock.json
git commit -m "Add package-lock.json"
git push
```

### **Problem: "Cannot find module 'express'"**
**Solution:**
- Check package.json dependencies
- Ensure `npm install` ran successfully
- Check build logs

### **Problem: "Database connection failed"**
**Solution:**
- Verify PostgreSQL service is running
- Check DATABASE_URL is set
- Ensure database is linked to backend service

### **Problem: "pgvector extension not found"**
**Solution:**
```bash
railway run psql $DATABASE_URL
CREATE EXTENSION vector;
```

### **Problem: "CORS error"**
**Solution:**
```bash
railway variables set CORS_ORIGIN=https://your-domain.com
```

### **Problem: "Redis connection failed"**
**Solution:**
- Add Redis plugin in Railway
- Or make Redis optional in code (سأقوم بهذا)

---

## 📊 التكلفة المتوقعة

### **Free Tier**
- $5 credit/month
- Shared resources
- Good for testing

### **Hobby ($5/month)**
- $5 credit + $5/month
- Better performance
- Recommended for production

### **Resources Needed**
- Backend service: ~$5-10/month
- PostgreSQL: ~$5/month
- Redis (optional): ~$5/month

**Total**: $10-20/month

---

## ⚠️ تحذيرات مهمة

### **قبل Deploy:**
1. ✅ تأكد من وجود `package-lock.json`
2. ✅ تأكد من API keys جاهزة
3. ✅ تأكد من JWT secret قوي (32+ chars)
4. ✅ Backup أي data مهم

### **بعد Deploy:**
1. ✅ غيّر demo API keys
2. ✅ Monitor logs لأول 24 ساعة
3. ✅ Test all endpoints
4. ✅ Setup alerts

---

## 🎯 الخطوات التالية

### **الآن (Critical):**
1. إنشاء `package-lock.json`
2. تحديث `migrate.sh`
3. جعل Redis optional
4. Push التغييرات

### **ثم (Deploy):**
1. Create Railway project
2. Add PostgreSQL
3. Install pgvector
4. Set environment variables
5. Run migrations
6. Deploy!

---

**Status**: 🔴 **Not Ready - Fixes Required**

**Next**: Fix critical issues then deploy
