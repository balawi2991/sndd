# 🚂 Railway Deployment - دليل مبسط

## ما تحتاج تعديله vs ما هو تلقائي

---

## ✅ تلقائي (Railway يعدّها تلقائياً)

### **لا تحتاج تعديل - Railway يديرها:**

1. **PORT** ❌ لا تضعه
   - Railway يختار port تلقائياً
   - الكود يقرأه من `process.env.PORT`

2. **DATABASE_URL** ✅ تلقائي
   - عند إضافة PostgreSQL
   - Railway يضيفه في Variables تلقائياً
   - استخدم: `${{Postgres.DATABASE_URL}}`

3. **NODE_ENV** ✅ تلقائي
   - Railway يضعه `production` تلقائياً
   - يمكنك تغييره إذا أردت

4. **Domain/URL** ✅ تلقائي
   - Railway يولّد domain مجاني
   - مثل: `your-app.railway.app`

---

## 🔧 يحتاج تعديل (يجب أن تضيفها يدوياً)

### **في Railway Dashboard → Service → Variables:**

#### **1. DEEPSEEK_API_KEY** ⚠️ مطلوب
```
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxx
```
- احصل عليه من: https://platform.deepseek.com
- سجل → Create API Key → انسخه

#### **2. OPENAI_API_KEY** ⚠️ مطلوب
```
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxx
```
- احصل عليه من: https://platform.openai.com
- سجل → Create API Key → انسخه

#### **3. JWT_SECRET** ⚠️ مطلوب
```
JWT_SECRET=abc123def456...
```
- ولّده بهذا الأمر:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
- انسخ الناتج وضعه

#### **4. CORS_ORIGIN** 🟡 اختياري
```
CORS_ORIGIN=*
```
- للاختبار: استخدم `*` (يسمح لأي موقع)
- للإنتاج: ضع URL frontend الخاص بك
- مثال: `https://yourdomain.com`
- عدة مواقع: `https://site1.com,https://site2.com`

---

## 📋 إعدادات Service في Railway

### **Settings → Service Settings**

#### **Root Directory** ⚠️ مطلوب
```
server
```
**لماذا؟** لأن الـ backend في مجلد `server/`

#### **Build Command** ✅ تلقائي (لكن تأكد)
```
npm install && npm run build
```

#### **Start Command** ✅ تلقائي (لكن تأكد)
```
npm start
```

---

## 🗄️ PostgreSQL Setup

### **خطوات إضافة Database:**

1. **في Project Dashboard**
   - اضغط **"New"** (زر +)
   - اختر **"Database"**
   - اختر **"PostgreSQL"**

2. **Install pgvector Extension**
   ```bash
   # في Railway Dashboard → PostgreSQL → Connect → psql
   CREATE EXTENSION vector;
   ```

3. **Run Migrations**
   ```bash
   # من terminal محلي (بعد تثبيت Railway CLI)
   railway run psql $DATABASE_URL < server/src/db/schema.sql
   railway run psql $DATABASE_URL < server/src/db/schema-updates.sql
   ```

---

## 🌐 Networking (Domain)

### **Generate Domain:**

1. **Settings → Networking**
2. اضغط **"Generate Domain"**
3. احفظ الـ URL (مثل: `sanad-backend.railway.app`)

**لا تحتاج تعديل Port** - Railway يديره تلقائياً

---

## 📊 ملخص سريع

### **ما تحتاج تضيفه في Variables:**

| Variable | مطلوب؟ | القيمة |
|----------|--------|--------|
| `DATABASE_URL` | ✅ تلقائي | `${{Postgres.DATABASE_URL}}` |
| `DEEPSEEK_API_KEY` | ⚠️ يدوي | من platform.deepseek.com |
| `OPENAI_API_KEY` | ⚠️ يدوي | من platform.openai.com |
| `JWT_SECRET` | ⚠️ يدوي | ولّده بـ crypto |
| `CORS_ORIGIN` | 🟡 اختياري | `*` أو frontend URL |
| `NODE_ENV` | ✅ تلقائي | `production` |
| `PORT` | ❌ لا تضعه | Railway يديره |

### **ما تحتاج تعدّله في Settings:**

| Setting | القيمة |
|---------|--------|
| Root Directory | `server` |
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |
| Auto Deploy | ✅ Enabled |

---

## 🎯 الترتيب الصحيح

```
1. ✅ Create Service في Railway
2. ✅ Link GitHub repo
3. ⚠️ Set Root Directory = server
4. ⚠️ Add PostgreSQL database
5. ⚠️ Set Variables (API keys, JWT secret)
6. ✅ Generate Domain
7. ⚠️ Install pgvector extension
8. ⚠️ Run migrations
9. ✅ Test /health endpoint
10. 🎉 Done!
```

**✅ = تلقائي أو سهل**
**⚠️ = يحتاج عمل يدوي**

---

## 🔍 كيف تتحقق من النجاح؟

### **1. Check Deployment Status**
- Service → Deployments
- Status يجب أن يكون: **✅ Active** (أخضر)

### **2. Check Logs**
- Service → Deployments → آخر deployment → Logs
- يجب أن ترى:
```
✅ All required environment variables are set
🚀 Sanad API Server Started
================================
📍 Port: 3001
🌍 Environment: production
🔒 CORS: *
🗄️  Database: ✅ Connected
🤖 DeepSeek: ✅ Configured
🧠 OpenAI: ✅ Configured
```

### **3. Test Health Endpoint**
```bash
curl https://your-railway-domain.railway.app/health
```

**يجب أن ترى:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-18T...",
  "uptime": 123.456,
  "environment": "production",
  "database": "connected"
}
```

✅ **إذا رأيت هذا = كل شيء يعمل!**

---

## ⚠️ مشاكل شائعة وحلولها

### **Problem: Deploy Failed**
**السبب**: Missing environment variables
**الحل**: 
1. اذهب إلى Variables
2. تأكد من وجود: `DEEPSEEK_API_KEY`, `OPENAI_API_KEY`, `JWT_SECRET`

### **Problem: Cannot connect to database**
**السبب**: PostgreSQL غير موجود
**الحل**: 
1. أضف PostgreSQL service
2. تأكد من `DATABASE_URL` في Variables

### **Problem: pgvector extension missing**
**السبب**: لم يتم تثبيت pgvector
**الحل**:
```sql
CREATE EXTENSION vector;
```

### **Problem: CORS error**
**السبب**: Frontend URL غير مسموح
**الحل**: 
1. ضع `CORS_ORIGIN=*` للاختبار
2. أو ضع frontend URL الصحيح

---

## 💡 نصائح مهمة

### **1. لا تضع PORT في Variables**
Railway يديره تلقائياً - إذا وضعته قد يسبب مشاكل

### **2. استخدم CORS_ORIGIN=* للاختبار**
بعدين غيره لـ frontend URL الحقيقي

### **3. احفظ API Keys في مكان آمن**
لا تشاركها مع أحد

### **4. راقب Logs**
إذا حدثت مشكلة، Logs ستخبرك بالسبب

### **5. Test بعد كل تغيير**
استخدم `/health` endpoint للتأكد أن كل شيء يعمل

---

## 📞 إذا احتجت مساعدة

### **Check:**
1. ✅ Logs في Railway Dashboard
2. ✅ Variables كاملة؟
3. ✅ PostgreSQL موجود؟
4. ✅ pgvector installed؟
5. ✅ Migrations تمت؟

### **Test:**
```bash
# Health check
curl https://your-app.railway.app/health

# Root endpoint
curl https://your-app.railway.app/
```

---

**الوقت المتوقع**: 20-30 دقيقة

**الصعوبة**: 🟢 سهل (إذا اتبعت الخطوات)

**النتيجة**: 🚀 Backend يعمل على Railway!
