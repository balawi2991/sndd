# 🚂 Railway Deployment Guide - Sanad

## 📋 Pre-Deployment Checklist

### **Required**
- [ ] GitHub repository created
- [ ] Railway account created
- [ ] DeepSeek API key obtained
- [ ] OpenAI API key obtained
- [ ] Code committed to GitHub

### **Optional**
- [ ] Custom domain ready
- [ ] Email service configured
- [ ] Monitoring tools ready

---

## 🚀 Step-by-Step Deployment

### **Step 1: Install Railway CLI**

```bash
# Windows (PowerShell)
iwr https://railway.app/install.ps1 | iex

# Mac/Linux
curl -fsSL https://railway.app/install.sh | sh

# Or via npm
npm install -g @railway/cli
```

### **Step 2: Login to Railway**

```bash
railway login
```

سيفتح متصفح للتسجيل/الدخول.

---

### **Step 3: Create New Project**

#### **Option A: From GitHub (Recommended)**

1. اذهب إلى [Railway Dashboard](https://railway.app/dashboard)
2. اضغط **"New Project"**
3. اختر **"Deploy from GitHub repo"**
4. اختر repository: `sanad`
5. اختر branch: `main`
6. اضغط **"Deploy Now"**

#### **Option B: From CLI**

```bash
cd C:\Users\balaw_mce0m32\Downloads\sanad\server
railway init
railway link
```

---

### **Step 4: Add PostgreSQL Database**

```bash
# في Railway Dashboard
# أو عبر CLI:
railway add --plugin postgresql
```

**ملاحظة**: Railway سيُنشئ `DATABASE_URL` تلقائياً.

---

### **Step 5: Install pgvector Extension**

```bash
# Connect to database
railway connect postgresql

# في psql prompt:
CREATE EXTENSION IF NOT EXISTS vector;

# تحقق من التثبيت
\dx vector

# اخرج
\q
```

---

### **Step 6: Run Database Migrations**

#### **Option A: Manual (Recommended for first time)**

```bash
# Download schema files locally or use Railway shell
railway run bash

# Inside Railway shell:
cd server/scripts
chmod +x migrate.sh
./migrate.sh
```

#### **Option B: Direct psql**

```bash
# Get DATABASE_URL
railway variables

# Run migrations
psql $DATABASE_URL < server/src/db/schema.sql
psql $DATABASE_URL < server/src/db/schema-updates.sql
```

---

### **Step 7: Set Environment Variables**

```bash
# Required variables
railway variables set DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxx
railway variables set OPENAI_API_KEY=sk-xxxxxxxxxxxxx
railway variables set JWT_SECRET=your-super-secret-key-min-32-characters-long

# Optional variables
railway variables set NODE_ENV=production
railway variables set CORS_ORIGIN=https://yourdomain.com
railway variables set PORT=3001
```

**أو من Dashboard**:
1. اذهب إلى Project Settings
2. اضغط **Variables**
3. أضف كل variable

---

### **Step 8: Configure Build Settings**

Railway سيكتشف تلقائياً:
- `package.json` → Node.js project
- `nixpacks.toml` → Build configuration
- `Procfile` → Start command

**تحقق من**:
- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- Root Directory: `server`

---

### **Step 9: Deploy!**

```bash
# إذا استخدمت GitHub
# Railway سيبدأ deployment تلقائياً عند push

# أو يدوياً
railway up

# أو من Dashboard
# اضغط "Deploy" → "Redeploy"
```

---

### **Step 10: Seed Database (Optional)**

```bash
# Connect to Railway
railway run bash

# Run seed script
psql $DATABASE_URL < server/scripts/seed.sql
```

هذا سيُنشئ:
- Demo user
- Test agent with API key
- Sample training material
- Free tier subscription

---

## ✅ Verify Deployment

### **1. Check Health Endpoint**

```bash
curl https://your-app.railway.app/health
```

**Expected Response**:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

### **2. Check Database Connection**

```bash
railway logs
```

ابحث عن:
- ✅ `Server running on...`
- ✅ `Database connected`
- ❌ أي errors

### **3. Test API Endpoints**

```bash
# Get your Railway URL
railway domain

# Test chat endpoint (needs API key)
curl -X POST https://your-app.railway.app/api/chat \
  -H "X-API-Key: agent_demo_key_for_testing_only_change_in_production" \
  -H "Content-Type: application/json" \
  -d '{"question": "مرحباً"}'
```

---

## 🔧 Configuration Files

### **1. railway.json**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### **2. nixpacks.toml**
```toml
[phases.setup]
nixPkgs = ["nodejs-18_x", "python3"]

[phases.install]
cmds = ["npm ci"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm start"
```

### **3. Procfile**
```
web: npm start
```

---

## 🌐 Custom Domain (Optional)

### **1. Add Domain in Railway**

1. Project Settings → Domains
2. اضغط **"Add Domain"**
3. أدخل domain: `api.yourdomain.com`

### **2. Configure DNS**

أضف CNAME record:
```
Type: CNAME
Name: api
Value: your-app.railway.app
```

### **3. Update CORS**

```bash
railway variables set CORS_ORIGIN=https://yourdomain.com
```

---

## 📊 Monitoring & Logs

### **View Logs**

```bash
# Real-time logs
railway logs

# Follow logs
railway logs --follow

# Filter by service
railway logs --service backend
```

### **Metrics**

في Railway Dashboard:
- CPU usage
- Memory usage
- Network traffic
- Request count

---

## 🔄 Updates & Redeployment

### **Automatic (GitHub)**

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Railway will auto-deploy
```

### **Manual**

```bash
railway up
```

### **Rollback**

في Dashboard:
1. Deployments tab
2. اختر previous deployment
3. اضغط **"Redeploy"**

---

## 🐛 Troubleshooting

### **Build Fails**

```bash
# Check build logs
railway logs --deployment <deployment-id>

# Common issues:
# 1. Missing dependencies → Check package.json
# 2. TypeScript errors → Check tsconfig.json
# 3. Build timeout → Increase resources
```

### **Database Connection Fails**

```bash
# Verify DATABASE_URL
railway variables | grep DATABASE_URL

# Test connection
railway connect postgresql
```

### **API Returns 500**

```bash
# Check runtime logs
railway logs --follow

# Common issues:
# 1. Missing env variables
# 2. Database not migrated
# 3. API keys invalid
```

### **CORS Errors**

```bash
# Update CORS_ORIGIN
railway variables set CORS_ORIGIN=https://yourdomain.com

# Or allow multiple origins (not recommended for production)
railway variables set CORS_ORIGIN=*
```

---

## 💰 Pricing & Resources

### **Free Tier**
- $5 credit/month
- Shared CPU
- 512MB RAM
- 1GB storage
- Good for testing

### **Hobby Plan** ($5/month)
- $5 credit + $5/month
- Dedicated resources
- Better for production

### **Pro Plan** ($20/month)
- $20 credit/month
- Priority support
- Advanced features

---

## 🔐 Security Best Practices

### **1. Environment Variables**

✅ **DO**:
- Use Railway variables
- Rotate secrets regularly
- Use strong JWT secrets

❌ **DON'T**:
- Commit .env files
- Share API keys
- Use default secrets

### **2. Database**

✅ **DO**:
- Enable SSL
- Use connection pooling
- Regular backups

❌ **DON'T**:
- Expose DATABASE_URL
- Use weak passwords
- Skip migrations

### **3. API**

✅ **DO**:
- Use rate limiting
- Validate inputs
- Log important actions

❌ **DON'T**:
- Skip authentication
- Trust client data
- Ignore errors

---

## 📦 Backup Strategy

### **Database Backups**

```bash
# Manual backup
railway connect postgresql
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Restore
psql $DATABASE_URL < backup-20240101.sql
```

### **Automated Backups**

Railway Pro includes:
- Daily automated backups
- Point-in-time recovery
- 7-day retention

---

## 🎯 Post-Deployment Tasks

### **Immediate**
- [ ] Test all API endpoints
- [ ] Verify database connection
- [ ] Check logs for errors
- [ ] Test file uploads
- [ ] Verify CORS settings

### **Within 24 Hours**
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Test from production frontend
- [ ] Verify rate limiting
- [ ] Test API key authentication

### **Within 1 Week**
- [ ] Setup monitoring alerts
- [ ] Configure backups
- [ ] Document API endpoints
- [ ] Load testing
- [ ] Security audit

---

## 📞 Support

### **Railway**
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway
- Status: https://status.railway.app

### **Project Issues**
- Check logs first
- Review environment variables
- Test locally
- Check database migrations

---

## 🎉 Success Checklist

- [ ] ✅ Server deployed and running
- [ ] ✅ Database connected with pgvector
- [ ] ✅ Migrations applied
- [ ] ✅ Environment variables set
- [ ] ✅ Health check passing
- [ ] ✅ API endpoints working
- [ ] ✅ CORS configured
- [ ] ✅ Logs accessible
- [ ] ✅ Custom domain (optional)
- [ ] ✅ Monitoring setup

---

**Status**: 🟢 **Ready for Production!**

**Next**: Connect frontend to Railway backend URL
