# 🚀 Quick Start Guide - Sanad (MintChat)

## تشغيل المشروع في 5 خطوات

---

## ⚡ الخطوة 1: تثبيت PostgreSQL

### Windows
```bash
# Download from: https://www.postgresql.org/download/windows/
# Install and remember your password

# Add to PATH (if not automatic)
# C:\Program Files\PostgreSQL\16\bin
```

### Mac
```bash
brew install postgresql@16
brew services start postgresql@16
```

### Linux
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

---

## ⚡ الخطوة 2: إعداد قاعدة البيانات

```bash
# إنشاء قاعدة البيانات
createdb sanad

# تثبيت pgvector extension
psql sanad
```

```sql
-- داخل psql
CREATE EXTENSION vector;
\q
```

```bash
# تشغيل Schema
cd C:\Users\balaw_mce0m32\Downloads\sanad
psql sanad < server/src/db/schema.sql
```

---

## ⚡ الخطوة 3: إعداد Backend

```bash
cd server

# تثبيت Dependencies
npm install

# نسخ ملف Environment
cp .env.example .env
```

**تعديل `server/.env`:**
```env
DEEPSEEK_API_KEY=your_deepseek_key_here
OPENAI_API_KEY=your_openai_key_here
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/sanad
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

```bash
# تشغيل Server
npm run dev
```

✅ يجب أن ترى: `🚀 Server running on http://localhost:3001`

---

## ⚡ الخطوة 4: إعداد Frontend

```bash
# في المجلد الرئيسي
cd ..

# نسخ ملف Environment
cp .env.example .env
```

**تعديل `.env`:**
```env
VITE_API_URL=http://localhost:3001/api
```

```bash
# تشغيل Frontend
npm run dev
```

✅ يجب أن ترى: `Local: http://localhost:5173`

---

## ⚡ الخطوة 5: إضافة بيانات تدريب (مؤقت)

```bash
psql sanad
```

```sql
-- إضافة مستخدم تجريبي
INSERT INTO users (id, email, name) 
VALUES ('test-user-id', 'test@example.com', 'Test User')
ON CONFLICT (email) DO NOTHING;

-- إضافة مادة تدريبية
INSERT INTO training_materials (user_id, type, title, content)
VALUES (
  'test-user-id',
  'text',
  'دليل البدء',
  'مرحباً بك في Sanad! هذا نظام ذكاء اصطناعي متقدم يمكنه الإجابة على أسئلتك بناءً على المواد التدريبية. يمكنك إضافة ملفات، روابط، أو نصوص لتدريب البوت.'
);

\q
```

---

## 🧪 اختبار التشغيل

### 1. اختبار Backend
```bash
# Health Check
curl http://localhost:3001/health

# يجب أن ترى:
# {"status":"ok","timestamp":"...","uptime":...}
```

### 2. اختبار Frontend
1. افتح `http://localhost:5173`
2. اذهب إلى أي صفحة
3. اكتب رسالة في Widget
4. يجب أن ترى خطأ "No training data" (طبيعي - البيانات غير مفهرسة بعد)

---

## 🔑 الحصول على API Keys

### DeepSeek API
1. اذهب إلى: https://platform.deepseek.com
2. سجل حساب جديد
3. اذهب إلى API Keys
4. أنشئ مفتاح جديد
5. انسخه إلى `server/.env`

### OpenAI API
1. اذهب إلى: https://platform.openai.com
2. سجل حساب جديد
3. اذهب إلى API Keys
4. أنشئ مفتاح جديد
5. انسخه إلى `server/.env`

---

## 📝 فهرسة المواد التدريبية (يدوياً)

**ملاحظة**: حالياً يجب فهرسة المواد يدوياً. سيتم إضافة Auto-indexing لاحقاً.

```bash
# في مجلد server
node -e "
const { ragService } = require('./dist/services/rag.service');
const { materialsRepository } = require('./dist/db/repositories/materials.repository');

async function indexMaterial() {
  // Get material
  const materials = await materialsRepository.list('test-user-id');
  const material = materials[0];
  
  if (material && material.content) {
    await ragService.indexMaterial(
      material.id,
      material.content,
      { source: material.title, url: material.url }
    );
    console.log('Material indexed successfully!');
  }
}

indexMaterial().catch(console.error);
"
```

---

## ✅ Checklist

- [ ] PostgreSQL مثبت ويعمل
- [ ] قاعدة البيانات `sanad` تم إنشاؤها
- [ ] pgvector extension مثبت
- [ ] Schema تم تشغيله
- [ ] Backend dependencies مثبتة
- [ ] API Keys تم إضافتها
- [ ] Backend يعمل على port 3001
- [ ] Frontend يعمل على port 5173
- [ ] مستخدم تجريبي تم إضافته
- [ ] مادة تدريبية تم إضافتها

---

## 🐛 حل المشاكل الشائعة

### "Cannot connect to database"
```bash
# تحقق من تشغيل PostgreSQL
pg_isready

# إذا لم يكن يعمل:
# Windows: ابدأ PostgreSQL من Services
# Mac: brew services start postgresql@16
# Linux: sudo systemctl start postgresql
```

### "Extension 'vector' does not exist"
```sql
-- في psql
CREATE EXTENSION vector;
```

### "Port 3001 already in use"
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3001 | xargs kill -9
```

### "CORS error"
تأكد أن `CORS_ORIGIN` في `server/.env` = `http://localhost:5173`

---

## 📊 الخطوات التالية

بعد التشغيل الناجح:

1. **إضافة المزيد من المواد التدريبية**
   - استخدم صفحة Training Materials
   - أو أضف عبر API

2. **اختبار الـ Widget**
   - جرب إرسال رسائل مختلفة
   - تحقق من الردود
   - اختبر Sources

3. **تطوير Upload UI**
   - إضافة رفع ملفات
   - Auto-indexing
   - Progress indicators

4. **ربط Conversations Page**
   - عرض المحادثات المحفوظة
   - البحث والفلترة

---

## 🎯 الهدف النهائي

```
User → Widget → Backend → RAG → DeepSeek → Response
                    ↓
              Save to DB
```

---

## 💡 نصائح

1. **ابدأ بمادة تدريبية واحدة** واختبر
2. **راقب Logs** في كل من Frontend و Backend
3. **استخدم Network Tab** في DevTools للتحقق من API calls
4. **اقرأ رسائل الأخطاء** - هي واضحة ومفيدة

---

## 📞 الدعم

إذا واجهت مشاكل:
1. تحقق من Logs
2. راجع `INTEGRATION_COMPLETE.md`
3. راجع `FINAL_SUMMARY.md`
4. تحقق من Environment Variables

---

**وقت التشغيل المتوقع**: 15-30 دقيقة

**الحالة**: جاهز للتشغيل! 🚀
