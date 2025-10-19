# 🚂 Railway Deployment Guide for MintChat

## Prerequisites
- GitHub account
- Railway account (https://railway.app)
- DeepSeek API key
- OpenAI API key (for embeddings)

---

## 📦 Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

---

## 🚀 Step 2: Deploy on Railway

### 2.1 Create New Project
1. Go to https://railway.app/new
2. Click "Deploy from GitHub repo"
3. Select your MintChat repository
4. Railway will auto-detect the configuration

### 2.2 Add PostgreSQL Database
1. In your Railway project, click "+ New"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically provide `DATABASE_URL`

### 2.3 Configure Environment Variables
Go to your service → Variables tab and add:

```env
# Required
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
DEEPSEEK_API_KEY=sk-your-deepseek-api-key
OPENAI_API_KEY=sk-your-openai-api-key

# Optional (defaults work)
NODE_ENV=production
PORT=3000
JWT_EXPIRES_IN=7d
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
FRONTEND_URL=${{RAILWAY_PUBLIC_DOMAIN}}
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=30
```

**Note:** `DATABASE_URL` is automatically provided by Railway PostgreSQL plugin.

---

## 🔧 Step 3: Enable pgvector Extension

After first deployment, run this command in Railway PostgreSQL:

1. Go to PostgreSQL service → Data tab
2. Click "Query" and run:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

Or connect via CLI and run the same command.

---

## ✅ Step 4: Verify Deployment

1. Check deployment logs for:
   - ✅ Database connected
   - ✅ pgvector extension enabled
   - 🚀 Server running on port 3000

2. Visit your app URL (Railway provides this)

3. Test health endpoint:
   ```
   https://your-app.railway.app/api/health
   ```

---

## 🔐 Security Checklist

- ✅ JWT_SECRET is strong (32+ characters)
- ✅ API keys are set in Railway (not in code)
- ✅ DATABASE_URL is auto-provided by Railway
- ✅ CORS is configured for production domain
- ✅ Rate limiting is enabled

---

## 📊 Monitoring

Railway provides:
- Real-time logs
- Metrics (CPU, Memory, Network)
- Automatic restarts on failure
- Health checks

---

## 🔄 Updates

To deploy updates:

```bash
git add .
git commit -m "Your update message"
git push
```

Railway will automatically rebuild and redeploy.

---

## 🐛 Troubleshooting

### Database Connection Issues
- Verify PostgreSQL service is running
- Check `DATABASE_URL` is present in variables
- Ensure pgvector extension is enabled

### Build Failures
- Check build logs in Railway
- Verify all dependencies are in package.json
- Ensure Prisma schema is valid

### Runtime Errors
- Check application logs
- Verify all environment variables are set
- Test API endpoints individually

---

## 📚 Useful Commands

```bash
# View logs
railway logs

# Connect to database
railway connect postgres

# Run migrations
railway run npm run db:migrate

# Open Prisma Studio
railway run npm run db:studio
```

---

## 🎯 Production Checklist

Before going live:

- [ ] All environment variables set
- [ ] Database migrations applied
- [ ] pgvector extension enabled
- [ ] Health check passing
- [ ] CORS configured correctly
- [ ] Rate limiting tested
- [ ] Error handling verified
- [ ] Backup strategy in place

---

## 💡 Tips

1. **Use Railway's PostgreSQL plugin** - It handles DATABASE_URL automatically
2. **Enable auto-deploy** - Push to main branch = automatic deployment
3. **Monitor usage** - Railway shows resource consumption
4. **Set up alerts** - Get notified of deployment failures
5. **Use staging environment** - Test changes before production

---

## 🔗 Resources

- Railway Docs: https://docs.railway.app
- Prisma Docs: https://www.prisma.io/docs
- DeepSeek API: https://platform.deepseek.com/docs
- OpenAI Embeddings: https://platform.openai.com/docs/guides/embeddings

---

**Need help?** Check Railway community or project documentation.
