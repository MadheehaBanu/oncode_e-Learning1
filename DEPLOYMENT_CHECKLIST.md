# Deployment Checklist for Vercel

## Pre-Deployment Steps

### 1. Backend Deployment (Deploy First)

#### A. Prepare Firebase
- [ ] Go to [Firebase Console](https://console.firebase.google.com)
- [ ] Select your project: `oncode-d4d30`
- [ ] Go to Project Settings > Service Accounts
- [ ] Click "Generate New Private Key"
- [ ] Save as `serviceAccountKey.json` in backend folder
- [ ] **IMPORTANT**: Add `serviceAccountKey.json` to `.gitignore`

#### B. Deploy Backend to Vercel
```bash
cd backend
vercel
```

Follow prompts:
- Set up and deploy? **Yes**
- Which scope? **Your account**
- Link to existing project? **No**
- Project name? **oncode-backend** (or your choice)
- Directory? **./backend**
- Override settings? **No**

#### C. Add Environment Variables in Vercel Dashboard
Go to your backend project settings and add:
```
JWT_SECRET=oncode_super_secure_jwt_secret_key_for_production_2024
JWT_EXPIRE=7d
SESSION_SECRET=oncode_super_secure_session_secret_key_for_production_2024
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app
```

**Note**: Copy your backend URL (e.g., `https://oncode-backend.vercel.app`)

---

### 2. Frontend Deployment

#### A. Update Environment Variables
Edit `frontend/.env.production`:
```env
REACT_APP_API_URL=https://your-backend-url.vercel.app/api
GENERATE_SOURCEMAP=false
REACT_APP_FIREBASE_API_KEY=your_actual_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=oncode-d4d30.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=oncode-d4d30
REACT_APP_FIREBASE_STORAGE_BUCKET=oncode-d4d30.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id
REACT_APP_FIREBASE_APP_ID=your_actual_app_id
```

#### B. Update Backend CORS
Edit `backend/index.js` line with `your-frontend-domain.vercel.app`:
```javascript
'https://your-actual-frontend-url.vercel.app'
```

Redeploy backend:
```bash
cd backend
vercel --prod
```

#### C. Deploy Frontend
```bash
cd frontend
vercel
```

Follow prompts:
- Set up and deploy? **Yes**
- Which scope? **Your account**
- Link to existing project? **No**
- Project name? **oncode-frontend** (or your choice)
- Directory? **./frontend**
- Override settings? **No**

---

## Post-Deployment Steps

### 3. Update Backend with Frontend URL
- [ ] Copy your frontend URL from Vercel
- [ ] Go to backend Vercel project settings
- [ ] Update `FRONTEND_URL` environment variable
- [ ] Redeploy backend

### 4. Initialize Database
Run this once after deployment:
```bash
# From your local machine
cd backend
node scripts/initDatabase.js
```

### 5. Test the Application
- [ ] Visit your frontend URL
- [ ] Test login with: `madheehabanum67@gmail.com` / `madhee67`
- [ ] Test registration
- [ ] Test course browsing
- [ ] Test admin dashboard
- [ ] Test certificate verification

---

## Common Issues & Solutions

### Issue: "Network Error" or CORS Error
**Solution**: 
1. Check FRONTEND_URL in backend environment variables
2. Verify CORS configuration in `backend/index.js`
3. Ensure both URLs are HTTPS

### Issue: "Firebase not initialized"
**Solution**:
1. Verify `serviceAccountKey.json` is uploaded to Vercel
2. Check Firebase project settings
3. Ensure Firestore is enabled

### Issue: "Authentication Failed"
**Solution**:
1. Check JWT_SECRET is set in backend
2. Verify token is being sent from frontend
3. Check browser console for errors

### Issue: Build Fails
**Solution**:
1. Run `npm run build` locally first
2. Fix any TypeScript/ESLint errors
3. Check all dependencies are in package.json

---

## Quick Deploy Commands

### Deploy Both (After Initial Setup)
```bash
# Backend
cd backend && vercel --prod

# Frontend  
cd ../frontend && vercel --prod
```

### Rollback
```bash
vercel rollback
```

---

## Security Checklist
- [ ] All API keys in environment variables (not in code)
- [ ] `serviceAccountKey.json` in `.gitignore`
- [ ] `.env` files in `.gitignore`
- [ ] HTTPS enabled on both frontend and backend
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] JWT secrets are strong and unique

---

## Monitoring
- [ ] Check Vercel logs for errors
- [ ] Monitor Firebase usage
- [ ] Test all user flows
- [ ] Check mobile responsiveness

---

## Support
If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console
3. Check Firebase console
4. Review this checklist

**Your URLs**:
- Backend: `https://_____.vercel.app`
- Frontend: `https://_____.vercel.app`
