# 🔄 مزامنة الـ Widget - React ↔️ Standalone

## 🎯 الهدف

**ضمان أن widget.js (standalone) يطابق Widget Component (React) تماماً في المظهر والسلوك**

---

## 📋 القاعدة الذهبية

> **أي تغيير في React Widget يجب أن ينعكس في widget.js**

### الاستثناء الوحيد:
- **المقاسات** (scale) - تختلف حسب المكان:
  - Appearance preview: `scale(0.65)`
  - Try My Agent: `scale(0.85)`
  - Production (widget.js): `scale(1.0)`

---

## 🔧 الملفات المتزامنة

### React Components:
1. `src/components/widget/Widget.tsx`
2. `src/components/widget/AskBar.tsx`
3. `src/components/widget/ChatModal.tsx`
4. `src/index.css` (styles)

### Standalone:
1. `public/widget.js` (all-in-one)

---

## ✅ ما يجب أن يتطابق

### 1. CSS Values
```css
/* يجب أن تكون متطابقة تماماً */
gap: 0.75rem;           /* ✅ نفسه */
padding: 1rem;          /* ✅ نفسه */
font-size: 0.875rem;    /* ✅ نفسه */
line-height: 1.5;       /* ✅ نفسه */
max-height: 120px;      /* ✅ نفسه */
min-height: 56px;       /* ✅ نفسه */
```

### 2. Colors
```css
/* يجب أن تكون متطابقة تماماً */
background: white;
color: #111827;
placeholder: #9ca3af;
border: rgba(0, 0, 0, 0.08);
```

### 3. Box Shadow
```css
/* يجب أن تكون متطابقة تماماً */
box-shadow: 
  0 0 0 1px rgba(0, 0, 0, 0.02),
  0 4px 6px -1px rgba(0, 0, 0, 0.08),
  0 2px 4px -1px rgba(0, 0, 0, 0.04);
```

### 4. Animations
```css
/* يجب أن تكون متطابقة تماماً */
transition: all 150ms;
animation: glow-move 9s linear infinite reverse;
```

### 5. Behavior
```javascript
// يجب أن يكون متطابقاً تماماً
- Auto-resize textarea
- Open modal on first character
- Submit on Enter (not Shift+Enter)
- Disable when typing
- Show typing indicator
```

---

## 🔄 كيف تزامن التغييرات

### خطوة 1: غيّر في React Component
```typescript
// src/components/widget/AskBar.tsx
const handleChange = (e) => {
  // تغيير جديد هنا
};
```

### خطوة 2: انسخ للـ widget.js
```javascript
// public/widget.js
textarea.addEventListener('input', function() {
  // نفس التغيير هنا
});
```

### خطوة 3: اختبر الاثنين
```
1. اختبر في Appearance (React)
2. اختبر في HTML (widget.js)
3. تأكد أنهما متطابقان
```

---

## 🧪 قائمة الاختبار

### قبل كل commit:

#### Visual Test:
- [ ] Ask Bar نفس الحجم
- [ ] نفس الألوان
- [ ] نفس الـ shadows
- [ ] نفس الـ borders
- [ ] نفس الـ animations

#### Behavior Test:
- [ ] Textarea auto-resize يعمل بنفس الطريقة
- [ ] Modal يفتح عند الكتابة
- [ ] Enter يُرسل الرسالة
- [ ] Shift+Enter سطر جديد
- [ ] Typing indicator يظهر
- [ ] Messages تظهر بنفس الشكل

#### Responsive Test:
- [ ] يعمل على Desktop
- [ ] يعمل على Mobile
- [ ] يعمل على Tablet

---

## 📝 أمثلة على التغييرات

### مثال 1: تغيير لون
```typescript
// React Component
<div style={{ backgroundColor: '#17B26A' }}>

// widget.js
background-color: #17B26A;
```

### مثال 2: تغيير padding
```typescript
// React Component
className="px-4 py-2"  // padding: 1rem 0.5rem

// widget.js
padding: 1rem 0.5rem;
```

### مثال 3: تغيير behavior
```typescript
// React Component
if (value.length === 1) {
  onFocus();
}

// widget.js
if (this.value.length === 1) {
  openModal();
}
```

---

## ⚠️ أخطاء شائعة

### ❌ خطأ 1: استخدام px بدلاً من rem
```css
/* خطأ */
padding: 16px;

/* صحيح */
padding: 1rem;
```

### ❌ خطأ 2: نسيان box-shadow layer
```css
/* خطأ - layer واحد فقط */
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

/* صحيح - 3 layers */
box-shadow: 
  0 0 0 1px rgba(0, 0, 0, 0.02),
  0 4px 6px -1px rgba(0, 0, 0, 0.08),
  0 2px 4px -1px rgba(0, 0, 0, 0.04);
```

### ❌ خطأ 3: textarea resize مختلف
```javascript
/* خطأ - يسبب قفزة */
this.style.height = '56px';
this.style.height = this.scrollHeight + 'px';

/* صحيح - سلس */
this.style.height = 'auto';
const newHeight = Math.max(56, Math.min(this.scrollHeight, 120));
this.style.height = newHeight + 'px';
```

---

## 🎯 الخلاصة

### القواعد الأساسية:

1. **React Component هو المرجع** - أي تغيير يبدأ منه
2. **widget.js يتبع React** - ينسخ نفس التغييرات
3. **اختبر الاثنين** - تأكد من التطابق
4. **المقاسات فقط تختلف** - scale حسب المكان

### عند إضافة ميزة جديدة:

```
1. أضف في React Component
2. اختبر في Appearance
3. انسخ لـ widget.js
4. اختبر في HTML
5. تأكد من التطابق
6. Commit!
```

---

## 📊 Checklist للـ PR

قبل merge أي PR يغيّر Widget:

- [ ] React Component محدّث
- [ ] widget.js محدّث
- [ ] CSS متطابق
- [ ] Behavior متطابق
- [ ] تم الاختبار في Appearance
- [ ] تم الاختبار في HTML
- [ ] لا أخطاء في Console
- [ ] يعمل على Mobile

---

*آخر تحديث: 2025-10-20*
*الحالة: موثق ✅*
*الأولوية: حرجة 🚨*
