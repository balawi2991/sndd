# 📦 دليل نظام الـ Embed - MintChat

## 🎯 نظرة عامة

نظام الـ Embed يسمح لك بإضافة chatbot الذكي الخاص بك إلى أي موقع ويب بكود بسيط.

---

## ✅ كيف يعمل النظام

### 1. Bot ID الثابت
- كل مستخدم لديه **Bot ID فريد وثابت**
- يتم توليده تلقائياً عند التسجيل
- **لن يتغير أبداً** - يمكنك استخدامه بأمان
- مثال: `bot_abc123xyz789`

### 2. الكود البسيط
```html
<!-- MintChat Widget -->
<script src="https://sndd-production.up.railway.app/widget.js"></script>
<script>
  MintChat.init('YOUR_BOT_ID');
</script>
```

### 3. ماذا يحدث عند التحميل؟
1. يتم تحميل `widget.js` من السيرفر
2. يتصل بـ API لجلب إعدادات الـ Appearance
3. يعرض الـ widget بالتصميم الخاص بك
4. جاهز للاستخدام!

---

## 🚀 خطوات التثبيت

### الخطوة 1: احصل على Bot ID
1. سجل دخول إلى لوحة التحكم
2. اذهب إلى صفحة **Embed Code**
3. انسخ الـ **Bot ID** الخاص بك

### الخطوة 2: انسخ الكود
```html
<!-- MintChat Widget -->
<script src="https://sndd-production.up.railway.app/widget.js"></script>
<script>
  MintChat.init('bot_abc123xyz789'); // استبدل بـ Bot ID الخاص بك
</script>
```

### الخطوة 3: الصق في موقعك
- افتح ملف HTML الخاص بموقعك
- ابحث عن وسم `</body>` (قبل نهاية الصفحة)
- الصق الكود **قبل** وسم `</body>`

مثال:
```html
<!DOCTYPE html>
<html>
<head>
  <title>موقعي</title>
</head>
<body>
  <h1>مرحباً بك في موقعي</h1>
  
  <!-- محتوى الموقع -->
  
  <!-- MintChat Widget - الصق هنا -->
  <script src="https://sndd-production.up.railway.app/widget.js"></script>
  <script>
    MintChat.init('bot_abc123xyz789');
  </script>
</body>
</html>
```

### الخطوة 4: احفظ وارفع
- احفظ الملف
- ارفعه إلى السيرفر
- افتح موقعك - يجب أن يظهر الـ widget!

---

## 🎨 التخصيص

### كل الإعدادات من لوحة التحكم
لا تحتاج لتعديل الكود! كل شيء يُدار من صفحة **Appearance**:

- ✅ الألوان (Primary Color)
- ✅ الشعار (Logo)
- ✅ العنوان (Title)
- ✅ النص التوضيحي (Placeholder)
- ✅ الأسئلة المقترحة (Suggested Questions)
- ✅ الصورة الرمزية (Avatar)
- ✅ الحدود المتوهجة (Glowing Border)

**التغييرات تظهر فوراً** - لا حاجة لتحديث الكود!

---

## 🔧 استكشاف الأخطاء

### المشكلة: الـ widget لا يظهر

#### الحل 1: تحقق من Bot ID
```javascript
// افتح Console في المتصفح (F12)
// يجب أن ترى:
MintChat: Initializing widget with Bot ID: bot_abc123xyz789
MintChat: Configuration loaded successfully
MintChat: Widget initialized successfully ✓
```

#### الحل 2: تحقق من موقع الكود
- يجب أن يكون **قبل** `</body>`
- ليس في `<head>`
- ليس بعد `</body>`

#### الحل 3: تحقق من الأخطاء
```javascript
// في Console:
// إذا رأيت "Bot not found" - Bot ID خاطئ
// إذا رأيت "Failed to load" - مشكلة في الاتصال
```

### المشكلة: الـ widget يظهر لكن لا يرد

#### الحل 1: تحقق من Training Materials
- يجب أن يكون لديك محتوى تدريبي
- اذهب إلى **Training Materials**
- أضف ملفات أو روابط أو نصوص

#### الحل 2: تحقق من الاتصال
```javascript
// في Console عند إرسال رسالة:
// يجب أن ترى طلب POST إلى:
// https://sndd-production.up.railway.app/api/widget/{botId}/message
```

---

## 🌐 التوافق

### المتصفحات المدعومة
- ✅ Chrome (آخر إصدارين)
- ✅ Firefox (آخر إصدارين)
- ✅ Safari (آخر إصدارين)
- ✅ Edge (آخر إصدارين)
- ✅ Mobile browsers

### المنصات المدعومة
- ✅ WordPress
- ✅ Shopify
- ✅ Wix
- ✅ Squarespace
- ✅ HTML/CSS/JS عادي
- ✅ React/Vue/Angular (كـ script tag)

---

## 📱 الاستجابة للموبايل

الـ widget **responsive تلقائياً**:
- على Desktop: 720px عرض
- على Mobile: ملء الشاشة
- يتكيف مع حجم الشاشة

---

## 🔒 الأمان

### CORS
- مفعّل للجميع
- يعمل من أي domain
- آمن ومعزول

### البيانات
- كل مستخدم معزول
- لا يمكن الوصول لبيانات مستخدمين آخرين
- Session tracking آمن

### Rate Limiting
- حماية من الإساءة
- 100 رسالة/ساعة لكل IP
- تلقائي وشفاف

---

## 🧪 الاختبار

### اختبار محلي
1. أنشئ ملف `test.html`
2. الصق الكود
3. افتح في المتصفح
4. يجب أن يعمل!

### اختبار على موقعك
1. ارفع الملف
2. افتح الموقع
3. افتح Console (F12)
4. تحقق من الرسائل

### صفحة الاختبار الجاهزة
```
https://sndd-production.up.railway.app/test-embed.html
```

---

## 💡 نصائح مهمة

### ✅ افعل
- استخدم Bot ID الصحيح
- ضع الكود قبل `</body>`
- أضف محتوى تدريبي
- اختبر قبل النشر

### ❌ لا تفعل
- لا تشارك Bot ID مع الآخرين
- لا تضع الكود في `<head>`
- لا تعدل `widget.js` يدوياً
- لا تنسخ كود مستخدم آخر

---

## 🎓 أمثلة متقدمة

### مثال 1: تحميل مشروط
```html
<script>
  // حمّل الـ widget فقط على صفحات معينة
  if (window.location.pathname === '/support') {
    const script = document.createElement('script');
    script.src = 'https://sndd-production.up.railway.app/widget.js';
    script.onload = () => {
      MintChat.init('bot_abc123xyz789');
    };
    document.body.appendChild(script);
  }
</script>
```

### مثال 2: تأخير التحميل
```html
<script>
  // حمّل الـ widget بعد 3 ثواني
  setTimeout(() => {
    const script = document.createElement('script');
    script.src = 'https://sndd-production.up.railway.app/widget.js';
    script.onload = () => {
      MintChat.init('bot_abc123xyz789');
    };
    document.body.appendChild(script);
  }, 3000);
</script>
```

### مثال 3: Event Tracking
```html
<script>
  // تتبع متى يتم تحميل الـ widget
  window.addEventListener('load', () => {
    const script = document.createElement('script');
    script.src = 'https://sndd-production.up.railway.app/widget.js';
    script.onload = () => {
      MintChat.init('bot_abc123xyz789');
      console.log('Widget loaded at:', new Date());
      
      // أرسل إلى Google Analytics
      if (window.gtag) {
        gtag('event', 'widget_loaded', {
          'event_category': 'engagement',
          'event_label': 'MintChat Widget'
        });
      }
    };
    document.body.appendChild(script);
  });
</script>
```

---

## 📊 المراقبة

### في لوحة التحكم
- عدد المحادثات
- عدد الرسائل
- الأسئلة الشائعة
- معدل الاستجابة

### في Console
```javascript
// تحقق من حالة الـ widget
console.log(window.MintChat);
// {init: ƒ, version: "1.0.0"}
```

---

## 🆘 الدعم

### إذا واجهت مشكلة:
1. تحقق من Console (F12)
2. تحقق من Bot ID
3. تحقق من موقع الكود
4. جرب صفحة الاختبار
5. تواصل مع الدعم

### معلومات مفيدة للدعم:
- Bot ID الخاص بك
- رابط موقعك
- رسائل الأخطاء من Console
- لقطة شاشة

---

## 🎉 الخلاصة

نظام الـ Embed بسيط وقوي:
- ✅ Bot ID ثابت لا يتغير
- ✅ كود بسيط (3 أسطر)
- ✅ يعمل على أي موقع
- ✅ تخصيص كامل من لوحة التحكم
- ✅ responsive تلقائياً
- ✅ آمن ومحمي

**ابدأ الآن!** 🚀

---

*آخر تحديث: 2025-10-20*
