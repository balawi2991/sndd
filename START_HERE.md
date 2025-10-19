# 🎯 START HERE - MintChat Platform

## 👋 مرحباً!

هذا هو مشروع **MintChat** - منصة SaaS كاملة لإنشاء ونشر chat widgets مدعومة بالذكاء الاصطناعي.

---

## ⚡ البدء السريع (5 دقائق)

### 1️⃣ تثبيت المكتبات
```bash
npm install
```

### 2️⃣ إعداد البيئة المحلية
```bash
cp .env.example .env
```

ثم عدّل `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/mintchat
JWT_SECRET=any-random-string
DEEPSEEK_API_KEY=your-api-key
NODE_ENV=development
```

### 3️⃣ تشغيل المشروع
```bash
npm run dev
```

افتح: http://localhost:5173

---

## 🚂 النشر على Railway (5 دقائق)

### الخطوات:
1. ارفع الكود على GitHub
2. اذهب إلى https://railway.app/new
3. اختر "Deploy from GitHub repo"
4. أضف MongoDB database
5. أضف المتغيرات:
   - `JWT_SECRET` (ولّده بالأمر أدناه)
   - `DEEPSEEK_API_KEY` (من platform.deepseek.com)
   - `NODE_ENV=production`

### توليد JWT Secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**اقرأ التفاصيل في:** `QUICK_START.md`

---

## 📚 الملفات المهمة

### للبدء السريع:
- **`QUICK_START.md`** ← ابدأ من هنا!
- **`ENV_VARIABLES.md`** ← شرح المتغيرات

### للنشر:
- **`RAILWAY_SETUP.md`** ← دليل Railway مفصّل
- **`DEPLOYMENT_CHECKLIST.md`** ← قائمة التحقق

### للفهم:
- **`README_DEPLOYMENT.md`** ← وثائق شاملة
- **`PROJECT_SUMMARY.md`** ← ملخص المشروع

---

## 🎯 ما الذي تم بناؤه؟

### ✅ Backend (Express + MongoDB)
- Authentication (JWT)
- Training Materials API
- Chat API with RAG
- DeepSeek AI Integration
- Rate Limiting
- Error Handling

### ✅ Frontend (React + TypeScript)
- Dashboard
- Training Materials Management
- Appearance Customization
- Conversations History
- Try My Agent (Testing)
- Embed Code

### ✅ Chat Widget
- **Ask-bar**: شريط الإدخال الثابت أسفل الشاشة
- **Modal**: نافذة المحادثة مع الرسائل
- **Animations**: حركات سلسة
- **Glow Effect**: تأثير RGB على الحواف
- **Sources**: عرض مصادر الإجابات
- **Typing Indicator**: مؤشر الكتابة
- **Responsive**: يعمل على الموبايل والديسكتوب

### ✅ Railway Configuration
- Single deployment (frontend + backend)
- MongoDB integration
- Environment variables
- Auto-scaling
- HTTPS

---

## 🏗️ بنية المشروع

```
mintchat/
├── src/                    # Frontend (React)
│   ├── components/
│   │   ├── widget/        # ← الويدجت الكامل
│   │   ├── appearance/
│   │   └── ui/
│   ├── pages/
│   ├── lib/api.ts         # ← API client
│   └── contexts/
│
├── server/                # Backend (Express)
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   │   ├── chat.service.ts
│   │   ├── rag.service.ts
│   │   └── deepseek.service.ts
│   └── middleware/
│
├── .env.example          # ← نموذج المتغيرات
├── railway.json          # ← إعدادات Railway
└── package.json          # ← المكتبات
```

---

## 🎨 الميزات الرئيسية

### 1. Multi-tenant SaaS
- كل مستخدم له بياناته الخاصة
- عزل كامل بين المستخدمين
- JWT authentication

### 2. RAG System
- تدريب من Files/Links/Text
- استرجاع السياق تلقائياً
- عرض المصادر في الردود

### 3. Chat Widget
- تصميم احترافي
- قابل للتخصيص بالكامل
- يعمل على أي موقع

### 4. DeepSeek AI
- ردود ذكية
- دعم السياق
- معالجة الأخطاء

---

## 🔧 الأوامر المتاحة

```bash
# Development
npm run dev              # تشغيل Frontend + Backend
npm run dev:client       # Frontend فقط
npm run dev:server       # Backend فقط

# Build
npm run build            # بناء المشروع كامل
npm run build:client     # Frontend فقط
npm run build:server     # Backend فقط

# Production
npm start                # تشغيل الإنتاج

# Other
npm run lint             # فحص الكود
npm run typecheck        # فحص TypeScript
```

---

## 📊 قاعدة البيانات

### Collections:
- **users** - المستخدمين
- **conversations** - المحادثات
- **trainingmaterials** - مواد التدريب
- **appearances** - إعدادات المظهر

### Indexes:
- userId على كل collection
- lastActivity على conversations
- status على trainingmaterials

---

## 🔐 الأمان

- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Rate limiting
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ User data isolation

---

## 🧪 الاختبار

### محلياً:
1. شغّل `npm run dev`
2. افتح http://localhost:5173
3. سجّل حساب جديد
4. جرّب الصفحات المختلفة

### على Railway:
1. انشر المشروع
2. افتح الرابط
3. سجّل حساب
4. اذهب إلى "Try My Agent"
5. جرّب الويدجت

---

## 🎯 الخطوات التالية

### 1. تشغيل محلي
```bash
npm install
cp .env.example .env
# عدّل .env
npm run dev
```

### 2. اختبار الميزات
- [ ] التسجيل والدخول
- [ ] إضافة training materials
- [ ] تخصيص المظهر
- [ ] تجربة الويدجت
- [ ] إرسال رسائل

### 3. النشر
- [ ] ارفع على GitHub
- [ ] انشر على Railway
- [ ] أضف MongoDB
- [ ] اضبط المتغيرات
- [ ] اختبر الموقع

---

## 📖 الوثائق الكاملة

| ملف | الوصف |
|-----|-------|
| `QUICK_START.md` | دليل البدء السريع |
| `RAILWAY_SETUP.md` | دليل Railway مفصّل |
| `ENV_VARIABLES.md` | شرح المتغيرات |
| `DEPLOYMENT_CHECKLIST.md` | قائمة التحقق |
| `README_DEPLOYMENT.md` | وثائق شاملة |
| `PROJECT_SUMMARY.md` | ملخص تقني |

---

## ❓ الأسئلة الشائعة

### كيف أحصل على DeepSeek API key؟
1. اذهب إلى https://platform.deepseek.com
2. سجّل حساب
3. اذهب إلى API Keys
4. أنشئ مفتاح جديد

### كيف أولّد JWT Secret؟
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### هل أحتاج MongoDB محلي؟
- للتطوير: نعم، أو استخدم MongoDB Atlas
- للإنتاج: Railway يوفره تلقائياً

### كيف أختبر الويدجت؟
اذهب إلى صفحة "Try My Agent" بعد تسجيل الدخول

---

## 🆘 المساعدة

### مشاكل البناء
- تحقق من `package.json`
- شغّل `npm run typecheck`
- راجع logs في Railway

### مشاكل قاعدة البيانات
- تحقق من `MONGODB_URI`
- تأكد من تشغيل MongoDB
- راجع connection string

### مشاكل API
- تحقق من `DEEPSEEK_API_KEY`
- تأكد من `JWT_SECRET`
- راجع browser console

---

## ✅ قائمة التحقق السريعة

- [ ] `npm install` نجح
- [ ] `.env` تم إنشاؤه
- [ ] MongoDB يعمل
- [ ] `npm run dev` يعمل
- [ ] http://localhost:5173 يفتح
- [ ] يمكن التسجيل
- [ ] الويدجت يظهر في Try My Agent

---

## 🎉 جاهز للبدء!

اختر مسارك:

### 🏃 سريع (تجربة محلية)
→ اقرأ `QUICK_START.md` القسم "Local Development"

### 🚀 نشر مباشر
→ اقرأ `QUICK_START.md` القسم "Deploy to Railway"

### 📚 فهم عميق
→ اقرأ `PROJECT_SUMMARY.md` ثم `README_DEPLOYMENT.md`

---

**بالتوفيق! 🚀**

إذا واجهت أي مشكلة، راجع ملفات الوثائق أو تحقق من Railway logs.
