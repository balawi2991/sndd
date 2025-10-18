# 🔴 Fix: DATABASE_URL Not Found

## ❌ المشكلة

```
Error: DATABASE_URL environment variable is required
```

**السبب**: PostgreSQL service غير مُضاف أو غير مربوط بـ Backend service

---

## ✅ الحل (خطوتين فقط)

### **Step 1: أضف PostgreSQL Service**

في Railway Dashboard:

1. اذهب إلى Project
2. اضغط **"New"** button (أعلى اليمين)
3. اختر **"Database"**
4. اختر **"PostgreSQL"**
5. انتظر 1-2 دقيقة حتى يكتمل provisioning

**✅ Railway سيضيف `DATABASE_URL` تلقائياً**

---

### **Step 2: تحقق من الربط (Linking)**

Railway يربط الخدمات تلقائياً، لكن تأكد:

1. اذهب إلى **Backend Service** (ليس PostgreSQL)
2. اضغط **"Variables"** tab
3. يجب أن ترى: `DATABASE_URL` ✅

**إذا لم تراه:**
1. اذهب إلى **Settings** tab
2. ابحث عن **"Service Variables"**
3. تأكد أن PostgreSQL مربوط

---

## 🔍 التحقق

### **Option 1: من Dashboard**

1. Backend Service → Variables
2. ابحث عن `DATABASE_URL`
3. يجب أن يكون موجود ويبدأ بـ:
   ```
   postgresql://postgres:...@postgres.railway.internal:5432/railway
   ```

### **Option 2: من CLI**

```bash
railway link
railway variables | grep DATABASE_URL
```

**Expected Output:**
```
DATABASE_URL=postgresql://postgres:xxxxx@postgres.railway.internal:5432/railway
```

---

## 🚀 بعد الإضافة

### **1. Redeploy Backend**

Railway سيعيد deploy تلقائياً، أو:

```bash
# من Dashboard
Backend Service → Deployments → Redeploy

# أو من CLI
railway up
```

### **2. انتظر Build**

```
✅ npm ci completed
✅ npm run build completed
✅ Server starting...
✅ Database connection pool created
```

### **3. تحقق من Logs**

```bash
railway logs --follow
```

**Expected:**
```
✅ Database connection pool created
🚀 Server running on http://0.0.0.0:3000
```

---

## 📊 Railway Services Structure

يجب أن يكون لديك خدمتين:

```
Project
├── Backend (Node.js)
│   ├── Variables
│   │   ├── DEEPSEEK_API_KEY
│   │   ├── OPENAI_API_KEY
│   │   ├── JWT_SECRET
│   │   ├── NODE_ENV
│   │   └── DATABASE_URL ← تلقائي من PostgreSQL
│   └── Settings
│       └── Root Directory: server
│
└── PostgreSQL
    └── DATABASE_URL (auto-generated)
```

---

## ⚠️ ملاحظات مهمة

### **1. لا تضف DATABASE_URL يدوياً**

❌ **خطأ**: إضافة DATABASE_URL يدوياً في Variables
✅ **صحيح**: Railway يضيفه تلقائياً عند إضافة PostgreSQL

### **2. استخدم Internal URL**

Railway سيستخدم:
```
DATABASE_URL=postgresql://...@postgres.railway.internal:5432/railway
```

**لا تستخدم** PUBLIC URL:
```
DATABASE_PUBLIC_URL=postgresql://...@crossover.proxy.rlwy.net:44918/railway
```

### **3. انتظر Provisioning**

PostgreSQL يحتاج 1-2 دقيقة للـ setup. انتظر حتى ترى:
- ✅ Status: Running (green)
- ✅ DATABASE_URL في Variables

---

## 🐛 Troubleshooting

### **Problem: DATABASE_URL still not found after adding PostgreSQL**

**Solutions:**

1. **تحقق من Service Status**
   ```
   PostgreSQL → Status should be "Running" (green)
   ```

2. **Redeploy Backend**
   ```
   Backend → Deployments → Redeploy
   ```

3. **Check Service Linking**
   ```
   Backend → Settings → Connected Services
   Should show PostgreSQL
   ```

4. **Manual Link (if needed)**
   ```bash
   railway link
   railway service
   # Select Backend service
   ```

### **Problem: Wrong DATABASE_URL format**

**Check:**
```bash
railway variables | grep DATABASE_URL
```

**Should be:**
```
postgresql://postgres:PASSWORD@postgres.railway.internal:5432/railway
```

**Should NOT be:**
```
postgresql://postgres:PASSWORD@crossover.proxy.rlwy.net:PORT/railway
```

### **Problem: Connection timeout**

**Solution:**
1. تأكد من PostgreSQL service يعمل
2. تأكد من الربط بين الخدمات
3. Check firewall/network settings

---

## 📝 Quick Fix Commands

```bash
# 1. Check current variables
railway variables

# 2. Check services
railway service

# 3. Redeploy
railway up

# 4. Check logs
railway logs --follow

# 5. Test database connection
railway run psql $DATABASE_URL -c "SELECT NOW();"
```

---

## ✅ Success Indicators

### **في Logs:**
```
✅ Database connection pool created
🚀 Server running on http://0.0.0.0:3000
📝 Environment: production
```

### **في Variables:**
```
DATABASE_URL=postgresql://postgres:xxxxx@postgres.railway.internal:5432/railway
DEEPSEEK_API_KEY=sk-xxxxx
OPENAI_API_KEY=sk-xxxxx
JWT_SECRET=xxxxx
NODE_ENV=production
```

### **Test Health:**
```bash
curl https://your-app.railway.app/health
```

**Expected:**
```json
{
  "status": "ok",
  "timestamp": "...",
  "uptime": 123
}
```

---

## 🎯 الخلاصة

**المشكلة**: DATABASE_URL مفقود

**الحل**: 
1. أضف PostgreSQL service في Railway
2. انتظر provisioning
3. Redeploy backend
4. ✅ Done!

**الوقت**: 2-3 دقائق

---

**Status**: 🟢 **Easy Fix!**

**Next**: بعد إضافة PostgreSQL، run migrations:
```bash
railway run bash server/scripts/migrate.sh
```
