# ⚡ Quick Start Guide - MintChat

## 🎯 What You Have Now

✅ **Full-Stack Application** - Frontend + Backend in one project
✅ **MongoDB Integration** - Ready for Railway
✅ **AI Chat Widget** - Complete with RAG system
✅ **Authentication** - JWT-based user system
✅ **Railway Ready** - One-click deployment

---

## 🚀 Deploy to Railway (5 Minutes)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Initial MintChat setup"
git push origin main
```

### Step 2: Create Railway Project
1. Go to https://railway.app/new
2. Click "Deploy from GitHub repo"
3. Select your repository
4. Wait for initial deployment

### Step 3: Add MongoDB
1. In Railway project, click "+ New"
2. Select "Database" → "MongoDB"
3. Railway auto-connects it to your app

### Step 4: Set Environment Variables
Go to your service → Variables tab and add:

```env
JWT_SECRET=<run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
DEEPSEEK_API_KEY=<get from https://platform.deepseek.com>
NODE_ENV=production
```

### Step 5: Redeploy
- Railway will automatically redeploy
- Get your URL from Settings → Networking → Generate Domain

### Step 6: Test
1. Visit your Railway URL
2. Sign up for an account
3. Go to "Try My Agent" page
4. Test the chat widget!

---

## 💻 Local Development

### Prerequisites
- Node.js 18+
- MongoDB running locally OR MongoDB Atlas account

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create .env file**
   ```bash
   cp .env.example .env
   ```

3. **Edit .env**
   ```env
   MONGODB_URI=mongodb://localhost:27017/mintchat
   JWT_SECRET=any-random-string-for-development
   DEEPSEEK_API_KEY=your-api-key-here
   NODE_ENV=development
   ```

4. **Start MongoDB** (if local)
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Windows
   net start MongoDB
   ```

5. **Run development servers**
   ```bash
   npm run dev
   ```

6. **Open browser**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

---

## 📋 What's Included

### Pages
- ✅ **Dashboard** - Overview & quick actions
- ✅ **Training Materials** - Upload files, links, text
- ✅ **Appearance** - Customize widget look
- ✅ **Conversations** - View chat history
- ✅ **Try My Agent** - Test widget in browser frame
- ✅ **Embed Code** - Get code to add to website
- ✅ **Settings** - User settings (placeholder)

### Features
- ✅ **Chat Widget** - Ask-bar + Modal with animations
- ✅ **RAG System** - Train AI with your content
- ✅ **DeepSeek AI** - Intelligent responses
- ✅ **Source Citations** - Show where answers come from
- ✅ **Typing Indicator** - Real-time feedback
- ✅ **Suggested Questions** - Help users get started
- ✅ **Glow Effect** - Optional RGB border animation
- ✅ **Responsive** - Works on mobile & desktop

### Backend
- ✅ **Express API** - RESTful endpoints
- ✅ **MongoDB** - User data, conversations, training
- ✅ **JWT Auth** - Secure authentication
- ✅ **Rate Limiting** - Prevent abuse
- ✅ **Error Handling** - Graceful failures

---

## 🎨 Using the Widget

### In Appearance Page
1. Customize colors, logo, title
2. Add suggested questions
3. See live preview on right side
4. Click "Save Changes"

### In Try My Agent Page
1. See widget in realistic browser frame
2. Type a message in the ask-bar
3. Modal opens automatically
4. Get AI responses with sources

### Training Your AI
1. Go to "Training Materials"
2. Add files, links, or text
3. Content is automatically indexed
4. AI uses this in responses

---

## 🔧 Common Tasks

### Change Primary Color
1. Go to Appearance
2. Click color preset or enter hex code
3. See preview update instantly
4. Save changes

### Add Training Content
1. Go to Training Materials
2. Click "+ Add File/Link/Text"
3. Fill in details
4. Content trains automatically

### View Conversations
1. Go to Conversations
2. Click conversation in left panel
3. See full message history
4. Delete or rename as needed

### Get Embed Code
1. Go to Embed Code
2. Copy the code snippet
3. Paste before `</body>` in your website
4. Replace `YOUR_BOT_ID` with actual ID

---

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- **Local**: Start MongoDB service
- **Railway**: Ensure MongoDB service is added

### "DeepSeek API error"
- Check API key is valid
- Verify key is active on platform
- Check for typos in environment variable

### "Widget not showing"
- Check browser console for errors
- Verify you're logged in
- Try refreshing the page

### "Build failed on Railway"
- Check Railway build logs
- Verify all dependencies in package.json
- Ensure tsconfig.server.json exists

---

## 📚 Next Steps

1. **Customize Branding**
   - Upload your logo
   - Set brand colors
   - Add custom questions

2. **Train Your AI**
   - Add product documentation
   - Include FAQ content
   - Link to help pages

3. **Test Thoroughly**
   - Try different questions
   - Check source citations
   - Test on mobile

4. **Deploy to Website**
   - Get embed code
   - Add to your site
   - Monitor conversations

---

## 📖 Documentation Files

- `README_DEPLOYMENT.md` - Full deployment guide
- `RAILWAY_SETUP.md` - Detailed Railway instructions
- `ENV_VARIABLES.md` - Environment variables reference
- `.env.example` - Template for local development

---

## 🆘 Need Help?

### Check Logs
- **Railway**: Dashboard → Deployments → View Logs
- **Local**: Terminal where `npm run dev` is running

### Common Issues
- MongoDB connection → Check MONGODB_URI
- API errors → Check DEEPSEEK_API_KEY
- Auth errors → Check JWT_SECRET
- Build errors → Check package.json

---

## ✅ Success Checklist

- [ ] Code pushed to GitHub
- [ ] Railway project created
- [ ] MongoDB added to Railway
- [ ] Environment variables set
- [ ] Deployment successful
- [ ] Can access Railway URL
- [ ] Can sign up/sign in
- [ ] Widget works in Try My Agent
- [ ] Can add training materials
- [ ] AI responds to questions

---

🎉 **You're all set!** Your MintChat platform is ready to use.

For detailed information, see `README_DEPLOYMENT.md`
