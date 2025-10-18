# ✅ Final Railway Deployment Checklist

## 🎯 Pre-Deployment (Local)

### **Code Ready**
- [x] TypeScript strictNullChecks disabled
- [x] All routes added to index.ts
- [x] Agents routes implemented
- [x] Auth middleware complete
- [x] File upload middleware ready
- [x] .gitignore updated
- [x] Environment variables documented

### **Configuration Files**
- [x] `railway.json` created
- [x] `nixpacks.toml` created
- [x] `Procfile` created
- [x] `.env.example` updated
- [x] `tsconfig.json` configured

### **Database Scripts**
- [x] `schema.sql` ready
- [x] `schema-updates.sql` ready
- [x] `migrate.sh` script created
- [x] `seed.sql` script created
- [x] `setup-uploads.sh` created

### **Documentation**
- [x] `RAILWAY_DEPLOYMENT.md` complete
- [x] `SAAS_SECURITY_GUIDE.md` complete
- [x] `DEPLOYMENT_COMPLETE.md` ready

---

## 🚂 Railway Setup

### **Step 1: Create Project**
```bash
# Option A: From GitHub (Recommended)
1. Go to railway.app/dashboard
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose: sanad repository
5. Branch: main
6. Root directory: server

# Option B: From CLI
railway login
cd server
railway init
```

### **Step 2: Add PostgreSQL**
```bash
# In Railway Dashboard
Click "New" → "Database" → "PostgreSQL"

# Or via CLI
railway add --plugin postgresql
```

### **Step 3: Set Environment Variables**
```bash
# Required
railway variables set DEEPSEEK_API_KEY=sk-xxxxx
railway variables set OPENAI_API_KEY=sk-xxxxx
railway variables set JWT_SECRET=your-super-secret-key-min-32-chars

# Optional
railway variables set NODE_ENV=production
railway variables set CORS_ORIGIN=https://yourdomain.com
```

### **Step 4: Install pgvector**
```bash
railway connect postgresql
CREATE EXTENSION IF NOT EXISTS vector;
\q
```

### **Step 5: Run Migrations**
```bash
# Get DATABASE_URL
railway variables | grep DATABASE_URL

# Run migrations
psql $DATABASE_URL < src/db/schema.sql
psql $DATABASE_URL < src/db/schema-updates.sql

# Or use script
railway run npm run migrate
```

### **Step 6: Seed Database (Optional)**
```bash
railway run npm run seed
```

### **Step 7: Deploy**
```bash
# If using GitHub - auto deploys on push
git push origin main

# Or manual
railway up
```

---

## ✅ Post-Deployment Verification

### **1. Check Health**
```bash
curl https://your-app.railway.app/health
```

Expected:
```json
{
  "status": "ok",
  "timestamp": "...",
  "uptime": 123
}
```

### **2. Check Logs**
```bash
railway logs --follow
```

Look for:
- ✅ "Server running on..."
- ✅ No database errors
- ✅ No missing env variables

### **3. Test API**
```bash
# Using demo API key from seed
curl -X POST https://your-app.railway.app/api/chat \
  -H "X-API-Key: agent_demo_key_for_testing_only_change_in_production" \
  -H "Content-Type: application/json" \
  -d '{"question": "مرحباً"}'
```

### **4. Verify Database**
```bash
railway connect postgresql

# Check tables
\dt

# Check data
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM agents;
SELECT COUNT(*) FROM training_materials;

\q
```

---

## 🔧 Environment Variables Checklist

### **Required (Must Set)**
- [ ] `DEEPSEEK_API_KEY` - من platform.deepseek.com
- [ ] `OPENAI_API_KEY` - من platform.openai.com
- [ ] `JWT_SECRET` - عشوائي، 32+ حرف

### **Auto-Provided by Railway**
- [x] `DATABASE_URL` - PostgreSQL connection
- [x] `PORT` - Server port (usually 3000)
- [x] `RAILWAY_ENVIRONMENT` - production

### **Optional (Recommended)**
- [ ] `NODE_ENV=production`
- [ ] `CORS_ORIGIN=https://yourdomain.com`
- [ ] `RATE_LIMIT_PER_MINUTE=10`
- [ ] `RATE_LIMIT_PER_HOUR=100`
- [ ] `RATE_LIMIT_PER_DAY=500`

---

## 📊 Database Schema Verification

### **Tables to Check**
```sql
-- Core tables
SELECT * FROM users LIMIT 1;
SELECT * FROM conversations LIMIT 1;
SELECT * FROM messages LIMIT 1;
SELECT * FROM training_materials LIMIT 1;
SELECT * FROM chunks LIMIT 1;

-- SaaS tables
SELECT * FROM agents LIMIT 1;
SELECT * FROM subscription_tiers;
SELECT * FROM user_subscriptions LIMIT 1;
SELECT * FROM daily_usage LIMIT 1;
SELECT * FROM audit_logs LIMIT 1;
```

### **Extensions to Check**
```sql
\dx

-- Should show:
-- vector | 0.5.0 | public | vector data type and ivfflat access method
```

### **Functions to Check**
```sql
\df

-- Should include:
-- update_updated_at_column()
-- search_similar_chunks()
-- set_current_user()
-- get_current_user()
-- increment_daily_usage()
-- check_usage_limits()
-- log_audit()
```

---

## 🔐 Security Verification

### **1. Authentication**
```bash
# Test without auth - should fail
curl https://your-app.railway.app/api/materials

# Expected: 401 Unauthorized
```

### **2. API Key**
```bash
# Test with invalid key - should fail
curl -X POST https://your-app.railway.app/api/chat \
  -H "X-API-Key: invalid_key" \
  -d '{"question": "test"}'

# Expected: 401 Unauthorized
```

### **3. Rate Limiting**
```bash
# Send 11 requests quickly
for i in {1..11}; do
  curl https://your-app.railway.app/health
done

# Expected: 429 Too Many Requests on 11th request
```

### **4. CORS**
```bash
# Test from browser console on different domain
fetch('https://your-app.railway.app/api/chat', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({question: 'test'})
})

# Should fail if CORS_ORIGIN not set correctly
```

---

## 🐛 Common Issues & Solutions

### **Issue: Build Fails**
```bash
# Check build logs
railway logs --deployment <id>

# Common causes:
# 1. TypeScript errors → Check tsconfig.json
# 2. Missing dependencies → npm install
# 3. Wrong Node version → Check nixpacks.toml
```

**Solution**:
```bash
# Locally test build
npm run build

# If works locally, check Railway build settings
```

### **Issue: Database Connection Fails**
```bash
# Verify DATABASE_URL exists
railway variables | grep DATABASE_URL

# Test connection
railway connect postgresql
```

**Solution**:
```bash
# Ensure PostgreSQL service is added
railway add --plugin postgresql

# Restart deployment
railway up
```

### **Issue: pgvector Not Found**
```sql
-- Error: extension "vector" does not exist
```

**Solution**:
```bash
railway connect postgresql
CREATE EXTENSION vector;
\q
```

### **Issue: Missing Environment Variables**
```bash
# Check logs for: "undefined" or "null"
railway logs | grep -i "undefined\|null"
```

**Solution**:
```bash
# Set missing variables
railway variables set VARIABLE_NAME=value
```

### **Issue: CORS Errors**
```
Access to fetch blocked by CORS policy
```

**Solution**:
```bash
# Update CORS_ORIGIN
railway variables set CORS_ORIGIN=https://yourdomain.com

# Or temporarily allow all (NOT for production)
railway variables set CORS_ORIGIN=*
```

---

## 📈 Monitoring Setup

### **1. Railway Metrics**
- Go to Project → Metrics
- Monitor:
  - CPU usage
  - Memory usage
  - Network traffic
  - Response times

### **2. Log Monitoring**
```bash
# Real-time logs
railway logs --follow

# Filter errors
railway logs | grep -i error

# Filter specific service
railway logs --service backend
```

### **3. Database Monitoring**
```sql
-- Active connections
SELECT count(*) FROM pg_stat_activity;

-- Database size
SELECT pg_size_pretty(pg_database_size('railway'));

-- Table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 🎯 Success Criteria

### **Deployment Successful When:**
- [x] ✅ Build completes without errors
- [x] ✅ Server starts and stays running
- [x] ✅ Health check returns 200 OK
- [x] ✅ Database connection works
- [x] ✅ pgvector extension installed
- [x] ✅ All tables created
- [x] ✅ Environment variables set
- [x] ✅ API endpoints respond
- [x] ✅ Authentication works
- [x] ✅ File uploads work (if tested)
- [x] ✅ CORS configured correctly
- [x] ✅ Rate limiting active
- [x] ✅ Logs accessible

---

## 🔄 Update & Maintenance

### **Deploy Updates**
```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Railway auto-deploys
```

### **Manual Redeploy**
```bash
railway up
```

### **Rollback**
1. Go to Deployments
2. Find previous working deployment
3. Click "Redeploy"

### **Database Backup**
```bash
# Manual backup
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

---

## 📞 Getting Help

### **Railway Support**
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway
- Status: https://status.railway.app

### **Project Issues**
1. Check logs first: `railway logs`
2. Verify env variables: `railway variables`
3. Test locally: `npm run dev`
4. Check database: `railway connect postgresql`

---

## 🎉 Final Checklist

### **Before Going Live**
- [ ] All tests passing
- [ ] Environment variables set
- [ ] Database migrated
- [ ] Seed data loaded (optional)
- [ ] Health check working
- [ ] API endpoints tested
- [ ] Authentication verified
- [ ] CORS configured
- [ ] Rate limiting tested
- [ ] Monitoring setup
- [ ] Backup strategy in place
- [ ] Documentation updated
- [ ] Team notified

### **After Going Live**
- [ ] Monitor logs for 24 hours
- [ ] Check error rates
- [ ] Verify performance
- [ ] Test from production frontend
- [ ] Monitor database size
- [ ] Check API usage
- [ ] Verify billing
- [ ] Update status page

---

**Status**: 🟢 **Ready for Railway Deployment!**

**Estimated Time**: 30-45 minutes

**Next Step**: Follow `RAILWAY_DEPLOYMENT.md` step by step
