# 🚂 Railway Environment Variables Setup

## 📋 المتغيرات المطلوبة للنشر

عند نشر المشروع على Railway، ستحتاج إلى إضافة هذه المتغيرات:

---

## 1️⃣ JWT_SECRET (مطلوب - تولده أنت)

### كيف تولده:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### مثال على الناتج:
```
a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
```

### أضفه في Railway:
```
JWT_SECRET=a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
```

---

## 2️⃣ DEEPSEEK_API_KEY (مطلوب - من DeepSeek)

### كيف تحصل عليه:
1. اذهب إلى: https://platform.deepseek.com
2. سجل دخول أو أنشئ حساب
3. اذهب إلى قسم "API Keys"
4. اضغط "Create API Key"
5. انسخ المفتاح (يبدأ بـ `sk-`)

### أضفه في Railway:
```
DEEPSEEK_API_KEY=sk-1234567890abcdef1234567890abcdef
```

---

## 3️⃣ NODE_ENV (مطلوب - اضبطه يدوياً)

### أضفه في Railway:
```
NODE_ENV=production
```

---

## 4️⃣ MONGODB_URI (تلقائي من Railway)

**⚠️ لا تضيف هذا يدوياً!**

Railway سيضيفه تلقائياً عندما تضيف MongoDB database إلى مشروعك.

سيكون بهذا الشكل:
```
MONGODB_URI=mongodb://mongo:password@containers-us-west-xxx.railway.app:7439
```

---

## 5️⃣ PORT (تلقائي من Railway)

**⚠️ لا تضيف هذا يدوياً!**

Railway سيضبطه تلقائياً.

---

## ✅ ملخص: ما تحتاج إضافته في Railway

فقط هذه الثلاثة:

```env
JWT_SECRET=<ولده بالأمر أعلاه>
DEEPSEEK_API_KEY=<احصل عليه من platform.deepseek.com>
NODE_ENV=production
```

---

## 🔐 توليد JWT_SECRET الآن

شغّل هذا الأمر في terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**انسخ الناتج واحفظه - ستحتاجه في Railway!**

---

## 📝 مثال كامل للمتغيرات في Railway

عندما تفتح Variables tab في Railway، أضف:

| Variable | Value |
|----------|-------|
| `JWT_SECRET` | `<الناتج من الأمر أعلاه>` |
| `DEEPSEEK_API_KEY` | `sk-...` |
| `NODE_ENV` | `production` |

**ملاحظة:** `MONGODB_URI` و `PORT` سيظهران تلقائياً - لا تضفهما!

---

## ✅ Checklist

قبل النشر، تأكد من:

- [ ] ولّدت JWT_SECRET
- [ ] حصلت على DEEPSEEK_API_KEY
- [ ] أضفت MongoDB database في Railway
- [ ] أضفت المتغيرات الثلاثة في Variables tab
- [ ] لم تضف MONGODB_URI يدوياً (Railway يضيفه)
- [ ] لم تضف PORT يدوياً (Railway يضبطه)

---

## 🆘 استكشاف الأخطاء

### "MongoDB connection failed"
- تأكد من إضافة MongoDB service في Railway
- تحقق من ظهور `MONGODB_URI` تلقائياً في Variables

### "DeepSeek API authentication failed"
- تحقق من صحة `DEEPSEEK_API_KEY`
- تأكد من عدم وجود مسافات زائدة
- تحقق من أن المفتاح يبدأ بـ `sk-`

### "Invalid or expired token"
- تحقق من إضافة `JWT_SECRET`
- تأكد من أنه 32 حرف على الأقل

---

## 📞 روابط مفيدة

- **DeepSeek Platform**: https://platform.deepseek.com
- **Railway Docs**: https://docs.railway.app
- **MongoDB on Railway**: https://docs.railway.app/databases/mongodb

---

**جاهز للنشر! 🚀**
