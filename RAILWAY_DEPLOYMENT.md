# AgriScan - Railway Deployment Guide

## 🚀 Quick Deployment Steps

### Step 1: Push to GitHub

1. **Initialize Git (if not already done)**
   ```bash
   git init
   git add .
   git commit -m "Prepare for Railway deployment"
   ```

2. **Create GitHub Repository**
   - Go to [github.com/new](https://github.com/new)
   - Name it: `agriscan`
   - Click "Create repository"

3. **Push Code**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/agriscan.git
   git branch -M main
   git push -u origin main
   ```

---

### Step 2: Deploy on Railway

1. **Sign Up / Login**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub (easiest)

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `agriscan` repository

3. **Railway Auto-Detects Everything**
   - It will find `railway.json` and configure automatically
   - Build will start immediately

---

### Step 3: Add Environment Variables

1. **In Railway Dashboard**
   - Click on your service
   - Go to "Variables" tab
   - Click "+ New Variable"

2. **Add These Variables:**
   ```
   GEMINI_API_KEY=your_actual_gemini_key_here
   NODE_ENV=production
   ```

3. **Save** - Railway will redeploy automatically

---

### Step 4: Add Database (Optional)

If you want to use Railway's PostgreSQL:

1. Click "+ New" in your project
2. Select "Database" → "PostgreSQL"
3. Railway auto-injects `DATABASE_URL` into your app

---

### Step 5: Get Your Live URL

1. Go to "Settings" tab
2. Scroll to "Domains"
3. Click "Generate Domain"
4. Your app will be live at: `agriscan-production.up.railway.app`

---

## ✅ Post-Deployment Checklist

- [ ] App is accessible at Railway URL
- [ ] Test scanning feature
- [ ] Test login/signup
- [ ] Verify AI analysis works
- [ ] Check history page
- [ ] Test chatbot

---

## 🔧 Troubleshooting

**Build Failed?**
- Check Railway logs in "Deployments" tab
- Ensure all dependencies are in `package.json`

**App Crashes?**
- Verify `GEMINI_API_KEY` is set correctly
- Check "Logs" tab for error messages

**Database Issues?**
- Make sure `DATABASE_URL` is set (if using PostgreSQL)
- Run `npm run db:push` locally first to test schema

---

## 📊 Monitoring

Railway provides:
- Real-time logs
- Metrics (CPU, Memory, Network)
- Deployment history
- Automatic HTTPS

---

## 💰 Pricing

- **Free Trial**: $5 credit (lasts ~1 month for your app)
- **Hobby Plan**: $5/month (includes database)
- **Pro Plan**: $20/month (for production apps)

---

## 🎉 You're Live!

Once deployed, share your link:
`https://agriscan-production.up.railway.app`

Users can now scan produce from anywhere! 🥝🍎
