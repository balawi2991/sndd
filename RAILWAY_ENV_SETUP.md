# 🔐 Railway Environment Variables - Complete Setup

## ✅ جميع المتغيرات المطلوبة

### **1. Required (يجب إضافتها)**

```env
# AI APIs
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxx
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxx

# Security
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long-random-string

# Environment
NODE_ENV=production
```

### **2. Database (Auto-provided by Railway)**

```env
# ✅ تلقائي - لا تضيفه يدوياً
DATABASE_URL=postgresql://postgres:password@postgres.railway.internal:5432/railway
```

**⚠️ مهم**: استخدم `DATABASE_URL` (Internal) وليس `DATABASE_PUBLIC_URL`

**الفرق**:
- `DATABASE_URL`: اتصال داخلي (أسرع وأكثر أماناً) ✅
- `DATABASE_PUBLIC_URL`: اتصال خارجي (للاتصال من خارج Railway) ❌

**Railway سيربط الخدمات تلقائياً ويستخدم DATABASE_URL**

### **3. Optional (اختياري لكن مُوصى به)**

```env
# CORS
CORS_ORIGIN=https://your-frontend-domain.com

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

# DeepSeek Configuration
DEEPSEEK_MODEL=deepseek-chat
DEEPSEEK_TEMPERATURE=0.7
DEEPSEEK_MAX_TOKENS=1000
DEEPSEEK_TIMEOUT=30000

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

### **4. Auto-provided by Railway (لا تضيفها)**

```env
# ✅ Railway يوفرها تلقائياً
PORT=3000
RAILWAY_ENVIRONMENT=production
RAILWAY_PROJECT_ID=xxxxx
RAILWAY_SERVICE_ID=xxxxx
```

---

## 📝 كيفية إضافة المتغيرات في Railway

### **الطريقة 1: من Dashboard**

1. افتح Project في Railway
2. اضغط على **Backend Service** (ليس PostgreSQL)
3. اذهب إلى **"Variables"** tab
4. اضغط **"New Variable"**
5. أضف كل متغير:
   ```
   Name: DEEPSEEK_API_KEY
   Value: sk-xxxxx
   ```
6. اضغط **"Add"**
7. كرر لكل متغير

### **الطريقة 2: من CLI**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# Add variables
railway variables set DEEPSEEK_API_KEY=sk-xxxxx
railway variables set OPENAI_API_KEY=sk-xxxxx
railway variables set JWT_SECRET=your-secret-key
railway variables set NODE_ENV=production
railway variables set CORS_ORIGIN=https://yourdomain.com

# Verify
railway variables
```

---

## 🔑 كيفية الحصول على API Keys

### **1. DeepSeek API Key**

1. اذهب إلى: https://platform.deepseek.com
2. Sign up / Login
3. اذهب إلى **API Keys**
4. اضغط **"Create API Key"**
5. انسخ المفتاح: `sk-xxxxx`
6. احفظه في مكان آمن

**السعر**: ~$0.14 per 1M input tokens (رخيص جداً)

### **2. OpenAI API Key**

1. اذهب إلى: https://platform.openai.com
2. Sign up / Login
3. اذهب إلى **API Keys**
4. اضغط **"Create new secret key"**
5. انسخ المفتاح: `sk-xxxxx`
6. احفظه في مكان آمن

**السعر**: ~$0.10 per 1M tokens (للـ embeddings)

### **3. JWT Secret**

أي string عشوائي 32+ حرف:

```bash
# Generate random JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use online generator
# https://www.uuidgenerator.net/
```

**مثال**:
```
jwt_secret_2024_sanad_production_a1b2c3d4e5f6g7h8i9j0k1l2m3n4
```

---

## ⚙️ Root Directory Configuration

### **⚠️ مهم جداً: يجب ضبط Root Directory**

في Railway Dashboard:
1. اضغط على **Backend Service**
2. اذهب إلى **"Settings"** tab
3. ابحث عن **"Root Directory"**
4. اكتب: **`server`**
5. اضغط **"Update"**

**بدون هذا، Railway سيبحث عن package.json في root بدلاً من server/**

---

## 🔍 Verification

### **Check Variables**

```bash
# Using CLI
railway variables

# Should show:
# DEEPSEEK_API_KEY=sk-xxxxx
# OPENAI_API_KEY=sk-xxxxx
# JWT_SECRET=xxxxx
# NODE_ENV=production
# DATABASE_URL=postgresql://... (auto-added)
```

### **Check in Dashboard**

1. Backend Service → Variables tab
2. يجب أن ترى جميع المتغيرات
3. `DATABASE_URL` يجب أن يكون موجود تلقائياً

---

## 🐛 Troubleshooting

### **Problem: DATABASE_URL not found**

**Solution:**
1. تأكد من إضافة PostgreSQL service
2. انتظر حتى يكتمل provisioning
3. Redeploy backend service

### **Problem: Which DATABASE_URL to use?**

**Answer:** استخدم `DATABASE_URL` (Internal)

```
✅ DATABASE_URL=postgresql://...@postgres.railway.internal:5432/railway
❌ DATABASE_PUBLIC_URL=postgresql://...@crossover.proxy.rlwy.net:44918/railway
```

**السبب:**
- Internal URL أسرع
- Internal URL أكثر أماناً
- Railway يربط الخدمات تلقائياً

### **Problem: Build fails with "DEEPSEEK_API_KEY is not defined"**

**Solution:**
1. تأكد من إضافة المتغير في Variables tab
2. Redeploy service
3. Check logs

### **Problem: CORS error**

**Solution:**
```bash
railway variables set CORS_ORIGIN=https://your-frontend-domain.com
```

أو للتجربة (غير آمن للـ production):
```bash
railway variables set CORS_ORIGIN=*
```

---

## 📋 Checklist

### **قبل Deploy:**
- [ ] حصلت على DeepSeek API Key
- [ ] حصلت على OpenAI API Key
- [ ] أنشأت JWT Secret (32+ chars)
- [ ] PostgreSQL service مُضاف
- [ ] Root Directory = `server`

### **أثناء Deploy:**
- [ ] أضفت DEEPSEEK_API_KEY
- [ ] أضفت OPENAI_API_KEY
- [ ] أضفت JWT_SECRET
- [ ] أضفت NODE_ENV=production
- [ ] DATABASE_URL موجود تلقائياً
- [ ] (Optional) أضفت CORS_ORIGIN

### **بعد Deploy:**
- [ ] Verified variables: `railway variables`
- [ ] Checked logs: `railway logs`
- [ ] Tested health endpoint
- [ ] Tested API endpoints

---

## 🎯 Quick Setup Commands

```bash
# 1. Install CLI
npm install -g @railway/cli

# 2. Login & Link
railway login
railway link

# 3. Add Required Variables
railway variables set DEEPSEEK_API_KEY=sk-xxxxx
railway variables set OPENAI_API_KEY=sk-xxxxx
railway variables set JWT_SECRET=your-32-char-secret
railway variables set NODE_ENV=production

# 4. Add Optional Variables
railway variables set CORS_ORIGIN=https://yourdomain.com
railway variables set RATE_LIMIT_PER_MINUTE=10

# 5. Verify
railway variables

# 6. Check Logs
railway logs --follow
```

---

## ✅ Summary

### **يجب إضافتها يدوياً:**
1. `DEEPSEEK_API_KEY` ← من platform.deepseek.com
2. `OPENAI_API_KEY` ← من platform.openai.com
3. `JWT_SECRET` ← string عشوائي 32+ حرف
4. `NODE_ENV=production`
5. `CORS_ORIGIN` ← (اختياري)

### **تلقائي من Railway:**
1. `DATABASE_URL` ← من PostgreSQL service
2. `PORT` ← Railway يوفره
3. `RAILWAY_ENVIRONMENT` ← Railway يوفره

### **Root Directory:**
- يجب ضبطه على: **`server`**

---

**Status**: 🟢 **Ready for Configuration!**

**Next**: Add variables then deploy!
