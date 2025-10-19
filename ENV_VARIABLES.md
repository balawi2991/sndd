# 🔐 Environment Variables Setup

## For Railway Deployment

Copy these variables to your Railway service → Variables tab:

### 1. JWT_SECRET (Required - You Generate)
```
JWT_SECRET=<paste-generated-secret-here>
```

**Generate it by running:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Example output: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0`

---

### 2. DEEPSEEK_API_KEY (Required - Get from DeepSeek)
```
DEEPSEEK_API_KEY=<your-deepseek-api-key>
```

**Get it from:**
1. Go to https://platform.deepseek.com
2. Sign up / Sign in
3. Navigate to API Keys section
4. Click "Create API Key"
5. Copy the key (starts with `sk-`)

Example: `sk-1234567890abcdef1234567890abcdef`

---

### 3. NODE_ENV (Required - Set Manually)
```
NODE_ENV=production
```

---

### 4. MONGODB_URI (Auto-provided by Railway)
**DO NOT SET THIS MANUALLY**

Railway automatically provides this when you add MongoDB database to your project.

---

### 5. PORT (Auto-provided by Railway)
**DO NOT SET THIS MANUALLY**

Railway automatically sets this variable.

---

## Summary - What You Need to Add

Only add these 3 variables to Railway:

```env
JWT_SECRET=<generate-with-command-above>
DEEPSEEK_API_KEY=<get-from-deepseek-platform>
NODE_ENV=production
```

Everything else is automatic! 🎉

---

## For Local Development

Create a `.env` file in the project root:

```env
# MongoDB (local or cloud)
MONGODB_URI=mongodb://localhost:27017/mintchat

# JWT Secret (generate with command above)
JWT_SECRET=your-generated-secret-here

# DeepSeek API Key
DEEPSEEK_API_KEY=your-deepseek-api-key-here

# Environment
NODE_ENV=development

# Port (optional, defaults to 3000)
PORT=3000
```

---

## Verification Checklist

After setting variables in Railway:

- [ ] JWT_SECRET is at least 32 characters
- [ ] DEEPSEEK_API_KEY starts with `sk-`
- [ ] NODE_ENV is set to `production`
- [ ] MongoDB service is added to Railway project
- [ ] Deployment succeeded without errors
- [ ] Can access the app via Railway domain

---

## Troubleshooting

### "MongoDB connection failed"
- Ensure MongoDB service is added to Railway project
- Check that MONGODB_URI is automatically set
- Verify MongoDB service is running

### "DeepSeek API authentication failed"
- Verify DEEPSEEK_API_KEY is correct
- Check API key is active on DeepSeek platform
- Ensure no extra spaces in the key

### "Invalid or expired token"
- Verify JWT_SECRET is set
- Clear browser localStorage and try again
- Check JWT_SECRET is the same across deployments

---

## Security Notes

⚠️ **NEVER commit .env files to git**
⚠️ **NEVER share your API keys publicly**
⚠️ **Rotate keys if accidentally exposed**

✅ `.env` is already in `.gitignore`
✅ Use Railway's secure variable storage
✅ Generate new JWT_SECRET for each environment
