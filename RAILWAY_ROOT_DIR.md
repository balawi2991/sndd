# 🚂 Railway Configuration - IMPORTANT

## ⚠️ REQUIRED Setting

**You MUST set Root Directory in Railway Dashboard:**

### Steps:
1. Go to Railway Dashboard
2. Click on your Service
3. Go to **Settings** → **Service Settings**
4. Find **Root Directory**
5. Set it to: `server`
6. Click **Save**

---

## Why?

The backend code is in the `server/` directory, not in the root.

Railway needs to know where to find:
- `package.json`
- `tsconfig.json`
- `src/` folder

---

## ✅ After Setting Root Directory

Railway will automatically:
- Read `server/package.json` (with Node 22 requirement)
- Use `server/tsconfig.json` (with strict: false)
- Build from `server/src/`
- Run `npm start` from `server/`

---

## 🎯 This is the ONLY way to fix the build!

Don't use nixpacks.toml - just set Root Directory in Settings.
