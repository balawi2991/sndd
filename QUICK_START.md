# ⚡ MintChat - Quick Start Guide

## 🎯 Goal
Get MintChat running on Railway in under 10 minutes.

---

## 📋 Prerequisites

Before you start, get these ready:

1. **GitHub Account** - https://github.com
2. **Railway Account** - https://railway.app (sign up with GitHub)
3. **DeepSeek API Key** - https://platform.deepseek.com
4. **OpenAI API Key** - https://platform.openai.com

---

## 🚀 Step-by-Step Deployment

### Step 1: Push to GitHub (2 minutes)

```bash
# In your project directory
git init
git add .
git commit -m "Initial MintChat deployment"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/mintchat.git
git push -u origin main
```

### Step 2: Deploy on Railway (3 minutes)

1. Go to https://railway.app/new
2. Click **"Deploy from GitHub repo"**
3. Select your `mintchat` repository
4. Railway will start building automatically

### Step 3: Add PostgreSQL (1 minute)

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"PostgreSQL"**
3. Railway automatically provides `DATABASE_URL` ✅

### Step 4: Set Environment Variables (2 minutes)

Click on your service → **"Variables"** tab → Add these:

```env
JWT_SECRET=paste-a-random-32-character-string-here
DEEPSEEK_API_KEY=sk-your-deepseek-key
OPENAI_API_KEY=sk-your-openai-key
NODE_ENV=production
```

**Generate JWT_SECRET:**
```bash
# On Mac/Linux:
openssl rand -base64 32

# Or use: https://generate-secret.vercel.app/32
```

### Step 5: Enable pgvector (1 minute)

1. Click on **PostgreSQL service** → **"Data"** tab
2. Click **"Query"**
3. Run this SQL:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```
4. Click **"Execute"**

### Step 6: Verify Deployment (1 minute)

1. Wait for build to complete (check **"Deployments"** tab)
2. Click **"View Logs"** - look for:
   ```
   ✅ Database connected
   ✅ pgvector extension enabled
   🚀 Server running on port 3000
   ```
3. Click on your app URL (Railway provides this)
4. You should see the MintChat login page! 🎉

---

## ✅ Test Your Deployment

### 1. Create Account
- Click **"Sign Up"**
- Enter name, email, password
- Click **"Create Account"**

### 2. Add Training Material
- Go to **"Training Materials"**
- Click **"Add Material"**
- Add some text (e.g., "We offer 24/7 customer support")
- Wait ~10 seconds for indexing

### 3. Try Your Agent
- Go to **"Try My Agent"**
- Type a question in the chat widget
- Get AI response with sources! 🤖

---

## 🐛 Troubleshooting

### Build Failed?
**Check:**
- All environment variables are set
- `DATABASE_URL` exists (auto-provided by Railway)
- No syntax errors in code

**Fix:**
- Go to **"Deployments"** → Click failed deployment → **"View Logs"**
- Fix the issue
- Push to GitHub again (auto-redeploys)

### Database Connection Error?
**Check:**
- PostgreSQL service is running
- `DATABASE_URL` variable exists
- pgvector extension is enabled

**Fix:**
```sql
-- Run in PostgreSQL Query tab:
CREATE EXTENSION IF NOT EXISTS vector;
```

### Widget Not Showing?
**Check:**
- Frontend built successfully
- No console errors (F12 in browser)
- Try hard refresh (Ctrl+Shift+R)

---

## 📊 What's Next?

### Customize Your Bot
1. Go to **"Appearance"**
2. Change colors, title, placeholder
3. Add suggested questions
4. See live preview!

### Add More Training Data
1. Go to **"Training Materials"**
2. Add files, links, or text
3. Wait for indexing
4. Test improved responses

### Monitor Usage
1. Go to **"Dashboard"**
2. See knowledge base stats
3. Track training status

---

## 🔗 Important URLs

After deployment, save these:

- **Your App:** `https://your-app.railway.app`
- **API Health:** `https://your-app.railway.app/api/health`
- **Railway Dashboard:** https://railway.app/project/YOUR_PROJECT_ID
- **PostgreSQL:** Railway Dashboard → PostgreSQL service

---

## 💡 Pro Tips

### Faster Deployments
- Railway auto-deploys on every push to `main`
- Use branches for testing
- Merge to `main` when ready

### Cost Optimization
- Railway free tier: $5/month credit
- Monitor usage in Railway dashboard
- Optimize database queries
- Use rate limiting (already configured)

### Security
- Never commit `.env` files
- Rotate API keys regularly
- Use strong JWT_SECRET
- Monitor error logs

---

## 📚 Learn More

- **Full Documentation:** [README.md](./README.md)
- **Deployment Guide:** [RAILWAY_SETUP.md](./RAILWAY_SETUP.md)
- **Project Status:** [PROJECT_STATUS.md](./PROJECT_STATUS.md)
- **Deployment Checklist:** [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

---

## 🆘 Need Help?

### Railway Issues
- Check Railway logs first
- Railway Discord: https://discord.gg/railway
- Railway Docs: https://docs.railway.app

### Code Issues
- Check browser console (F12)
- Check server logs in Railway
- Review error messages

### API Issues
- Verify API keys are correct
- Check API provider status pages
- Review rate limits

---

## 🎉 Success!

If you see the MintChat dashboard and can chat with your AI agent, you're all set!

**Next Steps:**
1. Add more training materials
2. Customize appearance
3. Test thoroughly
4. Share with users!

---

**Deployment Time:** ~10 minutes
**Difficulty:** Easy
**Cost:** Free tier available

**Happy chatting! 🌿**
