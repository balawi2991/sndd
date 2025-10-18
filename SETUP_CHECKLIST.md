# ✅ Setup Checklist - Sanad

استخدم هذا الـ Checklist للتأكد من إكمال جميع خطوات الإعداد.

---

## 📋 Pre-Setup

### Software Installation
- [ ] Node.js 18+ مثبت
  ```bash
  node --version  # يجب أن يكون >= 18
  ```
- [ ] PostgreSQL 14+ مثبت
  ```bash
  psql --version  # يجب أن يكون >= 14
  ```
- [ ] Git مثبت
  ```bash
  git --version
  ```

### API Keys
- [ ] DeepSeek API Key جاهز
  - اذهب إلى: https://platform.deepseek.com
  - سجل حساب
  - أنشئ API key
  
- [ ] OpenAI API Key جاهز
  - اذهب إلى: https://platform.openai.com
  - سجل حساب
  - أنشئ API key

---

## 🗄️ Database Setup

### PostgreSQL
- [ ] PostgreSQL يعمل
  ```bash
  # Windows
  Get-Service postgresql*
  
  # Mac/Linux
  pg_isready
  ```

### pgvector Extension
- [ ] pgvector مثبت
  ```bash
  # Test في psql
  psql postgres
  CREATE EXTENSION vector;
  \q
  ```

---

## 📦 Project Setup

### Dependencies
- [ ] Frontend dependencies مثبتة
  ```bash
  npm install
  ```

- [ ] Backend dependencies مثبتة
  ```bash
  cd server
  npm install
  cd ..
  ```

### Environment Variables

#### Frontend (.env)
- [ ] ملف `.env` موجود
- [ ] `VITE_API_URL` مضبوط
  ```env
  VITE_API_URL=http://localhost:3001/api
  ```

#### Backend (server/.env)
- [ ] ملف `server/.env` موجود
- [ ] `DEEPSEEK_API_KEY` مضبوط
- [ ] `OPENAI_API_KEY` مضبوط
- [ ] `DATABASE_URL` مضبوط
  ```env
  DATABASE_URL=postgresql://postgres:password@localhost:5432/sanad
  ```
- [ ] `CORS_ORIGIN` مضبوط
  ```env
  CORS_ORIGIN=http://localhost:5173
  ```

---

## 🚀 Database Initialization

### Automatic Setup (موصى به)
- [ ] تشغيل setup script
  ```bash
  cd server
  npm run setup
  ```

### Manual Setup (اختياري)
- [ ] Database created
  ```bash
  npm run db:setup
  ```
- [ ] Demo data added
  ```bash
  npm run db:seed
  ```
- [ ] Materials indexed
  ```bash
  npm run db:index
  ```

### Verification
- [ ] Database `sanad` موجودة
  ```bash
  psql -l | grep sanad
  ```

- [ ] Tables created
  ```bash
  psql sanad -c "\dt"
  ```

- [ ] pgvector extension active
  ```bash
  psql sanad -c "SELECT * FROM pg_extension WHERE extname = 'vector';"
  ```

- [ ] Demo user exists
  ```bash
  psql sanad -c "SELECT * FROM users WHERE email = 'demo@sanad.com';"
  ```

- [ ] Training materials exist
  ```bash
  psql sanad -c "SELECT COUNT(*) FROM training_materials;"
  ```

- [ ] Chunks indexed
  ```bash
  psql sanad -c "SELECT COUNT(*) FROM chunks;"
  ```

---

## 🖥️ Server Testing

### Backend
- [ ] Backend يبدأ بدون أخطاء
  ```bash
  cd server
  npm run dev
  ```

- [ ] Health check يعمل
  ```bash
  curl http://localhost:3001/health
  ```
  يجب أن ترى:
  ```json
  {"status":"ok","timestamp":"...","uptime":...}
  ```

- [ ] Database connection successful
  - تحقق من logs: `✅ Database connection pool created`

### Frontend
- [ ] Frontend يبدأ بدون أخطاء
  ```bash
  npm run dev
  ```

- [ ] يفتح على http://localhost:5173

- [ ] لا توجد errors في console

---

## 🧪 Functionality Testing

### Pages Load
- [ ] Dashboard يفتح
- [ ] Conversations يفتح
- [ ] Training Materials يفتح
- [ ] Appearance يفتح
- [ ] Try My Agent يفتح
- [ ] Embed يفتح
- [ ] Settings يفتح
- [ ] Demo يفتح

### Chat Widget
- [ ] Widget يظهر في الصفحات
- [ ] Ask-bar يعمل (يمكن الكتابة)
- [ ] Modal يفتح عند الكتابة
- [ ] يمكن إرسال رسالة
- [ ] يظهر loading state
- [ ] يأتي رد من AI
- [ ] Sources تظهر (إذا وجدت)

### Error Handling
- [ ] Error UI يظهر عند الفشل
- [ ] Retry button يعمل
- [ ] يمكن إغلاق Error

### Configuration
- [ ] تغيير الألوان في Appearance يعمل
- [ ] Live Preview يتحدث فوراً
- [ ] التغييرات تحفظ (localStorage)
- [ ] Reset button يعمل

---

## 🔍 API Testing

### Chat Endpoint
- [ ] POST /api/chat يعمل
  ```bash
  curl -X POST http://localhost:3001/api/chat \
    -H "Content-Type: application/json" \
    -H "X-User-Id: demo-user-id" \
    -d '{"question": "ما هو Sanad؟"}'
  ```

### Conversations Endpoint
- [ ] GET /api/chat/conversations يعمل
  ```bash
  curl http://localhost:3001/api/chat/conversations \
    -H "X-User-Id: demo-user-id"
  ```

### Materials Endpoint
- [ ] GET /api/materials يعمل
  ```bash
  curl http://localhost:3001/api/materials \
    -H "X-User-Id: demo-user-id"
  ```

---

## 📊 Performance Check

### Response Times
- [ ] Health check < 100ms
- [ ] Chat response < 5s (أول مرة)
- [ ] Chat response < 3s (بعد ذلك)
- [ ] Page load < 2s

### Database
- [ ] Queries تعمل بسرعة
- [ ] Vector search يعمل
- [ ] No connection errors

### Memory
- [ ] Backend memory usage معقول (< 500MB)
- [ ] Frontend memory usage معقول (< 200MB)
- [ ] No memory leaks

---

## 🔒 Security Check

### Environment Variables
- [ ] API keys لا تظهر في الكود
- [ ] .env في .gitignore
- [ ] لا توجد secrets في Git history

### CORS
- [ ] CORS مضبوط صحيح
- [ ] Frontend يمكنه الوصول للـ Backend
- [ ] No CORS errors في console

### Rate Limiting
- [ ] Rate limiting يعمل
- [ ] يمنع الطلبات الزائدة

---

## 📝 Documentation Review

- [ ] README.md مقروء
- [ ] COMPLETE_SETUP_GUIDE.md مفهوم
- [ ] PROJECT_STATUS.md محدث
- [ ] جميع الـ scripts موثقة

---

## 🎉 Final Checks

### Functionality
- [ ] يمكن إرسال رسائل والحصول على ردود
- [ ] الردود دقيقة (بناءً على المواد التدريبية)
- [ ] Sources صحيحة
- [ ] Conversations تحفظ في Database

### User Experience
- [ ] UI responsive
- [ ] Loading states واضحة
- [ ] Error messages مفيدة
- [ ] Navigation سلس

### Code Quality
- [ ] No console errors
- [ ] No TypeScript errors (أو warnings فقط)
- [ ] Code formatted
- [ ] Comments واضحة

---

## ✅ Ready for Next Steps

إذا أكملت جميع النقاط أعلاه، أنت جاهز لـ:

### Immediate
- [ ] إضافة مواد تدريبية خاصة بك
- [ ] تخصيص المظهر
- [ ] اختبار مع أسئلة حقيقية

### Soon
- [ ] إضافة Materials Upload UI
- [ ] ربط Conversations page
- [ ] إضافة JWT authentication

### Future
- [ ] Deploy على Railway
- [ ] إضافة monitoring
- [ ] إضافة analytics

---

## 🐛 If Something Fails

### Database Issues
```bash
# إعادة تعيين Database
cd server
npm run db:reset
```

### Backend Issues
```bash
# تحقق من logs
cd server
npm run dev
# راقب الأخطاء
```

### Frontend Issues
```bash
# مسح cache
rm -rf node_modules/.vite
npm run dev
```

### Still Having Issues?
راجع [`COMPLETE_SETUP_GUIDE.md`](./COMPLETE_SETUP_GUIDE.md#-حل-المشاكل-الشائعة)

---

## 📞 Need Help?

1. راجع Documentation
2. تحقق من logs (Backend & Frontend)
3. راجع GitHub Issues
4. اسأل في Discussions

---

**آخر تحديث**: الجلسة الحالية

**الحالة**: ✅ جاهز للاستخدام!
