# 🗄️ دليل MongoDB على Railway

## ✅ كيف تتأكد أن MongoDB يعمل بشكل صحيح

---

## 1️⃣ إضافة MongoDB Service

### الخطوات:
1. اذهب إلى Railway project dashboard
2. اضغط **"+ New"**
3. اختر **"Database"**
4. اختر **"MongoDB"**
5. انتظر ~30 ثانية للتجهيز

### ما يحدث تلقائياً:
- ✅ Railway ينشئ MongoDB instance
- ✅ يولد connection string تلقائياً
- ✅ يضيف `MONGODB_URI` و `MONGO_URL` للمتغيرات

---

## 2️⃣ التحقق من المتغيرات

### اذهب إلى service الخاص بك → Variables

يجب أن تجد:

```
✅ MONGODB_URI=mongodb://mongo:xxxxx@containers-us-west-xxx.railway.app:7439
✅ MONGO_URL=mongodb://mongo:xxxxx@containers-us-west-xxx.railway.app:7439
```

**ملاحظة:** إذا لم تجدها، تأكد من:
1. MongoDB service يعمل (أخضر)
2. أعد نشر التطبيق

---

## 3️⃣ التحقق من الاتصال

### في Railway Logs:

بعد النشر، ابحث عن:

```
✅ MongoDB connected successfully
✅ Server running on port 3000
```

### إذا رأيت خطأ:

```
❌ MongoDB connection failed
```

**الحلول:**
1. تحقق من أن MongoDB service يعمل
2. تحقق من وجود `MONGODB_URI` في Variables
3. أعد نشر التطبيق

---

## 4️⃣ اختبار الاتصال من التطبيق

### افتح الرابط وأضف `/api/health`:

```
https://your-app.up.railway.app/api/health
```

يجب أن ترى:
```json
{
  "status": "ok",
  "timestamp": "2024-01-19T..."
}
```

### إذا رأيت خطأ 500:
- تحقق من Railway logs
- تحقق من MongoDB connection

---

## 5️⃣ اختبار التسجيل

### جرّب إنشاء حساب:

1. افتح التطبيق
2. اذهب إلى Sign Up
3. سجّل حساب جديد
4. إذا نجح → MongoDB يعمل! ✅

### إذا فشل:
- افتح Browser Console (F12)
- ابحث عن الخطأ
- تحقق من Railway logs

---

## 6️⃣ مراقبة MongoDB

### في Railway Dashboard:

1. اضغط على MongoDB service
2. اذهب إلى **Metrics** tab
3. راقب:
   - ✅ CPU Usage
   - ✅ Memory Usage
   - ✅ Network Traffic

---

## 🔧 إعدادات MongoDB في المشروع

### في `server/config/database.ts`:

```typescript
export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL;
  
  if (!mongoUri) {
    throw new Error('MongoDB URI is not defined');
  }

  await mongoose.connect(mongoUri);
  console.log('✅ MongoDB connected successfully');
};
```

**هذا يعني:**
- ✅ يبحث عن `MONGODB_URI` أولاً
- ✅ إذا لم يجدها، يبحث عن `MONGO_URL`
- ✅ إذا لم يجد أي منهما، يرمي خطأ

---

## 📊 Models الموجودة

### 4 Models جاهزة:

1. **User** - المستخدمين
   ```typescript
   - name: String
   - email: String (unique)
   - password: String (hashed)
   ```

2. **Conversation** - المحادثات
   ```typescript
   - userId: ObjectId
   - title: String
   - messages: Array
   - unread: Boolean
   ```

3. **TrainingMaterial** - مواد التدريب
   ```typescript
   - userId: ObjectId
   - type: 'file' | 'link' | 'text'
   - content: String
   - status: 'trained' | 'untrained'
   ```

4. **Appearance** - إعدادات المظهر
   ```typescript
   - userId: ObjectId
   - primaryColor: String
   - logo: String
   - suggestedQuestions: Array
   ```

---

## ✅ Checklist التحقق:

### في Railway:
- [ ] MongoDB service مضاف
- [ ] MongoDB service يعمل (أخضر)
- [ ] `MONGODB_URI` موجود في Variables
- [ ] التطبيق deployed بنجاح

### في Logs:
- [ ] "MongoDB connected successfully"
- [ ] "Server running on port 3000"
- [ ] لا أخطاء connection

### في التطبيق:
- [ ] `/api/health` يعمل
- [ ] Sign up يعمل
- [ ] Sign in يعمل
- [ ] Dashboard يفتح

---

## 🆘 مشاكل شائعة وحلولها

### 1. "MongoDB URI is not defined"
**السبب:** المتغير غير موجود
**الحل:**
- تأكد من إضافة MongoDB service
- أعد نشر التطبيق

### 2. "MongoDB connection failed"
**السبب:** Connection string خاطئ أو MongoDB لا يعمل
**الحل:**
- تحقق من أن MongoDB service يعمل
- تحقق من صحة `MONGODB_URI`
- أعد تشغيل MongoDB service

### 3. "Authentication failed"
**السبب:** Username/Password خاطئ في connection string
**الحل:**
- احذف MongoDB service
- أضفه من جديد
- أعد نشر التطبيق

### 4. "Network timeout"
**السبب:** مشكلة في الشبكة
**الحل:**
- انتظر قليلاً وحاول مرة أخرى
- تحقق من Railway status page

---

## 📝 ملاحظات مهمة

### ✅ لا تحتاج:
- ❌ إنشاء database يدوياً
- ❌ إنشاء collections يدوياً
- ❌ إضافة indexes يدوياً

### ✅ يحدث تلقائياً:
- ✅ Database يُنشأ عند أول اتصال
- ✅ Collections تُنشأ عند أول استخدام
- ✅ Indexes تُنشأ من Models

---

## 🎯 الخطوات التالية

بعد التأكد من MongoDB:

1. ✅ اختبر Sign up
2. ✅ اختبر Sign in
3. ✅ أضف training material
4. ✅ خصّص appearance
5. ✅ جرّب chat widget
6. ✅ تحقق من conversations

---

## 🔗 روابط مفيدة

- **Railway Docs**: https://docs.railway.app/databases/mongodb
- **Mongoose Docs**: https://mongoosejs.com/docs/
- **MongoDB Docs**: https://www.mongodb.com/docs/

---

**MongoDB جاهز ويعمل! ✅**

فقط تأكد من الخطوات أعلاه وكل شيء سيعمل بشكل مثالي!
