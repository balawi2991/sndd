# 📦 Public Files

هذا المجلد يحتوي على الملفات العامة التي يتم تقديمها مباشرة.

## 📁 الملفات

### widget.js
**الوصف:** Standalone widget script للـ embed على المواقع الخارجية

**الاستخدام:**
```html
<script src="https://sndd-production.up.railway.app/widget.js"></script>
<script>
  MintChat.init('YOUR_BOT_ID');
</script>
```

**الميزات:**
- ✅ Self-contained (لا dependencies)
- ✅ يحمل config من API
- ✅ نفس Widget Component
- ✅ CORS enabled
- ✅ ~15KB حجم

---

### test-embed.html
**الوصف:** صفحة اختبار للـ widget

**الاستخدام:**
```
https://sndd-production.up.railway.app/test-embed.html
```

**الميزات:**
- ✅ تصميم جميل بالعربية
- ✅ تعليمات واضحة
- ✅ أمثلة على الكود
- ✅ جاهز للاستخدام

---

## 🚀 كيف يتم تقديمها؟

### في Production (Railway):
```typescript
// server/index.ts
const publicPath = path.resolve(process.cwd(), 'public');
app.use(express.static(publicPath));
```

### URLs:
- `https://sndd-production.up.railway.app/widget.js`
- `https://sndd-production.up.railway.app/test-embed.html`

---

## 📝 ملاحظات

### widget.js:
- يجب أن يكون متاحاً للجميع (public)
- CORS مفعّل
- لا يحتاج authentication
- يُحمّل من أي domain

### test-embed.html:
- صفحة اختبار اختيارية
- يمكن حذفها في الإنتاج
- مفيدة للتطوير والاختبار

---

*آخر تحديث: 2025-10-20*
