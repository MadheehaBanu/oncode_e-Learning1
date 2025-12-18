# Deployment Guide

## Current Issue
Frontend is deployed but backend is not, causing API calls to fail.

## Solution Options

### Option 1: Deploy Backend to Vercel (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository again
4. Configure:
   - **Root Directory**: `backend`
   - **Framework Preset**: Other
5. Add Environment Variables:
   ```
   PORT=5000
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=7d
   SESSION_SECRET=your_session_secret
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```
6. Upload `serviceAccountKey.json` content as environment variable:
   - Name: `FIREBASE_SERVICE_ACCOUNT`
   - Value: (paste entire JSON content)
7. Deploy

### Option 2: Deploy Backend to Render/Railway

1. Create account on [Render.com](https://render.com) or [Railway.app](https://railway.app)
2. Create new Web Service
3. Connect GitHub repository
4. Set root directory to `backend`
5. Build command: `npm install`
6. Start command: `npm start`
7. Add environment variables (same as above)

### Option 3: Use Firebase Only (No Backend Server)

Modify frontend to use Firebase directly for all operations.

## Update Frontend After Backend Deployment

Once backend is deployed, update Vercel environment variable:

1. Go to your frontend project in Vercel
2. Settings → Environment Variables
3. Add/Update:
   ```
   REACT_APP_API_URL=https://your-backend-url.vercel.app/api
   ```
4. Redeploy frontend

## Quick Test

After deployment, test:
- Frontend URL: https://your-app.vercel.app
- Backend URL: https://your-backend.vercel.app/api/health
