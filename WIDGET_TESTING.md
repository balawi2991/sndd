# 🧪 اختبار الـ Widget

## المشكلة التي تم حلها

### المشكلة 1: Bot ID يتغير
**السبب:** React Query كان يعيد تحميل البيانات
**الحل:** 
- إضافة `staleTime: Infinity` و `cacheTime: Infinity`
- عدم عرض الكود حتى يتم تحميل Bot ID

### المشكلة 2: Widget لا يظهر (ERR_BLOCKED_BY_RESPONSE)
**السبب:** CORS headers غير صحيحة للـ JavaScript file
**الحل:**
- إضافة route خاص لـ `/widget.js` مع CORS headers صحيحة
- إضافة `crossorigin="anonymous"` للـ script tag
- إضافة `load` event listener

---

## كيف تختبر الآن

### 1. احصل على Bot ID
```
1. سجل دخول
2. اذهب إلى Embed Code
3. انسخ Bot ID (مثل: bot_abc123xyz)
```

### 2. اختبر محلياً
```html
<!-- افتح test-local.html -->
<!-- استبدل YOUR_BOT_ID_HERE بـ Bot ID الخاص بك -->
```

### 3. اختبر على موقعك
```html
<!DOCTYPE html>
<html>
<body>
  <h1>موقعي</h1>
  
  <!-- الصق هنا قبل </body> -->
  <script src="https://sndd-production.up.railway.app/widget.js" crossorigin="anonymous"></script>
  <script>
    window.addEventListener('load', function() {
      if (typeof MintChat !== 'undefined') {
        MintChat.init('YOUR_BOT_ID_HERE');
      } else {
        console.error('MintChat failed to load');
      }
    });
  </script>
</body>
</html>
```

---

## التحقق من النجاح

### في Console (F12):
```
✅ يجب أن ترى:
Page loaded, checking for MintChat...
✅ MintChat loaded successfully
MintChat version: 1.0.0
MintChat: Initializing widget with Bot ID: bot_abc123xyz
MintChat: Configuration loaded successfully
MintChat: Widget initialized successfully ✓
```

### في الصفحة:
```
✅ يجب أن ترى:
- شريط سؤال في الأسفل (Ask Bar)
- عند الكتابة، يفتح Modal
- يمكنك إرسال رسائل
```

---

## الأخطاء الشائعة

### 1. "MintChat is not defined"
**السبب:** Script لم يتم تحميله
**الحل:**
- تحقق من اتصال الإنترنت
- تحقق من URL: `https://sndd-production.up.railway.app/widget.js`
- افتح URL في المتصفح - يجب أن يظهر الكود

### 2. "Bot not found"
**السبب:** Bot ID خاطئ
**الحل:**
- تحقق من Bot ID في صفحة Embed Code
- انسخه بدقة (بدون مسافات)

### 3. "ERR_BLOCKED_BY_RESPONSE"
**السبب:** CORS headers (تم حله)
**الحل:**
- تأكد من استخدام `crossorigin="anonymous"`
- تأكد من أن السيرفر محدّث

---

## الكود النهائي الصحيح

```html
<!-- MintChat Widget -->
<script src="https://sndd-production.up.railway.app/widget.js" crossorigin="anonymous"></script>
<script>
  window.addEventListener('load', function() {
    if (typeof MintChat !== 'undefined') {
      MintChat.init('YOUR_BOT_ID_HERE');
    } else {
      console.error('MintChat failed to load');
    }
  });
</script>
```

**استبدل `YOUR_BOT_ID_HERE` بـ Bot ID الخاص بك!**

---

## ملاحظات مهمة

1. **Bot ID ثابت** - لن يتغير أبداً
2. **الكود ثابت** - نفس الكود دائماً
3. **يعمل على أي موقع** - CORS مفعّل
4. **لا حاجة لتحديثات** - يعمل للأبد

---

*آخر تحديث: 2025-10-20*
*الحالة: تم الإصلاح ✅*
