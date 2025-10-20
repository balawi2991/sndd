# 🧪 دليل اختبار الـ Embed

## ✅ ما تم إصلاحه

### المشاكل السابقة:
1. ❌ لا يوجد `widget.css` منفصل
2. ❌ Express لا يخدم `public/` folder
3. ❌ CSS غير محمّل

### الحلول:
1. ✅ CSS inline داخل `widget.js`
2. ✅ Express يخدم `public/` folder
3. ✅ كل شيء في ملف واحد

---

## 🧪 كيف تختبر الآن؟

### الطريقة 1: Local Testing

#### 1. احصل على botId
```bash
# 1. Sign in to dashboard
# 2. Go to /app/embed
# 3. Copy your botId (مثل: bot_abc123xyz)
```

#### 2. حدّث test-embed.html
```html
<!-- Replace YOUR_BOT_ID -->
<script src="http://localhost:8080/widget.js"></script>
<script>
  MintChat.init('bot_abc123xyz'); // ضع botId الحقيقي
</script>
```

#### 3. افتح الملف
```bash
# افتح test-embed.html في المتصفح
# أو استخدم Live Server
```

#### 4. تحقق من:
- ✅ Ask-bar يظهر center-bottom
- ✅ بنفس الألوان من Appearance
- ✅ Modal يفتح عند الكتابة
- ✅ Suggested questions تظهر
- ✅ يمكن إرسال رسائل

---

### الطريقة 2: Production Testing

#### 1. بعد Deploy على Railway
```html
<script src="https://sndd-production.up.railway.app/widget.js"></script>
<script>
  MintChat.init('bot_abc123xyz');
</script>
```

#### 2. اختبر على موقع حقيقي
- ضع الكود في موقعك
- تحقق من أنه يعمل

---

## 🔍 Troubleshooting

### المشكلة: الويدجت لا يظهر

#### 1. تحقق من Console
```javascript
// افتح DevTools → Console
// يجب أن ترى:
"MintChat: Widget initialized successfully"

// إذا رأيت خطأ:
"MintChat: Failed to load configuration"
// → تحقق من botId
```

#### 2. تحقق من Network
```javascript
// DevTools → Network
// يجب أن ترى:
GET /widget.js → 200 OK
GET /api/widget/bot_xxx/config → 200 OK
```

#### 3. تحقق من botId
```bash
# تأكد أن botId صحيح
# يجب أن يبدأ بـ "bot_"
# مثال: bot_abc123xyz
```

---

### المشكلة: الألوان غير صحيحة

#### الحل:
```bash
# 1. اذهب إلى Appearance
# 2. غيّر الألوان
# 3. احفظ
# 4. حدّث الصفحة (Ctrl+F5)
# 5. يجب أن تتحدث الألوان
```

---

### المشكلة: الرسائل لا تُرسل

#### تحقق من:
```javascript
// Console errors
POST /api/widget/bot_xxx/message → 404?
// → botId غير صحيح

POST /api/widget/bot_xxx/message → 429?
// → Rate limit (انتظر 15 دقيقة)

POST /api/widget/bot_xxx/message → 500?
// → خطأ في السيرفر (تحقق من logs)
```

---

## 📋 Checklist للاختبار

### Widget Appearance
- [ ] Ask-bar يظهر center-bottom
- [ ] الحجم: 360px max-width
- [ ] الألوان صحيحة (من Appearance)
- [ ] RGB glow يعمل (إذا مفعّل)
- [ ] Logo يظهر (إذا موجود)

### Modal
- [ ] يفتح عند الكتابة
- [ ] الحجم: 720px × 80vh
- [ ] المسافة من Ask-bar: 32px
- [ ] Title صحيح
- [ ] Avatar يظهر (إذا مفعّل)
- [ ] Suggested questions تظهر

### Functionality
- [ ] يمكن الكتابة في Ask-bar
- [ ] Enter يرسل الرسالة
- [ ] Typing indicator يظهر
- [ ] الرد يظهر
- [ ] Sources تظهر (إذا موجودة)
- [ ] يمكن إغلاق Modal (X / Esc / Backdrop)

### Mobile
- [ ] يعمل على Mobile
- [ ] Responsive
- [ ] Touch-friendly

---

## 🎯 الاختبار الكامل

### Test Case 1: First Load
```
1. افتح test-embed.html
2. يجب أن يظهر Ask-bar فوراً
3. لا أخطاء في Console
```

### Test Case 2: Open Modal
```
1. اكتب حرف في Ask-bar
2. Modal يفتح فوراً
3. Suggested questions تظهر
4. Animation سلس
```

### Test Case 3: Send Message
```
1. اكتب رسالة
2. اضغط Enter
3. Typing indicator يظهر
4. الرد يظهر بعد 2-5 ثواني
5. Sources تظهر (إذا موجودة)
```

### Test Case 4: Multiple Messages
```
1. أرسل عدة رسائل
2. Conversation يُحفظ
3. conversationId يُستخدم
4. التمرير يعمل
```

### Test Case 5: Close & Reopen
```
1. أغلق Modal (X)
2. افتحه مرة أخرى
3. الرسائل لا تزال موجودة
4. يمكن المتابعة
```

---

## 🚀 للإنتاج

### 1. Deploy على Railway
```bash
git push origin main
# انتظر البناء (~2-3 دقائق)
```

### 2. احصل على URL
```
https://sndd-production.up.railway.app
```

### 3. اختبر Widget
```html
<script src="https://sndd-production.up.railway.app/widget.js"></script>
<script>
  MintChat.init('YOUR_BOT_ID');
</script>
```

### 4. شارك مع العملاء
- الكود جاهز في Embed Code page
- انسخه وشاركه
- يعمل فوراً!

---

## 💡 ملاحظات مهمة

### CSS
- ✅ Inline في widget.js
- ✅ لا يتعارض مع CSS الموقع
- ✅ Scoped للويدجت فقط

### Performance
- ✅ widget.js حجمه ~25KB
- ✅ يحمل مرة واحدة
- ✅ Config يُحمّل مرة واحدة
- ✅ Fast initialization

### Security
- ✅ botId عام (ليس سري)
- ✅ Rate limiting
- ✅ Session tracking
- ✅ لا يكشف user data

### Compatibility
- ✅ جميع المتصفحات الحديثة
- ✅ Mobile responsive
- ✅ No dependencies
- ✅ Standalone

---

## 🎉 الخلاصة

**الآن يمكنك:**
1. ✅ لصق الكود في أي موقع HTML
2. ✅ الويدجت يظهر فوراً
3. ✅ بنفس التنسيقات والألوان
4. ✅ يعمل بشكل كامل

**اختبر الآن:**
- افتح `test-embed.html`
- ضع botId الحقيقي
- يجب أن يعمل! 🚀

---

**تم بنجاح! 🎉**
