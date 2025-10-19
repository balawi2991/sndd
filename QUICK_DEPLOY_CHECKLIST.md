# ✅ MintChat - قائمة النشر السريعة

## 📋 قبل البدء (5 دقائق)

### 1. API Keys
- [ ] DeepSeek API Key: https://platform.deepseek.com
- [ ] OpenAI API Key: https://platform.openai.com

### 2. JWT Secret (جاهز!)
```
YGxGqYa1YxWO38H4L1Jf1mYKoav1Mv3CKT91AQ2XlqA=
```
✅ انسخه من `RAILWAY_ENV_READY.txt`

---

## 🚀 خطوات النشر (10 دقائق)

### الخطوة 1: GitHub (3 دقائق)
```bash
git init
git add .
git commit -m "Initial MintChat deployment"
git remote add origin https://github.com/YOUR_USERNAME/mintchat.git
git branch -M main
git push -u origin main
```
- [ ] الكود على GitHub

### الخطوة 2: Railway (2 دقيقة)
1. https://railway.app/new
2. Deploy from GitHub repo
3. اختر mintchat
- [ ] مشروع Railway منشأ

### الخطوة 3: PostgreSQL (1 دقيقة)
1. اضغط "+ New"
2. Database → PostgreSQL
- [ ] PostgreSQL مضاف

### الخطوة 4: المتغيرات (3 دقائق)
في خدمة MintChat → Variables:

```
JWT_SECRET=YGxGqYa1YxWO38H4L1Jf1mYKoav1Mv3CKT91AQ2XlqA=
DEEPSEEK_API_KEY=[your-key]
OPENAI_API_KEY=[your-key]
NODE_ENV=production
```
- [ ] جميع المتغيرات مضافة

### الخطوة 5: pgvector (1 دقيقة)
PostgreSQL → Data → Query:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```
- [ ] pgvector مفعّل

### الخطوة 6: التحقق (2 دقيقة)
Deployments → View Logs:
```
✅ Database connected
✅ pgvector extension enabled
🚀 Server running
```
- [ ] Build نجح
- [ ] التطبيق يعمل

---

## 🧪 الاختبار (5 دقائق)

### 1. إنشاء حساب
- [ ] Sign Up يعمل
- [ ] تسجيل الدخول يعمل

### 2. إضافة محتوى
- [ ] إضافة مادة تدريب
- [ ] الفهرسة تعمل (Status: Trained)

### 3. الدردشة
- [ ] الويدجت يظهر
- [ ] إرسال رسالة يعمل
- [ ] الرد يظهر
- [ ] المصادر تظهر

---

## ✅ النجاح!

إذا كل شيء ✅ أعلاه، تهانينا! 🎉

**التطبيق جاهز:** https://your-app.railway.app

---

## 🐛 حل سريع للمشاكل

### Build Failed?
→ تحقق من المتغيرات

### Database Error?
→ فعّل pgvector

### 500 Error?
→ راجع API keys

### Widget لا يظهر?
→ Hard refresh (Ctrl+Shift+R)

---

## 📚 المزيد من المساعدة

- `DEPLOYMENT_STEPS_ARABIC.md` - دليل مفصل
- `RAILWAY_ENV_READY.txt` - المتغيرات جاهزة
- `README.md` - التوثيق الكامل

---

**الوقت الإجمالي:** ~15 دقيقة
**الصعوبة:** سهل
**التكلفة:** مجاني

🚀 **ابدأ الآن!**
