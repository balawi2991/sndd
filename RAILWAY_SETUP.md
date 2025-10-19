# 🚂 Railway Deployment Guide for MintChat

## Prerequisites
- Railway account (https://railway.app)
- GitHub repository with this code

## Step 1: Create New Project on Railway

1. Go to https://railway.app/new
2. Click "Deploy from GitHub repo"
3. Select your MintChat repository
4. Railway will automatically detect the configuration

## Step 2: Add MongoDB Database

1. In your Railway project, click "+ New"
2. Select "Database" → "Add MongoDB"
3. Railway will automatically create a MongoDB instance
4. The `MONGODB_URI` and `MONGO_URL` variables will be automatically injected

## Step 3: Configure Environment Variables

Go to your service → Variables tab and add:

### Required Variables:
```
JWT_SECRET=<generate-a-random-32-character-string>
DEEPSEEK_API_KEY=<your-deepseek-api-key>
NODE_ENV=production
```

### Optional Variables:
```
PORT=3000
```

**Note:** `MONGODB_URI` and `MONGO_URL` are automatically provided by Railway's MongoDB service.

## Step 4: Generate JWT Secret

Run this command locally to generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it as `JWT_SECRET` in Railway.

## Step 5: Get DeepSeek API Key

1. Go to https://platform.deepseek.com
2. Sign up / Sign in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste it as `DEEPSEEK_API_KEY` in Railway

## Step 6: Deploy

1. Railway will automatically deploy after you push to GitHub
2. Or click "Deploy" button in Railway dashboard
3. Wait for build to complete (~2-3 minutes)

## Step 7: Access Your App

1. Go to Settings → Networking
2. Click "Generate Domain"
3. Your app will be available at: `https://your-app-name.up.railway.app`

## Automatic Features

✅ **Auto-scaling**: Railway handles scaling automatically
✅ **HTTPS**: Automatic SSL certificates
✅ **Monitoring**: Built-in logs and metrics
✅ **CI/CD**: Auto-deploy on git push
✅ **Database Backups**: MongoDB backups included

## Environment Variables Reference

| Variable | Description | Required | Auto-provided |
|----------|-------------|----------|---------------|
| `MONGODB_URI` | MongoDB connection string | ✅ | ✅ (by Railway) |
| `MONGO_URL` | Alternative MongoDB variable | ✅ | ✅ (by Railway) |
| `JWT_SECRET` | Secret for JWT tokens | ✅ | ❌ (you provide) |
| `DEEPSEEK_API_KEY` | DeepSeek API key | ✅ | ❌ (you provide) |
| `NODE_ENV` | Environment (production) | ✅ | ❌ (you provide) |
| `PORT` | Server port | ❌ | ✅ (Railway sets) |

## Troubleshooting

### Build fails
- Check that all dependencies are in `package.json`
- Verify `tsconfig.server.json` exists
- Check build logs in Railway dashboard

### Database connection fails
- Ensure MongoDB service is running
- Check that `MONGODB_URI` or `MONGO_URL` is set
- Verify network connectivity in Railway

### API errors
- Check `DEEPSEEK_API_KEY` is valid
- Verify `JWT_SECRET` is set
- Check application logs in Railway

## Local Development

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your local MongoDB and API keys

# Run development server
npm run dev
```

## Production Checklist

- [ ] MongoDB service added to Railway
- [ ] `JWT_SECRET` generated and added
- [ ] `DEEPSEEK_API_KEY` obtained and added
- [ ] `NODE_ENV=production` set
- [ ] Domain generated in Railway
- [ ] Test authentication flow
- [ ] Test chat functionality
- [ ] Test training materials upload

## Support

For Railway-specific issues: https://railway.app/help
For MintChat issues: Check application logs in Railway dashboard
