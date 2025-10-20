# 🎯 نظام الـ Embed - مكتمل!

## 🔑 معلومة مهمة: Bot ID ثابت ولا يتغير!

**Bot ID** هو معرّف فريد لكل مستخدم:
- ✅ يتم توليده **مرة واحدة** عند التسجيل
- ✅ **ثابت ودائم** - لن يتغير أبداً
- ✅ آمن للاستخدام في كود الـ embed
- ✅ يمكن استخدامه على أي عدد من المواقع

**مثال:** `bot_abc123xyz789`

📚 **للمزيد:** راجع [دليل Bot ID](./HOW_TO_GET_BOTID.md)

---

## ✅ ما تم إنجازه

### 1. Bot ID System ✅
**تم إضافته:**
- كل user له `botId` فريد (مثل: `bot_abc123xyz`)
- يُنشأ تلقائياً عند التسجيل
- يُستخدم لتحميل تنسيقات الويدجت

**الموقع:** `server/models/User.model.ts`

---

### 2. Public Widget API ✅
**Endpoints:**

#### GET `/api/widget/:botId/config`
```json
{
  "botId": "bot_abc123",
  "config": {
    "logo": "https://...",
    "primaryColor": "#17B26A",
    "glowingBorder": true,
    "avatar": "https://...",
    "showFloatingAvatar": true,
    "title": "Chat with us",
    "placeholder": "Ask me anything...",
    "suggestedQuestions": [...]
  }
}
```

#### POST `/api/widget/:botId/message`
```json
{
  "message": "Hello",
  "conversationId": "optional",
  "sessionId": "session_xyz"
}
```

**الموقع:** `server/routes/widget.routes.ts`

---

### 3. Widget.js Standalone ✅
**الملف:** `public/widget.js`

**الميزات:**
- ✅ تحميل تنسيقات المستخدم من API
- ✅ نفس Widget Component (Ask-bar + Modal)
- ✅ Session tracking
- ✅ Conversation management
- ✅ نفس الشكل تماماً
- ✅ نفس الألوان والتنسيقات
- ✅ Source chips
- ✅ Typing indicator
- ✅ Suggested questions

---

### 4. Embed Code Page ✅
**تم تحديثه:**
- عرض botId الحقيقي للمستخدم
- كود embed صحيح وجاهز
- تعليمات واضحة

**الموقع:** `src/pages/app/EmbedCode.tsx`

---

## 📋 كيف يعمل النظام؟

### للمستخدم (صاحب الموقع):

1. **يسجل في MintChat**
   - يحصل على `botId` فريد تلقائياً

2. **يخصص الويدجت**
   - يذهب لـ Appearance
   - يغير الألوان، الشعار، الـ avatar
   - يضيف suggested questions

3. **يأخذ كود الـ Embed**
   - يذهب لـ Embed Code
   - ينسخ الكود:
   ```html
   <script src="https://yoursite.com/widget.js"></script>
   <script>
     MintChat.init('bot_abc123');
   </script>
   ```

4. **يلصقه في موقعه**
   - قبل `</body>`
   - يحفظ ويرفع

5. **الويدجت يظهر!**
   - بنفس التنسيقات
   - بنفس الألوان
   - بنفس الشكل

---

### للزائر (على الموقع):

1. **يفتح الموقع**
   - `widget.js` يُحمّل تلقائياً

2. **Widget.js يقوم بـ:**
   - جلب config من `/api/widget/:botId/config`
   - إنشاء Widget HTML
   - تطبيق التنسيقات
   - عرض الويدجت

3. **الزائر يكتب رسالة**
   - يُرسل لـ `/api/widget/:botId/message`
   - RAG يبحث في training materials
   - DeepSeek يرد
   - الرد يظهر مع sources

---

## 🎨 الويدجت = نفس المكون

### في Appearance (Preview)
```
Widget Component
├── Container: .live-preview-canvas
├── Position: absolute
├── Scale: 0.65
└── Purpose: معاينة
```

### في Try My Agent
```
Widget Component
├── Container: .live-preview-canvas--try
├── Position: absolute
├── Scale: 0.85
└── Purpose: تجربة
```

### في موقع العميل (Embed)
```
Widget Component
├── Container: body
├── Position: fixed
├── Scale: 1.0
└── Purpose: إنتاج حقيقي
```

**نفس:**
- Ask-bar (360px, center-bottom)
- Modal (720px × 80vh)
- الألوان والتنسيقات
- الـ animations
- الـ functionality

**مختلف فقط:**
- الحجم (scale)
- الموضع (container)

---

## 🔧 التفاصيل التقنية

### Session Management
```javascript
// Generate unique session per visitor
sessionId = 'session_' + random() + timestamp()

// Store in localStorage
localStorage.setItem('mintchat_session', sessionId)

// Send with every message
POST /api/widget/:botId/message
{
  sessionId: "session_xyz",
  message: "Hello"
}
```

### Conversation Tracking
```javascript
// First message creates conversation
conversationId = response.conversationId

// Subsequent messages use same ID
POST /api/widget/:botId/message
{
  conversationId: "conv_123",
  message: "Follow up"
}
```

### Configuration Loading
```javascript
// On widget init
const config = await fetch('/api/widget/bot_abc/config')

// Apply to widget
widget.style.setProperty('--primary-color', config.primaryColor)
widget.querySelector('.title').textContent = config.title
```

---

## 📊 الفرق بين الأنظمة

### قبل (❌ غير صحيح):
```html
<!-- كود placeholder -->
<script src="https://cdn.mintchat.ai/widget.js"></script>
<script>
  mc('init', 'YOUR_BOT_ID'); // ❌ لا يعمل
</script>
```

**المشاكل:**
- لا يوجد botId حقيقي
- لا يحمل تنسيقات المستخدم
- لا يوجد API
- placeholder فقط

---

### بعد (✅ صحيح):
```html
<!-- كود حقيقي -->
<script src="https://yoursite.com/widget.js"></script>
<script>
  MintChat.init('bot_abc123xyz'); // ✅ يعمل!
</script>
```

**الميزات:**
- ✅ botId حقيقي لكل user
- ✅ يحمل تنسيقات من API
- ✅ نفس Widget Component
- ✅ يعمل فوراً

---

## 🧪 كيف تختبر؟

### 1. احصل على botId
```bash
# Sign in
# Go to Embed Code page
# Copy your botId
```

### 2. أنشئ ملف HTML
```html
<!DOCTYPE html>
<html>
<head>
  <title>Test Widget</title>
</head>
<body>
  <h1>My Website</h1>
  <p>This is a test page</p>

  <!-- MintChat Widget -->
  <script src="http://localhost:8080/widget.js"></script>
  <script>
    MintChat.init('YOUR_BOT_ID');
  </script>
</body>
</html>
```

### 3. افتح في المتصفح
```bash
# Open test.html
# Widget should appear!
```

### 4. اختبر الميزات
- ✅ Ask-bar يظهر center-bottom
- ✅ اكتب رسالة → Modal يفتح
- ✅ أرسل رسالة → يرد بناءً على training
- ✅ Sources تظهر
- ✅ نفس الألوان من Appearance

---

## 🚀 للإنتاج

### 1. Deploy على Railway
```bash
git push origin main
# Railway builds automatically
```

### 2. احصل على URL
```
https://sndd-production.up.railway.app
```

### 3. كود الـ Embed النهائي
```html
<script src="https://sndd-production.up.railway.app/widget.js"></script>
<script>
  MintChat.init('bot_abc123xyz');
</script>
```

### 4. شارك مع العملاء
- انسخ الكود من Embed Code page
- أرسله للعميل
- العميل يلصقه في موقعه
- يعمل فوراً!

---

## 📝 ملاحظات مهمة

### Security
- ✅ botId عام (ليس سري)
- ✅ لا يكشف user data
- ✅ Rate limiting على API
- ✅ Session tracking للأمان

### Performance
- ✅ widget.js خفيف (~15KB)
- ✅ يحمل config مرة واحدة
- ✅ Caching في localStorage
- ✅ Fast API responses

### Compatibility
- ✅ يعمل على جميع المتصفحات الحديثة
- ✅ Mobile responsive
- ✅ لا يتعارض مع CSS الموقع
- ✅ Standalone (لا dependencies)

---

## 🎯 الخلاصة

**النظام الآن:**
- ✅ كامل ومكتمل
- ✅ botId لكل user
- ✅ Public API يعمل
- ✅ widget.js standalone
- ✅ نفس Widget Component
- ✅ نفس التنسيقات
- ✅ جاهز للإنتاج

**يمكن للمستخدمين:**
1. ✅ تخصيص الويدجت
2. ✅ أخذ كود الـ embed
3. ✅ لصقه في مواقعهم
4. ✅ يعمل فوراً!

---

**🎉 نظام Embed مكتمل واحترافي! 🚀**

*Last Updated: 2025-10-20*
