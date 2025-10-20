# 🔑 كيف تحصل على Bot ID الثابت الخاص بك

## ❓ ما هو Bot ID؟

**Bot ID** هو معرّف فريد وثابت لحسابك. يُستخدم لتحميل chatbot الخاص بك على أي موقع.

### خصائص Bot ID:
- ✅ **فريد** - لا يوجد اثنان متشابهان
- ✅ **ثابت** - لن يتغير أبداً
- ✅ **آمن** - مرتبط بحسابك فقط
- ✅ **دائم** - يبقى معك للأبد

---

## 📍 أين تجد Bot ID الخاص بك؟

### الطريقة 1: من صفحة Embed Code (الأسهل)

1. سجل دخول إلى لوحة التحكم
2. من القائمة الجانبية، اضغط على **"Embed Code"**
3. ستجد Bot ID الخاص بك في صندوق أخضر:
   ```
   Your Bot ID: bot_abc123xyz789
   ```
4. انسخه واستخدمه!

### الطريقة 2: من API

إذا كنت مطوراً، يمكنك الحصول عليه من API:

```javascript
// GET /api/auth/profile
// Headers: Authorization: Bearer YOUR_JWT_TOKEN

fetch('https://sndd-production.up.railway.app/api/auth/profile', {
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  }
})
.then(res => res.json())
.then(data => {
  console.log('Bot ID:', data.botId);
});
```

---

## 🔄 هل يتغير Bot ID؟

**لا، أبداً!**

Bot ID يتم توليده **مرة واحدة فقط** عند إنشاء حسابك، ويبقى ثابتاً إلى الأبد.

### متى يتم توليده؟
- عند التسجيل (Sign Up)
- تلقائياً بواسطة النظام
- لا يمكن تغييره يدوياً

### لماذا هو ثابت؟
- حتى تتمكن من استخدامه على موقعك بأمان
- لا داعي لتحديث الكود في كل مرة
- يعمل مدى الحياة

---

## 📝 كيف تستخدم Bot ID؟

### في كود الـ Embed:

```html
<!-- MintChat Widget -->
<script src="https://sndd-production.up.railway.app/widget.js"></script>
<script>
  MintChat.init('bot_abc123xyz789'); // ضع Bot ID هنا
</script>
```

### مثال كامل:

```html
<!DOCTYPE html>
<html>
<head>
  <title>موقعي</title>
</head>
<body>
  <h1>مرحباً بك</h1>
  
  <!-- محتوى الموقع -->
  
  <!-- MintChat Widget -->
  <script src="https://sndd-production.up.railway.app/widget.js"></script>
  <script>
    MintChat.init('bot_abc123xyz789'); // استبدل بـ Bot ID الخاص بك
  </script>
</body>
</html>
```

---

## ⚠️ تحذيرات مهمة

### ❌ لا تفعل:
- **لا تشارك** Bot ID مع أشخاص آخرين
- **لا تستخدم** Bot ID شخص آخر
- **لا تحاول** تغيير Bot ID يدوياً

### ✅ افعل:
- **احتفظ** بـ Bot ID في مكان آمن
- **استخدمه** على موقعك فقط
- **انسخه** بدقة (بدون مسافات)

---

## 🔍 التحقق من Bot ID

### كيف تتأكد أنه صحيح؟

#### 1. الشكل الصحيح:
```
bot_abc123xyz789
```
- يبدأ بـ `bot_`
- يتبعه أحرف وأرقام عشوائية
- طوله حوالي 20-30 حرف

#### 2. اختبار في Console:
```javascript
// افتح Console (F12) في موقعك
// يجب أن ترى:
MintChat: Initializing widget with Bot ID: bot_abc123xyz789
MintChat: Configuration loaded successfully ✓
```

#### 3. اختبار الـ API:
```bash
curl https://sndd-production.up.railway.app/api/widget/bot_abc123xyz789/config
```

إذا كان صحيحاً، ستحصل على:
```json
{
  "botId": "bot_abc123xyz789",
  "config": {
    "logo": "...",
    "primaryColor": "#17B26A",
    ...
  }
}
```

---

## 🆘 مشاكل شائعة

### المشكلة 1: "Bot not found"

**السبب:** Bot ID خاطئ أو غير موجود

**الحل:**
1. تحقق من Bot ID في صفحة Embed Code
2. انسخه مرة أخرى بدقة
3. تأكد من عدم وجود مسافات إضافية

### المشكلة 2: الـ widget لا يظهر

**السبب:** Bot ID صحيح لكن الكود في مكان خاطئ

**الحل:**
1. تأكد أن الكود **قبل** `</body>`
2. تأكد أن Bot ID بين علامات التنصيص `'bot_...'`
3. افتح Console وتحقق من الأخطاء

### المشكلة 3: "Failed to load configuration"

**السبب:** مشكلة في الاتصال بالسيرفر

**الحل:**
1. تحقق من اتصال الإنترنت
2. تحقق أن السيرفر يعمل
3. جرب مرة أخرى بعد دقيقة

---

## 💡 نصائح احترافية

### نصيحة 1: احفظ Bot ID في ملف
```javascript
// config.js
export const MINTCHAT_BOT_ID = 'bot_abc123xyz789';

// في موقعك
import { MINTCHAT_BOT_ID } from './config.js';
MintChat.init(MINTCHAT_BOT_ID);
```

### نصيحة 2: استخدم Environment Variables
```javascript
// في React/Next.js
const botId = process.env.REACT_APP_MINTCHAT_BOT_ID;
MintChat.init(botId);
```

### نصيحة 3: أضف تعليق توضيحي
```html
<!-- MintChat Widget -->
<!-- Bot ID: bot_abc123xyz789 -->
<!-- Last Updated: 2025-10-20 -->
<script src="https://sndd-production.up.railway.app/widget.js"></script>
<script>
  MintChat.init('bot_abc123xyz789');
</script>
```

---

## 📚 موارد إضافية

- [دليل التثبيت الكامل](./EMBED_GUIDE.md)
- [استكشاف الأخطاء](./EMBED_GUIDE.md#-استكشاف-الأخطاء)
- [أمثلة متقدمة](./EMBED_GUIDE.md#-أمثلة-متقدمة)

---

## ✅ الخلاصة

Bot ID هو:
- ✅ معرّف فريد لحسابك
- ✅ ثابت ولا يتغير
- ✅ تجده في صفحة Embed Code
- ✅ تستخدمه في كود الـ widget
- ✅ يعمل على أي موقع

**احصل على Bot ID الآن من لوحة التحكم!** 🚀

---

*آخر تحديث: 2025-10-20*
