# Chat Modal - Fixed Dimensions Specifications

## 🎯 Core Principle: Fixed Size, Internal Scrolling Only

The modal maintains **fixed dimensions** and never stretches with conversation length. All scrolling happens **inside the messages area only**.

---

## 📐 Modal Dimensions

### Desktop (Normal Pages)
- **Width**: `720px` (tolerance: 680-760px for adaptation)
- **Height**: `80vh` (max: 600px)
- **Position**: Above Ask-bar, horizontally centered
- **Behavior**: Fixed size, never grows with messages

### Mobile/Tablets
- **Width**: `calc(100vw - 16px)`
- **Height**: `70vh` (max: 500px)
- **Style**: Bottom sheet covering most of viewport
- **Behavior**: Same fixed principle - scrolling inside only

### Container Mode (Appearance/Try My Agent)
- **Width**: `min(90%, 720px)` - scales proportionally
- **Height**: `min(70vh, 500px)` - adapts to container
- **Constraint**: Never exceeds `.live-preview-canvas` bounds
- **Scaling**: Proportional reduction maintains aspect ratio

---

## 📦 Modal Structure (Fixed Layout)

```
┌─────────────────────────────────────┐
│  HEADER (Fixed - 64px min-height)  │ ← Never scrolls
│  • Logo + Title + Close Button     │
├─────────────────────────────────────┤
│                                     │
│  MESSAGES AREA (Flex-1)            │ ← Scrollable only
│  • Scrollbar: 6px, calm style      │
│  • Auto-scroll to bottom           │
│  • Smooth scrolling                │
│                                     │
│  [Message 1]                        │
│  [Message 2]                        │
│  [Message 3]                        │
│  ...                                │
│  [Typing indicator]                 │
│                                     │
└─────────────────────────────────────┘
```

**No footer/toolbar in current implementation** - can be added later as fixed element.

---

## 🎨 Scrollbar Styling (Fluent/Enterprise-Calm)

### Webkit Browsers
```css
.chat-modal__messages::-webkit-scrollbar {
  width: 6px;
}

.chat-modal__messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-modal__messages::-webkit-scrollbar-thumb {
  background: #D1D5DB; /* gray-300 */
  border-radius: 9999px;
  transition: background-color 0.15s ease;
}

.chat-modal__messages::-webkit-scrollbar-thumb:hover {
  background: #9CA3AF; /* gray-400 */
}
```

### Firefox
```css
.chat-modal__messages {
  scrollbar-width: thin;
  scrollbar-color: #D1D5DB transparent;
}
```

**Characteristics:**
- ✅ Thin (6px)
- ✅ Calm colors (gray-300/400)
- ✅ Transparent track
- ✅ Smooth hover transition
- ✅ Rounded thumb

---

## 📍 Positioning & Alignment

### Normal Pages (fixed positioning)
```css
.chat-modal {
  position: fixed;
  left: 50%;
  bottom: 80px;
  transform: translateX(-50%);
  z-index: 1001;
}
```

### Container Mode (absolute positioning)
```css
.chat-modal {
  position: absolute;
  left: 50%;
  bottom: 80px;
  transform: translateX(-50%);
  z-index: 1001;
}
```

**Key Points:**
- Always horizontally centered above Ask-bar
- `80px` from bottom (Ask-bar is ~56px + spacing)
- Never exceeds parent container bounds
- Z-index: 1001 (above backdrop 1000, below Ask-bar 1002)

---

## 🔄 Responsive Behavior

### Appearance Page - Live Preview
**Context**: Small preview canvas (~600px height)

**Behavior**:
- Modal scales down proportionally
- Class: `.chat-modal--container`
- Width: `min(90%, 720px)`
- Height: `min(70vh, 500px)`
- Stays within `.live-preview-canvas` bounds
- Maintains aspect ratio and layout

### Try My Agent Page
**Context**: Browser-like frame (~800px width, ~70vh height)

**Behavior**:
- Same as Live Preview
- Modal adapts to frame size
- Never overflows frame boundaries
- Proportional scaling maintains design

### Demo Page
**Context**: Full page experience

**Behavior**:
- Standard desktop dimensions
- Fixed positioning
- Full 720px × 80vh (max 600px)

---

## 🚫 What NOT to Do

❌ **Don't** let modal grow with message count  
✅ **Do** use internal scrolling in messages area

❌ **Don't** allow modal to exceed container bounds  
✅ **Do** scale proportionally in preview contexts

❌ **Don't** create double scrollbars (container + messages)  
✅ **Do** use single scrollbar inside messages only

❌ **Don't** make header/footer scrollable  
✅ **Do** keep them fixed, scroll messages only

❌ **Don't** use variable modal dimensions  
✅ **Do** maintain fixed, predictable sizes

---

## 🎯 Implementation Checklist

### CSS Classes
- [x] `.chat-modal` - Base modal with fixed dimensions
- [x] `.chat-modal--container` - Container mode variant
- [x] `.chat-modal__header` - Fixed header (min-height: 64px)
- [x] `.chat-modal__messages` - Scrollable messages area
- [x] `.chat-modal__backdrop` - Semi-transparent overlay

### Dimensions
- [x] Desktop: 720px × 80vh (max 600px)
- [x] Mobile: calc(100vw - 16px) × 70vh (max 500px)
- [x] Container: min(90%, 720px) × min(70vh, 500px)

### Scrolling
- [x] Internal scrolling in messages area only
- [x] Calm scrollbar styling (6px, gray-300)
- [x] Smooth scroll behavior
- [x] Auto-scroll to bottom on new messages

### Positioning
- [x] Horizontally centered above Ask-bar
- [x] Fixed/absolute based on context
- [x] Never exceeds container bounds
- [x] Proper z-index layering

### Responsive
- [x] Desktop: Full size
- [x] Mobile: Bottom sheet
- [x] Preview: Proportional scaling
- [x] Try frame: Adapted to frame size

---

## 📊 Z-Index Hierarchy

```
Page content:          z-index: 0
Backdrop:              z-index: 1000
Modal:                 z-index: 1001
Ask-bar:               z-index: 1002
```

**Why this order?**
- Ask-bar must always be accessible (highest)
- Modal floats above backdrop
- Backdrop dims page content
- Page content is base layer

---

## 🎨 Visual Consistency (Fluent/Enterprise-Calm)

### Borders & Shadows
- Border: `1px solid gray-200`
- Shadow: `shadow-2xl` (soft, elevated)
- Radius: `rounded-2xl` (16px)

### Colors
- Background: `white`
- Text: `gray-900` (primary), `gray-600` (secondary)
- Accent: `mint-600` (#17B26A)
- Borders: `gray-200`

### Spacing
- Header padding: `px-6 py-4`
- Messages padding: `px-6 py-4`
- Message gap: `mb-4`

### Typography
- Header title: `text-base font-semibold`
- Messages: `text-sm leading-relaxed`
- Dates: `text-xs text-gray-500`

---

## ✅ Success Criteria

✅ Modal has fixed dimensions in all contexts  
✅ Only messages area scrolls internally  
✅ Header remains fixed at top  
✅ Scrollbar is calm and subtle (6px)  
✅ Modal never exceeds container bounds  
✅ Proportional scaling in preview contexts  
✅ No double scrollbars anywhere  
✅ Smooth scroll behavior  
✅ Auto-scroll to bottom on new messages  
✅ Proper z-index layering maintained  

---

## 🚀 Future Enhancements

- [ ] Optional fixed footer/toolbar (48px height)
- [ ] Scroll-to-top button when far from top
- [ ] Unread message indicator
- [ ] Message search within modal
- [ ] Export conversation feature
- [ ] Minimize/maximize animations
- [ ] Drag to resize (advanced)

---

**Last Updated**: Implementation complete with fixed dimensions and internal scrolling.
