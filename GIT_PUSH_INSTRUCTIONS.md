# 🚀 Git Push Instructions

## رفع المشروع على GitHub

### الخطوات:

```bash
# 1. التأكد من أنك في مجلد المشروع
cd C:\Users\balaw_mce0m32\Downloads\sanad

# 2. تهيئة Git (إذا لم يكن مهيأ)
git init

# 3. إضافة remote للـ repository
git remote add origin https://github.com/balawi2991/sabot.git

# أو إذا كان موجود بالفعل، حدثه:
git remote set-url origin https://github.com/balawi2991/sabot.git

# 4. تحقق من الـ remote
git remote -v

# 5. إضافة جميع الملفات
git add .

# 6. Commit
git commit -m "Initial commit: Complete Sanad project with Railway config"

# 7. Push إلى GitHub
git push -u origin main

# إذا كان الـ branch اسمه master:
# git push -u origin master

# إذا واجهت مشكلة، استخدم force push (احذر!):
# git push -u origin main --force
```

---

## ⚠️ قبل الـ Push

### تحقق من .gitignore
```bash
# تأكد أن .env غير موجود في Git
git status

# يجب ألا ترى:
# - .env
# - server/.env
# - node_modules/
# - dist/
```

### إذا كان .env موجود في Git:
```bash
# احذفه من Git (لكن ليس من الملفات المحلية)
git rm --cached .env
git rm --cached server/.env

# ثم commit
git commit -m "Remove .env files from Git"
```

---

## 🔐 Authentication

### إذا طلب منك Username/Password:

#### Option 1: Personal Access Token (موصى به)
```bash
# Username: balawi2991
# Password: استخدم Personal Access Token من GitHub

# للحصول على Token:
# 1. اذهب إلى: https://github.com/settings/tokens
# 2. Generate new token (classic)
# 3. اختر scopes: repo
# 4. انسخ الـ token
# 5. استخدمه كـ password
```

#### Option 2: SSH Key
```bash
# إذا كنت تستخدم SSH:
git remote set-url origin git@github.com:balawi2991/sabot.git
```

---

## 📝 بعد الـ Push

### 1. تحقق من GitHub
افتح: https://github.com/balawi2991/sabot

يجب أن ترى جميع الملفات

### 2. تحقق من الملفات المهمة
- [ ] railway.json موجود
- [ ] Procfile موجود
- [ ] nixpacks.toml موجود
- [ ] server/.env.example موجود
- [ ] .env غير موجود ❌
- [ ] README.md موجود

---

## 🚂 ربط مع Railway

### بعد Push الناجح:

1. **اذهب إلى Railway Dashboard**
   - https://railway.app/dashboard

2. **Create New Project**
   - اضغط "New Project"
   - اختر "Deploy from GitHub repo"

3. **اختر Repository**
   - balawi2991/sabot

4. **Railway سيكتشف تلقائياً**:
   - railway.json
   - Procfile
   - nixpacks.toml

5. **Add PostgreSQL Service**
   - في Project، اضغط "+ New"
   - اختر "Database"
   - اختر "PostgreSQL"

6. **Set Environment Variables**
   راجع: [`DEPLOYMENT_CHECKLIST.md`](./DEPLOYMENT_CHECKLIST.md)

7. **Deploy!**
   - Railway سيبدأ build تلقائياً

---

## 🔄 Updates المستقبلية

```bash
# بعد أي تعديلات:
git add .
git commit -m "وصف التعديلات"
git push origin main

# Railway سيعمل auto-deploy تلقائياً!
```

---

## 🐛 Troubleshooting

### "fatal: remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/balawi2991/sabot.git
```

### "rejected - non-fast-forward"
```bash
# Pull أولاً
git pull origin main --rebase

# ثم Push
git push origin main
```

### "Permission denied"
```bash
# استخدم Personal Access Token
# أو setup SSH key
```

### "large files"
```bash
# تحقق من حجم الملفات
git ls-files -z | xargs -0 du -h | sort -h

# إذا كانت كبيرة، أضفها لـ .gitignore
```

---

## ✅ Checklist

قبل Push:
- [ ] .env في .gitignore
- [ ] لا توجد secrets في الكود
- [ ] node_modules في .gitignore
- [ ] dist في .gitignore
- [ ] railway.json موجود
- [ ] Procfile موجود
- [ ] README.md محدث

بعد Push:
- [ ] تحقق من GitHub
- [ ] جميع الملفات موجودة
- [ ] .env غير موجود
- [ ] جاهز للربط مع Railway

---

**الآن نفذ الأوامر أعلاه! 🚀**
