# 🎨 Widget Design Variables

## 📐 القيم المشتركة بين React و widget.js

> **هذه القيم يجب أن تكون متطابقة دائماً**

---

## 🎯 Ask Bar

```css
/* Dimensions */
max-width: 360px;
min-height: 56px;
width: 90vw;

/* Spacing */
padding: 0 1rem;
gap: 0.75rem;

/* Border */
border: 1px solid rgba(0, 0, 0, 0.08);
border-radius: 9999px; /* fully rounded */

/* Shadow */
box-shadow: 
  0 0 0 1px rgba(0, 0, 0, 0.02),
  0 4px 6px -1px rgba(0, 0, 0, 0.08),
  0 2px 4px -1px rgba(0, 0, 0, 0.04);

/* Position */
bottom: 16px;
left: 50%;
transform: translateX(-50%);
```

---

## 💬 Modal

```css
/* Dimensions */
width: 720px;
max-width: 90vw;
height: 80vh;
max-height: 600px;

/* Border */
border: 1px solid rgba(0, 0, 0, 0.08);
border-radius: 12px; /* rounded-xl */

/* Shadow */
box-shadow: 
  0 0 0 1px rgba(0, 0, 0, 0.05),
  0 10px 15px -3px rgba(0, 0, 0, 0.1),
  0 4px 6px -2px rgba(0, 0, 0, 0.05);

/* Position */
bottom: 96px; /* 56px (askbar) + 40px (gap) */
left: 50%;
transform: translateX(-50%);
```

---

## 📝 Textarea

```css
/* Dimensions */
max-height: 120px;
min-height: 56px; /* initial */

/* Spacing */
padding: 1rem 0;

/* Typography */
font-size: 0.875rem; /* 14px */
line-height: 1.5;
font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Behavior */
resize: none;
```

---

## 💭 Messages

### Assistant Message
```css
background: #f3f4f6; /* gray-100 */
color: #111827; /* gray-900 */
border-top-left-radius: 4px;
```

### User Message
```css
background-color: var(--primary-color, #17B26A);
color: white;
border-top-right-radius: 4px;
```

### Message Bubble
```css
padding: 0.75rem 1rem; /* 12px 16px */
border-radius: 1rem; /* 16px */
font-size: 0.875rem; /* 14px */
line-height: 1.5;
```

---

## 🎨 Colors

```css
/* Primary */
--primary-color: #17B26A; /* default mint */

/* Text */
--text-primary: #111827; /* gray-900 */
--text-secondary: #6b7280; /* gray-600 */
--text-placeholder: #9ca3af; /* gray-400 */

/* Borders */
--border-light: rgba(0, 0, 0, 0.08);
--border-lighter: rgba(0, 0, 0, 0.05);

/* Backgrounds */
--bg-white: #ffffff;
--bg-gray: #f3f4f6; /* gray-100 */
--bg-hover: #f9fafb; /* gray-50 */
```

---

## 📏 Spacing Scale

```css
/* Gap between modal and askbar */
--gap-modal-askbar: 40px;

/* Askbar bottom position */
--askbar-bottom: 16px;

/* Modal bottom position */
--modal-bottom: 96px; /* askbar (56px) + gap (40px) */

/* Preview mode adjustments */
--preview-scale: 0.65;
--preview-modal-bottom: 76px;

/* Try mode adjustments */
--try-scale: 0.85;
--try-modal-bottom: 96px;
```

---

## 🔄 كيف تحافظ على التطابق

### عند تغيير قيمة:

#### 1. غيّر في React (src/index.css)
```css
.mintchat-modal {
  border-radius: 12px; /* ✅ */
}
```

#### 2. غيّر في widget.js (public/widget.js)
```css
.mintchat-modal {
  border-radius: 12px; /* ✅ */
}
```

#### 3. حدّث هذا الملف (WIDGET_VARIABLES.md)
```markdown
border-radius: 12px; /* ✅ */
```

---

## ⚠️ قواعد مهمة

### ✅ يجب أن يتطابق:
- جميع القيم في هذا الملف
- الألوان
- الأبعاد
- الظلال
- الحواف
- المسافات

### ❌ يمكن أن يختلف:
- `scale` فقط (حسب المكان)
  - Production: `1.0`
  - Preview: `0.65`
  - Try: `0.85`

---

## 🧪 Checklist قبل Commit

عند تعديل Widget:

- [ ] غيّرت في React component
- [ ] غيّرت في widget.js
- [ ] حدّثت WIDGET_VARIABLES.md
- [ ] اختبرت في Appearance
- [ ] اختبرت في HTML
- [ ] تأكدت من التطابق
- [ ] لا أخطاء في Console

---

## 📊 مثال على التغيير

### السيناريو: تغيير border-radius للمودال

#### الخطوة 1: React
```css
/* src/index.css */
.mintchat-modal {
  border-radius: 12px; /* من 16px إلى 12px */
}
```

#### الخطوة 2: widget.js
```javascript
/* public/widget.js */
.mintchat-modal {
  border-radius: 12px; /* من 16px إلى 12px */
}
```

#### الخطوة 3: Documentation
```markdown
/* WIDGET_VARIABLES.md */
border-radius: 12px; /* rounded-xl */
```

#### الخطوة 4: Test
```
✅ Appearance: حواف 12px
✅ HTML: حواف 12px
✅ متطابقان!
```

---

*آخر تحديث: 2025-10-20*
*الحالة: موثق ✅*
*الأولوية: حرجة 🚨*
