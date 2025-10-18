# 🚂 Railway Deployment - Complete Guide

## ✅ تم إصلاح جميع المشاكل!

### **الإصلاحات المطبقة:**
- ✅ تم إنشاء `package-lock.json`
- ✅ تم تحديث `migrate.sh` paths
- ✅ Redis غير مستخدم (لا مشكلة)
- ✅ جميع الملفات جاهزة

---

## 📋 المتطلبات قبل البدء

### **1. API Keys (يجب الحصول عليها)**
- [ ] **DeepSeek API Key** من https://platform.deepseek.com
- [ ] **OpenAI API Key** من https://platform.openai.com
- [ ] **JWT Secret** (أي string عشوائي 32+ حرف)

### **2. Railway Account**
- [ ] حساب على https://railway.app
- [ ] GitHub متصل بـ Railway

### **3. Git Repository**
- [x] ✅ الكود على GitHub: https://github.com/balawi2991/sanaad
- [x] ✅ جميع الملفات committed

---

## 🚀 خطوات الـ Deployment

### **Step 1: Push التحديثات الأخيرة**

```bash
cd C:\Users\balaw_mce0m32\Downloads\sanad

# Add files
git add server/package-lock.json
git add server/scripts/migrate.sh
git add RAILWAY_FIXES_REQUIRED.md
git add RAILWAY_DEPLOY_GUIDE.md

# Commit
git commit -m "Fix: Add package-lock.json and update migrate.sh for Railway"

# Push
git push origin main
```

---

### **Step 2: Create Railway Project**

1. اذهب إلى https://railway.app/dashboard
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose repository: **`balawi2991/sanaad`**
5. Select branch: **`main`**
6. ⚠️ **مهم جداً**: Set **Root Directory** to **`server`**

**Screenshot:**
```
┌─────────────────────────────────┐
│ Root Directory: server          │  ← اكتب هنا
└─────────────────────────────────┘
```

7. Click **"Deploy"**

---

### **Step 3: Add PostgreSQL Database**

1. في Project dashboard
2. Click **"New"** button
3. Select **"Database"**
4. Choose **"PostgreSQL"**
5. Wait 1-2 minutes for provisioning
6. ✅ `DATABASE_URL` سيتم إضافته تلقائياً

---

### **Step 4: Install pgvector Extension**

#### **Option A: Using Railway Dashboard**
1. Click on **PostgreSQL** service
2. Go to **"Connect"** tab
3. Click **"psql"** button
4. في terminal:
```sql
CREATE EXTENSION IF NOT EXISTS vector;

-- Verify
\dx vector

-- Exit
\q
```

#### **Option B: Using Railway CLI**
```bash
# Install CLI if not installed
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# Connect to database
railway run psql $DATABASE_URL

# Then run:
CREATE EXTENSION vector;
\dx vector
\q
```

---

### **Step 5: Set Environment Variables**

في Railway Dashboard:
1. Click on **Backend Service** (not PostgreSQL)
2. Go to **"Variables"** tab
3. Click **"New Variable"**
4. Add the following:

#### **Required Variables:**
```env
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxx
JWT_SECRET=your-super-secret-key-minimum-32-characters-long-random-string
NODE_ENV=production
```

#### **Optional but Recommended:**
```env
CORS_ORIGIN=https://your-frontend-domain.com
RATE_LIMIT_PER_MINUTE=10
RATE_LIMIT_PER_HOUR=100
RATE_LIMIT_PER_DAY=500
```

**ملاحظات:**
- ❌ **لا تضيف** `DATABASE_URL` - سيتم إضافته تلقائياً
- ❌ **لا تضيف** `PORT` - Railway يوفره تلقائياً
- ✅ **JWT_SECRET** يجب أن يكون 32+ حرف عشوائي

**مثال JWT_SECRET:**
```
jwt_secret_2024_sanad_production_a1b2c3d4e5f6g7h8i9j0
```

---

### **Step 6: Wait for Deployment**

1. Railway سيبدأ build تلقائياً
2. Monitor في **"Deployments"** tab
3. انتظر حتى ترى:
   - ✅ Build: Success
   - ✅ Deploy: Success
   - ✅ Status: Running

**Build Steps:**
```
1. Installing dependencies (npm ci)
2. Building TypeScript (npm run build)
3. Starting server (npm start)
```

**Expected Time:** 3-5 minutes

---

### **Step 7: Run Database Migrations**

#### **Option A: Using Railway CLI (Recommended)**
```bash
# Connect to Railway
railway link

# Run migration script
railway run bash server/scripts/migrate.sh
```

#### **Option B: Manual psql**
```bash
# Get DATABASE_URL
railway variables

# Run migrations
psql $DATABASE_URL < server/src/db/schema.sql
psql $DATABASE_URL < server/src/db/schema-updates.sql
```

#### **Option C: Using Railway Shell**
```bash
railway run bash

# Inside shell:
cd server/scripts
chmod +x migrate.sh
./migrate.sh
```

**Expected Output:**
```
🔄 Starting database migration...
✅ DATABASE_URL found
📁 Project root: /app/server
📦 Installing pgvector extension...
✅ pgvector extension installed
📝 Running main schema...
✅ Main schema applied
📝 Running schema updates...
✅ Schema updates applied
🎉 Migration completed successfully!
```

---

### **Step 8: (Optional) Seed Test Data**

```bash
railway run psql $DATABASE_URL < server/scripts/seed.sql
```

هذا سيُنشئ:
- Demo user
- Test agent with API key
- Sample training material

---

## ✅ Verification & Testing

### **1. Check Deployment Status**

في Railway Dashboard:
- ✅ Service status: **Running** (green)
- ✅ Build logs: No errors
- ✅ Runtime logs: Server started

### **2. Get Your App URL**

في Railway Dashboard:
1. Click on Backend service
2. Go to **"Settings"** tab
3. Find **"Domains"** section
4. Copy the URL: `https://your-app.railway.app`

### **3. Test Health Endpoint**

```bash
curl https://your-app.railway.app/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

### **4. Check Logs**

```bash
# Using CLI
railway logs

# Or in Dashboard
# Click service → "Logs" tab
```

**Look for:**
```
✅ 🚀 Server running on http://0.0.0.0:3001
✅ 📝 Environment: production
✅ 🔒 CORS enabled for: ...
❌ No errors
```

### **5. Test Database Connection**

```bash
railway run psql $DATABASE_URL -c "SELECT COUNT(*) FROM users;"
```

### **6. Test API Endpoint**

```bash
# Using demo API key from seed
curl -X POST https://your-app.railway.app/api/chat \
  -H "X-API-Key: agent_demo_key_for_testing_only_change_in_production" \
  -H "Content-Type: application/json" \
  -d '{"question": "مرحباً"}'
```

---

## 🔧 Configuration في Railway

### **Root Directory Setting**

⚠️ **مهم جداً:**
1. Click on Backend service
2. Go to **"Settings"** tab
3. Find **"Root Directory"**
4. Set to: **`server`**
5. Click **"Update"**

بدون هذا، Railway سيبحث عن `package.json` في root بدلاً من `server/`.

### **Build Command (Optional)**

إذا كان هناك مشاكل:
1. Settings → Build
2. Custom Build Command: `npm install && npm run build`
3. Custom Start Command: `npm start`

### **Environment Variables**

تأكد من:
- ✅ `DEEPSEEK_API_KEY` موجود
- ✅ `OPENAI_API_KEY` موجود
- ✅ `JWT_SECRET` موجود
- ✅ `DATABASE_URL` موجود (auto-added)
- ✅ `NODE_ENV=production`

---

## 🐛 Troubleshooting

### **Problem: Build fails with "Cannot find package.json"**

**Solution:**
```
Settings → Root Directory → Set to "server"
```

### **Problem: "npm ci requires package-lock.json"**

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
- Check build logs
- Ensure `npm install` completed
- Try manual redeploy

### **Problem: "Database connection failed"**

**Solution:**
- Verify PostgreSQL service is running
- Check `DATABASE_URL` in variables
- Ensure services are linked

### **Problem: "pgvector extension not found"**

**Solution:**
```bash
railway run psql $DATABASE_URL
CREATE EXTENSION vector;
```

### **Problem: "CORS error from frontend"**

**Solution:**
```bash
railway variables set CORS_ORIGIN=https://your-frontend-domain.com
```

### **Problem: "Port already in use"**

**Solution:**
- Railway handles PORT automatically
- Don't set PORT variable manually
- Code uses `process.env.PORT || 3001` ✅

---

## 📊 Monitoring

### **View Logs**

```bash
# Real-time
railway logs --follow

# Last 100 lines
railway logs

# Filter errors
railway logs | grep ERROR
```

### **Metrics**

في Dashboard:
- CPU usage
- Memory usage
- Network traffic
- Request count

### **Alerts (Pro Plan)**

Setup alerts for:
- High CPU usage
- High memory usage
- Deployment failures
- Error rates

---

## 💰 Pricing

### **Free Tier**
- $5 credit/month
- Shared resources
- Good for testing
- **Enough for initial testing**

### **Hobby Plan ($5/month)**
- $5 credit + $5/month
- Better performance
- **Recommended for production**

### **Estimated Costs:**
- Backend: ~$5/month
- PostgreSQL: ~$5/month
- **Total: ~$10/month**

---

## 🔐 Security Checklist

### **After Deployment:**
- [ ] Change demo API key
- [ ] Verify CORS is configured
- [ ] Check rate limiting works
- [ ] Test authentication
- [ ] Monitor logs for errors
- [ ] Setup alerts
- [ ] Enable 2FA on Railway account

### **Environment Variables:**
- [ ] All secrets set
- [ ] No hardcoded values
- [ ] JWT secret is strong
- [ ] API keys are valid

---

## 🎯 Post-Deployment Tasks

### **Immediate (First Hour):**
1. ✅ Test all API endpoints
2. ✅ Verify database connection
3. ✅ Check logs for errors
4. ✅ Test from frontend
5. ✅ Verify CORS works

### **First Day:**
1. ✅ Monitor error rates
2. ✅ Check performance
3. ✅ Test file uploads
4. ✅ Verify rate limiting
5. ✅ Test authentication

### **First Week:**
1. ✅ Setup monitoring alerts
2. ✅ Configure backups
3. ✅ Document API endpoints
4. ✅ Load testing
5. ✅ Security audit

---

## 📞 Support

### **Railway:**
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway
- Status: https://status.railway.app

### **Common Issues:**
- Check logs first: `railway logs`
- Verify variables: `railway variables`
- Test locally: `npm run dev`
- Check database: `railway run psql $DATABASE_URL`

---

## ✅ Success Checklist

### **Deployment Complete When:**
- [x] ✅ Build successful
- [x] ✅ Server running
- [x] ✅ Health check passing
- [x] ✅ Database connected
- [x] ✅ pgvector installed
- [x] ✅ Migrations applied
- [x] ✅ Environment variables set
- [x] ✅ API endpoints working
- [x] ✅ No errors in logs
- [x] ✅ CORS configured
- [x] ✅ Ready for production!

---

## 🎉 You're Done!

**Your API is now live at:**
```
https://your-app.railway.app
```

**Next Steps:**
1. Update frontend `VITE_API_URL`
2. Test integration
3. Deploy frontend
4. Go live! 🚀

---

**Status**: 🟢 **Ready for Railway Deployment!**

**Estimated Time**: 20-30 minutes

**Good Luck! 🍀**
