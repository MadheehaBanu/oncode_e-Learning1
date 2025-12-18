# 🚀 Quick Deploy Guide

## Step-by-Step Deployment (5 Minutes)

### Prerequisites
- [ ] GitHub account
- [ ] Vercel account (sign up at vercel.com with GitHub)
- [ ] Firebase project created

---

## 1️⃣ Prepare Your Code (2 minutes)

### A. Test Everything Works Locally
```bash
npm run test:deploy
```

If all tests pass, continue. If not, fix the issues first.

### B. Update Frontend Production URL
Edit `frontend/.env.production`:
```env
REACT_APP_API_URL=https://your-backend-url.vercel.app/api
```
(You'll update this after deploying backend)

---

## 2️⃣ Push to GitHub (1 minute)

```bash
# Make sure sensitive files are ignored
git status

# Add all files
git add .

# Commit
git commit -m "Ready for Vercel deployment"

# Push
git push origin main
```

---

## 3️⃣ Deploy Backend (1 minute)

### Option A: Via Vercel Dashboard (Easiest)
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Select `backend` folder as root directory
4. Add environment variables:
   - `JWT_SECRET`: `oncode_super_secure_jwt_secret_key_for_production_2024`
   - `JWT_EXPIRE`: `7d`
   - `SESSION_SECRET`: `oncode_super_secure_session_secret_key_for_production_2024`
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: (leave empty for now)
5. Click "Deploy"
6. **Copy your backend URL** (e.g., `https://oncode-backend.vercel.app`)

### Option B: Via CLI
```bash
cd backend
vercel
# Follow prompts
```

---

## 4️⃣ Deploy Frontend (1 minute)

### Update Backend URL
1. Edit `frontend/.env.production`
2. Replace `REACT_APP_API_URL` with your backend URL + `/api`
3. Commit and push:
```bash
git add frontend/.env.production
git commit -m "Update backend URL"
git push
```

### Deploy via Vercel Dashboard
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository again
3. Select `frontend` folder as root directory
4. Click "Deploy"
5. **Copy your frontend URL** (e.g., `https://oncode-frontend.vercel.app`)

---

## 5️⃣ Final Configuration (30 seconds)

### Update Backend CORS
1. Go to your backend Vercel project
2. Go to Settings > Environment Variables
3. Add `FRONTEND_URL`: `https://your-frontend-url.vercel.app`
4. Redeploy backend (click "Redeploy" in Deployments tab)

### Update Backend Code
Edit `backend/index.js` line 40:
```javascript
'https://your-actual-frontend-url.vercel.app'
```

Commit and push:
```bash
git add backend/index.js
git commit -m "Update CORS for production"
git push
```

---

## ✅ Test Your Deployment

Visit your frontend URL and test:
- [ ] Homepage loads
- [ ] Login works (madheehabanum67@gmail.com / madhee67)
- [ ] Courses display
- [ ] Admin dashboard accessible
- [ ] No console errors

---

## 🎉 You're Live!

Your URLs:
- **Frontend**: https://your-frontend.vercel.app
- **Backend**: https://your-backend.vercel.app

---

## 🔧 Troubleshooting

### "Network Error" or CORS Error
1. Check `FRONTEND_URL` in backend environment variables
2. Verify both URLs are HTTPS
3. Check browser console for exact error

### "Firebase Error"
1. Make sure Firebase project is created
2. Check Firestore is enabled
3. Verify environment variables

### Build Fails
1. Run `npm run build:test` locally
2. Fix any errors
3. Push and redeploy

---

## 📱 Share Your Project

Update your GitHub README with:
```markdown
## Live Demo
- Frontend: https://your-frontend.vercel.app
- Backend API: https://your-backend.vercel.app

## Test Credentials
- Admin: madheehabanum67@gmail.com / madhee67
- Student: student@oncode.com / student123
```

---

## 🔄 Future Updates

To update your deployed app:
```bash
# Make changes
git add .
git commit -m "Your update message"
git push

# Vercel will auto-deploy!
```

---

## Need Help?

Check these files:
- `DEPLOYMENT_CHECKLIST.md` - Detailed guide
- `PRE_PUSH_CHECKLIST.md` - Before pushing to GitHub
- `README.md` - Project documentation

**Congratulations! Your e-learning platform is now live! 🎓**
